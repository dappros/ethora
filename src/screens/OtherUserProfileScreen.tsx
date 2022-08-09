/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  FlatList,
  StyleSheet,
  Linking,
} from 'react-native';
import TransactionListTab from '../components/Transactions/TransactionsList';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  commonColors,
  textStyles,
  coinImagePath,
  itemsTransfersAllowed,
  coinsMainName,
  coinReplacedName,
} from '../../docs/config';
import {NftListItem} from '../components/Transactions/NftListItem';
import {useStores} from '../stores/context';
import {Button, HStack} from 'native-base';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import {observer} from 'mobx-react-lite';
import {ROUTES} from '../constants/routes';
import {NftMediaModal} from '../components/NftMediaModal';
import {
  createNewRoom,
  roomConfig,
  sendInvite,
  setOwner,
  subscribeToRoom,
} from '../xmpp/stanzas';
import {underscoreManipulation} from '../helpers/underscoreLogic';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {primaryColor, primaryDarkColor} = commonColors;
const {boldFont} = textStyles;

const handleSlide = (
  type:
    | number
    | Animated.Value
    | Animated.ValueXY
    | {
        x: number;
        y: number;
      },
  translateX: Animated.Value | Animated.ValueXY,
  textColorAnim: Animated.Value | Animated.ValueXY,
) => {
  textColorAnim.setValue(0);
  Animated.spring(translateX, {
    toValue: type,
    useNativeDriver: false,
  }).start();
  Animated.timing(textColorAnim, {
    toValue: 1,
    duration: 700,
    useNativeDriver: false,
  }).start();
};

const renderItem = ({item, index}: {item: any; index: number}) => (
  <Item
    tokenSymbol={item.tokenSymbol}
    tokenName={item.tokenName}
    balance={item.balance}
    index={index}
  />
);

const Item = ({
  tokenSymbol,
  tokenName,
  balance,
  index,
}: {
  tokenSymbol: string;
  tokenName: string;
  balance: string | number;
  index: number;
}) => (
  <View
    style={{
      height: hp('4.9%'),
      backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F5F8',
      justifyContent: 'center',
      padding: null,
    }}>
    <View style={{flexDirection: 'row', justifyContent: 'center', padding: 10}}>
      <View
        style={{
          flex: 0.2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image source={coinImagePath} style={styles.tokenIconStyle} />

        <Text
          style={{
            fontFamily: textStyles.regularFont,
            fontSize: hp('1.97%'),
            color: '#000000',
          }}>
          {/* {tokenSymbol} */}
        </Text>
      </View>
      <View style={{flex: 0.6, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontFamily: textStyles.regularFont,
            fontSize: hp('1.97%'),
            color: '#000000',
          }}>
          {tokenName === coinsMainName ? coinReplacedName : tokenName}
        </Text>
      </View>
      <View style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontFamily: textStyles.regularFont,
            fontSize: hp('1.97%'),
            color: '#000000',
          }}>
          {parseFloat(balance).toFixed(0)}
        </Text>
      </View>
    </View>
  </View>
);

const firstLayout = [
  {
    width: hp('10.46%'),
    height: hp('10.46%'),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: hp('10.46%') / 2,
  },
  {
    flex: 1,
    marginTop: hp('5.5%'),
    children: [
      {
        paddingTop: hp('2.4%'),
        backgroundColor: '#FBFB7',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        height: hp('75%'),
      },
    ],
  },
];

const OtherUserProfileScreen = observer((props: any) => {
  const {loginStore, walletStore, apiStore, chatStore} = useStores();

  const {setOffset, setTotal, clearPaginationData, anotherUserBalance} =
    walletStore;

  const [anotherUserAvatar, setAnotherUserAvatar] = useState('');
  const [anotherUserFirstname, setAnotherUserFirstname] = useState('null');
  const [anotherUserLastname, setAnotherUserLastname] = useState('null');
  const [anotherUserDescription, setAnotherUserDescription] = useState('');
  const [anotherUserWalletAddress, setAnotherUserWalletAddress] =
    useState(null);
  const [anotherUserTransaction, setAnotherUserTransaction] = useState(null);
  const [coinData, setCoinData] = useState([]);
  const [itemsData, setItemsData] = useState([]);

  const [transactionCount, setTransactionCount] = useState(0);

  const [activeTab, setActiveTab] = useState(0);
  const [activeAssetTab, setActiveAssetTab] = useState(0);

  const [xTabOne, setXTabOne] = useState(0);
  const [xTabTwo, setXTabTwo] = useState(0);
  const [xTabThree, setXTabThree] = useState(0);

  const [translateX, setTranslateX] = useState(new Animated.Value(0));
  const [textColorAnim, setTextColorAnim] = useState(new Animated.Value(0));

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVCard, setIsLoadingVCard] = useState(true);

  const [assetCount, setAssetCount] = useState(1);
  const [itemsBalance, setItemsBalance] = useState(0);
  const [mediaModalData, setMediaModalData] = useState({
    open: false,
    url: '',
    mimetype: '',
  });

  useEffect(() => {
    handleSlide(
      activeTab === 0 ? xTabOne : activeTab === 1 ? xTabTwo : xTabThree,
      translateX,
      textColorAnim,
    );
  }, [activeTab]);

  useEffect(() => {
    setOffset(0);
    setTotal(0);

    return () => {
      clearPaginationData();
    };
  }, []);

  const onDirectChatPress = () => {
    const otherUserWalletAddress = loginStore.anotherUserWalletAddress;
    const myWalletAddress = loginStore.initialData.walletAddress;
    const combinedWalletAddress = [myWalletAddress, otherUserWalletAddress]
      .sort()
      .join('_');

    const roomJid =
      combinedWalletAddress.toLowerCase() +
      apiStore.xmppDomains.CONFERENCEDOMAIN;
    const combinedUsersName = [
      loginStore.initialData.firstName,
      anotherUserFirstname,
    ]
      .sort()
      .join(' and ');

    const myXmppUserName = underscoreManipulation(myWalletAddress);
    createNewRoom(
      myXmppUserName,
      combinedWalletAddress.toLowerCase(),
      chatStore.xmpp,
    );
    setOwner(
      myXmppUserName,
      combinedWalletAddress.toLowerCase(),
      chatStore.xmpp,
    );
    roomConfig(
      myXmppUserName,
      combinedWalletAddress.toLowerCase(),
      {roomName: combinedUsersName},
      chatStore.xmpp,
    );
    subscribeToRoom(roomJid, myXmppUserName, chatStore.xmpp);

    navigation.navigate(ROUTES.CHAT, {
      chatJid: roomJid,
      chatName: combinedUsersName,
    });
    chatStore.toggleShouldCount(false);

    setTimeout(() => {
      sendInvite(
        underscoreManipulation(myWalletAddress),
        roomJid.toLowerCase(),
        underscoreManipulation(otherUserWalletAddress),
        chatStore.xmpp,
      );
    }, 3000);
  };

  useEffect(() => {
    setTimeout(() => {
      let balance = 0;
      let allTransactions: any = walletStore.anotherUserTransaction
        // .reverse()
        .map((item: any) => {
          if (item.tokenId === 'NFT') {
            if (
              item.from === anotherUserWalletAddress &&
              item.from !== item.to
            ) {
              balance = balance;
              item.balance = item.senderBalance + '/' + item.nftTotal;
            } else {
              item.balance = item.receiverBalance + '/' + item.nftTotal;
            }

            return item;
          } else if (
            item.from === anotherUserWalletAddress &&
            item.from !== item.to
          ) {
            item.balance = item.senderBalance;
            balance = balance - item.value;
            return item;
          } else if (item.from === item.to) {
            item.balance = item.receiverBalance;
            return item;
          } else {
            item.balance = item.receiverBalance;
            balance = balance + item.value;
            return item;
          }
        });
      setAnotherUserTransaction(allTransactions);

      setTransactionCount(walletStore.anotherUserTransaction.length);
      setIsLoading(false);
    }, 2500);
  }, [walletStore.anotherUserTransaction]);

  useEffect(() => {
    setTimeout(() => {
      let updatedCoinBalance = 0;
      if (anotherUserBalance?.length > 0) {
        setCoinData(
          anotherUserBalance.filter(
            (item: any) =>
              item.tokenSymbol !== 'ETHD' && item.tokenType !== 'NFT',
          ),
        );
        setItemsData(
          anotherUserBalance
            .filter((item: any) => item.tokenType === 'NFT' && item.balance > 0)
            .reverse(),
        );
        coinData
          ? coinData.map((item: any) => {
              updatedCoinBalance =
                updatedCoinBalance + parseFloat(item.balance);
            })
          : null;

        setAssetCount(itemsBalance + updatedCoinBalance);
      }
    }, 2500);
  }, [anotherUserBalance]);

  useEffect(() => {
    let updatedCoinBalance = 0;
    let updatedItemsBalance = 0;

    coinData
      ? coinData.map((item: any) => {
          updatedCoinBalance = updatedCoinBalance + parseFloat(item.balance);
        })
      : null;
    itemsData.map((item: any) => {
      updatedItemsBalance = updatedItemsBalance + parseFloat(item.balance);
    });
    setItemsBalance(updatedItemsBalance);
    setAssetCount(
      (itemsTransfersAllowed ? updatedItemsBalance : 0) + updatedCoinBalance,
    );

    return () => {};
  }, [itemsData, coinData]);

  useEffect(() => {
    setTimeout(() => {
      // setAnotherUserAvatar();
      setAnotherUserFirstname(loginStore.anotherUserFirstname);
      setAnotherUserLastname(loginStore.anotherUserLastname);
      setAnotherUserDescription(loginStore.anotherUserDescription);
      setIsLoadingVCard(false);
    }, 2000);
  }, [loginStore.anotherUserAvatar]);

  useEffect(() => {
    walletStore.fetchTransaction(
      loginStore.anotherUserWalletAddress,
      loginStore.userToken,
      false,
      10,
      0,
    );
    walletStore.fetchWalletBalance(
      loginStore.anotherUserWalletAddress,
      loginStore.userToken,
      false,
    );
  }, [loginStore.anotherUserWalletAddress]);

  useEffect(() => {
    return function cleanup() {
      setAnotherUserAvatar('');
      setAnotherUserFirstname('null');
      setAnotherUserLastname('null');
      setAnotherUserDescription('');
      setAnotherUserWalletAddress(null);
      setCoinData([]);
      setAnotherUserTransaction(null);
      setTransactionCount(0);
      setIsLoading(true);
      setIsLoadingVCard(true);
      setItemsData([]);
    };
  }, []);
  const loadTabContent = (props: any) => {
    const {
      activeTab,
      coinData,
      anotherUserTransaction,
      anotherUserWalletAddress,
      activeAssetTab,
      itemsData,
      setActiveAssetTab,
      itemsBalance,
      navigation,
    } = props;

    let updatedCoinBalance = 0;

    coinData
      ? coinData.map(item => {
          updatedCoinBalance = updatedCoinBalance + parseFloat(item.balance);
        })
      : null;

    if (activeTab === 0) {
      return (
        <View style={{marginTop: hp('3%')}}>
          <View
            style={{
              padding: wp('4%'),
              flexDirection: 'row',
              paddingBottom: 0,
              paddingTop: 0,
            }}>
            <TouchableOpacity
              onPress={() => setActiveAssetTab(0)}
              style={{marginRight: 20}}>
              <Animated.Text
                style={{
                  fontSize: hp('1.97%'),
                  fontFamily: boldFont,
                  color: activeAssetTab === 0 ? '#000000' : '#0000004D',
                }}>
                Coins{' '}
                <Text
                  style={{
                    fontSize: hp('1.97%'),
                    color: activeAssetTab === 0 ? '#000000' : '#0000004D',
                    fontFamily: boldFont,
                  }}>
                  ({parseFloat(updatedCoinBalance).toFixed(0)})
                </Text>
              </Animated.Text>
            </TouchableOpacity>
            {itemsTransfersAllowed && (
              <TouchableOpacity onPress={() => setActiveAssetTab(1)}>
                <Animated.Text
                  style={{
                    fontSize: hp('1.97%'),
                    fontFamily: boldFont,
                    color: activeAssetTab === 1 ? '#000000' : '#0000004D',
                  }}>
                  Items ({itemsBalance})
                </Animated.Text>
              </TouchableOpacity>
            )}
            {/* </View> */}
          </View>
          <View style={{marginTop: hp('1.47%'), height: hp('43%')}}>
            {activeAssetTab === 0 ? (
              <FlatList
                data={coinData}
                nestedScrollEnabled={true}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <FlatList
                data={itemsData}
                renderItem={e => (
                  <NftListItem
                    assetUrl={e.item.imagePreview || e.item.nftFileUrl}
                    name={e.item.tokenName}
                    assetsYouHave={e.item.balance}
                    totalAssets={e.item.total}
                    onClick={() =>
                      props.navigation.navigate(ROUTES.NFTITEMHISTORY, {
                        screen: 'NftItemHistory',
                        params: {
                          item: e.item,
                          userWalletAddress: anotherUserWalletAddress,
                        },
                      })
                    }
                    nftId={e.item.nftId}
                    mimetype={e.item.nftMimetype}
                    onAssetPress={() => {
                      setMediaModalData({
                        open: true,
                        url: e.item.nftFileUrl,
                        mimetype: e.item.nftMimetype,
                      });
                    }}
                    item={e.item}
                    index={e.index}
                  />
                )}
                nestedScrollEnabled={true}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
          </View>
        </View>
      );
    }

    if (activeTab === 1) {
      return (
        <SafeAreaView style={{paddingBottom: '100%'}}>
          <TransactionListTab
            transactions={anotherUserTransaction}
            walletAddress={loginStore.anotherUserWalletAddress}
            onEndReached={() => {
              if (anotherUserTransaction.length < walletStore.total) {
                walletStore.fetchTransaction(
                  anotherUserWalletAddress,
                  loginStore.userToken,
                  false,
                  walletStore.limit,
                  walletStore.offset,
                );
              }
            }}
          />
        </SafeAreaView>
      );
    }
    if (activeTab === 2) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Button
            bg={'#114592'}
            padding={5}
            w={wp('51%')}
            h={hp('6.7%')}
            borderRadius={5}
            fontFamily={textStyles.boldFont}
            fontSize={hp('2.21%')}
            color={'#FFFF'}
            onPress={() => {
              Linking.openURL(
                'https://getcybercars.page.link/?link=https%3A%2F%2Fgetcybercars.page.link%2F%3Frequest%3Dgarage%26userId%3D0x7540c37B389cBd95f6d7b89c6f01f4131cFF2088&apn=com.getcybercars.cybercars&amv=0&ibi=com.getcybercars.cybercars&imv=0&isi=1546094906',
              );
            }}>
            3D Garage
          </Button>
        </View>
      );
    }
  };

  const {navigation} = props;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{backgroundColor: primaryDarkColor, flex: 1}}>
        {/* <CustomHeader
          // isQR={true}
          title="User's profile"
          onQRPressed={() => this.QRPressed()}
          navigation={navigation}
        /> */}

        <SecondaryHeader title={"User's profile"} />

        <View style={{zIndex: +1, alignItems: 'center'}}>
          <View
            style={{
              width: hp('10.46%'),
              height: hp('10.46%'),
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isLoadingVCard ? 'white' : primaryColor,
              borderRadius: hp('10.46%') / 2,
            }}>
            <SkeletonContent
              containerStyle={{alignItems: 'center'}}
              layout={firstLayout}
              isLoading={isLoadingVCard}>
              {loginStore.anotherUserAvatar ? (
                <Image
                  source={{uri: loginStore.anotherUserAvatar}}
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
                  }}>
                  {anotherUserFirstname[0] + anotherUserLastname[0]}
                </Text>
              )}
            </SkeletonContent>
          </View>
        </View>
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
              <SkeletonContent
                containerStyle={{width: wp('100%'), alignItems: 'center'}}
                layout={[
                  {width: wp('30%'), height: hp('2.216%'), marginBottom: 6},
                ]}
                isLoading={isLoadingVCard}>
                <Text
                  style={{
                    fontSize: hp('2.216%'),
                    fontFamily: textStyles.mediumFont,
                    color: '#000000',
                  }}>
                  {anotherUserFirstname} {anotherUserLastname}
                </Text>
              </SkeletonContent>
              <View
                style={{padding: hp('4%'), paddingBottom: 0, paddingTop: 0}}>
                <View
                  style={{
                    padding: hp('4%'),
                    paddingBottom: 0,
                    paddingTop: 0,
                  }}>
                  <SkeletonContent
                    containerStyle={{width: wp('100%'), alignItems: 'center'}}
                    layout={[{width: wp('60%'), height: 70, marginBottom: 6}]}
                    isLoading={isLoadingVCard}>
                    <Text
                      style={{
                        fontSize: hp('2.23%'),
                        fontFamily: textStyles.regularFont,
                        textAlign: 'center',
                        color: primaryColor,
                      }}>
                      {anotherUserDescription}
                    </Text>
                    <TouchableOpacity
                      onPress={onDirectChatPress}
                      style={{
                        fontSize: hp('2.23%'),
                        fontFamily: textStyles.regularFont,
                        textAlign: 'center',
                        color: '0000004D',
                      }}>
                      <HStack alignItems={'center'}>
                        <Ionicons
                          name="chatbubble-ellipses"
                          size={hp('1.7%')}
                          color={'white'}
                        />

                        <Text style={{color: 'white', marginLeft: 5}}>
                          Chat
                        </Text>
                      </HStack>
                    </TouchableOpacity>
                  </SkeletonContent>
                </View>
              </View>
            </View>

            <View>
              <View style={{padding: wp('4%')}}>
                <SkeletonContent
                  isLoading={isLoading}
                  containerStyle={{
                    width: '100%',
                    alignItems: isLoading ? 'center' : null,
                  }}
                  layout={[
                    {width: wp('90%'), height: hp('2.216%'), marginBottom: 6},
                  ]}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onLayout={event => setXTabOne(event.nativeEvent.layout.x)}
                      onPress={() => setActiveTab(0)}>
                      <Animated.Text
                        style={{
                          fontSize: hp('1.97%'),
                          fontFamily: textStyles.boldFont,
                          color: activeTab === 0 ? '#000000' : '#0000004D',
                        }}>
                        Assets ({assetCount})
                      </Animated.Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{marginLeft: 20}}
                      onLayout={event => setXTabTwo(event.nativeEvent.layout.x)}
                      onPress={() => setActiveTab(1)}>
                      <Animated.Text
                        style={{
                          fontSize: hp('1.97%'),
                          fontFamily: textStyles.boldFont,
                          color: activeTab === 1 ? '#000000' : '#0000004D',
                        }}>
                        Transactions ({transactionCount})
                      </Animated.Text>
                    </TouchableOpacity>
                  </View>
                </SkeletonContent>

                {isLoading ? null : (
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
                )}
              </View>
              <SkeletonContent
                isLoading={isLoading}
                containerStyle={{
                  width: '100%',
                  padding: isLoading ? hp('3%') : null,
                  alignItems: isLoading ? 'center' : null,
                }}
                layout={[
                  {width: wp('90%'), height: hp('30%'), marginBottom: 6},
                ]}>
                {loadTabContent({
                  activeTab,
                  coinData,
                  anotherUserTransaction,
                  anotherUserWalletAddress,
                  activeAssetTab,
                  setActiveAssetTab,
                  itemsData,
                  itemsBalance,
                  navigation: props.navigation,
                })}
              </SkeletonContent>
            </View>
          </View>
        </View>
      </View>
      <NftMediaModal
        modalVisible={mediaModalData.open}
        closeModal={() => setMediaModalData(prev => ({...prev, open: false}))}
        url={mediaModalData.url}
        mimetype={mediaModalData.mimetype}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  tokenIconStyle: {
    height: hp('3%'),
    width: hp('3%'),
  },
  tabZeroContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    height: hp('4.9%'),
  },
  tokenTextAndSymbolContainer: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenNameContainer: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeAreaViewStyle: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainContainerStyle: {
    backgroundColor: primaryDarkColor,
    flex: 1,
  },
  profileMainContainerStyle: {
    zIndex: +1,
    alignItems: 'center',
  },
  profileInnerContainerStyle: {
    width: hp('10.46%'),
    height: hp('10.46%'),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp('10.46%') / 2,
  },
  profileImageStyle: {
    height: hp('10.46%'),
    width: hp('10.46%'),
    borderRadius: hp('10.46%') / 2,
  },
  profileImageInitialsTextStyle: {
    fontSize: 40,
    color: 'white',
  },
  bodyMainContainerStyle: {
    flex: 1,
    marginTop: hp('5.5%'),
  },
  bodyInnerContainerStyle: {
    paddingTop: hp('2.4%'),
    backgroundColor: '#FBFBFB',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    height: hp('75%'),
  },
  profileNameSkeletonContainerStyle: {
    width: wp('100%'),
    alignItems: 'center',
  },
  profileNameTextStyle: {
    fontSize: hp('2.216%'),
    fontFamily: textStyles.mediumFont,
    color: '#000000',
  },
  nameAndDescriptionContainerStyle: {
    alignItems: 'center',
    marginTop: hp('5.54%'),
  },
  descriptionContainerStyle: {
    padding: hp('4%'),
    paddingBottom: 0,
    paddingTop: 0,
  },
  descriptionSkeletonContainerStyle: {
    width: wp('100%'),
    alignItems: 'center',
  },
  descriptionTextStyle: {
    fontSize: hp('2.23%'),
    fontFamily: textStyles.regularFont,
    textAlign: 'center',
    color: primaryDarkColor,
  },
  contentContainerStyle: {
    padding: wp('4%'),
  },
  contentSkeletonContainerStyle: {},
});

export default OtherUserProfileScreen;
