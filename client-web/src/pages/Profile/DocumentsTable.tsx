import * as React from "react";

import { Box } from "@mui/system";
import * as http from "../../http";

import QrCodeIcon from "@mui/icons-material/QrCode";
import {
  Avatar,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";
import { useHistory } from "react-router";

const DocumentItem = ({
  item,
  walletAddress,
}: {
  item: http.IDocument;
  walletAddress: string;
}) => {
  const theme = useTheme();
  const history = useHistory();
  const onItemClick = () => {
    history.push({
      pathname: "/provenance",
      state: { nftItem: item, walletAddress },
    });
  };
  return (
    <ListItem key={item._id}>
      <ListItemButton onClick={onItemClick}>
        <ListItemAvatar>
          <Avatar
            style={{ backgroundColor: theme.palette.primary.main }}
            src={item.file.locationPreview}
          />
        </ListItemAvatar>
        <ListItemText
          primary={item.documentName}
          secondary={format(new Date(item.createdAt), "pp PP")}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton sx={{ color: "black" }}>
            <QrCodeIcon />
          </IconButton>
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

export default function DocumentsTable({
  documents,
  walletAddress,
}: {
  documents: http.IDocument[];
  walletAddress: string;
}) {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {documents.map((item) => {
        return (
          <DocumentItem
            walletAddress={walletAddress}
            item={item}
            key={item._id}
          />
        );
      })}
    </List>
  );
}
