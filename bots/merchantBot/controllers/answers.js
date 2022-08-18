import {Answer} from "../models/answers.js";
import {loginData} from "../api.js";

export const setAnswer = async (questionId, answer, user_jid, question_group, answer_group, shortName) => {
    return await new Answer({
        question_id: questionId,
        answer: answer,
        user_jid: user_jid,
        app_id: loginData.user.appId,
        question_group: question_group,
        answer_group: answer_group,
        shortName: shortName
    }).save();
}

export const updateAnswer = async (questionId, answer, user_jid) => {
    return await Answer.updateOne({
        question_id: questionId,
        user_jid: user_jid
    }, {$set: {answer: answer}}).exec();
}

export const updateAnswerId = async (_id, answer, user_jid) => {
    return await Answer.updateOne({
        _id: _id,
        user_jid: user_jid
    }, {$set: {answer: answer}}).exec();
}

export const getListAnswers = async (userJid) => {
    return await Answer.find({user_jid: userJid}).exec();
}

export const getListAnswersInGroup = async (userJid, question_group) => {
    return await Answer.find({user_jid: userJid, question_group: question_group}).exec();
}

export const getListAnswersInItemGroup = async (userJid, question_group, answer_group) => {
    return await Answer.find({user_jid: userJid, question_group: question_group, answer_group: answer_group}).exec();
}

export const getAnswer = async (questionId, userJid) => {
    return await Answer.findOne({question_id: questionId, user_jid: userJid}).exec();
}

export const getAnswerToId = async (_id, userJid) => {
    return await Answer.findOne({_id: _id, user_jid: userJid}).exec();
}

export const checkAnswer = async (userJid, _id) => {
    return await Answer.findOne({user_jid: userJid, _id: _id}).exec();
}

export const deleteAnswer = async (userJid, answer, question_group) => {
    return await Answer.deleteOne({user_jid: userJid, answer: answer, question_group: question_group}).exec();
}

export const deleteAnswerGroup = async (userJid, answer_group) => {
    return await Answer.deleteMany({user_jid: userJid, answer_group: answer_group}).exec();
}

// medicalReports
export const getAnswersFilter = async (userJid, question_group, filterType, answer) => {
    return await Answer.find({user_jid: userJid, question_group: question_group, shortName: filterType, answer: answer}).exec();
}
