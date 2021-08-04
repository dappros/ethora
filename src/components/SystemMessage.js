import {coinsMainSymbol} from '../../docs/config';

export const systemMessage=(data)=>{
    return(
        [{
            _id: 1,
            text: `${data.senderName} -> ${data.amount} ${coinsMainSymbol} -> ${data.receiverName}`,
            createdAt: new Date(),
            system: true,
            tokenAmount:data.amount,
            receiverMessageId:data.receiverMessageId
        }]
    )
}