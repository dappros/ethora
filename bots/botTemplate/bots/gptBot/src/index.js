const { Bot } = require('../../../lib');
const { botInitData } = require("./config/Config");
const { runCompletion } = require("./utils/Openai");
const axios = require('axios');
const fs = require('fs');
const pdf = require('pdf-parse');

const bot = new Bot(botInitData().botData);

bot.use("Start", async (context) => {

    await context.session.sendTextMessage("Hello!\n" +
        "Send me all your questions and I'll try to answer them.");

    // Move to the next step
    context.stepper.nextUserStep();
});

bot.use(async (context) => {

    const indexOfSpace = context.message.getText().indexOf(' ');
    let clearMessage = context.message.getText().slice(indexOfSpace + 1);
    if ( !clearMessage.endsWith('.') ) {
        clearMessage += '.'
    }
    const userJID = context.message.data.user.userJID;

    // const filterData = {
    //     where: {
    //         user_jid: userJID,
    //         type: "Allergies"
    //     }
    // }
    // console.log(filterData)

    let dataBuffer = fs.readFileSync('./data/test.pdf');

    pdf(dataBuffer).then(function(data) {

    // getFilteredDataApi(filterData).then(result => {
    //     console.log("Filtered result: ", createAllergiesString(result))
        console.log(data.text);

        runCompletion(context.message.getText(), userJID, context.message.data.user.firstName, data.text).then(result => {
            return context.session.sendTextMessage(result);
        }).catch(error => {
            console.log("Error: ", error)
        })

    // }).catch(error => {
    //     console.log("Get filtered dat Error: ", error)
    // })
    });

}, 1);

function createAllergiesString(data) {
    const allergies = data.items.map((item) => {
        const name = item.name || "Unnamed";
        const reaction = item.reaction || "Unknown reaction";
        const frequency = item.frequency || "Unknown frequency";
        return `${name}: ${reaction} (Frequency: ${frequency})`;
    });
    return allergies.join(', ');
}



const getFilteredDataApi = async (params) => {
    try {
        const http = axios.create({
            baseURL: "https://app-dev.dappros.com/v1/"
        });

        let result = await http.get('data', { params }, {
            // headers: {
            //     'Content-Type': 'application/json',
            //     Authorization: this.authData.token,
            // },
        });
        return result.data;
    } catch ( error ) {
        console.log(JSON.stringify(error))
        throw error;
    }
}