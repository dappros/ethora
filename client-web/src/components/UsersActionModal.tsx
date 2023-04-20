import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button, DialogActions, TextField } from "@mui/material";
import { useSnackbar } from "../context/SnackbarContext";
import {
  TTransferToUser,
  addTagToUser,
  deleteUsers,
  removeTagFromUser,
  resetUsersPasswords,
  sendTokens,
} from "../http";
import { coinsMainName } from "../config/config";

type ModalType =
  | "deleteUser"
  | "addTag"
  | "removeTag"
  | "removeAllTags"
  | "sendTokens"
  | "resetPassword";
type TSelectedIds = { walletAddress: string; _id: string };

type TProps = {
  open: boolean;
  type: ModalType;
  selectedUsers: TSelectedIds[];
  onClose: () => void;
};

export function UsersActionModal({
  open,
  onClose,
  type,
  selectedUsers,
}: TProps) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoaging] = useState(false);
  const [inputError, setInputError] = useState(false);

  const { showSnackbar } = useSnackbar();
  const selectedUsersIds = selectedUsers.map((i) => i._id);
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const closeModal = () => {
    setInputValue("");
    setLoaging(false);
    setInputError(false);

    onClose();
  };

  const addTag = async () => {
    setLoaging(true);
    try {
      await addTagToUser(inputValue, selectedUsersIds);
      showSnackbar("success", "Tag added");
    } catch (error) {
      showSnackbar("error", "Something went wrong");
    }
    setLoaging(false);
  };
  const sendTokensToUsers = async () => {
    setLoaging(true);
    const totalAmount = +inputValue * selectedUsers.length;
    const usersForTransfer: TTransferToUser[] = selectedUsers.map((u) => ({
      walletAddress: u.walletAddress,
      amount: inputValue,
    }));
    try {
      await sendTokens(usersForTransfer, totalAmount, coinsMainName);
      showSnackbar("success", "Tokens sent");
    } catch (error) {
      showSnackbar("error", "Something went wrong");
    }
    setLoaging(false);
  };
  const removeTag = async (removeAll: boolean) => {
    setLoaging(true);
    try {
      await removeTagFromUser(inputValue, selectedUsersIds, removeAll);
      showSnackbar("success", "Tag removed");
    } catch (error) {
      showSnackbar("error", "Something went wrong");
    }
    setLoaging(false);
  };
  const resetPasswords = async () => {
    setLoaging(true);
    try {
      await resetUsersPasswords(selectedUsersIds);
      showSnackbar("success", "Passwords reseted");
    } catch (error) {
      showSnackbar("error", "Something went wrong");
    }
    setLoaging(false);
  };
  const deletePickedUsers = async () => {
    setLoaging(true);
    try {
      await deleteUsers(selectedUsersIds);
      showSnackbar("success", "Users deleted");
    } catch (error) {
      showSnackbar("error", "Something went wrong");
    }
    setLoaging(false);
  };

  const onSubmit = () => {
    switch (type) {
      case "deleteUser":
        return deletePickedUsers();
      case "addTag":
        if (!inputValue) {
          setInputError(true);
          return;
        }
        return addTag();

      case "removeTag":
        if (!inputValue) {
          setInputError(true);

          return;
        }
        return removeTag(false);

      case "removeAllTags":
        return removeTag(true);

      case "sendTokens":
        if (!inputValue) {
          setInputError(true);

          return;
        }
        return sendTokensToUsers();

      case "resetPassword":
        return resetPasswords();

      default:
        break;
    }
  };
  const renderDialogContent = () => {
    switch (type) {
      case "addTag":
        return (
          <Box style={{ width: "350px" }}>
            <DialogTitle
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              Add Tags
            </DialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                pl: 3,
                pr: 3,
              }}
            >
              <TextField
                error={inputError}
                fullWidth
                margin="dense"
                label="Tags"
                name="tags"
                type="tags"
                variant="outlined"
                onChange={handleChangeInput}
                value={inputValue}
              />
            </Box>
          </Box>
        );
      case "removeTag":
        return (
          <Box style={{ width: "350px" }}>
            <DialogTitle
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              Remove Tags
            </DialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                pl: 3,
                pr: 3,
              }}
            >
              <TextField
                error={inputError}
                fullWidth
                margin="dense"
                label="Tags"
                name="tags"
                type="tags"
                variant="outlined"
                onChange={handleChangeInput}
                value={inputValue}
              />
            </Box>
          </Box>
        );
      case "removeAllTags":
        return (
          <Box style={{ width: "350px" }}>
            <DialogTitle
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              Are you sure you want to remove all Tags?
            </DialogTitle>
          </Box>
        );
      case "deleteUser":
        return (
          <Box style={{ width: "350px" }}>
            <DialogTitle
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              Are you sure you want to delete user?
            </DialogTitle>
          </Box>
        );
      case "resetPassword":
        return (
          <Box style={{ width: "350px" }}>
            <DialogTitle
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              Are you sure you want to force a password reset for{" "}
              {selectedUsers.length} users?
            </DialogTitle>
          </Box>
        );
      case "sendTokens":
        return (
          <Box style={{ width: "350px" }}>
            <DialogTitle
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              Send Tokens
            </DialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                pl: 3,
                pr: 3,
              }}
            >
              <TextField
                error={inputError}
                fullWidth
                margin="dense"
                label="Number of tokens"
                name="tokens"
                type="tokens"
                variant="outlined"
                onChange={handleChangeInput}
                value={inputValue}
              />
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog maxWidth={false} open={open} onClose={closeModal}>
      <Box sx={{ position: "absolute", top: 0, right: 0 }}>
        <IconButton onClick={closeModal}>
          <CloseIcon />
        </IconButton>
      </Box>
      {renderDialogContent()}
      <DialogActions>
        <Button disabled={loading} onClick={closeModal}>
          {"Cancel"}
        </Button>
        <Button
            disabled={loading}
          onClick={onSubmit}
          autoFocus
          color={"error"}
        >
          {"Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
