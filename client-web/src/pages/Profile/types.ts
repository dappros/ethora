export type TProfile = {
  firstName: string;
  lastName: string;
  description?: string;
  profileImage?: string;
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

export interface ILineChartData {
  x: Date[] | string[];
  y: number[];
}
type TTransactionTypes = 'Token Creation' | 'Transfer' | ''
type TTransactionIds = 'NFT' | 'Doc' | "ERC20"

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
  type: TTransactionTypes;
  nftPreview?: string;
  v: string;
  value: string;
  transactionHash: string;
  _id: string;
  tokenId: TTransactionIds;
  receiverFirstName?: string;
  receiverLastName?: string;
  senderFirstName?: string;
  senderLastName?: string;
  nftName?: string;
  senderBalance?: string;
  receiverBalance?: string;
  nftTotal?: string;
}

export interface IBlock {
  difficulty: string;
  extraData: string;
  gasLimit: number;
  gasUsed: number;
  hash: string;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: string;
  number: number;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: number;
  stateRoot: string;
  timestamp: number;
  totalDifficulty: string;
  transactions: [];
  transactionsRoot: string;
  uncles: [];
}
