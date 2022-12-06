/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {useStores} from '../../stores/context';
import {RoomList} from './RoomList';
import {commonColors, defaultChats, textStyles} from '../../../docs/config';
import {Badge, Text} from 'native-base';
import {useRoute} from '@react-navigation/native';
import {ROUTES} from '../../constants/routes';
import _ from 'lodash';
const ROOM_KEYS = {
  official: 'official',
  private: 'private',
  groups: 'groups',
};

export const RoomsTabBar = observer(() => {
  const {chatStore} = useStores();
  const route = useRoute();
  const privateRooms = chatStore.roomList?.filter((item: any) => {
    const splitedJid = item?.jid?.split('@')[0];

    if (
      item.participants < 3 &&
      !defaultChats[splitedJid] &&
      !chatStore.roomsInfoMap[item.jid]?.isFavourite &&
      !item.meta
    ) {
      return item;
    }
  });
  const official = chatStore.roomList.filter(item => {
    const splitedJid = item?.jid?.split('@')[0];
    if (
      defaultChats[splitedJid] ||
      chatStore.roomsInfoMap[item.jid]?.isFavourite
    ) {
      return item;
    }
  });
  const groups = chatStore.roomList.filter((item: any) => {
    const splitedJid = item?.jid?.split('@')[0];

    if (
      item.participants > 2 &&
      !defaultChats[splitedJid] &&
      !chatStore.roomsInfoMap[item.jid]?.isFavourite &&
      !item.meta
    ) {
      return item;
    }
  });

  const getRooms = useCallback(() => {
    if (chatStore.activeChats === ROOM_KEYS.official) {
      return official;
    }
    const roomsWithDate = privateRooms
      .concat(groups)
      .filter(item => chatStore.roomsInfoMap[item.jid]?.lastMessageTime);

    const roomsWithoutDate = privateRooms
      .concat(groups)
      .filter(item => !chatStore.roomsInfoMap[item.jid]?.lastMessageTime);

    return _.orderBy(
      roomsWithDate,
      el => chatStore.roomsInfoMap[el.jid]?.lastMessageTime,
      'desc',
    ).concat(roomsWithoutDate);
  }, [
    chatStore.roomList,
    chatStore.activeChats,
    chatStore.roomsInfoMap.isUpdated,
  ]);

  useEffect(() => {
    if (chatStore.roomList) {
      chatStore.updateCounter();
    }
  }, [chatStore.roomList]);

  // const roomList = useMemo(
  //   () => filterRooms(),
  //   [
  //     chatStore.roomList,
  //     chatStore.activeChats,
  //     chatStore.roomsInfoMap.isUpdated,
  //   ],
  // );

  return <RoomList roomsList={getRooms()} />;
});
