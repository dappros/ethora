import DiamondIcon from "@mui/icons-material/Diamond"
import FacebookIcon from "@mui/icons-material/Facebook"
import GoogleIcon from "@mui/icons-material/Google"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import { useWeb3React } from "@web3-react/core"
import { useEffect, useMemo, useState } from "react"
import FacebookLogin from "react-facebook-login"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { injected } from "../../connector"
import * as http from "../../http"
import { useStoreState } from "../../store"
import { useQuery } from "../../utils"
import { EmailModal } from "./EmailModal"
import { MetamaskModal } from "./MetamaskModal"
import { UsernameModal } from "./UsernameModal"
import { FullPageSpinner } from "../../components/FullPageSpinner"
import {
  facebookSignIn,
  googleSignIn,
  metamaskSignIn,
  regularLogin,
  regularLoginEmail,
} from "../../config/config"
import { signInWithGoogle } from "../../services/firebase"
import { useSnackbar } from "../../context/SnackbarContext"
import { ForgotPasswordModal } from "../../components/ForgotPasswordModal"
import {
  Alert,
  AlertTitle,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import xmpp from "../../xmpp"
import Wrapper from "./Auth/Wrapper"
import LogoContent from "./Auth/LogoContent"
import ReviewContent from "./Auth/ReviewContent"
import SignUpForm from "./Auth/Forms/SignUpForm"
import SignInForm from "./Auth/Forms/SignInForm"
import Flipper from "./Flipper"
import ForgetPasswordForm from "./Auth/Forms/ForgetPasswordForm"

export default function Signon() {
  const setUser = useStoreState((state) => state.setUser)
  const user = useStoreState((state) => state.user)
  const config = useStoreState((state) => state.config)

  const query = useQuery()
  const history = useHistory()
  const { search } = useLocation()
  const { active, account, library, activate } = useWeb3React()
  const [openEmail, setOpenEmail] = useState(false)
  const [openUsername, setOpenUsername] = useState(false)
  const [showMetamask, setShowMetamask] = useState(false)
  const [loading, setLoading] = useState(false)
  const [flip, setFlip] = useState(false)

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const { showSnackbar } = useSnackbar()
  const signUpPlan = new URLSearchParams(search).get("signUpPlan")

  const onMetamaskLogin = () => {
    activate(injected)
  }

  useEffect(() => {
    const type = query.get("type")
    if (type) {
      switch (type) {
        case "username": {
          setOpenUsername(true)
          break
        }
        case "email": {
          setOpenEmail(true)
          break
        }
        default: {
          break
        }
      }
    }
  }, [query])

  useEffect(() => {
    console.log("active", active)
    if (active) {
      console.log(active, account)

      if (account && !user.firstName) {
        http
          .checkExtWallet(account)
          .then(async (result) => {
            console.log("login user")
            const signer = library.getSigner()
            const message = "Login"
            const signature = await signer.signMessage(message)
            const resp = await http.loginSignature(account, signature, message)
            const user = resp.data.user

            updateUserInfo(resp.data)

            // history.push(`/profile/${user.defaultWallet.walletAddress}`);
          })
          .catch((error) => {
            console.log(error)
            if (error.response && error.response.status === 404) {
              console.log("registering user")
              setShowMetamask(true)
            } else {
              console.log("other errors")
            }
          })
      }
    }
  }, [active, account])

  const onGoogleClick = async () => {
    const loginType = "google"

    try {
      const res = await signInWithGoogle()
      const emailExist = await http.checkEmailExist(
        res.user.providerData[0].email
      )
      if (emailExist.data.success) {
        await http.registerSocial(
          res.idToken,
          res.credential.accessToken,
          "",
          loginType,
          signUpPlan
        )
        const loginRes = await http.loginSocial(
          res.idToken,
          res.credential.accessToken,
          loginType
        )
        const user = loginRes.data.user

        updateUserInfo(loginRes.data)
        history.push("/organizations")
      } else {
        const loginRes = await http.loginSocial(
          res.idToken,
          res.credential.accessToken,
          loginType
        )
        const user = loginRes.data.user

        updateUserInfo(loginRes.data)
      }
    } catch (error) {
      console.log(error)
      showSnackbar("error", "Cannot authenticate user")
    }
  }
  useEffect(() => {
    if (user.firstName && user.xmppPassword) {
      if (user.stripeCustomerId && user.company.length === 0) {
        history.push(`/organizations`)
        return
      }
      if (user.stripeCustomerId && user.paymentMethods.data.length === 0) {
        history.push(`/payments`)
        return
      }
      // if (lastAuthUrl.current) {
      //   history.push(lastAuthUrl.current);
      //   return;
      // }
      history.push(`/home`)
      return
    }
    if (user.firstName && !user.xmppPassword) {
      history.push("/owner")
      return
    }
  }, [user])
  const updateUserInfo = async (loginData: http.TLoginSuccessResponse) => {
    const res = await http.getUserCompany(loginData.token)
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
      company: res.data.result,
      appId: loginData.user.appId,
      homeScreen: loginData.user.homeScreen,
    })
    xmpp.init(
      loginData.user.defaultWallet.walletAddress,
      loginData?.user.xmppPassword as string
    )
  }

  const onFacebookClick = async (info: any) => {
    if (!info?.email) return
    const loginType = "facebook"
    setLoading(true)
    const emailExist = await http.checkEmailExist(info.email)
    try {
      if (emailExist.data.success) {
        await http.registerSocial(
          "",
          "",
          info.accessToken,
          loginType,
          signUpPlan
        )
        const loginRes = await http.loginSocial(
          "",
          "",
          loginType,
          info.accessToken
        )
        const user = loginRes.data.user
        updateUserInfo(loginRes.data)
      } else {
        const loginRes = await http.loginSocial(
          "",
          "",
          loginType,
          info.accessToken
        )
        const user = loginRes.data.user
        updateUserInfo(loginRes.data)
      }
    } catch (error) {
      showSnackbar("error", "Cannot authenticate user")
      console.log(error)
    }

    setLoading(false)
  }

  const theme = useTheme()
  const isMobileDevice = useMediaQuery(theme.breakpoints.down(1024))

  const components = useMemo(() => {
    return {
      register: (
        <SignUpForm
          loading={loading}
          isMobile={isMobileDevice}
          signUpWithGoogle={onGoogleClick}
          signUpWithApple={function (): void {
            console.log("Function not implemented.")
          }}
          signUpWithFacebook={onFacebookClick}
          signUpWithMetamask={onMetamaskLogin}
        />
      ),
      forget: <ForgetPasswordForm loading={loading} />,
    }
  }, [])
  const [flipComponent, setFlipComponent] = useState<React.ReactNode>(
    components.register
  )

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const action = queryParams.get("action")
    setFlipComponent(
      action === "forgetPassword" ? components.forget : components.register
    )
    setFlip(action === "signUp" || action === "forgetPassword")
  }, [location.search])

  const isGoogleLoginAvailable = () => {
    return !!config.firebaseWebConfigString
  }

  if (loading) {
    return <FullPageSpinner />
  }

  return (
    // <Box sx={{ backgroundColor: config.loginBackgroundColor || "white" }}>
    //   <Container
    //     maxWidth="xl"
    //     style={{
    //       display: "flex",
    //       flexDirection: "column",
    //       height: "calc(100vh - 68px)",
    //       justifyContent: "center",
    //       alignItems: "center",
    //     }}
    //   >
    //     {!!signUpPlan && (
    //       <Alert severity={"info"}>
    //         <AlertTitle>Account Owners</AlertTitle>
    //         In order to create and manage your App(s), you need to create your
    //         own account first. You can use one of your social accounts or create
    //         a new custom account using e-mail and password.
    //       </Alert>
    //     )}
    //     <Box
    //       sx={{ marginTop: 5 }}
    //       style={{
    //         display: "flex",
    //         maxWidth: "300px",
    //         flexDirection: "column",
    //         alignItems: "center",
    //         justifyContent: "center",
    //       }}
    //     >
    //       {config.logoImage && (
    //         <img
    //           src={config.logoImage}
    //           style={{ width: "100%", height: 200, marginBottom: 10 }}
    //         />
    //       )}
    //       {facebookSignIn && (
    //         <FacebookLogin
    //           appId="1172938123281314"
    //           autoLoad={false}
    //           fields="name,email,picture"
    //           onClick={() => {}}
    //           callback={onFacebookClick}
    //           icon={<FacebookIcon style={{ marginRight: 10 }} />}
    //           buttonStyle={{
    //             display: "flex",
    //             justifyContent: "flex-start",
    //             alignItems: "center",
    //             fontSize: 16,
    //             padding: 5,
    //             borderRadius: 4,
    //             width: "100%",
    //             margin: "3px 0",
    //             fontFamily: "Roboto,Helvetica,Arial,sans-serif",
    //             fontWeight: 500,
    //             textTransform: "none",
    //             paddingLeft: 20,
    //           }}
    //           textButton={"Sign In with facebook"}
    //           containerStyle={{ padding: 0, width: "100%" }}
    //         />
    //       )}
    //       {googleSignIn && isGoogleLoginAvailable() && (
    //         <Button
    //           onClick={onGoogleClick}
    //           sx={{ margin: 1 }}
    //           fullWidth
    //           id="googleLogin"
    //           variant="contained"
    //           startIcon={<GoogleIcon />}
    //           style={{
    //             backgroundColor: "white",
    //             color: "rgba(0,0,0,0.6)",
    //             textTransform: "none",
    //             fontSize: "16px",
    //           }}
    //         >
    //           Sign In with Google
    //         </Button>
    //       )}
    //       {metamaskSignIn && (
    //         <Button
    //           sx={{ margin: 1 }}
    //           fullWidth
    //           variant="contained"
    //           id="metamaskLogin"
    //           onClick={() => onMetamaskLogin()}
    //           startIcon={<DiamondIcon />}
    //           style={{
    //             backgroundColor: "#d9711a",
    //             textTransform: "none",
    //             fontSize: "16px",
    //           }}
    //         >
    //           Sign In with Metamask
    //         </Button>
    //       )}

    //       {regularLoginEmail && (
    //         <Button
    //           sx={{ margin: 1, textTransform: "none", fontSize: "16px" }}
    //           fullWidth
    //           variant="contained"
    //           id="regularLogin"
    //           onClick={() => setOpenEmail(true)}
    //         >
    //           Sign In with E-mail
    //         </Button>
    //       )}
    //       <Typography
    //         sx={{
    //           fontSize: "12px",
    //           textDecoration: "underline",
    //           cursor: "pointer",
    //         }}
    //       >
    //         <span onClick={() => setShowForgotPasswordModal(true)}>
    //           Forgot password?
    //         </span>
    //       </Typography>
    //     </Box>

    //     <MetamaskModal
    //       updateUser={updateUserInfo}
    //       open={showMetamask}
    //       setOpen={setShowMetamask}
    //     />
    //     <EmailModal
    //       updateUser={updateUserInfo}
    //       open={openEmail}
    //       setOpen={setOpenEmail}
    //     />
    //     <UsernameModal
    //       updateUser={updateUserInfo}
    //       open={openUsername}
    //       setOpen={setOpenUsername}
    //     />
    //     <ForgotPasswordModal
    //       open={showForgotPasswordModal}
    //       onClose={() => setShowForgotPasswordModal(false)}
    //     />
    //   </Container>
    // </Box>

    <Wrapper>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flex: 1,
          flexDirection: isMobileDevice ? "column" : "row",
          gap: "16px",
          justifyContent: "center",
          alignItems: "center",
          minWidth: "566px",
        }}
      >
        <LogoContent isMobile={isMobileDevice} />
        <Flipper
          front={<SignInForm loading={loading} />}
          back={flipComponent}
          flip={flip}
        />
      </Box>
    </Wrapper>
  )
}
