/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import Toast from "react-native-toast-message"

export const showToast = (
  type: "success" | "error",
  title: string,
  desc: string,
  position: "top" | "bottom"
) => {
  Toast.show({
    type: type,
    text1: title,
    text2: desc,
    position: position,
  })
}
export const showError = (title: string, subtitle: string) => {
  Toast.show({
    type: "error",
    text1: title,
    text2: subtitle,
    position: "bottom",
  })
}
export const showInfo = (title: string, subtitle: string) => {
  Toast.show({
    type: "info",
    text1: title,
    text2: subtitle,
    position: "bottom",
  })
}
export const showSuccess = (title: string, subtitle: string) => {
  Toast.show({
    type: "success",
    text1: title,
    text2: subtitle,
    position: "bottom",
  })
}
