export interface MainFields {
  id: string;
  body: string;
  roomJID: string;
  date: Date;
  key: string;
  coinsInMessage: number;
  numberOfReplies: number;
}

export interface DataFields {
  isSystemMessage: boolean;
  photoURL: string;
  quickReplies: string[];
  roomJid: string;
  senderFirstName: string;
  senderLastName: string;
  senderJID: string;
  senderWalletAddress: string;
  tokenAmount: number;
  xmlns: string;
  isReply: boolean;
  isEdited: boolean;
}

export interface FileAttachmentParams {
  createdAt: Date;
  fileName: string;
  imageLocation: string;
  imagePreview: string;
  mimeType: string;
  originalName: string;
  size: number;
  duration: number;
  waveForm: string;
  attachmentId: string;
}

export interface NFTAttachmentParams {
  wrappable: boolean;
  nftId: string;
  nftActionType: string;
  contractAddress: string;
}

export interface MessageType extends MainFields, DataFields {}

export interface FileAttachment extends MainFields, FileAttachmentParams {}

export interface NFTAttachment extends MainFields, NFTAttachmentParams {}
