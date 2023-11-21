/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import AsyncStorage from "@react-native-async-storage/async-storage"

export const asyncStorageGetItem = async (key) => {
  try {
    const res = await AsyncStorage.getItem(key)
    if (!res) return ""
    return JSON.parse(res)
  } catch (e) {
    console.log("ERROR: Cannot get item from asyncStorage")
  }
}
