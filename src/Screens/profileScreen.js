/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {Component, createRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
  Linking,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import CustomHeader from '../components/shared/customHeader';
import ModalList from '../components/shared/commonModal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fetchTransaction, fetchWalletBalance} from '../actions/wallet';
getUserProfileData;
import {
  getUserProfileData,
  setUserInitialData,
  saveInitialData,
  saveInitialDataAction,
} from '../actions/auth';
import openChatFromChatLink from '../helpers/openChatFromChatLink';
import parseChatLink from '../helpers/parseChatLink';
import {setCurrentChatDetails} from '../actions/chatAction';

import {CommonTextInput} from '../components/shared/customTextInputs';
import {connect} from 'react-redux';
import TransactionListTab from '../components/TransactionListComponent';
import {queryAllTransactions} from '../components/realmModels/transaction';
import {updateVCard} from '../helpers/xmppStanzaRequestMessages';
import Modal from 'react-native-modal';
import styles from './style/createNewChatStyle';
import * as connectionURL from '../config/url';
import {Alert} from 'react-native';
import axios from 'axios';
import Hyperlink from 'react-native-hyperlink';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {
  commonColors,
  textStyles,
  coinImagePath,
  coinsMainName,
  itemsTransfersAllowed,
} from '../../docs/config';
import {registerUserURL} from '../config/routesConstants';

const {primaryColor, primaryDarkColor} = commonColors;

const {mediumFont, regularFont, boldFont, lightFont} = textStyles;

export const changeUserName = async (url, data, token) => {
  console.log(data, 'datainnewname');
  return await axios.put(url, data, {
    headers: {
      // 'Content-Type': 'multipart/form-data',
      Authorization: token,
      'Accept-encoding': 'gzip, deflate',
    },
  });
};

const renderItem = ({item, index}) => (
  <Item
    tokenSymbol={item.tokenSymbol}
    tokenName={item.tokenName}
    balance={item.balance._hex ? parseInt(item.balance._hex, 16) : item.balance}
    index={index}
  />
);
const RenderAssetItem = ({item, index, onClick, selectedItem}) => (
  <AssetItem
    image={item.imagePreview || item.nftFileUrl}
    name={item.tokenName}
    assetsYouHave={item.balance}
    totalAssets={item.total}
    onClick={onClick}
    selectedItem={selectedItem}
    nftId={item.nftId}
    // balance={item.balance._hex ? parseInt(item.balance._hex, 16) : item.balance}
    item={item}
    index={index}
  />
);
const AssetItem = ({
  image,
  assetsYouHave,
  totalAssets,
  name,
  nftId,
  onClick,
  index,
  item,
}) => {
  const rightSwipe = () => {
    return (
      <View
        style={{
          height: hp('8.62%'),
          zIndex: 99999,
          // position: 'absolute',
          width: wp('26.6%'),
          // flex: 0.266,
          // paddingHorizontal: wp('7.2%'),
          backgroundColor: '#31974c',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          // onPress={() => Alert.alert('hi')}
          style={{
            width: '100%',
            textAlign: 'center',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: hp('1.84%')}}>Buy now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      {/* <Swipeable renderRightActions={rightSwipe}> */}

      <View
        onPress={onClick}
        style={{
          height: hp('8.62%'),
          width: '100%',
          // backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F5F8',
          backgroundColor: '#F4F5F8',

          justifyContent: 'center',
          marginBottom: 10,
          padding: null,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              // flex: 0.494,
              width: wp('100%'),

              // maxWidth: '100%',
              backgroundColor: '#F4F5F8',
              flexDirection: 'row',
              alignItems: 'center',

              textAlign: 'center',
            }}>
            <View
              style={{
                width: wp('24%'),
                // flex: 0.24,
                // marginLeft: wp('13%'),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{width: '100%', height: '100%'}}
                source={{
                  uri: image,
                }}
              />
            </View>
            <View style={{width: wp('70%')}}>
              <Text
                style={{
                  fontFamily: regularFont,
                  fontSize: hp('2.2%'),
                  color: '#000000',
                  marginLeft: 20,
                  // alignSelf: 'left'
                }}>
                {name}
              </Text>
            </View>
          </View>
          <View
            style={{
              // flex: 0.1,
              // width: wp('70%'),
              backgroundColor: '#F4F5F8',
              alignItems: 'center',
              justifyContent: 'center',
              paddingRight: 20,
            }}>
            <Text>
              {assetsYouHave}/{totalAssets}
            </Text>
          </View>
        </View>
      </View>
      {/* </Swipeable> */}
    </TouchableWithoutFeedback>
  );
};

const Item = ({tokenSymbol, tokenName, balance, index}) => (
  <View
    style={{
      height: hp('4.9%'),
      backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F5F8',
      justifyContent: 'center',
      padding: null,
    }}>
    <View style={{flexDirection: 'row', justifyContent: 'center', padding: 10}}>
      <View style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/coin.png')}
            style={classes.tokenIconStyle}
          />
          <Text
            style={{
              fontFamily: regularFont,
              fontSize: hp('1.97%'),
              color: '#000000',
            }}>
            {/* {" "}{tokenSymbol} */}
          </Text>
        </View>
      </View>
      <View style={{flex: 0.6, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontFamily: regularFont,
            fontSize: hp('1.97%'),
            color: '#000000',
          }}>
          {tokenName}
        </Text>
      </View>
      <View style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontFamily: mediumFont,
            fontSize: hp('1.97%'),
            color: '#000000',
          }}>
          {parseFloat(balance).toFixed(0)}
        </Text>
      </View>
    </View>
  </View>
);

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURI:
        'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg',
      firstName: '',
      lastName: '',
      walletAddress: '',
      description: '',
      modalType: null,
      showModal: false,
      extraData: null,
      transactions: [],
      totalSent: 0,
      totalReceived: 0,
      assetCount: 1,
      transactionCount: 'Load..',
      activeTab: 0,
      xTabOne: 0,
      xTabTwo: 0,
      xTabThree: 0,
      xCoinOne: 0,
      xCoinTabTwo: 1,
      enableScrollViewScroll: true,
      activeAssetTab: 0,
      translateCoin: new Animated.Value(0),
      translateX: new Animated.Value(0),
      textColorAnim: new Animated.Value(0),
      coinBalance: 0,
      coinData: [],
      transactionObject: [],
      isDescriptionEditable: false,
      userAvatar: '',
      modalVisible: false,
      itemsData: [],
      ref: null,
      itemsBalance: 0,
      modalTypeForEditing: 'name',
      debugModeCounter: 0,
      endOfListReached: false,
      limit: 10,
      offset: 0,
    };
    coinRef = createRef();
  }
  // componentDidMount() {
  //   console.log(this.state.ref.current.nativeEvent.layout.x, 'refff')
  //   this.setState({xCoinTabOne: this.state.ref.current.nativeEvent.layout.x})
  //   this.setState({activeAssetTab: 1}, () =>
  //     this.handleCoinSlide(xCoinTabTwo),
  //     )
  // }

  handleSlide = type => {
    let {translateX, textColorAnim} = this.state;
    textColorAnim.setValue(0);
    Animated.spring(translateX, {
      toValue: type,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(textColorAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: false,
    }).start();
  };
  handleCoinSlide = type => {
    let {translateCoin, textColorAnim} = this.state;
    textColorAnim.setValue(0);
    Animated.spring(translateCoin, {
      toValue: type,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(textColorAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: false,
    }).start();
  };
  onEnableScroll = value => {
    this.setState({
      enableScrollViewScroll: value,
    });
  };

  loadTabContent = () => {
    let {
      activeTab,
      itemsData,
      activeAssetTab,
      xCoinTabOne,
      xCoinTabTwo,
      translateX,
      translateCoin,

      coinBalance,
      coinData,
    } = this.state;
    if (activeTab === 0) {
      return (
        <View style={{marginTop: hp('3%')}}>
          <View>
            <View
              style={{
                padding: wp('4%'),
                flexDirection: 'row',
                paddingBottom: 0,
                paddingTop: 0,
              }}>
              <TouchableOpacity
                onLayout={event =>
                  this.setState({xCoinTabOne: event.nativeEvent.layout.x})
                }
                ref={this.state.ref}
                style={{marginRight: 20}}
                onPress={() =>
                  this.setState({activeAssetTab: 0}, () =>
                    this.handleCoinSlide(xCoinTabOne),
                  )
                }>
                <Animated.Text
                  style={{
                    fontSize: hp('1.97%'),
                    fontFamily: boldFont,
                    color:
                      this.state.activeAssetTab === 0 ? '#000000' : '#0000004D',
                  }}>
                  Coins{' '}
                  <Text
                    style={{
                      fontSize: hp('1.97%'),
                      color:
                        this.state.activeAssetTab === 0
                          ? '#000000'
                          : '#0000004D',
                      fontFamily: boldFont,
                    }}>
                    ({parseFloat(coinBalance).toFixed(0)})
                  </Text>
                </Animated.Text>
              </TouchableOpacity>
              {itemsTransfersAllowed && (
                <TouchableOpacity
                  onLayout={event =>
                    this.setState({xCoinTabTwo: event.nativeEvent.layout.x})
                  }
                  ref={ref => (this.coinRef = ref)}
                  onPress={() =>
                    this.setState({activeAssetTab: 1}, () =>
                      this.handleCoinSlide(xCoinTabTwo),
                    )
                  }>
                  <Animated.Text
                    style={{
                      fontSize: hp('1.97%'),
                      fontFamily: boldFont,
                      color:
                        this.state.activeAssetTab === 1
                          ? '#000000'
                          : '#0000004D',
                    }}>
                    Items ({this.state.itemsBalance})
                  </Animated.Text>
                </TouchableOpacity>
              )}
            </View>
            <Animated.View
              style={{
                width: wp('10%'),
                borderWidth: 1,
                // marginLeft: 20,
                transform: [
                  {
                    translateX: translateCoin,
                  },
                ],
              }}
            />

            {/* <Text
              style={{
                fontSize: hp('1.97'),
                color: '#000000',
                fontFamily: boldFont,
              }}>
              Coins{' '}
              <Text
                style={{
                  fontSize: hp('1.47%'),
                  color: '#000000',
                  fontFamily: mediumFont,
                }}>
                ({parseFloat(coinBalance).toFixed(2)})
              </Text>
            </Text> */}
          </View>
          <View style={{marginTop: hp('1.47%'), height: hp('44%')}}>
            {activeAssetTab === 0 ? (
              <FlatList
                data={coinData}
                nestedScrollEnabled={true}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                // onTouchStart={() => {
                //   this.onEnableScroll(false);
                //   console.log('scrooooooooool');
                // }}
                // onMomentumScrollEnd={() => {
                //   this.onEnableScroll(true);
                // }}
              />
            ) : (
              <FlatList
                // style={{paddingBottom: 300}}
                data={itemsData}
                // contentContainerStyle={{paddingBottom: hp('15.47')}}
                // nestedScrollEnabled={true}
                renderItem={e => (
                  <RenderAssetItem
                    item={e.item}
                    index={e.index}
                    onClick={() =>
                      this.props.navigation.navigate(
                        'NftItemHistoryComponent',
                        {
                          screen: 'NftItemHistory',
                          params: {
                            item: e.item,
                            userWalletAddress: this.state.walletAddress,
                          },
                        },
                      )
                    }
                    selectedItem={this.state.selectedItem}
                  />
                )}
                nestedScrollEnabled={true}
                keyExtractor={(item, index) => index.toString()}
                // onPress={() => {
                //   this.onEnableScroll(false);
                // }}
                // onTouchStart={() => {
                //   this.onEnableScroll(false);
                // }}
                // onMomentumScrollEnd={() => {
                //   this.onEnableScroll(true);
                // }}
              />
            )}
          </View>

          {/* <Text
          style={{fontSize:hp("1.97"), color:"#000000", fontFamily:boldFont}}>
            Items <Text style={{fontSize:hp("1.47%"), color:"#000000", fontFamily:mediumFont}}>({coinBalance})</Text></Text>
          <View style={{marginTop:hp("1.47%")}}>
            <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            />
          </View> */}
        </View>
      );
    }

    if (activeTab === 1) {
      return (
        <View style={{height: hp('34%')}}>
          <TransactionListTab
            transactions={this.state.transactionObject}
            walletAddress={this.state.walletAddress}
            onEndReached={() => {
              if (
                this.props.walletReducer.transactions.length <
                this.props.walletReducer.total
              ) {
                this.props.fetchTransaction(
                  this.state.walletAddress,
                  this.props.loginReducer.token,
                  true,
                  this.props.walletReducer.limit,
                  this.props.walletReducer.offset,
                );
              }
            }}
          />
        </View>
      );
    }
  };

  componentDidMount() {
    console.log(this.props.loginReducer.token, 'userToken222');
    // this.props.getUserProfileData(this.props.loginReducer.token)

    let transactionsObject = [];
    let coinData = this.props.walletReducer.balance.filter(
      item => item.tokenSymbol !== 'ETHD' && item.tokenType !== 'NFT',
    );
    console.log(coinData, 'sdfdsfdsf');
    let itemsData = this.props.walletReducer.balance.filter(
      item => item.tokenType === 'NFT',
    );
    // let itemsData =
    let coinBalance = 0;
    let itemsBalance = 0;

    // let transactions=[];
    let totalSent = 0;
    let totalReceived = 0;
    const initialData = this.props.loginReducer.initialData;
    let userAvatar = this.props.loginReducer.userAvatar;
    let firstName;
    let lastName;
    let description = '';
    let walletAddress;
    if (initialData) {
      // userAvatar = initialData.photo;
      firstName = initialData.firstName;
      lastName = initialData.lastName;
      walletAddress = initialData.walletAddress;
      description = this.props.loginReducer.userDescription;
      this.props.fetchTransaction(
        this.state.walletAddress,
        this.props.loginReducer.token,
        true,
        this.props.walletReducer.limit,
        this.props.walletReducer.offset,
      );
      this.props.fetchWalletBalance(
        this.props.loginReducer.initialData.walletAddress,
        null,
        this.props.loginReducer.token,
        true,
      );
    }
    // console.log(this.state.ref.current.nativeEvent.layout.x, 'refff')
    // this.setState({xCoinTabOne: this.state.ref.current.nativeEvent.layout.x})
    // if(this.props.)cons

    // console.log(item, 'balanceccc')

    // console.log(coinData, 'itemmmsmmsms')
    // coinBalance&&

    coinData
      // .filter(item => item.tokenSymbol !== 'ETHD')
      .map(item => {
        if (item.balance.hasOwnProperty('_hex')) {
          coinBalance = coinBalance + parseInt(item.balance._hex, 16);
        } else coinBalance = coinBalance + parseFloat(item.balance);
      });
    // console.log(coinData, 'itemmmsmmsms');
    itemsData.map(item => {
      // console.log(item.balance, 'ssssssssss');

      itemsBalance = itemsBalance + parseFloat(item.balance);
    });
    console.log(coinBalance, 'ieeeeee');

    // let newCoinData = coinData.filter(item => item.tokenSymbol !== 'ETHD');
    // console.log(newCoinData, 'newitemmmsmmsmsss')

    this.setState({
      coinData,
      assetCount: +parseFloat(coinBalance).toFixed(0) + itemsBalance,
    });

    Linking.getInitialURL().then(url => {
      console.log(url);
    });
    setTimeout(() => {
      itemsTransfersAllowed &&
        this.coinRef.measure((fx, fy, width, height, px, py) => {
          if (this.props.route.params.viewItems) {
            this.setState({activeAssetTab: 1}, () => this.handleCoinSlide(px));
          }
        });
    }, 1000);

    if (Platform.OS === 'ios') {
      Linking.addEventListener('url', this.handleOpenURL);
    }

    queryAllTransactions().then(transactions => {
      let balance = this.props.walletReducer.userCoinBalanceValue;
      if (transactions.length > 0) {
        transactions.map(item => {
          // console.log(item, 'trrr')
          if (item.tokenId === 'NFT') {
            if (
              item.from === this.state.walletAddress &&
              item.from !== item.to
            ) {
              balance = balance;
              item.balance = item.senderBalance + '/' + item.nftTotal;
            } else if (item.from === item.to) {
              item.balance = item.senderBalance + '/' + item.nftTotal;
            } else {
              item.balance = item.receiverBalance + '/' + item.nftTotal;
            }

            return item;
          } else if (
            item.from === this.state.walletAddress &&
            item.from !== item.to
          ) {
            item.balance = item.senderBalance;
            balance = balance - item.value;
          } else if (item.from === item.to) {
            item.balance = item.senderBalance;
          } else {
            item.balance = item.receiverBalance;
            balance = balance + item.value;
          }
          return item;
        });

        transactionsObject = transactions.reverse();
      }
    });

    // transactionsObject.map((item) => {
    //   if(item.tokenName === 'ChatTestToken'){
    //     transactions.push(item)
    //     if(item.from === walletAddress){
    //       totalSent = totalSent + item.value
    //     }else if(item.from !== walletAddress){
    //       totalReceived = totalReceived + item.value
    //     }
    //   }else return null
    // })

    this.setState({
      userAvatar,
      lastName,
      firstName,
      walletAddress,
      description,
      totalSent,
      totalReceived,
      coinData,
      coinBalance,
      transactionsObject,
      itemsData: itemsData.reverse(),
      itemsBalance,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // if (
    //   prevProps.walletReducer.transactions.length !==
    //   this.props.walletReducer.transactions.length
    // ) {
    //   this.props.fetchTransaction(
    //     this.state.walletAddress,
    //     this.props.loginReducer.token,
    //     true,
    //     // this.props.walletReducer.offset,
    //     // this.props.walletReducer.limit,
    //   );
    //   queryAllTransactions().then(transactions => {
    //     let balance = this.props.walletReducer.userCoinBalanceValue;
    //     if (transactions.length > 0) {
    //       console.log(transactions, 'reaaalllll,m');
    //       transactions.map(item => {
    //         if (item.tokenId === 'NFT') {
    //           if (
    //             item.from === this.state.walletAddress &&
    //             item.from !== item.to
    //           ) {
    //             balance = balance;
    //             item.balance = item.senderBalance + '/' + item.nftTotal;
    //           } else if (item.from === item.to) {
    //             item.balance = item.receiverBalance + '/' + item.nftTotal;
    //           } else {
    //             item.balance = item.receiverBalance + '/' + item.nftTotal;
    //           }

    //           return item;
    //         } else if (
    //           item.from === this.state.walletAddress &&
    //           item.from !== item.to
    //         ) {
    //           item.balance = item.senderBalance;
    //           balance = balance - item.value;
    //         } else {
    //           item.balance = item.receiverBalance;
    //           balance = balance + item.value;
    //         }
    //         return item;
    //       });
    //     }

    //     this.setState({
    //       transactionObject: transactions.reverse(),
    //       transactionCount: transactions.length,
    //     });
    //   });
    // }

    if (
      this.props.loginReducer.userAvatar &&
      this.props.loginReducer.userAvatar !== prevProps.loginReducer.userAvatar
    ) {
      console.log('kvns jfn,d,c');
      this.setState({
        userAvatar: this.props.loginReducer.userAvatar,
      });
    }
    if (
      prevProps.walletReducer.balance !== this.props.walletReducer.balance
      // this.state.itemsData.length
    ) {
      // this.setState({itemsDat})
      let itemsData = this.props.walletReducer.balance.filter(
        item => item.tokenType === 'NFT' && item.balance > 0,
      );
      console.log(itemsData, 'itemsss');
      let coinData = this.props.walletReducer.balance.filter(
        item => item.tokenSymbol !== 'ETHD' && item.tokenType !== 'NFT',
      );

      let coinBalance = 0;
      let itemsBalance = 0;
      let transactionsObject = [];
      coinData
        // .filter(item => item.tokenSymbol !== 'ETHD')
        .map(item => {
          if (item.balance.hasOwnProperty('_hex')) {
            coinBalance = coinBalance + parseInt(item.balance._hex, 16);
          } else coinBalance = coinBalance + parseFloat(item.balance);
          console.log(coinData, 'adsadasd');
        });
      itemsData.map(
        item => (itemsBalance = itemsBalance + parseFloat(item.balance)),
      );

      queryAllTransactions(coinsMainName).then(transactions => {
        let balance = this.props.walletReducer.userCoinBalanceValue;
        if (transactions.length > 0) {
          transactions.map(item => {
            if (item.tokenId === 'NFT') {
              if (
                item.from === this.state.walletAddress &&
                item.from !== item.to
              ) {
                balance = balance;
                item.balance = item.senderBalance + '/' + item.nftTotal;
              } else if (item.from === item.to) {
                item.balance = item.receiverBalance + '/' + item.nftTotal;
              } else {
                item.balance = item.receiverBalance + '/' + item.nftTotal;
              }

              return item;
            } else if (
              item.from === this.state.walletAddress &&
              item.from !== item.to
            ) {
              item.balance = item.senderBalance;
              balance = balance - item.value;
            } else {
              item.balance = item.receiverBalance;
              balance = balance + item.value;
            }
            return item;
          });
        }
        this.setState({
          transactionObject: transactions.reverse(),
          transactionCount: transactions.length,
        });
      });
      this.setState({
        itemsData: itemsData.reverse(),
        coinBalance,
        coinData,
        assetCount:
          +parseFloat(coinBalance).toFixed(0) +
          (itemsTransfersAllowed ? itemsBalance : 0),
        itemsBalance,
      });
    }
  }

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  };

  QRPressed = () => {
    let walletAddress = this.state.walletAddress;
    this.setState({
      showModal: true,
      modalType: 'generateQR',
      extraData: walletAddress,
    });
  };

  onDescriptionPressed = () => {
    this.setState({
      isDescriptionEditable: !this.state.isDescriptionEditable,
      modalVisible: true,
      modalTypeForEditing: 'description',
    });
  };
  onNamePressed = () => {
    this.setState({
      modalTypeForEditing: 'name',
      modalVisible: true,
    });
  };
  setDescription = data => {
    updateVCard(this.state.userAvatar, data);
    this.setState({isDescriptionEditable: false, modalVisible: false});
  };
  setNewName = () => {
    changeUserName(
      this.props.apiReducer.defaultUrl + registerUserURL,
      {firstName: this.state.firstName, lastName: this.state.lastName},
      this.props.loginReducer.token,
    )
      .then(res =>
        // this.props.setUserInitialData({
        //   firstName: this.state.firstName,
        //   lastName: this.state.lastName,
        //   image: this.props.loginReducer.initialData.image,
        //   username: this.props.loginReducer.initialData.username,

        //   password: this.props.loginReducer.initialData.password,

        //   walletAddress: this.props.loginReducer.initialData.walletAddress,
        // }),
        saveInitialData(
          {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            image: this.props.loginReducer.initialData.image,
            username: this.props.loginReducer.initialData.username,

            password: this.props.loginReducer.initialData.password,

            walletAddress: this.props.loginReducer.initialData.walletAddress,
          },
          callback => {
            this.props.saveInitialDataAction(callback);
            // dispatch(loginUserSuccess(data));
          },
        ),
      )
      .catch(e => console.log(e, 'nameerror'));
    // this.props.getUserProfileData(this.props.loginReducer.token)

    this.setState({modalVisible: false});
  };
  onDescriptionChange = text => {
    this.setState({description: text});
  };
  onNameChange = (type, text) => {
    this.setState({
      [type]: text,
    });
  };
  onBackdropPress = () => {
    this.setState({
      isDescriptionEditable: !this.state.isDescriptionEditable,
      modalVisible: false,
    });
  };

  handleChatLinks = async chatLink => {
    const walletAddress = this.props.loginReducer.initialData.walletAddress;
    const chatJID = parseChatLink(chatLink);
    const pattern1 =
      /\bhttps:\/\/www\.eto\.li\/go\?c=0x[0-9a-f]+_0x[0-9a-f]+/gm;
    const pattern2 = /\bhttps:\/\/www\.eto\.li\/go\?c=[0-9a-f]+/gm;

    if (pattern1.test(chatLink) || pattern2.test(chatLink)) {
      openChatFromChatLink(
        chatJID,
        walletAddress,
        this.props.setCurrentChatDetails,
        this.props.navigation,
      );
    } else {
      Linking.openURL(chatLink);
    }
  };

  modalContent = () => {
    if (this.state.modalTypeForEditing === 'description') {
      return this.state.isDescriptionEditable ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 8,
            paddingVertical: 20,
          }}>
          <CommonTextInput
            maxLength={128}
            containerStyle={{
              borderWidth: 0.5,
              // borderTopWidth: 0,
              borderColor: primaryColor,
              backgroundColor: 'white',
              width: wp('81%'),
              height: hp('6.8%'),
              // padding: hp('2.4'),
              paddingLeft: wp('3.73'),
              borderRadius: 0,
              marginBottom: 10,
              // marginTop: 10
            }}
            fontsStyle={{
              fontFamily: lightFont,
              fontSize: hp('1.6%'),
              color: 'black',
            }}
            value={this.state.description}
            onChangeText={text => this.onDescriptionChange(text)}
            placeholder="Enter your description"
            placeholderTextColor={primaryColor}
          />

          <TouchableOpacity
            onPress={() => this.setDescription(this.state.description)}
            style={{
              backgroundColor: primaryColor,
              borderRadius: 5,
              height: hp('4.3'),
              padding: 4,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <Text style={styles.createButtonText}>Done editing</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null;
    }

    if (this.state.modalTypeForEditing === 'name') {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 8,
            paddingVertical: 20,
          }}>
          <CommonTextInput
            maxLength={15}
            containerStyle={{
              borderWidth: 0.5,
              // borderTopWidth: 0,
              borderColor: primaryColor,
              backgroundColor: 'white',
              width: wp('81%'),
              height: hp('6.8%'),
              // padding: hp('2.4'),
              paddingLeft: wp('3.73'),
              borderRadius: 0,
              marginBottom: 10,
              // marginTop: 10
            }}
            fontsStyle={{
              fontFamily: lightFont,
              fontSize: hp('1.6%'),
              color: 'black',
            }}
            value={this.state.firstName}
            onChangeText={text => this.onNameChange('firstName', text)}
            placeholder="Enter your firstname"
            placeholderTextColor={primaryColor}
          />
          <CommonTextInput
            maxLength={15}
            containerStyle={{
              borderWidth: 0.5,
              // borderTopWidth: 0,
              borderColor: primaryColor,
              backgroundColor: 'white',
              width: wp('81%'),
              height: hp('6.8%'),
              // padding: hp('2.4'),
              paddingLeft: wp('3.73'),
              borderRadius: 0,
              marginBottom: 10,
              // marginTop: 10
            }}
            fontsStyle={{
              fontFamily: lightFont,
              fontSize: hp('1.6%'),
              color: 'black',
            }}
            value={this.state.lastName}
            onChangeText={text => this.onNameChange('lastName', text)}
            placeholder="Enter your lastname"
            placeholderTextColor={primaryColor}
          />
          <TouchableOpacity
            onPress={() => this.setNewName()}
            style={{
              backgroundColor: primaryColor,
              borderRadius: 5,
              height: hp('4.3'),
              padding: 4,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <Text style={styles.createButtonText}>Done editing</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };
  render() {
    let {
      activeTab,
      xTabOne,
      xTabTwo,
      xTabThree,
      translateX,
      textColorAnim,
      firstName,
      lastName,
    } = this.state;
    const fontColor = textColorAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['#0000003D', '#0000004D', '#000000'],
    });
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View
          nestedScrollEnabled={true}
          style={{backgroundColor: primaryDarkColor, flex: 1}}>
          <CustomHeader
            isQR={true}
            title="My profile"
            onQRPressed={() => this.QRPressed()}
            navigation={this.props.navigation}
          />

          {/* Profile Picture */}
          <View style={{zIndex: +1, alignItems: 'center'}}>
            <View
              style={{
                width: hp('10.46%'),
                height: hp('10.46%'),
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: primaryColor,
                borderRadius: hp('10.46%') / 2,
              }}>
              {this.state.userAvatar ? (
                <Image
                  source={{uri: this.state.userAvatar}}
                  style={{
                    height: hp('10.46%'),
                    width: hp('10.46%'),
                    borderRadius: hp('10.46%') / 2,
                  }}
                />
              ) : (
                <Text
                  style={{
                    fontSize: 40,
                    color: 'white',
                    zIndex: 9999,
                  }}>
                  {firstName[0] + lastName[0]}
                </Text>
              )}
            </View>
          </View>
          {/* Profile Picture */}

          <View style={{flex: 1, marginTop: hp('5.5%')}}>
            <View
              style={{
                paddingTop: hp('2.4%'),
                backgroundColor: '#FBFBFB',
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
                height: hp('75%'),
              }}>
              <View style={{alignItems: 'center', marginTop: hp('5.54%')}}>
                <TouchableOpacity onPress={this.onNamePressed}>
                  <Text
                    style={{
                      fontSize: hp('2.216%'),
                      fontFamily: mediumFont,
                      color: '#000000',
                    }}>
                    {firstName} {lastName}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{padding: hp('4%'), paddingBottom: 0, paddingTop: 0}}>
                  <View
                    style={{
                      padding: hp('4%'),
                      paddingBottom: 0,
                      paddingTop: 0,
                    }}>
                    <TouchableOpacity>
                      <Hyperlink
                        onPress={url => this.handleChatLinks(url)}
                        linkStyle={{
                          color: '#2980b9',
                          fontSize: hp('1.8%'),
                          textDecorationLine: 'underline',
                        }}>
                        <Text
                          style={{
                            fontSize: hp('2%'),
                            fontFamily: regularFont,
                            textAlign: 'center',
                            color: 'black',
                          }}>
                          {this.state.description &&
                          !this.state.isDescriptionEditable
                            ? this.state.description
                            : 'Add your description'}
                        </Text>
                      </Hyperlink>
                      <TouchableOpacity
                        onPress={this.onDescriptionPressed}
                        style={{alignItems: 'center', margin: 10}}>
                        <AntIcon name="edit" size={hp('2%')} />
                      </TouchableOpacity>
                    </TouchableOpacity>

                    {/* {this.state.isDescriptionEditable ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <TextInput
                          value={this.state.description}
                          onChangeText={e => this.onDescriptionChange(e)}
                          multiline={true}
                          maxLength={100}
                        />

                        <TouchableOpacity
                          onPress={() =>
                            this.setDescription(this.state.description)
                          }
                          style={{
                            backgroundColor: primaryColor,
                            borderRadius: 5,
                            height: hp('4.3'),
                            padding: 4,
                          }}>
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              flex: 1,
                            }}>
                            <Text style={styles.createButtonText}>
                              Done editing
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ) : null} */}
                  </View>
                </View>
              </View>

              <View>
                <View style={{padding: wp('4%')}}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onLayout={event =>
                        this.setState({xTabOne: event.nativeEvent.layout.x})
                      }
                      onPress={() =>
                        this.setState({activeTab: 0}, () =>
                          this.handleSlide(xTabOne),
                        )
                      }>
                      <Animated.Text
                        style={{
                          fontSize: hp('1.97%'),
                          fontFamily: boldFont,
                          color:
                            this.state.activeTab === 0
                              ? '#000000'
                              : '#0000004D',
                        }}>
                        Assets ({this.state.assetCount})
                      </Animated.Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{marginLeft: 20}}
                      onLayout={event =>
                        this.setState({xTabTwo: event.nativeEvent.layout.x})
                      }
                      onPress={() =>
                        this.setState({activeTab: 1}, () =>
                          this.handleSlide(xTabTwo),
                        )
                      }>
                      <Animated.Text
                        style={{
                          fontSize: hp('1.97%'),
                          fontFamily: boldFont,
                          color:
                            this.state.activeTab === 1
                              ? '#000000'
                              : '#0000004D',
                        }}>
                        Transactions (
                        {this.state.transactionCount})
                      </Animated.Text>
                    </TouchableOpacity>
                  </View>

                  <Animated.View
                    style={{
                      width: wp('10%'),
                      borderWidth: 1,
                      transform: [
                        {
                          translateX,
                        },
                      ],
                    }}
                  />
                </View>

                {this.loadTabContent()}
              </View>
            </View>
            <ModalList
              type={this.state.modalType}
              show={this.state.showModal}
              extraData={this.state.extraData}
              closeModal={this.closeModal}
            />
            <View
              style={{
                justifyContent: 'center',
                backgroundColor: 'black',
                alignItems: 'center',
                height: '100%',
              }}>
              <Modal
                animationType="slide"
                transparent={true}
                isVisible={this.state.modalVisible}
                onBackdropPress={this.onBackdropPress}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                }}>
                {this.modalContent()}
              </Modal>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const classes = StyleSheet.create({
  tokenIconStyle: {
    height: hp('3%'),
    width: hp('3%'),
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
  getUserProfileData,
  setUserInitialData,
  saveInitialData,
  saveInitialDataAction,
})(ProfileScreen);
