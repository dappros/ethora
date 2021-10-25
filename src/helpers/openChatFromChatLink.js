/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import { underscoreManipulation } from "./underscoreLogic";
import {
    subscribeAndOpenChat,
    fetchRosterlist as fetchStanzaRosterList
} from "./xmppStanzaRequestMessages";
import {
    CONFERENCEDOMAIN,
    subscriptionsStanzaID
} from "../constants/xmppConstants";


export default openChatFromChatLink=(chatJID, walletAddress, setCurrentChatDetails, navigation)=>{
    const manipulatedWalletAddress = underscoreManipulation(walletAddress);

    subscribeAndOpenChat(manipulatedWalletAddress, `${chatJID}${CONFERENCEDOMAIN}`);
    setCurrentChatDetails(
        `${chatJID}${CONFERENCEDOMAIN}`,
        'Loading...',
        navigation,
        false
    );

    fetchStanzaRosterList(manipulatedWalletAddress, subscriptionsStanzaID);
}
