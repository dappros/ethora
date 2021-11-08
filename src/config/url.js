/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import store from "./store";

const urlDefault = 'https://app-dev.dappros.com/v1/';
const urlDefaultPort7777 = 'https://app-dev.dappros.com:7777/api/v1/';

export const loginURL = urlDefault + 'users/login';

export const tokenEtherBalanceURL = urlDefault + 'wallets/balance/';

export const etherTransferURL = urlDefault + 'ethers/transfer';

export const tokenTransferURL = urlDefault + 'tokens/transfer';

export const transactionURL = urlDefault + 'explorer/transactions?';

export const registerUserURL = urlDefault + 'users';

export const checkPushSubscribe =
  'https://dev.dxmpp.com/' + 'subscriptions/deviceId/';

export const subscribePushNotification = urlDefaultPort7777 + 'subscriptions';

export const getListOfEmails = urlDefault + 'users/emails';

export const addOrDeleteEmail = urlDefault + 'users/emails';

export const checkEmailExist = urlDefault + 'users/checkEmail/';

export const fileUpload = urlDefault + 'files/';
export const nftTransferURL = urlDefault + 'tokens/items';
export const itemTransferURL = urlDefault + 'tokens/transfer/items';
