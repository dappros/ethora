import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { useMediaQuery, useTheme, Box } from "@mui/material"
import { useStoreState } from "../../../../store"
import { useSnackbar } from "../../../../context/SnackbarContext"
import { injected } from "../../../../connector"
import Wrapper from "../Wrapper"
import LogoContent from "../LogoContent"
import { signInWithGoogle } from "../../../../services/firebase"
import * as http from "../../../../http"
import { FullPageSpinner } from "../../../../components/FullPageSpinner"
import xmpp from "../../../../xmpp"
import SignInForm from "../Forms/LoginForm"

export default function LoginComponent() {
  const setUser = useStoreState((state) => state.setUser)
  const user = useStoreState((state) => state.user)
  const config = useStoreState((state) => state.config)

  const history = useHistory()
  const { search } = useLocation()
  const { active, account, library, activate } = useWeb3React()
  const [loading, setLoading] = useState(false)

  const { showSnackbar } = useSnackbar()
  const signUpPlan = new URLSearchParams(search).get("signUpPlan")

  const onMetamaskLogin = () => {
    activate(injected)
  }

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
            updateUserInfo(resp.data)
            // history.push(`/profile/${user.defaultWallet.walletAddress}`);
          })
          .catch((error) => {
            console.log(error)
            if (error.response && error.response.status === 404) {
              console.log("registering user")
              // setShowMetamask(true)
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
        await http.loginSocial(
          res.idToken,
          res.credential.accessToken,
          "",
          loginType
        )
        const loginRes = await http.loginSocial(
          res.idToken,
          res.credential.accessToken,
          loginType
        )
        updateUserInfo(loginRes.data)
        history.push("/organizations")
      } else {
        const loginRes = await http.loginSocial(
          res.idToken,
          res.credential.accessToken,
          loginType
        )
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

  if (loading) {
    return <FullPageSpinner />
  }

  return (
    <Wrapper>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flex: 1,
          flexDirection: isMobileDevice ? "column" : "row",
          gap: isMobileDevice ? "20px" : "16px",
          alignItems: "center",
        }}
      >
        <LogoContent isMobile={isMobileDevice} />
        <SignInForm
          loading={loading}
          config={config.signonOptions || []}
          isMobile={isMobileDevice}
          updateUser={updateUserInfo}
          signInWithGoogle={onGoogleClick}
          signInWithMetamask={onMetamaskLogin}
        />
      </Box>
    </Wrapper>
  )
}
