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
import { ModalType } from "./UsersTable";
type TSelectedIds = { walletAddress: string; _id: string; appId: string };

interface UsersTableToolbarProps {
  selected: TSelectedIds[];
  onButtonClick: (type: ModalType) => void;
}


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
          display: "flex",
          justifyContent: "space-between",

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
          sx={{ minWidth: 200 }}
        >
          {selected.length} selected
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexDirection: { xs: "row", md: "row" },
            flexWrap: "wrap",
          }}
        >
          {/* <Button
            variant={"outlined"}
            onClick={() => onButtonClick("sendTokens")}
            sx={{minWidth: 'max-content'}}
          >
            Send Tokens
          </Button> */}
         
          <Button
            variant={"outlined"}
            onClick={() => onButtonClick('manageTags')}
            sx={{ minWidth: "max-content" }}
          >
            Manage Tags
          </Button>

          <Button
            variant={"outlined"}
            onClick={() => onButtonClick("resetPassword")}
            sx={{ minWidth: "max-content" }}
          >
            Reset Password
          </Button>

          <Tooltip title="Delete users">
            <IconButton onClick={() => onButtonClick("deleteUser")}>
              <DeleteIcon color="error" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    );
  }
}
