import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RoomListItemIcon} from './RoomListItemIcon';
import {ROUTES} from '../../constants/routes';
import {Box, HStack, Text, View, VStack} from 'native-base';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {observer} from 'mobx-react-lite';
import {Animated, Easing, TouchableOpacity} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {LeftActions, RightActions} from './LeftAndRightDragAction';
import { textStyles } from '../../../docs/config';

interface RoomListProps {
  isActive: boolean;
  jid: string;
  name: string;
  counter: number;
  lastMessageTime: any;
  lastUserText: string;
  lastUserName: string;
  participants: string;
  drag: any;
  renameChat: any;
  leaveChat: any;
  unsubscribeFromRoom: any;
  movingActive: boolean;
}

export const RoomListItem = observer(
  ({
    jid,
    name,
    counter,
    lastMessageTime,
    lastUserText,
    lastUserName,
    participants,
    drag,
    renameChat,
    unsubscribeFromRoom,
    leaveChat,
    movingActive,
  }: RoomListProps) => {
    const [animation, setAnimation] = useState(new Animated.Value(0));

    const navigation = useNavigation();

    const defaultText = 'Tap to view and join the conversation.';

    const navigateToChat = () => {
      navigation.navigate(ROUTES.CHAT, {chatJid: jid, chatName: name});
    };

    const swipeRef = useRef();

    const stopAnimation = () => {
      // Animated.sequence(animation).stop();
      animation.stopAnimation();
      animation.setValue(0);
    };
    const startShake = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(animation, {
            toValue: -1,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(animation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ]),
      ).start();
    };

    useEffect(() => {
      if (movingActive) {
        startShake();
      } else {
        stopAnimation();
      }
    }, [movingActive]);

    return (
      <Swipeable
        enabled={movingActive}
        ref={swipeRef}
        renderLeftActions={() => (
          <LeftActions
            jid={jid}
            name={name}
            renameChat={renameChat}
            swipeRef={swipeRef}
            unsubscribeFromRoom={unsubscribeFromRoom}
          />
        )}
        renderRightActions={() => (
          <RightActions jid={jid} leaveChat={leaveChat} swipeRef={swipeRef} />
        )}>
        <Animated.View style={{transform: [{translateX: animation}]}}>
          <Box
            borderBottomWidth="1"
            _dark={{
              borderColor: 'gray.600',
            }}
            borderColor="coolGray.200"
            pl="4"
            pr="5"
            py="2">
            <TouchableOpacity
              onLongPress={() => movingActive && drag()}
              onPress={navigateToChat}>
              <HStack  justifyContent="space-between">
                <View justifyContent={"center"} flex={0.1}>
                  <RoomListItemIcon name={name} counter={counter} />
                </View>

                <VStack justifyContent={"center"} flex={0.7} >
                  <Text
                    fontSize={hp('2%')}
                    fontFamily={textStyles.semiBoldFont}
                    _dark={{
                      color: 'warmGray.50',
                    }}
                    color="coolGray.800">
                    {name}
                  </Text>
                  {name && lastUserName && lastUserText ? (
                    <HStack flex={1} alignItems={"center"} space={1}>
                      <Box>
                        <Text
                        fontFamily={textStyles.semiBoldFont}
                        fontSize={hp('1.7%')}
                        color="coolGray.500"
                        _dark={{
                          color: 'warmGray.100',
                        }}>
                          {lastUserName && lastUserName + ':'}
                        </Text>
                      </Box>

                      <Box>
                        <Text
                        fontFamily={textStyles.regularFont}
                        fontSize={hp('1.5%')}
                        color="coolGray.600"
                        _dark={{
                          color: 'warmGray.100',
                        }}>
                          {lastUserText.length > 10 ? lastUserText.slice(0,10) + '...' : lastUserText}
                        </Text>
                      </Box>
                    </HStack>
                  ) : (
                    <Text
                    color="coolGray.600"
                    _dark={{
                      color: 'warmGray.200',
                    }}
                    
                    fontFamily={textStyles.regularFont}
                    >{defaultText}</Text>
                  )}
                </VStack>

                <VStack justifyContent={"center"} flex={0.12}>
                  <HStack justifyContent={'flex-end'} alignItems={'center'}>
                    <MaterialIcon
                      name="group"
                      color={'black'}
                      size={hp('2%')}
                      style={{
                        marginRight: hp('0.9%'),
                        marginLeft: hp('0.4%'),
                      }}
                    />
                    <Text
                    _dark={{
                      color: 'warmGray.200',
                    }}
                    fontFamily={textStyles.semiBoldFont} 
                    color={'black'}>{participants}</Text>
                  </HStack>
                  <Box alignItems={"flex-end"}>
                    <Text
                      fontSize="xs"
                      _dark={{
                        color: 'warmGray.50',
                      }}
                      fontFamily={textStyles.mediumFont} 
                      color="black">
                      {lastMessageTime}
                    </Text>
                  </Box>
                </VStack>
              </HStack>
            </TouchableOpacity>
          </Box>
        </Animated.View>
      </Swipeable>
    );
  },
);
