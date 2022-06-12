import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {GiftedChat, Send, Actions} from 'react-native-gifted-chat';
import {useStores} from '../stores/context';
import {
  getPaginatedArchive,
  getRoomArchiveStanza,
  getUserRoomsStanza,
  retrieveOtherUserVcard,
  sendMediaMessageStanza,
  sendMessageStanza,
} from '../xmpp/stanzas';
import MessageBody from '../components/Chat/MessageBody';
import {
  Animated,
  NativeModules,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {DOMAIN, XMPP_TYPES} from '../xmpp/xmppConstants';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import {format} from 'date-fns';
import {
  reverseUnderScoreManipulation,
  underscoreManipulation,
} from '../helpers/underscoreLogic';
import {ROUTES} from '../constants/routes';
import {ImageMessage} from '../components/Chat/ImageMessage';
import {ChatMediaModal} from '../components/Modals/ChatMediaModal';
import {Spinner, View} from 'native-base';
import TransactionModal from '../components/Modals/TransactionModal/Test';
import {modalTypes} from '../constants/modalTypes';
import {systemMessage} from '../helpers/systemMessage';
import parseChatLink from '../helpers/parseChatLink';
import openChatFromChatLink from '../helpers/chat/openChatFromChatLink';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';
import {commonColors} from '../../docs/config';
import Entypo from 'react-native-vector-icons/Entypo';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {RecordingSecondsCounter} from '../components/Recorder/RecordingSecondsCounter';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fileUpload} from '../config/routesConstants';
import {httpUpload} from '../config/apiService';
import {showToast} from '../components/Toast/toast';
import DocumentPicker from 'react-native-document-picker';
import {imageMimetypes, videoMimetypes} from '../constants/mimeTypes';
import { normalizeData } from '../helpers/normalizeData';

const ChatScreen = observer(({route, navigation}: any) => {
  const [modalType, setModalType] = useState<string | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [extraData, setExtraData] = useState<{}>({});
  const [recording, setRecording] = useState<boolean>(false);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);

  const {loginStore, chatStore, walletStore, apiStore, debugStore} =
    useStores();

  const {firstName, lastName, walletAddress} = loginStore.initialData;

  const {tokenTransferSuccess} = walletStore;

  const audioRecorderPlayer = new AudioRecorderPlayer();

  const mediaButtonAnimation = new Animated.Value(1);

  const manipulatedWalletAddress = underscoreManipulation(walletAddress);

  const path = Platform.select({
    ios: 'hello.m4a',
    android: `${RNFetchBlob.fs.dirs.CacheDir}/hello.mp3`,
  });

  const {chatJid, chatName} = route.params;
  const [mediaModal, setMediaModal] = useState({
    open: false,
    url: '',
    type: '',
  });

  const messages = chatStore.messages
    .filter((item: any) => item.roomJid === chatJid)
    .sort((a: any, b: any) => b._id - a._id);

  useEffect(() => {
    chatStore.toggleShouldCount(false);
    chatStore.getCachedMessages();
  }, []);

  useEffect(() => {
    if (!chatStore.roomsInfoMap?.[chatJid]?.archiveRequested) {
      getRoomArchiveStanza(chatJid, chatStore.xmpp);
    }
  }, [chatJid]);

  useEffect(() => {
    if (tokenTransferSuccess.success) {
      const message = systemMessage({
        ...tokenTransferSuccess,
        tokenAmount: tokenTransferSuccess.amount,
      });
      sendMessage(message, true);
      walletStore.clearPreviousTransfer();
    }
  }, [tokenTransferSuccess.success]);

  useEffect(() => {
    const lastMessage = messages?.[0];
    chatStore.updateRoomInfo(chatJid, {
      archiveRequested: true,
      lastUserText: lastMessage?.text,
      lastUserName: lastMessage?.user?.name,
      lastMessageTime:
        lastMessage?.createdAt && format(lastMessage?.createdAt, 'hh:mm'),
    });
  }, [!!messages]);

  const renderMessage = props => {
    return <MessageBody {...props} />;
  };

  const onLoadEarlier = () => {
    // messages.length - 1 means last message, but because chat is inverted it will the first message by date

    const lastMessage = messages.length - 1;
    // const lastMessage = 0;
    getPaginatedArchive(chatJid, messages[lastMessage]._id, chatStore.xmpp);
  };

  const sendMessage = (messageString: any, isSystemMessage: boolean) => {
    const messageText = messageString[0].text;
    const tokenAmount = messageString[0].tokenAmount || 0;

    const receiverMessageId = messageString[0].receiverMessageId || 0;
    const manipulatedWalletAddress = underscoreManipulation(
      loginStore.initialData.walletAddress,
    );
    const data = {
      senderFirstName: loginStore.initialData.firstName,
      senderLastName: loginStore.initialData.lastName,
      senderWalletAddress: loginStore.initialData.walletAddress,
      isSystemMessage: isSystemMessage,
      tokenAmount: tokenAmount,
      receiverMessageId: receiverMessageId,
      mucname: chatName,
      photoURL: loginStore.userAvatar,
      roomJid: chatJid,
    };
    sendMessageStanza(
      manipulatedWalletAddress,
      chatJid,
      messageText,
      data,
      chatStore.xmpp,
    );
  };

  const onUserAvatarPress = (props: any) => {
    const {avatar, name, _id} = props;
    const firstName = name.split(' ')[0];
    const lastName = name.split(' ')[1];
    const xmppID = _id.split('@')[0];
    // const {anotherUserWalletAddress} = this.props.loginReducer;
    const walletAddress = reverseUnderScoreManipulation(xmppID);
    if (walletAddress === loginStore.initialData.walletAddress) {
      navigation.navigate(ROUTES.PROFILE);
      return;
    }
    //fetch transaction

    //check if user clicked their own avatar/profile

    const theirXmppUsername = xmppID;
    //this will get the other user's Avatar and description
    retrieveOtherUserVcard(
      loginStore.initialData.xmppUsername,
      theirXmppUsername,
      chatStore.xmpp,
    );

    loginStore.setOtherUserDetails({
      anotherUserFirstname: firstName,
      anotherUserLastname: lastName,
      anotherUserLastSeen: {},
      anotherUserWalletAddress: walletAddress,
    });

    //to set the current another user profile
    // otherUserStore.setUserData(firstName, lastName, avatar);

    navigation.navigate(ROUTES.OTHERUSERPROFILESCREEN);
  };
  const onMediaMessagePress = (type: any, url: any) => {
    console.log(url);
    setMediaModal({open: true, type, url});
  };

  const closeMediaModal = () => {
    setMediaModal({type: '', open: false, url: ''});
  };
  const renderMessageImage = (props: any) => {
    const {
      image,
      realImageURL,
      mimetype,
      size,
      duration,
      waveForm,
      id,
      imageLocation,
    } = props.currentMessage;
    if (imageMimetypes[mimetype] || videoMimetypes[mimetype]) {
      return (
        <ImageMessage
          url={image}
          size={size}
          onPress={() => onMediaMessagePress(mimetype, image)}
        />
      );
    } else {
      return;
    }
  };

  const handleOnLongPress = (context: any, message: any) => {
    let extraData = {};
    if (
      message.user._id.includes(
        underscoreManipulation(loginStore.initialData.walletAddress),
      )
    ) {
      return;
    }
    if (
      !message.user._id.includes(apiStore.xmppDomains.CONFERENCEDOMAIN_WITHOUT)
    ) {
      const jid = message.user._id.split('@' + apiStore.xmppDomains.DOMAIN)[0];
      const walletFromJid = reverseUnderScoreManipulation(jid);
      const token = loginStore.userToken;

      extraData = {
        type: 'transfer',
        amnt: null,
        name: message.user.name,
        message_id: message._id,
        walletFromJid,
        chatJid,
        token,
        jid,
        senderName:
          loginStore.initialData.firstName +
          ' ' +
          loginStore.initialData.lastName,
      };
    }
    setShowModal(true);
    setModalType(modalTypes.TOKENTRANSFER);
    setExtraData(extraData);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  //on QRCode pressed function
  const QRPressed = () => {
    setShowModal(true);
    setModalType(modalTypes.GENERATEQR);
    setExtraData(chatJid);
  };

  const handleChatLinks = (chatLink: string) => {
    const chatJID =
      parseChatLink(chatLink) + apiStore.xmppDomains.CONFERENCEDOMAIN;
    // navigation.navigate(ROUTES.ROOMSLIST);
    // // getUserRoomsStanza(
    // //   underscoreManipulation(loginStore.walletAddress),
    // //   chatStore.xmpp
    // //   );
    openChatFromChatLink(
      chatJID,
      loginStore.initialData.walletAddress,
      navigation,
      chatStore.xmpp,
    );
  };

  const animateMediaButtonIn = () => {
    Animated.spring(mediaButtonAnimation, {
      toValue: 2.5,
      useNativeDriver: true,
    }).start();
  };
  const animateMediaButtonOut = () => {
    Animated.spring(mediaButtonAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,

      friction: 3,
    }).start();
  };

  const onStartRecord = async () => {
    setRecording(true);
    animateMediaButtonIn();

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.low,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    const result = await audioRecorderPlayer.startRecorder(
      path,
      audioSet,
      true,
    );
  };

  const getWaveformArray = async (url: string) => {
    if (Platform.OS !== 'ios') {
      let ddd = await NativeModules.Waveform.getWaveformArray(url);

      const data = JSON.parse(ddd);
      return data;
    } else {
      const res = await NativeModules.RNWaveform.loadAudioFile();
      return res;
    }
  };

 

  function filterData(arr) {
    const samples = 24;
    const blockSize = Math.floor(arr.length / samples);
    const res = new Array(samples)
      .fill(0)
      .map((_, i) =>
        arr
          .slice(i * blockSize, (i + 1) * blockSize)
          .reduce((sum, val) => sum + Math.abs(val), 0),
      );

    return res;
  }

  const getAudioData = async (url?: string) => {
    const audioPath =
      url ||
      (Platform.OS === 'ios'
        ? `${RNFetchBlob.fs.dirs.CacheDir}/hello.m4a`
        : path);
    const data = await getWaveformArray(audioPath);
    const normalizedData = normalizeData(filterData(data));

    return normalizedData;
  };

  const submitMediaMessage = (props: any, waveForm?: any) => {
    props.map(async (item: any) => {
      // console.log(item.duration, 'masdedia messsdfsdfage');

      const data = {
        firstName,
        lastName,
        walletAddress,
        chatName,
        userAvatar: loginStore.userAvatar,
        createdAt: item.createdAt,
        expiresAt: item.expiresAt,
        filename: item.filename,
        isVisible: item.isVisible,
        location: item.location,
        locationPreview: item.locationPreview,
        mimetype: item.mimetype,
        originalname: item.originalname,
        ownerKey: item.ownerKey,
        size: item.size,
        duration: item?.duration,
        updatedAt: item.updatedAt,
        userId: item.userId,
        waveForm: waveForm,
      };

      sendMediaMessageStanza(
        manipulatedWalletAddress,
        chatJid,
        data,
        chatStore.xmpp,
      );
    });
  };

  const onStopRecord = async () => {
    setRecording(false);
    animateMediaButtonOut();

    const result = await audioRecorderPlayer.stopRecorder();

    const filesApiURL = apiStore.defaultUrl + fileUpload;
    const FormData = require('form-data');
    let data = new FormData();
    const waveform = await getAudioData();
    // let correctpath = '';
    // const str1 = 'file://';
    // const str2 = res.uri;
    // correctpath = str2.replace(str1, '');

    data.append('files', {
      uri: result,
      type: 'audio/mpeg',
      name: 'sound.mp3',
    });
    try {
      const response = await httpUpload(
        filesApiURL,
        data,
        loginStore.userToken,
        setFileUploadProgress,
      );
      setFileUploadProgress(0);

      if (response.data.results.length) {
        debugStore.addLogsApi(response.data.results);
        submitMediaMessage(response.data.results, waveform);
      }
    } catch (error) {
      console.log(error);
      showToast('error', 'Error', 'Cannot upload file, try again later', 'top');
    }
  };

  const renderAttachment = () => {
    return (
      <View style={{position: 'relative'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Actions
            containerStyle={{
              width: hp('4%'),
              height: hp('4%'),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            icon={() => (
              <Entypo name="attachment" color={'black'} size={hp('3%')} />
            )}
            options={{
              'Upload File': async () => {
                try {
                  const res = await DocumentPicker.pick({
                    type: [DocumentPicker.types.allFiles],
                    copyTo: 'cachesDirectory',
                  });

                  const filesApiURL = apiStore.defaultUrl + fileUpload;
                  const FormData = require('form-data');
                  let data = new FormData();
                  // correctpath = str2.replace(str1, '');
                  // alert(JSON.stringify(res))
                  data.append('files', {
                    uri: res[0].uri,
                    type: res[0].type,
                    name: res[0].name,
                  });
                  const absolutePath = res[0].fileCopyUri;
                  const response = await httpUpload(
                    filesApiURL,
                    data,
                    loginStore.userToken,
                    setFileUploadProgress,
                  );
                  setFileUploadProgress(0);
                  if (response.data.results?.length) {
                    debugStore.addLogsApi(response.data.results);
                    if (response.data.results[0].mimetype === 'audio/mpeg') {
                      let wave = await getAudioData(absolutePath);
                      submitMediaMessage(response.data.results, wave);
                    } else {
                      submitMediaMessage(response.data.results);
                    }
                  }
                } catch (err) {
                  console.log(err);
                  if (DocumentPicker.isCancel(err)) {
                    // User cancelled the picker, exit any dialogs or menus and move on
                  } else {
                    showToast(
                      'error',
                      'Error',
                      'Cannot upload file, try again later',
                      'top',
                    );
                    throw err;
                  }
                }
              },
              Cancel: () => {
                console.log('Cancel');
              },
            }}
            optionTintColor="#000000"
          />
        </View>
      </View>
    );
  };

  const renderSend = (props: any) => {
    const animateMediaButtonStyle = {
      transform: [{scale: mediaButtonAnimation}],
    };
    if (!props.text) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            paddingHorizontal: 5,
            flexDirection: 'row',
            position: 'relative',
          }}>
          <TouchableWithoutFeedback
            // onPress={this.start}

            onPressIn={onStartRecord}
            onPressOut={onStopRecord}>
            <Animated.View
              style={[
                {
                  backgroundColor: commonColors.primaryDarkColor,
                  borderRadius: 50,
                  padding: 5,
                },
                animateMediaButtonStyle,
              ]}>
              <Entypo name="mic" color={'white'} size={hp('3%')} />
            </Animated.View>
          </TouchableWithoutFeedback>
          {/* )} */}
          {recording && (
            <View style={{position: 'absolute', right: hp('10%')}}>
              <RecordingSecondsCounter />
            </View>
          )}
        </View>
      );
    }
    return (
      <Send {...props}>
        <View
          style={[
            {
              backgroundColor: commonColors.primaryDarkColor,
              borderRadius: 100,
              padding: 5,
              marginRight: 5,
              paddingLeft: 7,
              marginBottom: 5,
            },
          ]}>
          <IonIcons name="ios-send" color={'white'} size={hp('3%')} />
        </View>
      </Send>
    );
  };
  return (
    <>
      <SecondaryHeader
        title={chatStore.roomsInfoMap[chatJid]?.name}
        isQR={true}
        onQRPressed={QRPressed}
      />
      <GiftedChat
        renderSend={renderSend}
        renderActions={renderAttachment}
        renderLoading={() => <Spinner />}
        renderUsernameOnMessage
        renderMessage={renderMessage}
        renderMessageImage={props => renderMessageImage(props)}
        messages={messages}
        renderAvatarOnTop
        onPressAvatar={onUserAvatarPress}
        placeholder={
          fileUploadProgress > 0
            ? 'File uploaded on: ' + fileUploadProgress + '%'
            : 'Type a message'
        }
        listViewProps={{
          onEndReached: onLoadEarlier,
          onEndReachedThreshold: 0.05,
        }}
        textInputProps={{
          color: 'black',
        }}
        keyboardShouldPersistTaps={'handled'}
        onSend={messageString => sendMessage(messageString, false)}
        user={{
          _id: loginStore.initialData.xmppUsername + '@' + DOMAIN,
          name: loginStore.initialData.username,
        }}
        inverted={true}
        alwaysShowSend
        showUserAvatar
        onLongPress={(context: any, message: any) =>
          handleOnLongPress(context, message)
        }
        // onInputTextChanged={()=>{alert('hhh')}}
        parsePatterns={linkStyle => [
          {
            pattern:
              /\bhttps:\/\/www\.eto\.li\/go\?c=0x[0-9a-f]+_0x[0-9a-f]+/gm,
            style: linkStyle,
            onPress: handleChatLinks,
          },
          {
            pattern: /\bhttps:\/\/www\.eto\.li\/go\?c=[0-9a-f]+/gm,
            style: linkStyle,
            onPress: handleChatLinks,
          },
        ]}
      />
      <ChatMediaModal
        url={mediaModal.url}
        type={mediaModal.type}
        onClose={closeMediaModal}
        open={mediaModal.open}
      />
      <TransactionModal
        type={modalType}
        closeModal={closeModal}
        extraData={extraData}
        isVisible={showModal}
      />
    </>
  );
});

const styles = StyleSheet.create({
  usernameStyle: {
    fontWeight: 'bold',
    color: '#FFFF',
    fontSize: heightPercentageToDP('1.47%'),
  },
});

export default ChatScreen;
