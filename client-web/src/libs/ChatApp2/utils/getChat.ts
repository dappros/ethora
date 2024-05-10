import { ModelChat } from '../models';

export default function getChat(chatList: Array<ModelChat>, chatId: string): ModelChat | undefined {
    return chatList.find(chat => chat.id === chatId);
}