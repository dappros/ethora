/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

// import {realm} from './allSchemas';
import Realm from "realm"
import * as schemaTypes from "../../constants/realmConstants"
import { databaseOptions } from "./allSchemas"

export const getMessage = (id: string) =>
  new Promise(async (resolve) => {
    const realm = await Realm.open(databaseOptions)
    const chatList = realm.objectForPrimaryKey(schemaTypes.MESSAGE_SCHEMA, id)
    resolve(chatList)
  })
//insert message
export const insertMessages = (messageObject: any) =>
  new Promise(async (resolve) => {
    const realm = await Realm.open(databaseOptions)
    const a = {
      ...messageObject,
      message_id: messageObject._id,
      room_name: messageObject.roomJid,
      tokenAmount: +messageObject.tokenAmount,
      text: messageObject.text || " ",
      preview: messageObject.imageLocationPreview,
    }
    getMessage(messageObject._id).then((message) => {
      if (!message) {
        realm.write(() => {
          realm.create(schemaTypes.MESSAGE_SCHEMA, a)
          resolve(messageObject)
        })
      }
    })
  })

//fetch message object of a particular room
export const queryRoomAllMessages = async () =>
  new Promise(async (resolve) => {
    const realm = await Realm.open(databaseOptions)
    const chats = realm.objects(schemaTypes.MESSAGE_SCHEMA)
    resolve(Array.from(chats))
  })

export const getAllMessages = async () => {
  try {
    const realm = await Realm.open(databaseOptions)
    const messages = realm.objects(schemaTypes.MESSAGE_SCHEMA)
    return Array.from(messages)
  } catch (error) {
    console.log(error)
    return []
  }
}
//update message object
export const updateTokenAmount = async (
  messageId: string,
  tokenAmount: number
) => {
  try {
    const realm = await Realm.open(databaseOptions)
    const message = realm.objectForPrimaryKey(
      schemaTypes.MESSAGE_SCHEMA,
      messageId
    )

    if (message) {
      realm.write(() => {
        //@ts-ignore
        message.tokenAmount = message.tokenAmount + tokenAmount
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export const updateMessageText = async (
  messageId: string,
  messageString: string
) => {
  try {
    const realm = await Realm.open(databaseOptions)
    const message: any = realm.objectForPrimaryKey(
      schemaTypes.MESSAGE_SCHEMA,
      messageId
    )

    if (message) {
      realm.write(() => {
        message.text = messageString
      })
    } else {
      console.log("No message object")
    }
  } catch (error) {
    console.log(error)
  }
}

export const updateNumberOfReplies = async (
  messageId: string,
  numberOfReplies: number
) => {
  try {
    const realm = await Realm.open(databaseOptions)
    const message: any = realm.objectForPrimaryKey(
      schemaTypes.MESSAGE_SCHEMA,
      messageId
    )
    if (message) {
      realm.write(() => {
        message.numberOfReplies = numberOfReplies
      })
    } else {
      console.log("Message object not yet created for reply")
    }
  } catch (error) {
    console.log(error, "err", messageId)
  }
}
export const updateMessageToWrapped = async (
  messageId: string,
  { nftId, contractAddress }: { nftId: string; contractAddress: string }
) => {
  try {
    const realm = await Realm.open(databaseOptions)
    const message: any = realm.objectForPrimaryKey(
      schemaTypes.MESSAGE_SCHEMA,
      messageId
    )

    realm.write(() => {
      message.nftId = nftId
      message.contractAddress = contractAddress
    })
  } catch (error) {
    console.log(error)
  }
}

export const deleteMessageObject = async (messageId: string) => {
  try {
    const realm = await Realm.open(databaseOptions)
    const message: any = realm.objectForPrimaryKey(
      schemaTypes.MESSAGE_SCHEMA,
      messageId
    )
    realm.write(() => {
      realm.delete(message)
    })
    return true
  } catch (err: any) {
    return { success: false, error: err }
  }
}
