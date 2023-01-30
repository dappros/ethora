import {View} from 'native-base';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {TokensOrItemsTransfer} from '../TransactionModal/TokensOrItemsTransfer';
import ChangeUserDescriptionModal from './ChangeRoomDescriptionModal';
import {ChatLongTapUserActions} from './ChatLongTapUserActions';
import {IDataForTransfer} from './types';

export interface IChatLongTapModal {
  open: boolean;
  onClose: () => void;
  dataForTransfer: IDataForTransfer;
}

export const ChatLongTapModal: React.FC<IChatLongTapModal> = ({
  open,
  onClose,
  dataForTransfer,
}) => {
  const [allowedEnterCustomAmount, setAllowedEnterCustomAmount] =
    useState(false);

  const closeModal = () => {
    onClose();
    setAllowedEnterCustomAmount(false);
  };
  return (
    <Modal
      onBackdropPress={closeModal}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onDismiss={closeModal}
      isVisible={open}>
      <View
        shadow={'2'}
        borderRadius={'10'}
        pb={'1'}
        style={{
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TokensOrItemsTransfer
          closeModal={closeModal}
          allowedEnterCustomAmount={allowedEnterCustomAmount}
          setAllowedEnterCustomAmount={setAllowedEnterCustomAmount}
          dataForTransfer={dataForTransfer}
        />
        {!allowedEnterCustomAmount && (
          <ChatLongTapUserActions
            closeModal={closeModal}
            dataForTransfer={dataForTransfer}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});
