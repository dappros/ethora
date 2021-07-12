const isDev = true;

export const loginURL = isDev?"http://app-dev.dappros.com/v1/users/login":"http://3.140.66.155/v1/users/login";

export const tokenEtherBalanceURL = isDev?"http://app-dev.dappros.com/v1/wallets/balance/":"http://3.140.66.155/v1/wallets/balance/";

export const etherTransferURL = isDev?"http://app-dev.dappros.com/v1/ethers/transfer":"http://3.140.66.155/v1/ethers/transfer";

export const tokenTransferURL = isDev?"http://app-dev.dappros.com/v1/tokens/transfer":"http://3.140.66.155/v1/tokens/transfer";

export const transactionURL = isDev?"http://app-dev.dappros.com/v1/explorer/transactions?":"http://3.140.66.155/v1/explorer/transactions?";

export const allUserList = "http://3.140.66.155/directory/list"

export const registerUserURL = isDev?"http://app-dev.dappros.com/v1/users":"http://3.140.66.155/v1/users"

// export const wordpressLogin = "https://www.dappros.com/wp-json/jwt-auth/v1/token";

export const checkPushSubscribe = "https://rtc-gk.dappros.com:7777/api/v1/subscriptions/deviceId/"

export const subscribePushNotification = "https://rtc-gk.dappros.com:7777/api/v1/subscriptions"

export const getListOfEmails = isDev?"http://app-dev.dappros.com/v1/users/emails":"http://3.140.66.155/v1/users/emails";

//Add - POST body{loginType, email} --- Delete - DELETE parameter email
export const addOrDeleteEmail = isDev?"http://app-dev.dappros.com/v1/users/emails":"http://3.140.66.155/v1/users/emails";

export const gkHubspotContacts = "https://api.hubapi.com/contacts/v1/contact/email/"

export const checkEmailExist = isDev?"http://18.222.34.175/v1/users/checkEmail/":"http://3.140.66.155/v1/users/checkEmail/"

export const fileUpload = isDev?"http://18.222.34.175/v1/files/":"http://3.140.66.155/v1/files/";