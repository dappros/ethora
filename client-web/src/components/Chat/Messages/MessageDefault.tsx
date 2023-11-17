import { Avatar, Message } from "@chatscope/chat-ui-kit-react"
import { TMessageHistory } from "../../../store"
import React, { useEffect, useState } from "react"
import xmpp from "../../../xmpp"
import { differenceInHours, format, formatDistance, subDays } from "date-fns"

interface IMessagesProperties {
  message: TMessageHistory
  previousJID: string
  nextJID: string
  // is: string
}

type IMessagePosition = {
  position: 0 | 1 | "single" | "first" | "normal" | "last" | 2 | 3
  type: string
}

type IMessageDirection = {
  direction: "outgoing" | "incoming"
}

const MessageDefault: React.FC<IMessagesProperties> = ({
  message,
  previousJID,
  nextJID,
}) => {
  const [messagePositionData, setMessagePositionData] =
    useState<IMessagePosition>({
      position: "single",
      type: "single",
    })
  const [messageDirection, setMessageDirection] = useState<IMessageDirection>({
    direction: "outgoing",
  })
  const [userAvatarLink, setUserAvatarLink] = useState<string>(
    "https://icotar.com/initials/" +
      message.data.senderFirstName +
      "%20" +
      message.data.senderLastName
  )

  const getPosition = (
    previousJID: string,
    nextJID: string,
    currentJID: string
  ) => {
    const result: IMessagePosition = {
      position: "single",
      type: "single",
    }

    if (previousJID !== currentJID && nextJID !== currentJID) {
      return result
    }

    if (previousJID !== currentJID && nextJID === currentJID) {
      result.position = "first"
      result.type = "first"
      return result
    }

    if (previousJID === currentJID && nextJID === currentJID) {
      result.position = "normal"
      result.type = "normal"
      return result
    }

    if (previousJID === currentJID && nextJID !== currentJID) {
      result.position = "single"
      result.type = "last"
      return result
    }

    return result
  }

  const getImageLink = () => {
    if (message.data.photoURL) {
      const img = new Image()
      img.addEventListener("load", function () {
        setUserAvatarLink(message.data.photoURL)
      })
      img.src = message.data.photoURL
    }
  }

  useEffect(() => {
    setMessagePositionData(
      getPosition(
        previousJID?.split("/")[0],
        nextJID?.split("/")[0],
        message.data.senderJID?.split("/")[0]
      )
    )
    setMessageDirection({
      direction:
        xmpp.client.jid?.toString().split("/")[0] ===
        message.data.senderJID.split("/")[0]
          ? "outgoing"
          : "incoming",
    })
    getImageLink()
  }, [])

  return (
    <Message
      model={{
        sender:
          message.data.senderFirstName + " " + message.data.senderLastName,
        direction: messageDirection.direction,
        position: messagePositionData.position,
      }}
      avatarPosition={messageDirection.direction === "outgoing" ? "tr" : "tl"}
      avatarSpacer={
        messagePositionData.type !== "first" &&
        messagePositionData.type !== "single"
      }
    >
      {messagePositionData.type === "first" ||
      messagePositionData.type === "single" ? (
        <Avatar src={userAvatarLink} name={message.data.senderFirstName} />
      ) : null}

      <Message.CustomContent>
        {messagePositionData.type === "first" ||
        messagePositionData.type === "single" ? (
          <strong>
            {message.data.senderFirstName} {message.data.senderLastName}
            <br />
          </strong>
        ) : null}
        {message.body}
      </Message.CustomContent>

      {messagePositionData.type === "last" ||
      messagePositionData.type === "single" ? (
        <Message.Footer
          sentTime={
            differenceInHours(new Date(), new Date(message.date)) > 5
              ? format(new Date(message.date), "h:mm:ss a")
              : formatDistance(subDays(new Date(message.date), 0), new Date(), {
                  addSuffix: true,
                })
          }
        />
      ) : null}
    </Message>
  )
}
export default MessageDefault
