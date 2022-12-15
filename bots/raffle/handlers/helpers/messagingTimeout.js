import {sendMessage, userSteps} from "../../actions.js";
import {currentItem, participants} from "../../router.js";
import {transferItem} from "../../api.js";
import botOptions from "../../config/config.js";
import {requestError} from "../errors.js";

export const messagingTimeout = (data, timeToAdd) => {
    console.log("START TIMEOUT ", timeToAdd)
    const timeData = timeToAdd.split(":");
    const addedTime = addingTime(data, timeData);

    const oneTh = Number(timeData[0]) / 3 * 1;
    const twoTh = Number(timeData[0]) / 3 * 2;

    let senderCounter = 0;

    let timerId = setInterval(() => {
        const currentTime = new Date();

        let timeDifference = Math.abs(addedTime.getTime() - currentTime.getTime());
        let differenceUnMinutes = (timeDifference / 1000) / 60;

        if (differenceUnMinutes > oneTh && differenceUnMinutes < twoTh && senderCounter === 0) {
            sendMessage(
                data,
                "To remind everyone, the raffle is on the and the prize is "+currentItem.nftName+" \nThe raffle will end in "+differenceUnMinutes.toFixed()+" minutes.\nJust write a message to be counted in!",
                'message',
                false,
                0,
                [],
                true
            );
            senderCounter += 1;
        }

        if (differenceUnMinutes < oneTh && differenceUnMinutes < twoTh && senderCounter === 1) {
            sendMessage(
                data,
                "To remind everyone, the raffle is on the and the prize is "+currentItem.nftName+" \nThe raffle will end in "+differenceUnMinutes.toFixed()+" minutes.\nJust write a message to be counted in!",
                'message',
                false,
                0,
                [],
                true
            );
            senderCounter += 1;
        }
    }, 2000);

    setTimeout(() => {
        clearInterval(timerId);

        let victoryUserWallet = currentItem.ownerWallet;
        let victoryUserName = currentItem.ownerName
        if(participants.length > 0){
            const randomIndex = Math.floor(Math.random() * participants.length);
            victoryUserWallet = participants[randomIndex].wallet;
            victoryUserName =  participants[randomIndex].name
        }else{
            console.log("NO USERS IN RAFFLE == ")
        }

        transferItem(currentItem.nftId, victoryUserWallet, 1).then(() => {
            currentItem.status = "stop";
            userSteps('setStep', data.userJID, 1);
            sendMessage(
                data,
                "TA-DA!!! The raffle is now officially complete!",
                'message',
                false,
                0,
                [],
                true
            );

            setTimeout(() => {
                sendMessage(
                    data,
                    "Announcing the winners in 3..",
                    'message',
                    false,
                    0,
                    [],
                    true
                );
            }, 3000);

            setTimeout(() => {
                sendMessage(
                    data,
                    "2..",
                    'message',
                    false,
                    0,
                    [],
                    true
                );
            }, 6000);

            setTimeout(() => {
                sendMessage(
                    data,
                    "1..",
                    'message',
                    false,
                    0,
                    [],
                    true
                );
            }, 9000);

            setTimeout(() => {
                sendMessage(
                    data,
                    "And the winner is.. '" +victoryUserName+ "' \nCongratulations, here is your prize!",
                    'message',
                    false,
                    0,
                    [],
                    true
                );
            }, 12000);


            setTimeout(() => {
                sendMessage(
                    data,
                    generateSystemMessage(botOptions, data, currentItem.nftName, victoryUserName, 1),
                    'message',
                    true,
                    0,
                    [],
                    true
                )
            }, 15000);

        }).catch(error => {
            requestError(data, 'transferItem', error)
        })

    }, getTimeout(timeData));
}


const addingTime = (data, time) => {
    let currentTime = new Date();

    sendMessage(
        data,
        "Thank you. I am pleased to announce that the raffle registration is now on!\n\nThe time now is " + currentTime.toLocaleTimeString() + " GMT, all users who write a message during next "+ time[0]+ " minutes will all be counted as participants!",
        'message',
        false,
        0,
    )

    if (time[1] === "m") {
        currentTime.setMinutes(currentTime.getMinutes() + Number(time[0]));
    }

    if (time[1] === "h") {
        currentTime.setHours(currentTime.getHours() + Number(time[0]));
    }

    if (time[1] === "d") {
        currentTime.setDate(currentTime.getDate() + Number(time[0]));
    }
    return currentTime;
}

const getTimeout = (time) => {
    if (time[1] === "m") {
        return time[0] * 60000;
    }

    if (time[1] === "h") {
        return time[0] * 3600000;
    }

    if (time[1] === "d") {
        return time[0] * 86400000;
    }
}

const generateSystemMessage = (botOptions, data, itemName, victoryUserName, amount) => {
    if (botOptions && data) {
        return botOptions.botData.firstName + ' ' + botOptions.botData.lastName + ' -> ' + amount + ' ' + itemName + ' -> ' + " " + victoryUserName;
    }
}