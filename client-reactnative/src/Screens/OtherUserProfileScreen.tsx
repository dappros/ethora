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
import {Button, HStack, VStack} from 'native-base';
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
import {
  filterNftBalances,
  mapTransactions,
  produceNfmtItems,
} from '../stores/walletStore';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const {primaryColor, primaryDarkColor} = commonColors;
const {boldFont} = textStyles;

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
  <HStack
    paddingX={10}
    justifyContent={'space-between'}
    alignItems={'center'}
    width={'full'}>
    <HStack justifyContent={'center'} alignItems={'center'}>
      <Image source={coinImagePath} style={styles.tokenIconStyle} />

      <Text style={styles.coinsItemText}>{/* {tokenSymbol} */}</Text>
    </HStack>
    <VStack justifyContent={'center'} alignItems={'center'}>
      <Text style={styles.coinsItemText}>{coinReplacedName}</Text>
    </VStack>
    <VStack justifyContent={'center'} alignItems={'center'}>
      <Text style={[styles.coinsItemText]}>
        {parseFloat(balance).toFixed(0)}
      </Text>
    </VStack>
  </HStack>
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

const OtherUserProfileScreen = observer(({navigation, route}) => {
  const {loginStore, walletStore, apiStore, chatStore, otherUserStore} =
    useStores();

  const {setOffset, setTotal, clearPaginationData, anotherUserBalance} =
    walletStore;

  const [coinData, setCoinData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [collections, setCollections] = useState([]);

  const [activeTab, setActiveTab] = useState(0);
  const [activeAssetTab, setActiveAssetTab] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVCard, setIsLoadingVCard] = useState(true);

  const [assetCount, setAssetCount] = useState(1);
  const [itemsBalance, setItemsBalance] = useState(0);
  const [mediaModalData, setMediaModalData] = useState({
    open: false,
    url: '',
    mimetype: '',
  });
  const anotherUserWalletAddress = loginStore.anotherUserWalletAddress;
  const linkToken = route.params?.linkToken;
  const anotherUserTransaction = walletStore.anotherUserTransaction;
  const transactionCount = anotherUserTransaction.length;

  const underlineOffset = useSharedValue(0);

  const animatedTranslate = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(underlineOffset.value, {
            duration: 350,
            easing: Easing.ease,
          }),
        },
      ],
    };
  }, [underlineOffset]);

  useEffect(() => {
    setOffset(0);
    setTotal(0);

    return () => {
      clearPaginationData();
      setCoinData([]);
      setIsLoading(true);
      setIsLoadingVCard(true);
      setItemsData([]);
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
      loginStore.anotherUserFirstname,
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
  const calculateBalances = () => {
    setItemsBalance(
      itemsData.reduce((acc, item) => (acc += parseFloat(item.balance)), 0),
    );
    setAssetCount(
      coinData.reduce(
        (acc, item) => (acc += parseFloat(item.balance)) + itemsBalance,
        0,
      ),
    );
  };
  useEffect(() => {
    if (anotherUserBalance?.length > 0) {
      const nfmtItems = produceNfmtItems(anotherUserBalance);
      setCoinData(
        anotherUserBalance.filter(
          (item: any) => item.tokenName === coinsMainName,
        ),
      );
      setItemsData(
        anotherUserBalance

          .filter(filterNftBalances)
          .concat(nfmtItems)

          .reverse(),
      );
      setCollections(walletStore.anotherUserNfmtCollections);

      calculateBalances();
    }
  }, [anotherUserBalance]);

  useEffect(() => {
    calculateBalances();

    return () => {};
  }, [itemsData, coinData]);
  const getBalances = async () => {
    await walletStore.fetchTransaction(
      loginStore.anotherUserWalletAddress,
      10,
      0,
    );
    await walletStore.fetchOtherUserWalletBalance(
      loginStore.anotherUserWalletAddress,
      loginStore.userToken,
      linkToken || '',
    );
    setIsLoading(false);
    setIsLoadingVCard(false);
  };
  useEffect(() => {
    getBalances();
  }, [loginStore.anotherUserWalletAddress]);

  const onTransactionNumberPress = () => {
    setActiveTab(1);
  };
  const loadTabContent = () => {
    if (activeTab === 0) {
      return (
        <View style={{marginTop: hp('1%')}}>
          <HStack paddingX={wp('4%')}>
            {/* <TouchableOpacity
              onPress={() => setActiveAssetTab(0)}
              style={{marginRight: 20}}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeAssetTab === 0 ? '#000000' : '#0000004D',
                  },
                ]}>
                Coins ({parseFloat(assetCount - itemsBalance).toFixed(0)})
              </Text>
            </TouchableOpacity> */}
            {itemsTransfersAllowed && collections.length > 0 && (
              <TouchableOpacity
                onPress={() => setActiveAssetTab(1)}
                style={{marginRight: 20}}>
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: activeAssetTab === 1 ? '#000000' : '#0000004D',
                    },
                  ]}>
                  Items ({itemsBalance})
                </Text>
              </TouchableOpacity>
            )}
            {collections.length > 0 && (
              <TouchableOpacity onPress={() => setActiveAssetTab(2)}>
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: activeAssetTab === 2 ? '#000000' : '#0000004D',
                    },
                  ]}>
                  Collections ({collections.length})
                </Text>
              </TouchableOpacity>
            )}
          </HStack>
          <View style={{marginBottom: hp('33%')}}>
            {activeAssetTab === 1 && itemsData.length === 0 && (
              <FlatList
                data={coinData}
                nestedScrollEnabled={true}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
            {activeAssetTab === 1 && (
              <FlatList
                data={itemsData}
                renderItem={e => (
                  <NftListItem
                    assetUrl={e.item.imagePreview || e.item.nftFileUrl}
                    name={e.item.tokenName}
                    assetsYouHave={e.item.balance}
                    totalAssets={e.item.total}
                    onClick={() =>
                      navigation.navigate(ROUTES.NFTITEMHISTORY, {
                        screen: 'NftItemHistory',
                        params: {
                          item: e.item,
                          userWalletAddress: anotherUserWalletAddress,
                        },
                      })
                    }
                    traitsEnabled
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
            {activeAssetTab === 2 && (
              <FlatList
                data={collections}
                renderItem={e => (
                  <NftListItem
                    assetUrl={e.item.imagePreview || e.item.nftFileUrl}
                    name={e.item.tokenName}
                    assetsYouHave={e.item.balance}
                    totalAssets={e.item.total}
                    nftId={e.item.nftId}
                    mimetype={e.item.nftMimetype}
                    onClick={() =>
                      navigation.navigate(ROUTES.NFTITEMHISTORY, {
                        screen: 'NftItemHistory',
                        params: {
                          item: e.item,
                          userWalletAddress: anotherUserWalletAddress,
                        },
                      })
                    }
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
        <View style={{paddingBottom: hp('57%')}}>
          <TransactionListTab
            transactions={anotherUserTransaction}
            walletAddress={loginStore.anotherUserWalletAddress}
            onEndReached={() => {
              if (anotherUserTransaction.length < walletStore.total) {
                walletStore.fetchTransaction(
                  anotherUserWalletAddress,
                  walletStore.limit,
                  walletStore.offset,
                );
              }
            }}
          />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{backgroundColor: primaryDarkColor, flex: 1}}>
        <SecondaryHeader
          title={"User's profile"}
          onBackPress={() =>
            activeTab === 1 ? setActiveTab(0) : navigation.goBack()
          }
        />

        <View style={{zIndex: +1, alignItems: 'center'}}>
          <HStack
            width={hp('10.46%')}
            height={hp('10.46%')}
            position={'absolute'}
            justifyContent={'center'}
            alignItems={'center'}
            bgColor={primaryColor}
            borderRadius={hp('10.46%') / 2}>
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
                  {loginStore.anotherUserFirstname[0] +
                    loginStore.anotherUserLastname[0]}
                </Text>
              )}
            </SkeletonContent>
          </HStack>
        </View>
        <View style={{flex: 1, marginTop: hp('5.5%')}}>
          <VStack
            // paddingTop={hp('2.4%')}
            bgColor={'#FBFBFB'}
            borderTopLeftRadius={30}
            borderTopRightRadius={30}
            height={hp('75%')}>
            <View style={{alignItems: 'center', marginTop: hp('5.54%')}}>
              <SkeletonContent
                containerStyle={{width: wp('100%'), alignItems: 'center'}}
                layout={[
                  {width: wp('30%'), height: hp('2.216%'), marginBottom: 6},
                ]}
                isLoading={isLoadingVCard}>
                <HStack alignItems={'center'}>
                  <Text
                    style={{
                      fontSize: hp('2.216%'),
                      fontFamily: textStyles.mediumFont,
                      color: '#000000',
                    }}>
                    {loginStore.anotherUserFirstname}{' '}
                    {loginStore.anotherUserLastname}
                  </Text>
                  <TouchableOpacity onPress={onTransactionNumberPress} style={{marginLeft: 5}}>
                    <Text
                      style={{
                        fontSize: hp('2.216%'),
                        fontFamily: textStyles.mediumFont,
                        color: commonColors.primaryColor,
                      }}>
                      (
                      <Text
                        style={{
                          fontSize: hp('2.216%'),
                          fontFamily: textStyles.mediumFont,
                          color: commonColors.primaryColor,
                          textDecorationLine: 'underline',
                        }}>
                        {anotherUserTransaction.length}
                      </Text>
                      )
                    </Text>
                  </TouchableOpacity>
                </HStack>
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
                    <Text style={styles.descriptionText}>
                      {otherUserStore.description}
                    </Text>
                    <TouchableOpacity
                      onPress={onDirectChatPress}
                      style={styles.chatButton}>
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
                  {/* <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => {
                        setActiveTab(0);
                        underlineOffset.value = 0;
                      }}>
                      <Text
                        style={[
                          styles.tabText,
                          {
                            color: activeTab === 0 ? '#000000' : '#0000004D',
                          },
                        ]}>
                        Assets ({itemsBalance === 0 ? assetCount : itemsBalance}
                        )
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{marginLeft: 20}}
                      onPress={() => {
                        setActiveTab(1);
                        underlineOffset.value = 110;
                      }}>
                      <Text
                        style={[
                          styles.tabText,
                          {
                            color: activeTab === 1 ? '#000000' : '#0000004D',
                          },
                        ]}>
                        Transactions ({transactionCount})
                      </Text>
                    </TouchableOpacity>
                  </View> */}
                </SkeletonContent>

                {/* {isLoading ? null : (
                  <Animated.View
                    style={[
                      {
                        width: wp('10%'),
                        borderWidth: 1,
                      },
                      animatedTranslate,
                    ]}
                  />
                )} */}
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
                {loadTabContent()}
              </SkeletonContent>
            </View>
          </VStack>
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

  mainContainerStyle: {
    backgroundColor: primaryDarkColor,
    flex: 1,
  },
  tabText: {
    fontSize: hp('1.97%'),
    fontFamily: boldFont,
  },
  coinsItemText: {
    fontFamily: textStyles.mediumFont,
    fontSize: hp('1.97%'),
    color: '#000000',
  },
  chatButton: {
    fontSize: hp('2.23%'),
    fontFamily: textStyles.regularFont,
    textAlign: 'center',
    color: '0000004D',
    backgroundColor: commonColors.primaryDarkColor,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  descriptionText: {
    fontSize: hp('2.23%'),
    fontFamily: textStyles.regularFont,
    textAlign: 'center',
    color: primaryColor,
  },
});

export default OtherUserProfileScreen;
