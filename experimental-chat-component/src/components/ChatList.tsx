import React, { useEffect, useRef } from "react";
import {
  MessagesList,
  Message,
  UserName,
  MessageText,
  MessageTimestamp,
} from "./styled/StyledComponents";
import { IMessage, User } from "../types/types";
import SystemMessage from "./SystemMessage";

interface ChatListProps<TMessage extends IMessage> {
  messages: TMessage[];
  CustomMessage?: React.ComponentType<{ message: TMessage; isUser: boolean }>;
  user: User;
}

function ChatList<TMessage extends IMessage>({
  messages,
  CustomMessage,
  user,
}: ChatListProps<TMessage>) {
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for the end of messages
  const messagesContainerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container

  function validateMessages(messages: TMessage[]): boolean {
    const requiredAttributes: (keyof IMessage)[] = [
      "id",
      "user",
      "date",
      "body",
    ];
    let isValid = true;
    messages.forEach((message, index) => {
      const missingAttributes = requiredAttributes.filter(
        (attr) => !(attr in message)
      );
      if (missingAttributes.length > 0) {
        console.error(
          `Message at index ${index} is missing attributes: ${missingAttributes.join(
            ", "
          )}`
        );
        isValid = false;
      }
    });
    return isValid;
  }

  const scrollToBottom = (): void => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!validateMessages(messages)) {
    console.log("Invalid 'messages' props provided to ChatList.");
    return null;
  }

  return (
    <MessagesList ref={messagesContainerRef}>
      {messages.map((message, index) => {
        const isUser = message.user.id === user.walletAddress;
        if (message.isSystemMessage === "true") {
          return <SystemMessage key={message.id} messageText={message.body} />;
        }
        const MessageComponent = CustomMessage || Message;
        return (
          <MessageComponent key={message.id} message={message} isUser={isUser}>
            {!CustomMessage && (
              <>
                <MessageTimestamp>
                  {new Date(message.date).toLocaleTimeString()}
                </MessageTimestamp>
                <UserName>{message.user.name}: </UserName>
                <MessageText>{message.body}</MessageText>
              </>
            )}
          </MessageComponent>
        );
      })}
      <div ref={messagesEndRef} />{" "}
      {/* Invisible div to mark the end of messages */}
    </MessagesList>
  );
}

export default ChatList;
