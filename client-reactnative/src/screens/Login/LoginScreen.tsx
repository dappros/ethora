import { Box, Image, Spinner, Stack, Text, View } from "native-base"
import React, { useEffect, useMemo, useState } from "react"
import ReqularLoginLabel from "../../components/Login/RegularLoginLabel"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { ImageBackground } from "react-native"
import {
  appTitle,
  commonColors,
  googleSignIn,
  googleWebClientId,
  loginScreenBackgroundImage,
  logoPath,
  regularLogin,
  textStyles,
} from "../../../docs/config"
import SocialButtons from "../../components/Login/SocialButtons"
import { useStores } from "../../stores/context"
import { observer } from "mobx-react-lite"
import {
  handleAppleLogin,
  loginOrRegisterSocialUser,
} from "../../helpers/login/socialLoginHandle"
import { socialLoginType } from "../../constants/socialLoginConstants"
import { httpPost } from "../../config/apiService"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { useRegisterModal } from "../../hooks/useRegisterModal"
import { UserNameModal } from "../../components/Modals/Login/UserNameModal"
import { checkWalletExist } from "../../config/routesConstants"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AuthStackParamList as AuthStackParameterList } from "../../navigation/types"
import {
  useWalletConnectModal,
  WalletConnectModal,
} from "@walletconnect/modal-react-native"
import { ethers } from "ethers"
import { signMessage } from "../../helpers/signMessage"
import { projectId, providerMetadata } from "../../constants/walletConnect"
import CreateAccountButton from "../../components/Login/CreateAccountButton"
import GoogleSignInButton from "../../components/Login/GoogleSignInButton"

type LoginScreenProperties = NativeStackScreenProps<
  AuthStackParameterList,
  "LoginScreen"
>

const LoginScreen = observer(({ navigation }: LoginScreenProperties) => {
  const { loginStore, apiStore } = useStores()
  const { isFetching } = loginStore
  const [externalWalletModalData, setExternalWalletModalData] = useState({
    walletAddress: "",
    message: "",
  })
  const [signedMessage, setSignedMessage] = useState("")
  const { open, isConnected, provider, address } = useWalletConnectModal()
  const web3Provider = useMemo(
    () => (provider ? new ethers.providers.Web3Provider(provider) : undefined),
    [provider]
  )
  const {
    firstName,
    lastName,
    setFirstName,
    setLastName,
    modalOpen,
    setModalOpen,
  } = useRegisterModal()
  const [appleUser, setAppleUser] = useState({})
  useEffect(() => {
    GoogleSignin.configure({
      forceCodeForRefreshToken: true,
      webClientId: googleWebClientId,
    })
  }, [])

  const onAppleButtonPress = async () => {
    const user = await handleAppleLogin(
      apiStore.defaultToken,
      loginStore.loginUser,
      loginStore.registerUser,
      socialLoginType.APPLE
    )

    await loginOrRegisterSocialUser(
      user,
      apiStore.defaultToken,
      loginStore.loginUser,
      loginStore.registerUser,
      socialLoginType.APPLE
    )
  }

  const openModalForWallet = (message: string) => {
    setExternalWalletModalData({
      message,
      walletAddress: address,
    })
    setModalOpen(true)
  }

  const sendWalletMessage = async () => {
    const walletExist = await checkExternalWalletExist()
    const messageToSend = walletExist ? "Login" : "Registration"
    const res = await signMessage({
      web3Provider: web3Provider,
      method: "personal_sign",
      message: messageToSend,
    })
    const message = res.result
    setSignedMessage(message)
    walletExist
      ? loginStore.loginExternalWallet({
          walletAddress: address,
          signature: message,
          loginType: "signature",
          msg: "Login",
        })
      : openModalForWallet(message)
    provider?.disconnect()
  }
  const checkExternalWalletExist = async () => {
    try {
      await httpPost(
        checkWalletExist,
        {
          walletAddress: address,
        },
        apiStore.defaultToken
      )
      return true
    } catch {
      return false
    }
  }
  const onAppleLogin = async () => {
    const user = { ...appleUser, firstName, lastName }

    const dataObject = {
      loginType: socialLoginType.APPLE,
      authToken: user.authToken,
      displayName: user.displayName,
      password: user.uid,
      username: user.email,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }
    await loginStore.registerUser(dataObject, user)
    setModalOpen(false)
  }

  const onModalSubmit = async () => {
    await (externalWalletModalData.message
      ? loginStore.registerExternalWalletUser({
          walletAddress: externalWalletModalData.walletAddress,
          msg: "Registration",
          signature: externalWalletModalData.message,
          loginType: "signature",
          firstName,
          lastName,
        })
      : onAppleLogin())
  }

  useEffect(() => {
    if (address && isConnected) sendWalletMessage()
  }, [address, isConnected])
  const connectMetamask = async () => {
    return open()
  }

  return (
    <ImageBackground
      source={loginScreenBackgroundImage}
      style={{
        backgroundColor: "rgba(0,0,255, 0.05)",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        width={"74%"}
        height={"100%"}
        alignSelf={"center"}
        position={"relative"}
      >
        <Image
          alt="App logo"
          accessibilityLabel="App logo"
          source={logoPath}
          resizeMode={"cover"}
          position={"absolute"}
          top={55}
          left={"0px"}
        />
        <View
          justifyContent={"flex-end"}
          height={"100%"}
          paddingBottom={"10.5%"}
        >
          <Box testID="login-screen">
            <Text
              color={commonColors.primaryColor}
              fontFamily={textStyles.regularFont}
              fontSize={hp("5.1%")}
            >
              Welcome to {appTitle}!
            </Text>
            <Text
              color={commonColors.primaryColor}
              fontFamily={textStyles.regularFont}
              fontSize={hp("2%")}
              marginTop={"8px"}
              marginBottom={"32px"}
            >
              Manage your community!
            </Text>
          </Box>

          <Stack>
            {googleSignIn && (
              <GoogleSignInButton apiStore={apiStore} loginStore={loginStore} />
            )}
            <CreateAccountButton />

            {regularLogin && <ReqularLoginLabel navigation={navigation} />}
            <SocialButtons
              connectMetamask={connectMetamask}
              onAppleButtonPress={onAppleButtonPress}
              loginStore={loginStore}
              apiStore={apiStore}
            />
          </Stack>
        </View>
      </View>
      {isFetching && <Spinner />}

      <UserNameModal
        modalVisible={modalOpen}
        closeModal={() => setModalOpen(false)}
        firstName={firstName}
        lastName={lastName}
        setFirstName={setFirstName}
        setLastName={setLastName}
        onSubmit={onModalSubmit}
      />
      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
      />
    </ImageBackground>
  )
})

export default LoginScreen
