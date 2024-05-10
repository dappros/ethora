import { ModelChatMessage } from "../models";

export default function getMessage(messages: Array<ModelChatMessage>, messageId: string): ModelChatMessage | undefined {
    return messages.find(message => message.id === messageId);
}
