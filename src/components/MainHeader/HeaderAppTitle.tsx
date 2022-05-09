import {useNavigation} from '@react-navigation/native';
import {Box, Text} from 'native-base';
import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import { appTitle } from '../../../docs/config';
import {ROUTES} from '../../constants/routes';

export const HeaderAppTitle = () => {
  const navigation = useNavigation();
  const onTitlePress = () => {
    navigation.navigate(ROUTES.ROOMSLIST);
  };
  return (
    <Box ml={2} alignItems={'center'} justifyContent={'center'}>
      <Pressable onPress={onTitlePress} style={styles.appTitleButton}>
        <Text fontSize={'2xl'} color={'white'}>
          {appTitle}
        </Text>
      </Pressable>
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
