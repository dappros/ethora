import React from "react";
import { Message } from "@chatscope/chat-ui-kit-react";
import { differenceInHours, format, formatDistance, subDays } from "date-fns";
import { TMessageHistory } from "../../../store";

export interface ICustomMessage {
  message: TMessageHistory;
  userJid: string;
  position: {
    type: string;
    position: 0 | 1 | "single" | "first" | "normal" | "last" | 2 | 3;
  };
  is?: string;
}

export const CustomMessage: React.FC<ICustomMessage> = ({
  message,
  userJid,
  position,
}) => {
  const firstName = message.data.senderFirstName;
  const lastName = message.data.senderLastName;
  const messageJid = message.data.senderJID;

  return (
    <Message
      key={message.key}
      model={{
        sender: firstName + " " + lastName,
        direction: userJid === messageJid ? "outgoing" : "incoming",
        position: position.position,
      }}
      avatarPosition={userJid === messageJid ? "tr" : "tl"}
      avatarSpacer={position.type !== "first" && position.type !== "single"}
    >
      {(position.type === "first" || position.type === "single") && (
        <img
          style={{
            borderRadius: "50%",
            boxSizing: "border-box",
            width: "42px",
            height: "42px",
          }}
          is={"Avatar"}
          src={message.data.photoURL}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src =
              "https://icotar.com/initials/" + firstName + " " + lastName;
          }}
          alt={firstName}
        />
      )}

      <Message.CustomContent>
        {(position.type === "first" || position.type === "single") && (
          <strong>
            {firstName} {lastName}
            <br />
          </strong>
        )}
        {message.body}
      </Message.CustomContent>

      {(position.type === "last" || position.type === "single") && (
        <Message.Footer
          sentTime={
            differenceInHours(new Date(), new Date(message.date)) > 5
              ? format(new Date(message.date), "h:mm:ss a")
              : formatDistance(subDays(new Date(message.date), 0), new Date(), {
                  addSuffix: true,
                })
          }
        />
      )}
    </Message>
  );
};
