import React, { useEffect, useRef } from "react";
import {
  MessagesList,
  Message,
  UserName,
  MessageText,
  MessageTimestamp,
} from "./styled/StyledComponents";
import { IMessage } from "../types/types";

interface ChatListProps<TMessage extends IMessage> {
  messages: TMessage[];
  CustomMessage?: React.ComponentType<{ message: TMessage; isUser: boolean }>;
}

function ChatList<TMessage extends IMessage>({
  messages,
  CustomMessage,
}: ChatListProps<TMessage>) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!validateMessages(messages)) {
    console.log("Invalid 'messages' props provided to ChatList.");
    return null;
  }

  return (
    <MessagesList>
      <MessagesList>
        {messages.map((message, index) => {
          const isUser = message.user.id === "2";
          const refProp =
            index === messages.length - 1 ? { ref: scrollRef } : {};

          return CustomMessage ? (
            <CustomMessage
              key={message.id}
              message={message}
              isUser={isUser}
              {...refProp}
            />
          ) : (
            <Message key={message.id} isUser={isUser} {...refProp}>
              <MessageTimestamp>
                {new Date(message.date).toLocaleTimeString()}
              </MessageTimestamp>
              <UserName>{message.user.name}: </UserName>
              <MessageText>{message.body}</MessageText>
            </Message>
          );
        })}
      </MessagesList>
    </MessagesList>
  );
}

export default ChatList;
