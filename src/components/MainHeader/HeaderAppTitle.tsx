import {useNavigation} from '@react-navigation/native';
import {Box, Text} from 'native-base';
import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import { appTitle, textStyles } from '../../../docs/config';
import {ROUTES} from '../../constants/routes';
import {useStores} from '../../stores/context';
let counter = 0;
export const HeaderAppTitle = () => {
  const navigation = useNavigation();
  const {debugStore} = useStores();
  const onTitlePress = () => {
    navigation.navigate(ROUTES.ROOMSLIST);
    counter += 1;
    if (counter === 3) {
      debugStore.toggleDebugMode(true);
    }
  };
  return (
    <Box ml={2} alignItems={'center'} justifyContent={'center'}>
      <Pressable onPress={onTitlePress} style={styles.appTitleButton}>
        <Text
        fontFamily={textStyles.boldFont}
        fontSize={'2xl'}
        color={'white'}>
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
