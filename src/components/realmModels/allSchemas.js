/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import * as schemaTypes from '../../constants/realmConstants';
// const Realm = require('realm');
import Realm from 'realm';

const MessageSchema = {
    name:schemaTypes.MESSAGE_SCHEMA,
    primaryKey:"message_id",
    properties:{
        message_id:'string',
        text:'string',
        createdAt:'date',
        user_id:'string?',
        name:'string?',
        avatar:'string?',
        room_name:'string',
        system:'bool',
        tokenAmount:'int?',
        realImageURL:'string?',
        localURL:'string?',
        image:'string?',
        isStoredFile:'bool?',
        mimetype:'string?',
        size:'string?',
        duration:{type: 'string', optional: true}

    }
}

const ChatListSchema={
    name:schemaTypes.CHAT_LIST_SCHEMA,
    primaryKey:"jid",
    properties:{
        name:'string',
        participants:'int',
        avatar:'string',
        jid:'string',
        counter:'int',
        lastUserText:'string',
        lastUserName:'string',
        createdAt:'date?',
        priority: {type: 'int', optional: true}

    }
}

const TransactionSchema={
    name: schemaTypes.TRANSACTION_SCHEMA,
    primaryKey:"transactionHash",
    properties:{
        // blockNumber:'int',
        from:'string',
        fromFirstName:'string',
        fromLastName:'string',
        toFirstName:'string',
        toLastName:'string',
        timestamp:'date',
        to:'string',
        tokenId:'string',
        nftTotal: 'string',
        receiverBalance: 'string',
        // _id: 'string',
        tokenName:'string',
        transactionHash:'string',
        senderBalance: 'string',
        type:'string',
        value:'int',
        nftPreview: 'string',
        nftFileUrl: 'string'
    }
}


export const databaseOptions = {
    path: 'ethoraTest.realm',
    schema:[MessageSchema, ChatListSchema, TransactionSchema],
    schemaVersion: 0, //optional
}

export const realm = new Realm(databaseOptions);
console.log(realm,"thisisrealm")

export const deleteAllRealm =()=> {
    realm.write(()=>{
        realm.deleteAll()
    });
}
