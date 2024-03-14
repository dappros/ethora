import React from "react";
import { IMessage } from "../types/types";
import {
  CustomMessageTimestamp,
  CustomMessageContainer,
  CustomMessageBubble,
  CustomMessageText,
  CustomUserName,
} from "./styled/StyledComponents";

interface CustomMessageProps {
  message: IMessage;
  isUser: boolean;
}

const CustomMessage: React.FC<CustomMessageProps> = ({ message, isUser }) => {
  return (
    <CustomMessageContainer isUser={isUser}>
      <CustomMessageBubble isUser={isUser}>
        <CustomUserName>{message.user.name}</CustomUserName>
        <CustomMessageText>{message.body}</CustomMessageText>
        <CustomMessageTimestamp>
          {new Date(message.date).toLocaleTimeString()}
        </CustomMessageTimestamp>
      </CustomMessageBubble>
    </CustomMessageContainer>
  );
};

export default CustomMessage;
