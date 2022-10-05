/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import {useNavigation} from '@react-navigation/native';
import {Box, HStack, Image, Pressable, Text, View, VStack} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { coinsMainName, commonColors, navbarLogoShow } from '../../../docs/config';
import { useStores } from '../../stores/context';
import {HeaderAppLogo} from './HeaderAppLogo';
import {HeaderAppTitle} from './HeaderAppTitle';
import {HeaderBalanceButton} from './HeaderBalanceButton';
import {HeaderMenu} from './HeaderMenu';

export const MainHeader = () => {
  return (
    <Box height={hp('9%')} bgColor={commonColors.primaryColor}>
      <HStack space={3} alignItems="center" justifyContent="space-between">
        <VStack>
          {!!navbarLogoShow && <HeaderAppLogo />}
          <HeaderAppTitle />
        </VStack>
        <VStack>
          <HStack>
            <HeaderBalanceButton />
            <HeaderMenu />
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  appTitleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
