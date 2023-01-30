import {VStack, Input} from 'native-base';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  commonColors,
  textStyles,
  itemsTransfersAllowed,
  coinsMainName,
} from '../../../../docs/config';
import {alpha} from '../../../helpers/aplha';
import {useStores} from '../../../stores/context';
import ReportAndBlockButton from './ReportAndBlockButton';
import SendItem from './SendItem';
import TokenTransfer from './TokenTransfer';
import {TransferModalButton} from './TransferModalButton';
import Modal from 'react-native-modal';
import {showError} from '../../Toast/toast';

interface IDataForTransfer {
  name: string;
  message_id: string;
  senderName: string;
  walletFromJid: string;
}

export interface ITransferModal {
  dataForTransfer: IDataForTransfer;
  modalOpen: boolean;
  closeModal: () => void;
}

export const TransferModal: React.FC<ITransferModal> = ({
  dataForTransfer,
  modalOpen,
  closeModal,
}) => {
  const {walletStore, loginStore} = useStores();

  const [allowedEnterCustomAmount, setAllowedEnterCustomAmount] =
    useState(false);
  const [customTransferAmount, setCustomTransferAmount] = useState('');

  const tokenTransferFunc = async (tokenAmount: string | number) => {
    if (tokenAmount <= 0) {
      showError('error', 'Amount must be greater than 0');
      return;
    }
    if (!walletStore.coinBalance || +tokenAmount <= walletStore.coinBalance) {
      showError('error', 'Not enough tokens');
      return;
    }
    const receiverName = dataForTransfer.name;
    const receiverMessageId = dataForTransfer.message_id;
    const senderName = dataForTransfer.senderName;
    const fromWalletAddress = loginStore.initialData.walletAddress;
    const walletAddress = dataForTransfer.walletFromJid;

    const bodyData = {
      toWallet: walletAddress,
      amount: tokenAmount,
      tokenId: 'ERC20',
      tokenName: coinsMainName,
    };

    await walletStore.transferTokens(
      bodyData,
      loginStore.userToken,
      fromWalletAddress,
      senderName,
      receiverName,
      receiverMessageId,
      false,
    );
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
      isVisible={modalOpen}>
      <View
        w={wp('70%')}
        // h={hp('100%')}
        bg={'#ffff'}
        shadow="2"
        justifyContent={'center'}
        alignItems={'center'}
        borderRadius={10}
        padding={2}>
        {allowedEnterCustomAmount ? (
          <VStack>
            <Text
              style={{
                color: commonColors.primaryColor,
                fontFamily: textStyles.semiBoldFont,
                textAlign: 'center',
              }}>
              Enter Your Amount
            </Text>
            <View style={{paddingHorizontal: 5, marginVertical: 10}}>
              <Input
                maxLength={15}
                keyboardType="numeric"
                fontFamily={textStyles.lightFont}
                fontSize={hp('1.6%')}
                color={'black'}
                value={customTransferAmount}
                onChangeText={setCustomTransferAmount}
                placeholder="Enter transfer amount"
                placeholderTextColor={commonColors.primaryDarkColor}
                borderColor={commonColors.primaryDarkColor}
                backgroundColor={alpha(commonColors.primaryDarkColor, 0.1)}
              />
            </View>
            <TransferModalButton
              title={'Send'}
              onPress={() => tokenTransferFunc(customTransferAmount)}
            />
          </VStack>
        ) : (
          <>
            <View style={styles.tokenTransferContainer}>
              <TokenTransfer
                name={dataForTransfer.name}
                tokenAmount={tokenAmount}
                tokenTransferFunc={tokenTransferFunc}
                onCustomAmountPress={() => setAllowedEnterCustomAmount(true)}
              />
            </View>

            {walletStore.nftItems.filter(item => !item.external).length > 0 &&
              itemsTransfersAllowed && (
                <>
                  <Seperator />

                  <SendItem
                    title={'Send Items'}
                    onPress={() => {
                      console.log('clickd');
                      setDisplayItems(true);
                    }}
                  />
                </>
              )}
            {!!walletStore.collections.length && (
              <>
                <Seperator />

                <SendItem
                  title={'Send Collections'}
                  onPress={() => {
                    setDisplayCollections(true);
                  }}
                />
              </>
            )}
            <Seperator />
            <TransferModalButton
              title={'Direct Message'}
              onPress={onDirectMessagePress}
            />
            {chatStore.roomRoles[extraData.chatJid] !== 'participant' && (
              <View style={{width: wp('70%'), alignItems: 'center'}}>
                <Seperator />
                <ReportAndBlockButton
                  onPress={() =>
                    handleBanUser(extraData.name, extraData.senderName)
                  }
                  text={'Kick this user'}
                  style={{backgroundColor: '#a32f2b'}}
                />
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: 'center',
                    lineHeight: 10,
                    // marginTop: 5,
                    color: '#5A5A5A',
                  }}>
                  Remove user from this room.
                </Text>
              </View>
            )}
          </>
        )}
        {!allowedEnterCustomAmount && (
          <View style={{width: wp('70%'), alignItems: 'center'}}>
            <Seperator />
            <ReportAndBlockButton
              onPress={onBlackListPress}
              text={'Block this user'}
              style={{backgroundColor: commonColors.primaryColor}}
            />

            <Text
              style={{
                fontSize: 10,
                textAlign: 'center',
                lineHeight: 10,
                // marginTop: 5,
                paddingHorizontal: 1,
                color: '#5A5A5A',
              }}>
              Stop seeing this user.
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});
