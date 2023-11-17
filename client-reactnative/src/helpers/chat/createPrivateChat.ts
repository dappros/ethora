import {
  createNewRoom,
  roomConfig,
  sendInvite,
  setOwner,
  subscribeToRoom,
} from "../../xmpp/stanzas"
import { underscoreManipulation } from "../underscoreLogic"

export const createPrivateChat = async (
  myWalletAddress: string,
  otherUserWalletAddress: string,
  myFirstName: string,
  otherFirstName: string,
  CONFERENCEDOMAIN: string,
  xmpp: any
) => {
  const combinedWalletAddress = [myWalletAddress, otherUserWalletAddress]
    .sort()
    .join("_")

  const roomJid = combinedWalletAddress.toLowerCase() + CONFERENCEDOMAIN
  const combinedUsersName = [myFirstName, otherFirstName].sort().join(" and ")

  const myXmppUserName = underscoreManipulation(myWalletAddress)
  createNewRoom(myXmppUserName, combinedWalletAddress.toLowerCase(), xmpp)
  setOwner(myXmppUserName, combinedWalletAddress.toLowerCase(), xmpp)
  roomConfig(
    myXmppUserName,
    combinedWalletAddress.toLowerCase(),
    { roomName: combinedUsersName, roomDescription: "" },
    xmpp
  )
  subscribeToRoom(roomJid, myXmppUserName, xmpp)

  setTimeout(() => {
    sendInvite(
      underscoreManipulation(myWalletAddress),
      roomJid.toLowerCase(),
      underscoreManipulation(otherUserWalletAddress),
      xmpp
    )
  }, 1000)
  return { roomJid, roomName: combinedUsersName }
}
