import React, {useEffect, useRef, useState} from 'react';
import {Actions, GiftedChat, Send, User} from 'react-native-gifted-chat';
import {AudioSendButton} from './AudioSendButton';
import {
  ActivityIndicator,
  Animated,
  Image,
  ImageBackground,
  NativeModules,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'react-native-blob-util';
import {fileUpload} from '../../config/routesConstants';
import {normalizeData} from '../../helpers/normalizeData';
import {useStores} from '../../stores/context';
import {httpUpload} from '../../config/apiService';
import {showToast} from '../Toast/toast';
import {Actionsheet, HStack, View, useDisclose} from 'native-base';
import {
  allowIsTyping,
  commonColors,
  defaultBotsList,
  textStyles,
} from '../../../docs/config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {IMessage, roomListProps} from '../../stores/chatStore';
import MessageBody from './MessageBody';
import {ImageMessage} from './ImageMessage';
import {VideoMessage} from './VideoMessage';
import {AudioMessage} from './AudioMessage';
import {PdfMessage} from './PdfMessage';
import {FileMessage} from './FileMessage';
import {downloadFile} from '../../helpers/downloadFile';
import {ChatComposer} from './Composer';
import {MentionSuggestionsProps} from '../../helpers/chat/inputTypes';
import {useNavigation} from '@react-navigation/native';
import RenderChatFooter from './RenderChatFooter';
import DocumentPicker from 'react-native-document-picker';
import {
  reverseUnderScoreManipulation,
  underscoreManipulation,
} from '../../helpers/underscoreLogic';
import {
  IMessageToSend,
  createMainMessageForThread,
} from '../../helpers/chat/createMessageObject';
import {
  isComposing,
  pausedComposing,
  retrieveOtherUserVcard,
  sendInvite,
  sendMediaMessageStanza,
  sendMessageStanza,
  sendReplaceMessageStanza,
} from '../../xmpp/stanzas';
import SecondaryHeader from '../SecondaryHeader/SecondaryHeader';
import parseChatLink from '../../helpers/parseChatLink';
import openChatFromChatLink from '../../helpers/chat/openChatFromChatLink';
import {mentionRegEx, parseValue} from '../../helpers/chat/inputUtils';
//@ts-ignore
import matchAll from 'string.prototype.matchall';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import {ChatLongTapModal} from '../Modals/Chat/ChatLongTapModal';
import {QRModal} from '../Modals/QR/QRModal';
import {ChatMediaModal} from '../Modals/ChatMediaModal';
import {MetaNavigation} from './MetaNavigation';
import {NftItemGalleryModal} from '../../../NftItemGalleryModal';
import Clipboard from '@react-native-clipboard/clipboard';
import {IDataForTransfer} from '../Modals/Chat/types';
import {ROUTES} from '../../constants/routes';
import {observer} from 'mobx-react-lite';
import {systemMessage} from '../../helpers/systemMessage';
import {banSystemMessage} from '../../helpers/banSystemMessage';
import {useDebounce} from '../../hooks/useDebounce';
import {
  isImageMimetype,
  isVideoMimetype,
  isAudioMimetype,
  isPdfMimetype,
} from '../../helpers/checkMimetypes';
//interfaces and types
export type containerType = 'main' | 'thread';

interface ChatContainerProps {
  containerType: containerType;
  roomDetails: roomListProps;
  messages: IMessage[];
  onLoadEarlier?: () => void;
  currentMessage?: IMessage;
}

interface ISenderDetails {
  senderFirstName: string;
  senderLastName: string;
  senderWalletAddress: string;
  photoURL: string;
}

interface IMediaProps {
  expiresAt: number;
  isPrivate: boolean;
  _id: string;
  userId: string;
  ownerKey: string;
  location: string;
  locationPreview: string;
  originalname: string;
  filename: string;
  mimetype: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  duration: any;
}

interface ISystemMessage {
  _id: number;
  text: string;
  createdAt: Date;
  system: true;
  tokenAmount: number;
  receiverMessageId: string;
  tokenName: string;
  nftId: string;
  transactionId: string;
}
//interfaces and types

//styles
const styles = StyleSheet.create({
  usernameStyle: {
    fontWeight: 'bold',
    color: '#FFFF',
    fontSize: hp('1.47%'),
  },
  sendButton: {
    backgroundColor: commonColors.primaryDarkColor,
    borderRadius: 100,
    padding: 5,
    marginRight: 5,
    paddingLeft: 7,
    marginBottom: 5,
  },
});
//styles

//main component
const ChatContainer = observer((props: ChatContainerProps) => {
  //props
  const {containerType, roomDetails, messages, onLoadEarlier, currentMessage} =
    props;
  //props

  //mobx stores
  const {loginStore, debugStore, chatStore, walletStore, apiStore} =
    useStores();
  //mobx stores

  //local states
  const [recording, setRecording] = useState<boolean>(false);
  const [fileUploadProgress, setFileUploadProgress] = useState<number>(0);
  const [isNftItemGalleryVisible, setIsNftItemGalleryVisible] =
    useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [selection, setSelection] = useState({start: 0, end: 0});
  const [isEditing, setIsEditing] = useState(false);
  const [onTapMessageObject, setOnTapMessageObject] = useState<IMessage>();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [composingUsername, setComposingUsername] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [isShowDeleteOption, setIsShowDeleteOption] = useState(true);
  const [showReplyOption, setShowReplyOption] = useState(true);
  const [showViewThread, setShowViewThread] = useState(false);
  const [showEditOption, setShowEditOption] = useState(true);
  const [showMetaNavigation, setShowMetaNavigation] = useState(true);
  const [showInChannel, setShowInChannel] = useState<boolean>(false);
  const [mediaModal, setMediaModal] = useState({
    open: false,
    url: '',
    type: '',
    message: {},
  });
  const [dataForLongTapModal, setDataForLongTapModal] = useState<
    IDataForTransfer & {open: boolean}
  >({
    name: '',
    message_id: '',
    senderName: '',
    walletFromJid: '',
    chatJid: '',
    open: false,
  });
  const {isOpen, onOpen, onClose} = useDisclose();
  //local states

  //local variables
  const mediaButtonAnimation = new Animated.Value(1);
  const audioRecorderPlayer = new AudioRecorderPlayer();
  const path = Platform.select({
    ios: 'audio.m4a',
    android: `${RNFetchBlob.fs.dirs.CacheDir}/audio.mp3`,
  });

  const senderDetails = {
    senderFirstName: loginStore.initialData.firstName,
    senderLastName: loginStore.initialData.lastName,
    senderWalletAddress: loginStore.initialData.walletAddress,
    photoURL: loginStore.userAvatar,
  };
  const giftedRef = useRef(null);
  const navigation = useNavigation();
  const manipulatedWalletAddress = underscoreManipulation(
    senderDetails.senderWalletAddress,
  );
  const {tokenTransferSuccess} = walletStore;
  const debouncedChatText = useDebounce(text, 500);
  //local variables

  //local functions
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

  function filterData(arr: any) {
    const samples = 24;
    const blockSize = Math.floor(arr.length / samples);
    const res = new Array(samples)
      .fill(0)
      .map((_, i) =>
        arr
          .slice(i * blockSize, (i + 1) * blockSize)
          .reduce((sum: number, val: number) => sum + Math.abs(val), 0),
      );

    return res;
  }

  const getAudioData = async (url?: string) => {
    const audioPath =
      (url as string) ||
      (Platform.OS === 'ios'
        ? `${RNFetchBlob.fs.dirs.CacheDir}/audio.m4a`
        : (path as string));
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

  const submitMediaMessage = (
    mediaListArray: IMediaProps[],
    roomDetail: roomListProps,
    xmpp: any,
    waveForm?: any,
  ) => {
    mediaListArray.map(async item => {
      // console.log(item.duration, 'masdedia messsdfsdfage');
      const data: IMessageToSend = {
        senderFirstName: senderDetails.senderFirstName,
        senderLastName: senderDetails.senderLastName,
        senderWalletAddress: senderDetails.senderWalletAddress,
        photoURL: senderDetails.photoURL,
        location: item.location,
        locationPreview: item.locationPreview,
        mimetype: item.mimetype,
        originalName: item.originalname,
        wrappable: true,
        push: true,
        mucname: roomDetail.name,
        roomJid: roomDetail.jid as string,
        receiverMessageId: '0',
        fileName: item.filename,
        size: item.size.toString(),
        duration: item?.duration,
        waveForm: JSON.stringify(waveForm),
        attachmentId: item._id,
      };

      sendMediaMessageStanza(
        manipulatedWalletAddress,
        roomDetail.jid,
        data,
        xmpp,
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
        submitMediaMessage(
          response.data.results,
          roomDetails,
          chatStore.xmpp,
          waveform,
        );
      }
    } catch (error) {
      console.log(error);
      showToast('error', 'Error', 'Cannot upload file, try again later', 'top');
    }
  };

  const displayNftItems = async () => {
    setIsNftItemGalleryVisible(true);
  };

  const scrollToParentMessage = (currentMessage: any) => {
    const parentIndex = messages.findIndex(
      item => item._id === currentMessage?.mainMessage?.id,
    );
    console.log(
      //@ts-ignore
      giftedRef.current?._messageContainerRef?.current?.scrollToIndex,
      'parent Index',
    );
    //@ts-ignore
    giftedRef.current?._messageContainerRef?.current?.scrollToIndex({
      animated: true,
      index: parentIndex,
    });
  };

  const sendAttachment = async (
    userToken: string,
    roomDetail: roomListProps,
  ) => {
    const xmpp = chatStore.xmpp;
    const filesApiURL = apiStore.defaultUrl + fileUpload;
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });
      const FormData = require('form-data');
      let data = new FormData();
      data.append('files', {
        uri: res[0].uri,
        type: res[0].type,
        name: res[0].name,
      });
      const absolutePath = res[0].fileCopyUri || undefined;
      const response = await httpUpload(
        filesApiURL,
        data,
        userToken,
        setFileUploadProgress,
      );
      setFileUploadProgress(0);

      if (response.data.results?.length) {
        if (response.data.results[0].mimetype === 'audio/mpeg') {
          let wave = await getAudioData(absolutePath);
          submitMediaMessage(response.data.results, roomDetail, xmpp, wave);
        } else {
          submitMediaMessage(response.data.results, roomDetail, xmpp, []);
        }
      }
    } catch (err) {
      console.log(err);
      // User cancelled the picker, exit any dialogs or menus and move on
      showToast('error', 'Error', 'Cannot upload file, try again later', 'top');
      console.log(err);
    }
  };

  const handleSetIsEditing = (value: boolean) => {
    setIsEditing(value);
  };

  const handleSendMessage = (message: IMessage[]) => {
    const messageText = message[0].text;
    const tokenAmount = message[0].tokenAmount || 0;
    const receiverMessageId = message[0].receiverMessageId || 0;
    const data = {
      senderFirstName: loginStore.initialData.firstName,
      senderLastName: loginStore.initialData.lastName,
      senderWalletAddress: loginStore.initialData.walletAddress,
      isSystemMessage: false,
      tokenAmount: tokenAmount,
      receiverMessageId: receiverMessageId,
      mucname: roomDetails.name,
      photoURL: loginStore.userAvatar,
      roomJid: roomDetails.jid,
      isReply: containerType === 'thread' || false,
      mainMessage: createMainMessageForThread(message[0] as IMessage),
      showInChannel: showInChannel,
      push: true,
    };

    if (isEditing) {
      sendReplaceMessageStanza(
        manipulatedWalletAddress,
        roomDetails.jid,
        messageText as string,
        onTapMessageObject?._id as string,
        data,
        chatStore.xmpp,
      );
    } else {
      const text = parseValue(
        messageText as string,
        partTypes as any,
      ).plainText;
      const matches = Array.from(matchAll(messageText ?? '', mentionRegEx));
      matches.forEach((match: any) =>
        sendInvite(
          manipulatedWalletAddress,
          roomDetails.jid,
          match[4],
          chatStore.xmpp,
        ),
      );
      sendMessageStanza(
        manipulatedWalletAddress,
        roomDetails.jid,
        text,
        data,
        chatStore.xmpp,
      );
    }
  };

  const handleChatLinks = (chatLink: string) => {
    const chatJID =
      parseChatLink(chatLink) + apiStore.xmppDomains.CONFERENCEDOMAIN;
    openChatFromChatLink(
      chatJID,
      loginStore.initialData.walletAddress,
      navigation,
      chatStore.xmpp,
    );
  };

  const sendNftItemsFromGallery = (item: any) => {
    const data: IMessageToSend = {
      senderFirstName: loginStore.initialData.firstName,
      senderLastName: loginStore.initialData.lastName,
      senderWalletAddress: loginStore.initialData.walletAddress,
      mucname: roomDetails.name,
      photoURL: loginStore.userAvatar,
      location: item.nftFileUrl,
      locationPreview: item.nftFileUrl,
      mimetype: item.nftMimetype,
      originalName: item.nftOriginalname,
      nftName: item.tokenName,
      nftId: item.nftId,
      wrappable: true,
      push: true,
      roomJid: roomDetails.jid,
      receiverMessageId: '0',
    };

    sendMediaMessageStanza(
      manipulatedWalletAddress,
      roomDetails.jid,
      data,
      chatStore.xmpp,
    );
    setIsNftItemGalleryVisible(false);
  };

  const closeMediaModal = () => {
    setMediaModal({type: '', open: false, url: '', message: {}});
  };

  const handleCopyText = () => {
    Clipboard.setString(onTapMessageObject?.text as string);
    showToast('success', 'Info', 'Message copied', 'top');
    return onClose();
  };

  const closeLongTapModal = () => {
    setDataForLongTapModal({
      name: '',
      message_id: '',
      senderName: '',
      walletFromJid: '',
      chatJid: '',
      open: false,
    });
  };

  const handleEdit = () => {
    if (!onTapMessageObject?.image || !onTapMessageObject.preview) {
      setIsEditing(true);
      setText(onTapMessageObject?.text as string);
      //@ts-ignore
      giftedRef?.current?.textInput?.focus();
    }
    setShowEditOption(true);
    onClose();
  };

  const handleInputChange = (text: string) => {
    setText(text);
    const {firstName, lastName} = loginStore.initialData;
    const fullName = firstName + ' ' + lastName;
    setTimeout(() => {
      isComposing(
        manipulatedWalletAddress,
        roomDetails.jid,
        fullName,
        chatStore.xmpp,
      );
    }, 2000);
  };

  const onMediaMessagePress = (type: any, url: any, message: any) => {
    setMediaModal({open: true, type, url, message});
  };

  const handleOnLongPress = (message: any) => {
    if (message.user._id.includes(manipulatedWalletAddress)) {
      return;
    }
    if (
      !message.user._id.includes(apiStore.xmppDomains.CONFERENCEDOMAIN_WITHOUT)
    ) {
      const jid = message.user._id.split('@' + apiStore.xmppDomains.DOMAIN)[0];
      const walletFromJid = reverseUnderScoreManipulation(jid);

      setDataForLongTapModal({
        name: message.user.name,
        message_id: message._id,
        senderName:
          loginStore.initialData.firstName +
          ' ' +
          loginStore.initialData.lastName,
        walletFromJid: walletFromJid,
        chatJid: roomDetails.jid,
        open: true,
      });
    }
  };

  const onUserAvatarPress = (props: {
    _id: string;
    name: string;
    avatar: string;
  }) => {
    //to set the current another user profile
    // otherUserStore.setUserData(firstName, lastName, avatar);
    const xmppID = props._id.split('@')[0];
    const walletAddress = reverseUnderScoreManipulation(xmppID);
    if (walletAddress === loginStore.initialData.walletAddress) {
      navigation.navigate(ROUTES.PROFILE as never);
      return;
    } else {
      chatStore.getOtherUserDetails({
        jid: props._id,
        avatar: props.avatar,
        name: props.name,
      });
      navigation.navigate(ROUTES.OTHERUSERPROFILESCREEN as never);
    }
  };

  const handleReply = (message?: any) => {
    setShowViewThread(false);
    //navigate to thread screen with current message details.
    //@ts-ignore
    navigation.navigate(ROUTES.THREADS, {
      currentMessage: message ? message : onTapMessageObject,
      chatJid: roomDetails.jid,
      chatName: roomDetails.name,
    });
    onClose();

    // if (type === 'open') {
    //   setIsReply(true);
    //   onClose();
    // }

    // if (type === 'close') {
    //   setIsReply(false);
    //   setOnTapMessageObject('');
    // }
  };

  const handleOnPress = (message: any) => {
    if (!message.user._id.includes(manipulatedWalletAddress)) {
      setIsShowDeleteOption(false);
      setShowEditOption(false);
    } else {
      setIsShowDeleteOption(true);
      setShowEditOption(true);
    }

    if (message.isReply) {
      setShowReplyOption(false);
    } else {
      setShowReplyOption(true);
    }

    if (message.numberOfReplies > 0) {
      setShowViewThread(true);
    } else {
      setShowViewThread(false);
    }

    setOnTapMessageObject(message);
    return onOpen();
  };

  const sendSystemMessage = (message: ISystemMessage[]) => {
    const messageText = message[0].text;
    const tokenAmount = message[0].tokenAmount || 0;
    const receiverMessageId = message[0].receiverMessageId || 0;

    const data = {
      ...message[0],
      senderFirstName: loginStore.initialData.firstName,
      senderLastName: loginStore.initialData.lastName,
      senderWalletAddress: loginStore.initialData.walletAddress,
      isSystemMessage: true,
      tokenAmount: tokenAmount,
      receiverMessageId: receiverMessageId,
      mucname: roomDetails.name,
      photoURL: loginStore.userAvatar,
      roomJid: roomDetails.jid,
      isReply: false,
      mainMessage: undefined,
      push: true,
    };
    sendMessageStanza(
      manipulatedWalletAddress,
      roomDetails.jid,
      messageText,
      data,
      chatStore.xmpp,
    );
  };

  //local functions

  //use effects
  useEffect(() => {
    if (
      chatStore.isComposing.chatJID === roomDetails.jid &&
      chatStore.isComposing.manipulatedWalletAddress !==
        manipulatedWalletAddress
    ) {
      setIsTyping(chatStore.isComposing.state);
      setComposingUsername(chatStore.isComposing.username);
    }
  }, [chatStore.isComposing.state]);

  useEffect(() => {
    if (tokenTransferSuccess.success) {
      const message = systemMessage({
        senderName: tokenTransferSuccess.senderName,
        tokenName: tokenTransferSuccess.tokenName,
        //@ts-ignore
        receiverMessageId: tokenTransferSuccess.receiverMessageId,
        receiverName: tokenTransferSuccess.receiverName,
        nftId: tokenTransferSuccess.nftId,
        tokenAmount: tokenTransferSuccess.amount,
        transactionId: tokenTransferSuccess.transaction?._id,
      });
      //@ts-ignore
      sendSystemMessage(message);
      walletStore.clearPreviousTransfer();
    }
  }, [tokenTransferSuccess.success]);

  useEffect(() => {
    if (chatStore.userBanData.success) {
      const message = banSystemMessage({...chatStore.userBanData});
      //@ts-ignore
      sendSystemMessage(message);
      chatStore.clearUserBanData();
    }
  }, [chatStore.userBanData.success]);

  useEffect(() => {
    pausedComposing(manipulatedWalletAddress, roomDetails.jid, chatStore.xmpp);
  }, [debouncedChatText]);

  useEffect(() => {
    if (
      chatStore.isComposing.chatJID === roomDetails.jid &&
      chatStore.isComposing.manipulatedWalletAddress !==
        manipulatedWalletAddress
    ) {
      setIsTyping(chatStore.isComposing.state);
      setComposingUsername(chatStore.isComposing.username);
    }
  }, [chatStore.isComposing.state]);
  //use effects

  //smaller components

  //component to render send button in the main chat text input.
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

  //component to render attachments in the main chat text input.
  const renderAttachment = () => {
    const options = walletStore.nftItems.length
      ? {
          'Upload File': async () =>
            await sendAttachment(loginStore.userToken, roomDetails),
          'Display an Item': async () => await displayNftItems(),
          Cancel: () => {
            console.log('Cancel');
          },
        }
      : {
          'Upload File': async () =>
            await sendAttachment(loginStore.userToken, roomDetails),
          Cancel: () => {
            console.log('Cancel');
          },
        };
    return (
      <View style={{position: 'relative'}}>
        <View
          accessibilityLabel="Choose attachment"
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
              <Entypo
                accessibilityLabel="Send Attachment"
                name="attachment"
                color={'black'}
                size={hp('3%')}
              />
            )}
            options={options}
            optionTintColor="#000000"
          />
        </View>
      </View>
    );
  };

  //component to render message body
  const renderMessage = (props: IMessage) => {
    return <MessageBody {...props} />;
  };

  //component to render message image
  const renderMedia = (props: any) => {
    if (!props) {
      return null;
    }
    const {
      image,
      mimetype,
      size,
      waveForm,
      originalName,
      nftId,
      preview,
      nftName,
    } = props;
    let parsedWaveform = [];
    if (waveForm) {
      try {
        parsedWaveform = JSON.parse(waveForm);
      } catch (error) {
        console.log('cant parse wave');
      }
    }
    if (isImageMimetype(mimetype)) {
      return (
        <ImageMessage
          nftName={nftName}
          nftId={nftId}
          url={image}
          size={size}
          onPress={() => onMediaMessagePress(mimetype, image, props)}
        />
      );
    } else if (isVideoMimetype(mimetype)) {
      return (
        <VideoMessage
          url={image}
          size={size}
          onPress={() => onMediaMessagePress(mimetype, image, props)}
        />
      );
    } else if (isAudioMimetype(mimetype)) {
      return (
        <AudioMessage
          waveform={parsedWaveform}
          message={props}
          onPress={() => onMediaMessagePress(mimetype, image, props)}
          onLongPress={handleOnLongPress}
        />
      );
    } else if (isPdfMimetype(mimetype)) {
      const pdfImage =
        'https://play-lh.googleusercontent.com/BkRfMfIRPR9hUnmIYGDgHHKjow-g18-ouP6B2ko__VnyUHSi1spcc78UtZ4sVUtBH4g=w480-h960-rw';
      return (
        <PdfMessage
          url={preview || pdfImage}
          size={size}
          onPress={() => onMediaMessagePress(mimetype, image, props)}
        />
      );
    } else if (mimetype) {
      return (
        <FileMessage
          url={image}
          size={size}
          onPress={() => downloadFile(image as string, originalName as string)}
        />
      );
    }
  };

  //component to render chat composer
  const renderComposer = (props: any) => {
    return (
      <ChatComposer
        onTextChanged={setText}
        partTypes={partTypes}
        selection={selection}
        {...props}
      />
    );
  };

  //component to render suggestions
  const renderSuggestions: React.FC<MentionSuggestionsProps> = ({
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

  const RenderMainMessageSection: React.FC = () => {
    const firstName = currentMessage?.user.name.split(' ')[0] || 'N/A';
    const lastName = currentMessage?.user.name.split(' ')[1] || 'N/A';
    //@ts-ignore
    const parentDate = new Date(currentMessage?.createdAt * 1000);
    const parentTime = parentDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
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
            {currentMessage?.user.avatar ? (
              <Image
                source={{uri: currentMessage.user.avatar}}
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
                {firstName[0] + lastName[0]}
              </Text>
            )}
          </View>
        </View>

        <View flex={0.9} padding={2} justifyContent={'flex-start'}>
          <HStack>
            <Text
              style={{
                fontSize: hp('2.216%'),
                fontFamily: textStyles.boldFont,
                color: '#ffff',
                fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
              }}>
              {currentMessage?.user.name}
            </Text>
            <Text
              style={{
                fontSize: hp('1.5%'),
                fontFamily: textStyles.mediumFont,
                color: '#ffff',
                marginLeft: 3,
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
              {currentMessage?.text}
            </Text>
          </View>

          {renderMedia(currentMessage as IMessage)}
        </View>
      </HStack>
    );
  };
  //smaller components

  return (
    <>
      <ImageBackground
        style={{width: '100%', height: '100%', zIndex: 0}}
        source={
          roomDetails.roomBackground
            ? {uri: roomDetails.roomBackground}
            : undefined
        }>
        {containerType === 'main' ? (
          <SecondaryHeader
            roomJID={roomDetails.jid}
            title={chatStore.roomsInfoMap[roomDetails.jid]?.name}
            isQR={true}
            onQRPressed={() => setShowQrModal(true)}
            isChatRoomDetail={true}
          />
        ) : (
          <SecondaryHeader title="Thread" />
        )}
        {/* @ts-ignore */}
        {isAudioMimetype(mediaModal.type) && (
          <AudioPlayer audioUrl={mediaModal.url} />
        )}
        {containerType === 'thread' && (
          <View bg={commonColors.primaryDarkColor}>
            <RenderMainMessageSection />
          </View>
        )}
        {chatStore.isLoadingEarlierMessages && (
          <View style={{backgroundColor: 'transparent'}}>
            <ActivityIndicator size={30} color={commonColors.primaryColor} />
          </View>
        )}
        <GiftedChat
          ref={giftedRef}
          renderSend={renderSend}
          renderActions={renderAttachment}
          renderLoading={() => (
            <ActivityIndicator size={30} color={commonColors.primaryColor} />
          )}
          text={text}
          //@ts-ignore
          containerType={containerType}
          scrollToParentMessage={(currentMessage: any) =>
            scrollToParentMessage(currentMessage)
          }
          renderUsernameOnMessage
          onInputTextChanged={handleInputChange}
          //@ts-ignore
          renderMessage={renderMessage}
          renderMessageImage={props => renderMedia(props.currentMessage)}
          renderComposer={renderComposer}
          //@ts-ignore
          messages={messages}
          renderAvatarOnTop
          onPressAvatar={onUserAvatarPress}
          renderChatFooter={() => (
            <RenderChatFooter
              setShowInChannel={setShowInChannel}
              isEditing={isEditing}
              setIsEditing={handleSetIsEditing}
              onTapMessageObject={onTapMessageObject}
              closeReply={() => handleReply('close')}
              replyMessage={onTapMessageObject?.text}
              replyUserName={onTapMessageObject?.user?.name}
              allowIsTyping={allowIsTyping}
              composingUsername={composingUsername}
              fileUploadProgress={fileUploadProgress}
              isTyping={isTyping}
              showInChannel={showInChannel}
              showAlsoSendInRoom={containerType === 'thread' && true}
              setFileUploadProgress={setFileUploadProgress}
            />
          )}
          placeholder={'Type a message'}
          listViewProps={{
            onEndReached: onLoadEarlier && onLoadEarlier,
            onEndReachedThreshold: 0.05,
          }}
          // onLoadEarlier={onLoadEarlier}
          // textInputProps={{onSelectionChange: e => console.log(e)}}
          keyboardShouldPersistTaps={'handled'}
          //@ts-ignore
          onSend={messageString => handleSendMessage(messageString)}
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
            onSelectionChange: (e: {nativeEvent: {selection: any}}) =>
              setSelection(e.nativeEvent.selection),
          }}
          onLongPress={(message: any) => handleOnLongPress(message)}
          onTap={(message: any) => handleOnPress(message)}
          handleReply={handleReply}
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
        <NftItemGalleryModal
          onItemPress={sendNftItemsFromGallery}
          isModalVisible={isNftItemGalleryVisible}
          nftItems={walletStore.nftItems}
          closeModal={() => setIsNftItemGalleryVisible(false)}
        />
        <Actionsheet
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setIsShowDeleteOption(true);
            setShowReplyOption(true);
            setShowViewThread(false);
          }}>
          <Actionsheet.Content>
            {showReplyOption ? (
              <Actionsheet.Item onPress={() => handleReply()}>
                Reply
              </Actionsheet.Item>
            ) : null}
            <Actionsheet.Item onPress={handleCopyText}>Copy</Actionsheet.Item>
            {showViewThread ? (
              <Actionsheet.Item onPress={() => handleReply()}>
                View thread
              </Actionsheet.Item>
            ) : null}
            {showEditOption && (
              <Actionsheet.Item onPress={handleEdit}>Edit</Actionsheet.Item>
            )}
            {isShowDeleteOption && (
              <Actionsheet.Item onPress={onClose} color="red.500">
                Delete
              </Actionsheet.Item>
            )}
          </Actionsheet.Content>
        </Actionsheet>
        <MetaNavigation
          chatId={roomDetails.jid.split('@')[0]}
          open={showMetaNavigation || chatStore.showMetaNavigation}
          onClose={() => {
            setShowMetaNavigation(false);
            chatStore.toggleMetaNavigation(false);
          }}
        />
        <ChatMediaModal
          url={mediaModal.url}
          //@ts-ignore
          type={mediaModal.type}
          onClose={closeMediaModal}
          //@ts-ignore
          open={!isAudioMimetype(mediaModal.type) && mediaModal.open}
          messageData={mediaModal.message}
        />
        <QRModal
          open={showQrModal}
          onClose={() => setShowQrModal(false)}
          title={'Chatroom'}
          link={roomDetails.jid}
        />
        <ChatLongTapModal
          open={dataForLongTapModal.open}
          onClose={closeLongTapModal}
          dataForTransfer={dataForLongTapModal}
        />
      </ImageBackground>
    </>
  );
});

export default ChatContainer;
