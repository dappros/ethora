/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { commonColors } from "../../../docs/config"

export const FloatingActionButton = ({ action, style, children }: any) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={action}>
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: commonColors.primaryDarkColor,
    borderRadius: 100,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
})
