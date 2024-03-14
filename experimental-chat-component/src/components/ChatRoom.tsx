import React, { useState, useEffect } from "react";
import {
  ChatContainer,
  InputContainer,
  Message,
  MessageInput,
  MessageText,
  MessageTimestamp,
  MessagesList,
  SendButton,
  UserName,
} from "./styled/StyledComponents";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../store/chatSlice";
import { RootState } from "../store";
import { v4 as uuidv4 } from "uuid";
import ChatList from "./ChatList";
import { badMessages, goodMessages, rooms } from "../mock";
import CustomMessage from "./CustomMessage";

const ChatRoom: React.FC = () => {
  const [currentRoom] = useState(rooms[0]);
  const [messageText, setMessageText] = useState("");

  const messages = useSelector((state: RootState) => state.chat.messages);
  const dispatch = useDispatch();

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
  };

  const sendMessage = () => {
    const newMessage = {
      id: uuidv4(),
      user: { id: "2", name: "You", avatar: "" },
      timestamp: new Date().toISOString(),
      text: messageText,
    };
    dispatch(addMessage(newMessage));
    setMessageText("");
    dispatch({ type: "chat/fetchMessages" });
  };

  useEffect(() => {
    dispatch({ type: "chat/fetchMessages" });
  }, [dispatch]);

  return (
    <ChatContainer>
      <h2>{currentRoom.name}</h2>
      {/* <MessagesList>
        {messages.map((message, index) => (
          <Message key={message.id} isUser={message.user.name === "You"}>
            <MessageTimestamp>
              {new Date(message.timestamp).toLocaleTimeString()}
            </MessageTimestamp>
            <UserName>{message.user.name}: </UserName>
            <MessageText>{message.text}</MessageText>
          </Message>
        ))}
      </MessagesList> */}
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
