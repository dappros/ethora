import React, { useState } from "react";
import { Button, Container, Box } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useHistory } from "react-router";
import { EmailModal } from "./EmailModal";
import { OwnerRegistration } from "./OwnerRegistrationModal";
import { UsernameModal } from "./UsernameModal";
import OwnerLogin from "./OwnerLogin";
import { regularLoginEmail, regularLoginUsername } from "../../config/config";
import { useStoreState } from "../../store";
import { TLoginSuccessResponse } from "../../http";

export interface IRegularSignIn {}

export const RegularSignIn: React.FC<IRegularSignIn> = ({}) => {
  const setUser = useStoreState((state) => state.setUser);
  const [openEmail, setOpenEmail] = useState(false);
  const [openUsername, setOpenUsername] = useState(false);

  const [ownerRegistration, setOwnerRegistration] = useState(false);
  const [ownerLogin, setOwnerLogin] = useState(false);
  const history = useHistory();
  const updateUserInfo = (loginData: TLoginSuccessResponse) => {
    setUser({
      _id: loginData.user._id,
      firstName: loginData.user.firstName,
      lastName: loginData.user.lastName,
      description: loginData.user.description,
      xmppPassword: loginData.user.xmppPassword,
      walletAddress: loginData.user.defaultWallet.walletAddress,
      token: loginData.token,
      refreshToken: loginData.refreshToken,
      profileImage: loginData.user.profileImage,
      isProfileOpen: loginData.user.isProfileOpen,
      isAssetsOpen: loginData.user.isAssetsOpen,
      ACL: loginData.user.ACL,
      referrerId: loginData.user.referrerId || "",
      isAllowedNewAppCreate: loginData.isAllowedNewAppCreate,
      isAgreeWithTerms: loginData.user.isAgreeWithTerms,
      stripeCustomerId: loginData.user.stripeCustomerId,
    });
  };

  return (
    <Container
      maxWidth="xl"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 68px)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          maxWidth: "300px",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {regularLoginEmail && (
          <Button
            sx={{ margin: 1, textTransform: "none", fontSize: "16px" }}
            fullWidth
            variant="contained"
            onClick={() => setOpenEmail(true)}
          >
            Sign In with E-mail
          </Button>
        )}
        {regularLoginUsername && (
          <Button
            sx={{ margin: 1, textTransform: "none", fontSize: "16px" }}
            fullWidth
            variant="contained"
            onClick={() => setOpenUsername(true)}
          >
            Sign In with username
          </Button>
        )}

        {/* <Button
          sx={{ margin: 1, textTransform: "none", fontSize: "16px" }}
          fullWidth
          variant="contained"
          color="success"
          onClick={() => setOwnerRegistration(true)}
        >
          Owner Registration
        </Button> */}
        {/* <Button
          sx={{ margin: 1, textTransform: "none", fontSize: "16px" }}
          fullWidth
          variant="contained"
          color="success"
          onClick={() => setOwnerLogin(true)}
        >
          Owner Sign In
        </Button> */}
        <Button
          sx={{ margin: 1 }}
          fullWidth
          variant="text"
          onClick={() => history.push("/")}
          startIcon={<ArrowBackIosIcon />}
        >
          Back
        </Button>
      </Box>
      <EmailModal
        updateUser={updateUserInfo}
        open={openEmail}
        setOpen={setOpenEmail}
      />
      <UsernameModal
        updateUser={updateUserInfo}
        open={openUsername}
        setOpen={setOpenUsername}
      />
      <OwnerRegistration
        open={ownerRegistration}
        setOpen={setOwnerRegistration}
      />
      <OwnerLogin open={ownerLogin} setOpen={setOwnerLogin} />
    </Container>
  );
};
