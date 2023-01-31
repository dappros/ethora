/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import Realm from 'realm';
import * as schemaTypes from '../../constants/realmConstants';
import {databaseOptions} from './allSchemas';
import {queryRoomAllMessages} from './messages';

//check for room name
const checkRoomExist = async (jid: any, callback: any) => {
  const realm = await Realm.open(databaseOptions);
  let chatObject = realm.objects(schemaTypes.CHAT_LIST_SCHEMA);
  if (Array.from(chatObject.filtered(`jid="${jid}"`)).length > 0) {
    callback(true);
  } else callback(false);
};

export const insertRosterList = (chatsObject: any) =>
  new Promise((resolve, reject) => {
    try {
      queryRoomAllMessages(chatsObject.jid).then((chats: any) => {
        const lastUserName = chats.length ? chats[chats.length - 1].name : '';
        const lastUserText = chats.length ? chats[chats.length - 1].text : '';
        const createdAt = chats.length
          ? chats[chats.length - 1].createdAt
          : new Date();
        const chatListObject = {
          name: chatsObject.name,
          jid: chatsObject.jid,
          participants: chatsObject.participants,
          avatar: chatsObject.avatar,
          counter: chatsObject.counter,
          lastUserName: lastUserName,
          lastUserText: lastUserText,
          createdAt: createdAt,
          priority: chatsObject.priority,
        };
        checkRoomExist(chatsObject.jid, async (callback: boolean) => {
          if (!callback) {
            const realm = await Realm.open(databaseOptions);
            realm.write(() => {
              realm.create(schemaTypes.CHAT_LIST_SCHEMA, chatListObject);
              resolve(chatListObject);
            });
          } else {
            let chat = updateChatRoom(
              chatsObject.jid,
              'priority',
              chatsObject.priority,
            );
            updateChatRoom(chatsObject.jid, 'name', chatsObject.name);
            updateChatRoom(
              chatsObject.jid,
              'participants',
              chatsObject.participants,
            );

            resolve(chat);
          }
        });
      });
    } catch (error) {
      alert(error);
      reject(error);
    }
  });

export const updateChatRoom = (jid: string, property: string, value: any) =>
  new Promise(async (resolve, reject) => {
    const realm = await Realm.open(databaseOptions);
    realm.write(() => {
      const chatRoom: any = realm.objectForPrimaryKey(
        schemaTypes.CHAT_LIST_SCHEMA,
        jid,
      );

      if (chatRoom) {
        chatRoom[property] = value;
      }

      resolve(true);
    });
  });

export const updateRosterList = (data: any) =>
  new Promise(async (resolve, reject) => {
    const realm = await Realm.open(databaseOptions);
    realm.write(() => {
      const chatList: any = realm.objectForPrimaryKey(
        schemaTypes.CHAT_LIST_SCHEMA,
        data.jid,
      );
      if (data.lastUserName && data.lastUserText) {
        chatList.lastUserText = data.lastUserText;
        chatList.lastUserName = data.lastUserName;
      }
      if (data.counter) {
        chatList.counter = data.counter;
      }
      if (data.participants) {
        chatList.participants = data.participants;
      }
      if (data.createdAt) {
        chatList.createdAt = data.createdAt;
      }
      if (data.name) {
        chatList.name = data.name;
      }
      if (data.priority) {
        chatList.priority = data.priority;
      }
      if (data.muted) {
        chatList.muted = data.muted;
      }

      resolve(true);
    });
  });
export const getChatRoom = (jid: string) =>
  new Promise(async (resolve, reject) => {
    const realm = await Realm.open(databaseOptions);
    const chatList = realm.objectForPrimaryKey(
      schemaTypes.CHAT_LIST_SCHEMA,
      jid,
    );
    resolve(chatList);
  });
export const deleteChatRoom = (jid: string) =>
  new Promise(async (resolve, reject) => {
    const realm = await Realm.open(databaseOptions);
    const chat = realm.objectForPrimaryKey(schemaTypes.CHAT_LIST_SCHEMA, jid);
    realm.write(() => {
      realm.delete(chat);
    });
    resolve(true);
  });

export const fetchRosterList = () =>
  new Promise(async (resolve, reject) => {
    const realm = await Realm.open(databaseOptions);
    const rosterList: any = realm.objects(schemaTypes.CHAT_LIST_SCHEMA);
    rosterList.isValid()
      ? rosterList.isEmpty
        ? resolve(Array.from(rosterList))
        : reject('is empty')
      : reject('not valid');
  });

export const getRoomList = async () => {
  const realm = await Realm.open(databaseOptions);
  const roomsList = realm.objects(schemaTypes.CHAT_LIST_SCHEMA);
  return roomsList;
};

export const addChatRoom = (chatsObject: any) =>
  new Promise(async (resolve, reject) => {
    try {
      const realm = await Realm.open(databaseOptions);
      realm.write(() => {
        realm.create(schemaTypes.CHAT_LIST_SCHEMA, chatsObject);
        resolve(chatsObject);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
