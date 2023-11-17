/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import Realm from "realm"
import * as schemaTypes from "../../constants/realmConstants"
import { databaseOptions } from "./allSchemas"

//get rooms of the requested user (jid)
export const getChatRoom = (jid: string) =>
  new Promise(async (resolve, reject) => {
    const realm = await Realm.open(databaseOptions)
    const chatList = realm.objectForPrimaryKey(
      schemaTypes.CHAT_LIST_SCHEMA,
      jid
    )
    resolve(chatList)
  })

//delete a room from the list
export const deleteChatRoom = (jid: string) =>
  new Promise(async (resolve, reject) => {
    const realm = await Realm.open(databaseOptions)
    const chat = realm.objectForPrimaryKey(schemaTypes.CHAT_LIST_SCHEMA, jid)
    realm.write(() => {
      realm.delete(chat)
    })
    resolve(true)
  })

export const getRoomList = async () => {
  const realm = await Realm.open(databaseOptions)
  const roomsList = realm.objects(schemaTypes.CHAT_LIST_SCHEMA)
  return roomsList
}

//add new room object to the list

export const addChatRoom = (chatsObject: any) =>
  new Promise(async (resolve, reject) => {
    try {
      const realm = await Realm.open(databaseOptions)
      realm.write(() => {
        realm.create(schemaTypes.CHAT_LIST_SCHEMA, chatsObject)
        resolve(chatsObject)
      })
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
