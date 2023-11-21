/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { showToast } from "../components/Toast/toast"
import { httpUpload } from "../config/apiService"

export const uploadFiles = async (
  file: any,
  token: string | undefined,
  url: string
) => {
  if (file && token) {
    try {
      const response = await httpUpload(url, file, token, console.log)
      return response.data
    } catch (err) {
      showToast("error", "Error", "Cannot upload file, try again later", "top")
      return false
    }
  } else {
    showToast("error", "Error", "File or token error", "top")
  }
}
