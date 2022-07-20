/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import {Box, HStack, Image, Modal} from 'native-base';
import React, {useState} from 'react';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {imageMimetypes, videoMimetypes} from '../../constants/mimeTypes';
import VideoPlayer from 'react-native-video-player';
import {
  TouchableOpacity,
  Image as NativeImage,
  Dimensions,
  Text,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import {coinImagePath, textStyles} from '../../../docs/config';
import {observer} from 'mobx-react-lite';
import {useStores} from '../../stores/context';
import {botTypes} from '../../constants/botTypes';
import {botStanza} from '../../xmpp/stanzas';
import {underscoreManipulation} from '../../helpers/underscoreLogic';
const {width, height: windowHeight} = Dimensions.get('window');

const ModalActionButton = ({text, action}) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={action}>
      <HStack
        justifyContent={'center'}
        alignItems={'center'}
        bgColor={'white'}
        borderRadius={'md'}
        padding={'1'}
        width={'full'}>
        <Image
          alt="coin"
          source={coinImagePath}
          style={{width: 30, height: 30}}
        />
        <Text style={{color: 'black', fontFamily: textStyles.mediumFont, fontSize: 20}}>{text}</Text>
      </HStack>
    </TouchableOpacity>
  );
};

export const ChatMediaModal = observer(
  ({open, url, type, onClose, messageData}) => {
    const [height, setHeight] = useState(0);
    const {chatStore, loginStore} = useStores();
    const renderModalContent = () => {
      if (imageMimetypes[type]) {
        const modalButtonAction = () => {
          const manipulatedWalletAddress = underscoreManipulation(
            loginStore.initialData.walletAddress,
          );
          const data = {
            attachmentId: messageData.attachmentId,
            botType: botTypes.deployBot,
          };
          botStanza(
            manipulatedWalletAddress,
            messageData.roomJid,
            data,
            chatStore.xmpp,
          );
        };
        return (
          <View>
            <FastImage
              style={{
                width: '100%',
                height:
                  height > windowHeight - 50 ? windowHeight - 120 : height,
              }}
              source={{
                uri: url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
              onLoad={evt =>
                setHeight(
                  (evt.nativeEvent.height / evt.nativeEvent.width) * width, // By this, you keep the image ratio
                )
              }
            />
            {!!messageData.attachmentId && (
              <ModalActionButton
                action={modalButtonAction}
                text={messageData.attachmentId ? 'Wrap' : ''}
              />
            )}
          </View>
        );
      }
      if (videoMimetypes[type]) {
        return (
          <TouchableOpacity
            activeOpacity={1}
            style={{height: height, width: '100%'}}>
            <VideoPlayer
              video={{
                uri: url,
              }}
              autoplay
              videoWidth={wp('100%')}
              videoHeight={height}
              onLoad={e =>
                setHeight(
                  (e.naturalSize.height / e.naturalSize.width) * width, // By this, you keep the image ratio
                )
              }
            />
          </TouchableOpacity>
        );
      }
      return null;
    };
    return (
      <Modal
        isOpen={open}
        onClose={onClose}
        _backdrop={{
          bg: 'black',
        }}>
        <Box w={widthPercentageToDP('90%')}>
          <TouchableOpacity
            style={{position: 'absolute', right: 0, top: -30, zIndex: 9999}}
            onPress={onClose}>
            <AntDesignIcons name="close" size={30} color={'white'} />
          </TouchableOpacity>
          {renderModalContent()}
        </Box>
      </Modal>
    );
  },
);
