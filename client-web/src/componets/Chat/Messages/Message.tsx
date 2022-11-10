import React, {useEffect, useRef, useState} from "react";
import { Message as KitMessage, MessageModel, Button, MessageSeparator } from "@chatscope/chat-ui-kit-react";
import { differenceInHours, format, formatDistance, subDays } from "date-fns";
import { TMessageHistory } from "../../../store";
import {useHistory} from "react-router";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, Menu, MenuItem, useMediaQuery,
  useTheme
} from "@mui/material";
import Box from "@mui/material/Box";

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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [openDialog, setOpenDialog] = useState(false);


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

        {message.data.isMediafile && message.data.mimetype.split("/")[0] === "image"?
           <KitMessage.ImageContent src={message.data.location} alt={message.data.originalName} width={200} />
            :null
        }

        {message.data.isMediafile && message.data.mimetype.split("/")[0] === "application"?
            <a target="_blank" href={message.data.location}>
              <KitMessage.ImageContent src={message.data.locationPreview} alt={message.data.originalName} width={150} />
              {message.data.mimetype.split("/")[1]}
            </a>
            :null
        }

        {message.data.isMediafile && message.data.mimetype.split("/")[0] === "video" ?
            <video controls width="200px">
              <source src={message.data.location} type={message.data.mimetype} title={message.data.originalName}/>
              Sorry, your browser doesn't support videos.
            </video>
            : null
        }

        {!message.data.isMediafile ?
            message.body
            : null
        }
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
    <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={() => setOpenDialog(true)}
        aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        Message menu
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          choose you button
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  </div>
  );
};
