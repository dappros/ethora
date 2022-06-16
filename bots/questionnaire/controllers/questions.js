import {Question} from "../models/questions.js";

export const getListQuestions = async () => {
    try {
        return await Question.find({}).exec();
    } catch (error) {
        return error;
    }
}

export const getQuestion = async (questionId) => {
    try {
        return await Question.findOne({question_id: questionId}).exec();
    } catch (error) {
        return error;
    }
}