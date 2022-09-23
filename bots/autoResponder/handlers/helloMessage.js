import {getUserRooms} from "../actions.js";

export const presenceMessageHandler = (data) => {
    console.log('=> presenceMessageHandler || Message received from ', data.userJID, data.message);
    getUserRooms(data);
}