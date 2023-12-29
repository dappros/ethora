import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { textStyles } from "../../../docs/config";

import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { View } from "native-base";
import { showError, showSuccess } from "../Toast/toast";
import { httpPost } from "../../config/apiService";
import { resetPasswordURL } from "../../config/routesConstants";
import { useStores } from "../../stores/context";

interface ResetSecondStepProps {
  email: string;
  goNext: () => void;
}

function maskEmail(email: string): string {
  const [username, domain] = email.split("@");
  const maskedUsername = username[0] + "*".repeat(username.length - 1);
  return `${maskedUsername}@${domain}`;
}

const ResetSecondStep = ({ email }: ResetSecondStepProps) => {
  const { apiStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let intervalId;

    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((currentCountdown) => currentCountdown - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [countdown]);

  const resetPassword = async () => {
    setCountdown(30);
    setLoading(true);
    try {
      await httpPost(resetPasswordURL, { email }, apiStore.defaultToken);
      showSuccess("Success", "Check your email");
    } catch (error) {
      if (error?.response?.status === 400) {
        showError("Error", "Something went wrong");
      }
    }
    setLoading(false);
  };

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
          We sent an email to {maskEmail(email)}
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
          Still can't find the email?
        </Text>
        <TouchableOpacity
          onPress={resetPassword}
          style={{
            borderRadius: 15,
            width: "100%",
            height: 45,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginTop: 20,
            backgroundColor: countdown > 0 ? "#8F8F8F" : "#0052CD",
          }}
          disabled={countdown > 0}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: 10 }}
            />
          ) : (
            <Text style={{ fontSize: 18, color: "#fff" }}>
              {countdown > 0 ? `Wait ${countdown}s` : "Resend email"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ResetSecondStep;
