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
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import TransactionListTab from '../components/TransactionListComponent';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomHeader from '../components/shared/customHeader';
import {CommonButton} from '../components/shared/customButtons';
import {Swipeable} from 'react-native-gesture-handler';
import {commonColors, textStyles, coinImagePath, itemsTransfersAllowed} from '../../docs/config';


const {primaryColor, primaryDarkColor} = commonColors;
const {boldFont, lightFont, regularFont} = textStyles;

const handleSlide = (type, translateX, textColorAnim) => {
  textColorAnim.setValue(0);
  Animated.spring(translateX, {
    toValue: type,
    duration: 500,
  }).start();
  Animated.timing(textColorAnim, {
    toValue: 1,
    duration: 700,
  }).start();
};

const renderItem = ({item, index}) => (
  <Item
    tokenSymbol={item.tokenSymbol}
    tokenName={item.tokenName}
    balance={item.balance}
    index={index}
  />
);

const Item = ({tokenSymbol, tokenName, balance, index}) => (
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
        <Image
          source={coinImagePath}
          style={styles.tokenIconStyle}
        />

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
const RenderAssetItem = ({item, index, onClick, selectedItem}) => (
  <AssetItem
    image={item.nftFileUrl}
    name={item.tokenName}
    assetsYouHave={item.balance}
    totalAssets={item.total}
    onClick={onClick}
    selectedItem={selectedItem}
    nftId={item.nftId}
    // balance={item.balance._hex ? parseInt(item.balance._hex, 16) : item.balance}
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

const loadTabContent = props => {
  // console.log(props,"asdasdasgbdfb")
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
        {/* <View style={{padding: hp('3%'), paddingBottom: 0, paddingTop: 0}}> */}
        <View
          style={{
            padding: wp('4%'),
            flexDirection: 'row',
            paddingBottom: 0,
            paddingTop: 0,
          }}>
          <TouchableOpacity
            // onLayout={event =>
            //   setXCoinTabOne( event.nativeEvent.layout.x)
            // }
            // ref={this.state.ref}
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
            {itemsTransfersAllowed && <TouchableOpacity
            // onLayout={event =>
            //   this.setState({xCoinTabTwo: event.nativeEvent.layout.x})
            // }
            // ref={ref => (this.coinRef = ref)}
            onPress={() => setActiveAssetTab(1)}>
            <Animated.Text
              style={{
                fontSize: hp('1.97%'),
                fontFamily: boldFont,
                color: activeAssetTab === 1 ? '#000000' : '#0000004D',
              }}>
              Items ({itemsBalance})
            </Animated.Text>
          </TouchableOpacity>}
          {/* </View> */}
        </View>
        <View style={{marginTop: hp('1.47%'), height: hp('43%')}}>
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
              nestedScrollEnabled={true}
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
                    props.navigation.navigate('NftItemHistoryComponent', {
                      screen: 'NftItemHistory',
                      params: {
                        item: e.item,
                        userWalletAddress: anotherUserWalletAddress,
                      },
                    })
                  }
                  selectedItem
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
              nestedScrollEnabled={true}
            />
          )}
        </View>

        {/* <Text
          style={{fontSize:hp("1.97"), color:"#000000", fontFamily:"Montserrat-Bold"}}>
            Items <Text style={{fontSize:hp("1.47%"), color:"#000000", fontFamily:"Montserrat-Medium"}}>({coinBalance})</Text></Text>
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
      <SafeAreaView style={{paddingBottom: hp('72%')}}>
        <TransactionListTab
          transactions={anotherUserTransaction}
          walletAddress={anotherUserWalletAddress}
        />
      </SafeAreaView>
    );
  }
  if (activeTab === 2) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <CommonButton
          style={{
            backgroundColor: '#114592',
            padding: 5,
            width: wp('51%'),
            height: hp('6.7%'),
            borderRadius: 5,
            fontFamily: lightFont,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() =>
            Linking.openURL(
              'https://getcybercars.page.link/?link=https%3A%2F%2Fgetcybercars.page.link%2F%3Frequest%3Dgarage%26userId%3D0x7540c37B389cBd95f6d7b89c6f01f4131cFF2088&apn=com.getcybercars.cybercars&amv=0&ibi=com.getcybercars.cybercars&imv=0&isi=1546094906',
            )
          }
          buttonText="3D Garage"
          textStyle={{
            fontSize: hp('2.21%'),
            color: '#FFFFFF',
            fontFamily: boldFont,
          }}
        />
      </View>
    );
  }
};

function AnotherProfile(props) {
  const allReducers = useSelector(state => state);
  const loginReducerData = allReducers.loginReducer;
  const walletReducerData = allReducers.walletReducer;

  const [anotherUserAvatar, setAnotherUserAvatar] = useState(null);
  const [anotherUserFirstname, setAnotherUserFirstname] = useState('null');
  const [anotherUserLastname, setAnotherUserLastname] = useState('null');
  const [anotherUserDescription, setAnotherUserDescription] = useState(null);
  const [anotherUserWalletAddress, setAnotherUserWalletAddress] = useState(
    null,
  );
  const [coinData, setCoinData] = useState(null);
  const [itemsData, setItemsData] = useState([]);

  const [anotherUserTransaction, setAnotherUserTransaction] = useState(null);
  const [transactionCount, setTransactionCount] = useState(null);

  const [activeTab, setActiveTab] = useState(0);
  const [activeAssetTab, setActiveAssetTab] = useState(0);

  const [xTabOne, setXTabOne] = useState(0);
  const [xTabTwo, setXTabTwo] = useState(0);
  const [xTabThree, setXTabThree] = useState(0);
  const [xCoinTabOne, setXCoinTabOne] = useState(0);
  const [xCoinTabTwo, setXCoinTabTwo] = useState(0);

  const [translateX, setTranslateX] = useState(new Animated.Value(0));
  const [textColorAnim, setTextColorAnim] = useState(new Animated.Value(0));

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVCard, setIsLoadingVCard] = useState(true);

  const [assetCount, setAssetCount] = useState(1);
  const [itemsBalance, setItemsBalance] = useState(0);

  useEffect(() => {
    handleSlide(
      activeTab === 0 ? xTabOne : activeTab === 1 ? xTabTwo : xTabThree,
      translateX,
      textColorAnim,
    );
  }, [activeTab]);

  useEffect(() => {
    setTimeout(() => {
      setAnotherUserWalletAddress(loginReducerData.anotherUserWalletAddress);
      let balance = 0;
      let allTransactions = walletReducerData.anotherUserTransaction
        // .reverse()
        .map(item => {
          console.log('sdfdsfsdfdsfsdfsdsfsafsddfw4er', walletReducerData.anotherUserTransaction);
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
            console.log(item.receiverBalance, 'dfdsfsdfdsfsdfds');
            balance = balance + item.value;
            return item;
          }
        });

      setAnotherUserTransaction(allTransactions);

      setTransactionCount(walletReducerData.anotherUserTransaction.length);
      setIsLoading(false);
      console.log(
        'aaffdsfdsf',
        allReducers.walletReducer.anotherUserTransaction,
      );
    }, 2500);
  }, [allReducers.walletReducer.anotherUserTransaction]);

  useEffect(() => {
    setTimeout(() => {
      let updatedCoinBalance = 0;
      if (walletReducerData.anotherUserBalance.length > 0) {
        setCoinData(
          walletReducerData.anotherUserBalance.filter(
            item => item.tokenSymbol !== 'ETHD' && item.tokenType !== 'NFT',
          ),
        );
        setItemsData(
          walletReducerData.anotherUserBalance
            .filter(item => item.tokenType === 'NFT' && item.balance > 0)
            .reverse(),
        );
        coinData
          ? coinData.map(item => {
              console.log(coinData, 'dasdasd');

              updatedCoinBalance =
                updatedCoinBalance + parseFloat(item.balance);
            })
          : null;

        setAssetCount(itemsBalance + updatedCoinBalance);
      }
    }, 2500);
  }, [allReducers.walletReducer.anotherUserBalance]);
  useEffect(() => {
    let updatedCoinBalance = 0;
    let updatedItemsBalance = 0;

    coinData
      ? coinData.map(item => {
          updatedCoinBalance = updatedCoinBalance + parseFloat(item.balance);
        })
      : null;
    itemsData.map(item => {
      console.log(item, 'ssssssssss');

      updatedItemsBalance = updatedItemsBalance + parseFloat(item.balance);
    });
    setItemsBalance(updatedItemsBalance);
    setAssetCount((itemsTransfersAllowed ? updatedItemsBalance : 0) + updatedCoinBalance);

    return () => {};
  }, [itemsData, coinData]);

  useEffect(() => {
    setTimeout(() => {
      setAnotherUserAvatar(loginReducerData.anotherUserAvatar);
      setAnotherUserFirstname(loginReducerData.anotherUserFirstname);
      setAnotherUserLastname(loginReducerData.anotherUserLastname);
      setAnotherUserDescription(loginReducerData.anotherUserDescription);
      setIsLoadingVCard(false);
    }, 2000);
  }, [allReducers.loginReducer.anotherUserAvatar]);

  useEffect(() => {
    return function cleanup() {
      setAnotherUserAvatar(null);
      setAnotherUserFirstname('null');
      setAnotherUserLastname('null');
      setAnotherUserDescription(null);
      setAnotherUserWalletAddress(null);
      setCoinData(null);
      setAnotherUserTransaction(null);
      setTransactionCount(null);
      setIsLoading(true);
      setIsLoadingVCard(true);
      setItemsData([]);
    };
  }, []);

  const {navigation} = props;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{backgroundColor: primaryDarkColor, flex: 1}}>
        <CustomHeader
          // isQR={true}
          title="User's profile"
          onQRPressed={() => this.QRPressed()}
          navigation={navigation}
        />

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
              {anotherUserAvatar ? (
                <Image
                  source={{uri: anotherUserAvatar}}
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
                    fontFamily: 'Montserrat-Medium',
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
                        fontFamily: 'Montserrat-Regular',
                        textAlign: 'center',
                        color: primaryColor,
                      }}>
                      {anotherUserDescription}
                    </Text>
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
          {/* <ModalList
              type={this.state.modalType}
              show={this.state.showModal}
              extraData={this.state.extraData}
              closeModal={this.closeModal}
            /> */}
        </View>
      </View>
    </SafeAreaView>
  );
}

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

export default AnotherProfile;
