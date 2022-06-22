/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import * as schemaTypes from '../../constants/realmConstants';
// const Realm = require('realm');
import Realm from 'realm';

const UserSchema = {
  name: 'User',
  embeded: true,
  properties: {
    _id: 'string',
    name: 'string',
    avatar: {type: 'string', optional: true},
  },
};

const MessageSchema = {
  name: schemaTypes.MESSAGE_SCHEMA,
  primaryKey: 'message_id',
  properties: {
    _id: 'string',
    message_id: 'string',
    text: 'string',
    createdAt: 'date',
    user_id: 'string?',
    name: 'string?',
    avatar: 'string?',
    room_name: 'string',
    roomJid: 'string?',
    system: 'bool',
    tokenAmount: 'int?',
    realImageURL: 'string?',
    localURL: 'string?',
    image: 'string?',
    isStoredFile: 'bool?',
    mimetype: 'string?',
    size: 'string?',
    user: 'User',
    duration: {type: 'string', optional: true},
    waveForm: {type: 'string', optional: true},
  },
};

const ChatListSchema = {
  name: schemaTypes.CHAT_LIST_SCHEMA,
  primaryKey: 'jid',
  properties: {
    name: 'string',
    participants: 'int',
    avatar: 'string',
    jid: 'string',
    counter: 'int',
    lastUserText: 'string',
    lastUserName: 'string',
    createdAt: 'date?',
    priority: {type: 'int', optional: true},
    muted: {type: 'bool', optional: true},
  },
};

const TransactionSchema = {
  name: schemaTypes.TRANSACTION_SCHEMA,
  primaryKey: 'transactionHash',
  properties: {
    blockNumber: {type: 'int', optional: true},
    balance: {type: 'string', optional: true},
    from: 'string',
    senderFirstName: 'string',
    senderLastName: 'string',
    receiverFirstName: 'string',
    receiverLastName: 'string',
    timestamp: 'date',
    to: 'string',
    tokenId: 'string',
    receiverBalance: 'string',
    tokenName: 'string',
    transactionHash: 'string',
    senderBalance: 'string',
    type: 'string',
    value: 'int',
    nftTotal: {type: 'string', optional: true},
    nftPreview: {type: 'string', optional: true},
    nftFileUrl: {type: 'string', optional: true},
  },
};

export const databaseOptions = {
  // path: 'ethoraTest.realm',
  schema: [MessageSchema, ChatListSchema, TransactionSchema, UserSchema],
  // schemaVersion: 1, //optional
};

export const realm = new Realm(databaseOptions);

export const deleteAllRealm = () => {
  realm.write(() => {
    realm.deleteAll();
  });
};
