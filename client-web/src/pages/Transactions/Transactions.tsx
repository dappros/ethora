import {
  Avatar,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { ITransaction } from "../Profile/types";

import coin from "../../assets/images/coin.png";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { format } from "date-fns";
import { useStoreState } from "../../store";
import { useHistory } from "react-router";

export interface ITransactions {
  transactions: ITransaction[];
}

const TransactionItems: React.FC<{ item: ITransaction }> = ({ item }) => {
  const theme = useTheme();
  const walletAddress = useStoreState((state) => state.user.walletAddress);
  const isSender = item.from === walletAddress;
  const [expanded, setExpanded] = useState(false);
  const history = useHistory();

  if (!item.fromFirstName) {
    return null;
  }

  return (
    <>
      <ListItem key={item.transactionHash}>
        <ListItemButton onClick={() => setExpanded((prev) => !prev)}>
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
              <p>{item.fromFirstName.slice(0, 2).toUpperCase()}</p>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item.fromFirstName + " " + item.fromLastName}
            secondary={format(new Date(item.timestamp), "pp PP")}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isSender ? (
              <ArrowUpwardIcon fontSize={"small"} color={"error"} />
            ) : (
              <ArrowDownwardIcon color={"success"} fontSize={"small"} />
            )}
            <span>{item.value}</span>
            <img src={coin} style={{ width: 20, height: 20 }} alt={"coin"} />
          </Box>
        </ListItemButton>
      </ListItem>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List dense>
          <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
            <span style={{ fontWeight: "bold" }}>Block Number:</span>{" "}
            {item.blockNumber}
          </ListItem>
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
          <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
            <span style={{ fontWeight: "bold" }}>To:</span>
            <span
              onClick={() => history.push("/explorer/address/" + item.to)}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              {item.to}
            </span>
          </ListItem>
          <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
            <span style={{ fontWeight: "bold" }}>Sender First Name:</span>
            {item.fromFirstName}
          </ListItem>
          <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
            <span style={{ fontWeight: "bold" }}>Sender Last Name:</span>
            {item.fromLastName}
          </ListItem>
          <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
            <span style={{ fontWeight: "bold" }}>Timestamp:</span>{" "}
            {format(new Date(item.timestamp), "pp PP")}
          </ListItem>
          <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
            <span style={{ fontWeight: "bold" }}>Receiver First Name:</span>
            {item.toFirstName}
          </ListItem>
          <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
            <span style={{ fontWeight: "bold" }}>Receiver Last Name:</span>
            {item.toLastName}
          </ListItem>
          <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
            <span style={{ fontWeight: "bold" }}>Token Name:</span>
            {item.tokenName}
          </ListItem>
          <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
            <span style={{ fontWeight: "bold" }}>Transaction Index:</span>
            {item.transactionIndex}
          </ListItem>
          <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
            <span style={{ fontWeight: "bold" }}>Type:</span>
            {item.type}
          </ListItem>
          <ListItem disablePadding disableGutters style={{ paddingLeft: 25 }}>
            <span style={{ fontWeight: "bold" }}>Value:</span>
            {item.value}
          </ListItem>
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

export const Transactions: React.FC<ITransactions> = ({ transactions }) => {
  const theme = useTheme();
  const walletAddress = useStoreState((state) => state.user.walletAddress);
  console.log({ transactions });
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {transactions.map((item) => {
        return <TransactionItems item={item} key={item._id} />;
      })}
    </List>
  );
};
