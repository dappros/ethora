import {sendMessage, userData, userSteps} from "../actions.js";
import messages from "../config/messages.js";
import {mintNft} from "../api.js";
import {requestError} from "./errors.js";

export const mintItem = (data) => {
    console.log('=> mintItem | Message received from ', data.userJID, data.message);
    let itemData = userData('getData', data.userJID, null, 'itemData');
    let itemDataIndex = userData('getData', data.userJID, null, 'itemDataIndex');

    console.log('CONTRACT DATA SLDKFJLKSDFJLKSDJF LKJDSKFL SDJKL SDLFKJDLSK LSKDJF LKDJS LKSDF JLKSLSKD JFL', itemData.contractAddress)

    mintNft(itemData.contractAddress, itemDataIndex, 1, data.receiverData.attrs.senderWalletAddress).then(() => {
        userSteps('setStep', data.receiverData.attrs.senderJID, 1);
        userData('setData', data.userJID, [], 'itemData');
        userData('setData', data.userJID, 0, 'sendCoins');
        userData('setData', data.userJID, 0, 'itemDataIndex');

        sendMessage(
            data,
            'Know that you have made an excellent choice. Enjoy!',
            'message',
            false,
            0,
        );

    }).catch(error => {
        requestError(data, "mintNft", error);
        // console.log('mintNft ERROR ', error)
    })


}