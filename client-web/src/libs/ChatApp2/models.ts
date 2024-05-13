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
    id: string;
    text: string;
    from: {
        chatId: string;
        nickname: string;
    },
    created: string;
    dataAttrs: {
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
    },
    status?: 'queued' | 'failed'
    isMe?: boolean;
}

export interface ModelChat {
    id: string;
    title: string;
    usersCnt: string;
    background: string;
    thumbnail: string;
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

export interface ModelMeUser {
    firstName: string;
    lastName: string;
    profileImage?: string;
    walletAddress?: string;
    xmppPassword: string;
    xmppUsername: string;
}

export interface ModelState {
    inited: boolean;
    connection: 'connecting' | 'connected' | 'disconnected';
    resyncing: Promise<void> | null;
    chatId: string | null;
    chatList: Array<ModelChat> | null;
    me: ModelMeUser | null;
    // only for widget
    visible: boolean;
    focused: boolean;
}