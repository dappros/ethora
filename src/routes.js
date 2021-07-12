import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  View,
  Image,
  SafeAreaView,
  Alert,
  AppState
} from 'react-native';

import Toast from 'react-native-simple-toast';

//routes
import HeaderComponent from './components/shared/defaultHeader';
import Login from './Screens/login';
import Chat from './Screens/chat';
import QRScreen from './Screens/qrcodescreen';
import QRGenScreen from './Screens/qrCodeGenerator';
import ChatHome from './Screens/chatHome';
import CreateNewChat from './Screens/createNewChat';
import Transaction from './Screens/transactionScreen';
import Profile from './Screens/profileScreen';
import AnotherProfile from './Screens/anotherUserProfileScreen';
import Settings from './Screens/settingsScreen';
import AppIntro from './Screens/AppIntro';
import Account from './Screens/Account';

import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {connect} from 'react-redux';
import {
  getUserToken,
  updateUserDescription,
  updateUserAvatar,
  updateUserProfile,
  setOtherUserVcard,
  logOut
} from './actions/auth';

import {insertMessages} from './components/realmModels/messages';
import {
  finalMessageArrivalAction,
  participantsUpdateAction,
  setRosterAction,
  setRecentRealtimeChatAction,
  updatedRoster,
  tokenAmountUpdateAction,
  setPushNotificationData,
  updateMessageComposingState,
} from './actions/chatAction';
import {xmppConnect, xmpp} from './helpers/xmppCentral';
import {
  fetchRosterlist,
  get_list_of_subscribers,
  getRoomInfo,
  commonDiscover,
  vcardRetrievalRequest,
  get_archive_by_room,
  updateVCard,
} from './helpers/xmppStanzaRequestMessages';
import * as xmppConstant from './constants/xmppConstants';
import {underscoreManipulation} from './helpers/underscoreLogic';
import {fetchWalletBalance} from './actions/wallet';
import {realm} from './components/realmModels/allSchemas';
import * as schemaTypes from './constants/realmConstants';
import * as types from './constants/types';
import store from './config/store';
import * as GlobalTheme from './config/globalTheme';

const {secondaryColor} = GlobalTheme.commonColors;

const messageObjectRealm = realm.objects(schemaTypes.MESSAGE_SCHEMA);
const subscriptionsStanzaID = 'subscriptions';
const newSubscription = 'newSubscription';
const {xml} = require('@xmpp/client');
const debug = require('@xmpp/debug');
let profileDescription = '';
let profilePhoto = '';

import {
  insertRosterList,
  updateRosterList,
  fetchRosterList as fetchChatListRealm
} from './components/realmModels/chatList';

const Stack = createStackNavigator();
let pushToken = '';
let obj;

//realm listeners
function realmMessageObjListener(message, changes) {
  changes.modifications.forEach(index => {
    store.dispatch(tokenAmountUpdateAction(true));
  });
}

messageObjectRealm.addListener(realmMessageObjListener);

function chatHomeComponent({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatHome"
        component={ChatHome}
        options={{
          header: () => (
            <HeaderComponent navigation={navigation} screenName="ChatHome" />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function AppIntroComponent() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="AppIntroScreen"
        component={AppIntro}
      />
    </Stack.Navigator>
  );
}

function QRGenScreenComponent() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="QRGenScreen"
        component={QRGenScreen}
      />
    </Stack.Navigator>
  );
}

function qrScreenComponent({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          header: () => (
            <HeaderComponent
              pushToken={pushToken}
              navigation={navigation}
              screenName="QRScreen"
            />
          ),
        }}
        name="QRScreen"
        component={QRScreen}
      />
    </Stack.Navigator>
  );
}

function loginComponent() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          header: () => (
            <View style={{backgroundColor: secondaryColor}}>
              <SafeAreaView />
            </View>
          ),
        }}
        name="Login"
        component={Login}
      />
    </Stack.Navigator>
  );
}

function chatComponent({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          header: () => (
            <HeaderComponent
              pushToken={pushToken}
              navigation={navigation}
              screenName="Chat"
            />
          ),
          headerLeft: null,
        }}
        name="Chat"
        component={Chat}
      />
    </Stack.Navigator>
  );
}

function createNewChatComponent({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          header: () => (
            <HeaderComponent
              pushToken={pushToken}
              navigation={navigation}
              screenName="CreateNewChat"
            />
          ),
          headerLeft: null,
        }}
        name="CreateNewChat"
        component={CreateNewChat}
      />
    </Stack.Navigator>
  );
}

function transactionComponent({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          header: () => (
            <HeaderComponent
              pushToken={pushToken}
              navigation={navigation}
              screenName="Transaction"
            />
          ),
          headerLeft: null,
        }}
        name="Transaction"
        initialParams={navigation}
        component={Transaction}
      />
    </Stack.Navigator>
  );
}

function profileComponent({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          header: () => (
            <HeaderComponent
              pushToken={pushToken}
              navigation={navigation}
              screenName="Profile"
            />
          ),
          headerLeft: null,
        }}
        name="Profile"
        initialParams={navigation}
        component={Profile}
      />
    </Stack.Navigator>
  );
}

function anotherProfileComponent({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          header: () => (
            <HeaderComponent
              pushToken={pushToken}
              navigation={navigation}
              screenName="Another Profile"
            />
          ),
          headerLeft: null,
        }}
        name="Another Profile"
        initialParams={navigation}
        component={AnotherProfile}
      />
    </Stack.Navigator>
  );
}

function settingsComponent({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          header: () => (
            <HeaderComponent
              pushToken={pushToken}
              navigation={navigation}
              screenName="Settings"
            />
          ),
          headerLeft: null,
        }}
        name="Settings"
        initialParams={navigation}
        component={Settings}
      />
    </Stack.Navigator>
  );
}


function accountComponent({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          header: () => (
            <HeaderComponent
              pushToken={pushToken}
              navigation={navigation}
              screenName="Account"
            />
          ),
          headerLeft: null,
        }}
        name="Account"
        initialParams={navigation}
        component={Account}
      />
    </Stack.Navigator>
  );
}



class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: 'loading',
      walletAddress: '',
      manipulatedWalletAddress: '',
      password: '',
      username: '',
      isSkipForever: 'false',
    };
    this.configurePush();
    obj = this;
  }

  configurePush = () => {
    let msgId = '';
    let mucId = '';
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log('TOKEN:', token);
        pushToken = token.token;
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);
        msgId = notification.data.msgId;
        mucId = notification.data.mucId;
        obj.props.setPushNotificationData({msgId: msgId, mucId: mucId});
        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function(notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function(err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };




  async componentDidMount() {
    this.props.getUserToken();
    const isSkipForever = await AsyncStorage.getItem('@skipForever');
    AppState.addEventListener('change', this._handleAppStateChange);

    const userToken = this.props.loginReducer.token;
    this.setState({
      isSkipForever: Boolean(parseInt(isSkipForever)),
      userToken,
    });
    // alert(JSON.stringify(userToken))
  }

  componentWillUnMount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if(nextAppState === "active"){
      if(xmpp){
        if(xmpp.status === "disconnected"){
          NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            if(state.isConnected){
              xmpp.start();
            }
          });
        }
      }
    }
  }

  //xmpp listeners
  async xmppListener() {
    debug(xmpp, true);

    xmpp.on('error', err => {
      // xmpp.reconnect.start();
      if(err.message === "not-authorized - Invalid username or password"){
        xmpp.stop().catch(console.error);
        Alert.alert(
          'User Not found',
          'User account not found. Please sign in again.',[{
            text:'Ok',
            onPress:() => this.props.logOut()
          }]
        )
      }

      if(err.message === "WebSocket ECONNERROR wss://rtc-cc.dappros.com:5443/ws"){
        xmpp.stop();
      }
      console.log(err.message,"xmpperror")
    });

    xmpp.on('offline', () => {
      console.log('offline');
    });

    // xmpp.reconnect.start();

    xmpp.reconnect.on('reconnecting',()=>{
      // console.log("reconnecting...")
    })

    xmpp.on('stanza', async stanza => {
      console.log(stanza, 'stanza');
      let featureList = {};
      if (stanza.is('iq')) {
        if (stanza.attrs.id === 'disco1') {
          stanza.children[0].children.map(item => {
            if (item.name === 'feature') {
              featureList = {...featureList, item};
              if (item.attrs.var === 'http://jabber.org/protocol/chatstates') {
              }
            }
          });

          // console.log(stanza.children[0].children.map,"featuredisco")
        }
        //capture error
        if (stanza.attrs.type === 'error') {
          let errorMessage = '';
          errorMessage = stanza.children[1].children[1].children[0];
          // alert(errorMessage);
        }
        //capture room info
        if (stanza.attrs.id === 'roomInfo') {
          const roomName = stanza.children[0].children[0].attrs.name;
          const roomJID = stanza.attrs.from;
          let exist = false;
          fetchChatListRealm().then(chatList=>{
            if(chatList.length){
              chatList.map(chat=>{
                if(chat.jid === roomJID && chat.name === roomName){
                  exist = true;
                }else{
                  exist = false;
                }
              })
            }else{
              exist = false;
            }
          }).then(()=>{
            if(!exist){
              updateRosterList({jid: roomJID, name: roomName}).then(() => {
                //roasterUpdatedAction
                this.props.updatedRoster(true);
              });
            }
          })


        }

        //check new user join room
        // console.log(this.props.ChatReducer.chatRoomDetails.chat_jid,"Asdasdas")
        // if(stanza.attrs.from.split("/")[0] === this.props.ChatReducer.chatRoomDetails.chat_jid){
        //   console.log("yess")
        // }

        //capture vcard request response
        if (stanza.attrs.id === types.V_CARD_REQUEST) {
          console.log(stanza, 'vcarddddddd');
          if (!stanza.children[0].children.length) {
            profilePhoto = this.props.loginReducer.initialData.photo;
            profileDescription = 'No description';
            // updateVcardPhoto(this.props.loginReducer.initialData.photo);
            // updateVcardDescription("No Description");
            updateVCard(profilePhoto, profileDescription);
          } else {
            stanza.children[0].children.map(item => {
              if (item.name === 'DESC') {
                profileDescription = item.children[0];
                // this.props.updateUserDescription(item.children[0]);
              }
              if (item.name === 'PHOTO') {
                // this.props.updateUserAvatar(item.children[0].children[0]);
                // profilePhoto = item.children[0].children[0];
                profilePhoto = this.props.loginReducer.initialData.photo;
              }
            });
            this.props.updateUserProfile({
              desc: profileDescription,
              photoURL: profilePhoto,
            });
          }
        }

        //capture other user Vcard
        if (stanza.attrs.id === types.OTHER_USER_V_CARD_REQUEST) {
          let anotherUserAvatar = '';
          let anotherUserDescription = '';
          stanza.children[0].children.map(item => {
            if (item.name === 'DESC') {
              anotherUserDescription = item.children[0];
            }
            if (item.name === 'PHOTO') {
              anotherUserAvatar = item.children[0].children[0];
            }
          });
          this.props.setOtherUserVcard({
            anotherUserAvatar,
            anotherUserDescription,
          });
        }

        if (stanza.attrs.id === types.UPDATE_VCARD) {
          if (stanza.attrs.type === 'result') {
            vcardRetrievalRequest(this.state.manipulatedWalletAddress);
          }
        }

        if (stanza.attrs.type === 'error') {
          console.log(stanza.children[1].children[1].children[0]);
        }

        //capture fin event, which comes after final message of the archived list has come
        // if (
        //   stanza.children[0].name !== undefined &&
        //   stanza.children[0].name === 'fin'
        // ) {
        //   console.log("fin event", stanza)
        //   this.props.finalMessageArrivalAction(true);
        // }

        if(stanza.attrs.id === "GetArchive"){
          if(stanza.children[0].name === "fin"){
            console.log("finevent",stanza)
            this.props.finalMessageArrivalAction(true);
          }
        }

        //capture participants of subscribed room
        if (stanza.attrs.id === 'participants') {
          const chat_jid = stanza.attrs.from;
          const numberOfParticipants = stanza.children[0].children.length;
          let exist = false;
          fetchChatListRealm().then(chatList=>{
            if(chatList.length){
              chatList.map(chat=>{
                if(chat.participants === numberOfParticipants){
                  exist = true
                }else{
                  exist = false
                }
              })
            }else{
              exist = false
            }

          }).then(()=>{
            if(!exist){
              updateRosterList({
                jid: chat_jid,
                participants: numberOfParticipants,
              }).then(() => {
                this.props.participantsUpdateAction(true);
              });
            }
          })

        }
      }

      if (stanza.is('presence')) {

        //catch when "you have joined too many conference issue"
        if(stanza.attrs.type === "error"){
          if(stanza.children[1].attrs.code === "500"){
            console.log(stanza.children[1].children[1].children[0], "xmpperrorr");
            xmpp.reconnect.stop();
          }
        }

        if (stanza.attrs.id === 'CreateRoom') {
          if (stanza.children[1] !== undefined) {
            console.log(stanza, 'Asdcasxasdaxsd');
            if (stanza.children[1].children[1].attrs.code === '201') {
              Toast.show('Room created successfully', Toast.LONG);
              fetchRosterlist(
                this.state.manipulatedWalletAddress,
                subscriptionsStanzaID,
              );
            }

            if (stanza.children[1].children[1].attrs.code === '110') {
              Toast.show('Room joined successfully', Toast.LONG);
              fetchRosterlist(
                this.state.manipulatedWalletAddress,
                subscriptionsStanzaID,
              );
            }
          }
        }
      }

      if (stanza.name === 'message') {
        //capture message composing
        if (stanza.attrs.id === types.IS_COMPOSING) {
          const mucRoom = stanza.attrs.from.split('/')[0];
          console.log('captured');
          
          const fullName = stanza.children[1].attrs.fullName;
          const manipulatedWalletAddress = stanza.children[1].attrs.manipulatedWalletAddress;
          await this.props.updateMessageComposingState({
            state: true,
            username: fullName,
            manipulatedWalletAddress,
            mucRoom,
          });
        }

        //capture message composing pause
        if (stanza.attrs.id === types.PAUSED_COMPOSING) {
          console.log('pause');
          const mucRoom = stanza.attrs.from.split('/')[0];
          // username = stanza.attrs.from.split('/')[1];
          // if(this.state.username!==username){
          const manipulatedWalletAddress = stanza.children[1].attrs.manipulatedWalletAddress;
          await this.props.updateMessageComposingState({
            state: false,
            manipulatedWalletAddress,
            mucRoom,
          });
          // }
        }

        //capture archived message of a room
        if (stanza.children[0].attrs.xmlns === 'urn:xmpp:mam:2') {
          const singleMessageDetailArray =
            stanza.children[0].children[0].children[0].children;
          let _id = stanza.children[0].children[0].children[0].attrs.from; // message owner id
          const roomName = stanza.attrs.from; //the jid of room
          let user_name = _id.replace(roomName + '/', '');
          let _messageId = ''; //message id
          let text = ''; //the message text sent by the owner
          let isSystemMessage = 'false';
          let messageObject = {};
          let tokenAmount = 0;
          let receiverMessageId = '';
          let userAvatar = '';
          let isMediafile = false;
          let imageLocation = "";
          let imageLocationPreview = "";
          let mimetype = "";
          let size = "";

          await singleMessageDetailArray.forEach(item => {
            if (item.name === 'body') {
              text = item.children[0];
            }
            if (item.name === 'archived') {
              _messageId = item.attrs.id;
            }
            if (item.name === 'data') {
              user_name =
                item.attrs.senderFirstName + ' ' + item.attrs.senderLastName;
              _id = item.attrs.senderJID;
              isSystemMessage = item.attrs.isSystemMessage
                ? item.attrs.isSystemMessage
                : isSystemMessage;
              tokenAmount = item.attrs.tokenAmount
                ? parseInt(item.attrs.tokenAmount)
                : tokenAmount;
              receiverMessageId = item.attrs.receiverMessageId
                ? item.attrs.receiverMessageId
                : receiverMessageId;

              userAvatar = item.attrs.photoURL ? item.attrs.photoURL : null;

              isMediafile = item.attrs.isMediafile === 'true'?true:false;

              imageLocation = item.attrs.location;

              imageLocationPreview = item.attrs.locationPreview;

              mimetype = item.attrs.mimetype;

              size = item.attrs.size;
            }
          });

          if (isSystemMessage === 'false') {
            if(isMediafile){
              messageObject = {
                _id: _messageId,
                text:'',
                createdAt: new Date(parseInt(_messageId.substring(0,13))),
                system: false,
                user:{
                  _id,
                  name: user_name,
                  avatar: userAvatar!=='false'?userAvatar:null
                },
                image:mimetype==="application/pdf"?"https://image.flaticon.com/icons/png/128/174/174339.png":imageLocationPreview,
                realImageURL: imageLocation,
                localURL:"",
                isStoredFile: false,
                mimetype: mimetype,
                size: size
              }
            }else{
              messageObject = {
                _id: _messageId,
                text,
                createdAt: new Date(parseInt(_messageId.substring(0, 13))),
                system: false,
                user: {
                  _id,
                  name: user_name,
                  avatar: userAvatar!=='false'?userAvatar:null,
                },
              };
            }
          }
          if (isSystemMessage === 'true') {
            messageObject = {
              _id: _messageId,
              text,
              createdAt: new Date(parseInt(_messageId.substring(0, 13))),
              system: true,
            };
          }

          insertMessages(
            messageObject,
            roomName,
            tokenAmount,
            receiverMessageId,
          );
        }
      }

      //when default rooms are just subscribed, this function will send presence to them and fetch it again to display in chat home screen
      if (stanza.attrs.id === newSubscription) {
        const presence = xml(
          'presence',
          {
            from:
              this.state.manipulatedWalletAddress + '@' + xmppConstant.DOMAIN,
            to: stanza.attrs.from + '/' + this.state.manipulatedWalletAddress,
          },
          xml('x', 'http://jabber.org/protocol/muc'),
        );
        xmpp.send(presence);
        fetchRosterlist(
          this.state.manipulatedWalletAddress,
          subscriptionsStanzaID,
        );
      }

      //To capture the response for list of rosters (for now only subscribed muc)
      if (stanza.attrs.id === subscriptionsStanzaID) {
        console.log(stanza, 'in fetchroster stanza');
        const rosterFromXmpp = stanza.children[0].children;
        let rosterListArray = [];

        rosterFromXmpp.map(item => {

          //presence is sent to every contact in roster
          const presence = xml(
            'presence',
            {
              from:
                this.state.manipulatedWalletAddress + '@' + xmppConstant.DOMAIN,
              to: item.attrs.jid + '/' + this.state.manipulatedWalletAddress,
            },
            xml('x', 'http://jabber.org/protocol/muc'),
          );

          xmpp.send(presence);
          const manipulatedWalletAddress = this.state.manipulatedWalletAddress;
          get_list_of_subscribers(
            item.attrs.jid,
            this.state.manipulatedWalletAddress,
          );
          setTimeout(function() {
            getRoomInfo(manipulatedWalletAddress, item.attrs.jid);
          }, 3000);
        });

        this.props.setRosterAction(rosterListArray);
      }

      //to capture realtime incoming message
      if (stanza.attrs.id === 'sendMessage') {
        if (
          stanza.children[0].attrs &&
          stanza.children[0].attrs.xmlns === 'urn:xmpp:mam:tmp'
        ) {
          console.log(stanza, 'asdasdasd');
          let text = ''; //the text message
          let _id = ''; //the id of the sender
          let user_name = '';
          let _messageId = ''; //the id of the message
          let roomName = '';
          let isSystemMessage = 'false';
          let tokenAmount = 0;
          let receiverMessageId = '';
          let messageObject = {};
          let userAvatar = '';
          let isMediafile = false;
          let imageLocation = "";
          let imageLocationPreview = "";
          let mimetype = "";
          let size = "";
          stanza.children.map(item => {
            if (item.name === 'body') {
              text = item.children[0];
            }

            if (item.name === 'archived') {
              _messageId = item.attrs.id;
              roomName = item.attrs.by;
            }

            if (item.name === 'data') {
              user_name = item.attrs.senderFirstName + ' ' + item.attrs.senderLastName;

              _id = item.attrs.senderJID;

              isSystemMessage = item.attrs.isSystemMessage
                ? item.attrs.isSystemMessage
                : isSystemMessage;

              tokenAmount = item.attrs.tokenAmount
                ? parseInt(item.attrs.tokenAmount)
                : tokenAmount;

              receiverMessageId = item.attrs.receiverMessageId
                ? item.attrs.receiverMessageId
                : receiverMessageId;

              userAvatar = item.attrs.photoURL ? item.attrs.photoURL : null;

              isMediafile = item.attrs.isMediafile === 'true'?true:false;

              imageLocation = item.attrs.location;

              imageLocationPreview = item.attrs.locationPreview;

              mimetype = item.attrs.mimetype;

              size = item.attrs.size;

            }
          });

          if (isSystemMessage === 'false') {
            if(isMediafile){
              messageObject = {
                _id: _messageId,
                text:'',
                createdAt: new Date(parseInt(_messageId.substring(0,13))),
                system: false,
                user:{
                  _id,
                  name: user_name,
                  avatar: userAvatar!=='false'?userAvatar:null
                },
                image:mimetype==="application/pdf"?"https://image.flaticon.com/icons/png/128/174/174339.png":imageLocationPreview,
                realImageURL: imageLocation,
                localURL:"",
                isStoredFile:false,
                mimetype: mimetype,
                size: size
              }
            }else{
              messageObject = {
                _id: _messageId,
                text,
                createdAt: new Date(parseInt(_messageId.substring(0, 13))),
                system: false,
                user: {
                  _id,
                  name: user_name,
                  avatar: userAvatar!=='false'?userAvatar:null,
                },
              };
            }
          }
          if (isSystemMessage === 'true') {
            messageObject = {
              _id: _messageId,
              text,
              createdAt: new Date(parseInt(_messageId.substring(0, 13))),
              system: true,
            };
          }
          console.log(messageObject, 'gjutyhgrv');
          this.props.setRecentRealtimeChatAction(
            messageObject,
            roomName,
            true,
            tokenAmount,
            receiverMessageId,
          );
        }
      }
    });

    xmpp.on('online', async address => {
      xmpp.reconnect.delay = 2000;
      xmpp.send(
        xml('presence', {
          from: this.state.manipulatedWalletAddress + '@' + xmppConstant.DOMAIN,
          to: xmppConstant.DOMAIN,
        }),
      );
      fetchRosterlist(
        this.state.manipulatedWalletAddress,
        subscriptionsStanzaID,
      );
      commonDiscover(this.state.manipulatedWalletAddress, xmppConstant.DOMAIN);
      // discoverProfileSupport(this.state.manipulatedWalletAddress, xmppConstant.DOMAIN);
      vcardRetrievalRequest(this.state.manipulatedWalletAddress);
    });
  }

  async componentDidUpdate(prevProps) {    

    if (this.props.loginReducer.token !== prevProps.loginReducer.token) {
      if (this.props.loginReducer.token === 'loading') {
        xmpp.stop().catch(console.error);
        realm.removeAllListeners();
        this.setState({userToken: this.props.loginReducer.token});
      }
      const userToken = this.props.loginReducer.token;
      this.setState({userToken});
    }
    if (
      this.props.loginReducer.initialData.walletAddress &&
      this.props.loginReducer.initialData.walletAddress !==
        prevProps.loginReducer.initialData.walletAddress
    ) {
      const initialData = this.props.loginReducer.initialData;
      const walletAddress = initialData.walletAddress;
      const password = initialData.password;
      const username = initialData.username;
      this.props.fetchWalletBalance(
        walletAddress,
        null,
        this.props.loginReducer.token,
        true,
      );
      let manipulatedWalletAddress = underscoreManipulation(walletAddress);
      console.log(manipulatedWalletAddress, 'manipulated');
      this.setState({
        password,
        walletAddress,
        username,
        manipulatedWalletAddress,
      });
      xmppConnect(manipulatedWalletAddress, password);
      this.xmppListener();
    }
  }

  setRoutes() {
    if (this.state.userToken === 'loading') {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={require('./assets/Logo-Landscape.png')}
            style={{height: 100, width: 100}}
          />
        </View>
      );
    }

    if (this.state.userToken === null) {
      return (
        <Stack.Navigator>
          <Stack.Screen
            options={{headerShown: false}}
            name="LoginComponent"
            component={loginComponent}
          />
        </Stack.Navigator>
      );
    }

    if (this.state.userToken && this.state.userToken !== 'loading') {
      console.log('isskipforever', this.state.isSkipForever);
      return (
        <Stack.Navigator>
          {this.state.isSkipForever ? null : (
            <Stack.Screen
              options={{headerShown: false}}
              name="AppIntroComponent"
              component={AppIntroComponent}
            />
          )}
          <Stack.Screen
            options={{headerShown: false}}
            name="ChatHomeComponent"
            component={chatHomeComponent}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="QRScreenComponent"
            component={qrScreenComponent}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="ChatComponent"
            component={chatComponent}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="CreateNewChatComponent"
            component={createNewChatComponent}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="TransactionComponent"
            component={transactionComponent}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="ProfileComponent"
            component={profileComponent}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="AnotherProfileComponent"
            component={anotherProfileComponent}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="SettingsComponent"
            component={settingsComponent}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="QRGenScreenComponent"
            component={QRGenScreenComponent}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="AccountComponent"
            component={accountComponent}
          />   
        </Stack.Navigator>
      );
    }
  }

  render() {
    // const Stack = createStackNavigator();
    const setRoutesBody = this.setRoutes();
    // alert(this.state.userToken)
    return <NavigationContainer>{setRoutesBody}</NavigationContainer>;
  }
}

const mapStateToProps = state => {
  return {
    ...state,
  };
};
module.exports = connect(
  mapStateToProps,
  {
    getUserToken,
    finalMessageArrivalAction,
    participantsUpdateAction,
    setRosterAction,
    setRecentRealtimeChatAction,
    updatedRoster,
    fetchWalletBalance,
    tokenAmountUpdateAction,
    setPushNotificationData,
    updateUserDescription,
    updateUserAvatar,
    updateMessageComposingState,
    updateUserProfile,
    setOtherUserVcard,
    logOut
  },
)(Routes);
