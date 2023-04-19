import {
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface UsersTableToolbarProps {
  selected: readonly string[];
  onButtonClick: (type: ModalType) => void;
}
type ModalType =
  | "deleteUser"
  | "addTag"
  | "removeTag"
  | "removeAllTags"
  | "sendTokens"
  | "resetPassword";

export function UsersTableToolbar({
  selected,
  onButtonClick,
}: UsersTableToolbarProps) {
  if (selected.length) {
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }}
      >
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selected.length} selected
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant={"outlined"}
            onClick={() => onButtonClick("sendTokens")}
            sx={{ width: "150px" }}
          >
            Send Tokens
          </Button>
          <Button
            variant={"outlined"}
            onClick={() => onButtonClick("addTag")}
            sx={{ width: "120px" }}
          >
            Add Tag
          </Button>
          <Button
            variant={"outlined"}
            onClick={() => onButtonClick("removeAllTags")}
            sx={{ width: "200px" }}
          >
            Remove All Tags
          </Button>
          <Button
            variant={"outlined"}
            onClick={() => onButtonClick("removeTag")}
            sx={{ width: "150px" }}
          >
            Remove Tag
          </Button>

          <Button
            variant={"outlined"}
            onClick={() => onButtonClick("resetPassword")}
            sx={{ width: "200px" }}
          >
            Reset Passwords
          </Button>

          <Tooltip title="Delete">
            <IconButton onClick={() => onButtonClick("deleteUser")}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    );
  }
}
