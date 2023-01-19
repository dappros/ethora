import xmpp from "../../xmpp";
import {useStoreState} from "../../store";
import { CONFERENCEDOMAIN } from "../../constants";

export const underscoreManipulation = (str:string) => {
    if(str){
        return str.replace(/([A-Z])/g, '_$1').toLowerCase()
    }else{
        return 'invalid string passed'
    }
};

export const createPrivateChat = async (
    myWalletAddress: string,
    otherUserWalletAddress: string,
    myFirstName: string,
    otherFirstName: string,
    userJID?: string
) => {
    const combinedWalletAddress = [myWalletAddress, otherUserWalletAddress]
        .sort()
        .join('.');

    const roomJid = combinedWalletAddress.toLowerCase() + CONFERENCEDOMAIN;
    const combinedUsersName = [myFirstName, otherFirstName].sort().join(' and ');

    const currentChatRooms = useStoreState.getState().userChatRooms;

    let isNewRoom = false;
    if(currentChatRooms.filter((el) => el.jid === roomJid).length === 0){
        isNewRoom = true;
        xmpp.createNewRoom(combinedWalletAddress.toLowerCase());
        xmpp.setOwner(combinedWalletAddress.toLowerCase());
        xmpp.roomConfig(
            combinedWalletAddress.toLowerCase(),
            {roomName: combinedUsersName},
        );
        xmpp.subsribe(roomJid);
        xmpp.presenceInRoom(roomJid);

        setTimeout(() => {
            xmpp.sendInvite(
                underscoreManipulation(myWalletAddress),
                roomJid.toLowerCase(),
                underscoreManipulation(otherUserWalletAddress),
            );
        }, 1000);
    }

    return {roomJid, roomName: combinedUsersName, isNewRoom};
};
