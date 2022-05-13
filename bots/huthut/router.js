import {connectRoom, messageCheck, sendMessage} from "./actions.js";
import messages from "./config/messages.js";

const router = (xmpp, message, sender, receiver, requestType) => {
    if (requestType === 'x' && message.match(/\binvite\S*\b/g)) {
        console.log('=> The bot was invited to the chat room ', receiver);
        connectRoom(xmpp, sender, receiver);
    }

    if (requestType === 'body') {
        console.log('=> Message received from ', receiver, message)
        if (messageCheck(message, 'hut test')) {
            sendMessage(xmpp, receiver, 'message', messages.testMessage)
        }

        if (messageCheck(message, 'hut back turn forest')) {
            sendMessage(xmpp, receiver, 'message', messages.visiteingHut.firstGreeting)
        }

        if (messageCheck(message, 'hut front turn me')) {
            sendMessage(xmpp, receiver, 'message', messages.visiteingHut.openingHut)
        }

    }
}
export {router};