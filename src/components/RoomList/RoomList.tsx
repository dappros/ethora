import {observer} from 'mobx-react-lite';
import React from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {asyncStorageConstants} from '../../constants/asyncStorageConstants';
import {asyncStorageSetItem} from '../../helpers/cache/asyncStorageSetItem';
import {useStores} from '../../stores/context';
import {RoomListItem} from './RoomListItem';

export const RoomList = observer(({roomsList}:any) => {
  const {chatStore} = useStores();
  const sortedRoomsList = roomsList.sort(
    (a:any, b:any) =>
      chatStore.roomsInfoMap[a.jid]?.priority -
      chatStore.roomsInfoMap[b.jid]?.priority,
  );
  

  const onDragEnd = async (partialReorderedList:any) => {
    const partialListCopy = partialReorderedList.map((item:any, index:number) => {
      chatStore.updateRoomInfo(item.jid, {priority: index});
      return {...item, priority: index};
    });
    const restOfTheList = chatStore.roomList.filter(
      (item:any) => !partialListCopy.find((el:any) => item.jid === el.jid),
    );
    const fullRoomsList = partialListCopy.concat(restOfTheList);
    chatStore.setRooms(fullRoomsList);
    await asyncStorageSetItem(
      asyncStorageConstants.roomsListHashMap,
      chatStore.roomsInfoMap,
    );
  };
  return (
    <DraggableFlatList
      nestedScrollEnabled={true}
      // onRelease={() => this.setState({movingActive: false})}
      data={sortedRoomsList}
      renderItem={({item, index, drag, isActive}) => {
        const room = chatStore.roomsInfoMap[item.jid];
        return (
          <RoomListItem
            isActive={isActive}
            drag={drag}
            key={item.jid}
            name={item.name}
            jid={item.jid}
            participants={item.participants}
            lastUserName={room?.lastUserName}
            lastUserText={room?.lastUserText}
            lastMessageTime={room?.lastMessageTime}
            counter={item.counter}
          />
        );
      }}
      onDragEnd={({data}) => onDragEnd(data)}
      keyExtractor={(item:any) => `draggable-item-${item.jid}`}
    />
  );
  // });
});
