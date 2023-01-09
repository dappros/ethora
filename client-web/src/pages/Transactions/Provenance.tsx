import {
  Avatar,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Typography,
} from "@mui/material";
import { Box, useTheme } from "@mui/system";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { getProvenanceTransacitons, IDocument } from "../../http";
import { TBalance } from "../../store";
import { ITransaction } from "../Profile/types";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { FullPageSpinner } from "../../componets/FullPageSpinner";

export interface IProvenance {}

const tokenTypes = {
  creation: "Token Creation",
};

const UserBlock = ({
  name,
  balance,
  total,
}: {
  name: string;
  balance: string;
  total: string;
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "30%" }}>
      <Box>
        <ListItemAvatar>
          <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
            <Typography>{name.slice(0, 2)}</Typography>
          </Avatar>
        </ListItemAvatar>
      </Box>
      <Box ml={"2"}>
        <Box>
          <Typography>{name}</Typography>
          {!!balance && (
            <Typography>
              {balance}/{total}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const TransactionItem: React.FC<{ item: ITransaction }> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const history = useHistory();
  const senderName =
    (item.senderFirstName || "") + " " + (item.senderLastName || "");
  const receiverName =
    (item.receiverFirstName || "") + " " + (item.receiverLastName || "");
  return (
    <>
      <ListItem key={item.transactionHash}>
        <ListItemButton
          onClick={() => setExpanded((prev) => !prev)}
          // sx={{ display: "flex", justifyContent: "space-between" }}
        >
          {item.type === tokenTypes.creation ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "30%",
              }}
            >
              <Typography fontSize={14} color={"black"} fontWeight={"bold"}>
                {item.tokenName || item.nftName || "Item"}
              </Typography>
            </Box>
          ) : (
            <UserBlock
              balance={item.senderBalance}
              total={item.nftTotal}
              name={senderName}
            />
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "30%",
              paddingLeft: "20px",
            }}
          >
            {item.type === tokenTypes.creation ? (
              <Typography fontSize={14} color={"black"} fontWeight={"bold"}>
                Was created by
              </Typography>
            ) : (
              <ArrowRightAltIcon color={"success"} fontSize={"small"} />
            )}
          </Box>
          <UserBlock
            balance={item.receiverBalance}
            total={item.nftTotal}
            name={receiverName}
          />
          <Typography>{item.value}</Typography>
        </ListItemButton>
      </ListItem>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List dense>
          {!!item.blockNumber && (
            <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
              <span style={{ fontWeight: "bold" }}>Block Number:</span>{" "}
              {item.blockNumber}
            </ListItem>
          )}
          <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
            <span style={{ fontWeight: "bold" }}>From:</span>{" "}
            <span>
              <span
                onClick={() => history.push("/explorer/address/" + item.from)}
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                {item.from}
              </span>
            </span>
          </ListItem>{" "}
          {!!item.to && (
            <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
              <span style={{ fontWeight: "bold" }}>To:</span>
              <span
                onClick={() => history.push("/explorer/address/" + item.to)}
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                {item.to}
              </span>
            </ListItem>
          )}
          {!!item.fromFirstName && (
            <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
              <span style={{ fontWeight: "bold" }}>Sender First Name:</span>
              {item.fromFirstName}
            </ListItem>
          )}
          {!!item.fromLastName && (
            <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
              <span style={{ fontWeight: "bold" }}>Sender Last Name:</span>
              {item.fromLastName}
            </ListItem>
          )}
          {!!item.timestamp && (
            <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
              <span style={{ fontWeight: "bold" }}>Timestamp:</span>{" "}
              {format(new Date(item.timestamp), "pp PP")}
            </ListItem>
          )}
          {!!item.toFirstName && (
            <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
              <span style={{ fontWeight: "bold" }}>Receiver First Name:</span>
              {item.toFirstName}
            </ListItem>
          )}
          {!!item.toLastName && (
            <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
              <span style={{ fontWeight: "bold" }}>Receiver Last Name:</span>
              {item.toLastName}
            </ListItem>
          )}
          {!!item.tokenName && (
            <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
              <span style={{ fontWeight: "bold" }}>Token Name:</span>
              {item.tokenName}
            </ListItem>
          )}
          {!!item.transactionIndex && (
            <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
              <span style={{ fontWeight: "bold" }}>Transaction Index:</span>
              {item.transactionIndex}
            </ListItem>
          )}
          {!!item.type && (
            <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
              <span style={{ fontWeight: "bold" }}>Type:</span>
              {item.type}
            </ListItem>
          )}
          {!!item.value && (
            <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
              <span style={{ fontWeight: "bold" }}>Value:</span>
              {item.value}
            </ListItem>
          )}
          {!!item.transactionHash && (
            <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
              <span style={{ fontWeight: "bold" }}>Transaction Hash:</span>
              <span
                onClick={() =>
                  history.push("/explorer/transactions/" + item.transactionHash)
                }
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                {item.transactionHash}
              </span>
            </ListItem>
          )}
          <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
            <span style={{ fontWeight: "bold" }}>Token Id:</span>
            {item.tokenId}
          </ListItem>
          <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
            <span style={{ fontWeight: "bold" }}>_id:</span>
            {item._id}
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};

const Provenance: React.FC<IProvenance> = ({}) => {
  const location = useLocation<{
    nftItem: TBalance & IDocument;
    walletAddress: string;
  }>();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const nftItem = location.state.nftItem;
  const getTransactions = async () => {
    setLoading(true);
    try {
      const res = await getProvenanceTransacitons(
        location.state.walletAddress,
        nftItem.nftId || nftItem._id
      );
      setTransactions(res.data.items.reverse());
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getTransactions();
  }, []);
  if (!location.state.walletAddress) return <p>No Data</p>;
  if (loading) return <FullPageSpinner />;
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          height: "300px",
          display: "flex",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        <img
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          src={
            nftItem.nftFileUrl ||
            nftItem?.file?.locationPreview ||
            nftItem?.location
          }
          alt="image1"
        />
        <Box sx={{ padding: "10px" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: 18 }}>
            {nftItem.tokenName || nftItem.documentName}
          </Typography>
          {!!nftItem.balance && (
            <Typography sx={{ fontWeight: "bold", fontSize: 18 }}>
              {nftItem.balance}/{nftItem.total}
            </Typography>
          )}
        </Box>
      </Box>
      <List>
        {transactions.map((item) => {
          return <TransactionItem item={item} key={item._id} />;
        })}
      </List>
    </Box>
  );
};
export default Provenance;
