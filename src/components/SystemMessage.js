import * as DapprosConstants from '../constants/dapprosConstants';

export const systemMessage=(data)=>{
    return(
        [{
            _id: 1,
            text: `${data.senderName} -> ${data.amount} ${DapprosConstants.tokenUnit} -> ${data.receiverName}`,
            createdAt: new Date(),
            system: true,
            tokenAmount:data.amount,
            receiverMessageId:data.receiverMessageId
        }]
    )
}