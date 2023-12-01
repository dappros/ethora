/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { TouchableOpacity } from "react-native"
import * as React from "react"
import { GestureResponderEvent } from "react-native"

interface SocialButtonProperties {
  icon?: JSX.Element | JSX.Element[] | undefined
  border: boolean
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined
}

const SocialButton = (properties: SocialButtonProperties) => {
  const { onPress, icon, border } = properties
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#fff",
        borderRadius: 22.5,
        borderWidth: border ? 1 : 0,
        borderColor: border ? "#0052CD" : null,
        justifyContent: "center",
        alignItems: "center",
        height: 45,
        width: 45,
      }}
    >
      {icon}
    </TouchableOpacity>
  )
}

export default SocialButton
