import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Users = new Schema({
    user_jid: {type: String, required: true, index: true, unique: true},
    user_name: {type: String},
    bot_name : {type: String},
    date_added: { type: Date, default: Date.now}
});

export const User = mongoose.model('Users', Users);