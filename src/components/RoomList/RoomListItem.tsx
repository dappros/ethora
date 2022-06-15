import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RoomListItemIcon} from './RoomListItemIcon';
import {ROUTES} from '../../constants/routes';
import {Box, HStack, Pressable, Spacer, Text, VStack} from 'native-base';
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
              <HStack space={3} justifyContent="space-between">
                <RoomListItemIcon name={name} counter={counter} />
                <VStack>
                  <Text
                    fontFamily={textStyles.semiBoldFont}
                    _dark={{
                      color: 'warmGray.50',
                    }}
                    color="coolGray.800">
                    {name}
                  </Text>
                  {name && lastUserName && lastUserText ? (
                    <HStack space={1}>
                      <Text
                      fontFamily={textStyles.regularFont}
                        color="coolGray.600"
                        _dark={{
                          color: 'warmGray.200',
                        }}>
                        {lastUserName && lastUserName + ':'}
                      </Text>
                      <Text
                        color="coolGray.600"
                        _dark={{
                          color: 'warmGray.200',
                        }}>
                        {lastUserText.length > 10 ? lastUserText.slice(0,10) + '...' : lastUserText}
                      </Text>
                    </HStack>
                  ) : (
                    <Text
                    fontFamily={textStyles.regularFont}
                    >{defaultText}</Text>
                  )}
                </VStack>
                <Spacer />
                <VStack>
                  <Box>
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
                      <Text color={'black'}>{participants}</Text>
                    </HStack>
                  </Box>
                  <Text
                    fontSize="xs"
                    _dark={{
                      color: 'warmGray.50',
                    }}
                    color="coolGray.800"
                    alignSelf="flex-start">
                    {lastMessageTime}
                  </Text>
                </VStack>
              </HStack>
            </TouchableOpacity>
          </Box>
        </Animated.View>
      </Swipeable>
    );
  },
);
