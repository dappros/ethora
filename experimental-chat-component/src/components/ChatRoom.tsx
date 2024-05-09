import React, { useState, useEffect } from "react";
import {
  ChatContainer,
  ChatContainerHeader,
  ChatContainerHeaderLabel,
  InputContainer,
  MessageInput,
  SendButton,
} from "./styled/StyledComponents";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, resetMessages } from "../store/chatSlice";
import { RootState } from "../store";
import { v4 as uuidv4 } from "uuid";
import ChatList from "./ChatList";
import { rooms } from "../mock";
import CustomMessage from "./CustomMessage";
import xmppClient from "../networking/xmppClient";
import { IRoom, User } from "../types/types";
import { setUser } from "../store/chatSettingsSlice";

interface ChatRoomProps {
  roomJID?: string;
  defaultUser: User;
  isLoading?: boolean;
  defaultRoom: IRoom;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  defaultUser,
  isLoading = false,
  defaultRoom,
}) => {
  const client = xmppClient;
  const [currentRoom, setCurrentRoom] = useState(defaultRoom);
  const [messageText, setMessageText] = useState("");

  const messages = useSelector((state: RootState) => state.chat.messages);
  const { user } = useSelector((state: RootState) => state.chatSettingStore);

  const mainUser = defaultUser || user;

  useEffect(() => {
    dispatch(setUser(mainUser));
  }, []);

  useEffect(() => {
    dispatch(resetMessages());
  }, [currentRoom]);

  const dispatch = useDispatch();

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
  };

  const sendMessage = () => {
    const newMessage = {
      id: uuidv4(),
      user: {
        id: mainUser.walletAddress,
        name: `${mainUser.firstName} ${mainUser.lastName}`,
        avatar: "",
      },
      date: new Date().toISOString(),
      body: messageText,
    };
    // dispatch(addMessage(newMessage));
    dispatch({ type: "chat/fetchMessages" });
    xmppClient.sendMessage(
      defaultRoom.jid,
      mainUser.firstName,
      mainUser.lastName,
      "",
      mainUser.walletAddress,
      messageText
    );
    setMessageText("");
  };

  useEffect(() => {
    dispatch({ type: "chat/fetchMessages" });
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      client
        .init(mainUser.walletAddress, mainUser.xmppPassword)
        .then(() =>
          client
            .presence()
            .then(() => client.getRooms())
            .then(() => client.presenceInRoom(defaultRoom.jid))
            .then(() => {
              client.getPaginatedArchive(defaultRoom.jid, mainUser._id, 30); // Called after all other actions
            })
        )
        .catch((error) => {
          console.error("Error handling client operations:", error);
        });
    }, 1000); // Delay of 1 second before initiating the sequence
  }, []);

  if (isLoading) return <>Loading ...</>;

  return (
    <ChatContainer>
      <ChatContainerHeader>
        <ChatContainerHeaderLabel>
          {currentRoom?.title}
        </ChatContainerHeaderLabel>
        <ChatContainerHeaderLabel>
          {currentRoom?.usersCnt} users
        </ChatContainerHeaderLabel>
      </ChatContainerHeader>
      <ChatList
        messages={messages}
        CustomMessage={CustomMessage}
        user={mainUser}
      />
      <InputContainer>
        <MessageInput
          type="text"
          value={messageText}
          onChange={handleMessageChange}
          placeholder="Message..."
        />
        <SendButton onClick={sendMessage}>Send</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatRoom;
