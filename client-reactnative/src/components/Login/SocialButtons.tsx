import { HStack, Icon, View } from "native-base"
import { appleSignIn, facebookSignIn } from "../../../docs/config"
import SocialButton from "../Buttons/SocialButton"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome"
import { handleFaceBookLogin } from "../../helpers/login/socialLoginHandle"
import { socialLoginType } from "../../constants/socialLoginConstants"
import AntIcon from "react-native-vector-icons/AntDesign"
import MetamaskIcon from "../../assets/metamask.svg"
import React from "react"
import { LoginStore } from "../../stores/loginStore"
import { ApiStore } from "../../stores/apiStore"

interface SocialButtonsProperties {
  connectMetamask: () => void
  onAppleButtonPress: () => void
  loginStore: LoginStore
  apiStore: ApiStore
}

const SocialButtons = ({
  connectMetamask,
  onAppleButtonPress,
  loginStore,
  apiStore,
}: SocialButtonsProperties) => {
  return (
    <HStack
      style={{ justifyContent: "center" }}
      space={"25px"}
      marginTop={"45px"}
    >
      {facebookSignIn && (
        <View accessibilityLabel="Sign in with Facebook">
          <SocialButton
            icon={
              <Icon
                color={"#0026EC"}
                size={hp("2.8%")}
                as={FontAwesomeIcon}
                name={"facebook"}
                marginLeft={"7px"}
              />
            }
            onPress={() => {
              handleFaceBookLogin(
                apiStore.defaultToken,
                loginStore.loginUser,
                loginStore.registerUser,
                socialLoginType.FACEBOOK
              )
            }}
          />
        </View>
      )}
      {appleSignIn && (
        <View accessibilityLabel="Sign in with Apple">
          <SocialButton
            icon={
              <Icon
                color={"#0026EC"}
                size={hp("2.8%")}
                as={AntIcon}
                name={"apple1"}
              />
            }
            onPress={onAppleButtonPress}
          />
        </View>
      )}
      <View accessibilityLabel="Sign in with Metamask">
        <SocialButton
          icon={<MetamaskIcon width={hp("2.8%")} />}
          onPress={connectMetamask}
        />
      </View>
    </HStack>
  )
}
export default SocialButtons
