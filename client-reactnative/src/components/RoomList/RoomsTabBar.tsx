/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {useStores} from '../../stores/context';
import {RoomList} from './RoomList';
import {commonColors, defaultChats, textStyles} from '../../../docs/config';
import {Badge, Text} from 'native-base';

const ROOM_KEYS = {
  official: 'official',
  private: 'private',
  groups: 'groups',
};

const renderTabBar = (props: any) => {
  return (
    <TabBar
      renderLabel={({route, focused}) => (
        <Text
          color={focused ? 'white' : 'info.200'}
          fontFamily={textStyles.semiBoldFont}>
          {route.title}
        </Text>
      )}
      {...props}
      // renderBadge={({route}) => (
      //   <Badge variant={"subtle"}>
      //     <Text>{props.navigationState.notificationsCount[route.key]}</Text>
      //   </Badge>
      // )}
      indicatorStyle={{backgroundColor: 'white'}}
      style={{backgroundColor: commonColors.primaryDarkColor}}
    />
  );
};
export const RoomsTabBar = observer(() => {
  const [routeIndex, setRouteIndex] = useState(0);
  const routes = [
    {key: ROOM_KEYS.official, title: 'Official'},
    {key: ROOM_KEYS.private, title: 'Private'},
    {key: ROOM_KEYS.groups, title: 'Groups'},
  ];

  const {chatStore} = useStores();
  // const roomsList = chatStore.roomList;
  const notificationsCount = {
    official: 0,
    private: 0,
    groups: 0,
  };

  const privateChats = useMemo(
    () =>
      chatStore.roomList?.filter((item: any) => {
        const splitedJid = item?.jid?.split('@')[0];

        if (
          item.participants < 3 &&
          !defaultChats[splitedJid] &&
          !chatStore.roomsInfoMap[item.jid]?.isFavourite
        ) {
          notificationsCount[ROOM_KEYS.private] += item.counter;
          return item;
        }
      }),
    [chatStore.roomList, chatStore.roomsInfoMap.isUpdated],
  );

  const officialChats = useMemo(
    () =>
      chatStore.roomList.filter(item => {
        const splitedJid = item?.jid?.split('@')[0];
        if (
          defaultChats[splitedJid] ||
          chatStore.roomsInfoMap[item.jid]?.isFavourite
        ) {
          notificationsCount[ROOM_KEYS.official] += item.counter;
          return item;
        }
        if (chatStore.roomsInfoMap[item.jid]?.isFavourite) {
          return item;
        }
      }),
    [chatStore.roomList, chatStore.roomsInfoMap.isUpdated],
  );

  const groupsChats = useMemo(
    () =>
      chatStore.roomList.filter((item: any) => {
        const splitedJid = item?.jid?.split('@')[0];

        if (
          item.participants > 2 &&
          !defaultChats[splitedJid] &&
          !chatStore.roomsInfoMap[item.jid]?.isFavourite
        ) {
          notificationsCount[ROOM_KEYS.groups] += item.counter;
          return item;
        }
      }),
    [chatStore.roomList, chatStore.roomsInfoMap.isUpdated],
  );

  return (
    <TabView
      swipeEnabled={false}
      renderTabBar={renderTabBar}
      navigationState={{
        index: routeIndex,
        routes: routes,
        notificationsCount,
      }}
      renderScene={SceneMap({
        official: () => <RoomList roomsList={officialChats} />,
        private: () => <RoomList roomsList={privateChats} />,
        groups: () => <RoomList roomsList={groupsChats} />,
      })}
      onIndexChange={setRouteIndex}
      initialLayout={{width: widthPercentageToDP('100%')}}
    />
  );
});
