/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

interface Reply {
  title: string;
  value: string;
}
interface createMessageObjectProps {
  imageLocationPreview?: any;
  imageLocation?: any;
  _id: string;
  text?: string;
  createdAt: string | number | Date;
  system: boolean;
  tokenAmount?: string | number;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  image?: string;
  realImageURL?: string;
  localURL?: string;
  isStoredFile?: boolean;
  mimetype?: string;
  duration?: string;
  size?: string;
  waveForm?: string;
  roomJid: string;
  receiverMessageId: string;
  quickReplies: string;
  attachmentId?: string;
  wrappable: boolean;
  nftId?: string;
  nftActionType?: string;
  contractAddress?: string;
  fileName?: string;
  originalName?: string;
  isReply?: boolean;
  mainMessageText?: string;
  mainMessageId?: string;
  mainMessageUserName?: string;
  preview?: string;

}

export const createMessageObject = (
  messageDetails: createMessageObjectProps,
) => {
  const message: createMessageObjectProps = {
    _id: '',
    text: '',
    createdAt: '',
    system: false,
    tokenAmount: '',
    user: {
      _id: '',
      name: '',
      avatar: '',
    },
    image: '',
    realImageURL: '',
    localURL: '',
    isStoredFile: false,
    mimetype: '',
    duration: '',
    size: '',
    waveForm: '',
    roomJid: '',
    receiverMessageId: '',
    imageLocationPreview: undefined,
    imageLocation: undefined,
    quickReplies: '',
    wrappable: true,
    nftId: '',
    nftActionType: '',
    contractAddress: '',
    fileName: '',
    originalName: '',
    isReply: false,
    mainMessageText: '',
    mainMessageId: '',
    mainMessageUserName: '',
    preview: ''
  };
  messageDetails.forEach((item: any) => {
    if (item.name === 'body') {
      message.text = item.children[0];
    }
    if (item.name === 'archived') {
      message._id = item.attrs.id;
      message.roomJid = item.attrs.by;
      message.createdAt = new Date(parseInt(item.attrs.id.substring(0, 13)));
    }
    if (item.name === 'data') {
      message.user.name =
        item.attrs.senderFirstName + ' ' + item.attrs.senderLastName;
      message.user._id = item.attrs.senderJID;
      const isSystem = item.attrs.isSystemMessage === 'true';
      message.system = isSystem;
      message.tokenAmount = +item.attrs?.tokenAmount || 0;
      message.user.avatar = item.attrs.photoURL || null;
      message.imageLocation = item.attrs.location;
      message.imageLocationPreview =
        item.attrs.locationPreview || item.attrs.location;
      message.waveForm = item.attrs.waveForm;
      message.mimetype = item.attrs.mimetype;
      message.duration = item.attrs.duration;
      message.size = item.attrs.size;
      message.image = item.attrs.location;
      message.receiverMessageId = item.attrs.receiverMessageId.toString();
      message.quickReplies = item.attrs.quickReplies || '';
      message.attachmentId = item.attrs.attachmentId || '';
      message.wrappable = true;
      message.nftId = item.attrs.nftId || '';
      message.nftActionType = item.attrs?.nftActionType;
      message.contractAddress = item.attrs?.contractAddress;
      message.fileName = item.attrs.fileName || '';
      message.originalName = item.attrs.originalName || '';
      message.mainMessageId = item.attrs.mainMessageId || '';
      message.mainMessageText = item.attrs.mainMessageText || '';
      message.isReply = item.attrs.isReply === 'true' || false;
      message.mainMessageUserName = item.attrs.mainMessageUserName || '';
      message.preview = item.attrs.locationPreview;
      // message.roomJid = item.attrs.roomJid;
    }
  });
  return message;
};
