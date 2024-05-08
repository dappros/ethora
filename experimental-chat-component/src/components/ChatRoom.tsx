import React, { useState, useEffect } from "react";
import {
  ChatContainer,
  InputContainer,
  MessageInput,
  SendButton,
} from "./styled/StyledComponents";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../store/chatSlice";
import { RootState } from "../store";
import { v4 as uuidv4 } from "uuid";
import ChatList from "./ChatList";
import { rooms } from "../mock";
import CustomMessage from "./CustomMessage";
import xmppClient from "../networking/xmppClient";
import { IUser } from "../types/types";
import { setUser } from "../store/chatSettingsSlice";

interface ChatRoomProps {
  roomJID?: string;
  defaultUser?: IUser;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  roomJID = "cc39004bf432f6dc34b47cd64251236c9ae65eadd890daef3ff7dbc94c3caecb@conference.dev.dxmpp.com",
  defaultUser,
}) => {
  const client = xmppClient;
  const [currentRoom, setCurrentRoom] = useState(rooms[0]);
  const [messageText, setMessageText] = useState("");

  const messages = useSelector((state: RootState) => state.chat.messages);
  const { user } = useSelector((state: RootState) => state.chatSettingStore);

  const mainUser = defaultUser || user;

  useEffect(() => {
    dispatch(setUser(mainUser));
  }, []);

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
      roomJID,
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
        .presence()
        .then(() => client.getRooms())
        .then(() => client.presenceInRoom(roomJID))
        .then(() => {
          client.getPaginatedArchive(roomJID, mainUser._id, 30); // Called after all other actions
        })
        .catch((error) => {
          console.error("Error handling client operations:", error);
        });
    }, 1000); // Delay of 1 second before initiating the sequence
  }, []);

  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);

  return (
    <ChatContainer>
      <h2>{currentRoom.name}</h2>
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
