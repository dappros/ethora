import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RoomListItemIcon} from './RoomListItemIcon';
import {ROUTES} from '../../constants/routes';
import {Box, HStack, Pressable, Spacer, Text, VStack} from 'native-base';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {observer} from 'mobx-react-lite';
import {queryRoomAllMessages} from '../realmModels/messages';

interface RoomListProps {
  jid: string;
  name: string;
  counter: number;
  lastMessageTime: any;
  lastUserText: string;
  lastUserName: string;
  participants: string;
  muted: boolean;
  drag: any;
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
    muted,
    drag,
  }: RoomListProps) => {
    const navigation = useNavigation();
    const navigateToChat = async () => {
      navigation.navigate(ROUTES.CHAT, {chatJid: jid, chatName: name});
    };

    return (
      <Box
        borderBottomWidth="1"
        _dark={{
          borderColor: 'gray.600',
        }}
        borderColor="coolGray.200"
        pl="4"
        pr="5"
        py="2">
        <Pressable onLongPress={drag} onPress={navigateToChat}>
          <HStack space={3} justifyContent="space-between">
            <RoomListItemIcon name={name} counter={counter} />
            <VStack>
              <Text
                _dark={{
                  color: 'warmGray.50',
                }}
                color="coolGray.800"
                bold>
                {name}
              </Text>
              <HStack space={1}>
                <Text
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
                  {lastUserText}
                </Text>
              </HStack>
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
        </Pressable>
      </Box>
    );
  },
);
