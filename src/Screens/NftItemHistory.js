/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {Component, useEffect, Fragment, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Image,
  ActivityIndicator,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {useSelector, useDispatch, connect} from 'react-redux';
import {fetchTransaction, fetchWalletBalance} from '../actions/wallet';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import styles from './style/createNewChatStyle';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomHeader from '../components/shared/customHeader';
import * as connectionURL from '../config/url';
import * as token from '../config/token';
import axios from 'axios';
import Modal from 'react-native-modal';
import {
  commonColors,
  textStyles,
  coinImagePath,
  coinsMainName,
} from '../../docs/config';
import NftTransactionListTab from '../components/NftTransactionsHistoryComponent';
import {transactionURL} from '../config/routesConstants';

const {primaryColor, secondaryColor} = commonColors;
const {regularFont, lightFont} = textStyles;

function NftItemHistory(props) {
  const [avatarSource, setAvatarSource] = useState(null);
  const [itemName, setItemName] = useState('');
  const [selectedValue, setSelectedValue] = useState(1);
  const [fileId, setFileId] = useState('');
  const [loading, setLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [isSelected, setSelection] = useState(true);
  const [open, setOpen] = useState(false);
  const allReducers = useSelector(state => state);
  const [width, setWidth] = useState('40%');
  const [itemTransactions, setItemTransactions] = useState([]);

  const loginReducerData = allReducers.loginReducer;
  const [walletAddress, setWalletAddress] =
    loginReducerData.initialData.walletAddress;
  const [isModalVisible, setModalVisible] = useState(false);
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
    return await axios.get(url, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token,
        'Accept-encoding': 'gzip, deflate',
      },
    });
  };

  // const [value, setValue] = useState(1);
  const [items, setItems] = useState([
    {label: '1', value: 1},
    // {label: '1', value: '1'}
  ]);

  useEffect(() => {
    // requestCameraPermission();
    setAvatarSource({uri: item.nftFileUrl});
    // console.log(item, 'sdf49835430895dsf')
    getItemTransactionsHistory(userWalletAddress, item.nftId).then(res => {
      const allTransactions = res.data.transactions.map(item => {
        // console.log(new Date(a.createdAt).toUTCString(), 'dadsadasdasdsa')
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
          // console.log(new Date(a.createdAt).toUTCString(), 'dadsadasdasdsa')
          return (
            new Date(a.createdAt).toUTCString() -
            new Date(b.createdAt).toUTCString()
          );
        }),
      );
    });
    return () => {};
  }, [item]);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const clearData = () => {
    setLoading(false);
    setAvatarSource(null);
    // setSelectedValue('')
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
          {/* <View style={styles.section1}>
            <TextInput
              value={itemName}
              onChangeText={itemName => setItemName(itemName)}
              placeholder="Item Name"
              placeholderTextColor={primaryColor}
              style={classes.itemNameInput}
              maxLength={120}
            />
          </View> */}

          {/* <TextInput
              scrollEnabled
              placeholder="Rarity"
              placeholderTextColor={primaryColor}
            //   multiline
              style={styles.textInputOuter}
            //   numberOfLines={5}
            /> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <TouchableOpacity
              // onPress={chooseImageOption}
              onPress={() => item.nftFileUrl && setModalVisible(true)}
              style={{alignItems: 'center', width: wp('60%')}}>
              <View
                // onPress={chooseImageOption}/

                style={{
                  ...classes.alignCenter,
                  width: wp('60%'),
                  height: wp('40%'),
                  borderRadius: 5,
                  borderColor: !item.nftFileUrl ? primaryColor : 'white',
                  borderWidth: 1,
                  marginRight: wp('5%'),
                  marginLeft: wp('7%'),
                }}>
                {item.nftFileUrl ? (
                  <Image
                    source={avatarSource}
                    style={{
                      width: wp('60%'),
                      height: wp('40%'),
                      borderRadius: 5,
                    }}
                  />
                ) : (
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    {/* <AntIcon
                      name="plus"
                      size={hp('10%')}
                      color={primaryColor}
                    /> */}
                    <Text
                      style={{
                        marginTop: 'auto',
                        fontFamily: lightFont,
                        fontSize: hp('2.6%'),
                        color: primaryColor,
                      }}>
                      Image not found
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <View
              style={{
                // borderColor: primaryColor,
                // borderWidth: 1,
                // marginTop: 10,
                borderRadius: 5,
                marginLeft: 10,
                // flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-around',
                width: wp('40%'),
                // height: wp('10%'),
                paddingRight: 10,
              }}>
              <Text
                style={{
                  ...classes.textStyle,
                  wordWrap: 'wrap',
                  fontWeight: 'bold',
                  // left: 5,
                }}>
                {item.tokenName}
              </Text>
              <Text
                style={{
                  ...classes.textStyle,
                  // right: 40,
                  marginTop: 10,
                  alignSelf: 'flex-start',
                }}>
                Balance: {item.balance + '/' + item.total}
              </Text>

              <View />
              {/* {Platform.OS === 'android' ? (
                <Picker
                  // disabled
                  selectedValue={selectedValue}
                  style={{height: 10, width: 30, color: primaryColor}}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedValue(itemValue)
                  }>
                  <Picker.Item label="1" value={1} />
                  <Picker.Item label="2" value={2} />
                  <Picker.Item label="3" value={3} />
                  <Picker.Item label="4" value={4} />
                  <Picker.Item label="5" value={5} />
                </Picker>
              ) : ( */}

              {/* )} */}
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
                  style={{
                    marginTop: 20,
                    resizeMode: 'stretch',
                    height: hp('21.50%'),
                    width: wp('47.69%'),
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <Modal
        onBackdropPress={() => setModalVisible(false)}
        isVisible={isModalVisible}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            width: wp('90%'),
            height: wp('90%'),
          }}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Image
              // onPress={setChatAvatar}
              source={avatarSource}
              style={{
                width: wp('90%'),
                height: wp('90%'),
                borderRadius: 10,
              }}
            />
          </TouchableOpacity>

          {/* <Button title="Hide modal" onPress={toggleModal} /> */}
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
