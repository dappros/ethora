import {
  Actionsheet,
  Checkbox,
  Divider,
  HStack,
  Text,
  useDisclose,
  View,
} from 'native-base';
import React, {useState, useEffect} from 'react';
import {Actions, GiftedChat, Send} from 'react-native-gifted-chat';
import {
  allowIsTyping,
  commonColors,
  defaultBotsList,
  textStyles,
} from '../../docs/config';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import {useStores} from '../stores/context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  ActivityIndicator,
  Animated,
  Image,
  NativeModules,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import {AudioSendButton} from '../components/Chat/AudioSendButton';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'react-native-blob-util';
import {fileUpload} from '../config/routesConstants';
import {normalizeData} from '../helpers/normalizeData';
import {httpUpload} from '../config/apiService';
import {
  isComposing,
  pausedComposing,
  retrieveOtherUserVcard,
  sendInvite,
  sendMediaMessageStanza,
  sendMessageStanza,
} from '../xmpp/stanzas';
import {
  reverseUnderScoreManipulation,
  underscoreManipulation,
} from '../helpers/underscoreLogic';
import {showToast} from '../components/Toast/toast';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {ChatComposer} from '../components/Chat/Composer';
import Entypo from 'react-native-vector-icons/Entypo';
import MessageBody from '../components/Chat/MessageBody';
import {
  audioMimetypes,
  imageMimetypes,
  pdfMimemtype,
  videoMimetypes,
} from '../constants/mimeTypes';
import {ImageMessage} from '../components/Chat/ImageMessage';
import {VideoMessage} from '../components/Chat/VideoMessage';
import {AudioMessage} from '../components/Chat/AudioMessage';
import {modalTypes} from '../constants/modalTypes';
import {PdfMessage} from '../components/Chat/PdfMessage';
import {FileMessage} from '../components/Chat/FileMessage';
import {downloadFile} from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../constants/routes';
import RenderChatFooter from '../components/Chat/RenderChatFooter';
import {useDebounce} from '../hooks/useDebounce';
import {mentionRegEx, parseValue} from '../helpers/chat/inputUtils';
import matchAll from 'string.prototype.matchall';
import parseChatLink from '../helpers/parseChatLink';
import openChatFromChatLink from '../helpers/chat/openChatFromChatLink';
import TransactionModal from '../components/Modals/TransactionModal/TransactionModal';
import {NftItemGalleryModal} from '../../NftItemGalleryModal';
import DocumentPicker from 'react-native-document-picker';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';
import {ChatMediaModal} from '../components/Modals/ChatMediaModal';
import {observer} from 'mobx-react-lite';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  createMainMessageForThread,
  IMessageToSend,
} from '../helpers/chat/createMessageObject';

const audioRecorderPlayer = new AudioRecorderPlayer();

const ThreadScreen = observer((props: any) => {
  const {loginStore, chatStore, apiStore, debugStore, walletStore} =
    useStores();
  const {firstName, lastName, walletAddress} = loginStore.initialData;
  const fullName = firstName + ' ' + lastName;
  const {currentMessage, chatJid, chatName} = props.route.params;
  const navigation = useNavigation();
  const [isNftItemGalleryVisible, setIsNftItemGalleryVisible] = useState(false);

  const [recording, setRecording] = useState(false);
  const [selection, setSelection] = useState({start: 0, end: 0});
  const [mediaModal, setMediaModal] = useState({
    open: false,
    url: '',
    type: '',
    message: {},
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(undefined);
  const [extraData, setExtraData] = useState({});
  const [composingUsername, setComposingUsername] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onTapMessageObject, setOnTapMessageObject] = useState('');
  const [isShowDeleteOption, setIsShowDeleteOption] = useState(true);
  const [showInChannel, setShowInChannel] = useState(false);

  const [fileUploadProgress, setFileUploadProgress] = useState(0);

  const mediaButtonAnimation = new Animated.Value(1);

  const parentDate = new Date(currentMessage.createdAt * 1000);
  const parentTime = parentDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const manipulatedWalletAddress = underscoreManipulation(walletAddress);
  const [text, setText] = useState('');
  const debouncedChatText = useDebounce(text, 500);

  const {isOpen, onOpen, onClose} = useDisclose();

  const messages = chatStore.messages
    .filter(
      (item: any) =>
        item.roomJid === chatJid &&
        item?.mainMessage?.id === currentMessage._id,
    )
    .sort((a: any, b: any) => b._id - a._id);

  useEffect(() => {
    pausedComposing(manipulatedWalletAddress, chatJid, chatStore.xmpp);
  }, [debouncedChatText]);

  useEffect(() => {
    if (
      chatStore.isComposing.chatJID === chatJid &&
      chatStore.isComposing.manipulatedWalletAddress !==
        manipulatedWalletAddress
    ) {
      setIsTyping(chatStore.isComposing.state);
      setComposingUsername(chatStore.isComposing.username);
    }
  }, [chatStore.isComposing.state]);

  const path = Platform.select({
    ios: 'hello.m4a',
    android: `${RNFetchBlob.fs.dirs.CacheDir}/hello.mp3`,
  });

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
    console.log(result);
  };
  const submitMediaMessage = (props: any, waveForm?: any) => {
    props.map(async (item: any) => {
      // console.log(item.duration, 'masdedia messsdfsdfage');
      const data: IMessageToSend = {
        senderFirstName: loginStore.initialData.firstName,
        senderLastName: loginStore.initialData.lastName,
        senderWalletAddress: loginStore.initialData.walletAddress,
        mucname: chatName,
        photoURL: loginStore.userAvatar,
        fileName: item.filename,
        isVisible: item.isVisible,
        location: item.location,
        locationPreview: item.locationPreview,
        mimetype: item.mimetype,
        originalName: item.originalname,
        size: item.size,
        duration: item?.duration,
        waveForm: JSON.stringify(waveForm),
        attachmentId: item._id,
        wrappable: true,
        isReply: true,
        mainMessage: createMainMessageForThread(currentMessage),
        push: true,
        isSystemMessage: false,
        roomJid: chatJid,
        receiverMessageId: '0',
        showInChannel: showInChannel,
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

    const filesApiURL = fileUpload;
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

  const renderSend = (props: any) => {
    const animateMediaButtonStyle = {
      transform: [{scale: mediaButtonAnimation}],
    };
    if (!props.text) {
      return (
        <AudioSendButton
          recording={recording}
          onPressIn={onStartRecord}
          onPressOut={onStopRecord}
        />
      );
    }
    return (
      <Send {...props}>
        <View style={[styles.sendButton]}>
          <IonIcons name="ios-send" color={'white'} size={hp('3%')} />
        </View>
      </Send>
    );
  };

  const renderSuggestions: FC<MentionSuggestionsProps> = ({
    keyword,
    onSuggestionPress,
  }) => {
    if (keyword == null) {
      return null;
    }

    return (
      <View
        style={{
          position: 'absolute',
          bottom: 43,
          backgroundColor: 'white',
          left: 0,
          padding: 10,
          borderRadius: 10,
          width: 200,
        }}>
        {defaultBotsList
          .filter(one =>
            one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()),
          )
          .map(one => (
            <Pressable
              key={one.id}
              onPress={() => onSuggestionPress(one)}
              style={{
                paddingBottom: 5,
              }}>
              <Text
                style={{
                  fontFamily: textStyles.semiBoldFont,
                  color: '#000',
                }}>
                {one.name}
              </Text>
            </Pressable>
          ))}
      </View>
    );
  };

  const partTypes = [
    {
      trigger: '@', // Should be a single character like '@' or '#'
      renderSuggestions,
      textStyle: {fontWeight: 'bold', color: 'blue'}, // The mention style in the input
    },
  ];

  const renderComposer = props => {
    return (
      <ChatComposer
        onTextChanged={setText}
        partTypes={partTypes}
        selection={selection}
        {...props}
      />
    );
  };

  const sendAttachment = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });

      const filesApiURL = fileUpload;
      const FormData = require('form-data');
      let data = new FormData();
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
  };

  const displayNftItems = async () => {
    setIsNftItemGalleryVisible(true);
  };

  const renderAttachment = () => {
    const options = walletStore.nftItems.length
      ? {
          'Upload File': async () => await sendAttachment(),
          'Display an Item': async () => await displayNftItems(),
          Cancel: () => {
            console.log('Cancel');
          },
        }
      : {
          'Upload File': async () => await sendAttachment(),
          Cancel: () => {
            console.log('Cancel');
          },
        };
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
            options={options}
            optionTintColor="#000000"
          />
        </View>
      </View>
    );
  };

  const handleInputChange = t => {
    setText(t);
    isComposing(manipulatedWalletAddress, chatJid, fullName, chatStore.xmpp);
  };

  const renderMessage = props => {
    return <MessageBody {...props} />;
  };

  const onMediaMessagePress = (type: any, url: any, message) => {
    setMediaModal({open: true, type, url, message});
  };

  const handleOnLongPress = (message: any) => {
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

  const renderMessageImage = (props: any) => {
    const {
      image,
      realImageURL,
      mimetype,
      size,
      duration,
      waveForm,
      originalName,
      id,
      imageLocation,
      fileName,
      nftId,
      preview,
    } = props.currentMessage;
    let parsedWaveform = [];
    if (waveForm) {
      try {
        parsedWaveform = JSON.parse(waveForm);
      } catch (error) {
        console.log('cant parse wave');
      }
    }
    if (imageMimetypes[mimetype]) {
      return (
        <ImageMessage
          nftId={nftId}
          url={image}
          size={size}
          onPress={() =>
            onMediaMessagePress(mimetype, image, props.currentMessage)
          }
        />
      );
    } else if (videoMimetypes[mimetype]) {
      return (
        <VideoMessage
          url={image}
          size={size}
          onPress={() =>
            onMediaMessagePress(mimetype, image, props.currentMessage)
          }
        />
      );
    } else if (audioMimetypes[mimetype]) {
      return (
        <AudioMessage
          waveform={parsedWaveform}
          message={props}
          onPress={() =>
            onMediaMessagePress(mimetype, image, props.currentMessage)
          }
          onLongPress={handleOnLongPress}
        />
      );
    } else if (pdfMimemtype[mimetype]) {
      const pdfImage =
        'https://play-lh.googleusercontent.com/BkRfMfIRPR9hUnmIYGDgHHKjow-g18-ouP6B2ko__VnyUHSi1spcc78UtZ4sVUtBH4g=w480-h960-rw';
      return (
        <PdfMessage
          url={preview || pdfImage}
          size={size}
          onPress={() =>
            onMediaMessagePress(mimetype, image, props.currentMessage)
          }
        />
      );
    } else if (mimetype) {
      return (
        <FileMessage
          url={image}
          size={size}
          onPress={() => downloadFile(image, originalName)}
        />
      );
    }
  };

  const getOtherUserDetails = (props: any) => {
    const {avatar, name, _id} = props;
    const firstName = name.split(' ')[0];
    const lastName = name.split(' ')[1];
    const xmppID = _id.split('@')[0];
    // const {anotherUserWalletAddress} = this.props.loginReducer;
    const walletAddress = reverseUnderScoreManipulation(xmppID);
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
      anotherUserAvatar: avatar,
    });
  };

  const onUserAvatarPress = (props: any) => {
    //to set the current another user profile
    // otherUserStore.setUserData(firstName, lastName, avatar);

    const xmppID = props._id.split('@')[0];
    const walletAddress = reverseUnderScoreManipulation(xmppID);
    if (walletAddress === loginStore.initialData.walletAddress) {
      navigation.navigate(ROUTES.PROFILE);
      return;
    } else {
      getOtherUserDetails(props);
      navigation.navigate(ROUTES.OTHERUSERPROFILESCREEN);
    }
  };

  const sendMessage = (messageString: any, isSystemMessage: boolean) => {
    //this will close the reply component and empty the state onTapMessageObject
    const messageText = messageString[0].text;
    const tokenAmount = messageString[0].tokenAmount || 0;
    const receiverMessageId = messageString[0].receiverMessageId || 0;
    const manipulatedWalletAddress = underscoreManipulation(
      loginStore.initialData.walletAddress,
    );

    const data: IMessageToSend = {
      senderFirstName: loginStore.initialData.firstName,
      senderLastName: loginStore.initialData.lastName,
      senderWalletAddress: loginStore.initialData.walletAddress,
      isSystemMessage: isSystemMessage,
      tokenAmount: tokenAmount,
      receiverMessageId: receiverMessageId,
      mucname: chatName,
      photoURL: loginStore.userAvatar,
      roomJid: chatJid,
      isReply: true,
      mainMessage: createMainMessageForThread(currentMessage),

      showInChannel: showInChannel,
      push: true,
    };
    const text = parseValue(messageText, partTypes).plainText;
    const matches = Array.from(matchAll(messageText ?? '', mentionRegEx));
    matches.forEach(match =>
      sendInvite(manipulatedWalletAddress, chatJid, match[4], chatStore.xmpp),
    );
    sendMessageStanza(
      manipulatedWalletAddress,
      chatJid,
      text,
      data,
      chatStore.xmpp,
    );
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

  const sendNftItemsFromGallery = item => {
    const data: IMessageToSend = {
      senderFirstName: loginStore.initialData.firstName,
      senderLastName: loginStore.initialData.lastName,
      senderWalletAddress: loginStore.initialData.walletAddress,
      mucname: chatName,
      photoURL: loginStore.userAvatar,
      location: item.nftFileUrl,
      locationPreview: item.nftFileUrl,
      mimetype: item.nftMimetype,
      originalName: item.nftOriginalname,
      // attachmentId: item.nftId,
      nftId: item.nftId,
      isReply: true,
      wrappable: true,
      push: true,
      receiverMessageId: '0',
      mainMessage: createMainMessageForThread(currentMessage),
      showInChannel: showInChannel,
      roomJid: chatJid,
    };

    sendMediaMessageStanza(
      manipulatedWalletAddress,
      chatJid,
      data,
      chatStore.xmpp,
    );
    setIsNftItemGalleryVisible(false);
  };

  const closeMediaModal = () => {
    setMediaModal({type: '', open: false, url: ''});
  };

  const handleOnPress = (message: any) => {
    if (!message.user._id.includes(manipulatedWalletAddress)) {
      setIsShowDeleteOption(false);
    }
    setOnTapMessageObject(message);
    return onOpen();
  };

  const handleCopyText = () => {
    Clipboard.setString(onTapMessageObject.text);
    showToast('success', 'Info', 'Message copied', 'top');
    return onClose();
  };

  const renderMainMessageSection = () => {
    return (
      <HStack
        shadow="5"
        borderRadius={10}
        bg={commonColors.primaryColor}
        margin={2}>
        <View flex={0.19} alignItems="center" paddingTop={2}>
          <View
            width={hp('5.46%')}
            height={hp('5.46%')}
            justifyContent={'center'}
            alignItems={'center'}
            bgColor={commonColors.primaryDarkColor}
            borderRadius={hp('5.46%') / 2}>
            {loginStore.anotherUserAvatar ? (
              <Image
                source={{uri: loginStore.anotherUserAvatar}}
                style={{
                  height: hp('5.46%'),
                  width: hp('5.46%'),
                  borderRadius: hp('5.46%') / 2,
                }}
              />
            ) : (
              <Text
                style={{
                  fontFamily: textStyles.boldFont,
                  fontSize: hp('2'),
                  color: 'white',
                }}>
                {loginStore.anotherUserFirstname[0] +
                  loginStore.anotherUserLastname[0]}
              </Text>
            )}
          </View>
        </View>

        <View flex={0.9} padding={2} justifyContent={'flex-start'}>
          <HStack>
            <Text
              fontWeight={Platform.OS === 'ios' ? 'semibold' : null}
              style={{
                fontSize: hp('2.216%'),
                fontFamily: textStyles.boldFont,
                color: '#ffff',
              }}>
              {loginStore.anotherUserFirstname} {loginStore.anotherUserLastname}
            </Text>
            <Text
              marginLeft={3}
              style={{
                fontSize: hp('1.5%'),
                fontFamily: textStyles.mediumFont,
                color: '#ffff',
              }}>
              {parentTime}
            </Text>
          </HStack>
          <View marginTop={1}>
            <Text
              style={{
                fontSize: hp('2%'),
                fontFamily: textStyles.mediumFont,
                color: '#ffff',
              }}>
              {currentMessage.text}
            </Text>
          </View>
          {renderMessageImage({currentMessage})}
        </View>
      </HStack>
    );
  };

  return (
    <View flex={1} bg={'white'}>
      <SecondaryHeader title="Thread" />
      {audioMimetypes[mediaModal.type] && (
        <AudioPlayer audioUrl={mediaModal.url} />
      )}
      <View bg={commonColors.primaryDarkColor}>
        {renderMainMessageSection()}
      </View>

      {/* <Text selectable>{currentMessage._id}</Text> */}
      <Divider />

      <GiftedChat
        renderSend={renderSend}
        renderActions={renderAttachment}
        renderLoading={() => (
          <ActivityIndicator size={30} color={commonColors.primaryColor} />
        )}
        text={text}
        type={'thread'}
        renderUsernameOnMessage
        onInputTextChanged={handleInputChange}
        renderMessage={renderMessage}
        renderMessageImage={props => renderMessageImage(props)}
        renderComposer={renderComposer}
        messages={messages}
        renderAvatarOnTop
        onPressAvatar={onUserAvatarPress}
        renderChatFooter={() => (
          <RenderChatFooter
            setShowInChannel={setShowInChannel}
            showInChannel={showInChannel}
            allowIsTyping={allowIsTyping}
            showAlsoSendInRoom={true}
            composingUsername={composingUsername}
            fileUploadProgress={fileUploadProgress}
            isTyping={isTyping}
            setFileUploadProgress={setFileUploadProgress}
          />
        )}
        placeholder={'Type a message'}
        // listViewProps={{
        //   onEndReached: onLoadEarlier,
        //   onEndReachedThreshold: 0.05,
        // }}
        // textInputProps={{onSelectionChange: e => console.log(e)}}
        keyboardShouldPersistTaps={'handled'}
        onSend={messageString => sendMessage(messageString, false)}
        user={{
          _id:
            loginStore.initialData.xmppUsername +
            '@' +
            apiStore.xmppDomains.DOMAIN,
          name: loginStore.initialData.username,
        }}
        // inverted={true}
        alwaysShowSend
        showUserAvatar
        textInputProps={{
          color: 'black',
          onSelectionChange: e => setSelection(e.nativeEvent.selection),
        }}
        onLongPress={(message: any) => handleOnLongPress(message)}
        onTap={(message: any) => handleOnPress(message)}
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
      <Actionsheet
        isOpen={isOpen}
        onClose={() => {
          onClose(), setIsShowDeleteOption(true);
        }}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={handleCopyText}>Copy</Actionsheet.Item>
          {isShowDeleteOption ? (
            <Actionsheet.Item onPress={onClose} color="red.500">
              Delete
            </Actionsheet.Item>
          ) : null}
        </Actionsheet.Content>
      </Actionsheet>
      <TransactionModal
        type={modalType}
        closeModal={() => setShowModal(false)}
        extraData={extraData}
        isVisible={showModal}
      />
      <NftItemGalleryModal
        onItemPress={sendNftItemsFromGallery}
        isModalVisible={isNftItemGalleryVisible}
        nftItems={walletStore.nftItems}
        closeModal={() => setIsNftItemGalleryVisible(false)}
      />
      <ChatMediaModal
        url={mediaModal.url}
        type={mediaModal.type}
        onClose={closeMediaModal}
        open={!audioMimetypes[mediaModal.type] && mediaModal.open}
        messageData={mediaModal.message}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  sendButton: {
    backgroundColor: commonColors.primaryDarkColor,
    borderRadius: 100,
    padding: 5,
    marginRight: 5,
    paddingLeft: 7,
    marginBottom: 5,
  },
});

export default ThreadScreen;
