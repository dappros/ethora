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
  setUserTags,
} from "../http";
import { coinsMainName } from "../config/config";

type ModalType =
  | "deleteUser"
  | "addTag"
  | "removeTag"
  | "removeAllTags"
  | "sendTokens"
  | "resetPassword";
type TSelectedIds = { walletAddress: string; _id: string; appId: string };

type TProps = {
  open: boolean;
  type: ModalType;
  selectedUsers: TSelectedIds[];
  updateData: () => Promise<void>;
  onClose: () => void;
};

export function UsersActionModal({
  open,
  onClose,
  type,
  updateData,
  selectedUsers,
}: TProps) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoaging] = useState(false);
  const [inputError, setInputError] = useState(false);

  const { showSnackbar } = useSnackbar();
  const selectedUsersIds = selectedUsers.map((i) => i._id);
  const appId = selectedUsers?.[0]?.appId;
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
    const tags = inputValue.trim().split(",");
    try {
      await addTagToUser(appId, tags, selectedUsersIds);
      await updateData();
      showSnackbar("success", "Tag added");
      closeModal();
    } catch (error) {
      showSnackbar("error", "Something went wrong");
    }
    setLoaging(false);
  };

  const removeTag = async () => {
    const tags = inputValue.trim().split(",");

    setLoaging(true);
    try {
      await removeTagFromUser(appId, tags, selectedUsersIds);
      await updateData();

      showSnackbar("success", "Tag removed");
      closeModal();
    } catch (error) {
      showSnackbar("error", "Something went wrong");
    }
    setLoaging(false);
  };
  const removeAllTags = async () => {
    setLoaging(true);
    try {
      await setUserTags(appId, [], selectedUsersIds);
      await updateData();

      showSnackbar("success", "All tags removed");
      closeModal();
    } catch (error) {
      showSnackbar("error", "Something went wrong");
    }
    setLoaging(false);
  };
  const resetPasswords = async () => {
    setLoaging(true);

    try {
      await resetUsersPasswords(appId, selectedUsersIds);
      showSnackbar("success", "Passwords reseted");
      closeModal();
    } catch (error) {
      showSnackbar("error", "Something went wrong");
    }
    setLoaging(false);
  };
  const deletePickedUsers = async () => {
    setLoaging(true);
    try {
      await deleteUsers(appId, selectedUsersIds);
      await updateData();
      showSnackbar("success", "Users deleted");
      closeModal();
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
        return removeTag();

      case "removeAllTags":
        return removeAllTags();

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
                label="Provide tags separated by comma"
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
                label="Provide tags separated by comma"
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
              Are you sure you want to remove all tags from{" "}
              {selectedUsers.length} users?
            </DialogTitle>
          </Box>
        );
      case "deleteUser":
        return (
          <Box style={{ width: "350px" }}>
            <DialogTitle
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              Are you sure you want to delete {selectedUsers.length}{" "}
              {selectedUsers.length > 1 ? "users" : "user"}?
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
        <Button disabled={loading} onClick={onSubmit} autoFocus color={"error"}>
          {"Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
