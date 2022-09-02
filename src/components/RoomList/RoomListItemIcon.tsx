/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from 'react';
import { StyleSheet} from 'react-native';
import { commonColors, textStyles } from '../../../docs/config';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Box, Text, View } from 'native-base';
import { observer } from 'mobx-react-lite';

export const RoomListItemIcon = observer(({name,counter}:{name:string,counter:number}) => {
  return (
      <Box 
        shadow={"2"}
        borderWidth={ 1}
        borderColor={ commonColors.primaryDarkColor}
        backgroundColor={ commonColors.primaryDarkColor}
        height={ hp('5.54%')}
        width={ hp('5.54%')}
        flexDirection={ 'row'}
        justifyContent={ 'center'}
        alignItems={ 'center'}
        textAlign={ 'center'}
        position={ 'relative'}
        borderRadius={ hp('0.7%')}>
        <Text style={styles.fullName}>
          {name&&name[0] + (name[1] ? name[1] : '')}
        </Text>
        {counter ? (
          <Box 
          alignItems={ 'flex-end'}
          justifyContent={ 'flex-end'}
          flex={ 1}
          zIndex={ 1}
          alignSelf={ 'flex-end'}
          height={ hp('5.5%')}
          width={ hp('5.5%')}
          marginTop={ hp('1%')}
          marginRight={ hp('0.5')}
          position={'absolute'}>
            <Box
            shadow={"2"}
            rounded={"full"}
            marginTop={ hp('1%')}
            height={ hp('2.3%')}
            width={ hp('2.3%')}
            backgroundColor={ '#FF0000'}
            alignItems={ 'center'}
            justifyContent={ 'center'}
            >
              <Text style={styles.counterText}>{counter}</Text>
            </Box>
        </Box>
          ) : 
          null
          }
      </Box>
  );
});

const styles = StyleSheet.create({
  chatHomeItemIcon: {
    borderWidth: 1,
    borderColor: commonColors.primaryDarkColor,
    backgroundColor: commonColors.primaryDarkColor,
    height: hp('5.54%'),
    width: hp('5.54%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    borderRadius: hp('0.7%'),
  },
  imageBg: {
    height: hp('5.5%'),
    width: hp('5.5%'),
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
    position:'absolute',
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
    fontSize: hp('1.2%'),
    color: '#FFFFFF',
  },
});
