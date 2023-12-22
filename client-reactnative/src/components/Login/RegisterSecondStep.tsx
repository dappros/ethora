import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { textStyles } from "../../../docs/config";

import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { View } from "native-base";

interface RegisterSecondStepProps {
  email: string;
  goNext: () => void;
}

function maskEmail(email: string): string {
  const [username, domain] = email.split("@");
  const maskedUsername = username[0] + "*".repeat(username.length - 1);
  return `${maskedUsername}@${domain}`;
}

const RegisterSecondStep = ({ email, goNext }: RegisterSecondStepProps) => {
  return (
    <>
      <View>
        <Text
          style={{
            color: "#0052CD",
            fontFamily: textStyles.regularFont,
            fontSize: hp("4.5%"),
            marginBottom: 24,
          }}
        >
          Confirm your email address
        </Text>
        <Text
          style={{
            color: "8F8F8F",
            fontFamily: textStyles.regularFont,
            fontSize: 15,
            marginBottom: 24,
          }}
        >
          We sent a confirmation email to {maskEmail(email)}.
        </Text>
      </View>
      <View>
        <View style={{ flexDirection: "row", marginBottom: 15 }}>
          <Text
            style={{
              color: "#0052CD",
              fontFamily: textStyles.regularFont,
              fontSize: 15,
            }}
          >
            {"\u2022 "}
          </Text>
          <Text
            style={{
              color: "#0052CD",
              fontFamily: textStyles.regularFont,
              fontSize: 15,
            }}
          >
            Just click on the link in the email to continue the registration
            process.
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              color: "#0052CD",
              fontFamily: textStyles.regularFont,
              fontSize: 15,
            }}
          >
            {"\u2022 "}
          </Text>
          <Text
            style={{
              color: "#0052CD",
              fontFamily: textStyles.regularFont,
              fontSize: 15,
            }}
          >
            If you don`t see it, check your spam folder.
          </Text>
        </View>
      </View>
      <View marginTop={"25%"}>
        <Text
          style={{
            color: "#0052CD",
            fontFamily: textStyles.regularFont,
            fontSize: 15,
            textAlign: "center",
          }}
        >
          Still can`t find the email?
        </Text>
        <TouchableOpacity
          onPress={goNext}
          style={{
            backgroundColor: "#0052CD",
            borderRadius: 15,
            width: "100%",
            height: 45,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginTop: 20,
          }}
          // disabled={loading || !userName || !email}
        >
          {/* {loading && (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: 10 }}
            />
          )} */}
          <Text style={{ fontSize: 18, color: "#fff" }}>Resend email</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default RegisterSecondStep;
