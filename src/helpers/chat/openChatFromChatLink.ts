/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import {underscoreManipulation} from '../underscoreLogic';
import {
  subscribeToRoom,
  getUserRoomsStanza
} from '../../xmpp/stanzas';
import { ROUTES } from '../../constants/routes';
// import {
//   subscribeAndOpenChat,
//   fetchRosterlist as fetchStanzaRosterList,
//   getUserRooms,
// } from './xmppStanzaRequestMessages';
// import {
//   CONFERENCEDOMAIN,
//   subscriptionsStanzaID,
// } from '../constants/xmppConstants';

const openChatFromChatLink = (
  chatJID:string,
  walletAddress:string,
  navigation:any,
  xmpp:any
) => {
  const manipulatedWalletAddress = underscoreManipulation(walletAddress);

  subscribeToRoom(
    chatJID,
    manipulatedWalletAddress,
    xmpp
  )

  // fetchStanzaRosterList(manipulatedWalletAddress, subscriptionsStanzaID);
  getUserRoomsStanza(manipulatedWalletAddress,xmpp)

  navigation.navigate(ROUTES.CHAT, {chatJid: chatJID, chatName: "Loading..."});
};
export default openChatFromChatLink;
