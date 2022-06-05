import {observer} from 'mobx-react-lite';
import React, { useEffect } from 'react';

import {useStores} from '../stores/context';
import {RoomsTabBar} from '../components/RoomList/RoomsTabBar';
import { getRoomList } from '../components/realmModels/chatList';

const RoomListScreen = observer(() => {
  const {chatStore, loginStore} = useStores()
  const roomList = getRoomList()

  let rosterListArray: { name: any; participants: any; avatar: any; jid: any; counter: any; lastUserText: any; lastUserName: any; createdAt: any; muted: any; priority: any; }[] = [];

  // if(roomList.length){
  //   roomList.map((item:any) => {
  //     rosterListArray.push({
  //       name: item.name,
  //       participants: item.participants,
  //       avatar: item.avatar,
  //       jid: item.jid,
  //       counter: item.counter,
  //       lastUserText: item.lastUserText,
  //       lastUserName: item.lastUserName,
  //       createdAt: item.createdAt,
  //       muted: item.muted,
  //       priority: item.priority,
  //     });
  //   })

  //   chatStore.setRooms(rosterListArray)
  // }
  useEffect(()=>{
    console.log(roomList,"roomlistssss")
    if(roomList.length)
    {
      roomList.map((item:any)=>{
      rosterListArray.push({
        name: item.name,
        participants: item.participants,
        avatar: item.avatar,
        jid: item.jid,
        counter: item.counter,
        lastUserText: item.lastUserText,
        lastUserName: item.lastUserName,
        createdAt: item.createdAt,
        muted: item.muted,
        priority: item.priority,
      })
      })
      chatStore.setRooms(rosterListArray)
    }
  },[roomList])

  return <RoomsTabBar />;
});



export default RoomListScreen