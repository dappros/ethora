import {Box, Text} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { commonColors } from '../../../docs/config';

export const UserProfileInitials = ({firstname, lastname}:any) => {
  return (
    <Box
      bg={commonColors.primaryColor}
      justifyContent={'center'}
      alignItems={'center'}
      rounded={'full'}
      style={styles.container}>
      <Text fontSize={28} fontWeight={'bold'} color={'white'}>
        {firstname[0] + lastname[0]}
      </Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    width: hp('10.46%'),
    height: hp('10.46%'),
  },
});
