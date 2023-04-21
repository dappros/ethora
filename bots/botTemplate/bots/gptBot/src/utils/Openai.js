const { Configuration, OpenAIApi } = require("openai");
const { botInitData } = require("../config/Config");

const configuration = new Configuration({
    apiKey: botInitData().openaiData.token,
});
const openai = new OpenAIApi(configuration);

const runCompletion = async (message) => {
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: message,
            temperature: 0,
            max_tokens: 250,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        console.log(completion.data)
        return completion.data.choices[0].text;
    }catch (error){
        console.log('Error runCompletion: ', error)
        return error.response.statusText
    }
}

module.exports = {
    runCompletion,
};