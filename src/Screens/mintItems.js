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

import styles from './style/createNewChatStyle';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomHeader from '../components/shared/customHeader';
import {Alert} from 'react-native';
import * as connectionURL from '../config/url';
import * as token from '../config/token';
import fetchFunction from '../config/api';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import {logOut} from '../actions/auth';
import DocumentPicker from 'react-native-document-picker';
import FastImage from 'react-native-fast-image';
import {commonColors, textStyles} from '../../docs/config';

const {primaryColor} = commonColors;
const {regularFont, lightFont} = textStyles;

const hitAPI = new fetchFunction();
const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  saveToPhotos: true,
};

export const uploadToFilesApi = async (file, token, callback) => {
  console.log(file, token, 'asdkasldh8q9e', connectionURL.fileUpload);
  hitAPI.fileUpload(
    connectionURL.fileUpload,
    file,
    token,
    async () => {
      logOut();
    },
    val => {
      console.log('Progress Val: ', val);
    },
    async response => {
      callback(response);
      console.log(response, 'thisisit');
    },
  );
};

function MintItems(props) {
  const [avatarSource, setAvatarSource] = useState(null);
  const [itemName, setItemName] = useState('');
  const [selectedValue, setSelectedValue] = useState(1);
  const [fileId, setFileId] = useState('');
  const [loading, setLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [isSelected, setSelection] = useState(true);
  const [open, setOpen] = useState(false);
  const allReducers = useSelector(state => state);
  const loginReducerData = allReducers.loginReducer;
  const [walletAddress, setWalletAddress] =
    loginReducerData.initialData.walletAddress;
  const [isModalVisible, setModalVisible] = useState(false);
  // const [value, setValue] = useState(1);
  const [items, setItems] = useState([
    {label: '1', value: 1},
    // {label: '1', value: '1'}
  ]);

  const dispatch = useDispatch();
  useEffect(() => {
    requestCameraPermission();
    return () => {};
  }, []);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const setChatAvatar = async type => {
    if (type === 'image') {
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          console.log(response, 'filesresponse');
          const data = new FormData();
          data.append('files', {
            name: response.fileName,
            type: response.type,
            uri: response.uri,
          });
          sendFiles(data);
        }
      });
    }else if (type === 'photo') {
      launchCamera(options, response => {
        console.log(response)
        const data = new FormData();
        data.append('files', {
          name: response.fileName,
          type: response.type,
          uri: response.uri,
        });
        sendFiles(data);
      })
    } else {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
        console.log(res, 'formsasss');
        const data = new FormData();
        data.append('files', {
          name: res.name,
          type: res.type,
          uri: res.uri,
        });
        sendFiles(data);
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'App Camera Permission',
            message: 'App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission given');
          setCameraPermission(true);
        } else {
          console.log('Camera permission denied');
          setCameraPermission(false);
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      request(PERMISSIONS.IOS.LOCATION_ALWAYS)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log(
                'This feature is not available (on this device / in this context)',
              );
              setCameraPermission(false);

              break;
            case RESULTS.DENIED:
              console.log(
                'The permission has not been requested / is denied but requestable',
              );
              setCameraPermission(false);

              break;
            case RESULTS.LIMITED:
              console.log(
                'The permission is limited: some actions are possible',
              );
              setCameraPermission(false);

              break;
            case RESULTS.GRANTED:
              console.log('The permission is granted');
              setCameraPermission(true);

              break;
            case RESULTS.BLOCKED:
              console.log(
                'The permission is denied and not requestable anymore',
              );
              setCameraPermission(false);

              break;
          }
        })
        .catch(error => {
          // …
        });
    }
  };

  const sendFiles = data => {
    setLoading(true);
    uploadToFilesApi(data, loginReducerData.token, resp => {
      console.log(JSON.stringify(resp), 'sdfasdfadf');
      setFileId(resp.results[0]['_id']);
      setLoading(false);
      setAvatarSource(resp.results[0].location);
    });
  };

  const createNftItem = () => {
    let item = {name: itemName, rarity: selectedValue, mediaId: fileId};
    hitAPI.fetchPost(
      connectionURL.nftTransferURL,
      item,
      loginReducerData.token,
      async() => {
        console.log('minted failed')
    }, async data => {
      console.log(data, 'createddskldjfdsflk')
        props.fetchWalletBalance(
          loginReducerData.initialData.walletAddress,
          null,
          loginReducerData.token,
          true,
        );
      },
    );
  };

  const clearData = () => {
    setLoading(false);
    setAvatarSource(null);
    // setSelectedValue('')
    setItemName('');
    setSelection(false);
  };
  const onMintClick = () => {
    if (!avatarSource) {
      Toast.show('Please load the image.', Toast.SHORT);

      return;
    }
    if (!itemName.length) {
      Toast.show('Please fill the item name.', Toast.SHORT);

      return;
    }
    if (!isSelected) {
      Toast.show('Please confirm distribution rights', Toast.SHORT);
      return;
    }

    createNftItem();
    Alert.alert(
      'Minting...',
      'Awesome! 😎 Once blockchain confirms it, you will see this Item in your wallet and Profile screen.',
      [
        {text: 'Mint another', onPress: () => clearData()},
        {
          text: 'My Profile',
          onPress: () => {
            props.navigation.navigate('ProfileComponent', {
              screen: 'Profile',
              params: {
                viewItems: true,
              },
            });
            clearData();
          },
        },
      ],
    );
  };
  const chooseImageOption = () => {
    Alert.alert('Choose a file', '', [
      Platform.OS === 'ios'
        ? {text: 'Take a photo', onPress: () => setChatAvatar('photo')}
        : null,
      {text: 'Open from files', onPress: () => setChatAvatar('files')},
      {text: 'Dismiss', onPress: () => console.log('dismissed')},

      // {
      //   text: cameraPermission
      //     ? 'Take a photo'
      //     : 'Allow to use camera in the settings',
      //   onPress: () => {
      //     cameraPermission ? setChatAvatar(false) : Linking.openSettings();
      //   },
      // },
    ]);
  };

  return (
    <Fragment>
      <View>
        <CustomHeader title="Mint Item" navigation={props.navigation} />
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.section1}>
            <TextInput
              value={itemName}
              onChangeText={itemName => setItemName(itemName)}
              placeholder="Item Name"
              placeholderTextColor={primaryColor}
              style={classes.itemNameInput}
              maxLength={50}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop: 20,
            }}>
            <TouchableOpacity
              onPress={chooseImageOption}
              style={{alignItems: 'flex-start', width: wp('50%')}}>
              <View
                onPress={chooseImageOption}
                style={{
                  ...classes.alignCenter,
                  width: wp('50%'),
                  height: wp('50%'),
                  borderRadius: 10,
                  borderColor: primaryColor,
                  borderWidth: 1,
                  marginRight: wp('5%'),
                }}>
                {avatarSource !== null ? (
                  <FastImage
                    onPress={setChatAvatar}
                    source={{
                      uri: avatarSource,
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={{
                      width: wp('50%'),
                      height: wp('50%'),
                      borderRadius: 10,
                    }}
                  />
                ) : (
                  <View style={{}}>
                    <AntIcon
                      name="plus"
                      size={hp('10%')}
                      color={primaryColor}
                    />
                    <Text
                      style={{
                        marginTop: 'auto',
                        fontFamily: lightFont,
                        fontSize: hp('2.6%'),
                        color: primaryColor,
                      }}>
                      Add file
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderColor: primaryColor,
                borderWidth: 1,
                // marginTop: 10,
                borderRadius: 5,
                marginLeft: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: wp('35%'),
                height: wp('10%'),
              }}>
              <Text
                style={{
                  ...classes.textStyle,
                  left: 5,
                }}>
                {' '}
                Rarity
              </Text>
              <Text
                style={{
                  ...classes.textStyle,
                  right: 40,
                }}>
                {' '}
                {selectedValue}
              </Text>

              <View />
              <>
                <TouchableOpacity onPress={toggleModal}>
                  <AntIcon
                    // onPress={() => props.navigation.navigate('LoginComponent')}
                    color={primaryColor}
                    name="caretdown"
                    size={hp('2%')}
                    style={{marginRight: 5, marginBottom: 2}}
                  />
                </TouchableOpacity>
              </>
              {/* )} */}
            </View>
          </View>

          <TouchableOpacity
            disabled={loading}
            onPress={onMintClick}
            style={styles.createButton}>
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
                <Text style={styles.createButtonText}>Mint Item</Text>
              )}
            </View>
          </TouchableOpacity>
          <View style={classes.checkboxContainer}>
            <CheckBox
              onCheckColor={primaryColor}
              onTintColor={primaryColor}
              value={isSelected}
              onValueChange={setSelection}
              style={{marginRight: 3, color: primaryColor}}
            />
            <Text style={{color: primaryColor}}>
              By proceeding I confirm that I have the rights to distribute the
              above content.
            </Text>
          </View>
        </View>
      </ScrollView>
      <Modal
        onBackdropPress={() => setModalVisible(false)}
        isVisible={isModalVisible}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setSelectedValue(1), setModalVisible(false);
            }}
            style={classes.rarityItems}>
            <Text
              style={{
                fontSize: hp('2.23%'),
                fontFamily: regularFont,
                textAlign: 'left',
                paddingLeft: 5,
                color: primaryColor,
              }}>
              1
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedValue(2), setModalVisible(false);
            }}
            style={classes.rarityItems}>
            <Text
              style={{
                fontSize: hp('2.23%'),
                fontFamily: regularFont,
                textAlign: 'left',
                paddingLeft: 5,
                color: primaryColor,
              }}>
              2
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedValue(3), setModalVisible(false);
            }}
            style={classes.rarityItems}>
            <Text
              style={{
                fontSize: hp('2.23%'),
                fontFamily: regularFont,
                textAlign: 'left',
                paddingLeft: 5,
                color: primaryColor,
              }}>
              3
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedValue(4), setModalVisible(false);
            }}
            style={classes.rarityItems}>
            <Text
              style={{
                fontSize: hp('2.23%'),
                fontFamily: regularFont,
                textAlign: 'left',
                paddingLeft: 5,
                color: primaryColor,
              }}>
              4
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedValue(5), setModalVisible(false);
            }}
            style={classes.rarityItems}>
            <Text
              style={{
                fontSize: hp('2.23%'),
                fontFamily: regularFont,
                textAlign: 'left',
                paddingLeft: 5,
                color: primaryColor,
              }}>
              5
            </Text>
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
    color: primaryColor,
    position: 'absolute',
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
    borderBottomColor: primaryColor,
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
})(MintItems);
