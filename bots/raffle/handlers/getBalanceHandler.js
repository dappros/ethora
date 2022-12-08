import {getBalance} from "../api.js";
import {getRandomNFT} from "./helpers/getRandomNFT.js";

export const getBalanceHandler = (data) => {
    console.log('=> getBalanceHandler | Message received from ', data.userJID, data.message);
    getBalance().then(result => {
        const randomItem = getRandomNFT(result);
        console.log(randomItem)
    })

}