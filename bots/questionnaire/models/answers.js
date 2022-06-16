import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Answers = new Schema({
    question_id: {type: Number, required: true},
    answer: {type: String, required: true},
    user_jid: {type: String, required: true, index: true},
    timestamp: { type: Date, default: Date.now}
});

export const Answer = mongoose.model('Answers', Answers);