import botOptions from "../../config/config.js";
import {Room} from "../models/rooms.js";

export const saveRoomData = async (address) => {
    return await new Room({
        address: address,
        bot_name: botOptions.botData.firstName
    }).save();
}

export const getListRooms = async () => {
    return await Room.find({bot_name: botOptions.botData.firstName}).exec();
}

export const getOneRoom = async (address) => {
    return await Room.findOne({address: address, bot_name: botOptions.botData.firstName}).exec();
}