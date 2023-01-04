/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

// import {realm} from './allSchemas';
import Realm from 'realm';
import * as schemaTypes from '../../constants/realmConstants';
import {databaseOptions} from './allSchemas';
//fucntion to check if the room exists
async function checkQuery(checkType, check, callback) {
  const realm = await Realm.open(databaseOptions);
  let messages = realm.objects(schemaTypes.MESSAGE_SCHEMA);

  if (messages.filtered(`${checkType}="${check}"`)) {
    callback(true);
  }
  // const message = realm.objects(schemaTypes.MESSAGE_SCHEMA)
}

//function to check message_id exists
async function filter(query, schema, callback) {
  const realm = await Realm.open(databaseOptions);
  let schemaSelected = realm.objects(schema);
  let check = schemaSelected.filtered(query);
  callback(Array.from(check));
}
export const getMessage = id =>
  new Promise(async (resolve, reject) => {
    const realm = await Realm.open(databaseOptions);
    const chatList = realm.objectForPrimaryKey(schemaTypes.MESSAGE_SCHEMA, id);
    resolve(chatList);
  });
//insert message
export const insertMessages = (messageObject: any) =>
  new Promise(async (resolve, reject) => {
    const realm = await Realm.open(databaseOptions);
    const a = {
      ...messageObject,
      message_id: messageObject._id,
      room_name: messageObject.roomJid,
      tokenAmount: +messageObject.tokenAmount,
      text: messageObject.text || ' ',
      preview: messageObject.imageLocationPreview,

    };
    getMessage(messageObject._id).then(message => {
      if (!message) {
        realm.write(() => {
          realm.create(schemaTypes.MESSAGE_SCHEMA, a);
          resolve(messageObject);
        });
      }
    });
  });

//fetch message object of a particular room
export const queryRoomAllMessages = async jid =>
  new Promise(async (resolve, reject) => {
    const realm = await Realm.open(databaseOptions);
    let chats = realm.objects(schemaTypes.MESSAGE_SCHEMA);
    resolve(Array.from(chats));
  });

export const getAllMessages = async () => {
  try {
    const realm = await Realm.open(databaseOptions);
    const messages = realm.objects(schemaTypes.MESSAGE_SCHEMA);
    return Array.from(messages);
  } catch (error) {
    console.log(error);
  }
};
//update message object
export const updateTokenAmount = async (messageId, tokenAmount) => {
  try {
    const realm = await Realm.open(databaseOptions);
    let message = realm.objectForPrimaryKey(
      schemaTypes.MESSAGE_SCHEMA,
      messageId,
    );

    if(message){
      realm.write(() => {
        message.tokenAmount = message.tokenAmount + tokenAmount;
      });
    }else{
      console.log("Message object not yet created for token", message)
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateMessageText = async (messageId, messageString) => {
  try{
    const realm = await Realm.open(databaseOptions);
    let message = realm.objectForPrimaryKey(
      schemaTypes.MESSAGE_SCHEMA,
      messageId
    );

    if(message){
      realm.write(()=>{
        message.text = messageString
      })
    }else{
      console.log("No message object");
    }
  }catch(error){
    console.log(error);
  }
}

export const updateNumberOfReplies = async (messageId) => {
  try{
    const realm = await Realm.open(databaseOptions);
    let message = realm.objectForPrimaryKey(
      schemaTypes.MESSAGE_SCHEMA,
      messageId
    )

    if(message){
      realm.write(() => {
        message.numberOfReplies = message.numberOfReplies + 1
      });
    }else{
      console.log("Message object not yet created for reply", message)
    }
  } catch (error) {
    console.log(error);
  }
}
export const updateMessageToWrapped = async (messageId, {nftId, contractAddress}) => {
  try {
    const realm = await Realm.open(databaseOptions);
    let message = realm.objectForPrimaryKey(
      schemaTypes.MESSAGE_SCHEMA,
      messageId,
    );

    realm.write(() => {
      message.nftId = nftId;
      message.contractAddress = contractAddress
    });
  } catch (error) {
    console.log(error);
  }
};
