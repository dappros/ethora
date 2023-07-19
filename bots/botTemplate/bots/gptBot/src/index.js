// Importing necessary dependencies and modules
const { Bot } = require('../../../lib');
const { join } = require("path");
require('dotenv').config({ path: join(__dirname, '../.env') })

// Importing bot configurations and different handlers
const { botInitData } = require("./config/Config");
const { processExistingExtractedText } = require("./process/process");
const { processFileUrl } = require("./process/processFileUrl");
const { processImage } = require("./process/processImage");
const { processPDF } = require("./process/processPDF");
const { processCSV } = require("./process/processCSV");
const { switchToAllergyContext } = require("./handlers/switchContextHandler");
const allergyHandler = require("./handlers/allergyHandler");
const clearBotState = require("./handlers/exitHandler");

// Mapping file types to their corresponding processing functions
const fileTypeProcessors = {
    jpeg: processImage,
    png: processImage,
    pdf: processPDF,
    csv: processCSV
};

// Instantiating a new Bot object with necessary configurations
const bot = new Bot(botInitData().botData);

// Middleware for handling incoming messages
bot.use(async (context) => {
    // Extracting necessary properties from the context object
    const { session, message } = context;
    const { state } = session;
    const { data } = message;
    const messageData = context.message?.data?.messageData; // Using optional chaining to avoid undefined errors
    const userJID = data?.user?.userJID;

    // If no messageData, early return
    if ( !messageData ) return;

    // Splitting the mimetype to get the file type
    const fileType = messageData.mimetype.split("/")[ 1 ];

    // If there's extracted text, process it
    if ( state.extractedText ) {
        return await processExistingExtractedText(context, userJID);
    }
    // If there's a csv file URL, process it
    if ( state.fileUrl ) {
        return await processFileUrl(context, state.fileUrl);
    }
    // If the message contains a known file type, process it accordingly
    if ( fileTypeProcessors[ fileType ] ) {
        return await fileTypeProcessors[ fileType ](context, messageData.location);
    }
});

// --Middleware for handling context-specific messages
// Processing by the "Context" keyword, to change the current step to work with the Allergy context
bot.use("Context", switchToAllergyContext);
// Handling all user questions in the context of allergies
bot.use(allergyHandler, 1);
// Handling user exit from any process. All processes are stopped and the states are cleared.
bot.use("exit", clearBotState);

// Export the bot
module.exports = bot;
