import axios from "axios";
import { config } from "./config";
import {
  ExplorerRespose,
  IBlock,
  IHistory,
  ITransaction,
} from "./pages/Profile/types";
import { useStoreState } from "./store";

const { APP_JWT = "", API_URL = "" } = config;

export type TUser = {
  defaultWallet: {
    walletAddress: string;
  };
  description?: string;
  tags: string[];
  roles: string[];
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  ACL: {
    ownerAccess: boolean;
  };
  appId: string;
  xmppPassword: string;
  profileImage: string;
  isProfileOpen?: boolean;
  isAssetsOpen?: boolean;
};

export type TLoginSuccessResponse = {
  success: true;
  token: string;
  refreshToken: string;
  user: TUser;
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
  return http.post(
    "/users/login",
    { username, password },
    { headers: { Authorization: APP_JWT } }
  );
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
  return http.get<IHistory>(`/explorer/history`);
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
  lastName: string
) {
  return http.post(
    "/users",
    {
      email,
      password,
      firstName,
      lastName,
    },
    { headers: { Authorization: APP_JWT } }
  );
}

export function loginEmail(email: string, password: string) {
  return http.post(
    "/users/login",
    {
      email,
      password,
    },
    { headers: { Authorization: APP_JWT } }
  );
}

export function loginSocial(
  idToken: string,
  accessToken: string,
  loginType: string,
  authToken: string = "authToken"
) {
  return http.post(
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
  loginType: string
) {
  return http.post(
    "/users",
    {
      idToken,
      accessToken,
      loginType,
      authToken: authToken,
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

export function updateProfile(fd: FormData, id?: string) {
  const path = id ? `/users/${id}` : "/users";
  const user = useStoreState.getState().user;
  return http.put(path, fd, {
    headers: { Authorization: user.token },
  });
}
