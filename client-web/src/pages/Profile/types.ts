export type TProfile = {
  firstName: string;
  lastName: string;
  description: string;
  profileImage: string;
};

export type TTransactions = {
  limit: number;
  offset: number;
  total: number;
  items: Record<string, string>[];
};

export interface ExplorerRespose<T> {
  limit: number;
  offset: number;
  total: number;
  items: T;
}

export interface IHistory {
  x: Date[] | string[];
  y: number[];
}
export interface ITransaction {
  blockHash: string;
  blockNumber: number;
  from: string;
  fromFirstName: string;
  fromLastName: string;
  gas: string;
  gasPrice: string;
  hash: string;
  input: string;
  nonce: string;
  r: string;
  s: string;
  timestamp: string;
  to: string;
  toFirstName: string;
  toLastName: string;
  tokenName: string;
  transactionIndex: string;
  type: string;
  v: string;
  value: string;
  transactionHash: string;
  _id: string;
  tokenId: string;
}
