/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import {Box, Image, Spinner, Text, VStack} from 'native-base';
import {Pressable} from 'react-native';
import {ROUTES} from '../../constants/routes';
import {useStores} from '../../stores/context';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {coinImagePath, commonColors, textStyles} from '../../../docs/config';

export const HeaderBalanceButton = observer(() => {
  const {walletStore} = useStores();
  const navigation = useNavigation();
  const onButtonPress = () => {
    navigation.navigate(ROUTES.PROFILE);
  };
  return (
    <Box
      background={'white'}
      shadow="7"
      rounded={'sm'}
      alignItems={'center'}
      justifyContent={'center'}
      width={50}
      height={50}>
      <Pressable style={{justifyContent: 'center', alignItems: 'center'}} onPress={onButtonPress}>
        <Box>
          <Image
            alt="coin icon"
            style={{width: hp('3%'), height: hp('3%')}}
            source={coinImagePath}
          />
        </Box>
        <VStack alignItems="center" justifyContent={'center'}>
          {walletStore.coinBalance ? (
            <Text color={'black'} fontFamily={textStyles.boldFont}>
              {walletStore.coinBalance}
            </Text>
          ) : (
            <Spinner />
          )}
        </VStack>
      </Pressable>
    </Box>
  );
});
