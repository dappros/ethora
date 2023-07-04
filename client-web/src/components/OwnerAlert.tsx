import React from "react";
import { Alert, AlertTitle, IconButton, List, ListItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface IOwnerAlert {
  onClose: () => void;
}

export const OwnerAlert: React.FC<IOwnerAlert> = ({ onClose }) => {
  return (
    <Alert
      severity={"info"}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={onClose}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      <AlertTitle>Apps</AlertTitle>
      Here you can Create, Manage and View applications depending on your
      permissions.
      <List
        dense
        sx={{
          listStyleType: "disc",
          listStylePosition: "inside",
        }}
      >
        <ListItem sx={{ display: "list-item" }}>
          Create: use the blue “+” icon.
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          Manage / View: click one of the available apps in the list.
        </ListItem>
      </List>
    </Alert>
  );
};
