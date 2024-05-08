import React from "react";
import { IMessage } from "../types/types";
import {
  CustomMessageTimestamp,
  CustomMessageContainer,
  CustomMessageBubble,
  CustomMessageText,
  CustomUserName,
  CustomMessagePhoto,
  CustomMessagePhotoContainer,
} from "./styled/StyledComponents";

interface CustomMessageProps {
  message: IMessage;
  isUser: boolean;
}

const CustomMessage: React.FC<CustomMessageProps> = ({ message, isUser }) => {
  return (
    <CustomMessageContainer isUser={isUser}>
      <CustomMessagePhotoContainer>
        <CustomMessagePhoto
          src={
            message.user.avatar ||
            "https://devdevethora.ethoradev.com/assets/profilepic-4330773c.png"
          }
          alt="userIcon"
        />
      </CustomMessagePhotoContainer>
      <CustomMessageBubble isUser={isUser}>
        <CustomUserName isUser={isUser}>{message.user.name}</CustomUserName>
        {message?.isMediafile ? (
          <></>
        ) : (
          <CustomMessageText>{message.body}</CustomMessageText>
        )}
        <CustomMessageTimestamp>
          {new Date(message.date).toLocaleTimeString()}
        </CustomMessageTimestamp>
      </CustomMessageBubble>
    </CustomMessageContainer>
  );
};

export default CustomMessage;
