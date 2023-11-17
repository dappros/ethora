import { defaultChats } from "../../../docs/config"

export const checkIsDefaultChat = (jid: string) => {
  let pureJid = ""
  if (jid.includes("@")) pureJid = jid.split("@")[0]
  else pureJid = jid

  if (defaultChats.find((item) => item.jid === pureJid)) return true
  else return false
}
