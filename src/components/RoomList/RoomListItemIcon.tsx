import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import { commonColors } from '../../../docs/config';

export const RoomListItemIcon = ({name}) => {
  return (
    <ImageBackground imageStyle={{borderRadius: 5}} style={styles.imageBg}>
      <View style={styles.chatHomeItemIcon}>
        <Text style={styles.fullName}>
          {name&&name[0] + (name[1] ? name[1] : '')}
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  chatHomeItemIcon: {
    borderWidth: 1,
    borderColor: commonColors.primaryDarkColor,
    backgroundColor: commonColors.primaryDarkColor,
    height: heightPercentageToDP('5.54%'),
    width: heightPercentageToDP('5.54%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    borderRadius: heightPercentageToDP('0.7%'),
  },
  imageBg: {
    height: heightPercentageToDP('5.5%'),
    width: heightPercentageToDP('5.5%'),
    // flex: 1,
    borderRadius: 5,
    // position: 'absolute',
  },
  fullName: {
    color: 'white',
    marginRight: 3,
    //   fontFamily: mediumRobotoFont,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
