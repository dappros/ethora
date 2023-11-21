import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { handleGoogleLogin } from "../../helpers/login/socialLoginHandle"
import { Icon, Text } from "native-base"
import AntIcon from "react-native-vector-icons/AntDesign"
import { TouchableOpacity } from "react-native"
import { socialLoginType } from "../../constants/socialLoginConstants"
import React from "react"
import { ApiStore } from "../../stores/apiStore"
import { LoginStore } from "../../stores/loginStore"

interface GoogleSignInButtonProps {
  apiStore: ApiStore
  loginStore: LoginStore
}
const GoogleSignInButton = ({
  apiStore,
  loginStore,
}: GoogleSignInButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        position: "relative",
        borderRadius: 10,
        backgroundColor: "#fff",
        height: hp("5.9%"),
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
      }}
      onPress={() =>
        handleGoogleLogin(
          apiStore.defaultToken,
          loginStore.loginUser,
          loginStore.registerUser,
          socialLoginType.GOOGLE
        )
      }
    >
      <Icon
        color={"#013FC4"}
        size={hp("2.2%")}
        as={AntIcon}
        name={"google"}
        position={"absolute"}
        left={"20px"}
      />
      <Text style={{ color: "#013FC4", fontSize: 15 }}>
        Sign in with Google
      </Text>
    </TouchableOpacity>
  )
}

export default GoogleSignInButton
