import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useMediaQuery, useTheme, Box } from "@mui/material"
import { useStoreState } from "../../../../store"
import Wrapper from "../Wrapper"
import LogoContent from "../LogoContent"
import * as http from "../../../../http"
import { FullPageSpinner } from "../../../../components/FullPageSpinner"
import xmpp from "../../../../xmpp"
import ForgetPasswordForm from "../Forms/ForgetPasswordForm"

export default function ForgetPassword() {
  const setUser = useStoreState((state) => state.setUser)
  const user = useStoreState((state) => state.user)

  const history = useHistory()
  const { active, account, library } = useWeb3React()
  const [loading, setLoading] = useState(false)

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
        <ForgetPasswordForm loading={loading} isMobile={isMobileDevice} />
      </Box>
    </Wrapper>
  )
}
