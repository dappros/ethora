import { ModelChatMessage } from "./models";
import { useChatStore } from "./store/useChatStore";
import getChat from "./utils/getChat";
import getMessage from "./utils/getMessage";
import { websocketConnect } from "./websocket";
const getState = useChatStore.getState
const log = console.log

export function actionBootstrap() {
}

export function actionConnect() {
    return websocketConnect()
}

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
}

export function actionMarkChatAsRead(chatId: string) {
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
