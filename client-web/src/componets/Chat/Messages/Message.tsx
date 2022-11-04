import React from "react";
import { Message as KitMessage, MessageModel } from "@chatscope/chat-ui-kit-react";
import { differenceInHours, format, formatDistance, subDays } from "date-fns";
import { TMessageHistory } from "../../../store";
import {useHistory} from "react-router";

export interface IMessage {
  message: TMessageHistory;
  userJid: string;
  position: {
    type: string;
    position: MessageModel['position'];
  };
  is?: string;
}

export const Message: React.FC<IMessage> = ({
  message,
  userJid,
  position,
}) => {
  const firstName = message.data.senderFirstName;
  const lastName = message.data.senderLastName;
  const messageJid = message.data.senderJID;
  const history = useHistory();

  return (
    <KitMessage
      key={message.key}
      model={{
        sender: firstName + " " + lastName,
        direction: userJid.split("/")[0] === messageJid.split("/")[0] ? "outgoing" : "incoming",
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
            cursor: "pointer"
          }}
          onClick={() => history.push("/profile/"+message.data.senderWalletAddress)}
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

      <KitMessage.CustomContent>
        {(position.type === "first" || position.type === "single") && (
          <strong style={{cursor: "pointer"}} onClick={() => history.push("/profile/" + message.data.senderWalletAddress)}>
            {firstName} {lastName}
            <br />
          </strong>
        )}
        {message.body}
      </KitMessage.CustomContent>

      {(position.type === "last" || position.type === "single") && (
        <KitMessage.Footer
          sentTime={
            differenceInHours(new Date(), new Date(message.date)) > 5
              ? format(new Date(message.date), "h:mm:ss a")
              : formatDistance(subDays(new Date(message.date), 0), new Date(), {
                  addSuffix: true,
                })
          }
        />
      )}
    </KitMessage>
  );
};
