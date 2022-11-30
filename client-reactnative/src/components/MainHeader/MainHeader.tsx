/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import {useNavigation, useRoute} from '@react-navigation/native';
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
import {ROUTES} from '../../constants/routes';
import {alpha} from '../../helpers/aplha';

export const MainHeader = observer(() => {
  const {chatStore} = useStores();
  const navigation = useNavigation();
  const route = useRoute();
  const buttons = [
    {
      key: ROOM_KEYS.official,
      icon: 'star',
      show: true,
    },
    {
      key: ROOM_KEYS.private,
      icon: 'people',
      show: true,
    },
    // {
    //   key: ROOM_KEYS.groups,
    //   icon: 'compass',
    //   show: route.name === ROUTES.CHAT,
    // },
  ];
  const onTabPress = (key: string) => {
    if (key === ROOM_KEYS.groups) {
      chatStore.toggleMetaNavigation(true);

      return;
    }
    chatStore.changeActiveChats(key);
    navigation.navigate(ROUTES.ROOMSLIST);
  };

  const highlightIcon = (id: string) => {
    return chatStore.activeChats === id;
  };
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
        {buttons.map(item => {
          if (!item.show) return null;
          return (
            <VStack key={item.key}>
              <TouchableOpacity onPress={() => onTabPress(item.key)}>
                <Ionicons
                  name={item.icon}
                  size={30}
                  color={
                    !highlightIcon(item.key) ? 'rgba(255,255,255,0.6)' : 'white'
                  }
                />
              </TouchableOpacity>
              {!!chatStore.unreadMessagesForGroups[item.key] && (
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
                    {chatStore.unreadMessagesForGroups[item.key]}
                  </Badge>
                </View>
              )}
            </VStack>
          );
        })}

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
