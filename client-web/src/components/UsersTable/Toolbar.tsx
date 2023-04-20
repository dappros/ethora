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
          display: 'flex',
          justifyContent: 'space-between',
         
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }}
      >
        <Typography
          color="inherit"
          variant="subtitle1"
          component="div"
          sx={{minWidth: 200}}
        >
          {selected.length} selected
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexDirection:  { xs: 'row', md: 'row' }, flexWrap: 'wrap' }}>
          <Button
            variant={"outlined"}
            onClick={() => onButtonClick("sendTokens")}
            sx={{minWidth: 'max-content'}}
          >
            Send Tokens
          </Button>
          <Button
            variant={"outlined"}
            onClick={() => onButtonClick("addTag")}
            sx={{minWidth: 'max-content'}}

          >
            Add Tag
          </Button>
          <Button
            variant={"outlined"}
            onClick={() => onButtonClick("removeAllTags")}
            sx={{minWidth: 'max-content'}}

          >
            Remove All Tags
          </Button>
          <Button
            variant={"outlined"}
            onClick={() => onButtonClick("removeTag")}
            sx={{minWidth: 'max-content'}}

          >
            Remove Tag
          </Button>

          <Button
            variant={"outlined"}
            onClick={() => onButtonClick("resetPassword")}
            sx={{minWidth: 'max-content'}}

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
