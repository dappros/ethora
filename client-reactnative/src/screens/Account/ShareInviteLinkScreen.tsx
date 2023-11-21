import React from "react"
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Image,
} from "react-native"

import AntIcon from "react-native-vector-icons/AntDesign"
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen"
import {
  coinImagePath,
  coinReplacedSymbol,
  commonColors,
  textStyles,
} from "../../../docs/config"

import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5"

interface ShareInviteLinkProps {
  link: string
  onPressShare: () => void
}

export const ShareInviteLink: React.FC<ShareInviteLinkProps> = ({
  link,
  onPressShare,
}) => {
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <AntIcon
            name="adduser"
            size={hp("10%")}
            color={commonColors.primaryDarkColor}
          />
        </View>
        <View style={styles.description}>
          <Text style={{ textAlign: "center", color: "black" }}>
            Gift friends 25
            <Image
              style={{ width: 16, height: 16 }}
              source={coinImagePath}
            />{" "}
            and receive 25
            <Image style={{ width: 16, height: 16 }} source={coinImagePath} />.
            Send friends invite with your personal invitation code
          </Text>
        </View>

        <View style={styles.inviteContainer}>
          <Text style={{ fontFamily: textStyles.boldFont, marginBottom: 10 }}>
            Your invitation code
          </Text>
          <TouchableOpacity
            accessibilityLabel="Share invite link"
            style={styles.submitButton}
            onPress={onPressShare}
          >
            <Text style={styles.submitButtonText}>{link}</Text>
            <FontAwesomeIcon
              color={"white"}
              size={hp("3%")}
              name={"share-square"}
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
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
