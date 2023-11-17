import axios from "axios"
import { observer } from "mobx-react-lite"
import { Input } from "native-base"
import React, { useState } from "react"
import {
  ActivityIndicator,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen"
import { commonColors, textStyles } from "../../docs/config"
import { Button } from "../components/Button"
import { showError, showSuccess } from "../components/Toast/toast"

import { httpPost } from "../config/apiService"
import { referralRoute } from "../config/routesConstants"
import { useStores } from "../stores/context"
export const EnterInviteCode = observer(() => {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const { loginStore, apiStore } = useStores()

  const addReferral = async () => {
    if (!code) {
      showError("Error", "Please, fill the code")
      return
    }
    if (code === loginStore.initialData._id) {
      showError("Error", "You cannot be your referral")
      return
    }
    if (loginStore.initialData.referrerId) {
      showError("Error", "You already added your referral")
      return
    }
    setLoading(true)
    try {
      const res = await httpPost(
        apiStore.defaultUrl + referralRoute,
        { referrerId: code },
        loginStore.userToken
      )
      loginStore.updateInitialData({
        ...loginStore.initialData,
        referrerId: code,
      })

      showSuccess("Success", "You successfully added your referral")
    } catch (error) {
      showError("Error", "Something went wrong")

      console.log(error.response)
    }
    setLoading(false)
  }

  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 20,
        paddingHorizontal: 10,
      }}
    >
      <Input
        maxLength={30}
        marginBottom={2}
        fontFamily={textStyles.lightFont}
        fontSize={hp("1.6%")}
        color={"black"}
        onChangeText={setCode}
        value={code}
        placeholder="Your referral code"
        placeholderTextColor={commonColors.primaryColor}
        accessibilityLabel={"Referrals - Enter code"}
      />
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Button loading={loading} title={"Earn coins"} onPress={addReferral} />
      </View>
    </View>
  )
})
const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: commonColors.primaryDarkColor,
    paddingVertical: 5,
    paddingHorizontal: 10,

    // height: hp("5.7%"),
    borderRadius: 20,
    fontFamily: textStyles.mediumFont,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    // marginTop: 10,
  },
  submitButtonText: {
    fontSize: hp("2%"),
    color: "#FFFFFF",
    fontFamily: textStyles.semiBoldFont,
  },
  description: {
    paddingHorizontal: wp("16%"),
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  inviteContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  input: {
    // height: 40,
    margin: 12,
    padding: Platform.OS === "ios" ? 15 : 7,
    paddingLeft: 20,
    borderRadius: 30,
    width: wp("83%"),
    borderWidth: 2,
    borderColor: "grey",
    color: "black",
  },
})
