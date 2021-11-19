/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import * as types from '../constants/types';
import {insertMessages} from '../components/realmModels/messages';

export const setChatHeader = data => ({
  type: types.FETCH_CHAT_HEADER,
  payload: data,
});

export const isRoomCreated = data => ({
  type: types.IS_ROOM_CREATED,
  payload: data,
});

export const setRoster = data => ({
  type: types.SET_ROSTER,
  payload: data,
});

export const updatedRoster = data => ({
  type: types.UPDATED_ROASTER,
  payload: data,
});

export const finalMessageArrived = data => ({
  type: types.FINAL_MESSAGE_ARRIVED,
  payload: data,
});

export const setRecentRealtimeChat = data => ({
  type: types.SET_RECENT_REALTIME_CHAT,
  payload: data,
});

export const setShouldCount = data => ({
  type: types.SHOULD_COUNT,
  payload: data,
});

export const participantsUpdate = data => ({
  type: types.PARTICIPANT_UPDATE,
  payload: data,
});

export const roomCreated = (isRoom, navigation) => {
  return dispatch => {
    dispatch(isRoomCreated(isRoom));
    navigation.navigate('ChatHomeComponent');
  };
};

export const setCurrentChatDetails = (
  chat_jid,
  chat_name,
  navigation,
  isRoom,
) => {
  return async dispatch => {
    let data = null;
    data = {chat_jid, chat_name};
    await dispatch(setChatHeader(data));
    (await isRoom) ? dispatch(isRoomCreated(isRoom)) : null;
    await navigation.navigate('ChatComponent');
  };
};

export const setRosterAction = rosterData => {
  return dispatch => {
    if (rosterData) {
      dispatch(setRoster(rosterData));
    }
  };
};
export const setRoomRoles = data => ({
  type: types.SET_ROOM_ROLES,
  payload: data,
});

export const setRecentRealtimeChatAction = (
  messageObject,
  roomName,
  shouldUpdateChatScreen,
  tokenAmount,
  receiverMessageId,
) => {
  return dispatch => {
    insertMessages(messageObject, roomName, tokenAmount, receiverMessageId);
    let recentRealtimeChat;
    if (messageObject.system) {
      recentRealtimeChat = {
        createdAt: messageObject.createdAt,
        message_id: messageObject._id,
        room_name: roomName,
        text: messageObject.text,
        system: true,
        shouldUpdateChatScreen,
        tokenAmount,
      };
    }
    if (!messageObject.system) {
      recentRealtimeChat = {
        avatar: messageObject.user.avatar,
        createdAt: messageObject.createdAt,
        message_id: messageObject._id,
        name: messageObject.user.name,
        room_name: roomName,
        text: messageObject.text,
        system: false,
        mimetype: messageObject.mimetype,

        image: messageObject.image,
        realImageURL: messageObject.realImageURL,
        isStoredFile: messageObject.isStoredFile,
        size: messageObject.size,
        duration: messageObject.duration,

        waveForm: messageObject.waveForm,
        user_id: messageObject.user._id,
        shouldUpdateChatScreen,
      };
    }
    dispatch(setRecentRealtimeChat(recentRealtimeChat));
  };
};

export const finalMessageArrivalAction = data => {
  return dispatch => {
    dispatch(finalMessageArrived(data));
  };
};

export const shouldCountAction = data => {
  return dispatch => {
    dispatch(setShouldCount(data));
  };
};

export const participantsUpdateAction = data => {
  return dispatch => {
    dispatch(participantsUpdate(data));
  };
};

export const tokenAmountUpdateAction = value => ({
  type: types.TOKEN_AMOUNT_UPDATE,
  payload: value,
});

export const setPushNotificationData = data => ({
  type: types.SET_PUSH_DATA,
  payload: data,
});

export const updateMessageComposingState = data => ({
  type: types.UPDATE_MESSAGE_COMPOSING_STATE,
  payload: data,
});
