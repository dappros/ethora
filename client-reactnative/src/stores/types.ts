export type TBalance = {
  balance: number;
  contractAddress: string;
  contractTokenIds?: Array<string>;
  createdAt: string;
  imagePreview: string;
  nftFileUrl: string;
  nftId: string;
  nftMetaUrl: string;
  nftMimetype: string;
  nftOriginalname: string;
  tokenName: string;
  tokenType: string;
  total: string;
  updatedAt: string;
  maxSupplies?: [100, 25, 5];
  traits?: Array<string>;
};
