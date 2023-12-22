import React, { FC } from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Text } from "native-base";
import { TouchableOpacity } from "react-native";

interface CreateAccountButtonProps {
  navigateToRegisterScreen: any;
}

const CreateAccountButton: FC<CreateAccountButtonProps> = ({
  navigateToRegisterScreen,
}) => {
  return (
    <TouchableOpacity
      style={{
        position: "relative",
        borderRadius: 10,
        height: hp("5.9%"),
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#fff",
      }}
      onPress={navigateToRegisterScreen}
    >
      <Text style={{ color: "#fff", fontSize: 15 }}>Create an account</Text>
    </TouchableOpacity>
  );
};

export default CreateAccountButton;
