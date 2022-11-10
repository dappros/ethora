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
import {Button, HStack, VStack} from 'native-base';
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
import {showToast} from '../components/Toast/toast';
import QrModal from '../components/Modals/TransactionModal/TransactionModal';
import {modalTypes} from '../constants/modalTypes';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import DocumentPicker from 'react-native-document-picker';
import {changeUserData, fileUpload} from '../config/routesConstants';
import {uploadFiles} from '../helpers/uploadFiles';
import {underscoreManipulation} from '../helpers/underscoreLogic';
import {httpUploadPut} from '../config/apiService';
import {DocumentListItem} from '../components/Profile/DocumentListItem';

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
    itemSelected={!!selectedItem}
    nftId={item.nftId}
    mimetype={item.nftMimetype}
    onAssetPress={onAssetPress}
    traitsEnabled
    // balance={item.balance._hex ? parseInt(item.balance._hex, 16) : item.balance}
    item={item}
    index={index}
  />
);

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

  const coinData = walletStore.balance;

  const [activeTab, setActiveTab] = useState(0);
  const [activeAssetTab, setActiveAssetTab] = useState(1);

  const [assetCount, setAssetCount] = useState(0);
  const [itemsBalance, setItemsBalance] = useState(0);
  const [mediaModalData, setMediaModalData] = useState({
    open: false,
    url: '',
    mimetype: '',
  });

  const [modalType, setModalType] = useState<'name' | 'description' | ''>('');
  const [modalVisible, setModalVisible] = useState(false);

  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [extraQrData, setExtraQrData] = useState({link: '', mode: ''});

  const [isDescriptionEditable, setIsDescriptionEditable] = useState(false);
  const [descriptionLocal, setDescriptionLocal] = useState(userDescription);
  const [firstNameLocal, setFirstNameLocal] = useState(firstName);
  const [lastNameLocal, setLastNameLocal] = useState(lastName);
  const userAvatarLocal = userAvatar;
  const underlineOffset = useSharedValue(0);
  const [uploadedAvatar, setUploadedAvatar] = useState({
    _id: '',
    createdAt: '',
    expiresAt: 0,
    filename: '',
    isVisible: true,
    location: '',
    locationPreview: '',
    mimetype: '',
    originalname: '',
    ownerKey: '',
    size: 0,
    updatedAt: '',
    userId: '',
  });

  const animatedTranslate = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(underlineOffset.value, {
            duration: 300,
            easing: Easing.ease,
          }),
        },
      ],
    };
  }, [underlineOffset]);

  useEffect(() => {
    setOffset(0);
    setTotal(0);
    walletStore.fetchOwnTransactions(walletAddress, walletStore.limit, 0);
    walletStore.fetchWalletBalance(walletAddress, loginStore.userToken, true);
    walletStore.getDocuments(walletAddress);

    return () => {
      clearPaginationData();
    };
  }, []);
  useEffect(() => {
    setDescriptionLocal(userDescription);
  }, [loginStore.userDescription]);

  useEffect(() => {
    if (balance?.length > 0) {
      setAssetCount(itemsBalance + coinData.length);
    }
  }, [balance]);

  const calculateAssetsCount = () => {
    setItemsBalance(
      walletStore.nftItems.reduce(
        (acc, item) => (acc += parseFloat(item.balance)),
        0,
      ),
    );
    setAssetCount(
      coinData.reduce(
        (acc, item) => (acc += parseFloat(item.balance)) + itemsBalance,
        0,
      ),
    );
  };

  useEffect(() => {
    calculateAssetsCount();
    return () => {};
  }, [walletStore.nftItem, coinData]);

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
    type === 'firstName' ? setFirstNameLocal(text) : setLastNameLocal(text);
  };

  const setDescription = async () => {
    if (userAvatarLocal || descriptionLocal) {
      updateVCard(
        userAvatarLocal,
        descriptionLocal,
        firstName + ' ' + lastName,
        chatStore.xmpp,
      );
    }

    if (!descriptionLocal) {
      updateVCard(userAvatarLocal, 'No description', null, chatStore.xmpp);
    }
    const formData = new FormData();
    formData.append('description', descriptionLocal);
    const userRes = await httpUploadPut(
      apiStore.defaultUrl + changeUserData,
      formData,
      loginStore.userToken,
      console.log,
    );
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
      updateVCard(
        userAvatarLocal,
        descriptionLocal,
        firstName + ' ' + lastName,
        chatStore.xmpp,
      );
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
    const xmppId =
      loginStore.initialData.xmppUsername + '@' + apiStore.xmppDomains.DOMAIN;
    const profileLink = `=profileLink&firstName=${firstName}&lastName=${lastName}&walletAddress=${walletAddress}&xmppId=${xmppId}`;
    setExtraQrData({link: profileLink, mode: 'profile'});
    setQrModalVisible(true);
  };

  const sendFiles = async (data: any) => {
    try {
      const url = apiStore.defaultUrl + fileUpload;
      const response = await uploadFiles(data, loginStore.userToken, url);
      const file = response.results[0];
      setUploadedAvatar(file);
      const formData = new FormData();
      formData.append('description', descriptionLocal);
      formData.append('profileImage', file.location);
      const userRes = await httpUploadPut(
        apiStore.defaultUrl + changeUserData,
        formData,
        loginStore.userToken,
        console.log,
      );
      console.log(userRes.data);
      updateVCard(file.location, descriptionLocal, null, chatStore.xmpp);
    } catch (error) {
      console.log(error);
    }
  };
  const onAvatarPress = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      const formData = new FormData();
      formData.append('files', {
        name: res.name,
        type: res.type,
        uri: res.uri,
      });
      sendFiles(formData);
    } catch (error) {
      console.log(error);
    }
  };
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
              <Animated.Text
                style={[
                  styles.tabText,
                  {
                    color: activeAssetTab === 0 ? '#000000' : '#0000004D',
                  },
                ]}>
                Coins ({parseFloat(walletStore.coinBalance).toFixed(0)})
              </Animated.Text>
            </TouchableOpacity> */}
            {itemsTransfersAllowed && walletStore.collections.length > 0 && (
              <TouchableOpacity onPress={() => setActiveAssetTab(1)}>
                <Animated.Text
                  style={[
                    styles.tabText,
                    {
                      color: activeAssetTab === 1 ? '#000000' : '#0000004D',
                    },
                  ]}>
                  Items ({itemsBalance})
                </Animated.Text>
              </TouchableOpacity>
            )}

            {walletStore.collections.length > 0 && (
              <TouchableOpacity
                style={{marginLeft: 10}}
                onPress={() => setActiveAssetTab(2)}>
                <Animated.Text
                  style={[
                    styles.tabText,
                    {
                      color: activeAssetTab === 2 ? '#000000' : '#0000004D',
                    },
                  ]}>
                  Collections ({walletStore.collections.length})
                </Animated.Text>
              </TouchableOpacity>
            )}
            {walletStore.documents.length > 0 && (
              <TouchableOpacity
                onPress={() => setActiveAssetTab(3)}
                style={{marginLeft: 10}}>
                <Animated.Text
                  style={[
                    styles.tabText,
                    {
                      color: activeAssetTab === 3 ? '#000000' : '#0000004D',
                    },
                  ]}>
                  Documents ({walletStore.documents.length})
                </Animated.Text>
              </TouchableOpacity>
            )}
          </HStack>

          <View style={{marginBottom: hp('24%')}}>
            {activeAssetTab === 1 &&
              walletStore.nftItems.length === 0 &&
              walletStore.documents.length === 0 && (
                <FlatList
                  data={coinData}
                  nestedScrollEnabled={true}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            {activeAssetTab === 1 && (
              <FlatList
                data={walletStore.nftItems}
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
            {activeAssetTab === 2 && (
              <FlatList
                data={walletStore.collections}
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
            {activeAssetTab === 3 && (
              <FlatList
                data={walletStore.documents}
                renderItem={e => (
                  <DocumentListItem
                    item={e.item}
                    onAssetPress={() =>
                      setMediaModalData({
                        open: true,
                        mimetype: e.item.file.mimetype,
                        url: e.item.file.location,
                      })
                    }
                    onItemPress={() => {
                      navigation.navigate(ROUTES.DOCUMENTHISTORY, {
                        item: e.item,
                        userWalletAddress: loginStore.initialData.walletAddress,
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
        <View style={{paddingBottom: hp('50%')}}>
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
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{backgroundColor: primaryDarkColor, flex: 1}}>
        <SecondaryHeader
          title={"User's profile"}
          isQR
          onQRPressed={QRPressed}
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
            <TouchableOpacity onPress={onAvatarPress}>
              {uploadedAvatar.location || loginStore.userAvatar ? (
                <Image
                  source={{
                    uri: uploadedAvatar.location || loginStore.userAvatar,
                  }}
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
            </TouchableOpacity>
          </HStack>
        </View>
        <VStack
          // paddingTop={hp('2.4%')}
          marginTop={hp('5.5%')}
          bgColor={'#FBFBFB'}
          borderTopLeftRadius={30}
          borderTopRightRadius={30}
          height={hp('75%')}>
          <View style={{alignItems: 'center', marginTop: hp('5.54%')}}>
            <HStack alignItems={'center'}>
              <TouchableOpacity onPress={onNamePressed} style={{marginLeft: 5}}>
                <Text
                  style={{
                    fontSize: hp('2.216%'),
                    fontFamily: textStyles.mediumFont,
                    color: '#000000',
                  }}>
                  {firstNameLocal} {lastNameLocal}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onTransactionNumberPress}
                style={{marginLeft: 5}}>
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
                    {transactions.length}
                  </Text>
                  )
                </Text>
              </TouchableOpacity>
            </HStack>
            <HStack paddingX={wp('4%')}>
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
            </HStack>
          </View>

          <View>
            <View style={{padding: wp('4%')}}>
              <View style={{flexDirection: 'row'}}>
                {/* <TouchableOpacity
                  onPress={() => {
                    setActiveTab(0);
                    underlineOffset.value = 0;
                  }}>
                  <Animated.Text
                    style={[
                      styles.tabText,
                      {
                        color: activeTab === 0 ? '#000000' : '#0000004D',
                      },
                    ]}>
                    Assets ({itemsBalance === 0 ? assetCount : itemsBalance})
                  </Animated.Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                  style={{marginLeft: 20}}
                  onPress={() => {
                    setActiveTab(1);
                    underlineOffset.value = 120;
                  }}>
                  <Animated.Text
                    style={[
                      styles.tabText,
                      {
                        color: activeTab === 1 ? '#000000' : '#0000004D',
                      },
                    ]}>
                    Transactions ({walletStore.transactions.length})
                  </Animated.Text>
                </TouchableOpacity> */}
              </View>

              {/* <Animated.View
                style={[
                  animatedTranslate,
                  {
                    width: wp('10%'),
                    borderWidth: 1,
                  },
                ]}
              /> */}
            </View>

            {loadTabContent()}
          </View>
        </VStack>
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
});
