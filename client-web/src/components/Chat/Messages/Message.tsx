import React, { useEffect, useMemo, useState } from "react";
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
  Typography,
  Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box } from "@mui/system";
import xmpp from "../../../xmpp";
import { IButtons } from "../../../pages/ChatInRoom/Chat";
import {
  isAudtioMimetype,
  isDocumentMimetype,
  isExcelMimetype,
  isImageMimetype,
  isPdfMimetype,
  isVideoMimetype,
} from "../../../utils/mimetypes";

const coin = "/coin.png";

const docsIconUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg/2203px-Microsoft_Office_Word_%282019%E2%80%93present%29.svg.png";
const excelIconUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/826px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png";
const fileIcon = 'https://cdn-icons-png.flaticon.com/512/2246/2246713.png'
const avatarPreviewUrl = "https://icotar.com/initials/";

export interface IMessage {
  message: TMessageHistory;
  position: {
    type: string;
    position: MessageModel["position"];
    separator?: string;
  };
  is?: string;
  onMessageButtonClick: (button: IButtons) => void;
  toggleTransferDialog: (value: boolean, message: TMessageHistory) => void;
  onMediaMessageClick: (value: boolean, message: TMessageHistory) => void;

  onThreadClick?: () => void;
  isThread?: boolean;
}

type IDirection = "outgoing" | "incoming";

export const Message: React.FC<IMessage> = ({
  message,
  position,
  onMessageButtonClick,
  toggleTransferDialog,
  onMediaMessageClick,
  onThreadClick,
  isThread,
}) => {
  const firstName = message.data.senderFirstName;
  const lastName = message.data.senderLastName;
  const messageJid = message.data.senderJID.split("/")[0];
  const userJid = useMemo(() => xmpp.client?.jid?.toString().split("/")[0], []);
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

  const openThreadView = () => {
    onThreadClick();
  };

  const fullViewImage = () => {
    onMediaMessageClick(true, message);
  };

  const rightClick = (event: React.SyntheticEvent<HTMLElement>) => {
    event.preventDefault();
    openDialogMenu();
  };

  const openFileInNewTab = (link: string) => {
    window.open(link, "_blank");
  };

  const ReplyComponent = () => {
    return (
      <Button
        variant="text"
        style={{
          flexDirection: "row",
          display: "flex",
          textTransform: "none",
          textAlign: "left",
        }}
      >
        <Divider
          style={{
            borderWidth: "3px",
            borderRadius: "5px",
            marginRight: "5px",
          }}
          variant="middle"
          orientation="vertical"
          flexItem
        />

        <div>
          <strong style={{ cursor: "pointer" }}>
            {message.data.mainMessage?.userName || "N/A"}
            <br />
          </strong>
          {message.data.mainMessage?.imageLocation &&
            isImageMimetype(message.data.mainMessage.mimeType) && (
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
                    image={message.data.mainMessage.imageLocation}
                    alt={message.data.mainMessage?.originalName}
                  />
                </CardActionArea>
              </Card>
            )}

          {/* {message.data.mainMessage.ImageLocation &&
          message.data.mainMessage.MimeType.split("/")[0] === "application" ? (
            <a target="_blank" href={message.data.location}>
              <KitMessage.ImageContent
                src={message.data.mainMessage.ImageLocation}
                alt={message.data.mainMessage.OriginalName}
                width={150}
              />
              {message.data.mainMessage.MimeType.split("/")[1]}
            </a>
          ) : null} */}

          {message.data.mainMessage?.imageLocation &&
            isVideoMimetype(message.data.mainMessage?.mimeType) && (
              <video controls width="300px">
                <source
                  src={message.data.mainMessage.imageLocation}
                  type={message.data.mainMessage.mimeType}
                  title={message.data.mainMessage.originalName}
                />
                Sorry, your browser doesn't support videos.
              </video>
            )}

          {message.data.mainMessage?.imageLocation &&
            isAudtioMimetype(message.data.mainMessage?.mimeType) && (
              <audio controls>
                <source
                  src={message.data.mainMessage.imageLocation}
                  type={message.data.mainMessage.mimeType}
                />
                Your browser does not support the audio element.
              </audio>
            )}

          <span
            dangerouslySetInnerHTML={{
              __html: message.data?.mainMessage?.text.replace(
                /\b(https?\:\/\/\S+)/gm,
                '<a href="$1">$1</a>'
              ),
            }}
          ></span>
        </div>
      </Button>
    );
  };

  const renderMedia = () => {
    if (!message.data.isMediafile) {
      return null;
    }
    const mimetype = message.data.mimetype;
    if (isImageMimetype(mimetype)) {
      return (
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
      );
    }
    if (isPdfMimetype(mimetype)) {
      return (
        <Card sx={{ maxWidth: 200 }}>
          <CardActionArea
            onClick={(event) => {
              event.preventDefault();
              window.open(message.data.location, "_blank");
            }}
          >
            <CardMedia
              style={{
                height: 150,
                objectFit: "cover",
                objectPosition: "left",
              }}
              component="img"
              height="150"
              image={message.data.locationPreview}
              alt={message.data.originalName}
            />
          </CardActionArea>
        </Card>
      );
    }

    if (isVideoMimetype(mimetype)) {
      return (
        <video controls width={400} height={400}>
          <source
            src={message.data.location}
            type={mimetype}
            title={message.data.originalName}
          />
          Sorry, your browser doesn't support videos.
        </video>
      );
    }
    if (isAudtioMimetype(mimetype)) {
      return (
        <audio controls>
          <source src={message.data.location} type={mimetype} />
          Your browser does not support the audio element.
        </audio>
      );
    }

    if (isDocumentMimetype(mimetype)) {
      return (
        <Box>
          <CardActionArea
            onClick={() => openFileInNewTab(message.data.location)}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              fontSize: 150,
              backgroundColor: "transparent !important",
              border: "none !important",
              position: "relative",
              flexDirection: 'column'
            }}
          >
            
            <CardMedia
              sx={{
                height: 150,
                objectFit: "cover",
                objectPosition: "left",
              }}
              component="img"
              height="150"
              image={docsIconUrl}
              alt={message.data.originalName}
            />
            <Typography sx={{fontSize: 12, fontWeight: 'bold'}}>
              {message.data.originalName}
            </Typography>
          </CardActionArea>
        </Box>
      );
    }
    if (isExcelMimetype(mimetype)) {
      return (
        <Box sx={{ color: "primary" }}>
          <CardActionArea
            onClick={() => openFileInNewTab(message.data.location)}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              fontSize: 150,
              backgroundColor: "transparent !important",
              border: "none !important",
              position: "relative",
              flexDirection: 'column'
            }}
          >
            <CardMedia
              sx={{
                height: 150,
                objectFit: "cover",
                objectPosition: "left",
              }}
              component="img"
              height="150"
              image={excelIconUrl}
              alt={message.data.originalName}
            />
             <Typography sx={{fontSize: 12, fontWeight: 'bold'}}>
              {message.data.originalName}
            </Typography>
          </CardActionArea>
        </Box>
      );
    }

    return (
      <Box >
        <CardActionArea
          onClick={() => openFileInNewTab(message.data.location)}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            fontSize: 150,
            backgroundColor: "transparent !important",
            border: "none !important",
            position: "relative",
            flexDirection: 'column'
          }}
        >
          <CardMedia
            sx={{
              height: 150,
              objectFit: "cover",
              objectPosition: "left",
            }}
            component="img"
            height="150"
            image={fileIcon}
            alt={message.data.originalName}
          />
           <Typography sx={{fontSize: 12, fontWeight: 'bold'}}>
              {message.data.originalName}
            </Typography>
        </CardActionArea>
      </Box>
    );
  };
  useEffect(() => {
    if (message.data.quickReplies) {
      setButtons(JSON.parse(message.data.quickReplies));
    }
    setMessageDirection(isSameUser ? "outgoing" : "incoming");
  }, []);
  if (message.data.isMediafile) {
  }
  return (
    <div is={"Message"}>
      {!!position.separator && (
        <MessageSeparator>{position.separator}</MessageSeparator>
      )}
      <KitMessage
        onContextMenu={
          !message.data.isReply && !isThread ? rightClick : () => {}
        }
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
          {/* Main Message */}
          {message.data.isReply && !isThread && <ReplyComponent />}
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
              {!isThread && !message.data.isReply && (
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
          {renderMedia()}
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
                    ? format(new Date(message.date), "dd.MM hh:mm a")
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
                {message.data.isEdited && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      marginLeft: 3,
                      marginRight: 3,
                    }}
                  >
                    <Typography fontSize={12}>edited</Typography>
                  </div>
                )}
              </div>
            </div>
          )}
        </KitMessage.CustomContent>

        {/*{(position.type === "last" || position.type === "single") && (*/}
        {/*  <KitMessage.Footer*/}
        {/*    sentTime={*/}
        {/*      differenceInHours(new Date(), new Date(message.date)) > 5*/}
        {/*        ? format(new Date(message.date), "h:mm a")*/}
        {/*        : formatDistance(*/}
        {/*            subDays(new Date(message.date), 0),*/}
        {/*            new Date(),*/}
        {/*            {*/}
        {/*              addSuffix: true,*/}
        {/*            }*/}
        {/*          )*/}
        {/*    }*/}
        {/*  />*/}
        {/*)}*/}
        <KitMessage.Footer>
          {message.numberOfReplies > 0 &&
            messageDirection === "incoming" &&
            !isThread && (
              <Button onClick={() => openThreadView()} variant="text">
                <Typography fontSize={"12px"} textTransform={"none"}>
                  {message.numberOfReplies}{" "}
                  {message.numberOfReplies === 1 ? "Reply" : "Replies"} (tap to
                  review)
                </Typography>
              </Button>
            )}
        </KitMessage.Footer>
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
                  onClick={() => onMessageButtonClick(button)}
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
