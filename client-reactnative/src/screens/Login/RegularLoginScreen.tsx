import React, { useState } from "react"
import {
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen"
import Modal from "react-native-modal"

import { HStack, Image, Input, VStack } from "native-base"
import {
  loginScreenBackgroundImage,
  logoPath,
  logoWidth,
  logoHeight,
  textStyles,
  regularLoginEmail,
  commonColors,
} from "../../../docs/config"
import { showError } from "../../components/Toast/toast"
import { useStores } from "../../stores/context"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AuthStackParamList } from "../../navigation/types"
import { Button } from "../../components/Button"

type ScreenProps = NativeStackScreenProps<AuthStackParamList, "RegularLogin">

export const RegularLoginScreen = ({ navigation }: ScreenProps) => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setisLoading] = useState(false)
  const { loginStore } = useStores()
  const [resetModalOpen, setResetModalOpen] = useState(false)

  const onSubmit = async () => {
    if (!userName || !password) {
      return
    }
    setisLoading(true)
    try {
      await loginStore.regularLogin({ username: userName, password })
    } catch (error: any) {
      console.log(error.response.data)
      if (error?.response?.status === 409) {
        showError("Error", "This email is not verified")
      } else {
        showError("Error", "Something went wrong")
      }
    }
    setisLoading(false)
  }

  return (
    <>
      <ImageBackground
        source={loginScreenBackgroundImage}
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableWithoutFeedback
          testID="regularLoginScreen"
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <VStack justifyContent={"center"} height={"full"}>
            <VStack justifyContent={"center"} height={"full"} padding={"1"}>
              <HStack paddingY={5}>
                <Image
                  alt="App logo Ethora"
                  source={logoPath}
                  resizeMode={"cover"}
                  w={wp(logoWidth)}
                  h={logoHeight}
                />
              </HStack>
              <View>
                <Input
                  testID="loginUsername"
                  accessibilityLabel="Enter your username"
                  maxLength={30}
                  marginBottom={2}
                  fontFamily={textStyles.lightFont}
                  fontSize={hp("1.6%")}
                  color={"black"}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder={
                    regularLoginEmail
                      ? "Enter your email"
                      : "Enter your username"
                  }
                  placeholderTextColor={commonColors.primaryColor}
                />
                <Input
                  testID={"loginPassword"}
                  accessibilityLabel="Enter your password"
                  marginBottom={2}
                  fontFamily={textStyles.lightFont}
                  fontSize={hp("1.6%")}
                  color={"black"}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={commonColors.primaryColor}
                />
                <View
                  accessibilityLabel="Login button"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    testID="loginSubmitButton"
                    title={"Login"}
                    onPress={onSubmit}
                    loading={isLoading}
                    style={{ width: "50%" }}
                  />
                </View>
              </View>

              <VStack
                justifyContent={"center"}
                alignItems={"center"}
                paddingY={10}
              >
                <TouchableOpacity
                  testID="createNewAccount"
                  accessibilityLabel="Create new account"
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text
                    style={{ fontSize: 18, color: commonColors.primaryColor }}
                  >
                    Create new account
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityLabel="Forgot password?"
                  onPress={() =>
                    !regularLoginEmail
                      ? setResetModalOpen(true)
                      : navigation.navigate("ResetPasswordScreen")
                  }
                >
                  <Text style={{ fontSize: 13, color: "black", marginTop: 5 }}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityLabel="Back to login"
                  onPress={() => navigation.navigate("LoginScreen")}
                >
                  <Text style={{ fontSize: 13, color: "black", marginTop: 15 }}>
                    Back to login
                  </Text>
                </TouchableOpacity>
              </VStack>
            </VStack>

            {/* </ImageBackground> */}
          </VStack>
        </TouchableWithoutFeedback>
      </ImageBackground>
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
  )
}
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
})
