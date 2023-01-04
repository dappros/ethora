import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface IProps {
  open: boolean;
  onClose: () => void;
  onDeletePress: () => void;
  loading: boolean;
  title: string;
  description: string;
  deleteButtonTitle?: string;
  cancelButtonTitle?: string;
}

export function DeleteDialog({
  open,
  onClose,
  onDeletePress,
  loading,
  title,
  description,
  deleteButtonTitle,
  cancelButtonTitle,
}: IProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={onClose}>
          {cancelButtonTitle || "Cancel"}
        </Button>
        <Button disabled={loading} onClick={onClose} autoFocus color={"error"}>
          {deleteButtonTitle || "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
