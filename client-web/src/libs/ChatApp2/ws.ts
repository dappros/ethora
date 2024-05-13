import { LikeWebSocket } from "./xmpp/LikeWebSocket";
import { useChatStore } from "./store/useChatStore";
import { parseJSON } from "./utils/parseJson";
import { ModelChatMessage } from "./models";
import getChat from "./utils/getChat";
import getMessage from "./utils/getMessage";
import { actionReceivedNewMessage } from "./actions";
const getState = useChatStore.getState
const log = console.log

const RECONNECT_TIMEOUT = 10 * 1000;

export let ws: LikeWebSocket | null = null;

let connecting: Promise<any> | null = null;

export function wsConnect() {
    if (connecting) {
        return connecting;
    }

    if (ws) {
        return Promise.resolve();
    }

    getState().doConnect()

    connecting = new Promise((resolve) => {
        resetWs()

        const state = getState()
        log('ws: connecting...')
        // TODO mv inline literal string
        ws = new LikeWebSocket('wss://dev.dxmpp.com:5443/ws', state.me.xmppUsername, state.me.xmppPassword)

        ws.onclose = () => {
            log('ws: connection was closed')

            connecting = null
            state.doDisconnected()
            resetWs()
            window.setTimeout(wsConnect, RECONNECT_TIMEOUT);
        }

        ws.onmessage = function(message) {
            log('ws: message', message)

            const data = parseJSON(message.data);
            if (!data) {
                return;
            }

            if (data.status === 'online' && connecting) {
                log('ws: connected')
                connecting = null;

                getState().doConnected()
                resolve('')
                return
            }

            processMessage(data)
        }
    })

    return connecting;
}

function resetWs() {
    if (ws) {
        delete ws.onmessage;
        delete ws.onclose;

        ws.close();
        ws = null;
    }
}

function processMessage(data: any) {
    switch (data.operation) {
        case 'chat_new_message': {
            handleChatNewMessage(data.message as ModelChatMessage)
        }
    }
}

function handleChatNewMessage(message: ModelChatMessage) {
    const state = getState()

    const chatId = message.from.chatId
    const chat = getChat(state.chatList, chatId)

    if (!chat) {
        // TODO
    }

    if (!getMessage(chat.messages, message.id)) {
        actionReceivedNewMessage(message)
    }
}
