export const splitChatJid = (chatJid:string) => {
    return chatJid.split('@')[0];
}