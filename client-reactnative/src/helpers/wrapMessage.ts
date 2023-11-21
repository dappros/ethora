/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

interface wrapMessageProps {
  senderName: string
  tokenName: string
  receiverMessageId: string
  receiverName: string
}

export const wrapMessage = (data: wrapMessageProps) => {
  return [
    {
      _id: 1,
      text: `${data.senderName} wrapped ${data.tokenName}`,
      createdAt: new Date(),
      system: true,
      receiverMessageId: data.receiverMessageId,
      tokenName: data.tokenName,
      nftActionType: "wrap",
    },
  ]
}
