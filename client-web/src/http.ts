import axios from "axios";
import { config } from "./config";
import { PUSH_URL } from "./constants";
import {
  ExplorerRespose,
  IBlock,
  ILineChartData,
  ITransaction,
} from "./pages/Profile/types";
import { useStoreState } from "./store";
import qs from "qs";
import type { Stripe } from "stripe";

const { APP_JWT = "", API_URL = "" } = config;

export type TDefaultWallet = {
  walletAddress: string;
};
export interface ICompany {
  name: string;
  address: string;
  town: string;
  regionOrState: string;
  postCode: string;
  country: string;
  phoneNumber: string;
  registrationNumber: string;
  payeReference: string;
}
export type TUser = {
  firstName: string;
  lastName: string;
  description?: string;
  xmppPassword?: string;
  _id: string;
  walletAddress: string;
  token: string;
  refreshToken?: string;
  profileImage?: string;
  referrerId?: string;
  ACL?: {
    ownerAccess: boolean;
    masterAccess: boolean;
  };
  isProfileOpen?: boolean;
  isAssetsOpen?: boolean;
  isAllowedNewAppCreate: boolean;
  appId?: string;
  isAgreeWithTerms: boolean;
  stripeCustomerId?: string;
  defaultWallet: TDefaultWallet;
  company?: ICompany[];
};

export type TLoginSuccessResponse = {
  token: string;
  refreshToken: string;
  user: TUser;
  subscriptions?: { data: Stripe.Subscription[] };
  paymentMethods?: { data: Stripe.PaymentMethod[] };
  isAllowedNewAppCreate: boolean;
};

export interface IUser {
  ACL: { ownerAccess: boolean };
  appId: string;
  createdAt: Date;
  defaultWallet: {
    walletAddress: string;
  };
  emails: [];
  email?: string;
  firstName: string;
  isAssetsOpen: true;
  isProfileOpen: true;
  lastName: string;
  password: string;
  roles: [];
  tags: [];
  updatedAt: Date;
  username: string;
  xmppPassword: string;
  __v: number;
  _id: string;
}

export type TPermission = {
  admin?: boolean;
  create?: boolean;
  delete?: boolean;
  read?: boolean;
  update?: boolean;
  disabled?: Array<string>;
};

export interface IUserAcl {
  result: {
    application: {
      appCreate: TPermission;
      appPush: TPermission;
      appSettings: TPermission;
      appStats: TPermission;
      appTokens: TPermission;
      appUsers: TPermission;
    };
    network: {
      netStats: TPermission;
    };
    createdAt?: Date | string;
    updatedAt?: Date | string;
    userId?: string;
    _id?: string;
    appId?: string;
  };
}

const http = axios.create({
  baseURL: API_URL,
});

export const httpWithAuth = () => {
  const user = useStoreState.getState().user;
  http.defaults.headers.common["Authorization"] = user.token;
  return http;
};
export const xmppHttp = axios.create({ baseURL: PUSH_URL });

export const httpWithToken = (token: string) => {
  http.defaults.headers.common["Authorization"] = token;
  return http;
};
export interface IFile {
  _id: string;
  createdAt: string;
  expiresAt: number;
  filename: string;
  isVisible: true;
  location: string;
  locationPreview: string;
  mimetype: string;
  originalname: string;
  ownerKey: string;
  size: number;
  updatedAt: string;
  userId: string;
}
export interface IDocument {
  _id: string;
  admin: string;
  contractAddress: string;
  createdAt: Date;
  documentName: "Fff";
  files: Array<string>;
  hashes: Array<string>;
  isBurnable: boolean;
  isFilesMutableByAdmin: boolean;
  isFilesMutableByOwner: boolean;
  isSignable: boolean;
  isSignatureRevoсable: boolean;
  isTransferable: boolean;
  owner: string;
  updatedAt: Date;
  userId: string;
  file: IFile;
  location: string;
  locations: Array<string>;
}

export function refresh() {
  return new Promise((resolve, reject) => {
    const state = useStoreState.getState();
    console.log("post to refresh ", state.user.refreshToken);
    http
      .post(
        "/users/login/refresh",
        {},
        { headers: { Authorization: state.user.refreshToken } }
      )
      .then((response) => {
        useStoreState.setState((state) => {
          state.user.token = response.data.token;
          state.user.refreshToken = response.data.refreshToken;
          resolve(response);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

http.interceptors.response.use(undefined, (error) => {
  const user = useStoreState.getState().user;

  if (user.firstName) {
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (
      error.config.url === "/users/login/refresh" ||
      error.config.url === "/users/login"
    ) {
      return Promise.reject(error);
    }

    const request = error.config;

    return refresh()
      .then(() => {
        return new Promise((resolve) => {
          const user = useStoreState.getState().user;
          request.headers["Authorization"] = user.token;
          resolve(http(request));
        });
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
});

export const loginUsername = (username: string, password: string) => {
  return http.post<TLoginSuccessResponse>(
    "/users/login",
    { username, password },
    { headers: { Authorization: APP_JWT } }
  );
};

export const subscribeForPushNotifications = (token: string, jid: string) => {
  const body = {
    appId: "Ethora",
    deviceId: token,
    deviceType: "12",
    environment: "Production",
    externalId: "",
    isSubscribed: "1",
    jid: jid,
    screenName: "Ethora",
  };
  return xmppHttp.post("/subscriptions/deviceId/", qs.stringify(body));
};

export const registerUsername = (
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  appJwt?: string
) => {
  return http.post(
    "/users",
    {
      username,
      password,
      firstName,
      lastName,
    },
    { headers: { Authorization: appJwt ? appJwt : APP_JWT } }
  );
};

export async function deployNfmt(
  type: string,
  name: string,
  symbol: string,
  description: string,
  owner: string,
  beneficiaries: string[],
  splitPercents: number[],
  costs: string[],
  attachmentId: string,
  maxSupplies: number[]
): Promise<any | null> {
  const user = useStoreState.getState().user;
  try {
    const respData = await http.post(
      "/tokens/items/nfmt",
      {
        type,
        name,
        symbol,
        description,
        owner,
        beneficiaries,
        splitPercents,
        costs,
        attachmentId,
        maxSupplies,
      },
      { headers: { Authorization: user.token } }
    );

    return respData.data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return null;
  }
}

export function getBalance(walletAddress: string) {
  const user = useStoreState.getState().user;
  return http.get(`/wallets/balance`, {
    headers: { Authorization: user.token },
  });
}

export function getPublicProfile(walletAddress: string) {
  return http.get(`/users/profile/${walletAddress}`);
}

export function getTransactions(walletAddress: string) {
  return http.get<ExplorerRespose<ITransaction[]>>(
    `/explorer/transactions?walletAddress=${walletAddress}`
  );
}
export function getProvenanceTransacitons(walletAddress: string, nftId) {
  return http.get<ExplorerRespose<ITransaction[]>>(
    `/explorer/transactions?walletAddress`,
    {
      params: {
        walletAddress,
        nftId,
      },
    }
  );
}
export function getExplorerHistory() {
  return http.get<ILineChartData>(`/explorer/history`);
}
export function getUserCompany(token: string) {
  return httpWithToken(token).get<{ result: ICompany[] }>(`/company`);
}
export function getExplorerBlocks(blockNumber: number | string = "") {
  return http.get<ExplorerRespose<IBlock[]>>(`/explorer/blocks/` + blockNumber);
}
export function getTransactionDetails(transactionHash: string) {
  return http.get<ITransaction>(`/explorer/transactions/` + transactionHash);
}
export function checkExtWallet(walletAddress: string) {
  return http.post(
    `/users/checkExtWallet`,
    { walletAddress },
    { headers: { Authorization: APP_JWT } }
  );
}
interface ISubscriptionResponse {
  paymentMethods: { data: Stripe.PaymentMethod[] };
  subscriptions: { data: Stripe.Subscription[] };
}

export function getSubscriptions() {
  return httpWithAuth().get<ISubscriptionResponse>("/stripe/subscriptions");
}

export function registerSignature(
  walletAddress: string,
  signature: string,
  msg: string,
  firstName: string,
  lastName: string
) {
  return http.post(
    "/users",
    {
      loginType: "signature",
      walletAddress,
      signature,
      msg,
      firstName,
      lastName,
    },
    { headers: { Authorization: APP_JWT } }
  );
}

export function loginSignature(
  walletAddress: string,
  signature: string,
  msg: string
) {
  return http.post(
    "/users/login",
    {
      loginType: "signature",
      walletAddress,
      signature,
      msg,
    },
    { headers: { Authorization: APP_JWT } }
  );
}

export function registerByEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  signUpPlan?: string
) {
  return http.post(
    "/users",
    {
      email,
      password,
      firstName,
      lastName,
      signupPlan: signUpPlan,
    },
    { headers: { Authorization: APP_JWT } }
  );
}

export function loginEmail(email: string, password: string) {
  return http.post<TLoginSuccessResponse>(
    "/users/login",
    {
      email,
      password,
    },
    { headers: { Authorization: APP_JWT } }
  );
}
export function agreeWithTerms(company: string) {
  return httpWithAuth().post("/users/terms-and-conditions", {
    isAgreeWithTerms: true,
    company,
  });
}

export function loginSocial(
  idToken: string,
  accessToken: string,
  loginType: string,
  authToken: string = "authToken"
) {
  return http.post<TLoginSuccessResponse>(
    "/users/login",
    {
      idToken,
      accessToken,
      loginType,
      authToken,
    },
    { headers: { Authorization: APP_JWT } }
  );
}

export function checkEmailExist(email: string) {
  return http.get(
    "/users/checkEmail/" + email,

    { headers: { Authorization: APP_JWT } }
  );
}
export function getUserAcl(userId: string) {
  const user = useStoreState.getState().user;

  return http.get<IUserAcl>(
    "/users/acl/" + userId,

    { headers: { Authorization: user.token } }
  );
}
export function getMyAcl() {
  const user = useStoreState.getState().user;

  return http.get<IUserAcl>(
    "/users/acl/",

    { headers: { Authorization: user.token } }
  );
}
export interface IAclBody {
  application: {
    appCreate?: TPermission;
    appPush?: TPermission;
    appSettings?: TPermission;
    appStats?: TPermission;
    appTokens?: TPermission;
    appUsers?: TPermission;
  };
  network: {
    netStats: TPermission;
  };
}
export function updateUserAcl(userId: string, body: IAclBody) {
  const owner = useStoreState.getState().user;

  return http.put<IUserAcl>(
    "/users/acl/" + userId,
    body,

    { headers: { Authorization: owner.token } }
  );
}

export function registerSocial(
  idToken: string,
  accessToken: string,
  authToken: string,
  loginType: string,
  signUpPlan?: string
) {
  return http.post(
    "/users",
    {
      idToken,
      accessToken,
      loginType,
      authToken: authToken,
      signupPlan: signUpPlan,
    },
    { headers: { Authorization: APP_JWT } }
  );
}
export function uploadFile(formData: FormData) {
  const user = useStoreState.getState().user;
  return http.post("/files", formData, {
    headers: { Authorization: user.token },
  });
}

export function nftDeploy(name: string, mediaId: string, rarity: string) {
  const user = useStoreState.getState().user;
  return http.post(
    "/tokens/items",
    {
      name,
      mediaId,
      rarity,
    },
    {
      headers: { Authorization: user.token },
    }
  );
}

export function registerOwner(
  firstName: string,
  lastName: string,
  email: string,
  company: string,
  tnc: string
) {
  return http.post("/users/register", {
    firstName,
    lastName,
    email,
    company,
    tnc,
  });
}

export function loginOwner(email: string, password: string) {
  return http.post("/users/login/owner", {
    email,
    password,
  });
}

export function getApps() {
  const owner = useStoreState.getState().user;
  return http.get("/apps", {
    headers: { Authorization: owner.token },
  });
}

export function createApp(fd: FormData) {
  const owner = useStoreState.getState().user;
  return http.post("/apps", fd, {
    headers: { Authorization: owner.token },
  });
}

export function deleteApp(id: string) {
  const owner = useStoreState.getState().user;
  return http.delete(`/apps/${id}`, {
    headers: { Authorization: owner.token },
  });
}

export function updateApp(id: string, fd: FormData) {
  const owner = useStoreState.getState().user;
  return http.put(`/apps/${id}`, fd, {
    headers: { Authorization: owner.token },
  });
}

export function getAppUsers(
  appId: string,
  limit: number = 10,
  offset: number = 0
) {
  const owner = useStoreState.getState().user;
  return http.get<ExplorerRespose<IUser[]>>(
    `/users?appId=${appId}&limit=${limit}&offset=${offset}`,
    {
      headers: { Authorization: owner.token },
    }
  );
}

export function rotateAppJwt(appId: string) {
  const owner = useStoreState.getState().user;
  return http.post(`/apps/rotate-jwt/${appId}`, null, {
    headers: { Authorization: owner.token },
  });
}
export function addTagToUser(tag: string, userIds: string[]) {
  return httpWithAuth().post(`/users/tags`, { tag, userId: userIds });
}
export function sendTokens( userIds: string[], quantity: number | string) {
  return httpWithAuth().post(`/users/tokens`, { userId: userIds, quantity });
}
export function removeTagFromUser(tag: string, userIds: string[], removeAll = false) {
  return httpWithAuth().put(`/users/tags`, { tag, userId: userIds, removeAll });
}
export function resetUsersPasswords(userIds: string[]) {
  return httpWithAuth().post(`/users/resetPassword`, { userId: userIds });
}
export function deleteUsers(userIds: string[]) {
  return httpWithAuth().delete(`/users/` + userIds);
}
export function updateProfile(fd: FormData, id?: string) {
  const path = id ? `/users/${id}` : "/users";
  const user = useStoreState.getState().user;
  return http.put(path, fd, {
    headers: { Authorization: user.token },
  });
}

interface ITokenTransferResponse {
  success: boolean;
  transaction: ITransaction;
}

export function transferCoin(
  tokenId: string,
  tokenName: string,
  amount: number,
  toWallet: string
) {
  const path = "tokens/transfer";
  const user = useStoreState.getState().user;
  return http.post<ITokenTransferResponse>(
    path,
    { tokenId, tokenName, amount, toWallet },
    {
      headers: { Authorization: user.token },
    }
  );
}

export function changeUserData(data: FormData) {
  const user = useStoreState.getState().user;
  return http.put("/users/", data, {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate, br",

      "Content-Type": "multipart/form-data",
      Authorization: user.token,
    },
  });
}

export function getSharedLinksService() {
  const user = useStoreState.getState().user;
  return http.get("/shareLink/", {
    headers: {
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/json",
      Authorization: user.token,
    },
  });
}

export function deleteSharedLink(linkToken: string) {
  const user = useStoreState.getState().user;
  return http.delete(`/shareLink/${linkToken}`, {
    headers: {
      Authorization: user.token,
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/json",
    },
  });
}

export function createSharedLink(data: any) {
  const user = useStoreState.getState().user;
  return http.post("/shareLink/", data, {
    headers: {
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/json",
      Authorization: user.token,
    },
  });
}

export function deleteAccountService() {
  const user = useStoreState.getState().user;
  return http.delete("/users/", {
    headers: {
      Authorization: user.token,
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/json",
    },
  });
}

export function getDocuments() {
  const user = useStoreState.getState().user;
  return http.get(`/docs/${user.walletAddress}`, {
    headers: {
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/json",
      Authorization: user.token,
    },
  });
}
