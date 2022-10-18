import axios from "axios";
import { config } from "./config";
import { ExplorerRespose, IBlock, IHistory, ITransaction } from "./pages/Profile/types";
import { useStoreState } from "./store";

const { APP_JWT = "", API_URL = "" } = config;

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
  baseURL: API_URL,
});

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

// http.interceptors.response.use(undefined, (error) => {
//   console.log('interceprots ', error.request.path, error.request.path)
//   if (!error.response || error.response.status !== 401) {
//     return Promise.reject(error)
//   }

//   if (error.request.path === '/v1/users/login/refresh' || error.request.path === '/v1/users/login') {
//     console.log(`error.request.path === '/v1/users/login/refresh' || error.request.path === '/v1/users/login'`)
//     return Promise.reject(error)
//   }

//   const request = error.config

//   return refresh()
//     .then(() => {
//       return new Promise((resolve) => {
//         request.headers['Authorization'] = store.token
//         resolve(http(request))
//       })
//     })
//     .catch((error) => {
//       return Promise.reject(error)
//     })
// })

// this.xmpp.on('online', async address => {
//     this.xmpp.reconnect.delay = 2000;

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
  lastName: string
) => {
  return http.post(
    "/users",
    {
      username,
      password,
      firstName,
      lastName,
    },
    { headers: { Authorization: APP_JWT } }
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
      { headers: { Authorization: store.token } }
    );

    return respData.data;
  } catch (e) {
    console.log(JSON.stringify(e));
    return null;
  }
}

export function getBalance(walletAddress: string) {
  return http.get(`/wallets/balance/${walletAddress}`);
}

export function getPublicProfile(walletAddress: string) {
  return http.get(`/users/publicProfile/${walletAddress}`);
}

export function getTransactions(walletAddress: string) {
  return http.get<ExplorerRespose<ITransaction[]>>(`/explorer/transactions?walletAddress=${walletAddress}`);
}
export function getExplorerHistory() {
  return http.get<IHistory>(`/explorer/history`);
}
export function getExplorerBlocks(blockNumber: number | string = '') {
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

export function registerSignature(walletAddress: string, signature: string, msg: string, firstName: string, lastName: string) {
  return http.post(
    '/users',
    {
      loginType: 'signature',
      walletAddress,
      signature,
      msg,
      firstName,
      lastName
    },
    { headers: { Authorization: APP_JWT } }
  )
}

export function loginSignature(walletAddress: string, signature: string, msg: string) {
  return http.post(
    '/users/login',
    {
      loginType: 'signature',
      walletAddress,
      signature,
      msg
    },
    { headers: { Authorization: APP_JWT } }
  )
}

export function registerByEmail(email: string, password: string, firstName: string, lastName: string) {
  // "email": "keyboardcat@mailinator.com",
  // "password": "pass",
  // "firstName": "Lucky",
  // "lastName": "Guy"
  return http.post(
    '/users',
    {
      email,
      password,
      firstName,
      lastName
    },
    { headers: { Authorization: APP_JWT } }
  )
}

export function loginEmail(email: string, password: string) {
  return http.post(
    '/users/login',
    {
      email,
      password,
    },
    { headers: { Authorization: APP_JWT } }
  )
}

export function uploadFile(formData: FormData) {
  const user = useStoreState.getState().user
  return http.post(
    '/files',
    formData,
    {
      headers: { Authorization: user.token }
    }
  )
}

export function nftDeploy(name: string, mediaId: string, rarity: string) {
  const user = useStoreState.getState().user
  return http.post(
    '/tokens/items',
    {
      name,
      mediaId,
      rarity
    },
    {
      headers: { Authorization: user.token }
    }
  )
}

export function registerOwner(firstName: string, lastName: string, email: string, company: string, tnc: string) {
  return http.post(
    '/users/register',
    {
      firstName,
      lastName,
      email,
      company,
      tnc
    }
  )
}

export function loginOwner(email: string, password: string) {
  return http.post(
    '/users/login/owner',
    {
      email,
      password
    }
  )
}
