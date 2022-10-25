/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import {useNavigation} from '@react-navigation/native';
import {
  Badge,
  Box,
  HStack,
  Image,
  Pressable,
  Text,
  View,
  VStack,
} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  coinsMainName,
  commonColors,
  navbarLogoShow,
  ROOM_KEYS,
} from '../../../docs/config';
import {useStores} from '../../stores/context';
import {HeaderAppLogo} from './HeaderAppLogo';
import {HeaderAppTitle} from './HeaderAppTitle';
import {HeaderBalanceButton} from './HeaderBalanceButton';
import {HeaderMenu} from './HeaderMenu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {observer} from 'mobx-react-lite';

export const MainHeader = observer(() => {
  const {chatStore} = useStores();
  return (
    <Box
      height={hp('9%')}
      justifyContent={'center'}
      bgColor={commonColors.primaryColor}>
      <HStack space={3} alignItems="center" justifyContent="space-between">
        <VStack>
          <HStack>
            <HeaderMenu />
          </HStack>
        </VStack>
        <VStack>
          <TouchableOpacity
            onPress={() => chatStore.changeActiveChats(ROOM_KEYS.official)}>
            <Ionicons name="star" size={30} color={'white'} />
          </TouchableOpacity>
          {!!chatStore.unreadMessagesForGroups[ROOM_KEYS.official] && (
            <View style={{position: 'absolute', right: -5, bottom: -4}}>
              <Badge
                colorScheme="danger"
                rounded="full"
                zIndex={1111}
                variant="solid"
                alignSelf="flex-end"
                _text={{
                  fontSize: 8,
                }}>
                {chatStore.unreadMessagesForGroups[ROOM_KEYS.official]}
              </Badge>
            </View>
          )}
        </VStack>
        <VStack>
          <TouchableOpacity
            onPress={() => chatStore.changeActiveChats(ROOM_KEYS.private)}>
            <Ionicons name="people" size={30} color={'white'} />
          </TouchableOpacity>
          {!!chatStore.unreadMessagesForGroups[ROOM_KEYS.private] && (
            <View style={{position: 'absolute', right: -5, bottom: -4}}>
              <Badge
                colorScheme="danger"
                rounded="full"
                zIndex={1111}
                variant="solid"
                alignSelf="flex-end"
                _text={{
                  fontSize: 8,
                }}>
                {chatStore.unreadMessagesForGroups[ROOM_KEYS.private]}
              </Badge>
            </View>
          )}
        </VStack>

        <VStack>
          <TouchableOpacity
            onPress={() => chatStore.changeActiveChats(ROOM_KEYS.groups)}>
            <Ionicons name="compass" size={30} color={'white'} />
          </TouchableOpacity>
          {!!chatStore.unreadMessagesForGroups[ROOM_KEYS.groups] && (
            <View style={{position: 'absolute', right: -5, bottom: -4}}>
              <Badge
                colorScheme="danger"
                rounded="full"
                zIndex={1111}
                variant="solid"
                alignSelf="flex-end"
                _text={{
                  fontSize: 8,
                }}>
                {chatStore.unreadMessagesForGroups[ROOM_KEYS.groups]}
              </Badge>
            </View>
          )}
        </VStack>
        <VStack>
          <HStack marginRight={5}>
            <HeaderBalanceButton />
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
});

const styles = StyleSheet.create({
  appTitleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
