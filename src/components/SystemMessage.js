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