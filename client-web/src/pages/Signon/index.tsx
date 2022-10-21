import DiamondIcon from "@mui/icons-material/Diamond";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import FacebookLogin from "react-facebook-login";
import { useHistory } from "react-router-dom";
import { injected } from "../../connector";
import * as http from "../../http";
import { useStoreState } from "../../store";
import { useQuery } from "../../utils";
import { EmailModal } from "./EmailModal";
import { MetamaskModal } from "./MetamaskModal";
import OwnerLogin from "./OwnerLogin";
import { OwnerRegistration } from "./OwnerRegistrationModal";
import { UsernameModal } from "./UsernameModal";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";

export function Signon() {
  const setUser = useStoreState((state) => state.setUser);
  const user = useStoreState((state) => state.user);
  const owner = useStoreState((state) => state.owner);
  const query = useQuery();
  const history = useHistory();
  const { active, account, library, activate } = useWeb3React();
  const [openEmail, setOpenEmail] = useState(false);
  const [openUsername, setOpenUsername] = useState(false);
  const [showMetamask, setShowMetamask] = useState(false);
  const [ownerRegistration, setOwnerRegistration] = useState(false);
  const [ownerLogin, setOwnerLogin] = useState(false);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId:
          "972933470054-9v5gnseqef8po7cvvrsovj51cte249ov.apps.googleusercontent.com",
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  });

  useEffect(() => {
    if (user.firstName) {
      history.push(`/profile/${user.walletAddress}`);
    }

    if (owner.firstName) {
      history.push("/owner");
    }
  }, [user, owner]);

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

            setUser({
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              xmppPassword: user.xmppPassword,
              walletAddress: user.defaultWallet.walletAddress,
              token: resp.data.token,
              refreshToken: resp.data.refreshToken,
            });

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

  const onGoogleClickSuccess = async (res: any) => {
    const loginType = "google";
    const emailExist = await http.checkEmailExist(res.profileObj.email);

    if (!emailExist.data.success) {
      const loginRes = await http.loginSocial(
        res.tokenId,
        res.accessToken,
        loginType
      );
      const user = loginRes.data.user;

      setUser({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        xmppPassword: user.xmppPassword,
        walletAddress: user.defaultWallet.walletAddress,
        token: loginRes.data.token,
        refreshToken: loginRes.data.refreshToken,
      });
    } else {
      await http.registerSocial(res.tokenId, res.accessToken, loginType);
      const loginRes = await http.loginSocial(
        res.tokenId,
        res.accessToken,
        loginType
      );
      const user = loginRes.data.user;

      setUser({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        xmppPassword: user.xmppPassword,
        walletAddress: user.defaultWallet.walletAddress,
        token: loginRes.data.token,
        refreshToken: loginRes.data.refreshToken,
      });
    }
  };

  const onFailure = (err: any) => {
    console.log("failed:", err);
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
        sx={{ marginTop: 5 }}
        style={{
          display: "flex",
          maxWidth: "300px",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          sx={{ margin: 1 }}
          fullWidth
          variant="contained"
          onClick={() => onMetamaskLogin()}
          startIcon={<DiamondIcon />}
          style={{ backgroundColor: "#d9711a" }}
        >
          Continue with Metamask
        </Button>
        <FacebookLogin
          appId="1172938123281314"
          autoLoad={false}
          fields={"all"}
          onClick={() => {}}
          callback={(res) => console.log(res)}
          icon={<FacebookIcon style={{ marginRight: 10 }} />}
          buttonStyle={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            fontSize: 14,
            padding: 5,
            borderRadius: 4,
            width: "100%",
            margin: "3px 0",
            fontFamily: "Roboto,Helvetica,Arial,sans-serif",
            fontWeight: 500,
          }}
          textButton={"Continue with facebook"}
          containerStyle={{ padding: 0, width: "100%" }}
        />
        <GoogleLogin
          clientId="972933470054-9v5gnseqef8po7cvvrsovj51cte249ov.apps.googleusercontent.com"
          buttonText="Continue with Google"
          onSuccess={onGoogleClickSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          render={(props) => (
            <Button
              {...props}
              sx={{ margin: 1 }}
              fullWidth
              variant="contained"
              startIcon={<GoogleIcon />}
              style={{ backgroundColor: "white", color: "rgba(0,0,0,0.6)" }}
            >
              Continue with Google
            </Button>
          )}
        />

        <Button
          sx={{ margin: 1 }}
          fullWidth
          variant="contained"
          onClick={() => setOpenEmail(true)}
        >
          Continue with e-mail
        </Button>
        <Button
          sx={{ margin: 1 }}
          fullWidth
          variant="contained"
          onClick={() => setOpenUsername(true)}
        >
          Continue with username
        </Button>

        <Button
          sx={{ margin: 1 }}
          fullWidth
          variant="contained"
          color="success"
          onClick={() => setOwnerRegistration(true)}
        >
          Owner Registration
        </Button>
        <Button
          sx={{ margin: 1 }}
          fullWidth
          variant="contained"
          color="success"
          onClick={() => setOwnerLogin(true)}
        >
          Owner Login
        </Button>
      </Box>

      <MetamaskModal open={showMetamask} setOpen={setShowMetamask} />
      <EmailModal open={openEmail} setOpen={setOpenEmail} />
      <UsernameModal open={openUsername} setOpen={setOpenUsername} />
      <OwnerRegistration
        open={ownerRegistration}
        setOpen={setOwnerRegistration}
      />
      <OwnerLogin open={ownerLogin} setOpen={setOwnerLogin} />
    </Container>
  );
}
