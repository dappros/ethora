import {getBalance} from "../api.js";

export const getBalanceHandler = (data) => {
    console.log('=> getBalanceHandler | Message received from ', data.userJID, data.message);
    getBalance().then(result => {
        console.log(result)
    })

}