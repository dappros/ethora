import { ModelChat, ModelChatMessage, ModelMeUser } from "./models";
import { useChatStore } from "./store/useChatStore";
import getChat from "./utils/getChat";
import getChatFirstMessage from "./utils/getChatFirstMessage";
import getMessage from "./utils/getMessage";
import { wsConnect } from "./ws";
import { chatList } from "./xmpp/xmppCombinedRequests/chatList";
import { getHistory } from "./xmpp/xmppRequests/getHistory";
import { sendTextMessage } from "./xmpp/xmppRequests/sendTextMessage";

const getState = useChatStore.getState
const log = console.log

export const MESSAGES_COUNT = 15
export const CHAT_ROOMS_PAGE_SIZE = 10;

export function bootstrapChatWithUser(user: ModelMeUser) {
    getState().doBootstraped(user)
    getState().doShow()
    actionConnect().then(() => {
        actionResync()
    })
}

export function actionConnect() {
    return wsConnect()
}

// only for widget type
export function actionShow() {
    const store = getState()

    if (!store.inited) {
        actionResync()
    }

    store.doShow()

    if (store.chatId) {
        actionMarkChatAsRead(store.chatId)
    }
}

export function actionResync() {
    console.log('actionResync')
    const store = getState()

    if (store.resyncing) {
        return store.resyncing
    }

    const promise = chatList()
        .then((chatList: Array<ModelChat>) => {
            store.doResynced(chatList)
            const newState = getState()
            if (chatList.length > 0) {
                actionOpenChat(newState.chatList[0].id)
            }
        })

    store.doResync(promise)
}

export function actionOpenChat(chatId: string) {
    const state = getState()

    const chat = getChat(state.chatList, chatId)

    if (!chat) {
        return
    }

    // TODO request to save timestamp
    
    // then
    state.doOpenChat(chat.id)

    if (!chat.hasLoaded) {
        return Promise.all([
            actionLoadMoreMessages(chatId),
            actionMarkChatAsRead(chatId)
        ]).then(() => chat)
    } else {
        return actionMarkChatAsRead(chatId)
    }
}

export function actionLoadMoreMessages(chatId: string) {
    console.log('actionLoadMoreMessages')
    const state = getState()

    const chat = getChat(state.chatList, chatId)

    if (chat.loading || chat.allLoaded) {
        return Promise.resolve()
    }

    state.doLoadMoreMessages(chatId)
    const firstMessage = getChatFirstMessage(chat)

    const firstMessageId = (firstMessage) ? firstMessage.id : null

    return getHistory(chatId, MESSAGES_COUNT, firstMessageId)
        .then((messages) => {
            state.doLoadedMoreMessages(chatId, messages)
        })
}

export function actionMarkChatAsRead(chatId: string, force = false) {
    const store = getState()

    if (!force) {
        const chat = getChat(store.chatList, chatId)

        if (!chat.hasUnread) {
            return Promise.resolve()
        }
    }

    actionChatMarkedAsRead(chatId)

    // TODO request to store chatRead timestamp
}

let queueMessageId = 0;

export function actionPostMessage(chatId: string, text: string) {
    const store = getState()

    const queueMessage: ModelChatMessage = {
        id: `queue-${ queueMessageId++ }`,
        text,
        from: {
            chatId: chatId,
            nickname: store.me.xmppUsername
        },
        created: Date.now().toString(),
        dataAttrs: {
            xmlns: '',
            senderJID: '',
            senderFirstName: store.me.firstName,
            senderLastName: store.me.lastName,
            senderWalletAddress: store.me.walletAddress,
            isSystemMessage: "false",
            tokenAmount: '',
            mucname: '',
            roomJid: '',
            isReply: "false",
            showInChannel: "true",
            push: "true",
        },
        isMe: true,
        status: 'queued'
    }

    return actionQueueMessage(queueMessage)
}

export function actionQueueMessage(queueMessage: ModelChatMessage) {
    getState().doQueueMessage(queueMessage)
    return actionPostMessageFromQueue(queueMessage.from.chatId)
}


export function actionPostMessageFromQueue(chatId: string) {
    console.log('actionPostMessageFromQueue')
    const state = getState()
    const chat = getChat(state.chatList, chatId)

    const queueMessage = chat.messages.find(item => item.status === 'queued')

    if (queueMessage) {
        return sendPostQueueMessage(queueMessage)
            .then((message: ModelChatMessage) => {
                state.doDequeueSuccessfulMessage(queueMessage, message)
            })
            .catch((e) => {
                console.log('catch ', e)
                state.doDequeueFailedMessage(queueMessage)

                return actionPostMessageFromQueue(chatId)
            })
    }

    function sendPostQueueMessage(queueMessage: ModelChatMessage) {
        return sendTextMessage(queueMessage)
    }
}

export function actionChatMarkedAsRead(chatId: string) {
    const state = getState()
    state.doChatMarkedAsRead(chatId)
}

export function actionReceivedNewMessage(message: ModelChatMessage) {
    const state = getState()

    state.doReceivedNewMessage(message)

    const chatId = message.from.chatId;
    const chat = getChat(state.chatList, chatId)

    if (!chat) {
        // TODO resync
        log('unknown chat in websocket message, resyncing...')
    }

    if (message.from.nickname === state.me.xmppUsername) {
        return
    }

    actionNotifyAboutNewMessage(chatId, message.id)
}

export function actionNotifyAboutNewMessage(chatId: string, messageId: string) {
    if ((typeof Notification === 'undefined') || (Notification as any).permission !== 'granted') {
        return
    }

    window.setTimeout(function () {
        const store = getState()

        const chat = getChat(store.chatList, chatId)
        if (chat) {
            return
        }

        if (chat.muted) {
            return
        }

        if (!chat.hasUnread) {
            return
        }

        const message = getMessage(chat.messages, messageId)
        if (!message) {
            return
        }

        // TODO
        const title = 'Title'
        const options = {
            // TODO getMessageText
            body: message.text,
            tag: `chat-new-mesage-${ message.id }`,
            // TODO getChatImage
            icon: chat.thumbnail
        }

        const notification = new Notification(title, options)

        notification.onclick = function() {
            window.focus();
            // TODO actionOpenChat
        };
    }, 100)
}

export function actionLoadMoreChatRooms() {
    const state = getState()

    if (state.loadingRooms) {
        return
    }

    state.doLoadMoreChatRooms()
}
