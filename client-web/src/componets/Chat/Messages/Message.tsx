import React, { useEffect, useState } from "react";
import {
  Message as KitMessage,
  MessageModel,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import { differenceInHours, format, formatDistance, subDays } from "date-fns";
import { TMessageHistory, useStoreState } from "../../../store";
import { useHistory } from "react-router";
import {
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent, Divider, Button,
  IconButton,
  Menu,
  MenuItem,
  Slider,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { transferCoin } from "../../../http";
import xmpp from "../../../xmpp";
import { createPrivateChat } from "../../../helpers/chat/createPrivateChat";
import coin from "../../../assets/images/coin.png";
import { Box } from "@mui/system";
import SendIcon from '@mui/icons-material/Send';
import BlockIcon from '@mui/icons-material/Block';

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
}

export interface IButtons {
  name: string;
  notDisplayedValue: string;
  value: string;
}

type IDialog = "dialog" | "image" | "error";

export const Message: React.FC<IMessage> = ({
  message,
  userJid,
  position,
  buttonSender,
  chooseDirectRoom,
}) => {
  const firstName = message.data.senderFirstName;
  const lastName = message.data.senderLastName;
  const messageJid = message.data.senderJID;
  const history = useHistory();
  const [buttons, setButtons] = useState<IButtons[]>();
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dialogMenuType, setDialogMenuType] = useState<IDialog>("dialog");
  const [dialogText, setDialogText] = useState("");
  const openMenu = Boolean(anchorEl);
  const [coinAmount, setCoinAmount] = useState(1);
  const balance = useStoreState((store) => store.balance);
  const coinData = balance.filter(
    (el) => !el.tokenType && el.contractAddress.length > 10
  );
  const user = useStoreState((store) => store.user);

  const openDialogMenu = (type: IDialog) => {
    setAnchorEl(null);
    setOpenDialog(true);
    setDialogMenuType(type);
  };

  const sendCoins = () => {
    // @ts-ignore
    transferCoin(
      "DPT",
      coinData[0].tokenName,
      Number(coinAmount),
      message.data.senderWalletAddress
    )
      .then(() => {
        const textMessage =
          user.firstName +
          " " +
          user.lastName +
          " -> " +
          coinAmount +
          " " +
          coinData[0].tokenName +
          " -> " +
          message.data.senderFirstName +
          " " +
          message.data.senderLastName;

        xmpp.sendSystemMessage(
          message.roomJID,
          user.firstName,
          user.lastName,
          user.walletAddress,
          textMessage,
          null,
          message.id
        );

        setOpenDialog(false);
      })
      .catch((error) => {
        console.log(error);
        setDialogText("An error occurred during the coin transfer.");
        setDialogMenuType("error");
      });
  };

  const openPrivateRoom = () => {
    createPrivateChat(
      user.walletAddress,
      message.data.senderWalletAddress,
      user.firstName,
      message.data.senderFirstName,
      "@conference.dev.dxmpp.com",
      message.data.senderJID
    )
      .then((result) => {
        if (result.isNewRoom) {
          const temporaryRoomData = {
            jid: result.roomJid,
            name: result.roomName,
            room_background: "none",
            room_thumbnail: "none",
            users_cnt: "2",
            unreadMessages: 0,
            composing: "",
            toUpdate: true,
          };
          useStoreState.getState().setNewUserChatRoom(temporaryRoomData);
          chooseDirectRoom(result.roomJid);
        } else {
          chooseDirectRoom(result.roomJid);
        }
      })
      .catch((error) => {
        console.log("openPrivateRoom Error: ", error);
      });
  };

  const fullViewImage = () => {
    setOpenDialog(true);
    setDialogMenuType("image");
  };

  useEffect(() => {
    if (message.data.quickReplies) {
      setButtons(JSON.parse(message.data.quickReplies));
    }
  }, []);
  return (
    <div is={"Message"}>
      {position.separator ? (
        <MessageSeparator>{position.separator}</MessageSeparator>
      ) : null}
      <KitMessage
        model={{
          sender: firstName + " " + lastName,
          direction:
            String(userJid).split("/")[0] === String(messageJid).split("/")[0]
              ? "outgoing"
              : "incoming",
          position: position.position,
        }}
        avatarPosition={
          String(userJid).split("/")[0] === String(messageJid).split("/")[0]
            ? "tr"
            : "tl"
        }
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
                : "https://icotar.com/initials/" + firstName + " " + lastName
            }
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
              {String(userJid).split("/")[0] !==
              String(messageJid).split("/")[0] ? (
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={openMenu ? "long-menu" : undefined}
                  aria-expanded={openMenu ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={() => openDialogMenu("dialog")}
                >
                  <MoreVertIcon />
                </IconButton>
              ) : null}
            </span>
          )}

          {message.data.isMediafile &&
          message.data.mimetype.split("/")[0] === "image" ? (
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
          ) : null}

          {message.data.isMediafile &&
          message.data.mimetype.split("/")[0] === "application" ? (
            <a target="_blank" href={message.data.location}>
              <KitMessage.ImageContent
                src={message.data.locationPreview}
                alt={message.data.originalName}
                width={150}
              />
              {message.data.mimetype.split("/")[1]}
            </a>
          ) : null}

          {message.data.isMediafile &&
          message.data.mimetype.split("/")[0] === "video" ? (
            <video controls width="200px">
              <source
                src={message.data.location}
                type={message.data.mimetype}
                title={message.data.originalName}
              />
              Sorry, your browser doesn't support videos.
            </video>
          ) : null}

          {message.data.isMediafile &&
          message.data.mimetype.split("/")[0] === "audio" ? (
              <audio controls>
                  <source src={message.data.location} type={message.data.mimetype} />
                    Your browser does not support the audio element.
              </audio>
          ) : null}

        {!message.data.isMediafile ?
            <span dangerouslySetInnerHTML={{__html: message.body.replace(/\b(https?\:\/\/\S+)/mg, '<a href="$1">$1</a>')}}></span>
            : null
        }
      </KitMessage.CustomContent>

        {(position.type === "last" || position.type === "single") && (
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
        )}
      </KitMessage>
      {buttons ? (
      <Box sx={{ '& button': { m: 0.5 } }}>
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
              <Button variant="outlined" size="small" onClick={() => buttonSender(button)} key={index} >
                {button.name}
              </Button>
            );
          })}
        </div>
      </Box>
      ) : null}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth={"xl"}
      >
        <DialogContent>
          {dialogMenuType === "error" ? <div>{dialogText}</div> : null}

          {dialogMenuType === "dialog" ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                Reward{" "}
                <strong>
                  {message.data.senderFirstName +
                    " " +
                    message.data.senderLastName}
                </strong>{" "}
                with coins
              </div>
              <Slider
                aria-label="Coin amount"
                defaultValue={1}
                valueLabelDisplay="auto"
                step={2}
                marks
                min={1}
                max={7}
                value={coinAmount}
                onChange={(e, newValue) =>
                  setCoinAmount(newValue || newValue[0])
                }
                sx={{marginTop: '10px'}}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  {coinAmount}
                </Typography>
                <img
                  src={coin}
                  style={{ width: 30, height: 30 }}
                  alt={"coin"}
                />
              </Box>
                <Button onClick={sendCoins} variant="outlined" size="small">
                    Send coins
                </Button>
              <Divider style={{margin: "10px"}} />
                <Button onClick={openPrivateRoom} variant="outlined" startIcon={<SendIcon />}>
                    Direct message
                </Button>
                <Divider style={{margin: "10px"}} />
                <Button variant="contained" startIcon={<BlockIcon />}>
                    Block this user
                </Button>
                <Typography style={{textAlign: "center"}} variant="caption" display="block" gutterBottom>
                    Stop seeing this user.
                </Typography>
            </div>
          ) : null}

          {dialogMenuType === "image" ? (
            <div>
              <img
                src={message.data.location}
                alt={message.data.originalName}
                style={{ maxWidth: "100%" }}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};
