import axios from "axios";
import { API_BASE_URL, APP_TOKEN } from "./config.create";

const BASE_URL = API_BASE_URL;
const APPTOKEN = APP_TOKEN;

const store = {
  token: "",
  refreshToken: "",
};

export type TUser = {
  defaultWallet: {
    walletAddress: string;
  };
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
};

export type TLoginSuccessResponse = {
  success: true;
  token: string;
  refreshToken: string;
  user: TUser;
};

const http = axios.create({
  baseURL: BASE_URL,
});

export const exportToUsdc = (transactionId: string, l1Address: string) => {
  console.log({ transactionId, l1Address });
  return http.post("/tokens/export-to-usdc", { transactionId, l1Address });
};

export const transferDapprosCoins = (
  toWallet: string,
  amount: string,
  tokenName = "Dappros Platform Token"
) => {
  return http.post("/tokens/transfer", { toWallet, amount, tokenName });
};

export const getTransactionById = (id: string) => {
  return http.get(`/explorer/transactions/?_id=${id}`);
};

const refresh = () => {
  return new Promise((resolve, reject) => {
    http
      .post(
        "/users/login/refresh",
        {},
        { headers: { Authorization: store.refreshToken } }
      )
      .then((response) => {
        store.token = response.data.token;
        store.refreshToken = response.data.refreshToken;
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

http.interceptors.response.use(undefined, (error) => {
  if (!error.response || error.response.status !== 401) {
    return Promise.reject(error);
  }

  if (error.request.path === "/v1/users/login/refresh") {
    return Promise.reject(error);
  }

  const request = error.config;

  return refresh()
    .then(() => {
      return new Promise((resolve) => {
        request.headers["Authorization"] = store.token;
        resolve(http(request));
      });
    })
    .catch((error) => {
      return Promise.reject(error);
    });
});

// this.xmpp.on('online', async address => {
//     this.xmpp.reconnect.delay = 2000;

export const login = async (
  username: string,
  password: string
): Promise<TLoginSuccessResponse | null> => {
  try {
    const respData = await http.post(
      "/users/login",
      { username, password },
      { headers: { Authorization: APPTOKEN } }
    );

    store.token = respData.data.token;
    store.refreshToken = respData.data.refreshToken;

    return respData.data;
  } catch (e) {
    return null;
  }
};

export async function deployNfmt(
  type: string,
  name: string,
  description: string,
  owner: string,
  beneficiaries: string[],
  splitPercents: number[],
  costs: string[],
  attachmentId: string,
  maxSupplies: number[]
): Promise<any | null> {
  try {
    console.log({ headers: { Authorization: store.token } });
    const respData = await http.post(
      "/tokens/items/nfmt",
      {
        type,
        name,
        description,
        owner,
        beneficiaries,
        splitPercents,
        costs,
        attachmentId,
        maxSupplies,
      },
      { headers: { Authorization: store.token } }
    );

    return respData.data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return null;
  }
}
