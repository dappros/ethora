import {Question} from "../models/questions.js";

export const getListQuestions = async () => {
    return await Question.find({}).exec();
}

export const getQuestionsInGroup = async (group) => {
    return await Question.find({group: group}).exec();
}

export const getQuestion = async (questionId) => {
    return await Question.findOne({question_id: questionId}).exec();
}