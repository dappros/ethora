/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {Component, createRef} from 'react';
import {
  Platform,
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Button,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import emojiUtils from 'emoji-utils';
import {connect} from 'react-redux';
import {GiftedChat, Actions, Send} from 'react-native-gifted-chat';
import MessageBody from '../components/MessageBody';
import {
  loginUser,
  setOtherUserDetails,
  setIsPreviousUser,
} from '../actions/auth';
import {
  fetchWalletBalance,
  transferTokensSuccess,
  fetchTransaction,
} from '../actions/wallet';
import ModalList from '../components/shared/commonModal';
import CustomHeader from '../components/shared/customHeader';
import {
  finalMessageArrivalAction,
  setRecentRealtimeChatAction,
  tokenAmountUpdateAction,
  updateMessageComposingState,
  setCurrentChatDetails,
} from '../actions/chatAction';
import {queryRoomAllMessages} from '../components/realmModels/messages';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  reverseUnderScoreManipulation,
  underscoreManipulation,
} from '../helpers/underscoreLogic';
import {systemMessage} from '../components/SystemMessage';
import {xmpp} from '../helpers/xmppCentral';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {updateRosterList} from '../components/realmModels/chatList';
import {TypingAnimation} from 'react-native-typing-animation';
import {
  isComposing,
  pausedComposing,
  activeChatState,
  retrieveOtherUserVcard,
} from '../helpers/xmppStanzaRequestMessages';
import {APP_TOKEN} from '../../docs/config';
import {coinsMainName} from '../../docs/config';
import * as xmppConstants from '../../src/constants/xmppConstants';
import {Player} from '@react-native-community/audio-toolkit';
import DocumentPicker from 'react-native-document-picker';
import * as connectionURL from '../config/url';
import fetchFunction from '../config/api';
import {logOut} from '../actions/auth';
import RNFetchBlob from 'rn-fetch-blob';
import downloadFile from '../helpers/downloadFileLogic';
import FastImage from 'react-native-fast-image';
import {updateMessageObject} from '../components/realmModels/messages';
import {commonColors, textStyles, allowIsTyping} from '../../docs/config';
import VideoRecorder from 'react-native-beautiful-video-recorder';
import VideoPlayer from 'react-native-video-player';
import WaveForm from 'react-native-audiowaveform';
import Modal from 'react-native-modal';

import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import Video from 'react-native-video';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';
import {fileUpload} from '../config/routesConstants';

const {primaryColor, primaryDarkColor} = commonColors;
const {boldFont, regularFont} = textStyles;

const {xml} = require('@xmpp/client');
const hitAPI = new fetchFunction();

// let xmpp;
const loadMessageAmount = 100;
let msgCountForCompose = 0;
let shownMessages = new Set();
// const URL = 'ws://13.52.235.156:443'

const emptyChatComponent = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{scaleY: -1}],
      }}>
      <Text>Nothing to show</Text>
    </View>
  );
};

const scrollToBottomDesign = () => {
  return (
    <View
      style={{
        width: hp('2%'),
        height: hp('2%'),
        borderRadius: hp('2%') / 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <EvilIcons size={hp('2%')} name="chevron-down" />
    </View>
  );
};

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      messages: [],
      showModal: false,
      modalType: null,
      extraData: null,
      chatRoomDetails: {
        chat_name: '',
        chat_jid: '',
        chats: [],
      },
      walletAddress: '',
      manipulatedWalletAddress: '',
      username: '',
      loadMessageIndex: 0,
      loadEarlier: true,
      isLoadingEarlier: false,
      firstName: '',
      lastName: '',
      isTyping: false,
      composingUsername: '',
      userAvatar: '',
      progressVal: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      recording: false,
      mediaContentModalVisible: false,
      playingMessageId: '',
      mediaModalContent: {type: '', localURL: '', remoteUrl: ''},
      videoPaused: false,
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
    this.cameraRef = createRef();
    this.mediaButtonAnimation = new Animated.Value(1);
  }

  //fucntion to get chat archive of a room
  animateMediaButtonIn = () => {
    Animated.spring(this.mediaButtonAnimation, {
      toValue: 1.8,
      useNativeDriver: true,
    }).start();
  };
  animateMediaButtonOut = () => {
    Animated.spring(this.mediaButtonAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,

      friction: 3,
    }).start();
  };
  async componentDidMount() {
    let firstName = '';
    let lastName = '';
    let chatRoomDetails = this.props.ChatReducer.chatRoomDetails;
    let walletAddress = '';
    let username = '';
    let userAvatar = this.props.loginReducer.userAvatar;
    const initialData = this.props.loginReducer.initialData;
    let loadMessageIndex;
    queryRoomAllMessages(chatRoomDetails.chat_jid).then(chats => {
      if (chats) {
        loadMessageIndex =
          chats.length > 0 ? chats.length - loadMessageAmount : 0;
        this.loadMessages(chats, loadMessageIndex);
      } else {
        console.log('chat is empty:', chats);
      }
    });
    walletAddress = initialData.walletAddress;
    const manipulatedWalletAddress = underscoreManipulation(walletAddress);
    firstName = initialData.firstName;
    lastName = initialData.lastName;
    username = initialData.username;

    this.setState({
      name: firstName + ' ' + lastName,
      firstName,
      lastName,
      walletAddress,
      manipulatedWalletAddress,
      username,
      chatRoomDetails,
      loadMessageIndex,
      userAvatar,
    });

    //add messages from realm to gifted chat

    //action call to fetch walletBalance
    await this.props.fetchWalletBalance(
      walletAddress,
      coinsMainName,
      this.props.loginReducer.token,
      true,
    );
  }

  componentWillUnmount() {
    shownMessages.clear();
  }

  loadMessages(chats, loadMessageIndex) {
    this.setState({
      isLoadingEarlier: true,
    });

    if (loadMessageIndex === 0) {
      this.addMessage([], 0);
    } else {
      let messageIndex = 0;
      if (loadMessageIndex < 0) {
        messageIndex = 0;
      } else {
        messageIndex = loadMessageIndex;
      }

      let messageArray = [];

      chats.map((item, index) => {
        let messageObject = {
          _id: item.message_id,
          text: item.text,
          createdAt: item.createdAt,
          system: item.system,
          image: item.image,
          audio: item.audio,

          isStoredFile: item.isStoredFile,
          localURL: item.localURL,
          realImageURL: item.realImageURL,
          mimetype: item.mimetype,
          size: item.size,
          duration: item.duration,

          user: {
            _id: item.user_id,
            name: item.name,
          },
          tokenAmount: item.tokenAmount,
        };

        item.avatar ? (messageObject.user.avatar = item.avatar) : null;

        if (!shownMessages.has(index)) {
          messageArray.push(messageObject);
          shownMessages.add(index);
        }
      });

      this.addMessage(messageArray, messageIndex - loadMessageAmount, true);
    }
  }

  //function to add message object/array to the Gifted chat
  addMessage(messages = [], loadMessageIndex, isPrevious) {
    messages = messages.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    let pushNotiMessageIndex = null;
    messages.map((item, index) => {
      if (item.message_id === this.props.ChatReducer.pushData.msgId) {
        pushNotiMessageIndex = index;
      }
    });
    this.setState(
      previousState => ({
        loadMessageIndex,
        messages: isPrevious
          ? GiftedChat.prepend(previousState.messages, messages)
          : GiftedChat.append(previousState.messages, messages),
        isLoadingEarlier: false,
        loadEarlier: true,
      }),
      () => (pushNotiMessageIndex ? this.shouldScrollTo(10) : null),
    );
  }

  //function to send message
  submitMessage = async (messageString, isSystemMessage) => {
    let messageText = messageString[0].text;
    let tokenAmount = messageString[0].tokenAmount
      ? messageString[0].tokenAmount
      : '0';
    let receiverMessageId = messageString[0].receiverMessageId
      ? messageString[0].receiverMessageId
      : '0';

    //xml for the message to send
    const message = xml(
      'message',
      {
        id: 'sendMessage',
        type: 'groupchat',
        from:
          this.state.manipulatedWalletAddress +
          '@' +
          this.props.apiReducer.xmppDomains.DOMAIN,
        to: this.state.chatRoomDetails.chat_jid,
      },
      xml('body', {}, messageText),
      xml('data', {
        xmlns: 'http://' + this.props.apiReducer.xmppDomains.DOMAIN,
        senderJID:
          this.state.manipulatedWalletAddress +
          '@' +
          this.props.apiReducer.xmppDomains.DOMAIN,
        senderFirstName: this.state.firstName,
        senderLastName: this.state.lastName,
        senderWalletAddress: this.state.walletAddress,
        isSystemMessage: isSystemMessage,
        tokenAmount: tokenAmount,
        receiverMessageId: receiverMessageId,
        mucname: this.state.chatRoomDetails.chat_name,
        photoURL: this.state.userAvatar ? this.state.userAvatar : null,
      }),
    );

    //call to send message to the xmpp server
    await xmpp.send(message);

    //function call to add message to gifted chat
    // this.addMessage(messageString,this.state.loadMessageIndex,false)
  };

  //gifted chat render message funtion
  renderMessage(props) {
    const {
      currentMessage: {text: currText},
    } = props;

    let messageTextStyle;

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      };
    }

    return <MessageBody {...props} messageTextStyle={messageTextStyle} />;
  }

  //longpress any message function
  onLongPressMessage(e, m) {
    let extraData = {};
    if (!m.user._id.includes(this.props.apiReducer.xmppDomains.CONF_WITHOUT)) {
      const jid = m.user._id.split(
        '@' + this.props.apiReducer.xmppDomains.DOMAIN,
      )[0];
      const walletFromJid = reverseUnderScoreManipulation(jid);
      const token = this.props.loginReducer.token;
      const roomJID = this.state.chatRoomDetails.chat_jid;

      extraData = {
        type: 'transfer',
        amnt: null,
        name: m.user.name,
        message_id: m._id,
        walletFromJid,
        roomJID,
        token,
        jid,
        senderName: this.state.name,
      };
    } else {
      extraData = {
        type: 'transfer',
        amnt: null,
        name: m.user.name,
        roomJID,
        message_id: m._id,
        jid,

        senderName: this.state.name,
      };
    }
    this.setState({
      showModal: true,
      modalType: 'tokenTransfer',
      extraData,
    });
  }

  invokeSystemMessage(data) {
    let message = systemMessage(data);
    this.addMessage(message, this.state.loadMessageIndex, false);
  }

  //close modal function
  closeModal = () => {
    this.setState({
      showModal: false,
    });
  };

  //on QRCode pressed function
  QRPressed = () => {
    // this.scrollToMessage()
    let {chat_jid, chat_name} = this.state.chatRoomDetails;
    this.setState({
      showModal: true,
      modalType: 'generateQR',
      extraData: chat_jid,
    });
    //for token received demo
    // this.setState({
    //   showModal:true,
    //   modalType:"tokenTransfer",
    //   extraData:{type:'receive',amnt:"20",text:"The stanza is meant to be used to send data between XMPP entities"}
    // })
  };

  openWallet = async walletAddress => {
    await this.props.fetchTransaction(
      walletAddress,
      this.props.apiReducer.defaultToken,
      walletAddress === this.state.walletAddress ? true : false,
    );
  };

  onAvatarPress = props => {
    const {avatar, name, _id} = props;
    const firstName = name.split(' ')[0];
    const lastName = name.split(' ')[1];
    const xmppID = _id.split('@')[0];
    const {anotherUserWalletAddress} = this.props.loginReducer;
    let walletAddress = reverseUnderScoreManipulation(xmppID);

    if (anotherUserWalletAddress === walletAddress) {
      this.props.setIsPreviousUser(true);
      this.props.navigation.navigate('AnotherProfileComponent');
    } else {
      //fetch transaction
      this.openWallet(walletAddress).then(async () => {
        //check if user clicked their own avatar/profile
        if (walletAddress === this.state.walletAddress) {
          this.props.navigation.navigate('ProfileComponent');
        } else {
          const myXmppUsername = this.state.manipulatedWalletAddress;
          const theirXmppUsername = xmppID;
          //this will get the other user's Avatar and description
          retrieveOtherUserVcard(myXmppUsername, theirXmppUsername);

          //to set the current another user profile
          await this.props.setOtherUserDetails({
            anotherUserFirstname: firstName,
            anotherUserLastname: lastName,
            anotherUserWalletAddress: walletAddress,
            isPreviousUser: false,
          });

          await this.props.fetchWalletBalance(
            walletAddress,
            coinsMainName,
            this.props.apiReducer.defaultToken,
            false,
          );

          this.props.navigation.navigate('AnotherProfileComponent');
        }
      });
    }
  };

  constructUrl = route => {
    return this.props.apiReducer.defaultUrl + route;
  };
  onStartRecord = async () => {
    this.animateMediaButtonIn();
    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: 'hello.m4a',
      android: `${dirs.CacheDir}/hello.mp3`,
    });
    const result = await this.audioRecorderPlayer.startRecorder(path);

    // this.setState({
    //   recording: true,
    // });
  };
  onStopRecord = async () => {
    this.animateMediaButtonOut();

    // [{"fileCopyUri": "content://com.android.providers.downloads.documents/document/raw%3A%2Fstorage%2Femulated%2F0%2FDownload%2Fhello.mp3", "name": "hello.mp3", "size": 84384, "type": "audio/mpeg", "uri": "content://com.android.providers.downloads.documents/document/raw%3A%2Fstorage%2Femulated%2F0%2FDownload%2Fhello.mp3"}]
    // const dirs = RNFetchBlob.fs.dirs;

    // const res = await DocumentPicker.pick({
    //   type: [DocumentPicker.types.allFiles],
    // });
    // console.log(res, 'resfdfsd')
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.setState({
      recording: false,
    });
    console.log(result, 'ressslsllsl');
    const {token} = this.props.loginReducer;
    const filesApiURL = this.constructUrl(fileUpload);
    const FormData = require('form-data');
    let data = new FormData();

    // let correctpath = '';
    // const str1 = 'file://';
    // const str2 = res.uri;
    // correctpath = str2.replace(str1, '');

    data.append('files', {
      uri: result,
      type: 'audio/mpeg',
      name: 'sound.mp3',
    });
    hitAPI.fileUpload(
      filesApiURL,
      data,
      token,
      async () => {
        logOut();
      },
      val => {
        console.log('Progress:', val);
        this.setState({
          progressVal: val,
        });
      },
      async response => {
        if (response.results.length) {
          // alert(JSON.stringify(data));
          this.submitMediaMessage(response.results);
          console.log(response, 'dsfjdksfklsdjfkdsjlfj');
        }
      },
    );
  };
  onStartPlay = async () => {
    console.log('onStartPlay');
    const msg = await this.audioRecorderPlayer.startPlayer();
    console.log(msg);
    this.audioRecorderPlayer.addPlayBackListener(e => {
      this.setState({
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.currentPosition),
        ),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      return;
    });
  };

  scrollToMessage(messageID) {
    let indexValue = null;
    msgContainerRef.current.props.data.map((item, index) => {
      if (item._id === '1597118152887713') {
        indexValue = index;
      }
    });

    // msgContainerRef.current.scrollToOffset({offset:offsetValue, animated:true});
    msgContainerRef.current.scrollToIndex({
      index: indexValue,
      animated: true,
      viewOffset: 0,
      viewPosition: 0,
    });
  }
  onLongPressAvatar(m) {
    let extraData = {};
    if (!m._id.includes(this.props.apiReducer.xmppDomains.CONFERENCEDOMAIN)) {
      const jid = m._id.split(
        '@' + this.props.apiReducer.xmppDomains.DOMAIN,
      )[0];
      const walletFromJid = reverseUnderScoreManipulation(jid);
      const token = this.props.loginReducer.token;
      const roomJID = this.state.chatRoomDetails.chat_jid;

      extraData = {
        type: 'transfer',
        amnt: null,
        name: m.name,
        message_id: m._id,
        walletFromJid,
        roomJID,
        token,
        senderName: this.state.name,
      };
    } else {
      extraData = {
        type: 'transfer',
        amnt: null,
        name: m.name,
        message_id: m._id,
        roomJID,
        senderName: this.state.name,
      };
    }
    this.setState({
      showModal: true,
      modalType: 'tokenTransfer',
      extraData,
    });
  }

  //lifecycle when the component gets updated
  async componentDidUpdate(prevProps, prevState) {
    //execute only after xmpp has made a connection and xmpp is not undefined
    if (xmpp) {
      //when enter the room, get messages from data base first
      // console.log(this.props.ChatReducer.chatRoomDetails.chat_jid,'outthisloop')
      // if(this.props.ChatReducer.chatRoomDetails.chat_jid!==prevProps.ChatReducer.chatRoomDetails.chat_jid){
      // 	console.log('inthisloop')
      // 	this.setState({
      // 		messages:[]
      // 	})
      // 	queryRoomAllMessages(this.props.ChatReducer.chatRoomDetails.chat_jid).then(chats=>{
      // 		shownMessages.clear();
      // 		this.loadMessages(chats,chats.length-loadMessageAmount)
      // 	});
      // }
      //once the final event for message arrives get the new messages from the database once again, if there are no new messages it remains the same
      if (
        this.props.ChatReducer.finalMessageArrived &&
        this.props.ChatReducer.finalMessageArrived !==
          prevProps.ChatReducer.finalMessageArrived
      ) {
        queryRoomAllMessages(
          this.props.ChatReducer.chatRoomDetails.chat_jid,
        ).then(chats => {
          let tokenAmount = 0;
          let receiverMessageId = '';
          this.props.finalMessageArrivalAction(false);
          this.setState({
            messages: [],
          });
          shownMessages.clear();
          if (chats.length > 0) {
            // console.log(chatsLastObject.duration, 'asflksdu343902')
            const chatsLastObject = chats[chats.length - 1];
            tokenAmount = chatsLastObject.tokenAmount
              ? chatsLastObject.tokenAmount
              : tokenAmount;
            receiverMessageId = chatsLastObject.receiverMessageId
              ? chatsLastObject.receiverMessageId
              : receiverMessageId;
            const lastMessageObject = {
              _id: chatsLastObject.message_id,
              text: chatsLastObject.text,
              createdAt: chatsLastObject.createdAt,
              image: chatsLastObject.image,
              audio: chatsLastObject.audio,

              realImageURL: chatsLastObject.realImageURL,
              localURL: chatsLastObject.localURL,
              isStoredFile: chatsLastObject.isStoredFile,
              mimetype: chatsLastObject.mimetype,
              size: chatsLastObject.size,
              duration: chatsLastObject.duration,

              user: {
                _id: chatsLastObject.user_id,
                name: chatsLastObject.name,
                avatar: chatsLastObject.avatar,
              },
            };
            this.props.setRecentRealtimeChatAction(
              lastMessageObject,
              chatsLastObject.room_name,
              false,
              tokenAmount,
              receiverMessageId,
            );
            this.loadMessages(chats, chats.length - loadMessageAmount);
          }
        });
      }

      //check for message token update and update message accordingly
      if (this.props.ChatReducer.tokenAmountUpdate) {
        queryRoomAllMessages(
          this.props.ChatReducer.chatRoomDetails.chat_jid,
        ).then(chats => {
          this.setState({
            messages: [],
          });
          shownMessages.clear();
          this.loadMessages(chats, chats.length - loadMessageAmount - 1);
        });

        this.props.tokenAmountUpdateAction(false);
      }

      //display token transfer system message after successful transaction
      if (
        this.props.walletReducer.tokenTransferSuccess.success !==
          prevProps.walletReducer.tokenTransferSuccess.success &&
        this.props.walletReducer.tokenTransferSuccess.success
      ) {
        const senderName =
          this.props.walletReducer.tokenTransferSuccess.senderName;
        const receiverMessageId =
          this.props.walletReducer.tokenTransferSuccess.receiverMessageId;
        const receiverName =
          this.props.walletReducer.tokenTransferSuccess.receiverName;
        const amount = this.props.walletReducer.tokenTransferSuccess.amount;
        const tokenName =
          this.props.walletReducer.tokenTransferSuccess.tokenName;
        console.log(
          this.props.walletReducer.tokenTransferSuccess,
          'tradjnsakdjsdfjdskjf',
        );
        let message = systemMessage({
          senderName,
          receiverName,
          amount,
          receiverMessageId,
          tokenName,
        });
        this.submitMessage(message, message[0].system);
        this.props.transferTokensSuccess({
          success: false,
          senderName: '',
          receiverName: '',
          amount: 0,
          receiverMessageId: '',
          tokenName: '',
        });
      }

      //adding the realtime messages to the gifted chat
      if (
        this.props.ChatReducer.recentRealtimeChat.message_id !==
          prevProps.ChatReducer.recentRealtimeChat.message_id &&
        this.props.ChatReducer.recentRealtimeChat.shouldUpdateChatScreen &&
        this.props.ChatReducer.recentRealtimeChat.room_name ===
          this.props.ChatReducer.chatRoomDetails.chat_jid
      ) {
        const recentRealtimeChat = this.props.ChatReducer.recentRealtimeChat;
        let messageObject = [{}];
        if (recentRealtimeChat.system) {
          messageObject = [
            {
              _id: recentRealtimeChat.message_id,
              text: recentRealtimeChat.text,
              createdAt: recentRealtimeChat.createdAt,
              system: true,
            },
          ];
        } else {
          console.log(recentRealtimeChat.duration, 'asfdsklfjlksdjfkasdldsjf');
          messageObject = [
            {
              _id: recentRealtimeChat.message_id,
              text: recentRealtimeChat.text,
              createdAt: recentRealtimeChat.createdAt,
              system: false,
              image: recentRealtimeChat.image,
              audio: recentRealtimeChat.audio,

              realImageURL: recentRealtimeChat.realImageURL,
              localURL: recentRealtimeChat.localURL,
              isStoredFile: recentRealtimeChat.isStoredFile,
              mimetype: recentRealtimeChat.mimetype,
              size: recentRealtimeChat.size,
              duration: recentRealtimeChat.duration,

              user: {
                _id: recentRealtimeChat.user_id,
                name: recentRealtimeChat.name,
                avatar: recentRealtimeChat.avatar,
              },
            },
          ];
        }

        if (this.state.username !== recentRealtimeChat.name) {
          //if recentRealtimeChat.system == true then play sound.
          if (recentRealtimeChat.system) {
            let coinSound = '';

            switch (recentRealtimeChat.tokenAmount) {
              case 1:
                coinSound = 'token1.mp3';
                break;
              case 3:
                coinSound = 'token3.mp3';
                break;

              case 5:
                coinSound = 'token5.mp3';
                break;

              case 7:
                coinSound = 'token7.mp3';
                break;
            }
            new Player(coinSound).play();
          }
          this.addMessage(messageObject, this.state.loadMessageIndex, false);
        }
        updateRosterList({
          counter: 0,
          jid: recentRealtimeChat.room_name,
          lastUserName: null,
          lastUserText: null,
          participants: null,
          createdAt: null,
          name: null,
        });
      }

      //message composing update
      if (
        prevProps.ChatReducer.isComposing.state !==
          this.props.ChatReducer.isComposing.state &&
        this.props.ChatReducer.isComposing.mucRoom ===
          this.props.ChatReducer.chatRoomDetails.chat_jid
      ) {
        const fullName = this.state.firstName + ' ' + this.state.lastName;
        const manipulatedWalletAddress =
          this.props.ChatReducer.isComposing.manipulatedWalletAddress;
        if (manipulatedWalletAddress !== this.state.manipulatedWalletAddress) {
          this.setState({
            isTyping: this.props.ChatReducer.isComposing.state,
            composingUsername: this.props.ChatReducer.isComposing.username,
          });
        }

        // if(this.props.ChatReducer.isComposing){
        //   this.setState({
        //     isTyping : true
        //   },()=>this.props.updateMessageComposingState(false));
        // }else if(this.state.isTyping){
        //   this.setState({
        //     isTyping : false
        //   })
        // }
      }
    }
  }

  renderLoadEarlierFunction = props => {
    let loadText = 'loading messages';
    if (this.state.loadMessageIndex <= 0) {
      loadText = 'End of Conversation';
    }
    // if(this.state.chatRoomDetails.chats){
    if (props.messages.length === 0) {
      loadText = '';
    }
    // }
    return (
      <View style={{alignItems: 'center'}}>
        <Text>{loadText}</Text>
      </View>
    );
  };

  onLoadEarlierFunction() {
    queryRoomAllMessages(this.props.ChatReducer.chatRoomDetails.chat_jid).then(
      chats => {
        this.loadMessages(chats, this.state.loadMessageIndex);
      },
    );
  }

  chatFooter() {
    setTimeout(() => {
      if (this.state.progressVal === 100) {
        this.setState({
          progressVal: 0,
        });
      }
    }, 5000);
    return (
      <View
        style={{
          height: hp('5.5%'),
          width: wp('100%'),
          backgroundColor: 'transparent',
          flexDirection: 'row',
        }}>
        <View style={{flex: 0.6}}>
          {allowIsTyping && this.state.isTyping ? (
            <View style={styles.isTypingContainer}>
              <View style={{marginRight: 30}}>
                <TypingAnimation dotColor="grey" />
              </View>
              <Text style={styles.isTypingTextStyle}>
                {this.state.composingUsername}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.progressContainer}>
          {this.state.progressVal ? (
            <Text style={styles.progressNumberText}>
              Uploading: {this.state.progressVal}%
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  submitMediaMessage = props => {
    props.map(async item => {
      // console.log(item.duration, 'masdedia messsdfsdfage');

      const message = xml(
        'message',
        {
          id: 'sendMessage',
          type: 'groupchat',
          from:
            this.state.manipulatedWalletAddress +
            '@' +
            this.props.apiReducer.xmppDomains.DOMAIN,
          to: this.state.chatRoomDetails.chat_jid,
        },
        xml('body', {}, 'media file'),
        xml('data', {
          xmlns: 'http://' + this.props.apiReducer.xmppDomains.DOMAIN,
          senderJID:
            this.state.manipulatedWalletAddress +
            '@' +
            this.props.apiReducer.xmppDomains.DOMAIN,
          senderFirstName: this.state.firstName,
          senderLastName: this.state.lastName,
          senderWalletAddress: this.state.walletAddress,
          isSystemMessage: false,
          tokenAmount: '0',
          receiverMessageId: '0',
          mucname: this.state.chatRoomDetails.chat_name,
          photoURL: this.state.userAvatar ? this.state.userAvatar : '',
          isMediafile: true,
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
        }),
      );

      await xmpp.send(message);
    });
  };

  downloadFunction = props => {
    const {realImageURL, isStoredFile, _id, mimetype} = props.currentMessage;
    const filename = realImageURL.substring(realImageURL.lastIndexOf('/') + 1);
    this.setState({
      showModal: true,
      modalType: 'loading',
    });
    downloadFile(
      {
        fileURL: realImageURL,
        fileName: filename,
        closeModal: this.closeModal(),
        mimetype: mimetype,
      },
      path => {
        updateMessageObject({localURL: path, receiverMessageId: _id});
      },
    );
  };

  startDownload = props => {
    const {isStoredFile, mimetype, localURL, realImageURL, id} =
      props.currentMessage;
    var RNFS = require('react-native-fs');
    this.setState({
      mediaModalContent: {
        type: mimetype,
        url: localURL,
        remoteUrl: realImageURL,
      },
      mediaContentModalVisible:
        mimetype === 'audio/mpeg' || mimetype === 'application/octet-stream'
          ? false
          : true,
    });
    console.log(mimetype, '2329084234203');
    // if (isStoredFile) {
    //   this.setState({playingMessageId: id});
    //   //display image from store location path on modal view
    //   RNFS.exists(localURL)
    //     .then(val => {
    //       if (val) {
    //         if (Platform.OS === 'ios') {
    //           try {
    //             RNFetchBlob.ios.openDocument('file://' + localURL);
    //           } catch (err) {
    //             console.log(err, 'rnfetchblobcatch');
    //           }
    //         }
    //         if (Platform.OS === 'android') {
    //           console.log(mimetype, 'Asfadsfsfbvdfbdfghbdfghbfg');
    //           // RNFetchBlob.android.actionViewIntent(localURL, mimetype);

    //           if (mimetype === 'audio/mpeg') {
    //             // new Player(realImageURL).play();
    //           } else {
    //             // RNFetchBlob.android.actionViewIntent(localURL, mimetype);
    //           }
    //         }
    //       } else {
    //         this.downloadFunction(props);
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // } else {
    //   //download file and display the modal
    //   // const filename = realImageURL.substring(realImageURL.lastIndexOf('/')+1);
    //   // this.setState({
    //   //   showModal: true,
    //   //   modalType: 'loading',
    //   // })
    //   // downloadFile({fileURL:realImageURL, fileName: filename, closeModal:this.closeModal()}, path=>{
    //   //   console.log(path,"path path path");
    //   //   updateMessageObject({realImageURL:path,receiverMessageId: _id})
    //   // });
    //   this.downloadFunction(props);
    // }
  };
  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    console.log((bytes / Math.pow(k, i)).toFixed(dm), 'Asdasdgbdfgbdfg', bytes);

    return {
      size: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
      unit: sizes[i],
    };
  }

  videoRecord = async () => {
    console.log('currentttt', this.cameraRef);

    if (this.cameraRef?.current) {
      this.cameraRef.current.open({maxLength: 30}, data => {
        console.log('captured datafdsfsdf', data); // data.uri is the file path
      });
    }
  };
  RenderMediaModalContent = () => {
    if (
      this.state.mediaModalContent.type === 'image/jpeg' ||
      this.state.mediaModalContent.type === 'image/png'
    ) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => this.toggleVideoModal(false)}
            activeOpacity={0.9}>
            <Image
              source={{uri: this.state.mediaModalContent.remoteUrl}}
              style={{width: '100%', height: '100%', borderRadius: 5}}
            />
          </TouchableOpacity>
        </View>
      );
    }
    if (this.state.mediaModalContent.type === 'video/mp4') {
      return (
        <View>
          <TouchableOpacity
            onPress={() =>
              this.setState({videoPaused: !this.state.videoPaused})
            }
            activeOpacity={1}
            style={{width: '100%', height: '100%'}}>
            <VideoPlayer
              video={{
                uri: this.state.mediaModalContent.remoteUrl,
              }}
              autoplay
              videoWidth={wp('100%')}
              videoHeight={hp('100%')}
              // thumbnail={{uri: 'https://i.picsum.photos/id/866/1600/900.jpg'}}
            />
          </TouchableOpacity>
        </View>
      );
    }
    // if (this.state.mediaModalContent.type === 'audio/mpeg') {
    //   return <AudioPlayer audioUrl={this.state.mediaModalContent.remoteUrl} />;
    // }
  };
  renderMessageImage = props => {
    const {image, realImageURL, mimetype, size, duration, id} =
      props.currentMessage;
    console.log(props.currentMessage, '234u2asdasda34');
    let formatedSize = {size: 0, unit: 'KB'};
    formatedSize = this.formatBytes(parseFloat(size), 2);
    if (
      mimetype === 'video/mp4' ||
      mimetype === 'image/jpeg' ||
      mimetype === 'image/png'
      // mimetype === 'application/octet-stream'
    ) {
      return (
        <TouchableOpacity
          onPress={() => this.startDownload(props)}
          style={{
            borderRadius: 5,
            // padding: 5,
            width: hp('24%'),
            height: hp('24%'),
            justifyContent: 'center',
            position: 'relative',
          }}>
          <View
            style={{
              position: 'absolute',
              top: 10,
              // height: 30,
              // width: 100,
              left: 10,
              backgroundColor: 'rgba(0,0,0,0.6)',
              zIndex: 9999,
              padding: 5,
              borderRadius: 5,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                name="arrow-down-outline"
                size={hp('1.7%')}
                color={'white'}
              />
              <Text style={{color: 'white', fontSize: hp('1.6%')}}>
                {formatedSize.size + ' ' + formatedSize.unit}
              </Text>
            </View>

            {duration && (
              <Text
                style={{
                  color: 'white',
                  fontSize: hp('1.6%'),
                  marginLeft: hp('1.7%'),
                }}>
                {duration}
              </Text>
            )}
          </View>

          <View style={styles.downloadContainer}>
            <FastImage
              style={styles.messageImageContainer}
              source={{
                // @ts-ignore
                uri: realImageURL,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        </TouchableOpacity>
      );
    } else if (
      mimetype === 'audio/mpeg' ||
      mimetype === 'application/octet-stream'
    ) {
      console.log(mimetype, '238942384923840');
      // console.log(mimetype, props.currentMessage, 'aksdfdsfslsdjaasdasldasskld')
      return (
        <TouchableOpacity
          onPress={() => this.startDownload(props)}
          style={{
            borderRadius: 5,
            // padding: 5,
            // width: wp('10%'),
            height: hp('5%'),
            justifyContent: 'center',
            position: 'relative',
          }}>
          {/* {mimetype === 'video/mp4' && (
        <View
          style={{
            position: 'absolute',
            top: 10,
            height: 30,
            // width: 100,
            left: 10,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            padding: 5,
            borderRadius: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Ionicons
            name="arrow-down-outline"
            size={hp('1.7%')}
            color={'white'}
          />
          <Text style={{color: 'white', fontSize: hp('1.6%')}}>
            {formatedSize.size + ' ' + formatedSize.unit}
          </Text>
        </View>
      )} */}

          {/* <View style={styles.downloadContainer}> */}
          {/* <View style={styles.sizeContainer}>
          <Text style={styles.sizeTextStyle}>{formatedSize.size}</Text>
          <Text style={styles.sizeTextStyle}>{formatedSize.unit}</Text>
        </View> */}

          <View
            style={{
              marginTop: 10,
              justifyContent: 'flex-start',
              alignItems: 'center',
              // width: '100%',
              flexDirection: 'row',
              // position: 'absolute',
              // left: props.position === 'left' ? '150%': null,
              // zIndex: 10000
            }}>
            {/* {this.state.playingMessageId === id ? (
              <FontAwesome
                name="pause-circle"
                size={hp('3%')}
                color={'white'}
                style={{
                  marginRight: 4,
                  marginLeft: 10,
                }}
              />
            ) : ( */}

            <AntDesign
              name="play"
              size={hp('3%')}
              color={'white'}
              style={{
                marginRight: 4,
                marginLeft: 10,
              }}
            />

            {/* )} */}

            {duration && (
              <WaveForm
                source={{uri: image}}
                style={{width: 100, height: '100%'}}
                waveFormStyle={{
                  waveColor: primaryDarkColor,
                  scrubColor: primaryDarkColor,
                }}
              />
            )}
            {/* </View> */}
          </View>
        </TouchableOpacity>
      );
    }
  };

  renderSend = props => {
    const animateMediaButtonStyle = {
      transform: [{scale: this.mediaButtonAnimation}],
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
          }}>
          <TouchableWithoutFeedback
            // onPress={this.start}

            onPressIn={this.onStartRecord}
            onPressOut={this.onStopRecord}>
            <Animated.View
              style={[
                {
                  backgroundColor: primaryDarkColor,
                  borderRadius: 50,
                  padding: 5,
                },
                animateMediaButtonStyle,
              ]}>
              <Entypo name="mic" color={'white'} size={hp('3%')} />
            </Animated.View>
          </TouchableWithoutFeedback>
          {/* <TouchableWithoutFeedback
            // onPress={this.start}

            onPressIn={this.onStartRecord}
            onPressOut={this.onStopRecord}
            >
            <Animated.View
              style={[
                {
                  backgroundColor: primaryDarkColor,
                  borderRadius: 50,
                  padding: 5,
                },
                animateMediaButtonStyle,
              ]}>
              <Entypo name="camera" color={'white'} size={hp('3%')} />
            </Animated.View>
            
          </TouchableWithoutFeedback> */}
          {/* )} */}
        </View>
      );
    }
    return <Send {...props} />;
  };

  renderAttachment() {
    return (
      <View style={{position: 'relative'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            // position: 'absolute',
            // left: 0
            // width: hp('100%'),
          }}>
          <Actions
            containerStyle={{
              width: hp('4%'),
              height: hp('4%'),
              alignItems: 'center',
              justifyContent: 'center',
              // marginLeft: 3,
              // marginRight: 3,
              // marginBottom: 3,
            }}
            icon={() => <Entypo name="attachment" size={hp('3%')} />}
            options={{
              'Upload File': async () => {
                try {
                  const res = await DocumentPicker.pick({
                    type: [DocumentPicker.types.allFiles],
                  });
                  // console.log(
                  //   res,
                  //  'sdmflksdkjflu3iou490owiasdsa;lkdm'
                  // );
                  const {token} = this.props.loginReducer;
                  const filesApiURL = this.constructUrl(fileUpload);
                  const FormData = require('form-data');
                  let data = new FormData();
                  // correctpath = str2.replace(str1, '');
                  // alert(JSON.stringify(res))
                  data.append('files', {
                    uri: res[0].uri,
                    type: res[0].type,
                    name: res[0].name,
                  });
                  console.log(res[0].uri, 'reasdklaskdl;sakd');

                  hitAPI.fileUpload(
                    filesApiURL,
                    data,
                    token,
                    async () => {
                      logOut();
                    },
                    val => {
                      console.log('Progress:', val);
                      this.setState({
                        progressVal: val,
                      });
                    },
                    async response => {
                      if (response?.results?.length) {
                        this.submitMediaMessage(response.results);
                      }
                    },
                  );
                  console.log(JSON.stringify(data), 'asdasasdasdkd');
                } catch (err) {
                  if (DocumentPicker.isCancel(err)) {
                    // User cancelled the picker, exit any dialogs or menus and move on
                  } else {
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

          {/* <Actions
            containerStyle={{
              // width: hp('100%'),
              height: hp('4%'),
              width: hp('5%'),

              alignItems: 'center',
              justifyContent: 'center',
              // marginLeft: 3,
              // marginRight: 3,
              // marginBottom: 3,
            }}
            icon={() => (
              <View style={{flexDirection: 'row'}}>
               
                {this.state.recording ? (
                  <TouchableOpacity
                    // onPress={this.takePicture}
                    onPress={this.onStopRecord}>
                    {<Ionicons name="stop-circle" size={hp('3%')} />}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    // onPress={this.takePicture}
                    onPress={this.onStartRecord}>
                    <Entypo name="mic" size={hp('3%')} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          /> */}
          {/* <Actions
          containerStyle={{
            width: hp('100%'),
            height: hp('4%'),
            alignItems: 'center',
            justifyContent: 'center',
            // marginLeft: 3,
            // marginRight: 3,
            // marginBottom: 3,
          }}
          icon={() => (
            <TouchableOpacity
            // onPress={this.takePicture}
              onPressIn={this.onStartRecord}
              onPressOut={this.onStopRecord}
              >
              <Entypo name="mic" size={hp('3%')} />
            </TouchableOpacity>
          )}

         
        /> */}
        </View>
      </View>
    );
  }

  handleInputChange() {
    let {manipulatedWalletAddress, chatRoomDetails, firstName, lastName} =
      this.state;
    // msgCountForCompose = msgCountForCompose +1;
    const duration = 2000;
    const fullName = firstName + ' ' + lastName;
    clearTimeout(this.inputTimer);
    // if(msgCountForCompose>4){
    isComposing(
      manipulatedWalletAddress,
      chatRoomDetails.chat_jid,
      fullName,
    ).then(() => {
      this.inputTimer = setTimeout(() => {
        pausedComposing(manipulatedWalletAddress, chatRoomDetails.chat_jid);
      }, duration);
    });

    // }
  }
  onBackdropPress = () => {
    this.setState({mediaContentModalVisible: false});
  };
  toggleVideoModal = value => {
    this.setState({mediaContentModalVisible: value});
  };

  shouldScrollTo(indexValue) {
    // console.log(this.giftedRef,"giftedprops");
    try {
      this.giftedRef._messageContainerRef.current.scrollToIndex({
        index: indexValue,
        animated: true,
      });
    } catch (err) {
      alert('Could not load the message intended');
    }
  }

  handleChatLinks = chatLink => {
    const walletAddress = this.props.loginReducer.initialData.walletAddress;
    const chatJID = parseChatLink(chatLink);
    openChatFromChatLink(
      chatJID,
      walletAddress,
      this.props.setCurrentChatDetails,
      this.props.navigation,
    );
  };
  start = () => {
    // 30 seconds
    this.videoRecorder.open({maxLength: 30}, data => {
      console.log('captured data', data);
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <CustomHeader
          isQR={true}
          onQRPressed={() => this.QRPressed()}
          navigation={this.props.navigation}
        />

        <VideoRecorder
          ref={ref => {
            this.videoRecorder = ref;
          }}
        />

        {(this.state.mediaModalContent.type === 'audio/mpeg' ||
          this.state.mediaModalContent.type === 'application/octet-stream') && (
          <AudioPlayer audioUrl={this.state.mediaModalContent.remoteUrl} />
        )}
        <GiftedChat
          renderLoading={() => (
            <ActivityIndicator size="large" color={primaryColor} />
          )}
          // loadEarlier={true}
          renderLoadEarlier={e => this.renderLoadEarlierFunction(e)}
          renderUsernameOnMessage
          usernameStyle={{
            fontFamily: boldFont,
            color: '#FFFF',
            fontSize: hp('1.47%'),
          }}
          renderActions={() => this.renderAttachment()}
          alwaysShowSend
          showUserAvatar
          infiniteScroll
          scrollToBottom
          scrollToBottomComponent={() => scrollToBottomDesign()}
          scrollToBottomStyle={{
            shadowColor: '#000000',
            shadowOffset: {width: 0, height: 3},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          renderSend={this.renderSend}
          renderChatFooter={() => this.chatFooter()}
          renderChatEmpty={() => emptyChatComponent()}
          isLoadingEarlier={this.state.isLoadingEarlier}
          onInputTextChanged={() => this.handleInputChange()}
          onLoadEarlier={() => this.onLoadEarlierFunction()}
          ref={gift => (this.giftedRef = gift)}
          messages={this.state.messages}
          // isTyping={this.state.isTyping}
          // renderFooter={() => this.renderFooter()}
          onSend={messageString => this.submitMessage(messageString, false)}
          user={{
            _id:
              this.state.manipulatedWalletAddress +
              '@' +
              this.props.apiReducer.xmppDomains.DOMAIN,
            name: this.state.firstName + ' ' + this.state.lastName,
          }}
          onPressAvatar={props => this.onAvatarPress(props)}
          renderMessage={this.renderMessage}
          renderAvatarOnTop={true}
          onLongPress={(e, m) => this.onLongPressMessage(e, m)}
          onLongPressAvatar={e => this.onLongPressAvatar(e)}
          renderMessageImage={this.renderMessageImage}
          parsePatterns={linkStyle => [
            {
              pattern:
                /\bhttps:\/\/www\.eto\.li\/go\?c=0x[0-9a-f]+_0x[0-9a-f]+/gm,
              style: linkStyle,
              onPress: this.handleChatLinks,
            },
            {
              pattern: /\bhttps:\/\/www\.eto\.li\/go\?c=[0-9a-f]+/gm,
              style: linkStyle,
              onPress: this.handleChatLinks,
            },
          ]}
        />
        <ModalList
          type={this.state.modalType}
          show={this.state.showModal}
          extraData={this.state.extraData}
          submitExtra={this.submitExtraDataXMPP}
          closeModal={this.closeModal}
          navigation={this.props.navigation}
        />
        <Modal
          animationType="slide"
          transparent={true}
          isVisible={this.state.mediaContentModalVisible}
          style={{position: 'relative'}}
          backdropOpacity={0.9}
          onBackdropPress={this.onBackdropPress}>
          <>
            <TouchableOpacity
              style={{position: 'absolute', top: 0, right: -10, zIndex: 99999}}
              onPress={() => this.toggleVideoModal(false)}>
              <EvilIcons size={hp('5%')} name="close" color={'white'} />
            </TouchableOpacity>

            {this.RenderMediaModalContent()}
          </>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  downloadContainer: {
    alignSelf: 'center',
    height: hp('5%'),
    // width: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageImageContainer: {
    width: hp('22%'),
    height: hp('22%'),
    borderRadius: 5,
  },
  sizeContainer: {
    position: 'absolute',
    width: hp('8%'),
    height: hp('8%'),
    borderRadius: hp('8%') / 2,
    zIndex: +1,
    backgroundColor: '#343434',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeTextStyle: {
    fontFamily: boldFont,
    fontSize: hp('1.4%'),
    color: '#fff',
    textAlign: 'center',
  },

  isTypingContainer: {
    margin: 10,
    marginBottom: 20,
    flexDirection: 'row',
  },
  isTypingTextStyle: {
    color: 'grey',
    fontFamily: regularFont,
    fontSize: hp('1.4%'),
  },
  progressContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 0.4,
  },
  progressNumberText: {
    color: 'grey',
    fontFamily: regularFont,
    fontSize: hp('1.4%'),
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

module.exports = connect(mapStateToProps, {
  loginUser,
  fetchWalletBalance,
  finalMessageArrivalAction,
  setRecentRealtimeChatAction,
  transferTokensSuccess,
  tokenAmountUpdateAction,
  updateMessageComposingState,
  fetchTransaction,
  setOtherUserDetails,
  setIsPreviousUser,
  setCurrentChatDetails,
})(Chat);
