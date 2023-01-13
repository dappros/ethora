import * as React from 'react';
import { ChatContainer, ConversationHeader, MessageInput, MessageList, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import { Box, Checkbox, Divider, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Message } from '../Messages/Message';
import { TMessageHistory, TUserChatRooms, useStoreState } from '../../../store';
import xmpp from '../../../xmpp';
import * as DOMPurify from "dompurify";
import { SystemMessage } from '../Messages/SystemMessage';
import CustomMessageInput from './CustomMessageInput';
import { TProfile } from '../../../pages/Profile/types';
import { IMessagePosition } from '../../../pages/ChatInRoom/Chat';

interface ThreadContainerProps {
    roomData:{
        jid: string;
        name: string;
        room_background: string;
        room_thumbnail: string;
        users_cnt: string;
    };
    handleChatDetailClick:() => void;
    handleSetThreadView:(value: boolean) => void;
    isThreadView:boolean;
    handlePaste:(event: any) => void;
    chooseRoom:(jid: string) => void;
    stripHtml:(html: string) => any;
    profile:TProfile;
    roomJID:any;
    currentPickedRoom:TUserChatRooms;
    currentRoom:string;
    onYReachStart:() => void;
    getPosition:(arr: TMessageHistory[], message: TMessageHistory, index: number) => IMessagePosition;
    sendFile:(file: File, isReply: boolean) => void;
    showInChannel:boolean;
    handleShowInChannel:(event: React.ChangeEvent<HTMLInputElement>) => void
    toggleMediaModal:(value: boolean, message?: TMessageHistory) => void
    toggleTransferDialog:(value: boolean, message?: TMessageHistory) => void
}

const ThreadContainer = (props: ThreadContainerProps) => {
    
    const currentThreadViewMessage = useStoreState((store) => store.currentThreadViewMessage);
    const [myThreadMessage, setMyThreadMessage] = React.useState("");


    const {
        roomData,
        handleChatDetailClick,
        handleSetThreadView,
        isThreadView,
        handlePaste,
        chooseRoom,
        stripHtml,
        profile,
        roomJID,
        currentPickedRoom,
        currentRoom,
        onYReachStart,
        getPosition,
        sendFile,
        showInChannel,
        handleShowInChannel,
        toggleMediaModal,
        toggleTransferDialog
    } = props;

    const user = useStoreState((store) => store.user);
    const userChatRooms = useStoreState((store) => store.userChatRooms);
    const messages = useStoreState((state) => state.historyMessages);
    const threadWindowMessages = messages
    .filter((item:TMessageHistory) => item.roomJID.includes(roomJID) && item.data.isReply
    && item.data.mainMessageId === currentThreadViewMessage.id);
    const loaderArchive = useStoreState((store) => store.loaderArchive);


    const setThreadMessage = (value) => {
        setMyThreadMessage(value);
        xmpp.isComposing(
          user.walletAddress,
          roomData.jid,
          user.firstName + " " + user.lastName
        );
    };

    const ThreadMessageComponent = () => {
        return threadWindowMessages
        .map((message, index, arr) => {
          const position = getPosition(arr, message, index);
          if (message.data.isSystemMessage === "false") {
            return (
              <Message
                onMediaMessageClick={toggleMediaModal}
                toggleTransferDialog={toggleTransferDialog}
                isThread={true}
                key={message.id}
                is={"Message"}
                position={position}
                message={message}
                userJid={xmpp.client?.jid?.toString()}
                buttonSender={sendThreadMessage}
                chooseDirectRoom={chooseRoom}
              />
            );
          } else {
            return (
              <SystemMessage
                key={message.id}
                is={"Message"}
                message={message}
                userJid={xmpp.client?.jid?.toString()}
              />
            );
          }
        })
      }

    const ShowInChannelComponent = () => {
        return(
          <>
            <Divider/>
            <Box
            borderColor={"#D3D3D3"}
            height="30px"
            alignItems={"center"}
            flexDirection={"row"}
            display="flex"
            width={"100%"}>
              <Checkbox
              checked={showInChannel}
              onChange={handleShowInChannel}
              inputProps={{ 'aria-label': 'controlled' }}
              />
              <Typography>Also send to room</Typography>
            </Box>
          </>
        )
      }

    const sendThreadMessage = (button:any) => {
        if (myThreadMessage.trim().length > 0) {
          let userAvatar = "";
          if (profile?.profileImage) {
            userAvatar = profile?.profileImage;
          }
          const clearMessageFromHtml = DOMPurify.sanitize(myThreadMessage);
          const finalMessageTxt = stripHtml(clearMessageFromHtml);
    
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
              mainMessageText: currentThreadViewMessage.body,
              mainMessageId: currentThreadViewMessage.id,
              mainMessageUserName: currentThreadViewMessage.data.senderFirstName + " " + currentThreadViewMessage.data.senderLastName,
              mainMessageCreatedAt: currentThreadViewMessage.date,
              mainMessageFileName: currentThreadViewMessage.data.originalName,
              mainMessageImageLocation: currentThreadViewMessage.data.location,
              mainMessageImagePreview: currentThreadViewMessage.data.locationPreview,
              mainMessageMimeType: currentThreadViewMessage.data.mimetype,
              mainMessageOriginalName: currentThreadViewMessage.data.originalName,
              mainMessageSize: 'N/A',
              mainMessageDuration: 'N/A',
              mainMessageWaveForm: 'N/A',
              mainMessageAttachmentId: 'N/A',
              mainMessageWrappable: 'N/A',
              mainMessageNftId: 'N/A',
              mainMessageNftActionType: 'N/A',
              mainMessageContractAddress: 'N/A',
              mainMessageRoomJid: currentThreadViewMessage.data.roomJid,
              showInChannel:showInChannel,
              push:true
            };
    
            xmpp.sendMessageStanza(
              currentRoom,
              finalMessageTxt,
              data
            )
        }
    }}

    return (
        <ChatContainer
        style={{
        borderLeftWidth:"2px"
        }}
        >
        {!!roomData && (
            <div is="ConversationHeader">
            <ConversationHeader
                style={{
                height:"70px",
                }}
            >
                <ConversationHeader.Content
                datatype="dad"
                userName={      <div>
                    <Typography
                    fontWeight={"bold"}
                    >
                    Thread
                    </Typography>
                    <Typography
                    >
                    {roomData.name}
                    </Typography>
                </div>}
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
            <Box
            width={"100%"}
            padding={2}
            >
                <span>
                <div>
                <Message
                onMediaMessageClick={toggleMediaModal}
                toggleTransferDialog={toggleTransferDialog}
                isThread={isThreadView}
                key={currentThreadViewMessage.id}
                is={"Message"}
                position={{position:'single', type:'single'}}
                message={currentThreadViewMessage}
                userJid={xmpp.client?.jid?.toString()}
                buttonSender={sendThreadMessage}
                chooseDirectRoom={chooseRoom}
                />
                </div>
                </span>
            </Box>
            <Divider>
                {currentThreadViewMessage.numberOfReplies}
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
                    userChatRooms.filter((e) => e.jid === currentRoom)[0]
                    ?.composing
                }
                />
            )
            }
        >
            {ThreadMessageComponent()}
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
                    {!currentRoom &&
                        "To get started, please select a chat room."}
                    </span>
                ) : (
                    "Loading..."
                )}
                </MessageList.Content>
            ))}
            {!loaderArchive &&
            currentRoom &&
            threadWindowMessages
                .length <= 0 && (
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
            {ShowInChannelComponent()}

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
