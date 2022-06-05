import { getUserRoomsStanza, roomConfigurationForm } from "../../xmpp/stanzas";

export const renameTheRoom = (manipulatedWalletAddress:string, chatJid:string, roomConfig:any, xmpp:any) => {
    roomConfigurationForm(
        manipulatedWalletAddress,
        chatJid,
        roomConfig,
        xmpp
    )
    getUserRoomsStanza(manipulatedWalletAddress,xmpp);
  };