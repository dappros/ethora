/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import AsyncStorage from "@react-native-async-storage/async-storage"

export const setAsyncStore = async (data: any, key: string, callback: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(data))
    .then(() => {
      callback(data)
    })
    .catch((error) => console.log(error))
}

export const getAsyncStore = async (
  key: string,
  callback: (arg0: string | null) => void
) => {
  await AsyncStorage.getItem(key).then((data) => {
    callback(JSON.parse(data))
  })
}

export const multiGetAsyncStore = async (
  keyList: [],
  callback: (arg0: string | null) => void
) => {
  await AsyncStorage.multiGet(keyList).then((data) => {
    callback(JSON.parse(data))
  })
}
