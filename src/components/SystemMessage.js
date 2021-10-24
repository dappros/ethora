/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import {coinsMainSymbol} from '../../docs/config';

export const systemMessage=(data)=>{
    console.log(data, 'systemmessaggeahj')
    return(
        [{
            _id: 1,
            text: `${data.senderName} -> ${data.amount} ${data.tokenName || coinsMainSymbol} -> ${data.receiverName}`,
            createdAt: new Date(),
            system: true,
            tokenAmount:data.amount,
            receiverMessageId:data.receiverMessageId,
            tokenName: data.tokenName
        }]
    )
}
export const joinSystemMessage=(data)=>{
    return(
        [{
            _id: 1,
            text: `${data.username} has joined the chat`,
            createdAt: new Date(),
            system: true,
            tokenAmount:0,
            // receiverMessageId:data.receiverMessageId,
            // tokenName: data.tokenName
        }]
    )
}
