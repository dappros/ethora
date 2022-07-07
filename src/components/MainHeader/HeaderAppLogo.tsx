/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import {useNavigation} from '@react-navigation/native';
import {Image, Pressable, View} from 'native-base';
import React from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { logoPath } from '../../../docs/config';
import {ROUTES} from '../../constants/routes';
import { useStores } from '../../stores/context';

let counter = 0;

export const HeaderAppLogo = () => {
  const navigation = useNavigation();
  const {debugStore} = useStores()
  const onPress = () => {
    navigation.navigate(ROUTES.CHAT);
    counter+=1;
    if(counter === 3) {
      debugStore.toggleDebugMode(true)
    }
  };
  return (
    <Pressable onPress={onPress}>
      <View>
        <Image style={{width: hp('7%'), height: hp('7%')}} source={logoPath} />
      </View>
    </Pressable>
  );
};
