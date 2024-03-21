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

interface ChatRoomProps {
  roomJID?: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  roomJID = "e8b1e5297ac89ceb78341dd870ab12150d9903f4e6e799a8176b13f47ff22553@conference.dev.dxmpp.com",
}) => {
  const client = xmppClient;
  const [currentRoom] = useState(rooms[0]);
  const [messageText, setMessageText] = useState("");

  const messages = useSelector((state: RootState) => state.chat.messages);
  const { user } = useSelector((state: RootState) => state.chatSettingStore);

  const dispatch = useDispatch();

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
  };

  const sendMessage = () => {
    const newMessage = {
      id: uuidv4(),
      user: { id: "2", name: "You", avatar: "" },
      date: new Date().toISOString(),
      body: messageText,
    };
    dispatch(addMessage(newMessage));
    dispatch({ type: "chat/fetchMessages" });
    xmppClient.sendMessage(
      roomJID,
      "Rom",
      "L",
      "",
      user.walletAddress,
      messageText
    );
    setMessageText("");
  };

  useEffect(() => {
    dispatch({ type: "chat/fetchMessages" });
  }, [dispatch]);

  useEffect(() => {
    client.presence();
    client.getRooms();
    client.presenceInRoom(roomJID);
  }, []);

  return (
    <ChatContainer>
      <h2>{currentRoom.name}</h2>
      <ChatList messages={messages} CustomMessage={CustomMessage} />
      <InputContainer>
        <MessageInput
          type="text"
          value={messageText}
          onChange={handleMessageChange}
          placeholder="Type a message..."
        />
        <SendButton onClick={sendMessage}>Send</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatRoom;
