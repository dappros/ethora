const axios = require('axios');
const { runCompletion } = require("../utils/Openai");

/**
 * A middleware function that handles the retrieval of user's allergies
 * and utilizes the OpenAI model for answering user queries.
 *
 * @param {Object} context - The context object provided by the Bot platform, encapsulating user, message and session data.
 * @returns {Promise} - A Promise that resolves to sending a text message to the user.
 */
const allergyHandler = async (context) => {
    // We get the userJID from the context message data
    const userJID = context.message.data.user.userJID;

    // Here we create an object that will be used to filter the data from the API
    // This object will filter only the data that has the same user_jid and is of type "Allergies"
    const filterData = {
        where: {
            user_jid: userJID,
            type: "Allergies"
        }
    }

    try {
        // We get all user allergies from the data API using the filter we defined
        const result = await getFilteredDataApi(filterData);

        // We process the result from the API and convert it into a string format
        const allergiesString = createAllergiesString(result);

        // We send a request to openai passing in the user's question, userJID, user's first name and allergiesString
        const resultOpenAI = await runCompletion(context.message.getText(), userJID, context.message.data.user.firstName, allergiesString);

        // Finally, we send the result from OpenAI back to the user
        return context.session.sendTextMessage(resultOpenAI);

    } catch ( error ) {
        console.log("Error: ", error);
    }
}

/**
 * Function to parse data API into a openai-friendly string of allergies.
 *
 * @param {Object} data - The data object returned by the API.
 * @returns {String} - A string representation of the user's allergies.
 */
const createAllergiesString = (data) => {
    // We use the map function to create a new array of strings that represent each allergy
    const allergies = data.items.map((item) => {
        // For each allergy, we get the name, reaction and frequency, or a default value if they are not available
        const name = item.name || "Unnamed";
        const reaction = item.reaction || "Unknown reaction";
        const frequency = item.frequency || "Unknown frequency";

        // We return a string that represents the allergy
        return `${ name }: ${ reaction } (Frequency: ${ frequency })`;
    });

    return allergies.join(', ');
}

/**
 * Function to make a GET request to the data API and retrieve user data based on provided filter parameters.
 *
 * @param {Object} params - The parameters to filter the data.
 * @returns {Promise} - A Promise that resolves to the filtered data.
 */
const getFilteredDataApi = async (params) => {
    try {
        // We create an instance of axios with the base URL of the API
        const http = axios.create({
            baseURL: "https://app-dev.dappros.com/v1/"
        });
        // We make a GET request to the 'data' endpoint and pass in our filter parameters
        const result = await http.get('data', { params });
        // We return the data from the API
        return result.data;
    } catch ( error ) {
        console.log(JSON.stringify(error));
        throw error;
    }
}

module.exports = allergyHandler;
