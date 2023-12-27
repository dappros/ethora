/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React, { useCallback, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "../../stores/context";
import { RoomList } from "./RoomList";
import { checkIsDefaultChat } from "../../helpers/chat/checkIsDefaultChat";
import { roomListProps } from "../../stores/chatStore";
import _ from "lodash";

const ROOM_KEYS = {
  official: "official",
  private: "private",
  groups: "groups",
};

export const RoomsTabBar = observer(() => {
  const { chatStore } = useStores();

  const privateRooms = useMemo(
    () =>
      chatStore.roomList?.filter((item) => {
        const splitedJid = item?.jid?.split("@")[0];
        const isDefaultChat = checkIsDefaultChat(splitedJid);
        return (
          item.participants < 3 &&
          !isDefaultChat &&
          !chatStore.roomsInfoMap[item.jid]?.isFavourite &&
          !item.meta
        );
      }),
    [chatStore.roomList, chatStore.roomsInfoMap]
  );

  const official = useMemo(
    () =>
      chatStore.roomList.filter((item) => {
        const splitedJid = item?.jid?.split("@")[0];
        const isDefaultChat = checkIsDefaultChat(splitedJid);
        return isDefaultChat || chatStore.roomsInfoMap[item.jid]?.isFavourite;
      }),
    [chatStore.roomList, chatStore.roomsInfoMap]
  );

  const groups = useMemo(
    () =>
      chatStore.roomList.filter((item) => {
        const splitedJid = item?.jid?.split("@")[0];
        const isDefaultChat = checkIsDefaultChat(splitedJid);
        return (
          item.participants > 2 &&
          !isDefaultChat &&
          !chatStore.roomsInfoMap[item.jid]?.isFavourite &&
          !item.meta
        );
      }),
    [chatStore.roomList, chatStore.roomsInfoMap]
  );

  const getRooms = useCallback(() => {
    if (chatStore.activeChats === ROOM_KEYS.official) {
      return official;
    }
    const roomsWithDate = privateRooms
      .concat(groups)
      .filter((item) => chatStore.roomsInfoMap[item.jid]?.lastMessageTime);
    const roomsWithoutDate = privateRooms
      .concat(groups)
      .filter((item) => !chatStore.roomsInfoMap[item.jid]?.lastMessageTime);
    return _.orderBy(
      roomsWithDate,
      (el) => chatStore.roomsInfoMap[el.jid]?.lastMessageTime,
      "desc"
    ).concat(roomsWithoutDate) as roomListProps[];
  }, [
    chatStore.activeChats,
    official,
    privateRooms,
    groups,
    chatStore.roomsInfoMap,
  ]);

  useEffect(() => {
    if (chatStore.roomList) {
      chatStore.updateCounter();
    }
  }, [chatStore.roomList]);

  return <RoomList roomsList={getRooms()} />;
});
