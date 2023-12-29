import React, { useState } from "react";

import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

import { HStack, Input, VStack } from "native-base";
import { textStyles, regularLoginEmail } from "../../../docs/config";
import { showError, showSuccess } from "../../components/Toast/toast";
import { httpPost } from "../../config/apiService";
import { resetPasswordURL } from "../../config/routesConstants";
import { useStores } from "../../stores/context";
import { AuthStackParamList } from "../../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { authStackRoutes } from "../../navigation/routes";
import whiteBg from "../../assets/whiteBg.png";
import ArrowLeft from "../../assets/icons/arrowLeft.svg";
import EmailIcon from "../../assets/icons/email.svg";
import CloseIcon from "../../assets/icons/close.svg";
import RegisterThirdStep from "../../components/Login/RegisterThirdStep";
import ResetSecondStep from "../../components/Login/ResetSecondScreen";
import ResetThirdStep from "../../components/Login/ResetThirdStep";

type ResetPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Register"
>;
export const ResetPasswordScreen = ({
  navigation,
}: ResetPasswordScreenProps) => {
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const { apiStore } = useStores();
  const [activeStep, setActiveStep] = useState(1);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const resetPassword = async () => {
    if (!validateEmail(email)) {
      setIsEmailValid(false);
      showError("Error", "Invalid email format");
      return;
    }
    setIsEmailValid(true);

    if (!email || !isEmailValid) {
      showError("Error", "Please, enter correct email");
      return;
    }

    setLoading(true);
    try {
      await httpPost(resetPasswordURL, { email }, apiStore.defaultToken);
      showSuccess("Success", "Check your email");
      setActiveStep(2);
    } catch (error) {
      console.log(error.response.data);
      if (error?.response?.status === 400) {
        showError("Error", "Something went wrong");
      }
    }
    setLoading(false);
  };

  const goBack = () => {
    if (activeStep === 1) {
      navigation.navigate(authStackRoutes.LoginScreen);
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  const goNext = () => setActiveStep(activeStep + 1);

  return (
    <View
      testID="ResetPasswordScreen"
      style={{ backgroundColor: "white", flex: 1 }}
    >
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
                            fontFamily: textStyles.regularFont,
                            fontSize: hp("4.5%"),
                            marginBottom: 16,
                          }}
                        >
                          Forgot your password?
                        </Text>
                        <Text
                          style={{
                            color: "#8F8F8F",
                            fontFamily: textStyles.regularFont,
                            fontSize: hp("1.8%"),
                            marginBottom: 24,
                          }}
                        >
                          Please, enter your email, and we will send you a link
                          to reset your password.
                        </Text>
                        <Input
                          testID="resetEmail"
                          accessibilityLabel="Enter your email"
                          maxLength={30}
                          marginBottom={4}
                          fontFamily={textStyles.regularFont}
                          fontSize={hp("1.6%")}
                          color={"black"}
                          value={email}
                          borderWidth={emailFocused ? 2 : 2}
                          borderColor={"transparent"}
                          focusOutlineColor={
                            emailFocused ? "#0052CD" : "transparent"
                          }
                          backgroundColor={emailFocused ? "#fff" : "#E8EDF2"}
                          borderRadius={15}
                          onChangeText={setEmail}
                          placeholder={
                            regularLoginEmail ? "Email" : "Enter your username"
                          }
                          autoFocus={true}
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
                                onPress={() => setEmail("")}
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
                      <VStack
                        justifyContent={"center"}
                        alignItems={"center"}
                        paddingY={10}
                      >
                        <TouchableOpacity
                          onPress={resetPassword}
                          style={{
                            backgroundColor:
                              loading || !email ? "#8F8F8F" : "#0052CD",
                            borderRadius: 15,
                            width: "100%",
                            height: 45,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            marginTop: 20,
                          }}
                          disabled={loading || !email}
                        >
                          {loading && (
                            <ActivityIndicator
                              size="small"
                              color="#fff"
                              style={{ marginRight: 10 }}
                            />
                          )}
                          <Text style={{ fontSize: 18, color: "#fff" }}>
                            Send email
                          </Text>
                        </TouchableOpacity>
                      </VStack>
                    </>
                  ) : activeStep === 2 ? (
                    <ResetSecondStep email={email} goNext={goNext} />
                  ) : (
                    <ResetThirdStep />
                  )}
                </VStack>
              </View>
            </>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </View>
  );
};

/*
Copyright 2019-2024 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/
