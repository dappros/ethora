import React, {useEffect, useState} from "react";
import { Message as KitMessage, MessageModel, Button, MessageSeparator } from "@chatscope/chat-ui-kit-react";
import { differenceInHours, format, formatDistance, subDays } from "date-fns";
import { TMessageHistory } from "../../../store";
import {useHistory} from "react-router";

export interface IMessage {
  message: TMessageHistory;
  userJid: string;
  position: {
    type: string;
    position: MessageModel['position'];
    separator?: string;
  };
  is?: string;
  buttonSender: any
}

export interface IButtons {
  name: string;
  notDisplayedValue: string;
  value: string
}

export const Message: React.FC<IMessage> = ({
  message,
  userJid,
  position,
  buttonSender
}) => {
  const firstName = message.data.senderFirstName;
  const lastName = message.data.senderLastName;
  const messageJid = message.data.senderJID;
  const history = useHistory();
  const [buttons, setButtons] = useState<IButtons[]>();

  useEffect(() => {
    if(message.data.quickReplies){
      setButtons(JSON.parse(message.data.quickReplies));
    }
  }, [])

  return (
  <div is={"Message"}>
    {position.separator ?
      <MessageSeparator>
        {position.separator}
      </MessageSeparator> : null
    }
    <KitMessage
      key={message.key}
      model={{
        sender: firstName + " " + lastName,
        direction: String(userJid).split("/")[0] === String(messageJid).split("/")[0] ? "outgoing" : "incoming",
        position: position.position,
      }}
      avatarPosition={String(userJid).split("/")[0] === String(messageJid).split("/")[0] ? "tr" : "tl"}
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
        {buttons ?
            <div style={{
              display: "flex",
              flexDirection: "column",
              width: "max-content",
              marginLeft: "45px"
            }}>
              {buttons.map((button, index) => {
                return (
                  <Button onClick={() => buttonSender(button)} key={index} border>{button.name}</Button>
                );
             })}
            </div>
          : null}
  </div>
  );
};
