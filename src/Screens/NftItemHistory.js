/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {Component, useEffect, Fragment, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useSelector, connect} from 'react-redux';
import {fetchTransaction, fetchWalletBalance} from '../actions/wallet';

import styles from './style/createNewChatStyle';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomHeader from '../components/shared/customHeader';
import * as token from '../config/token';
import Modal from 'react-native-modal';
import {commonColors, textStyles} from '../../docs/config';
import NftTransactionListTab from '../components/NftTransactionsHistoryComponent';
import {transactionURL} from '../config/routesConstants';
import {httpGet} from '../config/apiService';
import {audioMimetypes, imageMimetypes} from '../constants/mimetypes';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';
import AntIcon from 'react-native-vector-icons/AntDesign';

const {primaryColor, secondaryColor} = commonColors;
const {regularFont, lightFont} = textStyles;

function NftItemHistory(props) {
  const [avatarSource, setAvatarSource] = useState(null);
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSelected, setSelection] = useState(true);
  const allReducers = useSelector(state => state);
  const [itemTransactions, setItemTransactions] = useState([]);

  const [modalData, setModalData] = useState({
    visible: false,
    url: '',
    mimetype: '',
  });
  const {item, userWalletAddress} = props.route.params;
  const getItemTransactionsHistory = async (walletAddress, nftId) => {
    // let axios = require('axios');
    let url =
      allReducers.apiReducer.defaultUrl +
      transactionURL +
      'walletAddress=' +
      walletAddress +
      '&' +
      'nftId=' +
      nftId;
    return await httpGet(url, token);
  };

  useEffect(() => {
    setAvatarSource({uri: item.nftFileUrl});
    getItemTransactionsHistory(userWalletAddress, item.nftId).then(res => {
      const allTransactions = res.data.items.map(item => {
        if (item.from === userWalletAddress && item.from !== item.to) {
          // balance = balance;
          item.balance = item.senderBalance + '/' + item.nftTotal;
        } else if (item.from === item.to) {
          item.balance = item.receiverBalance + '/' + item.nftTotal;
        } else {
          item.balance = item.receiverBalance + '/' + item.nftTotal;
        }
        return item;
      });

      setItemTransactions(
        allTransactions.sort((a, b) => {
          return (
            new Date(a.createdAt).toUTCString() -
            new Date(b.createdAt).toUTCString()
          );
        }),
      );
    });
    return () => {};
  }, [item]);

  const onPreviewClick = () => {
    console.log(item);
    setModalData({
      url: item.nftFileUrl,
      mimetype: item.nftMimetype,
      visible: true,
    });
  };
  const closeModal = () => {
    setModalData(prev => ({...prev, visible: false, url: ''}));
  };

  const clearData = () => {
    setLoading(false);
    setAvatarSource(null);
    setItemName('');
    setSelection(false);
  };

  return (
    <Fragment>
      <View>
        <CustomHeader title="Item details" navigation={props.navigation} />
      </View>
      <ScrollView style={styles.container}>
        <View style={{...styles.contentContainer, margin: 0}}>
          <View style={classes.justifyBetween}>
            <TouchableOpacity
              onPress={onPreviewClick}
              style={{alignItems: 'center', width: wp('60%')}}>
              <View style={[classes.alignCenter, classes.imageContainer]}>
                {imageMimetypes[item.nftMimetype] && (
                  <Image source={avatarSource} style={classes.tokenImage} />
                )}
                {audioMimetypes[item.nftMimetype] && (
                  <AntIcon
                    name={'playcircleo'}
                    color={primaryColor}
                    size={hp('10%')}
                    // style={{marginRight: 40}}
                  />
                )}
              </View>
            </TouchableOpacity>
            <View style={classes.tokenDescriptionContainer}>
              <Text
                style={{
                  ...classes.textStyle,
                  wordWrap: 'wrap',
                  fontWeight: 'bold',
                }}>
                {item.tokenName}
              </Text>
              <Text
                style={{
                  ...classes.textStyle,
                  marginTop: 10,
                  alignSelf: 'flex-start',
                }}>
                Balance: {item.balance + '/' + item.total}
              </Text>

              <View />
            </View>
          </View>

          <TouchableOpacity
            disabled={loading}
            // onPress={onMintClick}
            style={{...styles.createButton, height: hp('5%'), borderRadius: 0}}>
            <View
              style={{
                ...classes.alignCenter,
                flex: 1,
              }}>
              {loading ? (
                <ActivityIndicator
                  animating={loading}
                  size="small"
                  color={'white'}
                />
              ) : (
                <Text style={styles.createButtonText}>Provenance</Text>
              )}
            </View>
          </TouchableOpacity>
          <View style={{height: hp('50%')}}>
            {itemTransactions.length ? (
              <NftTransactionListTab
                transactions={itemTransactions}
                walletAddress={userWalletAddress}
              />
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Text
                  style={{
                    ...classes.textStyle,
                    fontWeight: 'bold',
                    color: primaryColor,
                  }}>
                  This item has no transactions yet...
                </Text>
                <Image
                  source={require('../assets/transactions-empty.png')}
                  style={classes.noTransactionsImage}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <Modal
        onBackdropPress={closeModal}
        onRequestClose={closeModal}
        isVisible={modalData.visible}>
        <View style={classes.modal}>
          {audioMimetypes[modalData.mimetype] && (
            <View style={{position: 'absolute', top: '50%'}}>
              <AudioPlayer audioUrl={modalData.url} />
            </View>
          )}
          {imageMimetypes[modalData.mimetype] && (
            <TouchableOpacity onPress={closeModal}>
              <Image source={avatarSource} style={classes.modalImage} />
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </Fragment>
  );
}

const classes = StyleSheet.create({
  tokenIconStyle: {
    height: hp('3%'),
    width: hp('3%'),
  },
  justifyBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  tokenImage: {
    width: wp('60%'),
    height: wp('40%'),
    borderRadius: 5,
  },
  alignCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  textStyle: {
    fontFamily: lightFont,
    color: 'black',
    // position: 'absolute',
  },
  itemNameInput: {
    color: 'black',
    borderWidth: 1,
    borderColor: primaryColor,
    borderRadius: 5,
    flex: 1,
    // backgroundColor:primaryColor,
    paddingLeft: 20,
    alignItems: 'flex-start',
    height: wp('10%'),
    fontFamily: lightFont,
    fontSize: hp('1.8%'),
  },
  checkboxContainer: {
    flexDirection: 'row',
    width: wp('80%'),
    alignItems: 'center',
    marginTop: 10,
  },
  rarityItems: {
    paddingLeft: 5,
    paddingVertical: 5,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageContainer: {
    width: wp('60%'),
    height: wp('40%'),
    borderRadius: 10,
    borderWidth: 1,
    marginRight: wp('5%'),
    marginLeft: wp('7%'),
    borderColor: 'lightgrey',
  },
  notFoundImageText: {
    marginTop: 'auto',
    fontFamily: lightFont,
    fontSize: hp('2.6%'),
    color: primaryColor,
  },
  tokenDescriptionContainer: {
    borderRadius: 5,
    marginLeft: 10,
    // flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    width: wp('40%'),
    // height: wp('10%'),
    paddingRight: 10,
  },
  noTransactionsImage: {
    marginTop: 20,
    resizeMode: 'stretch',
    height: hp('21.50%'),
    width: wp('47.69%'),
  },
  modal: {
    // backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    height: wp('90%'),
  },
  modalImage: {
    width: wp('90%'),
    height: wp('90%'),
    borderRadius: 10,
  },
});
const mapStateToProps = state => {
  return {
    ...state,
  };
};

module.exports = connect(mapStateToProps, {
  fetchTransaction,
  fetchWalletBalance,
})(NftItemHistory);
