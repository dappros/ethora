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
