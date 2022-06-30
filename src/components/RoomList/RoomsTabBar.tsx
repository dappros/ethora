import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {useStores} from '../../stores/context';
import {RoomList} from './RoomList';
import {commonColors, defaultChats, textStyles} from '../../../docs/config';
import { Badge, Text } from 'native-base';

const ROOM_KEYS = {
  official: 'official',
  private: 'private',
  groups: 'groups',
};

const renderTabBar = (props: any) => {
  
  return (
    <TabBar
      renderLabel={({route, focused})=>(
        <Text
        color={focused?'white':'info.200'}
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
        const splitedJid:string = item.jid.split('@')[0];
        if (item.participants < 3 && !defaultChats[splitedJid]) {
          notificationsCount[ROOM_KEYS.private] += item.counter;
          return item;
        }
      }),
    [chatStore.roomList],
  );

  const officialChats = useMemo(
    () =>
      chatStore.roomList.filter(item => {
        const splitedJid = item.jid.split('@')[0];
        if (defaultChats[splitedJid]) {
          notificationsCount[ROOM_KEYS.official] += item.counter;
          return item;
        }
      }),
    [chatStore.roomList],
  );

  const groupsChats = useMemo(
    () =>
      chatStore.roomList.filter((item: any) => {
        const splitedJid = item.jid.split('@')[0];

        if (item.participants > 2 && !defaultChats[splitedJid]) {
          notificationsCount[ROOM_KEYS.groups] += item.counter;
          return item;
        }
      }),
    [chatStore.roomList],
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
