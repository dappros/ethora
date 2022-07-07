/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import {coinsMainSymbol} from '../../docs/config';

interface systemMessageProps {
  senderName: string;
  tokenAmount: number;
  tokenName: string;
  receiverMessageId: string;
  receiverName: string;
}

export const systemMessage = (data: systemMessageProps) => {
  return [
    {
      _id: 1,
      text: `${data.senderName} -> ${data.tokenAmount} ${
        data.tokenName || coinsMainSymbol
      } -> ${data.receiverName}`,
      createdAt: new Date(),
      system: true,
      tokenAmount: data.tokenAmount,
      receiverMessageId: data.receiverMessageId,
      tokenName: data.tokenName,
    },
  ];
};
