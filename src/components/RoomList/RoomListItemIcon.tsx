/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import { commonColors, textStyles } from '../../../docs/config';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Text, View } from 'native-base';

export const RoomListItemIcon = ({name,counter}:{name:string,counter:number}) => {
  return (
    <ImageBackground imageStyle={{borderRadius: 5}} style={styles.imageBg}>
      <View style={styles.chatHomeItemIcon}>
        <Text style={styles.fullName}>
          {name&&name[0] + (name[1] ? name[1] : '')}
        </Text>
        {counter ? (
            <View style={styles.counterContainer}>
              <View style={styles.counterInnerContainer}>
                <Text style={styles.counterText}>{counter}</Text>
              </View>
            </View>
          ) : null}
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
      fontFamily: textStyles.boldFont,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  counterContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
    zIndex: 1,
    alignSelf: 'flex-end',
    height: hp('5.5%'),
    width: hp('5.5%'),
    marginTop: hp('1%'),
    marginRight: hp('0.5'),
    position:'absolute'
  },
  counterInnerContainer: {
    height: hp('2.1%'),
    width: hp('2.1%'),
    borderRadius: hp('2.1') / 2,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontFamily: textStyles.regularFont,
    fontSize: hp('1%'),
    color: '#FFFFFF',
  },
});
