import {observer} from 'mobx-react-lite';
import { View } from 'native-base';
import React from 'react';

import {RoomsTabBar} from '../components/RoomList/RoomsTabBar';

const RoomListScreen = observer(() => {
  return (
    <View flex={1} backgroundColor={"white"}>
      <RoomsTabBar />
    </View>
  )
});

export default RoomListScreen;
