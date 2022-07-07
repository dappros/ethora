import {observer} from 'mobx-react-lite';
import React from 'react';

import {RoomsTabBar} from '../components/RoomList/RoomsTabBar';

const RoomListScreen = observer(() => {
  return <RoomsTabBar />;
});

export default RoomListScreen;
