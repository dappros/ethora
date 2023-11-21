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
} from "react-native"

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"

import IonIcons from "react-native-vector-icons/Ionicons"

import CheckBox from "@react-native-community/checkbox"

import { Input } from "native-base"
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

const { mediumFont, lightFont, boldFont } = textStyles
type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Register"
>
export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [passwordCheck, setPasswordCheck] = useState("")
  const [firstname, setFirstname] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSelected, setSelection] = useState(true)
  const { apiStore } = useStores()
  const [lastname, setLastname] = useState("")
  const registerUser = async () => {
    const body = regularLoginEmail
      ? {
          firstName: firstname,
          lastName: lastname,
          email: username,
        }
      : {
          firstName: firstname,
          lastName: lastname,
          username,
        }
    if (!firstname || !lastname || !username || !isSelected) {
      showError("Error", "Please, fill all the fields")
      return
    }

    setLoading(true)
    try {
      const res = await httpPost(
        registerRegularEmailUrl,
        body,
        apiStore.defaultToken
      )
      showSuccess(
        "Registration",
        "User registered successfully, please check your email"
      )
      navigation.navigate(authStackRoutes.RegularLogin)
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
    navigation.navigate(authStackRoutes.RegularLogin)
  }

  return (
    <View testID="registerScreen" style={{ backgroundColor: "white", flex: 1 }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          backgroundColor: commonColors.primaryColor,
          zIndex: +1,
          width: "100%",
          height: 50,
          borderBottomEndRadius: 4,
          borderBottomStartRadius: 4,
          // borderTopLeftRadius: 30,
        }}
      >
        <View style={{ position: "absolute", top: 7 }}>
          <Text style={loginStyles.headerText}>Create account</Text>
        </View>

        <TouchableOpacity style={loginStyles.goBackButton} onPress={goBack}>
          <IonIcons size={hp("4%")} name="close" color={"white"} />
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ImageBackground
          source={loginScreenBackgroundImage}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              // marginTop: 200,
            }}
          >
            <View
              style={[
                {
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                },
              ]}
            >
              <View style={loginStyles.form}>
                <Input
                  testID="usernameInput"
                  maxLength={30}
                  marginBottom={2}
                  fontFamily={textStyles.lightFont}
                  fontSize={hp("1.6%")}
                  color={"black"}
                  onChangeText={setUsername}
                  value={username}
                  placeholder={regularLoginEmail ? "Email" : "Username"}
                  placeholderTextColor={commonColors.primaryColor}
                />

                <Input
                  testID="firstnameInput"
                  maxLength={15}
                  marginBottom={2}
                  fontFamily={textStyles.lightFont}
                  fontSize={hp("1.6%")}
                  color={"black"}
                  onChangeText={setFirstname}
                  value={firstname}
                  placeholder="First Name"
                  placeholderTextColor={commonColors.primaryColor}
                />

                <Input
                  testID="lastnameInput"
                  maxLength={15}
                  marginBottom={2}
                  fontFamily={textStyles.lightFont}
                  fontSize={hp("1.6%")}
                  color={"black"}
                  onChangeText={setLastname}
                  value={lastname}
                  placeholder="Last Name"
                  placeholderTextColor={commonColors.primaryColor}
                />

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <CheckBox
                    onCheckColor={commonColors.primaryDarkColor}
                    onTintColor={commonColors.primaryDarkColor}
                    value={isSelected}
                    onValueChange={setSelection}
                    style={{
                      marginRight: 5,
                      color: commonColors.primaryDarkColor,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: textStyles.boldFont,
                      color: "black",
                    }}
                  >
                    I agree to{" "}
                  </Text>
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: textStyles.boldFont,
                        color: "black",
                        textDecorationLine: "underline",
                      }}
                    >
                      Terms and conditions
                    </Text>
                  </TouchableOpacity>
                </View>
                <Button
                  testID="createAccountButton"
                  title={"Create"}
                  onPress={registerUser}
                  loading={loading}
                  style={loginStyles.submitButton}
                />
              </View>
            </View>
            {/* </ImageBackground> */}
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </View>
  )
}

const loginStyles = StyleSheet.create({
  input: {
    // height: 40,
    margin: 12,
    padding: Platform.OS === "ios" ? 15 : 7,

    paddingLeft: 20,
    borderRadius: 10,
    width: wp("83%"),
    borderWidth: 1,
    borderColor: "grey",
    color: "black",
  },
  submitButton: {
    backgroundColor: commonColors.primaryColor,
    padding: 5,
    width: wp("50%"),
    height: hp("5.7%"),
    borderRadius: 30,
    fontFamily: mediumFont,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  form: {
    flex: 1,
    height: hp("100%"),
    alignItems: "center",
    justifyContent: "center",
    marginTop: -hp("12%"),
    fontFamily: lightFont,
    width: wp("80%"),
  },
  headerText: {
    color: "white",
    fontFamily: textStyles.semiBoldFont,
    fontSize: 24,
  },
  goBackButton: {
    position: "absolute",
    right: 10,
    top: 7,
    zIndex: 99999,
  },
})
