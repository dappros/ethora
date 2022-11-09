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

const DocumentItems = ({ item }: { item: http.IDocument }) => {
  const theme = useTheme();
  return (
    <ListItem key={item._id}>
      <ListItemButton>
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
          <IconButton sx={{color: 'black'}}>
            <QrCodeIcon/>
          </IconButton>
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

export default function DocumentsTable({
  documents,
}: {
  documents: http.IDocument[];
}) {
 
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {documents.map((item) => {
        return <DocumentItems item={item} key={item._id} />;
      })}
    </List>
  );
}
