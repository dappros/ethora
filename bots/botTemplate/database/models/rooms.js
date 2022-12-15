import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Rooms = new Schema({
    address: {type: String, required: true, index: true, unique: true},
    bot_name : {type: String},
    date_added: { type: Date, default: Date.now}
});

export const Room = mongoose.model('Rooms', Rooms);