import React, { useEffect, useState } from "react";
import {
  Message as KitMessage,
  MessageModel,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import { differenceInHours, format, formatDistance, subDays } from "date-fns";
import { TMessageHistory } from "../../../store";
import { useHistory } from "react-router";
import {
  Card,
  CardActionArea,
  CardMedia,
  Button,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import coin from "../../../assets/images/coin.png";
import { Box } from "@mui/system";
import {
  audioMimetypes,
  imageMimetypes,
  videoMimetypes,
} from "../../../constants";

const avatarPreviewUrl = "https://icotar.com/initials/";

export interface IMessage {
  message: TMessageHistory;
  userJid: string;
  position: {
    type: string;
    position: MessageModel["position"];
    separator?: string;
  };
  is?: string;
  buttonSender: any;
  chooseDirectRoom: any;
  toggleTransferDialog: (value: boolean, message: TMessageHistory) => void;
  onMediaMessageClick: (value: boolean, message: TMessageHistory) => void;
}

export interface IButtons {
  name: string;
  notDisplayedValue: string;
  value: string;
}

type IDirection = "outgoing" | "incoming";

export const Message: React.FC<IMessage> = ({
  message,
  userJid,
  position,
  buttonSender,
  toggleTransferDialog,
  onMediaMessageClick,
}) => {
  const firstName = message.data.senderFirstName;
  const lastName = message.data.senderLastName;
  const messageJid = message.data.senderJID;
  const isSameUser = userJid === messageJid;
  const history = useHistory();
  const [buttons, setButtons] = useState<IButtons[]>();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [messageDirection, setMessageDirection] =
    useState<IDirection>("incoming");

  const openDialogMenu = () => {
    setAnchorEl(null);
    toggleTransferDialog(true, message);
  };

  const fullViewImage = () => {
    onMediaMessageClick(true, message);
  };

  const rightClick = (event: React.SyntheticEvent<HTMLElement>) => {
    if (messageDirection !== "incoming") {
      return;
    }
    event.preventDefault();
    openDialogMenu();
  };

  useEffect(() => {
    if (message.data.quickReplies) {
      setButtons(JSON.parse(message.data.quickReplies));
    }
    setMessageDirection(isSameUser ? "outgoing" : "incoming");
  }, []);

  return (
    <div is={"Message"}>
      {!!position.separator && (
        <MessageSeparator>{position.separator}</MessageSeparator>
      )}
      <KitMessage
        onContextMenu={rightClick}
        style={{
          marginBottom:
            position.type === "last" || position.type === "single" ? 15 : null,
        }}
        model={{
          sender: firstName + " " + lastName,
          direction: messageDirection,
          position: position.position,
        }}
        avatarPosition={isSameUser ? "tr" : "tl"}
        avatarSpacer={position.type !== "first" && position.type !== "single"}
      >
        {(position.type === "first" || position.type === "single") && (
          <img
            style={{
              borderRadius: "50%",
              boxSizing: "border-box",
              width: "42px",
              height: "42px",
              cursor: "pointer",
            }}
            onClick={() =>
              history.push("/profile/" + message.data.senderWalletAddress)
            }
            is={"Avatar"}
            src={
              message.data.photoURL
                ? message.data.photoURL
                : +firstName + " " + lastName
            }
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = avatarPreviewUrl + firstName + " " + lastName;
            }}
            alt={firstName}
          />
        )}

        <KitMessage.CustomContent>
          {(position.type === "first" || position.type === "single") && (
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong
                style={{ cursor: "pointer" }}
                onClick={() =>
                  history.push("/profile/" + message.data.senderWalletAddress)
                }
              >
                {firstName} {lastName}
                <br />
              </strong>
              {!isSameUser && (
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={openMenu ? "long-menu" : undefined}
                  aria-expanded={openMenu ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={openDialogMenu}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
            </span>
          )}

          {message.data.isMediafile &&
            !!imageMimetypes[message.data.mimetype] && (
              <Card sx={{ maxWidth: 200 }}>
                <CardActionArea onClick={fullViewImage}>
                  <CardMedia
                    style={{
                      height: 150,
                      objectFit: "cover",
                      objectPosition: "left",
                    }}
                    component="img"
                    height="150"
                    image={message.data.location}
                    alt={message.data.originalName}
                  />
                </CardActionArea>
              </Card>
            )}

          {message.data.isMediafile &&
            !!videoMimetypes[message.data.mimetype] && (
              <video controls width="200px">
                <source
                  src={message.data.location}
                  type={message.data.mimetype}
                  title={message.data.originalName}
                />
                Sorry, your browser doesn't support videos.
              </video>
            )}

          {message.data.isMediafile &&
            !!audioMimetypes[message.data.mimetype] && (
              <audio controls>
                <source
                  src={message.data.location}
                  type={message.data.mimetype}
                />
                Your browser does not support the audio element.
              </audio>
            )}

          {!message.data.isMediafile && (
            <div>
              <span
                dangerouslySetInnerHTML={{
                  __html: message.body.replace(
                    /\b(https?\:\/\/\S+)/gm,
                    '<a href="$1">$1</a>'
                  ),
                }}
              />
              {/*FOOTER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 5,
                  minWidth: 200,
                  color:
                    messageDirection === "incoming"
                      ? "rgb(110, 169, 215)"
                      : "#c6e3fa",
                  flexDirection:
                    messageDirection === "incoming" ? "row" : "row-reverse",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                  }}
                >
                  {differenceInHours(new Date(), new Date(message.date)) > 5
                    ? format(new Date(message.date), "h:mm a")
                    : formatDistance(
                        subDays(new Date(message.date), 0),
                        new Date(),
                        {
                          addSuffix: true,
                        }
                      )}
                </div>
                {message.coinsInMessage > 0 && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ fontSize: 12 }}>
                      {message?.coinsInMessage}
                    </div>
                    <img
                      src={coin}
                      style={{ width: 25, height: 25 }}
                      alt={"coin"}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </KitMessage.CustomContent>

        {/* {(position.type === "last" || position.type === "single") && (
          <KitMessage.Footer
            sentTime={
              differenceInHours(new Date(), new Date(message.date)) > 5
                ? format(new Date(message.date), "h:mm a")
                : formatDistance(
                    subDays(new Date(message.date), 0),
                    new Date(),
                    {
                      addSuffix: true,
                    }
                  )
            }
          />
        )} */}
      </KitMessage>
      {!!buttons && (
        <Box sx={{ "& button": { m: 0.5 } }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "max-content",
              marginLeft: "45px",
            }}
          >
            {buttons.map((button, index) => {
              return (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => buttonSender(button)}
                  key={index}
                >
                  {button.name}
                </Button>
              );
            })}
          </div>
        </Box>
      )}
    </div>
  );
};
