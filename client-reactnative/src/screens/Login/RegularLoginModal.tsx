import React, { FC, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Modal from "react-native-modal";

import { Input, VStack } from "native-base";
import {
  textStyles,
  regularLoginEmail,
  commonColors,
} from "../../../docs/config";
import { showError } from "../../components/Toast/toast";
import { useStores } from "../../stores/context";
import { Button } from "../../components/Button";
import EmailIcon from "../../assets/icons/email.svg";
import StarIcon from "../../assets/icons/star.svg";
import ArrowDownIcon from "../../assets/icons/arrowDown.svg";
import CloseIcon from "../../assets/icons/close.svg";
import EyeCrossedIcon from "../../assets/icons/eyeCrossed.svg";
import EyeOpenIcon from "../../assets/icons/eyeOpen.svg";
import SocialButtons from "../../components/Login/SocialButtons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { authStackRoutes } from "../../navigation/routes";

interface ExtendedScreenProps
  extends NativeStackScreenProps<AuthStackParamList, "LoginScreen"> {
  isOpen: boolean;
  onClose: () => void;
}

export const RegularLoginModal: FC<ExtendedScreenProps> = ({
  isOpen,
  onClose,
  navigation,
}) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameFocused, setUserNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const { loginStore } = useStores();
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const onSubmit = async () => {
    if (!userName || !password) {
      return;
    }
    setisLoading(true);
    try {
      await loginStore.regularLogin({ username: userName, password });
    } catch (error: any) {
      console.log(error.response.data);
      if (error?.response?.status === 409) {
        showError("Error", "This email is not verified");
      } else {
        showError("Error", "Something went wrong");
      }
    }
    setisLoading(false);
  };

  return (
    <>
      <Modal
        onBackdropPress={onClose}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        isVisible={isOpen}
        style={{ width: wp("100%") }}
      >
        <View
          style={{
            position: "absolute",
            bottom: -20,
            left: -20,
            width: wp("100%"),
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 2 },
            elevation: 30,
            borderTopLeftRadius: 80,
            borderTopRightRadius: 80,
            paddingTop: 40,
            paddingLeft: 45,
            paddingRight: 45,
            height: "65%",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: -80,
              left: "48%",
              justifyContent: "center",
              alignItems: "center",
              // transform: "translateX(-50%)",
            }}
          >
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={onClose}
            >
              <ArrowDownIcon />
              <Text
                style={{
                  marginTop: 17,
                  color: "#E8EDF2",
                  fontFamily: textStyles.regularFont,
                }}
              >
                Back to Sign in
              </Text>
            </TouchableOpacity>
          </View>
          <VStack justifyContent={"center"}>
            <View>
              <Text
                style={{
                  color: "#0052CD",
                  fontFamily: textStyles.regularFont,
                  fontSize: hp("4.5%"),
                  marginBottom: 24,
                }}
              >
                Hello again!
              </Text>
              <Input
                testID="loginUsername"
                accessibilityLabel="Enter your username"
                maxLength={30}
                marginBottom={4}
                fontFamily={textStyles.regularFont}
                fontSize={hp("1.6%")}
                color={"black"}
                value={userName}
                borderWidth={userNameFocused ? 2 : 2}
                borderColor={"transparent"}
                focusOutlineColor={userNameFocused ? "#0052CD" : "transparent"}
                backgroundColor={userNameFocused ? "#fff" : "#E8EDF2"}
                borderRadius={15}
                // paddingLeft={10}
                onChangeText={setUserName}
                placeholder={
                  regularLoginEmail ? "Email" : "Enter your username"
                }
                onFocus={() => setUserNameFocused(true)}
                onBlur={() => setUserNameFocused(false)}
                placeholderTextColor={"#8F8F8F"}
                leftElement={
                  <View style={{ marginLeft: 12 }}>
                    <EmailIcon />
                  </View>
                }
                rightElement={
                  userName ? (
                    <TouchableOpacity
                      onPress={() => setUserName("")}
                      style={{
                        backgroundColor: "#0052CD",
                        borderRadius: 4,
                        width: 16,
                        height: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 15,
                      }}
                    >
                      <CloseIcon />
                    </TouchableOpacity>
                  ) : null
                }
              />
              <Input
                testID={"loginPassword"}
                accessibilityLabel="Enter your password"
                marginBottom={2}
                fontFamily={textStyles.regularFont}
                fontSize={hp("1.6%")}
                color={"black"}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                borderWidth={userNameFocused ? 2 : 2}
                borderColor={"transparent"}
                focusOutlineColor={passwordFocused ? "#0052CD" : "transparent"}
                backgroundColor={passwordFocused ? "#fff" : "#E8EDF2"}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                borderRadius={15}
                placeholder="Password"
                leftElement={
                  <View style={{ marginLeft: 15 }}>
                    <StarIcon />
                  </View>
                }
                rightElement={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ marginRight: 15 }}
                  >
                    {showPassword ? <EyeOpenIcon /> : <EyeCrossedIcon />}
                  </TouchableOpacity>
                }
              />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(authStackRoutes.ResetPasswordScreen)
                }
                style={{ alignSelf: "flex-end" }}
              >
                <Text
                  style={{ color: "#0052CD", textDecorationLine: "underline" }}
                >
                  Forgot password?
                </Text>
              </TouchableOpacity>
              <View
                accessibilityLabel="Login button"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></View>
            </View>

            <VStack
              justifyContent={"center"}
              alignItems={"center"}
              paddingY={10}
            >
              <TouchableOpacity
                onPress={onSubmit}
                style={{
                  backgroundColor:
                    isLoading || !userName || !password ? "#8F8F8F" : "#0052CD",
                  borderRadius: 15,
                  width: "100%",
                  height: 45,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginTop: 20,
                }}
                disabled={isLoading || !userName || !password}
              >
                {isLoading && (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 10 }}
                  />
                )}
                <Text style={{ fontSize: 18, color: "#fff" }}>Log in</Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 13,
                  color: "#0052CD",
                  marginTop: 15,
                  marginBottom: 15,
                  textAlign: "center",
                }}
              >
                or
              </Text>
              <SocialButtons border={true} />
            </VStack>
          </VStack>
        </View>
      </Modal>

      {!regularLoginEmail && (
        <Modal
          onBackdropPress={() => setResetModalOpen(false)}
          isVisible={resetModalOpen}
        >
          <View style={styles.modal}>
            <Text style={{ color: "black" }}>
              For some privacy reasons, Ethora does not store any user
              credential information. Please, create a new account if you forget
              your password.
            </Text>
            <Button
              title="Close"
              onPress={() => setResetModalOpen(false)}
              loading={false}
              style={{ marginTop: 10 }}
            />
          </View>
        </Modal>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: commonColors.primaryDarkColor,
    width: 150,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
});
