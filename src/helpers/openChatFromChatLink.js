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