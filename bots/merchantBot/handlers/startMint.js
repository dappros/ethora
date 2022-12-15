import {sendMessage, userData, userSteps} from "../actions.js";
import messages from "../config/messages.js";
import {getMintItemData} from "../api.js";
import {requestError} from "./errors.js";
import {ethers} from "ethers";

export const startMint = (data) => {
    console.log('=> startMint | Message received from ', data.userJID, data.message);
    getMintItemData(data.receiverData.attrs.contractAddress).then(itemsData => {
        console.log('GET MINT ITEM DATA => ', itemsData)

        let buttons = [];
        for(let i = 0; i <= itemsData.maxSupplies.length && itemsData.maxSupplies[i]; i++){
            if(itemsData.maxSupplies[i] !== itemsData.minted[i]){

                let price = Number(itemsData.costs[i]) === 0 ? 'Free' : ethers.utils.formatEther(itemsData.costs[i])  + ' Coins';

                let buttonName = Number(itemsData.maxSupplies[i] - itemsData.minted[i]) + ' ' + itemsData.traits[0][i] + ' left out of ' + itemsData.maxSupplies[i] + ' total: ' + price;
                buttons.push({name: buttonName, value: buttonName, notDisplayedValue: i})
            }
        }

        // for (const message of messages.merchantBot.startMessages) {
        //     sendMessage(
        //         data,
        //         message,
        //         'message',
        //         false,
        //         0,
        //     );
        //     console.log(message)
        // }
        console.log('USER RECEIVER DATA => ', data.receiverData.attrs)
        userSteps('setStep', data.receiverData.attrs.senderJID, 2);
        userData('setData', data.userJID, itemsData, 'itemData');

        // sendMessage(
        //     data,
        //     messages.merchantBot.startMessages,
        //     'message',
        //     false,
        //     0,
        // );

        console.log(messages.merchantBot.chooseDetails)

        return sendMessage(
            data,
            messages.merchantBot.startMessages+'\n\nNow, the Collection is called '+itemsData.tokenName+' and these are the details:',
            'message',
            false,
            0,
            buttons
        );

    }).catch(error => {
        requestError(data, "getMintItemData", error);
        console.log('getMintItemData ERROR ', error)
    })
}