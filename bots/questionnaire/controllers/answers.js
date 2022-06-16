import {Answer} from "../models/answers.js";

export const setAnswer = async (questionId, answer, user_jid) => {
    try {
        return await new Answer({question_id: questionId, answer: answer, user_jid: user_jid}).save();
    } catch (error) {
        return error;
    }
}

export const getListAnswers = async (userJid) => {
    try {
        return await Answer.find({user_jid: userJid}).exec();
    } catch (error) {
        return error;
    }
}

export const getAnswer= async (questionId, userJid) => {
    try {
        return await Answer.findOne({question_id: questionId, user_jid: userJid}).exec();
    } catch (error) {
        return error;
    }
}