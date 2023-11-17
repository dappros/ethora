/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react';
import { useStores } from '../../stores/context';
import { RoomListItem } from './RoomListItem';
import { View, VStack, Text, HStack, Box, Avatar } from 'native-base';
import { Animated, FlatList, PanResponder, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HomeStackNavigationProp as HomeStackNavigationProperty } from '../../navigation/types';
import { roomListProps as roomListProperties } from '../../stores/chatStore';
import { defaultMetaRoom, ROOM_KEYS, textStyles } from '../../../docs/config';
import { httpGet } from '../../config/apiService';
import { homeStackRoutes } from '../../navigation/routes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { HeaderMenu } from '../MainHeader/HeaderMenu';
import Icon from 'react-native-vector-icons/FontAwesome';

interface IRoomList {
  roomsList: roomListProperties[];
}

const buttons = [
  {
    key: ROOM_KEYS.official,
    icon: 'star',
    show: true,
    accessibilityLabel: 'Starred chats',
    name: 'Favourite',
  },
  {
    key: ROOM_KEYS.private,
    icon: 'people',
    show: true,
    accessibilityLabel: 'Other chats',
    name: 'Groups',
  },
  {
    key: ROOM_KEYS.groups,
    icon: 'compass',
    show: true,
    accessibilityLabel: 'Meta',
    name: 'Private',
  },
];

export const RoomList: React.FC<IRoomList> = observer(
  (properties: IRoomList) => {
    const { chatStore, apiStore, loginStore } = useStores();
    const { roomsList } = properties;
    const route = useRoute();
    const sortedRoomsList = roomsList.sort(
      (a: any, b: any) =>
        chatStore.roomsInfoMap[a.jid]?.priority -
        chatStore.roomsInfoMap[b.jid]?.priority,
    );
    const navigation = useNavigation<HomeStackNavigationProperty>();

    const navigateToLatestMetaRoom = async () => {
      try {
        const response = await httpGet(
          '/room/currentRoom',
          loginStore.userToken,
        );
        if (!response.data.result) {
          navigation.navigate('ChatScreen', {
            chatJid:
              defaultMetaRoom.jid + apiStore.xmppDomains.CONFERENCEDOMAIN,
          });
          return;
        }
        navigation.navigate('ChatScreen', {
          chatJid:
            response.data.result.roomId.roomJid +
            apiStore.xmppDomains.CONFERENCEDOMAIN,
        });
      } catch (error) {
        console.log(error, 'adflkjsdf');

        // showError('Error', 'Cannot fetch latest meta room');
      }
    };

    const onTabPress = async (key: string) => {
      // if user clicked on the Meta button in the header and he is in the chat screen
      if (
        route.name === homeStackRoutes.ChatScreen &&
        key === ROOM_KEYS.groups
      ) {
        chatStore.toggleMetaNavigation(true);
        chatStore.changeActiveChats(key);
        // if current chat room is not meta one - navigate to latest meta room
        if (
          !chatStore.roomList.find((item) => item.jid === route.params?.chatJid)
            ?.meta
        ) {
          await navigateToLatestMetaRoom();
          chatStore.changeActiveChats(key);
        }
        return;
      }

      if (key === ROOM_KEYS.groups) {
        chatStore.changeActiveChats(key);

        await navigateToLatestMetaRoom();

        return;
      }
      chatStore.changeActiveChats(key);

      navigation.navigate('RoomsListScreem');
    };

    const highlightIcon = (id: string) => {
      return chatStore.activeChats === id;
    };

    const scrollY = useRef(new Animated.Value(0)).current;
    //
    // useEffect(() => {
    //   const scrollListener = scrollY.addListener(({ value }) => {
    //     // You can adjust the threshold based on your needs
    //     setShowCreateButton(value < 0);
    //   });
    //
    //   return () => {
    //     scrollY.removeAllListeners();
    //   };
    // }, [scrollY]);
    //

    const panY = useRef(new Animated.Value(0)).current;
    const [showCreateRoom, setShowCreateRoom] = useState(false);

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > 0) {
          setShowCreateRoom(true);
          Animated.event([null, { dy: panY }], {
            useNativeDriver: false,
          })(event, gestureState);
        } else {
          setShowCreateRoom(false);
          Animated.event([null, { dy: panY }], {
            useNativeDriver: false,
          })(event, gestureState);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          // Swipe down logic, e.g., show new content or navigate to a new screen
        } else if (gestureState.dy < -50) {
          // Swipe up logic, e.g., hide new content or navigate back
        }
        Animated.spring(panY, {
          toValue: 0,
          useNativeDriver: false,
          tension: 10, // Adjust the tension value for a smoother appearance
        }).start();
      },
    });

    const createRoomBlock = (
      <Animated.View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/*<Icon name="search" size={24} color="#888" />*/}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <TextInput
              placeholder="Search"
              style={{
                backgroundColor: '#fff',
                borderRadius: 30,
                paddingLeft: 20,
                height: 45,
                alignItems: 'center',
                paddingRight: 15,
                textAlign: 'center',
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 10,
            marginBottom: 20,
            backgroundColor: '#0052CD',
            height: 45,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30,
          }}
          onPress={() => navigation.navigate('NewChatScreen')}
        >
          <HStack space={2} alignItems={'center'} justifyContent={'center'}>
            <Icon name="plus" size={9} color="#fff" />
            <Text style={{ color: '#fff' }}>New chat</Text>
          </HStack>
        </TouchableOpacity>
      </Animated.View>
    );

    const translateY = panY.interpolate({
      inputRange: [-300, 0, 300],
      outputRange: [-50, 0, 50],
      extrapolate: 'clamp',
    });

    return (
      <>
        <Animated.View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ translateY }],
          }}
          {...panResponder.panHandlers}
        >
          <View
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}
            flex={1}
          >
            <Box
              style={{
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              height={hp('10%')}
              justifyContent={'flex-end'}
              bgColor={'#fff'}
              width={'100%'}
            >
              <HStack
                alignItems={'center'}
                justifyContent={'space-between'}
                paddingBottom={1}
              >
                <View>
                  <HeaderMenu />
                </View>

                <Text color={'#000'} fontWeight={700} fontSize={16}>
                  Chats
                </Text>
                <Avatar
                  bgColor={'#000'}
                  marginRight={3}
                  source={{
                    uri: loginStore.userAvatar,
                  }}
                >
                  <Text>MP</Text>
                </Avatar>
              </HStack>
            </Box>
            <View paddingTop={100}>
              {showCreateRoom && createRoomBlock}
              <HStack
                style={{
                  width: '100%',

                  flexDirection: 'row',
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingBottom: 18,
                }}
                space={10}
              >
                {buttons.map((item) => {
                  if (!item.show) return null;
                  return (
                    <View key={item.key} style={{ flex: 1 }}>
                      <TouchableOpacity
                        accessibilityLabel={item.accessibilityLabel}
                        onPress={async () => await onTabPress(item.key)}
                        style={{
                          paddingBottom: 10,
                          position: 'relative',
                        }}
                      >
                        <VStack space={1.5}>
                          <HStack
                            space={2}
                            justifyContent={'center'}
                            alignItems={'center'}
                          >
                            <Text
                              style={{
                                color: '#0052CD',
                                fontFamily: highlightIcon(item.key)
                                  ? textStyles.openSansBold
                                  : textStyles.openSansRegular,
                              }}
                            >
                              {item.name}
                            </Text>
                            {!!chatStore.unreadMessagesForGroups[item.key] && (
                              <View
                                style={{
                                  paddingRight: 8,
                                  paddingLeft: 8,
                                  borderRadius: 5,
                                  height: 16,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  backgroundColor: '#0052CD',
                                }}
                              >
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontSize: 9,
                                    position: 'absolute',
                                    top: -3,
                                    textAlign: 'center',
                                  }}
                                >
                                  {chatStore.unreadMessagesForGroups[item.key]}
                                </Text>
                              </View>
                            )}
                          </HStack>
                          <View
                            height={0.5}
                            backgroundColor={
                              highlightIcon(item.key) ? '#0052CD' : '#E8EDF2'
                            }
                            borderRadius={5}
                          ></View>
                        </VStack>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </HStack>
            </View>
            <FlatList
              nestedScrollEnabled={true}
              style={{ width: '100%' }}
              data={sortedRoomsList}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false },
              )}
              // onScrollBeginDrag={() => setShowCreateButton(true)}
              // onScrollEndDrag={() => setShowCreateButton(false)} //
              // ListFooterComponent={<View style={{ height: 80 }} />}
              // onEndReached={() => setShowCreateButton(true)}
              onEndReachedThreshold={0.1} //
              keyExtractor={(item: any) => `${item.jid}`}
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
        </Animated.View>
      </>
    );
  },
);
