import {Box, Image, Modal} from 'native-base';
import React from 'react';
import {widthPercentageToDP} from 'react-native-responsive-screen';

export const ChatMediaModal = ({open, url, type, onClose}) => {
  const renderModalContent = () => {
    if (type === 'image/jpeg' || type === 'image/png') {
      return (
        <Image alt="image" source={{uri: url}} w={'100%'} height={'100%'} />
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
      <Box w={widthPercentageToDP('90%')} h="90%">
        <Modal.CloseButton color={'white'} />
        {renderModalContent()}
      </Box>
    </Modal>
  );
};
