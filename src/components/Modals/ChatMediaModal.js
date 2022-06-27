import {Box, Image, Modal} from 'native-base';
import React, {useState} from 'react';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {imageMimetypes, videoMimetypes} from '../../constants/mimeTypes';
import VideoPlayer from 'react-native-video-player';
import {TouchableOpacity, Image as NativeImage, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
const {width, height: windowHeight} = Dimensions.get('window');

export const ChatMediaModal = ({open, url, type, onClose}) => {
  const [height, setHeight] = useState(0);
  const renderModalContent = () => {
    if (imageMimetypes[type]) {
      return (
        <FastImage
          style={{
            width: '100%',
            height: height > windowHeight - 50 ? windowHeight - 120 : height,
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
};
