import {User} from "../models/users.js";
import botOptions from "../config/config.js";

export const saveUserData = async (user_jid, user_name) => {
    return await new User({
        user_jid: user_jid,
        user_name: user_name,
        bot_name: botOptions.botData.firstName
    }).save();
}

export const getUserData = async (userJid) => {
    return await User.findOne({user_jid: userJid}).exec();
}