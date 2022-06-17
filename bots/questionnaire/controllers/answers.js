import {Answer} from "../models/answers.js";
import {loginData} from "../api.js";

export const setAnswer = async (questionId, answer, user_jid) => {
    return await new Answer({
        question_id: questionId,
        answer: answer,
        user_jid: user_jid,
        app_id: loginData.user.appId
    }).save();
}

export const getListAnswers = async (userJid) => {
    return await Answer.find({user_jid: userJid}).exec();
}

export const getAnswer = async (questionId, userJid) => {
    return await Answer.findOne({question_id: questionId, user_jid: userJid}).exec();
}