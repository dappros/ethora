import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import { commonColors, textStyles } from "../../../docs/config"
import RenderEmailList from "../../components/Account/RenderEmailList"
import AddNewEmailModal from "../../components/Modals/Account/AddNewEmail"
import SecondaryHeader from "../../components/SecondaryHeader/SecondaryHeader"
import { showToast } from "../../components/Toast/toast"
import { useStores } from "../../stores/context"

const newEmailAddedAlertText =
  " added to your profile's e-mail addresses. We have sent you a verification link to that address. Please open it to confirm this e-mail belongs to you."
const emailRemovedAlertText = " removed from your profile's e-mail addresses."

const AccountScreen = observer(() => {
  const { loginStore, accountStore } = useStores()

  const { userAvatar, initialData, userDescription, userToken } = loginStore

  const emailList = accountStore.emailList
  const [currentEmail, setCurrentEmail] = useState<null | string>(null)
  const [isRemoveEmail, setIsRemoveEmail] = useState<boolean>(false)
  const [isAddEmail, setIsAddEmail] = useState<boolean>(false)
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false)
  const [addEmailActive, setAddEmailActive] = useState<boolean>(false)
  const [newEmail, setNewEmail] = useState<null | string>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    accountStore.getEmailList(userToken)
  }, [])

  useEffect(() => {
    if (currentEmail) {
      //when email is added successfully send alert
      if (isAddEmail) {
        Alert.alert(
          "Verification sent",
          currentEmail + newEmailAddedAlertText,
          [{ text: "OK", onPress: () => null }]
        )

        setLoading(false)
        setIsAddEmail(false)
        setCurrentEmail(null)
        setAddEmailActive(false)
      }

      //when email is removed successfully send alert
      if (isRemoveEmail) {
        Alert.alert("Done", currentEmail + emailRemovedAlertText, [
          { text: "OK", onPress: () => null },
        ])
      }
    }
  }, [emailList])

  const deleteEmail = (email: string) => {
    const deleteTitle = "Delete Email"
    const desc = "Are you sure you want to remove " + email
    setCurrentEmail(email)
    setIsRemoveEmail(true)
    setIsAddEmail(false)
    Alert.alert(deleteTitle, desc, [
      { text: "Cancel", onPress: () => null },
      {
        text: "Yes",
        onPress: () => {
          accountStore.deleteEmailFromList(userToken, email)
        },
      },
    ])
  }

  const submitEmail = async () => {
    const emailCheckRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    if (!newEmail) {
      showToast("error", "Error", "Please enter email", "top")
    } else if (!emailCheckRegEx.test(newEmail)) {
      showToast("error", "Error", "Please enter valid email", "top")
    } else {
      setLoading(true)
      setIsAddEmail(true)
      setIsRemoveEmail(false)
      setCurrentEmail(newEmail)

      const addEmailBody = {
        loginType: "external",
        email: newEmail,
      }

      accountStore.addEmailToList(userToken, addEmailBody)
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: commonColors.primaryDarkColor }}
    >
      {/* custom header */}
      <SecondaryHeader title="Account" />
      {/* custom header */}

      {/* <Text onPress={Clipboard.setString(userToken)}>{userToken}</Text> */}

      <View style={{ flex: 1 }}>
        {/* Profile Picture */}
        <View style={{ zIndex: +1, alignItems: "center" }}>
          <View
            style={{
              width: hp("10.46%"),
              height: hp("10.46%"),
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: commonColors.primaryColor,
              borderRadius: hp("10.46%") / 2,
            }}
          >
            {userAvatar ? (
              <Image
                source={{ uri: userAvatar }}
                style={{
                  height: hp("10.46%"),
                  width: hp("10.46%"),
                  borderRadius: hp("10.46%") / 2,
                }}
              />
            ) : (
              <Text
                style={{
                  fontSize: 40,
                  color: "white",
                }}
              >
                {initialData.firstName[0] + initialData.lastName[0]}
              </Text>
            )}
          </View>
        </View>
        {/* Profile Picture */}

        {/* White border radius wall */}
        <View style={styles.whiteWallContainer}>
          {/* Name and description container */}
          <View style={styles.nameAndDescriptionContainer}>
            {/* Name Field */}
            <Text style={styles.nameTextFontStyle}>
              {initialData.firstName} {initialData.lastName}
            </Text>
            {/* Name Field */}

            {/* Description Field */}
            <Text style={styles.descriptionTextFontStyle}>
              {userDescription}
            </Text>
            {/* Description Field */}

            {/* Divider */}
            <View style={styles.divider}></View>
            {/* Divider */}
          </View>
          {/* Name and description container */}

          {/* Email Title  */}
          <View style={styles.emailTitleContainer}>
            <Text style={styles.emailTitleTextFont}>Email accounts</Text>
          </View>
          {/* Email Title  */}

          {/* Email List */}
          <View style={styles.emailListStyle}>
            {/* {this.renderEmailList(this.state.emailList)} */}
            <RenderEmailList
              emailList={emailList}
              deleteEmail={deleteEmail}
              setTooltipVisible={setTooltipVisible}
              tooltipVisible={tooltipVisible}
            />
          </View>
          {/* Email List */}

          {/* Add Email Button */}
          <View style={styles.addButtonStyleComponent}>
            <TouchableOpacity
              disabled={addEmailActive}
              onPress={() => setAddEmailActive(true)}
              style={[
                styles.addEmailButtonStyle,
                { backgroundColor: addEmailActive ? "#1212124D" : "#FBFBFB" },
              ]}
            >
              <Text style={styles.addEmailTextStyle}>Add email</Text>
            </TouchableOpacity>
          </View>
          {/* Add Email Button */}
        </View>
        {/* White border radius wall */}
      </View>
      <AddNewEmailModal
        isVisible={addEmailActive}
        loading={loading}
        setAddEmailActive={setAddEmailActive}
        setNewEmail={setNewEmail}
        submitEmail={submitEmail}
        onBackdropPress={() => setAddEmailActive(false)}
      />
    </SafeAreaView>
  )
})

export default AccountScreen

const styles = StyleSheet.create({
  whiteWallContainer: {
    flex: 1,
    backgroundColor: "#FBFBFB",
    marginTop: hp("5.5%"),
    paddingTop: hp("2.4"),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  nameAndDescriptionContainer: {
    alignItems: "center",
    marginTop: hp("5.54%"),
  },
  nameTextFontStyle: {
    fontSize: hp("2.216%"),
    fontFamily: textStyles.mediumFont,
    color: "#000000",
  },
  descriptionTextFontStyle: {
    fontSize: hp("2.23%"),
    color: "#000000",
    fontFamily: textStyles.regularFont,
    textAlign: "center",
  },
  divider: {
    width: "60%",
    border: 1,
    borderColor: "#e0e0e0",
    borderWidth: 0.5,
    marginTop: hp("2.4%"),
  },
  emailTitleContainer: {
    marginTop: hp("2.4%"),
    marginLeft: hp("1%"),
  },
  emailTitleTextFont: {
    fontSize: hp("1.97%"),
    fontFamily: textStyles.boldFont,
    color: "#000000",
  },
  emailListStyle: {
    maxHeight: "40%",
    minHeight: "10%",
    width: "100%",
    // flex:1
  },
  emailListComponentContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  emailDisplayBoxContainer: {
    width: wp("66.66%"),
    borderWidth: 1,
    borderColor: commonColors.primaryColor,
    backgroundColor: commonColors.primaryColor + "26",
    height: hp("5%"),
    justifyContent: "center",
    padding: hp("1.23%"),
    margin: hp("1.23%"),
    borderRadius: hp("0.36%"),
  },
  submitButton: {
    width: wp("16.53%"),
    height: hp("4.31%"),
    borderRadius: hp("0.36%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: commonColors.primaryColor,
  },
  submitTextStyle: {
    fontSize: hp("1.47%"),
    color: "#FFFFFF",
    fontFamily: textStyles.regularFont,
  },
  iconContainer: {
    height: hp("2.3%"),
    width: hp("2.3%"),
    margin: hp("1.23%"),
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonStyleComponent: {
    marginLeft: hp("1.2%"),
    marginTop: hp("1.23%"),
  },
  addEmailButtonStyle: {
    height: hp("4.31%"),
    width: wp("28.53%"),
    borderWidth: 1,
    borderColor: commonColors.primaryColor,
    borderRadius: hp("0.36%"),
    justifyContent: "center",
    alignItems: "center",
  },
  addEmailTextStyle: {
    fontSize: hp("1.47%"),
    color: "#000000",
    fontFamily: textStyles.regularFont,
  },
})
