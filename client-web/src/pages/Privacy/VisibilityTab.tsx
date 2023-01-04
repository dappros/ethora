import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useSnackbar } from "../../context/SnackbarContext";
import { changeUserData } from "../../http";
import { useStoreState } from "../../store";

interface VisibilityProps {
  handleChangeTab: (event: React.SyntheticEvent, newValue: number) => void;
}

const state: Record<string, string> = {
  open: "true",
  restricted: "false",
  full: "true",
  individual: "false",
};

export const Visibility: React.FC<VisibilityProps> = ({ handleChangeTab }) => {
  const updateUserProfilePermission = useStoreState(
    (state) => state.updateUserProfilePermission
  );
  const updateUserDocumentsPermission = useStoreState(
    (state) => state.updateUserDocumentsPermission
  );
  const user = useStoreState((state) => state.user);

  const [profileVisibility, setProfileVisibility] = useState(
    user.isProfileOpen ? "open" : "restricted"
  );
  const [isAssetsOpen, setIsAssetsOpen] = useState(
    user.isAssetsOpen ? "full" : "individual"
  );
  const [loading, setLoading] = useState<"assets" | "profile" | null>(null);
  const { showSnackbar } = useSnackbar();
  console.log(isAssetsOpen);
  const updateProfileVisibility = async (value: string) => {
    const profileStateToSave = value === "full" ? true : false;
    const profileState = state[value];
    setLoading("profile");

    try {
      const formData = new FormData();
      formData.append("isProfileOpen", profileState);
      const { data } = await changeUserData(formData);

      showSnackbar("success", "Profile permissions updated");
      updateUserProfilePermission(profileStateToSave);
      setProfileVisibility(value);
    } catch (error) {
      console.log(error);
    }
    setLoading(null);
  };

  const updateAssetsVisibility = async (value: string) => {
    setLoading("assets");
    const assetsStateToSave = value === "full" ? true : false;

    const assetsState = state[value];
    try {
      const formData = new FormData();
      formData.append("isAssetsOpen", assetsState);
      const { data } = await changeUserData(formData);

      showSnackbar("success", "Assets permissions updated");

      updateUserDocumentsPermission(assetsStateToSave);
      setIsAssetsOpen(value);
    } catch (error) {
      console.log(error);
    }

    setLoading(null);
  };

  return (
    <Box
      sx={{
        margin: '20px',
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
      }}
    >
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">
          Profile Visiblility
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          value={profileVisibility}
          name="radio-buttons-group"
          onChange={(event, value) => updateProfileVisibility(value)}
        >
          <FormControlLabel
            value="open"
            control={<Radio />}
            label={<Typography fontWeight={"bold"}>Open (default)</Typography>}
          />
          <Typography fontSize={"15px"}>
            Your profile can be viewed by anyone who follows your profile link
            or QR code
          </Typography>
          <FormControlLabel
            value="restricted"
            control={<Radio />}
            label={<Typography fontWeight={"bold"}>Restricted</Typography>}
          />
          <Typography fontSize={"15px"}>
            Only users with your permission or temporary secure link can see
            your profile
          </Typography>
        </RadioGroup>
      </FormControl>

      <Button
        sx={{
          marginTop: "10px",
          marginBottom: "20px",
        }}
        disabled={loading === "profile"}
        onClick={(event) => handleChangeTab(event, 1)}
        variant="contained"
      >
        Manage profile shares
      </Button>

      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">
          Documents Visiblility
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          value={isAssetsOpen}
          name="radio-buttons-group"
          onChange={(event, value) => updateAssetsVisibility(value)}
        >
          <FormControlLabel
            value="full"
            control={<Radio />}
            label={<Typography fontWeight={"bold"}>Full (default)</Typography>}
          />
          <Typography fontSize={"15px"}>
            Show all Documents to those who can see your profile
          </Typography>
          <FormControlLabel
            value="individual"
            control={<Radio />}
            label={<Typography fontWeight={"bold"}>Individual</Typography>}
          />
          <Typography fontSize={"15px"}>
            You need to share each document individually before others can see
            them
          </Typography>
        </RadioGroup>
      </FormControl>

      <Button
        sx={{
          marginTop: "10px",
          marginBottom: "20px",
        }}
        disabled={loading === "assets"}
        fullWidth={false}
        onClick={(event) => handleChangeTab(event, 2)}
        variant="contained"
      >
        Manage documents shares
      </Button>
    </Box>
  );
};
