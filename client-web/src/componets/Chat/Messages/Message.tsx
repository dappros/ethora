import React, {useEffect, useState} from "react";
import { Message as KitMessage, MessageModel, Button, MessageSeparator } from "@chatscope/chat-ui-kit-react";
import { differenceInHours, format, formatDistance, subDays } from "date-fns";
import {TMessageHistory, useStoreState} from "../../../store";
import {useHistory} from "react-router";
import {
  Card, CardActionArea, CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton, Menu, MenuItem, TextField,
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {transferCoin} from "../../../http";
import xmpp from "../../../xmpp";
import {createPrivateChat} from "../../../helpers/chat/createPrivateChat";

export interface IMessage {
  message: TMessageHistory;
  userJid: string;
  position: {
    type: string;
    position: MessageModel['position'];
    separator?: string;
  };
  is?: string;
  buttonSender: any;
  chooseDirectRoom: any;
}

export interface IButtons {
  name: string;
  notDisplayedValue: string;
  value: string
}

type IDialog = "transfer" | "image" | "ban" | "error";

export const Message: React.FC<IMessage> = ({
  message,
  userJid,
  position,
  buttonSender,
  chooseDirectRoom
}) => {
  const firstName = message.data.senderFirstName;
  const lastName = message.data.senderLastName;
  const messageJid = message.data.senderJID;
  const history = useHistory();
  const [buttons, setButtons] = useState<IButtons[]>();
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dialogMenuType, setDialogMenuType] = useState<IDialog>("transfer");
  const [dialogText, setDialogText] = useState("");
  const openMenu = Boolean(anchorEl);
  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [coinAmount, setCoinAmount] = useState("");
  const balance = useStoreState((store) => store.balance);
  const coinData = balance.filter(el => !el.tokenType && el.contractAddress.length > 10)
  const user = useStoreState((store) => store.user);

  const openDialogMenu = (type: IDialog) => {
    setAnchorEl(null)
    setOpenDialog(true);
    setDialogMenuType(type);
  }

  const sendCoins = () => {
    // @ts-ignore
    transferCoin(coinData[0].tokenSymbol, coinData[0].tokenName, Number(coinAmount), message.data.senderWalletAddress).then(() => {
      const textMessage = user.firstName + " " + user.lastName + " -> " + coinAmount + " " + coinData[0].tokenName + " -> " + message.data.senderFirstName + " " + message.data.senderLastName;

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
    }).catch(error => {
      console.log(error);
      setDialogText("An error occurred during the coin transfer.");
      setDialogMenuType("error");
    })
  }

  const openPrivateRoom = () => {
    createPrivateChat(
        user.walletAddress,
        message.data.senderWalletAddress,
        user.firstName,
        message.data.senderFirstName,
        '@conference.dev.dxmpp.com',
        message.data.senderJID
    ).then(result => {
          if(result.isNewRoom){
            useStoreState.getState().setLoaderArchive(true);
            const temporaryRoomData = {
              jid: result.roomJid,
              name: result.roomName,
              room_background: "none",
              room_thumbnail: "none",
              users_cnt: "2",
              unreadMessages: 0,
              composing: "",
              toUpdate: true
            }
            useStoreState.getState().setNewUserChatRoom(temporaryRoomData);
            console.log("SAVE ROOM TO LIST => ", useStoreState.getState().userChatRooms)
            chooseDirectRoom(result.roomJid)
            xmpp.getRooms();
          }else{
            chooseDirectRoom(result.roomJid)
          }
    }).catch(error => {
      console.log("openPrivateRoom Error: ", error);
    })
  }

  const fullViewImage = () => {
    setOpenDialog(true);
    setDialogMenuType("image");
  }

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
          src={message.data.photoURL ? message.data.photoURL : "https://icotar.com/initials/" + firstName + " " + lastName}
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
            <span style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <strong style={{cursor: "pointer"}} onClick={() => history.push("/profile/" + message.data.senderWalletAddress)}>
                {firstName} {lastName}
                <br />
              </strong>
              {String(userJid).split("/")[0] !== String(messageJid).split("/")[0] ?
                  <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={openMenu ? 'long-menu' : undefined}
                      aria-expanded={openMenu ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={handleClickMenu}
                  >
                    <MoreVertIcon />
                  </IconButton>
              :null
              }
            </span>
        )}

        {message.data.isMediafile && message.data.mimetype.split("/")[0] === "image"?
            <Card sx={{ maxWidth: 200 }}>
              <CardActionArea onClick={fullViewImage}>
                <CardMedia
                    style={{height: 150, objectFit: "cover", objectPosition: "left"}}
                    component="img"
                    height="150"
                    image={message.data.location}
                    alt={message.data.originalName}
                />
              </CardActionArea>
            </Card>
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
            <span dangerouslySetInnerHTML={{__html: message.body.replace(/\b(https?\:\/\/\S+)/mg, '<a href="$1">$1</a>')}}></span>
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
    <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
    >
      <MenuItem onClick={() => openDialogMenu("transfer")}>Transfer coins</MenuItem>
      <MenuItem onClick={openPrivateRoom}>Direct message</MenuItem>
      {/*<MenuItem onClick={() => setAnchorEl(null)}>Ban this user</MenuItem>*/}
    </Menu>

    <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(true)}
        maxWidth={"xl"}
        aria-labelledby="responsive-dialog-title"
    >
      <DialogContent>
        {dialogMenuType === "error" ?
            <div>
              {dialogText}
            </div>
            :null
        }

        {dialogMenuType === "transfer" ?
            <div style={{display: "flex", flexDirection: "column"}}>
              Rewards <strong>{coinData[0].tokenName}</strong> with coins
              <TextField id="outlined-basic" label="Outlined" type={"number"} variant="outlined" value={coinAmount} onChange={event => setCoinAmount(event.target.value)} />
              <Button onClick={sendCoins}>Send</Button>
            </div>
        :null
        }

        {dialogMenuType === "image" ?
            <div>
              <img src={message.data.location} alt={message.data.originalName} style={{maxWidth: "100%"}} />
            </div>
        :null
        }

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
