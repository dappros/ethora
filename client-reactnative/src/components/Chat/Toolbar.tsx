import React from "react";
import { InputToolbar } from "react-native-gifted-chat";

const Toolbar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        shadowColor: "#000000",
        shadowOffset: { width: -3, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
      }}
    />
  );
};

export default Toolbar;
