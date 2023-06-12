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

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import { format } from "date-fns";
import { useStoreState } from "../../store";
import { useHistory } from "react-router";

const coin = "/coin.png";

export interface ITransactions {
  transactions: ITransaction[];
}

const TransactionItems: React.FC<{ item: ITransaction }> = ({ item }) => {
  const theme = useTheme();
  const walletAddress = useStoreState((state) => state.user.walletAddress);
  const isSender = item.from === walletAddress;
  const isTokenCreation = item.type === "Token Creation";
  const value = isTokenCreation && item.tokenId === "Doc" ? "1" : item.value;
  const [expanded, setExpanded] = useState(false);
  const history = useHistory();

  if (!item.fromFirstName) {
    return null;
  }
  const getArrowIcon = () => {
    if (isTokenCreation) {
      return <CloudUploadOutlinedIcon color={"primary"} fontSize={"small"} />;
    }
    if (isSender) {
      return <ArrowUpwardIcon color={"error"} fontSize={"small"} />;
    }
    return <ArrowDownwardIcon color={"success"} fontSize={"small"} />;
  };

  const getEndIcon = () => {
    if (item.tokenId === "Doc") {
      return <ArticleOutlinedIcon color={"primary"} fontSize={"small"} />;
    }
    if (item.tokenId === "NFT") {
      return <BackupTableIcon color={"primary"} fontSize={"small"} />;
    }
    return <img src={coin} style={{ width: 20, height: 20 }} alt={"coin"} />;
  };
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
              gap: 1,
            }}
          >
            {getArrowIcon()}
            <span>{value}</span>

            {getEndIcon()}
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
            {value}
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
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {transactions.map((item) => {
        return <TransactionItems item={item} key={item._id} />;
      })}
    </List>
  );
};
