import { LikeWebSocket } from "./libs/LikeWebSocket";
import { useChatStore } from "./store/useChatStore";
import { parseJSON } from "./utils/parseJson";
import { ModelChatMessage } from "./models";
import getChat from "./utils/getChat";
import getMessage from "./utils/getMessage";
import { actionReceivedNewMessage } from "./actions";
const getState = useChatStore.getState
const log = console.log

const RECONNECT_TIMEOUT = 10 * 1000;

let websocket: LikeWebSocket | null = null;

let connecting: Promise<any> | null = null;

export function websocketConnect() {
    if (connecting) {
        return connecting;
    }

    if (websocket) {
        return Promise.resolve();
    }

    getState().doConnect()

    connecting = new Promise((resolve) => {
        resetWebsocket()

        const state = getState()
        log('websocket: connecting...')
        // TODO mv inline literal string
        websocket = new LikeWebSocket('wss://dev.dxmpp.com:5443/ws', state.me.xmppUsername, state.me.xmppPassword)

        websocket.onclose = () => {
            log('websocket: connection was closed')

            connecting = null
            state.doDisconnected()
            resetWebsocket()
            window.setTimeout(websocketConnect, RECONNECT_TIMEOUT);
        }

        websocket.onmessage = function(message) {
            log('websocket: message', message)

            const data = parseJSON(message.data);
            if (!data) {
                return;
            }

            if (data.status === 'online' && connecting) {
                log('websocket: connected')
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

function resetWebsocket() {
    if (websocket) {
        delete websocket.onmessage;
        delete websocket.onclose;

        websocket.close();
        websocket = null;
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
