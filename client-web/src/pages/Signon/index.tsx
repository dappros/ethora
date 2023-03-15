import DiamondIcon from "@mui/icons-material/Diamond";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import FacebookLogin from "react-facebook-login";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { injected } from "../../connector";
import * as http from "../../http";
import { useStoreState } from "../../store";
import { useQuery } from "../../utils";
import { EmailModal } from "./EmailModal";
import { MetamaskModal } from "./MetamaskModal";
import { UsernameModal } from "./UsernameModal";
import { FullPageSpinner } from "../../components/FullPageSpinner";
import {
  facebookSignIn,
  googleSignIn,
  metamaskSignIn,
  regularLogin,
  regularLoginEmail,
} from "../../config/config";
import { signInWithGoogle } from "../../services/firebase";
import { useSnackbar } from "../../context/SnackbarContext";
import { ForgotPasswordModal } from "../../components/ForgotPasswordModal";
import { Typography } from "@mui/material";

export default function Signon() {
  const setUser = useStoreState((state) => state.setUser);
  const user = useStoreState((state) => state.user);
  const query = useQuery();
  const history = useHistory();
  const { search } = useLocation();
  const { active, account, library, activate } = useWeb3React();
  const [openEmail, setOpenEmail] = useState(false);
  const [openUsername, setOpenUsername] = useState(false);
  const [showMetamask, setShowMetamask] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const { showSnackbar } = useSnackbar();
  const signUpPlan = new URLSearchParams(search).get("signUpPlan");
  useEffect(() => {
    if (user.firstName && user.xmppPassword) {
      if (user.stripeCustomerId && !user.company) {
        history.push(`/organizations`);
        return;
      }
      if (user.stripeCustomerId && !user.paymentMethods) {
        history.push(`/payments`);
        return;
      }
      history.push(`/profile/${user.walletAddress}`);
      return;
    }
    if (user.firstName && !user.xmppPassword) {
      history.push("/owner");
      return;
    }
  }, [user]);

  const onMetamaskLogin = () => {
    activate(injected);
  };

  useEffect(() => {
    const type = query.get("type");
    if (type) {
      switch (type) {
        case "username": {
          setOpenUsername(true);
          break;
        }
        case "email": {
          setOpenEmail(true);
          break;
        }
        default: {
          break;
        }
      }
    }
  }, [query]);

  useEffect(() => {
    console.log("active ", active);
    if (active) {
      console.log(active, account);

      if (account && !user.firstName) {
        http
          .checkExtWallet(account)
          .then(async (result) => {
            console.log("login user");
            const signer = library.getSigner();
            const msg = "Login";
            const signature = await signer.signMessage(msg);
            const resp = await http.loginSignature(account, signature, msg);
            const user = resp.data.user;

            updateUserInfo(resp.data);

            history.push(`/profile/${user.defaultWallet.walletAddress}`);
          })
          .catch((error) => {
            console.log(error);
            if (error.response && error.response.status === 404) {
              console.log("registering user");
              setShowMetamask(true);
            } else {
              console.log("other errors");
            }
          });
      }
    }
  }, [active, account]);

  const onGoogleClick = async () => {
    const loginType = "google";

    try {
      const res = await signInWithGoogle();
      const emailExist = await http.checkEmailExist(
        res.user.providerData[0].email
      );
      if (!emailExist.data.success) {
        const loginRes = await http.loginSocial(
          res.idToken,
          res.credential.accessToken,
          loginType
        );
        const user = loginRes.data.user;

        updateUserInfo(loginRes.data);
      } else {
        await http.registerSocial(
          res.idToken,
          res.credential.accessToken,
          "",
          loginType,
          signUpPlan
        );
        const loginRes = await http.loginSocial(
          res.idToken,
          res.credential.accessToken,
          loginType
        );
        const user = loginRes.data.user;

        updateUserInfo(loginRes.data);
        history.push("/organizations");
      }
    } catch (error) {
      console.log(error);
      showSnackbar("error", "Cannot authenticate user");
    }
  };

  const updateUserInfo = (loginData: http.TLoginSuccessResponse) => {
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
      paymentMethods: loginData.paymentMethods,
      subscriptions: loginData.subscriptions,
      company: loginData.user.company
    });
  };

  const onFacebookClick = async (info: any) => {
    if (!info?.email) return;
    const loginType = "facebook";
    setLoading(true);
    const emailExist = await http.checkEmailExist(info.email);
    try {
      if (!emailExist.data.success) {
        const loginRes = await http.loginSocial(
          "",
          "",
          loginType,
          info.accessToken
        );
        const user = loginRes.data.user;
        updateUserInfo(loginRes.data);
      } else {
        await http.registerSocial(
          "",
          "",
          info.accessToken,
          loginType,
          signUpPlan
        );
        const loginRes = await http.loginSocial(
          "",
          "",
          loginType,
          info.accessToken
        );
        const user = loginRes.data.user;
        updateUserInfo(loginRes.data);
      }
    } catch (error) {
      showSnackbar("error", "Cannot authenticate user");
      console.log(error);
    }

    setLoading(false);
  };

  if (loading) {
    return <FullPageSpinner />;
  }

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
        sx={{ marginTop: 5 }}
        style={{
          display: "flex",
          maxWidth: "300px",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {facebookSignIn && (
          <FacebookLogin
            appId="1172938123281314"
            autoLoad={false}
            fields="name,email,picture"
            onClick={() => {}}
            callback={onFacebookClick}
            icon={<FacebookIcon style={{ marginRight: 10 }} />}
            buttonStyle={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              fontSize: 16,
              padding: 5,
              borderRadius: 4,
              width: "100%",
              margin: "3px 0",
              fontFamily: "Roboto,Helvetica,Arial,sans-serif",
              fontWeight: 500,
              textTransform: "none",
              paddingLeft: 20,
            }}
            textButton={"Sign In with facebook"}
            containerStyle={{ padding: 0, width: "100%" }}
          />
        )}
        {googleSignIn && (
          <Button
            onClick={onGoogleClick}
            sx={{ margin: 1 }}
            fullWidth
            variant="contained"
            startIcon={<GoogleIcon />}
            style={{
              backgroundColor: "white",
              color: "rgba(0,0,0,0.6)",
              textTransform: "none",
              fontSize: "16px",
            }}
          >
            Sign In with Google
          </Button>
        )}
        {metamaskSignIn && (
          <Button
            sx={{ margin: 1 }}
            fullWidth
            variant="contained"
            onClick={() => onMetamaskLogin()}
            startIcon={<DiamondIcon />}
            style={{
              backgroundColor: "#d9711a",
              textTransform: "none",
              fontSize: "16px",
            }}
          >
            Sign In with Metamask
          </Button>
        )}

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
        <Typography
          sx={{
            fontSize: "12px",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          <span onClick={() => setShowForgotPasswordModal(true)}>
            Forgot password?
          </span>
        </Typography>
      </Box>

      <MetamaskModal
        updateUser={updateUserInfo}
        open={showMetamask}
        setOpen={setShowMetamask}
      />
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
      <ForgotPasswordModal
        open={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </Container>
  );
}
