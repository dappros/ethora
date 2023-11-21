import React from "react"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { Text } from "native-base"
import { TouchableOpacity } from "react-native"

const CreateAccountButton = () => {
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
    >
      <Text style={{ color: "#fff", fontSize: 15 }}>Create an account</Text>
    </TouchableOpacity>
  )
}

export default CreateAccountButton
