import React, { useState } from "react";
import {
  ChatContainer,
  ConversationHeader,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Message } from "../Messages/Message";
import { TMessageHistory, TUserChatRooms, useStoreState } from "../../../store";
import xmpp from "../../../xmpp";
import DOMPurify from "dompurify";
import { SystemMessage } from "../Messages/SystemMessage";
import CustomMessageInput from "./CustomMessageInput";
import { TProfile } from "../../../pages/Profile/types";
import { IMessagePosition } from "../../../pages/ChatInRoom/Chat";
import { getPosition, stripHtml } from "../../../utils";
import { useHistory, useParams } from "react-router";
import { createMainMessageForThread } from "../../../utils/createMessage";

interface ThreadContainerProps {
  roomData: {
    jid: string;
    name: string;
    room_background: string;
    room_thumbnail: string;
    users_cnt: string;
  };
  handleSetThreadView: (value: boolean) => void;
  isThreadView: boolean;
  chooseRoom: (jid: string) => void;
  profile: TProfile;
  currentPickedRoom: TUserChatRooms;
  currentRoom: string;
  onYReachStart: () => void;
  sendFile: (file: File, isReply: boolean) => void;
  showInChannel: boolean;
  toggleMediaModal: (value: boolean, message?: TMessageHistory) => void;
  handleShowInChannel: (show: boolean) => void;
  toggleTransferDialog: (value: boolean, message?: TMessageHistory) => void;
}

const ThreadContainer: React.FC<ThreadContainerProps> = ({
  roomData,
  handleSetThreadView,
  isThreadView,
  profile,
  currentPickedRoom,
  currentRoom,
  onYReachStart,
  sendFile,
  toggleMediaModal,
  toggleTransferDialog,
  handleShowInChannel,
  showInChannel,
}) => {
  const currentThreadViewMessage = useStoreState(
    (store) => store.currentThreadViewMessage
  );
  const [myThreadMessage, setMyThreadMessage] = useState("");

  const user = useStoreState((store) => store.user);
  const userChatRooms = useStoreState((store) => store.userChatRooms);
  const messages = useStoreState((state) => state.historyMessages);

  const { roomJID } = useParams<{ roomJID: string }>();
  const theme = useTheme();
  const threadWindowMessages = messages.filter(
    (item: TMessageHistory) =>
      item.roomJID.includes(roomJID) &&
      item.data.isReply &&
      item.data?.mainMessage?.id === currentThreadViewMessage.id
  );
  const currentUntrackedChatRoom = useStoreState(
    (store) => store.currentUntrackedChatRoom
  );
  const loaderArchive = useStoreState((store) => store.loaderArchive);
  const history = useHistory();
  const setThreadMessage = (value: string) => {
    setMyThreadMessage(value);
    xmpp.isComposing(
      user.walletAddress,
      roomData.jid,
      user.firstName + " " + user.lastName
    );
  };
  const handleChatDetailClick = () => {
    history.push("/chatDetails/" + currentUntrackedChatRoom);
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
  const sendThreadMessage = (button: any) => {
    if (myThreadMessage.trim().length > 0) {
      let userAvatar = "";
      if (profile?.profileImage) {
        userAvatar = profile?.profileImage;
      }
      const clearMessageFromHtml = DOMPurify.sanitize(myThreadMessage);
      const finalMessageTxt = stripHtml(clearMessageFromHtml);
      handleShowInChannel(false);
      if (finalMessageTxt.trim().length > 0) {
        const data = {
          senderFirstName: user.firstName,
          senderLastName: user.lastName,
          senderWalletAddress: user.walletAddress,
          isSystemMessage: false,
          tokenAmount: 0,
          receiverMessageId: currentThreadViewMessage.data.receiverMessageId,
          mucname: roomData.name,
          photoURL: user.profileImage,
          roomJid: roomData.jid,
          isReply: true,
          mainMessage: createMainMessageForThread(currentThreadViewMessage),
          showInChannel: showInChannel,
          push: true,
        };

        xmpp.sendMessageStanza(currentRoom, finalMessageTxt, data);
      }
    }
  };

  return (
    <ChatContainer
      style={{
        borderLeft: "1px solid #d1dbe3",
      }}
    >
      {!!roomData && (
        <div is="ConversationHeader">
          <ConversationHeader
            style={{
              height: "70px",
            }}
          >
            <ConversationHeader.Content
              datatype="dad"
              userName={
                <div>
                  <Typography fontWeight={"bold"}>Thread</Typography>
                  <Typography>{roomData.name}</Typography>
                </div>
              }
              onClick={handleChatDetailClick}
            />
            <ConversationHeader.Actions>
              <IconButton
                sx={{ color: "black" }}
                onClick={() => handleSetThreadView(false)}
              >
                <CloseIcon />
              </IconButton>
            </ConversationHeader.Actions>
          </ConversationHeader>
          {/* Main Message Preview */}
          <Box width={"100%"} padding={2}>
            <span>
              <div>
                <Message
                  onMediaMessageClick={toggleMediaModal}
                  toggleTransferDialog={toggleTransferDialog}
                  isThread={isThreadView}
                  key={currentThreadViewMessage.id}
                  is={"Message"}
                  position={{ position: "single", type: "single" }}
                  message={currentThreadViewMessage}
                  onMessageButtonClick={sendThreadMessage}
                />
              </div>
            </span>
          </Box>
          <Divider>
            {currentThreadViewMessage.numberOfReplies.length}{" "}
            {currentThreadViewMessage.numberOfReplies.length > 1
              ? "replies"
              : "reply"}{" "}
          </Divider>
        </div>
      )}

      <MessageList
        style={{
          backgroundImage: currentPickedRoom?.room_background
            ? `url(${currentPickedRoom.room_background})`
            : "white",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
        disableOnYReachWhenNoScroll={true}
        typingIndicator={
          !!userChatRooms.filter((e) => e.jid === currentRoom)[0]
            ?.composing && (
            <TypingIndicator
              style={{ opacity: ".6" }}
              content={
                userChatRooms.filter((e) => e.jid === currentRoom)[0]?.composing
              }
            />
          )
        }
      >
        {threadWindowMessages.map((message, index, arr) =>
          message.data.isSystemMessage === "false" ? (
            <Message
              onMediaMessageClick={toggleMediaModal}
              toggleTransferDialog={toggleTransferDialog}
              isThread={true}
              key={message.id}
              is={"Message"}
              position={getPosition(arr, message, index)}
              message={message}
              onMessageButtonClick={sendThreadMessage}
            />
          ) : (
            <SystemMessage
              key={message.id}
              is={"Message"}
              message={message}
              userJid={xmpp.client?.jid?.toString()}
            />
          )
        )}
        {threadWindowMessages.length <= 0 ||
          (!currentRoom && (
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
                  {!currentRoom && "To get started, please select a chat room."}
                </span>
              ) : (
                "Loading..."
              )}
            </MessageList.Content>
          ))}
        {!loaderArchive && currentRoom && threadWindowMessages.length <= 0 && (
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
          <Divider />
          <Box
            borderColor={"#D3D3D3"}
            height="30px"
            alignItems={"center"}
            flexDirection={"row"}
            display="flex"
            width={"100%"}
          >
            <Checkbox
              checked={showInChannel}
              onChange={(e) => handleShowInChannel(e.target.checked)}
              inputProps={{ "aria-label": "controlled" }}
            />
            <Typography>Also send to room</Typography>
          </Box>

          <CustomMessageInput
            onChange={setThreadMessage}
            onPaste={handlePaste}
            onSend={sendThreadMessage}
            placeholder="Type message here"
            sendFile={sendFile}
          />
        </div>
      )}
    </ChatContainer>
  );
};

export default ThreadContainer;
