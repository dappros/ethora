import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Badge,
  Button,
  Chip,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "../context/SnackbarContext";
import {
  addTagToUser,
  deleteUsers,
  removeTagFromUser,
  resetUsersPasswords,
  setUserTags,
} from "../http";
import { ModalType, TSelectedIds } from "./UsersTable/UsersTable";
import { getUniqueTagsFromUsers } from "../utils/getUniqueTagsFromUsers";

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
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(false);

  const { showSnackbar } = useSnackbar();
  const selectedUsersIds = selectedUsers.map((i) => i._id);
  const uniqueTags = getUniqueTagsFromUsers(selectedUsers);
  const appId = selectedUsers?.[0]?.appId;
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const closeModal = () => {
    setInputValue("");
    setLoading(false);
    setInputError(false);

    onClose();
  };

  const addTag = async () => {
    const tags = inputValue.trim().split(",");

    const isTagsRepeated = selectedUsers.some((u) => {
      return u.tags.some((t) => tags.includes(t));
    });
    if (isTagsRepeated) {
      showSnackbar("error", "Tags cannot repeat");
      return;
    }
    setLoading(true);

    try {
      await addTagToUser(appId, tags, selectedUsersIds);
      await updateData();
      showSnackbar("success", "Tag added");
      closeModal();
    } catch (error) {
      showSnackbar("error", "Something went wrong");
    }
    await updateData();

    setLoading(false);
  };

  const removeTag = async (tag: string) => {
    setLoading(true);
    try {
      await removeTagFromUser(appId, [tag], selectedUsersIds);
      await updateData();

      showSnackbar("success", "Tag removed");
      closeModal();
    } catch (error) {
      console.log(error);
      showSnackbar("error", "Something went wrong");
    }
    setLoading(false);
  };
  const removeAllTags = async () => {
    setLoading(true);
    try {
      await setUserTags(appId, [], selectedUsersIds);
      await updateData();

      showSnackbar("success", "All tags removed");
      closeModal();
    } catch (error) {
      showSnackbar("error", "Something went wrong");
    }
    setLoading(false);
  };
  const resetPasswords = async () => {
    setLoading(true);

    try {
      await resetUsersPasswords(appId, selectedUsersIds);
      showSnackbar("success", "Passwords reseted");
      closeModal();
    } catch (error) {
      showSnackbar("error", "Something went wrong");
    }
    setLoading(false);
  };
  const deletePickedUsers = async () => {
    setLoading(true);
    try {
      await deleteUsers(appId, selectedUsersIds);
      await updateData();
      showSnackbar("success", "Users deleted");
      closeModal();
    } catch (error) {
      showSnackbar("error", "Something went wrong");
    }
    setLoading(false);
  };

  const onSubmit = () => {
    switch (type) {
      case "manageTags":
        return addTag();

      case "resetPassword":
        return resetPasswords();

      default:
        break;
    }
  };
  const renderDialogContent = () => {
    switch (type) {
      case "manageTags":
        return (
          <Box style={{ width: "450px", padding: 2 }}>
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                paddingX: 2,
              }}
            >
              Tags
            </DialogTitle>
            <Box
              sx={{
                paddingX: 2,
                pb: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {!uniqueTags.length && <Typography>No tags for selected users.</Typography>}
              {uniqueTags.map((t, i) => {
                return (
                  <Badge
                    key={i}
                    badgeContent={+t.count}
                    color={"secondary"}
                    variant={"standard"}
                  >
                    <Chip
                      color={"primary"}
                      label={t.tag}
                      onDelete={() => removeTag(t.tag)}
                    />
                  </Badge>
                );
              })}
            </Box>
            <Box sx={{ paddingX: 2 }}>
              <Typography sx={{ fontWeight: "bold" }}>Add Tags</Typography>
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
        <Button disabled={loading} onClick={closeModal} color="error">
          {"Cancel"}
        </Button>
        <Button
          disabled={loading}
          onClick={onSubmit}
          autoFocus
          color={"primary"}
        >
          {"Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
