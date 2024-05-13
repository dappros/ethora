import { ModelChat } from "../models";
import getSortedChatList from "./getSortedChatList";

export function setChat(chatList: Array<ModelChat>, chat: ModelChat) {
    const chatId = chat.id

    const newChatList: Array<ModelChat> = ([] as Array<ModelChat>).concat(chatList);

    const index = chatList.findIndex(chat => chat.id === chatId)

    if (index !== -1) {
        newChatList[index] = chat
    } else {
        newChatList.push(chat)
    }

    return newChatList

    // return getSortedChatList(newChatList)
}