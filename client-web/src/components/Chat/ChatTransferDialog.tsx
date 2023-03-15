import React, { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  Divider,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import { transferCoin } from "../../http";


import SendIcon from "@mui/icons-material/Send";
import BlockIcon from "@mui/icons-material/Block";
import xmpp from "../../xmpp";
import { TMessageHistory, useStoreState } from "../../store";
import { coinReplacedName, coinsMainName } from "../../config/config";
import { DOMAIN } from "../../constants";
import { createPrivateChat } from "../../helpers/chat/createPrivateChat";
import { useSnackbar } from "../../context/SnackbarContext";
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import { walletToUsername } from "../../utils/walletManipulation";
const coin = '/coin.png'

const dialogItems = [1, 3, 5, "x"];
interface IProps {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  message: TMessageHistory | null;
  onPrivateRoomClick: (jid: string) => void;
  onThreadClick:() => void;
  onEditClick:(value:boolean, message:TMessageHistory) => void;
  onDeleteClick:(value:boolean, message:TMessageHistory) => void;
}
type IDialog = "dialog" | "error" | "clarification" | "transfer";

const dialogTypes: Record<IDialog, IDialog> = {
  dialog: "dialog",
  error: "error",
  clarification: "clarification",
  transfer: "transfer",
};

export function ChatTransferDialog({
  open,
  onClose,
  loading,
  message,
  onPrivateRoomClick,
  onThreadClick,
  onEditClick,
  onDeleteClick
}: IProps) {
  const user = useStoreState((state) => state.user);

  const [coinAmount, setCoinAmount] = useState(1);
  const [dialogType, setDialogType] = useState<IDialog>(dialogTypes.dialog);

  const balance = useStoreState((store) => store.balance);
  const setNewUserChatRoom = useStoreState((store) => store.setNewUserChatRoom);
  const { showSnackbar } = useSnackbar();

  const messageJid = message?.data?.senderJID.split('/')[0];
  const userJid = useMemo(() => walletToUsername(user.walletAddress) + DOMAIN, []);
  const isSameUser = userJid === messageJid;
  const coinData = balance.filter(
    (el) => !el.tokenType && el.contractAddress.length > 10
  );

  const openThreadView = () => {
    onThreadClick()
    onClose()
  }
  
  const openEditView = () => {
    onEditClick(true, message);
    onClose();
  }

  const handleDelete = () => {
    onDeleteClick(true, message);
    onClose();
  }

  const userToBlackList = (step: "clarify" | "block") => {
    if (step === "clarify") {
      setDialogType(dialogTypes.clarification);
      return;
    }

    if (step === "block") {
      xmpp.blacklistUser(message.data.senderJID);
      xmpp.getBlackList();
      useStoreState
        .getState()
        .removeAllInMessageHistory(message.data.senderJID);
    }
    onClose();
  };

  const sendCoins = async (amount?: number) => {
    const currentCoinAmount = amount ? Number(amount) : Number(coinAmount);
    try {
      const res = await transferCoin(
        "DPT",
        coinData[0].tokenName,
        currentCoinAmount,
        message.data.senderWalletAddress
      );
      const coinName =
        coinData[0].tokenName === coinsMainName
          ? coinReplacedName
          : coinData[0].tokenName;
      const sender = user.firstName + " " + user.lastName;
      const receiver =
        message.data.senderFirstName + " " + message.data.senderLastName;
      const textMessage = `${sender} -> ${coinAmount} ${coinName} -> ${receiver}`;
      const transactionId = res.data.transaction._id;
      xmpp.sendSystemMessage(
        message.roomJID,
        user.firstName,
        user.lastName,
        user.walletAddress,
        textMessage,
        currentCoinAmount,
        message.id,
        transactionId
      );

      onClose();
    } catch (error) {
      console.log(error);
      showSnackbar("error", "An error occurred during the coin transfer.");
      onClose();
    }
  };

  const openPrivateRoom = () => {
    createPrivateChat(
      user.walletAddress,
      message.data.senderWalletAddress,
      user.firstName,
      message.data.senderFirstName,
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
            description: "",
          };
          setNewUserChatRoom(temporaryRoomData);
          onPrivateRoomClick(result.roomJid);
        } else {
          onPrivateRoomClick(result.roomJid);
        }
      })
      .catch((error) => {
        console.log("openPrivateRoom Error: ", error);
      });
    onClose();
  };

  const renderDialogContent = () => {
    if (!message) return null;
    switch (dialogType) {
      case dialogTypes.clarification:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {"Are you sure you want to block the user?"}
            <Button
              onClick={() => userToBlackList("block")}
              variant="outlined"
              size="small"
            >
              To block list
            </Button>
          </div>
        );
      case dialogTypes.dialog:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {!isSameUser&&<div>
              Reward{" "}
              <strong>
                {message.data.senderFirstName +
                  " " +
                  message.data.senderLastName}
              </strong>{" "}
              with coins
            </div>}

            {!isSameUser&&<div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "10px 0px 10px 0px",
              }}
            >
              {dialogItems.map((item) => (
                <div
                  key={item}
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    typeof item === "number"
                      ? sendCoins(item)
                      : setDialogType(dialogTypes.transfer);
                  }}
                >
                  <img
                    src={coin}
                    style={{
                      width: 25,
                      height: 25,
                    }}
                    alt={"coin"}
                  />
                  <Typography
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {item}
                  </Typography>
                </div>
              ))}
            </div>}
            {!isSameUser&&<Divider
              style={{
                margin: "10px",
              }}
            />}
            {!isSameUser&&<Button
              onClick={openPrivateRoom}
              variant="outlined"
              startIcon={<SendIcon />}
            >
              Direct message
            </Button>}
            <Button
              style={{
                margin: "10px 0px 0px 0px",
              }}
              onClick={openThreadView}
              variant="outlined"
              startIcon={<ReplyIcon />}
            >
              Reply
            </Button>

            {isSameUser&&
              <Button
                style={{
                  margin: "10px 0px 0px 0px",
                }}
                onClick={openEditView}
                variant="outlined"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            }

            {isSameUser&&
              <Button
                style={{
                  margin: "10px 0px 0px 0px",
                }}
                onClick={handleDelete}
                variant="outlined"
                startIcon={<EditIcon />}
              >
                Delete
              </Button>
            }
              
              {!isSameUser&&<Divider
              style={{
                margin: "10px",
              }}
            />}
            {!isSameUser&&<div
            style={{
              display:'flex',
              alignItems:"center",
              flexDirection:"column"
            }}
            >
              <Button
                onClick={() => userToBlackList("clarify")}
                variant="contained"
                startIcon={<BlockIcon />}
              >
                Block this user
              </Button>
              <Typography
                style={{
                  textAlign: "center",
                }}
                variant="caption"
                display="block"
                gutterBottom
              >
                Stop seeing this user.
              </Typography>
            </div>}
          </div>
        );
      case dialogTypes.transfer:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              id="standard-basic"
              type={"number"}
              label="Enter transfer amount"
              variant="standard"
              onChange={(event) => setCoinAmount(Number(event.target.value))}
            />
            <Button
              style={{
                marginTop: 10,
              }}
              onClick={() => sendCoins()}
              variant="outlined"
              size="small"
            >
              Send coins
            </Button>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth={"xl"}>
      <DialogContent>{renderDialogContent()}</DialogContent>
    </Dialog>
  );
}
