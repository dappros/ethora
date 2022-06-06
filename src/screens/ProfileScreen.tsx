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
import Icon from 'react-native-vector-icons/FontAwesome';
// import {useDispatch, useSelector} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import CustomHeader from '../components/shared/customHeader';
// import {CommonButton} from '../components/shared/customButtons';
import {
  commonColors,
  textStyles,
  coinImagePath,
  itemsTransfersAllowed,
} from '../../docs/config';
import {underscoreManipulation} from '../helpers/underscoreLogic';
// import {
//   clearPaginationData,
//   fetchTransaction,
//   setOffset,
//   setTotal,
// } from '../actions/wallet';
import {NftListItem} from '../components/Transactions/NftListItem';
import {useStores} from '../stores/context';
import {Button} from 'native-base';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import {ROUTES} from '../constants/routes';
import TransactionsList from '../components/Transactions/TransactionsList';
import {NftMediaModal} from '../components/NftMediaModal';

const {primaryColor, primaryDarkColor} = commonColors;
const {boldFont, lightFont, regularFont} = textStyles;

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
            fontFamily: 'Montserrat-Regular',
            fontSize: hp('1.97%'),
            color: '#000000',
          }}>
          {/* {tokenSymbol} */}
        </Text>
      </View>
      <View style={{flex: 0.6, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontFamily: 'Montserrat-Regular',
            fontSize: hp('1.97%'),
            color: '#000000',
          }}>
          {tokenName}
        </Text>
      </View>
      <View style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontFamily: 'Montserrat-Medium',
            fontSize: hp('1.97%'),
            color: '#000000',
          }}>
          {parseFloat(balance).toFixed(0)}
        </Text>
      </View>
    </View>
  </View>
);
const RenderAssetItem = ({
  item,
  index,
  onClick,
  selectedItem,
  onAssetPress,
}: {
  item: any;
  index: number;
  onClick: any;
  selectedItem: string;
  onAssetPress: () => void;
}) => (
  <NftListItem
    assetUrl={item.imagePreview || item.nftFileUrl}
    name={item.tokenName}
    assetsYouHave={item.balance}
    totalAssets={item.total}
    onClick={onClick}
    itemSelected={selectedItem}
    nftId={item.nftId}
    mimetype={item.nftMimetype}
    onAssetPress={onAssetPress}
    // balance={item.balance._hex ? parseInt(item.balance._hex, 16) : item.balance}
    item={item}
    index={index}
  />
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

const ProfileScreen = (props: any) => {
  const {loginStore, walletStore} = useStores();

  const {setOffset, setTotal, clearPaginationData, balance, transactions} =
    walletStore;

  const {userAvatar, userDescription, initialData} = loginStore;

  const {firstName, lastName, walletAddress} = initialData;

  const [coinData, setCoinData] = useState([]);
  const [itemsData, setItemsData] = useState([]);

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
    // walletStore.fetchOwnTransactions(
    //   walletAddress,

    //   walletStore.limit,
    //   walletStore.offset,
    // );
    return () => {
      clearPaginationData();
    };
  }, []);

  useEffect(() => {
    if (balance?.length > 0) {
      setCoinData(
        balance.filter(
          (item: any) =>
            item.tokenSymbol !== 'ETHD' && item.tokenType !== 'NFT',
        ),
      );
      setItemsData(
        balance
          .filter((item: any) => item.tokenType === 'NFT' && item.balance > 0)
          .reverse(),
      );

      setAssetCount(itemsBalance + coinData.length);
    }
  }, [balance]);

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

  const loadTabContent = (props: any) => {
    const {
      activeTab,
      coinData,
      transactions,
      walletAddress,
      activeAssetTab,
      itemsData,
      setActiveAssetTab,
      itemsBalance,
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
                  <RenderAssetItem
                    item={e.item}
                    index={e.index}
                    onClick={() =>
                      props.navigation.navigate(ROUTES.NFTITEMHISTORY, {
                        screen: 'NftItemHistory',
                        params: {
                          item: e.item,
                          userWalletAddress: walletAddress,
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
          <TransactionsList
            transactions={transactions.reverse()}
            walletAddress={walletAddress}
            onEndReached={() => {
              if (transactions.length < walletStore.total) {
                walletStore.fetchTransaction(
                  walletAddress,
                  loginStore.userToken,
                  true,
                  walletStore.limit,
                  walletStore.offset,
                );
              }
            }}
          />
        </SafeAreaView>
      );
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{backgroundColor: primaryDarkColor, flex: 1}}>
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
              isLoading={!userAvatar}>
              {userAvatar ? (
                <Image
                  source={{uri: userAvatar}}
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
                  {firstName[0] + lastName[0]}
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
                isLoading={!firstName}>
                <Text
                  style={{
                    fontSize: hp('2.216%'),
                    fontFamily: 'Montserrat-Medium',
                    color: '#000000',
                  }}>
                  {firstName} {lastName}
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
                    isLoading={!userDescription}>
                    <Text
                      style={{
                        fontSize: hp('2.23%'),
                        fontFamily: 'Montserrat-Regular',
                        textAlign: 'center',
                        color: primaryColor,
                      }}>
                      {userDescription}
                    </Text>
                  </SkeletonContent>
                </View>
              </View>
            </View>

            <View>
              <View style={{padding: wp('4%')}}>
                <SkeletonContent
                  isLoading={!assetCount}
                  containerStyle={{
                    width: '100%',
                    alignItems: !assetCount ? 'center' : null,
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
                          fontFamily: 'Montserrat-Bold',
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
                          fontFamily: 'Montserrat-Bold',
                          color: activeTab === 1 ? '#000000' : '#0000004D',
                        }}>
                        Transactions ({walletStore.transactions.length})
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
                isLoading={!transactions}
                containerStyle={{
                  width: '100%',
                  padding: !transactions ? hp('3%') : null,
                  alignItems: !transactions ? 'center' : null,
                }}
                layout={[
                  {width: wp('90%'), height: hp('30%'), marginBottom: 6},
                ]}>
                {loadTabContent({
                  activeTab,
                  coinData,
                  transactions,
                  walletAddress,
                  activeAssetTab,
                  setActiveAssetTab,
                  itemsData,
                  itemsBalance,
                  navigation: props.navigation,
                })}
              </SkeletonContent>
            </View>
          </View>
          {/* <ModalList
              type={this.state.modalType}
              show={this.state.showModal}
              extraData={this.state.extraData}
              closeModal={this.closeModal}
            /> */}
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
};

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
    fontFamily: 'Montserrat-Medium',
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
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    color: primaryDarkColor,
  },
  contentContainerStyle: {
    padding: wp('4%'),
  },
  contentSkeletonContainerStyle: {},
});

export default ProfileScreen;
