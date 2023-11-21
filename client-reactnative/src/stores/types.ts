export type TBalance = {
  balance: number
  contractAddress: string
  contractTokenIds?: Array<string>
  createdAt: string
  imagePreview: string
  nftFileUrl: string
  nftId: string
  nftMetaUrl: string
  nftMimetype: string
  nftOriginalname: string
  tokenName: string
  tokenType: string
  total: string
  updatedAt: string
  maxSupplies?: [100, 25, 5]
  traits?: string[][]
  balances?: Array<number>
  _id: string
  nfmtType?: string
}

export interface IFile {
  _id: string
  createdAt: string
  expiresAt: number
  filename: string
  isVisible: boolean
  location: string
  locationPreview: string
  mimetype: string
  originalname: string
  ownerKey: string
  size: number
  updatedAt: string
  userId: string
}
export interface IDocument {
  _id: string
  admin: string
  contractAddress: string
  createdAt: Date
  documentName: string
  files: Array<string>
  hashes: Array<string>
  isBurnable: boolean
  isFilesMutableByAdmin: boolean
  isFilesMutableByOwner: boolean
  isSignable: boolean
  isSignatureRevoсable: boolean
  isTransferable: boolean
  owner: string
  updatedAt: Date
  userId: string
  file: IFile
}
export interface ITransation {
  __v: number
  _id: string
  createdAt: string
  from: string
  hashes: Array<string>
  isCompleted: boolean
  receiverBalance: string
  receiverFirstName: string
  receiverLastName: string
  senderBalance: string
  senderFirstName: string
  senderLastName: string
  timestamp: string
  to: string
  tokenId: string
  tokenName: string
  type: string
  updatedAt: string
  value: string
}
