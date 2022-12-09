const dates = (timeToAdd) => {
    const timeData = timeToAdd.split(":");
    const addedTime = addingTime(timeData);

    const oneTh = Number(timeData[0]) / 3 * 1;
    const twoTh = Number(timeData[0]) / 3 * 2;

    let senderCounter = 0;

    let timerId = setInterval(() => {
        const currentTime = new Date();

        let timeDifference = Math.abs(addedTime.getTime() - currentTime.getTime());
        let differenceUnMinutes = (timeDifference / 1000) / 60;

        if (differenceUnMinutes > oneTh && differenceUnMinutes < twoTh && senderCounter === 0) {
            //SEND MESSAGE
            senderCounter += 1;
        }

        if (differenceUnMinutes < oneTh && differenceUnMinutes < twoTh && senderCounter === 1) {
            //SEND MESSAGE
            senderCounter += 1;
        }
    }, 2000);

    setTimeout(() => {
        clearInterval(timerId);
    //    SEND ITEM TO USER
    }, getTimeout(timeData));
}


const addingTime = (time) => {
    let currentTime = new Date();
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

console.log(dates("3:m"))