import React, {Fragment, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {Image, ScrollView, Text, View} from 'native-base';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';
import NftTransactionListTab from '../components/Nft/NftTransactionList';
import {
  audioMimetypes,
  imageMimetypes,
  videoMimetypes,
} from '../constants/mimeTypes';
import {useStores} from '../stores/context';
import {transactionURL} from '../config/routesConstants';
import {httpGet} from '../config/apiService';
import {APP_TOKEN, commonColors, textStyles} from '../../docs/config';
import VideoPlayer from 'react-native-video-player';
import { mapTransactions } from '../stores/walletStore';

const NftItemHistoryScreen = (props: any) => {
  const {item, userWalletAddress} = props.route.params.params;

  const {apiStore} = useStores();

  const [avatarSource, setAvatarSource] = useState<string | null>(null);
  const [itemTransactions, setItemTransactions] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [videoPaused, setVideoPaused] = useState<boolean>(true);
  const [modalData, setModalData] = useState<any>({
    visible: false,
    url: '',
    mimetype: '',
  });

  useEffect(() => {
    setAvatarSource({uri: item.nftFileUrl});
    getItemTransactionsHistory(userWalletAddress, item.nftId).then(res => {
      const allTransactions = res.data.items.map(item =>{

        return mapTransactions(item, userWalletAddress)});

      setItemTransactions(
        allTransactions.sort((a: any, b: any) => {
          return (
            new Date(a.createdAt).toUTCString() -
            new Date(b.createdAt).toUTCString()
          );
        }),
      );
    });
    return () => {};
  }, [item]);

  //function to get Item transactions
  const getItemTransactionsHistory = async (
    walletAddress: string,
    nftId: string,
  ) => {
    const url =
      apiStore.defaultUrl +
      transactionURL +
      'walletAddress=' +
      walletAddress +
      '&' +
      'nftId=' +
      nftId;

    const appToken = APP_TOKEN;
    return await httpGet(url, appToken);
  };

  const onPreviewClick = () => {
    setModalData({
      url: item.nftFileUrl,
      mimetype: item.nftMimetype,
      visible: true,
    });
  };

  const closeModal = () => {
    setModalData(prev => ({...prev, visible: false, url: ''}));
  };

  return (
    <Fragment>
      <SecondaryHeader title="Item details" />

      <ScrollView style={styles.container}>
        <View style={{...styles.contentContainer, margin: 0}}>
          <View style={styles.justifyBetween}>
            <TouchableOpacity
              onPress={onPreviewClick}
              style={{alignItems: 'center', width: wp('60%')}}>
              <View style={[styles.alignCenter, styles.imageContainer]}>
                {imageMimetypes[
                  item.nftMimetype ? item.nftMimetype : 'image/png'
                ] && (
                  <FastImage
                    style={styles.tokenImage}
                    source={{
                      uri: avatarSource?.uri,
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                )}
                {videoMimetypes[item.nftMimetype] && (
                  <View style={{position: 'relative'}}>
                    <View
                      style={{
                        position: 'absolute',
                        zIndex: 99999,
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: wp('60%'),
                        height: wp('40%'),
                      }}>
                      <AntIcon
                        name={'playcircleo'}
                        color={'white'}
                        size={hp('5%')}
                        // style={{marginRight: 40}}
                      />
                    </View>

                    <FastImage
                      style={styles.tokenImage}
                      source={{
                        uri: avatarSource?.uri,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                )}
                {audioMimetypes[item.nftMimetype] && (
                  <AntIcon
                    name={'playcircleo'}
                    color={commonColors.primaryColor}
                    size={hp('10%')}
                    // style={{marginRight: 40}}
                  />
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.tokenDescriptionContainer}>
              <Text
                style={{
                  ...styles.textStyle,
                  wordWrap: 'wrap',
                  fontWeight: 'bold',
                }}>
                {item.tokenName}
              </Text>
              <Text
                style={{
                  ...styles.textStyle,
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
                ...styles.alignCenter,
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
                historyItem={item}
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
                    ...styles.textStyle,
                    fontWeight: 'bold',
                    color: commonColors.primaryColor,
                  }}>
                  This item has no transactions yet...
                </Text>
                <Image
                  alt={'no transaction'}
                  source={require('../assets/transactions-empty.png')}
                  style={styles.noTransactionsImage}
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
        <View style={styles.modal}>
          {audioMimetypes[modalData.mimetype] && (
            <View style={{position: 'absolute', top: '50%'}}>
              <AudioPlayer audioUrl={modalData.url} />
            </View>
          )}
          {imageMimetypes[modalData.mimetype] && (
            <TouchableOpacity onPress={closeModal}>
              <Image
                alt="modal image"
                source={avatarSource}
                style={styles.modalImage}
              />
            </TouchableOpacity>
          )}

          {videoMimetypes[modalData.mimetype] && (
            <TouchableOpacity
              onPress={() => setVideoPaused(prev => !prev)}
              activeOpacity={1}
              style={{height: hp('100%'), width: '100%'}}>
              <VideoPlayer
                video={{
                  uri: modalData.url,
                }}
                autoplay
                videoWidth={wp('100%')}
                videoHeight={hp('100%')}
                // thumbnail={{uri: 'https://i.picsum.photos/id/866/1600/900.jpg'}}
              />
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </Fragment>
  );
};

export default NftItemHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    margin: 20,
    marginTop: 0,
  },
  tokenImage: {
    width: wp('60%'),
    height: wp('40%'),
    borderRadius: 5,
  },
  justifyBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  alignCenter: {
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
  textStyle: {
    fontFamily: textStyles.lightFont,
    color: 'black',
    // position: 'absolute',
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
  createButtonText: {
    fontSize: hp('2%'),
    color: '#fff',
    fontFamily: textStyles.regularFont,
  },
  createButton: {
    backgroundColor: commonColors.primaryColor,
    borderRadius: 5,
    height: hp('7%'),
    marginTop: 20,
  },
});
