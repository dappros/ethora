import {useNavigation} from '@react-navigation/native';
import {Image, Pressable, View} from 'native-base';
import React from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { logoPath } from '../../../docs/config';
import {ROUTES} from '../../constants/routes';

export const HeaderAppLogo = () => {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate(ROUTES.CHAT);
  };
  return (
    <Pressable onPress={onPress}>
      <View>
        <Image style={{width: hp('7%'), height: hp('7%')}} source={logoPath} />
      </View>
    </Pressable>
  );
};
