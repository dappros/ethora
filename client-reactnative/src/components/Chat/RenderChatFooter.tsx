/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import {Box, HStack, Text, View} from 'native-base';
import React, {useEffect} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TypingAnimation} from 'react-native-typing-animation';
import {textStyles} from '../../../docs/config';
import SimpleIcons from 'react-native-vector-icons/SimpleLineIcons';
interface RenderChatFooterProps {
  fileUploadProgress: number;
  setFileUploadProgress: any;
  allowIsTyping: boolean;
  isTyping: boolean;
  composingUsername: string;
  isReply?: boolean;
  replyUserName?: string;
  replyMessage?: string;
  closeReply?: any;
}

const RenderChatFooter = (props: RenderChatFooterProps) => {
  const boxHeight = useSharedValue(0);
  const {
    fileUploadProgress,
    setFileUploadProgress,
    allowIsTyping,
    isTyping,
    composingUsername,
    isReply,
    replyUserName,
    replyMessage,
    closeReply
  } = props;
  const boxAnimation = useAnimatedStyle(() => {
    return {
      height: withTiming(boxHeight.value, {duration: 350}),
    };
  });
  useEffect(() => {
    if (!!isTyping || !!fileUploadProgress) {
      boxHeight.value = hp('5.5%');
    }else if(!!isReply) {
      boxHeight.value= hp('6%')
    }
    else {
      boxHeight.value = 0;
    }

    return () => {};
  }, [isTyping, fileUploadProgress, isReply]);


  setTimeout(() => {
    if (fileUploadProgress === 100) {
      setFileUploadProgress(0);
    }
  }, 5000);
  return (
    <Animated.View style={[boxAnimation]}>
      {isReply?
      <HStack bg={"white"} h="100%">
        <Box flex={0.019} bg={"green.600"} width={wp("2%")}>
          
        </Box>
        <Box paddingLeft={3} flex={0.85}>
          <Text
          fontSize={hp('2%')}
          fontFamily={textStyles.boldFont}
          >{replyUserName}</Text>
          <Text
          fontFamily={textStyles.regularFont}
          >{replyMessage}</Text>
        </Box>

        <Box
        alignItems={"center"}
        justifyContent={"center"}
        flex={0.1}>
          <Pressable onPress={()=>closeReply(false)}>
            <SimpleIcons name='close' size={hp("3%")} />
          </Pressable>
        </Box>
      </HStack>
      :
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

      }
    </Animated.View>
  );
};

export default RenderChatFooter;

const styles = StyleSheet.create({
  container: {},
});
