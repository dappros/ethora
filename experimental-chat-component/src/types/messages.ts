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
  senderWalletAddress: string; // TO DO: review - may be deprecated, we can derive this from 'from' user's JID
  senderJID?: string; 
  xmlns?: string;  // probably system - websockets endpoint? not sure if used
  isEdited?: boolean; // if message was edited (to display 'edited' in UI)

  // push notifications
  mucName?: string; // chat Room name to display in Push Notifications
  push?: boolean; // specifies whether this message should be included in push notifications. Offline users subscribed to the Room will receive push alerts to their devices for those messages that have this parameter enabled. Should be enabled for all standard messages. E.g. don't specify this for system messages.

  // replies and threads
  quickReplies?: string[]; // number of responses in the thread ? TO DO: review, may be deprecated due to threads feature
  isReply?: boolean; // if this is a response to another message (replies/threads)
  showInChannel?: boolean; // for thread responses, whether user ticked 'copy to room', if not this will only be shown in the thread
  mainMessage?: string; // for thread responses, the ID of the main message (or text quote?)
  
  // system messages
  isSystemMessage?: boolean; // if this flag is set, App UI will not process this as a standard text message, and will instead process this as a system message. For example, this could be a system message informing others about a Coin transfer from one User to another. Such message will be displayed in a different, more subtle way, in order to not clutter the Room
  tokenAmount?: number; // (system message) for coin transfers - the number of tokens being sent - used in system type transfer messages. Typically this is used for “tipping” or social ranking mechanism. Users can tap on Messages of other users and tip them with Coins. Message will display a counter of Coins received, similarly to ‘likes’ in social networks
  receiverMessageId?: boolean; // (system message) for coin transfers - the ID of the message that receives the transfer
}

export interface FileAttachmentParams {
  createdAt: Date; // when file was created (from our API - mongodb) 
  fileName: string; // for file attachments this is used to display the file name
  imageLocation: string; // for file attachments this is URL of the file itself, typically from our IPFS or Minio buckets based files service
  imagePreview: string; // for file attachments that are pictures and some other supported file types (PDF etc) this will be a path to the preview / thumbnail version of the attachment
  mimeType: string; // for file attachments this is the mimeType of the file, so that App interface can display the correct UI and/or icon (e.g. PDF, DOC) for this type of file
  originalName: string; // similar to fileName, but uses full system name of the file attachments including extension etc. TF: either this or fileName may be deprecated
  size: number; // for file attachments this will be used to display the file size so that users can estimate the impact of opening or downloading it
  duration: number; // for attachments that are audio or video, this is their duration in seconds to inform the users how long it would take to to play it
  waveForm: string; // for attachments that are audio, this will display the waveForm so that users can visually estimate the contents of the record
  attachmentId: string; // this refers to the file object ID as per /files/ API. This is used to enable actions over the files in certain use cases
}

export interface NFTAttachmentParams {
  wrappable: boolean; // this is used for the purposes of digital art and NFT. If enabled, this means users can wrap this content into NFT
  nftId: string; // this is used for the purposes of digital art and NFT. This is used to link content with an NFT collection
  nftActionType: string; //  this is used for the purposes of digital art and NFT. This is to inform App interface of what type of actions are available
  contractAddress: string; // this is used when messages are linked to smart contracts
}

export interface MessageType extends MainFields, DataFields {}

export interface FileAttachment extends MainFields, FileAttachmentParams {}

export interface NFTAttachment extends MainFields, NFTAttachmentParams {}
