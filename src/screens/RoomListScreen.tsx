import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';

import {useStores} from '../stores/context';
import {RoomsTabBar} from '../components/RoomList/RoomsTabBar';

const RoomListScreen = observer(() => {
  return <RoomsTabBar />;
});

export default RoomListScreen;
