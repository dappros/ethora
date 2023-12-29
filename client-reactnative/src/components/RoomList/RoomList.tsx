/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { observer } from "mobx-react-lite";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useStores } from "../../stores/context";
import { RoomListItem } from "./RoomListItem";
import { View } from "native-base";
import { Animated, FlatList, Easing, PanResponder } from "react-native";
import { roomListProps as roomListProperties } from "../../stores/chatStore";
import RoomListHeader from "./RoomCopmonents/RoomListHeader";
import AnimatedRoomCategoryBlock from "./RoomCopmonents/AnimatedBar";
import RoomsHeader from "./RoomsHeader";
import NewChatModal from "../Modals/NewChatModal";

interface IRoomList {
  roomsList: roomListProperties[];
  roomsName?: "string";
}

const ROOM_KEYS = {
  official: "official",
  private: "private",
  groups: "groups",
};

export const RoomList: React.FC<IRoomList> = observer(
  (properties: IRoomList) => {
    const { chatStore } = useStores();
    const { roomsList } = properties;
    const sortedRoomsList = useMemo(
      () =>
        roomsList.sort(
          (a, b) =>
            chatStore.roomsInfoMap[a.jid]?.priority -
            chatStore.roomsInfoMap[b.jid]?.priority
        ),
      [roomsList, chatStore.roomsInfoMap]
    );
    const [allRooms, setAllRooms] = useState([...chatStore.roomList]);
    const [modalVisible, setModalVisible] = useState(false);

    const [searchValue, setSearchValue] = useState("");

    const [activeTab, setActiveTab] = useState(chatStore.activeChats);
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderRelease: (evt, gestureState) => {
          const { dx } = gestureState;
          if (dx > 50) {
            setActiveTab(ROOM_KEYS.private);
          } else if (dx < -50) {
            setActiveTab(ROOM_KEYS.groups);
          }
        },
      })
    ).current;

    const handleSearchChange = useCallback(
      (value) => {
        setSearchValue(value);
        const newRooms = [...chatStore.roomList];
        setAllRooms(newRooms.filter((room) => room.name.includes(value)));
      },
      [chatStore.roomList]
    );

    const scrollY = useRef(new Animated.Value(0)).current;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RoomsHeader style={undefined} />
        <AnimatedRoomCategoryBlock
          handleSearchChange={handleSearchChange}
          searchValue={searchValue}
          scrollY={scrollY}
          setModalVisible={setModalVisible}
        />
        <View
          justifyContent={"center"}
          alignItems={"center"}
          w={"full"}
          flex={1}
        >
          <FlatList
            ListHeaderComponent={() => <RoomListHeader scrollY={scrollY} />}
            nestedScrollEnabled={true}
            style={{ width: "100%" }}
            data={searchValue ? allRooms : sortedRoomsList}
            onEndReachedThreshold={0.1}
            keyExtractor={(item: any) => `${item.jid}`}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              {
                useNativeDriver: false,
              }
            )}
            contentOffset={{ x: 0, y: 100 }}
            renderItem={({ item, index }) => {
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
        <NewChatModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </View>
    );
  }
);
