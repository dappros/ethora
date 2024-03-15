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
  photoURL: string; // sender's photo
  roomJid: string; // room JID (which room message belongs to) TO DO: remove this from Data - looks like a duplicate ?
  senderFirstName: string; // TO DO: review - may replace with vCard / users store
  senderLastName: string; // TO DO: review - may replace with vCard / users store
  senderJID: string; 
  senderWalletAddress: string; // TO DO: review - may be deprecated, we can derive this from 'from' user's JID
  xmlns: string;  // probably system - websockets endpoint? not sure if used
  isEdited: boolean; // if message was edited (to display 'edited' in UI)

  // replies and threads
  quickReplies: string[]; // number of responses in the thread ? TO DO: review, may be deprecated due to threads feature
  isReply: boolean; // if this is a response to another message (replies/threads)
  showInChannel: boolean; // for thread responses, whether user ticked 'copy to room', if not this will only be shown in the thread
  
  // system messages
  isSystemMessage: boolean; // if this flag is set, App UI will not process this as a standard text message, and will instead process this as a system message. For example, this could be a system message informing others about a Coin transfer from one User to another. Such message will be displayed in a different, more subtle way, in order to not clutter the Room
  tokenAmount: number; // (system message) for coin transfers - the number of tokens being sent - used in system type transfer messages. Typically this is used for “tipping” or social ranking mechanism. Users can tap on Messages of other users and tip them with Coins. Message will display a counter of Coins received, similarly to ‘likes’ in social networks
  receiverMessageId: boolean; // (system message) for coin transfers - the ID of the message that receives the transfer
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
