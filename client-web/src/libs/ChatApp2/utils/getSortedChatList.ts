import { ModelChat } from "../models";
import getChatLastMessage from "./getChatLastMessage";

export default function getSortedChatList(chatList: Array<ModelChat>) {
    if (!Array.isArray(chatList)) {
        return []
    }

    return chatList.sort(compareChats)
}

function compareChats(a: ModelChat, b: ModelChat): number {
    const aLast = getChatLastMessage(a);
    const bLast = getChatLastMessage(b);

    if (aLast) {
        if (bLast) {
            return compare(aLast.created, bLast.created)
        }

        return -1
    }

    if (bLast) {
        return 1
    }

    return compare(aLast.created, bLast.created)
}

function compare(a: string, b: string) {
    if (a > b) {
        return -1
    }
    if (a < b) {
        return 1
    }
    return 0
}
