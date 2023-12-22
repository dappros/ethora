import { HStack, Icon, View } from "native-base";
import { appleSignIn, facebookSignIn } from "../../../docs/config";
import SocialButton from "../Buttons/SocialButton";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {
  handleAppleLogin,
  handleFaceBookLogin,
  loginOrRegisterSocialUser,
} from "../../helpers/login/socialLoginHandle";
import { socialLoginType } from "../../constants/socialLoginConstants";
import AntIcon from "react-native-vector-icons/AntDesign";
import MetamaskIcon from "../../assets/metamask.svg";
import React from "react";
import { useStores } from "../../stores/context";
import { projectId, providerMetadata } from "../../constants/walletConnect";
import { WalletConnectModal } from "@walletconnect/modal-react-native";

interface SocialButtonsProps {
  border?: boolean;
  connectMetamask?: string;
}

const SocialButtons = ({
  border = false,
  connectMetamask,
}: SocialButtonsProps) => {
  const { loginStore, apiStore } = useStores();
  const onAppleButtonPress = async () => {
    const user = await handleAppleLogin(
      apiStore.defaultToken,
      loginStore.loginUser,
      loginStore.registerUser,
      socialLoginType.APPLE
    );

    await loginOrRegisterSocialUser(
      user,
      apiStore.defaultToken,
      loginStore.loginUser,
      loginStore.registerUser,
      socialLoginType.APPLE
    );
  };
  return (
    <HStack
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
      }}
    >
      {facebookSignIn && (
        <View accessibilityLabel="Sign in with Facebook">
          <SocialButton
            border={border}
            icon={
              <Icon
                color={"#0026EC"}
                size={hp("2.8%")}
                as={FontAwesomeIcon}
                name={"facebook"}
                marginLeft={"9px"}
              />
            }
            onPress={() => {
              handleFaceBookLogin(
                apiStore.defaultToken,
                loginStore.loginUser,
                loginStore.registerUser,
                socialLoginType.FACEBOOK
              );
            }}
          />
        </View>
      )}
      {appleSignIn && (
        <View accessibilityLabel="Sign in with Apple">
          <SocialButton
            border={border}
            icon={
              <Icon
                color={"#0026EC"}
                size={hp("2.8%")}
                as={AntIcon}
                name={"apple1"}
                marginBottom={"2px"}
              />
            }
            onPress={onAppleButtonPress}
          />
        </View>
      )}
      <View accessibilityLabel="Sign in with Metamask">
        <SocialButton
          border={border}
          icon={<MetamaskIcon width={hp("2.8%")} />}
          // onPress={connectMetamask}
        />
      </View>
      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
      />
    </HStack>
  );
};
export default SocialButtons;
