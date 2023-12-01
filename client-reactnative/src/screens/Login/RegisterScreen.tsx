/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, { useState } from "react"

import {
  Text,
  View,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  ActivityIndicator,
} from "react-native"
import CheckBox from "@react-native-community/checkbox"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"

import IonIcons from "react-native-vector-icons/Ionicons"

import { HStack, Input, VStack } from "native-base"
import {
  textStyles,
  regularLoginEmail,
  commonColors,
  loginScreenBackgroundImage,
} from "../../../docs/config"
import { showError, showSuccess } from "../../components/Toast/toast"
import { httpPost } from "../../config/apiService"
import {
  registerRegularEmailUrl,
  registerUserURL,
} from "../../config/routesConstants"
import { useStores } from "../../stores/context"
import { AuthStackParamList } from "../../navigation/types"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { authStackRoutes } from "../../navigation/routes"
import { Button } from "../../components/Button"
import whiteBg from "../../assets/whiteBg.png"
import ArrowLeft from "../../assets/icons/arrowLeft.svg"
import EmailIcon from "../../assets/icons/email.svg"
import CloseIcon from "../../assets/icons/close.svg"
import StarIcon from "../../assets/icons/star.svg"
import UserIcon from "../../assets/icons/user.svg"
import SocialButtons from "../../components/Login/SocialButtons"
import RegisterSecondStep from "../../components/Login/RegisterSecondStep"
import RegisterThirdStep from "./RegisterThirdStep"

const { mediumFont, lightFont, boldFont } = textStyles
type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Register"
>
export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [userNameFocused, setUserNameFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [userNameError, setUserNameError] = useState("")
  const [emailFocused, setEmailFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSelected, setSelection] = useState(true)
  const { apiStore } = useStores()
  const [activeStep, setActiveStep] = useState(1)
  const registerUser = async () => {
    const nameAndSurname = userName.split(" ")
    if (nameAndSurname.length < 2) {
      setUserNameError("Please, enter your name and surname")
    }
    const body = {
      firstName: nameAndSurname[0],
      lastName: nameAndSurname[1],
      email,
    }
    console.log("nameAndSurname", nameAndSurname)
    if (!userName || !email || !isSelected) {
      showError("Error", "Please, fill all the fields")
      return
    }

    setLoading(true)
    try {
      await httpPost(registerRegularEmailUrl, body, apiStore.defaultToken)
      showSuccess(
        "Registration",
        "User registered successfully, please check your email"
      )
      setActiveStep(2)
      // navigation.navigate(authStackRoutes.RegularLogin)
    } catch (error) {
      console.log(error.response.data)
      if (error?.response?.status === 400) {
        showError("Error", "Someone already has that username. Try another?")
      } else {
        showError("Error", "Something went wrong")
      }
    }
    setLoading(false)
  }
  const goBack = () => {
    if (activeStep === 1) {
      navigation.navigate(authStackRoutes.RegularLogin)
    } else {
      setActiveStep(activeStep - 1)
    }
  }

  const goNext = () => setActiveStep(activeStep + 1)

  return (
    <View testID="registerScreen" style={{ backgroundColor: "white", flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ImageBackground
          source={whiteBg}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              paddingLeft: "12%",
              paddingRight: "12%",
            }}
          >
            <>
              <HStack
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "15%",
                  alignSelf: "center",
                }}
                space={5}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor:
                      activeStep === 1 || activeStep === 2 || activeStep === 3
                        ? "#0052CD"
                        : "#E8EDF2",
                    height: 5,
                    borderRadius: 7,
                  }}
                ></View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor:
                      activeStep === 2 || activeStep === 3
                        ? "#0052CD"
                        : "#E8EDF2",
                    height: 5,
                    borderRadius: 7,
                  }}
                ></View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: activeStep === 3 ? "#0052CD" : "#E8EDF2",
                    height: 5,
                    borderRadius: 7,
                  }}
                ></View>
              </HStack>
              <TouchableOpacity onPress={goBack} style={{ marginTop: 38 }}>
                <ArrowLeft />
              </TouchableOpacity>

              <View
                style={{
                  flex: 1,
                }}
              >
                <VStack justifyContent={"center"} mt={"37%"}>
                  {activeStep === 1 ? (
                    <>
                      <View>
                        <Text
                          style={{
                            color: "#0052CD",
                            fontFamily: textStyles.varelaRoundReqular,
                            fontSize: hp("4.5%"),
                            marginBottom: 24,
                          }}
                        >
                          Hi, there!
                        </Text>
                        <Input
                          testID={"loginUsername"}
                          accessibilityLabel="Enter your username"
                          marginBottom={2}
                          fontFamily={textStyles.varelaRoundReqular}
                          fontSize={hp("1.6%")}
                          color={"black"}
                          onFocus={() => setUserNameFocused(true)}
                          onBlur={() => setUserNameFocused(false)}
                          borderWidth={userNameFocused ? 2 : 0}
                          borderColor={userNameFocused ? "#0052CD" : ""}
                          backgroundColor={userNameFocused ? "#fff" : "#E8EDF2"}
                          value={userName}
                          onChangeText={setUserName}
                          borderRadius={15}
                          placeholder="Name and surname"
                          leftElement={
                            <View style={{ marginLeft: 15 }}>
                              <UserIcon />
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
                        {userNameError ? (
                          <Text
                            style={{
                              color: "#FF0000",
                              fontFamily: textStyles.varelaRoundReqular,
                              fontSize: hp("1.6%"),
                              marginBottom: 15,
                            }}
                          >
                            {userNameError}
                          </Text>
                        ) : null}

                        <Input
                          testID="loginUsername"
                          accessibilityLabel="Enter your username"
                          maxLength={30}
                          marginBottom={4}
                          fontFamily={textStyles.varelaRoundReqular}
                          fontSize={hp("1.6%")}
                          color={"black"}
                          value={email}
                          borderWidth={emailFocused ? 2 : 0}
                          borderColor={emailFocused ? "#0052CD" : ""}
                          backgroundColor={emailFocused ? "#fff" : "#E8EDF2"}
                          borderRadius={15}
                          onChangeText={setEmail}
                          placeholder={
                            regularLoginEmail ? "Email" : "Enter your username"
                          }
                          onFocus={() => setEmailFocused(true)}
                          onBlur={() => setEmailFocused(false)}
                          placeholderTextColor={"#8F8F8F"}
                          leftElement={
                            <View style={{ marginLeft: 12 }}>
                              <EmailIcon />
                            </View>
                          }
                          rightElement={
                            email ? (
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
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          alignSelf: "center",
                        }}
                      >
                        <CheckBox
                          value={isSelected}
                          tintColors={{ true: "#0052CD", false: "#0052CD" }}
                          tintColor={"#0052CD"}
                          onCheckColor={"#0052CD"}
                          onValueChange={setSelection}
                          style={{
                            marginRight: 5,
                            borderColor: "#0052CD",
                            borderWidth: 1,
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: textStyles.varelaRoundReqular,
                            color: "#0052CD",
                            fontSize: 12,
                          }}
                        >
                          I agree to{" "}
                        </Text>
                        <TouchableOpacity>
                          <Text
                            style={{
                              fontFamily: textStyles.varelaRoundReqular,
                              color: "#0052CD",
                              fontSize: 12,
                              textDecorationLine: "underline",
                            }}
                          >
                            Terms and conditions
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <VStack
                        justifyContent={"center"}
                        alignItems={"center"}
                        paddingY={10}
                      >
                        <TouchableOpacity
                          onPress={registerUser}
                          style={{
                            backgroundColor:
                              loading || !userName || !email
                                ? "#8F8F8F"
                                : "#0052CD",
                            borderRadius: 15,
                            width: "100%",
                            height: 45,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            marginTop: 20,
                          }}
                          disabled={loading || !userName || !email}
                        >
                          {loading && (
                            <ActivityIndicator
                              size="small"
                              color="#fff"
                              style={{ marginRight: 10 }}
                            />
                          )}
                          <Text style={{ fontSize: 18, color: "#fff" }}>
                            Sign up
                          </Text>
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
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <SocialButtons border={true} />
                        </View>
                      </VStack>
                    </>
                  ) : activeStep === 2 ? (
                    <RegisterSecondStep email={email} goNext={goNext} />
                  ) : (
                    <RegisterThirdStep />
                  )}
                </VStack>
              </View>
            </>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </View>
  )
}
