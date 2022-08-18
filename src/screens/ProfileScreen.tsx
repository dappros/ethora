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
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  commonColors,
  textStyles,
  coinImagePath,
  itemsTransfersAllowed,
  coinReplacedName,
} from '../../docs/config';
import {NftListItem} from '../components/Transactions/NftListItem';
import {useStores} from '../stores/context';
import {Button} from 'native-base';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import {ROUTES} from '../constants/routes';
import TransactionsList from '../components/Transactions/TransactionsList';
import {NftMediaModal} from '../components/NftMediaModal';
import {observer} from 'mobx-react-lite';
import Hyperlink from 'react-native-hyperlink';
import parseChatLink from '../helpers/parseChatLink';
import {pattern1, pattern2} from '../helpers/chat/chatLinkpattern';
import openChatFromChatLink from '../helpers/chat/openChatFromChatLink';
import {useNavigation} from '@react-navigation/native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import ProfileModal from '../components/Modals/Profile/ProfileModal';
import {updateVCard} from '../xmpp/stanzas';
import axios from 'axios';
import {registerUserURL} from '../config/routesConstants';
import {showToast} from '../components/Toast/toast';
import QrModal from '../components/Modals/TransactionModal/TransactionModal';
import {modalTypes} from '../constants/modalTypes';
import {DOMAIN} from '../xmpp/xmppConstants';

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
          {coinReplacedName}
        </Text>
      </View>
      <View style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontFamily: textStyles.mediumFont,
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

export const ProfileScreen = observer((props: any) => {
  const {loginStore, walletStore, chatStore, apiStore} = useStores();

  const navigation = useNavigation();

  const {setOffset, setTotal, clearPaginationData, balance, transactions} =
    walletStore;

  const {
    userAvatar,
    userDescription,
    initialData,
    updateUserDisplayName,
    userToken,
  } = loginStore;

  const {firstName, lastName, walletAddress} = initialData;

  const [coinData, setCoinData] = useState([]);

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

  const [modalType, setModalType] = useState<'name' | 'description' | ''>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [qrModalVisible, setQrModalVisible] = useState<boolean>(false);
  const [extraQrData, setExtraQrData] = useState<string>("");

  const [isDescriptionEditable, setIsDescriptionEditable] =
    useState<boolean>(false);
  const [descriptionLocal, setDescriptionLocal] =
    useState<string>(userDescription);
  const [firstNameLocal, setFirstNameLocal] = useState<string>(firstName);
  const [lastNameLocal, setLastNameLocal] = useState<string>(lastName);
  const [userAvatarLocal, setUserAvatarLocal] = useState<string>(userAvatar);

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
    walletStore.fetchOwnTransactions(walletAddress, walletStore.limit, 0);
    walletStore.fetchWalletBalance(walletAddress, loginStore.userToken, true);

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
    walletStore.nftItems.map((item: any) => {
      updatedItemsBalance = updatedItemsBalance + parseFloat(item.balance);
    });
    setItemsBalance(updatedItemsBalance);
    setAssetCount(
      (itemsTransfersAllowed ? updatedItemsBalance : 0) + updatedCoinBalance,
    );

    return () => {};
  }, [walletStore.nftItem, coinData]);

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
        <View style={{paddingBottom: hp('63%')}}>
          <TransactionsList
            transactions={transactions}
            walletAddress={walletAddress}
            onEndReached={() => {
              if (transactions.length < walletStore.total) {
                walletStore.fetchOwnTransactions(
                  walletAddress,
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

  const onNamePressed = () => {
    setModalType('name');
    setModalVisible(true);
  };

  const onDescriptionPressed = () => {
    setIsDescriptionEditable(true);
    setModalType('description');
    setModalVisible(true);
  };

  //changes the user description locally
  const onDescriptionChange = (text: string) => {
    setDescriptionLocal(text);
  };

  //when user clicks on the backdrop of the modal
  const onBackdropPress = () => {
    setFirstNameLocal(firstName);
    setLastNameLocal(lastName);
    setDescriptionLocal(userDescription);
    setIsDescriptionEditable(!isDescriptionEditable);
    setModalVisible(false);
  };

  //changes the user's profile name locally
  const onNameChange = (type: 'firstName' | 'lastName', text: string) => {
    if (type === 'firstName') {
      setFirstNameLocal(text);
    } else {
      setLastNameLocal(text);
    }
  };

  const setDescription = () => {
    if (userAvatarLocal && descriptionLocal) {
      updateVCard(userAvatarLocal, descriptionLocal, chatStore.xmpp);
    }

    if (!descriptionLocal) {
      updateVCard(userAvatarLocal, 'No description', chatStore.xmpp);
    }
    setIsDescriptionEditable(false);
    setModalVisible(false);
  };

  const setNewName = () => {
    //call api to dapp server to change username
    //save in async storage
    //and then change in mobx store
    if (firstNameLocal) {
      const bodyData = {
        firstName: firstNameLocal,
        lastName: lastNameLocal,
      };
      updateUserDisplayName(bodyData);
    } else {
      setFirstNameLocal(firstName);
      showToast('error', 'Error', 'First name is required', 'top');
    }
    setModalVisible(false);
  };

  const handleChatLinks = (url: string) => {
    const chatJid = parseChatLink(url);

    //argument url can be a chatlink or simple link
    //first check if url is a chat link if yes then open chatlink else open the link via browser
    if (pattern1.test(url) || pattern2.test(url)) {
      openChatFromChatLink(chatJid, walletAddress, navigation, chatStore.xmpp);
    } else {
      Linking.openURL(url);
    }
  };

  const QRPressed = () => {
    const xmppId = loginStore.initialData.xmppUsername + '@' + DOMAIN;
    const profileLink = `=profileLink&firstName=${firstName}&lastName=${lastName}&walletAddress=${walletAddress}&xmppId=${xmppId}`;
    setExtraQrData({link:profileLink,mode:'profile'});
    setQrModalVisible(true);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{backgroundColor: primaryDarkColor, flex: 1}}>
        <SecondaryHeader
          title={"User's profile"}
          isQR
          onQRPressed={QRPressed}
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
              isLoading={!userAvatarLocal}>
              {userAvatarLocal ? (
                <Image
                  source={{uri: userAvatarLocal}}
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
                  {firstNameLocal[0] + lastNameLocal[0]}
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
                isLoading={!firstNameLocal}>
                <TouchableOpacity onPress={onNamePressed}>
                  <Text
                    style={{
                      fontSize: hp('2.216%'),
                      fontFamily: textStyles.mediumFont,
                      color: '#000000',
                    }}>
                    {firstNameLocal} {lastNameLocal}
                  </Text>
                </TouchableOpacity>
              </SkeletonContent>
              <View
                style={{padding: hp('4%'), paddingBottom: 0, paddingTop: 0}}>
                <View
                  style={{
                    padding: hp('4%'),
                    paddingBottom: 0,
                    paddingTop: 0,
                  }}>
                  <Hyperlink
                    onPress={url => handleChatLinks(url)}
                    linkStyle={{
                      color: '#2980b9',
                      fontSize: hp('1.8%'),
                      textDecorationLine: 'underline',
                    }}>
                    <Text
                      style={{
                        fontSize: hp('2.23%'),
                        fontFamily: textStyles.regularFont,
                        textAlign: 'center',
                        color: primaryColor,
                      }}>
                      {descriptionLocal && !isDescriptionEditable
                        ? descriptionLocal
                        : 'Add your description'}
                    </Text>
                    <TouchableOpacity
                      onPress={onDescriptionPressed}
                      style={{alignItems: 'center', margin: 10}}>
                      <AntIcon
                        name="edit"
                        color={commonColors.primaryColor}
                        size={hp('2%')}
                      />
                    </TouchableOpacity>
                  </Hyperlink>
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
                  itemsData: walletStore.nftItems,
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
      <ProfileModal
        description={descriptionLocal}
        firstName={firstNameLocal}
        lastName={lastNameLocal}
        isDescriptionEditable={isDescriptionEditable}
        isVisible={modalVisible}
        modalType={modalType}
        onBackdropPress={onBackdropPress}
        onDescriptionChange={onDescriptionChange}
        onNameChange={onNameChange}
        setDescription={setDescription}
        setNewName={setNewName}
      />
      <NftMediaModal
        modalVisible={mediaModalData.open}
        closeModal={() => setMediaModalData(prev => ({...prev, open: false}))}
        url={mediaModalData.url}
        mimetype={mediaModalData.mimetype}
      />
      <QrModal
        type={modalTypes.GENERATEQR}
        closeModal={() => setQrModalVisible(false)}
        extraData={extraQrData}
        isVisible={qrModalVisible}
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
