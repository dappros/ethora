import { useChatStore } from "./store/useChatStore";
import { websocketConnect } from "./websocket";
const getState = useChatStore.getState

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
    const store = getState()
    store.doChatMarkedAsRead(chatId)
}
