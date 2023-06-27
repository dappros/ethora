import { IMainMessage, TMessageHistory } from "../store";

export const createMessage = (
  data: any,
  body: any,
  id: string,
  from: string
) => {
  let msg = {
    id: Number(id),
    body: body.getText(),
    data: {
      isSystemMessage: data.attrs.isSystemMessage,
      photoURL: data.attrs.photoURL,
      quickReplies: data.attrs.quickReplies,
      roomJid: data.attrs.roomJid,
      receiverMessageId: data.attrs?.receiverMessageId,
      senderFirstName: data.attrs.senderFirstName,
      senderJID: data.attrs.senderJID,
      senderLastName: data.attrs.senderLastName,
      senderWalletAddress: data.attrs.senderWalletAddress,
      tokenAmount: Number(data.attrs.tokenAmount),
      isMediafile: data.attrs?.isMediafile,
      originalName: data.attrs?.originalName,
      location: data.attrs?.location,
      locationPreview: data.attrs?.locationPreview,
      mimetype: data.attrs?.mimetype,
      xmlns: data.attrs.xmlns,
      isReply: data.attrs.isReply === "true" || false,
      showInChannel: data.attrs.showInChannel === "true" || false,
      isEdited: false,
      mainMessage: undefined,
    },
    roomJID: from,
    date: new Date(+id.substring(0,13)).toISOString(),
    key: Date.now() + Number(id),
    coinsInMessage: 0,
    numberOfReplies: 0,
  };
  if (data.attrs.mainMessage) {
    try {
      const parsedMessage = JSON.parse(data.attrs.mainMessage);
      const mainMessage: IMainMessage = {
        text: parsedMessage.text || "",
        id: parsedMessage?.id,
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
      };
      msg.data.mainMessage = mainMessage;
    } catch (error) {
      console.log(error, data.attrs.mainMessage);
    }
  }
  return msg;
};

export const createMainMessageForThread = (
  message: TMessageHistory
): string => {
  const data = {
    text: message.body,
    id: message.id,
    userName: message.data.senderFirstName + " " + message.data.senderLastName,
    createdAt: message.date,
    fileName: message.data.originalName,
    imageLocation: message.data?.location,
    imagePreview: message.data?.locationPreview,
    mimeType: message.data?.mimetype,
    originalName: message.data?.originalName,
    size: "",
    duration: "",
    waveForm: "",
    attachmentId: "",
    wrappable: "",
    nftActionType: "",
    contractAddress: "",
    roomJid: message.data.roomJid,
    nftId: "",
  };
  return JSON.stringify(data);
};
