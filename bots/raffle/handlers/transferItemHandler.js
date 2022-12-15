import {logCurrentHandler, sendMessage} from "../actions.js";
import {getBalance, transferItem} from "../api.js";
import botOptions from "../config/config.js";
import {getRandomNFT} from "./helpers/getRandomNFT.js";
import {requestError} from "./errors.js";

export const transferItemHandler = (data) => {
    logCurrentHandler('transferItemHandler', data.userJID, data.message);
    getBalance().then(result => {
        const randomItem = getRandomNFT(result)[0];
        if (randomItem) {
            transferItem(randomItem.nftId, data.receiverData.senderWalletAddress, 1).then(() => {
                sendMessage(
                    data,
                    generateSystemMessage(botOptions, data, randomItem.tokenName, 1),
                    'message',
                    true,
                    0,
                );
            }).catch(error => {
                requestError(data, 'getBalance', error)
            })
        } else {
            sendMessage(
                data,
                "Warning: Items not found",
                'message',
                false,
                0,
            );
        }
    }).catch(error => {
        requestError(data, 'getBalance', error)
    })
}

const generateSystemMessage = (botOptions, data, itemName, amount) => {
    if (botOptions && data) {
        return botOptions.botData.firstName + ' ' + botOptions.botData.lastName + ' -> ' + amount + ' ' + itemName + ' -> ' + data.receiverData.senderFirstName + " " + data.receiverData.senderLastName;
    }
}