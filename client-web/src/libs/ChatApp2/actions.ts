import { ModelChatMessage } from "./models";
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
    const state = getState()
    state.doChatMarkedAsRead(chatId)
}

export function actionReceivedNewMessage(message: ModelChatMessage) {
    const state = getState()

    state.doActionReceivedNewMessage()
}
