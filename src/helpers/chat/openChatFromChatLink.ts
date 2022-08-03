/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import {underscoreManipulation} from '../underscoreLogic';
import {subscribeToRoom, getUserRoomsStanza} from '../../xmpp/stanzas';
import {ROUTES} from '../../constants/routes';

const openChatFromChatLink = (
  chatJID: string,
  walletAddress: string,
  navigation: any,
  xmpp: any,
) => {
  const manipulatedWalletAddress = underscoreManipulation(walletAddress);

  subscribeToRoom(chatJID, manipulatedWalletAddress, xmpp);

  // fetchStanzaRosterList(manipulatedWalletAddress, subscriptionsStanzaID);
  getUserRoomsStanza(manipulatedWalletAddress, xmpp);

  navigation.navigate(ROUTES.CHAT, {chatJid: chatJID});
};
export default openChatFromChatLink;
