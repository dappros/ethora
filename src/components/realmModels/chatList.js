/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import {realm} from './allSchemas';
import * as schemaTypes from '../../constants/realmConstants';
import {queryRoomAllMessages} from './messages';

//check for room name
function checkRoomExist(jid, callback) {
  let chatObject = realm.objects(schemaTypes.CHAT_LIST_SCHEMA);
  if (Array.from(chatObject.filtered(`jid="${jid}"`)).length > 0) {
    callback(true);
  } else callback(false);
}

export const insertRosterList = chatsObject =>
  new Promise((resolve, reject) => {
    try {
      queryRoomAllMessages(chatsObject.jid).then(chats => {
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
        checkRoomExist(chatsObject.jid, callback => {
          if (!callback) {
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
            resolve(chat);
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });
export const updateChatRoom = (jid, property, value) =>
  new Promise((resolve, reject) => {
    realm.write(() => {
      const chatRoom = realm.objectForPrimaryKey(
        schemaTypes.CHAT_LIST_SCHEMA,
        jid,
      );

      chatRoom[property] = value;
      resolve();
    });
  });

export const updateRosterList = data =>
  new Promise((resolve, reject) => {
    console.log(realm, 'fromupdate');
    realm.write(() => {
      const chatList = realm.objectForPrimaryKey(
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

      resolve();
    });
  });
export const getChatRoom = jid =>
  new Promise((resolve, reject) => {
    const chatList = realm.objectForPrimaryKey(
      schemaTypes.CHAT_LIST_SCHEMA,
      jid,
    );
    resolve(chatList);
  });
export const deleteChatRoom = jid =>
  new Promise((resolve, reject) => {
    const chat = realm.objectForPrimaryKey(schemaTypes.CHAT_LIST_SCHEMA, jid);
    console.log(chat, '23498234239048')
    realm.write(() => {
      realm.delete(chat);
    });
    resolve();
  });

export const fetchRosterList = () =>
  new Promise((resolve, reject) => {
    const rosterList = realm.objects(schemaTypes.CHAT_LIST_SCHEMA);
    console.log(realm, 'asdadfsfgdfg');
    rosterList.isValid()
      ? rosterList.isEmpty
        ? resolve(Array.from(rosterList))
        : reject('is empty')
      : reject('not valid');
  });
