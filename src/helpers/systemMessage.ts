import { coinsMainSymbol } from "../../docs/config";

interface systemMessageProps{
    senderName:string,
    tokenAmount:number,
    tokenName:string,
    receiverMessageId:string,
    receiverName:string
}

export const systemMessage = (data:systemMessageProps) => {
    console.log(data, 'systemmessaggeahj');
    return [
      {
        _id: 1,
        text: `${data.senderName} -> ${data.amount} ${
          data.tokenName || coinsMainSymbol
        } -> ${data.receiverName}`,
        createdAt: new Date(),
        system: true,
        tokenAmount: data.amount,
        receiverMessageId: data.receiverMessageId,
        tokenName: data.tokenName,
      },
    ];
};