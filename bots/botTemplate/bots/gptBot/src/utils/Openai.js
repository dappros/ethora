const { Configuration, OpenAIApi } = require("openai");
const { botInitData } = require("../config/Config");

const configuration = new Configuration({
    apiKey: botInitData().openaiData.token,
});
const openai = new OpenAIApi(configuration);

const runCompletion = async (message, userJID, userName, allergies) => {
    try {
        // const prompt = `User with id "${userJID}", name "${userName}" and allergies: "${allergies}", asks: "${message}"`;
        const prompt = `User with id "${userJID}", name "${userName}" and data in the document: "${allergies}", asks: "${message}"`;
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            max_tokens: 250,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            user: userJID
        });
        console.log(completion.data)
        return completion.data.choices[0].text.trim();
        // return completion.choices[0].text.trim();
    }catch (error){
        console.log('Error runCompletion: ', error, error.data)
        return error.response.statusText
    }
}

module.exports = {
    runCompletion,
};


// temperature: 0,
//     max_tokens: 250,
//     top_p: 1,
//     frequency_penalty: 0.0,
//     presence_penalty: 0.0,
//     user: ctx.message.data.user.userJID