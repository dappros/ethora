/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { IMessage } from "../../stores/chatStore"

export interface IMessageToSend {
  senderFirstName: string
  imageLocationPreview?: any
  senderLastName: string
  senderWalletAddress: string
  isSystemMessage?: boolean
  mucname: string
  photoURL: string
  push: boolean
  imageLocation?: any
  text?: string
  tokenAmount?: number
  location?: string
  locationPreview?: string
  image?: string
  realImageURL?: string
  mimetype?: string
  duration?: string
  size?: string
  waveForm?: string
  roomJid: string
  receiverMessageId: string
  quickReplies?: string
  attachmentId?: string
  wrappable?: boolean
  nftId?: string
  nftName?: string
  nftActionType?: string
  contractAddress?: string
  fileName?: string
  originalName?: string
  isReply?: boolean
  mainMessage?: string
  numberOfReplies?: number
  showInChannel?: boolean
  preview?: string
  isReplace?: boolean
  replaceMessageId?: string
  isVisible?: boolean
  isEdited?: boolean
}
export const createMainMessageForThread = (message: IMessage): string => {
  const data = {
    text: message.text,
    id: message._id,
    userName: message.user?.name,
    createdAt: message.createdAt,
    fileName: message.fileName,
    imageLocation: message.image,
    imagePreview: message.preview,
    mimeType: message.mimetype,
    originalName: message.originalName,
    size: message.size,
    duration: message?.duration,
    waveForm: message.waveForm,
    attachmentId: message.attachmentId,
    wrappable: message.wrappable,
    nftActionType: message.nftActionType,
    contractAddress: message.contractAddress,
    roomJid: message.roomJid,
    nftId: message.nftId,
  }
  return JSON.stringify(data)
}

export interface IMainMessage {
  text?: string
  id: string
  userName: string
  createdAt?: string | number | Date
  fileName?: string
  imageLocation?: string
  imagePreview?: string
  mimeType?: string
  originalName?: string
  size?: string
  duration?: string
  waveForm?: string
  attachmentId?: string
  wrappable?: string | boolean
  nftId?: string
  nftActionType?: string
  contractAddress?: string
  roomJid?: string
}

export const createMessageObject = (messageDetails = []) => {
  const message: IMessage = {
    _id: "",
    text: "",
    createdAt: "",
    system: false,
    tokenAmount: 0,
    user: {
      _id: "",
      name: "",
      avatar: "",
    },
    image: "",
    realImageURL: "",
    localURL: "",
    isStoredFile: false,
    mimetype: undefined,
    duration: "",
    size: "",
    waveForm: "",
    roomJid: "",
    receiverMessageId: "",
    imageLocationPreview: undefined,
    imageLocation: undefined,
    quickReplies: "",
    wrappable: true,
    nftId: "",
    nftName: "",
    nftActionType: "",
    contractAddress: "",
    fileName: "",
    originalName: "",
    isReply: false,
    mainMessage: undefined,
    numberOfReplies: 0,
    showInChannel: false,
    preview: "",
    isReplace: false,
    replaceMessageId: "",
    isEdited: false,
  }
  messageDetails.forEach((item: any) => {
    if (item.name === "body") {
      message.text = item.children[0]
    }
    if (item.name === "archived") {
      message._id = item.attrs.id
      message.roomJid = item.attrs.by
      message.createdAt = new Date(parseInt(item.attrs.id.substring(0, 13)))
    }
    if (item.name === "data") {
      message.user.name =
        item.attrs.senderFirstName + " " + item.attrs.senderLastName
      message.user._id = item.attrs.senderJID
      const isSystem = item.attrs.isSystemMessage === "true"
      message.system = isSystem
      message.tokenAmount = +item.attrs?.tokenAmount || 0
      message.user.avatar = item.attrs.photoURL || null
      message.imageLocation = item.attrs.location
      message.imageLocationPreview =
        item.attrs.locationPreview || item.attrs.location
      message.waveForm = item.attrs.waveForm
      message.mimetype = item.attrs.mimetype
      message.duration = item.attrs.duration
      message.size = item.attrs.size
      message.image = item.attrs.location
      message.receiverMessageId = item.attrs.receiverMessageId || ""
      message.quickReplies = item.attrs.quickReplies || ""
      message.attachmentId = item.attrs.attachmentId || ""
      message.wrappable = true
      message.nftId = item.attrs.nftId || ""
      message.nftName = item.attrs.nftName || ""
      message.nftActionType = item.attrs?.nftActionType
      message.contractAddress = item.attrs?.contractAddress
      message.fileName = item.attrs.fileName || ""
      message.originalName = item.attrs.originalName || ""
      message.isReply = item.attrs.isReply === "true" || false
      if (item.attrs.mainMessage) {
        try {
          const parsedMessage = JSON.parse(item.attrs.mainMessage)
          const mainMessage: IMainMessage = {
            text: parsedMessage.text || "",
            id: parsedMessage?.id && parsedMessage.id.toString(),
            userName: parsedMessage.userName || "",
            createdAt: parsedMessage.createdAt,
            fileName: parsedMessage.fileName,
            imageLocation: parsedMessage.imageLocation,
            imagePreview: parsedMessage.imagePreview,
            mimeType: parsedMessage.mimeType,
            originalName: parsedMessage.originalName,
            size: parsedMessage.size,
            duration: parsedMessage.duration,
            waveForm: parsedMessage.waveForm,
            attachmentId: parsedMessage.attachmentId,
            wrappable: parsedMessage.wrappable === "true" || false,
            nftId: parsedMessage.mainMessageNftId,
            nftActionType: parsedMessage.nftActionType,
            contractAddress: parsedMessage.contractAddress,
            roomJid: parsedMessage.roomJid,
          }
          message.mainMessage = mainMessage
        } catch (error) {
          console.log(error, item.attrs.mainMessage)
        }
      }

      message.numberOfReplies = 0
      message.showInChannel = item.attrs.showInChannel === "true" || false
      message.preview = item.attrs.locationPreview
      // message.roomJid = item.attrs.roomJid;
    }
    if (item.name === "replace") {
      message.isReplace = true
      message.replaceMessageId = item.attrs.id
    }
  })
  return message
}
