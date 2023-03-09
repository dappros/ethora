import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import xmpp from "../../xmpp";
import {
  TActiveRoomFilter,
  TMessageHistory,
  TUserChatRooms,
  useStoreState,
} from "../../store";
import { getPublicProfile, uploadFile } from "../../http";
import { TProfile } from "../Profile/types";
import { format, formatDistance, subDays } from "date-fns";
import * as DOMPurify from "dompurify";

import {
  MainContainer,
  Avatar,
  ChatContainer,
  MessageList,
  MessageInput,
  Conversation,
  ConversationList,
  Sidebar,
  Search,
  ConversationHeader,
  TypingIndicator,
  MessageModel,
} from "@chatscope/chat-ui-kit-react";
import { Message } from "../../components/Chat/Messages/Message";
import { SystemMessage } from "../../components/Chat/Messages/SystemMessage";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
  Box,
  Slide,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import { useParams, useHistory } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { MetaNavigation } from "../../components/MetaNavigation/MetaNavigation";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { QrModal } from "../Profile/QrModal";
import { CONFERENCEDOMAIN } from "../../constants";
import { appName, ROOMS_FILTERS } from "../../config/config";
import ThreadContainer from "../../components/Chat/Threads/ThreadContainer";
import { ChatTransferDialog } from "../../components/Chat/ChatTransferDialog";
import { ChatMediaModal } from "../../components/Chat/ChatMediaModal";
import { ChatAudioMessageDialog } from "../../components/Chat/ChatAudioRecorder";
import { generateChatLink, getPosition, stripHtml } from "../../utils";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { DeleteDialog } from "../../components/DeleteDialog";
import { useSnackbar } from "../../context/SnackbarContext";
import {Helmet} from 'react-helmet'
import { createMainMessageForThread } from "../../utils/createMessage";

export type IMessagePosition = {
  position: MessageModel["position"];
  type: string;
  separator?: string;
};

export interface IButtons {
  name: string;
  notDisplayedValue: string;
  value: string;
}

const NO_ROOM_PICKED = "none" + CONFERENCEDOMAIN;
const filterChatRooms = (
  rooms: TUserChatRooms[],
  filter: TActiveRoomFilter
) => {
  if (filter === ROOMS_FILTERS.official || filter === ROOMS_FILTERS.favourite) {
    return rooms.filter(
      (item) =>
        item.group === ROOMS_FILTERS.official ||
        item.group === ROOMS_FILTERS.favourite
    );
  }

  return rooms.filter(
    (item) =>
      item.group !== ROOMS_FILTERS.official &&
      item.group !== ROOMS_FILTERS.favourite
  );
};

export function ChatInRoom() {
  const messages = useStoreState((state) => state.historyMessages);
  const user = useStoreState((store) => store.user);
  const userChatRooms = useStoreState((store) => store.userChatRooms);
  const currentThreadViewMessage = useStoreState(
    (store) => store.currentThreadViewMessage
  );
  const setCurrentThreadViewMessage = useStoreState(
    (store) => store.setCurrentThreadViewMessage
  );
  const loaderArchive = useStoreState((store) => store.loaderArchive);
  const currentUntrackedChatRoom = useStoreState(
    (store) => store.currentUntrackedChatRoom
  );
  const { roomJID } = useParams<{ roomJID: string }>();

  const [profile, setProfile] = useState<TProfile>();
  const [myMessage, setMyMessage] = useState("");

  const [showMetaNavigation, setShowMetaNavigation] = useState(true);
  const [isThreadView, setThreadView] = useState(false);
  const [showInChannel, setShowInChannel] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentEditMessage, setCurrentEditMessage] =
    React.useState<TMessageHistory>();
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const [currentDeleteMessage, setCurrentDeleteMessage] =
    React.useState<TMessageHistory>();

  const handleSetThreadView = (value: boolean) => setThreadView(value);
  const handleSetCurrentThreadViewMessage = (threadMessage: TMessageHistory) =>
    setCurrentThreadViewMessage(threadMessage);
  const handleShowInChannel = (event: React.ChangeEvent<HTMLInputElement>) =>
    setShowInChannel(event.target.checked);

  const handleCurrentEditMessage = (message: TMessageHistory) =>
    setCurrentEditMessage(message);

  const handleSetCurrentDeleteMessage = (message: TMessageHistory) =>
    setCurrentDeleteMessage(message);

  const handleCloseDeleteMessageDialog = () => {
    setShowDeleteDialog(false);
    setCurrentDeleteMessage(null);
  };

  const [currentRoom, setCurrentRoom] = useState("");
  const currentPickedRoom = useMemo(() => {
    return userChatRooms.find((item) => item.jid === currentRoom);
  }, [userChatRooms, currentRoom]);
console.log(currentPickedRoom)
  const mainWindowMessages = messages.filter(
    (item: TMessageHistory) =>
      item.data.roomJid === roomJID + CONFERENCEDOMAIN &&
      (item.data.showInChannel || !item.data.isReply)
  );

  const [roomData, setRoomData] = useState<{
    jid: string;
    name: string;
    room_background: string;
    room_thumbnail: string;
    users_cnt: string;
  }>({
    jid: "",
    name: "",
    room_background: "",
    room_thumbnail: "",
    users_cnt: "",
  });


  const [transferDialogData, setTransferDialogData] = useState<{
    open: boolean;
    message: TMessageHistory | null;
  }>({ open: false, message: null });

  const [mediaDialogData, setMediaDialogData] = useState<{
    open: boolean;
    message: TMessageHistory | null;
  }>({ open: false, message: null });

  const [isQrModalVisible, setQrModalVisible] = useState(false);

  const [isFileUploading, setFileUploading] = useState(false);

  const [firstLoadMessages, setFirstLoadMessages] = useState(true);
  const activeRoomFilter = useStoreState((state) => state.activeRoomFilter);
  const setActiveRoomFilter = useStoreState(
    (state) => state.setActiveRoomFilter
  );
  const openLastMetaRoom = activeRoomFilter === ROOMS_FILTERS.meta;
  const closeQrModal = () => {
    setQrModalVisible(false);
  };
  const history = useHistory();
  const fileRef = useRef(null);
  const { showSnackbar } = useSnackbar();
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      sendFile(acceptedFiles[0], false);
    },
    [roomData]
  );
  const { getRootProps } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 1,
  });
  const onYReachStart = () => {
    const filteredMessages = messages.filter(
      (item: TMessageHistory) => item.roomJID === currentRoom
    );

    if (loaderArchive) {
      return;
    } else {
      const lastMessageID = filteredMessages[0].id;
      xmpp.getPaginatedArchive(currentRoom, String(lastMessageID), 10);
    }
  };

  useEffect(() => {
    if (roomJID) {
      loadMessages(roomJID);
      setShowMetaNavigation(true);
    }
  }, [roomJID]);

  useEffect(() => {
    getPublicProfile(user.walletAddress).then((result) => {
      setProfile(result.data.result);
    });
  }, []);

  const toggleTransferDialog = (
    value: boolean,
    message: TMessageHistory = null
  ) => {
    setTransferDialogData({ open: value, message });
  };
  const toggleMediaModal = (
    value: boolean,
    message: TMessageHistory = null
  ) => {
    setMediaDialogData({ open: value, message });
  };

  const chooseRoom = (jid: string) => {
    history.push("/chat/" + jid.split("@")[0]);
    loadMessages(jid);
  };
  const loadMessages = (jid: string) => {
    setCurrentRoom(jid);
    const currentRoomData = userChatRooms.filter((e) => e.jid === jid)[0];
    setRoomData(currentRoomData);
    useStoreState.getState().clearCounterChatRoom(jid);
    useStoreState.getState().setCurrentUntrackedChatRoom(jid);

    const filteredMessages = messages.filter(
      (item: TMessageHistory) => item.roomJID === jid
    );
    setFirstLoadMessages(true);

    if (
      !loaderArchive &&
      filteredMessages.length <= 10 &&
      filteredMessages.length > 0
    ) {
      const lastMessageID = filteredMessages[0].id;
      xmpp.getPaginatedArchive(jid, String(lastMessageID), 50);
    }
  };

  const getConversationInfo = (roomJID: string) => {
    const messagesInRoom = messages
      .filter((item: TMessageHistory) => item.roomJID === roomJID)
      .slice(-1);
    if (loaderArchive && messagesInRoom.length <= 0) {
      return "Loading...";
    }

    if (messagesInRoom.length > 0) {
      return messagesInRoom[0].body;
    }
    return "No messages yet";
  };

  const getLastActiveTime = (roomJID: string) => {
    const messagesInRoom = messages
      .filter((item: TMessageHistory) => item.roomJID === roomJID)
      .slice(-1);
    if (messagesInRoom.length <= 0) {
      return "";
    }

    return format(new Date(messagesInRoom[0].date), "H:mm");
  };

  const sendMessage = (button: any) => {
    if (myMessage.trim().length > 0) {
      let userAvatar = "";
      if (profile?.profileImage) {
        userAvatar = profile?.profileImage;
      }
      const clearMessageFromHtml = DOMPurify.sanitize(myMessage);
      const finalMessageTxt = stripHtml(clearMessageFromHtml);

      if (finalMessageTxt.trim().length > 0) {
        if (isEditing) {
          const data = {
            senderFirstName: user.firstName,
            senderLastName: user.lastName,
            senderWalletAddress: user.walletAddress,
            isSystemMessage: false,
            tokenAmount: 0,
            receiverMessageId: currentEditMessage.data.receiverMessageId,
            mucname: roomData.name,
            photoURL: userAvatar,
            roomJid: roomJID,
            isReply: false,
            mainMessage: undefined,
            push: true,
          };
          xmpp.sendReplaceMessageStanza(
            currentUntrackedChatRoom,
            finalMessageTxt,
            currentEditMessage.id.toString(),
            data
          );
          setIsEditing(false);
        } else {
          xmpp.sendMessage(
            currentRoom,
            user.firstName,
            user.lastName,
            userAvatar,
            user.walletAddress,
            typeof button === "object" ? button.value : finalMessageTxt,
            typeof button === "object" ? button.notDisplayedValue : null
          );
        }
      }
    }
  };
  const sendFile = async (file: File, isReply: boolean) => {
    const formData = new FormData();
    formData.append("files", file);
    setFileUploading(true);
    try {
      const result = await uploadFile(formData);
      let userAvatar = "";
      if (profile?.profileImage) {
        userAvatar = profile?.profileImage;
      }

      result.data.results.map(async (item: any) => {
        let data = {
          firstName: user.firstName,
          lastName: user.lastName,
          walletAddress: user.walletAddress,
          chatName: roomData.name,
          userAvatar: userAvatar,
          createdAt: item.createdAt,
          expiresAt: item.expiresAt,
          fileName: item.filename,
          isVisible: item.isVisible,
          location: item.location,
          locationPreview: item.locationPreview,
          mimetype: item.mimetype,
          originalName: item.originalname,
          ownerKey: item.ownerKey,
          size: item.size,
          duration: item?.duration,
          updatedAt: item.updatedAt,
          userId: item.userId,
          waveForm: "",
          attachmentId: item._id,
          wrappable: true,
          roomJid: currentRoom
        };

        const additionalDataForThread = {
          isReply: isReply,
          mainMessage: isReply
            ? createMainMessageForThread(currentThreadViewMessage)
            : undefined,
          showInChannel: showInChannel,
        };
        xmpp.sendMediaMessageStanza(currentRoom, {
          ...data,
          ...additionalDataForThread,
        });
      });
    } catch (error) {
      showSnackbar("error", "Cannot upload file");
    }

    if (fileRef.current) {
      fileRef.current.value = "";
    }
    setFileUploading(false);
  };

  const setMessage = (value) => {
    setMyMessage(value);
    xmpp.isComposing(
      user.walletAddress,
      roomData.jid,
      user.firstName + " " + user.lastName
    );
  };

  const handlePaste = (event: any) => {
    let item = Array.from(event.clipboardData.items).find((x: any) =>
      /^image\//.test(x.type)
    );
    if (item) {
      // @ts-ignore
      let blob = item.getAsFile();
      sendFile(blob, false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      xmpp.pausedComposing(user.walletAddress, roomData.jid);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [myMessage]);

  const onBlur = () => {
    useStoreState.getState().setCurrentUntrackedChatRoom("");
  };
  const onFocus = () => {
    if (currentRoom) {
      useStoreState.getState().setCurrentUntrackedChatRoom(currentRoom);
      useStoreState.getState().clearCounterChatRoom(currentRoom);
    }
  };

  useEffect(() => {
    if (currentUntrackedChatRoom) {
      if (
        !roomJID ||
        roomJID === "none" ||
        roomJID === "" ||
        currentUntrackedChatRoom.split("@")[0] === roomJID
      ) {
        if (currentUntrackedChatRoom.split("@")[1]) {
          chooseRoom(currentUntrackedChatRoom);
        } else {
          chooseRoom(currentUntrackedChatRoom + CONFERENCEDOMAIN);
        }
      }
    }

    if (
      currentUntrackedChatRoom.split("@")[0] !== roomJID &&
      roomJID !== "none" &&
      roomJID !== ""
    ) {
      useStoreState.getState().setCurrentUntrackedChatRoom(roomJID);
      chooseRoom(roomJID);
    }

    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, [currentRoom]);

  useEffect(() => {
    const filteredMessages = messages.filter(
      (item: TMessageHistory) => item.roomJID === currentRoom
    );
    if (
      !loaderArchive &&
      filteredMessages.length > 0 &&
      filteredMessages.length <= 51 &&
      currentRoom &&
      firstLoadMessages
    ) {
      const lastUpFilteredMessage = filteredMessages[0];

      if (
        filteredMessages.length >= 10 &&
        filteredMessages.length < 15 &&
        lastUpFilteredMessage.data.isSystemMessage
      ) {
        setFirstLoadMessages(false);
        xmpp.getPaginatedArchive(
          currentRoom,
          String(lastUpFilteredMessage.id),
          5
        );
      } else if (filteredMessages.length === 1) {
        setFirstLoadMessages(false);
        xmpp.getPaginatedArchive(
          currentRoom,
          String(lastUpFilteredMessage.id),
          50
        );
      }
    }
    if (
      filteredMessages.length === 0 &&
      firstLoadMessages &&
      xmpp.client.status === "online"
    ) {
      xmpp.getRoomArchiveStanza(currentRoom, 50);
    }
  }, [messages]);

  const handleChatDetailClick = () => {
    history.push("/chatDetails/" + currentUntrackedChatRoom);
  };

  const onMenuThreadClick = () => {
    setThreadView(true);
    handleSetCurrentThreadViewMessage(transferDialogData.message);
  };

  const onMenuEditClick = (value: boolean, message: TMessageHistory) => {
    setIsEditing(value);
    handleCurrentEditMessage(message);
  };

  const onMessageThreadClick = (message: TMessageHistory) => {
    setThreadView(true);
    handleSetCurrentThreadViewMessage(message);
  };

  //set the message to be deleted and show delete confirmation dialogue
  const onMessageDeleteClick = (value: boolean, message: TMessageHistory) => {
    setShowDeleteDialog(value);
    handleSetCurrentDeleteMessage(message);
  };

  //triggered when user clicks Delete button on delete confirmation dialogue
  const deleteMessage = () => {
    //remove the message from store
    useStoreState.getState().deleteMessage(currentDeleteMessage.id);

    //send delete request to xmpp server
    xmpp.deleteMessageStanza(
      currentUntrackedChatRoom,
      currentDeleteMessage.id.toString()
    );

    handleCloseDeleteMessageDialog();
  };

  //Delete confirmation dialogue component

  //component to render File upload dialog box

  return (
    <Box style={{ paddingBlock: "20px", height: "100%" }}>
      {!!currentPickedRoom && (
        <Helmet>
          <title>{appName + ': ' + currentPickedRoom.name}</title>
          <meta
            property="og:title"
            content={currentPickedRoom.name}
          />
          <meta name="description" content={currentPickedRoom.description} />
        </Helmet>
      )}
      <MainContainer responsive>
        <Sidebar position="left" scrollable={false}>
          <Search placeholder="Search..." />
          <ConversationList loading={loaderArchive}>
            {filterChatRooms(userChatRooms, activeRoomFilter).map((room) => (
              <Conversation
                active={room.jid === currentRoom}
                key={room.jid}
                unreadCnt={room.unreadMessages}
                onClick={() => {
                  chooseRoom(room.jid);
                  setThreadView(false);
                }}
                name={room.name}
                info={getConversationInfo(room.jid)}
                lastActivityTime={getLastActiveTime(room.jid)}
              >
                <Avatar
                  src={
                    room.room_thumbnail !== "none"
                      ? room.room_thumbnail
                      : "https://icotar.com/initials/" + room.name
                  }
                />
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>

        <div
          {...getRootProps()}
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            display: "flex",
          }}
        >
          <ChatContainer>
            {!!roomData && (
              <ConversationHeader
                style={{
                  height: "70px",
                }}
              >
                <ConversationHeader.Back />
                {mainWindowMessages.length > 0 && (
                  <ConversationHeader.Content
                    userName={roomData.name}
                    onClick={handleChatDetailClick}
                    info={
                      messages.filter(
                        (item: TMessageHistory) => item.roomJID === currentRoom
                      ).length > 0 &&
                      "Active " +
                        formatDistance(
                          subDays(
                            new Date(mainWindowMessages.slice(-1)[0].date),
                            0
                          ),
                          new Date(),
                          { addSuffix: true }
                        )
                    }
                  />
                )}
                <ConversationHeader.Actions>
                  <ChatAudioMessageDialog
                    profile={profile}
                    currentRoom={currentRoom}
                    roomData={roomData}
                  />
                  <IconButton
                    sx={{ color: "black" }}
                    onClick={() => setQrModalVisible(true)}
                  >
                    <QrCodeIcon />
                  </IconButton>
                </ConversationHeader.Actions>
              </ConversationHeader>
            )}
            <MessageList
              style={{
                backgroundImage: currentPickedRoom?.room_background
                  ? `url(${currentPickedRoom.room_background})`
                  : "white",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
              }}
              loadingMore={loaderArchive || isFileUploading}
              onYReachStart={onYReachStart}
              disableOnYReachWhenNoScroll={true}
              typingIndicator={
                !!userChatRooms.filter((e) => e.jid === currentRoom)[0]
                  ?.composing && (
                  <TypingIndicator
                    style={{ opacity: ".6" }}
                    content={
                      userChatRooms.filter((e) => e.jid === currentRoom)[0]
                        ?.composing
                    }
                  />
                )
              }
            >
              {mainWindowMessages.map((message, index, arr) => {
                const position = getPosition(arr, message, index);
                return message.data.isSystemMessage === "false" ? (
                  <Message
                    onThreadClick={() => onMessageThreadClick(message)}
                    key={message.id}
                    is={"Message"}
                    position={position}
                    message={message}
                    onMessageButtonClick={sendMessage}
                    toggleTransferDialog={toggleTransferDialog}
                    onMediaMessageClick={toggleMediaModal}
                  />
                ) : (
                  <SystemMessage
                    key={message.id}
                    is={"Message"}
                    message={message}
                    userJid={xmpp.client?.jid?.toString()}
                  />
                );
              })}
              {mainWindowMessages.length <= 0 ||
                !currentRoom ||
                (currentRoom === NO_ROOM_PICKED && (
                  <MessageList.Content
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      height: "100%",
                      textAlign: "center",
                      fontSize: "1.2em",
                    }}
                  >
                    {!loaderArchive ? (
                      <span>
                        {!currentRoom || currentRoom === NO_ROOM_PICKED
                          ? "Choose a chat room or create one to start a conversation."
                          : null}
                      </span>
                    ) : (
                      "Loading..."
                    )}
                  </MessageList.Content>
                ))}
              {!loaderArchive &&
                currentRoom &&
                currentRoom !== NO_ROOM_PICKED &&
                mainWindowMessages.length <= 0 && (
                  <MessageList.Content
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      height: "100%",
                      textAlign: "center",
                      fontSize: "1.2em",
                    }}
                  >
                    Message list is empty
                  </MessageList.Content>
                )}
            </MessageList>
            {!!roomData?.name && (
              <div is={"MessageInput"}>
                {/* Edit message component */}
                {isEditing && <Divider />}
                <Slide direction="up" in={isEditing} mountOnEnter unmountOnExit>
                  <Stack
                    display={"flex"}
                    height={"50px"}
                    width={"100%"}
                    direction={"row"}
                  >
                    <div
                      style={{
                        display: "flex",
                        flex: "0.05",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <EditIcon color="info" />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: "0.90",
                        flexDirection: "column",
                      }}
                    >
                      <Typography color={"#1976d2"} fontWeight={"bold"}>
                        Edit Message
                      </Typography>
                      <Typography>{currentEditMessage?.body}</Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: "0.05",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        onClick={() => onMenuEditClick(false, undefined)}
                        aria-label="close"
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </Stack>
                </Slide>

                <MessageInput
                  onPaste={handlePaste}
                  placeholder="Type message here"
                  onChange={setMessage}
                  onSend={sendMessage}
                  onAttachClick={() => fileRef.current.click()}
                />
                <input
                  type="file"
                  name="file"
                  id="file"
                  onChange={(event) => sendFile(event.target.files[0], false)}
                  ref={fileRef}
                  style={{ display: "none" }}
                />
              </div>
            )}
          </ChatContainer>
          {isThreadView && (
            <ThreadContainer
              chooseRoom={chooseRoom}
              currentPickedRoom={currentPickedRoom}
              currentRoom={currentRoom}
              handleSetThreadView={handleSetThreadView}
              handleShowInChannel={handleShowInChannel}
              isThreadView={isThreadView}
              onYReachStart={onYReachStart}
              profile={profile}
              roomData={roomData}
              sendFile={sendFile}
              showInChannel={showInChannel}
              toggleMediaModal={toggleMediaModal}
              toggleTransferDialog={toggleTransferDialog}
            />
          )}
        </div>
      </MainContainer>

      <ChatTransferDialog
        open={transferDialogData.open}
        onClose={() => toggleTransferDialog(false)}
        loading={false}
        onPrivateRoomClick={chooseRoom}
        message={transferDialogData.message}
        onThreadClick={onMenuThreadClick}
        onEditClick={onMenuEditClick}
        onDeleteClick={onMessageDeleteClick}
      />
      <ChatMediaModal
        open={mediaDialogData.open}
        onClose={() => toggleMediaModal(false)}
        mimetype={mediaDialogData.message?.data?.mimetype}
        url={mediaDialogData.message?.data?.location}
      />

      <DeleteDialog
        open={showDeleteDialog}
        onClose={handleCloseDeleteMessageDialog}
        onDeletePress={deleteMessage}
        description={"Are you sure you want to delete this message."}
        title={"Delete message"}
      />
      <QrModal
        open={isQrModalVisible}
        link={generateChatLink({ roomAddress: currentPickedRoom?.jid })}
        onClose={closeQrModal}
        title={"Share Chatroom"}
      />
      <MetaNavigation
        open={showMetaNavigation || openLastMetaRoom}
        chatId={currentRoom.split("@")[0]}
        onClose={() => {
          setShowMetaNavigation(false);

          openLastMetaRoom && setActiveRoomFilter("");
        }}
      />
    </Box>
  );
}
