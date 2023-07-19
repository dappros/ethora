const { Configuration, OpenAIApi } = require("openai");
const { botInitData } = require("../config/Config");

const configuration = new Configuration({
    apiKey: botInitData().openaiData.token,
});
const openai = new OpenAIApi(configuration);

const runCompletion = async (prompt, userJID) => {
    try {
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
        return completion.data.choices[ 0 ].text.trim();
    } catch ( error ) {
        console.log('Error runFinalCompletion: ', prompt.length, error, error.data)
        return error.response.statusText
    }
}

module.exports = {
    runCompletion,
};