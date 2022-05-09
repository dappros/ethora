import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {useStores} from '../../stores/context';
import {RoomList} from './RoomList';
import { commonColors, defaultChats } from '../../../docs/config';

const ROOM_KEYS = {
  official: 'official',
  private: 'private',
  groups: 'groups',
};

const renderTabBar = (props:any) => {
  return (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: 'white'}}
      style={{backgroundColor: commonColors.primaryColor}}
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
  const roomsList = chatStore.roomList;
  const notificationsCount = {
    official: 0,
    private: 0,
    groups: 0,
  };

  const privateChats = useMemo(
    () =>
      roomsList?.filter((item:any) => {
        const splitedJid = item.jid.split('@')[0];

        if (item.participants < 3 && !defaultChats[splitedJid]) {
          notificationsCount[ROOM_KEYS.private] += item.counter;
          return item;
        }
      }),
    [roomsList],
  );

  const officialChats = useMemo(
    () =>
      roomsList.filter(item => {
        const splitedJid = item.jid.split('@')[0];
        if (defaultChats[splitedJid]) {
          notificationsCount[ROOM_KEYS.official] += item.counter;
          return item;
        }
      }),
    [roomsList],
  );

  const groupsChats = useMemo(
    () =>
      roomsList.filter((item:any) => {
        const splitedJid = item.jid.split('@')[0];

        if (item.participants > 2 && !defaultChats[splitedJid]) {
          notificationsCount[ROOM_KEYS.groups] += item.counter;
          return item;
        }
      }),
    [roomsList],
  );

  return (
    <TabView
      swipeEnabled={false}
      renderTabBar={renderTabBar}
      navigationState={{
        index: routeIndex,
        routes: routes,
        // notificationsCount,
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
