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

export interface IUser {
  id: string | null;
  name: string | null;
  avatar?: string | null;
}

export interface IMessage {
  id: string;
  user: IUser;
  date: Date | string;
  body: string;
  roomJID?: string;
  key?: string;
  coinsInMessage?: string;
  numberOfReplies?: number;
}

export interface IRoom {
  id: string;
  name: string;
  users: IUser[];
  messages: IMessage[];
}

export interface UserType extends IMessage {
  id: any;
  user: any;
  timestamp: any;
  text: any;
}
