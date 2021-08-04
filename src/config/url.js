const urlDefault = "https://app-dev.dappros.com/v1/";
const urlDefaultPort7777 = "https://app-dev.dappros.com:7777/api/v1/"

export const loginURL = urlDefault+"users/login";

export const tokenEtherBalanceURL = urlDefault+"wallets/balance/";

export const etherTransferURL = urlDefault+"ethers/transfer";

export const tokenTransferURL = urlDefault+"tokens/transfer";

export const transactionURL = urlDefault+"explorer/transactions?";

export const registerUserURL = urlDefault+"users"

export const checkPushSubscribe = urlDefaultPort7777+"subscriptions/deviceId/"

export const subscribePushNotification = urlDefaultPort7777+"subscriptions"

export const getListOfEmails = urlDefault+"users/emails";

export const addOrDeleteEmail = urlDefault+"users/emails";

export const checkEmailExist = urlDefault+"users/checkEmail/";

export const fileUpload = urlDefault+"files/";