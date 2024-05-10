export interface ModelThreadLinkMessage {
    text: string,
    id: number,
    userName: string,
    createdAt: string,
    size: string,
    duration: string,
    waveForm: string,
    attachmentId: string,
    wrappable: string,
    nftActionType: string,
    contractAddress: string,
    roomJid: string,
    nftId: string
}

export interface ModelChatMessage {
    text: string;
    from: string;
    id: string;
    created: string;
    isMe: boolean;
    xmlns: string;
    senderJID: string;
    senderFirstName: string;
    senderLastName: string;
    senderWalletAddress: string;
    isSystemMessage: "true" | "false";
    tokenAmount: string;
    mucname: string;
    roomJid: string;
    isReply: "true" | "false";
    showInChannel: "true" | "false";
    push: "true" | "false";
    mainMessage?: ModelThreadLinkMessage
    isMediafile?: "true" | "false";
    locationPreview?: string;
}

export interface ModelChat {
    id: string;
    title: string;
    usersCnt: string;
    background: string;
    thumbnail: string;
    lastOpened: number;
    messages: Array<ModelChatMessage>;
    threadsMessages: Record<string, ModelChatMessage[]>;
    editMessage: ModelChatMessage | null;
    hasUnread: boolean;
    muted: boolean;
    loading: boolean;
    sending: boolean;
    allLoaded: boolean;
    hasLoaded: boolean;
}