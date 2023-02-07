/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import {observer} from 'mobx-react-lite';
import React from 'react';
import {useStores} from '../../stores/context';
import {RoomListItem} from './RoomListItem';
import {View} from 'native-base';
import {FlatList} from 'react-native';

export const RoomList = observer(({roomsList}: any) => {
  const {chatStore} = useStores();

  const sortedRoomsList = roomsList.sort(
    (a: any, b: any) =>
      chatStore.roomsInfoMap[a.jid]?.priority -
      chatStore.roomsInfoMap[b.jid]?.priority,
  );

  return (
    <>
      <View flex={1} justifyContent={"center"} alignItems={"center"}>
        <FlatList
          nestedScrollEnabled={true}
          data={sortedRoomsList}
          keyExtractor={(item: any) => `${item.jid}`}
          renderItem={({item, index}) => {
            return (
              <RoomListItem
                index={index}
                length={sortedRoomsList.length}
                counter={item.counter}
                jid={item.jid}
                name={item.name}
                participants={item.participants}
                key={item.jid}
              />
            );
          }}
        />
      </View>
    </>
  );
  // });
});
