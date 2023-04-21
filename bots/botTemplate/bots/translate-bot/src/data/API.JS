const { botInitData } = require("../config/Config");
const axios = require('axios');

const translateText = async (text) => {
    const API_KEY = botInitData().googleData.token;

    try {
        let res = await axios.post(
            `https://translation.googleapis.com/language/translate/v2?key=${ API_KEY }`,
            { q: text, target: "es" }
        );
        return res.data.data.translations[ 0 ].translatedText;
    } catch ( error ) {
        JSON.stringify(error)
        throw error;
    }
}

module.exports = {
    translateText,
};