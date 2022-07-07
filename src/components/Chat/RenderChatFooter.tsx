/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import {HStack, Text, View} from 'native-base';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TypingAnimation} from 'react-native-typing-animation';
import {textStyles} from '../../../docs/config';

interface RenderChatFooterProps {
  fileUploadProgress: number;
  setFileUploadProgress: any;
  allowIsTyping: boolean;
  isTyping: boolean;
  composingUsername: string;
}

const RenderChatFooter = (props: RenderChatFooterProps) => {
  const {
    fileUploadProgress,
    setFileUploadProgress,
    allowIsTyping,
    isTyping,
    composingUsername,
  } = props;
  setTimeout(() => {
    if (fileUploadProgress === 100) {
      setFileUploadProgress(0);
    }
  }, 5000);
  return (
    <HStack height={hp('5.5%')} width={wp('100%')} bgColor={'transparent'}>
      <View justifyContent={'flex-end'} bg={'transparent'} flex={0.6}>
        {allowIsTyping && isTyping ? (
          <HStack bg={'transparent'}>
            <View bg={'transparent'} marginRight={30}>
              <TypingAnimation dotColor="grey" />
            </View>
            <Text
              color={'black'}
              fontFamily={textStyles.regularFont}
              fontSize={hp('1.4%')}>
              {composingUsername}
            </Text>
          </HStack>
        ) : null}
      </View>
      <View alignItems={'flex-start'} justifyContent={'center'} flex={0.4}>
        {fileUploadProgress ? (
          <Text
            color={'grey'}
            fontFamily={textStyles.regularFont}
            fontSize={hp('1.4%')}>
            Uploading: {fileUploadProgress}%
          </Text>
        ) : null}
      </View>
    </HStack>
  );
};

export default RenderChatFooter;

const styles = StyleSheet.create({
  container: {},
});
