import {
    Avatar,
    Message,
} from '@chatscope/chat-ui-kit-react';
import {TMessageHistory} from "../../../store";
import React from "react";
import xmpp from "../../../xmpp";
import {differenceInHours, format, formatDistance, subDays} from "date-fns";

interface IMessagesProps {
    message: TMessageHistory;
}

const MessageDefault: React.FC<IMessagesProps> = ({message}) => {
    return (
        <Message
            model={{
                sender: message.data.senderFirstName + ' ' + message.data.senderLastName,
                direction: xmpp.client.jid?.toString().split("/")[0] === message.data.senderJID.split("/")[0] ? "outgoing" : "incoming",
                position: 0,
            }}
        >
            <Avatar
                src={message.data.photoURL ? message.data.photoURL : "https://icotar.com/initials/" + message.data.senderFirstName + "%20" + message.data.senderLastName}
                name={message.data.senderFirstName}/>

            <Message.CustomContent>
                <strong>{message.data.senderFirstName} {message.data.senderLastName}</strong><br/>
                {message.body}
            </Message.CustomContent>

            <Message.Footer sentTime={differenceInHours(new Date(), new Date(message.date)) > 5 ?
                format(new Date(message.date), 'h:mm:ss a') :
                formatDistance(subDays(new Date(message.date), 0), new Date(), {addSuffix: true})}/>
        </Message>
    );
}
export default MessageDefault;