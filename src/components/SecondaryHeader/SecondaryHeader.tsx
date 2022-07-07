/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, HStack, Text} from 'native-base';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {appVersion, commonColors, textStyles} from '../../../docs/config';

interface SecondaryHeaderProps {
  title: string;
  isQR?: boolean;
  type?: string;
  showVersion?: boolean;
  onQRPressed?: any;
}

const SecondaryHeader = (props: SecondaryHeaderProps) => {
  const navigation = useNavigation();
  const onArrowClick = () => {
    navigation.goBack();
  };
  return (
    <Box h={60} justifyContent={'center'} bg={commonColors.primaryDarkColor}>
      <HStack justifyContent={'space-between'} alignItems={'center'}>
        <TouchableOpacity onPress={onArrowClick}>
          <Box flexDirection={'row'} alignItems={'center'}>
            <AntIcon
              name={'arrowleft'}
              style={{marginRight: 5, marginLeft: 5}}
              size={hp('3%')}
              color={'white'}
            />
            <Text
              fontFamily={textStyles.semiBoldFont}
              fontSize={hp('2.2%')}
              color={'white'}>
              {props.title}
            </Text>
          </Box>
        </TouchableOpacity>
        {props.isQR ? (
          <TouchableOpacity
            onPress={props.onQRPressed}
            style={{marginRight: 10}}>
            <FontAwesomeIcon name="qrcode" color="#FFFF" size={hp('3.7%')} />
          </TouchableOpacity>
        ) : null}
        {props.type === 'transaction' ? (
          <TouchableOpacity
            onPress={() => console.log('')}
            style={{flex: 0.2, alignItems: 'flex-end', marginRight: 10}}>
            <AntIcon name="filter" color="#FFFF" size={hp('3%')} />
          </TouchableOpacity>
        ) : null}
        {props.showVersion && (
          <Text style={{color: 'white', position: 'absolute', right: 30}}>
            Version: {appVersion}
          </Text>
        )}
      </HStack>
    </Box>
  );
};

export default SecondaryHeader;
