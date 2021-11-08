/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {View, Image, SafeAreaView, AppState} from 'react-native';

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
import MintItems from './Screens/mintItems';
import NftItemHistory from './Screens/NftItemHistory';

// import Account from './Screens/Account';
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
  logOut,
  setOtherUserDetails,
} from './actions/auth';
import {
  finalMessageArrivalAction,
  participantsUpdateAction,
  setRosterAction,
  setRecentRealtimeChatAction,
  updatedRoster,
  tokenAmountUpdateAction,
  setPushNotificationData,
  updateMessageComposingState,
  setRoomRoles,
} from './actions/chatAction';
import {addLogsXmpp} from './actions/debugActions';
import {xmppConnect, xmpp, xmppListener} from './helpers/xmppCentral';
import * as xmppConstant from './constants/xmppConstants';
import {underscoreManipulation} from './helpers/underscoreLogic';
import {fetchWalletBalance} from './actions/wallet';
import {realm} from './components/realmModels/allSchemas';
import * as schemaTypes from './constants/realmConstants';
import store from './config/store';
import {commonColors, logoPath, tutorialStartUponLogin} from '../docs/config';
import {DebugScreen} from './Screens/DebugScreen';
const {secondaryColor} = commonColors;

const messageObjectRealm = realm.objects(schemaTypes.MESSAGE_SCHEMA);
const {xml} = require('@xmpp/client');

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

function DebugScreenComponent({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          header: () => (
            <HeaderComponent
              pushToken={pushToken}
              navigation={navigation}
              screenName="DebugScreen"
            />
          ),
        }}
        name="DebugScreen"
        component={DebugScreen}
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
            <View style={{backgroundColor: 'transparent'}}>
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

function mintitemsComponent({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MintItems"
        component={MintItems}
        options={{
          header: () => (
            <HeaderComponent
              pushToken={pushToken}
              navigation={navigation}
              screenName="ChatHome"
            />
          ),
        }}
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
function NftItemHistoryComponent({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NftItemHistory"
        component={NftItemHistory}
        options={{
          header: () => (
            <HeaderComponent
              pushToken={pushToken}
              navigation={navigation}
              screenName="ChatHome"
            />
          ),
        }}
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

// function accountComponent({navigation}) {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         options={{
//           header: () => (
//             <HeaderComponent
//               pushToken={pushToken}
//               navigation={navigation}
//               screenName="Account"
//             />
//           ),
//           headerLeft: null,
//         }}
//         name="Account"
//         initialParams={navigation}
//         component={Account}
//       />
//     </Stack.Navigator>
//   );
// }

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
      roomRolesMap: {},
    };
    this.configurePush();
    obj = this;
    this.rolesMap = {};
    this.usersLastSeen = {
      '0xc_f803e3c4e9_b_d_c8636665_d10_d4_a277b48415d421@dev.dxmpp.com':
        '26 August 12:02',
    };
  }

  configurePush = () => {
    let msgId = '';
    let mucId = '';
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
        pushToken = token.token;
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        msgId = notification.data.msgId;
        mucId = notification.data.mucId;
        obj.props.setPushNotificationData({msgId: msgId, mucId: mucId});
        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
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
    if (nextAppState === 'active') {
      if (xmpp) {
        if (xmpp.status === 'disconnected') {
          NetInfo.fetch().then(state => {
            console.log('Connection type', state.type);
            console.log('Is connected?', state.isConnected);
            if (state.isConnected) {
              xmpp.start();
            }
          });
        }
      }
    }
  };
  getArchive = () => {
    let message = xml(
      'iq',
      {type: 'set', id: this.state.manipulatedWalletAddress},
      xml('query', {xmlns: 'urn:xmpp:mam:2', queryid: 'userArchive'}),
    );
    // write_logs("Query : " + message);
    xmpp.send(message);
  };
  submitMessage = async (messageObject, chatJID) => {
    // let messageText = messageString[0].text;
    // let tokenAmount = messageString[0].tokenAmount
    //   ? messageString[0].tokenAmount
    //   : '0';
    // let receiverMessageId = messageString[0].receiverMessageId
    //   ? messageString[0].receiverMessageId
    //   : '0';

    //xml for the message to send
    console.log(messageObject, 'kdsljfdsklfjdsklfioewuruowe');
    const message = xml(
      'message',
      {
        id: 'sendMessage',
        type: 'groupchat',
        from: this.state.manipulatedWalletAddress + '@' + xmppConstant.DOMAIN,
        to: chatJID,
      },
      xml('body', {}, messageObject[0].text),
      xml('data', {
        xmlns: 'http://' + xmppConstant.DOMAIN,
        senderJID:
          this.state.manipulatedWalletAddress + '@' + xmppConstant.DOMAIN,
        senderFirstName: this.props.loginReducer.initialData.firstName,
        senderLastName: this.props.loginReducer.initialData.lastName,
        senderWalletAddress: this.props.loginReducer.initialData.walletAddress,
        isSystemMessage: true,
        tokenAmount: 0,
        receiverMessageId: '',
        // mucname: this.state.chatRoomDetails.chat_name,
        photoURL: null,
      }),
    );

    //call to send message to the xmpp server
    await xmpp.send(message);

    //function call to add message to gifted chat
    // this.addMessage(messageString,this.state.loadMessageIndex,false)
  };
  getStoredItems = async () => {
    try {
      const value = await AsyncStorage.getItem('rosterListHashMap');
      if (value !== null) {
        // value previously stored
        console.log(JSON.parse(value), 'parsedValue from home2');
        return JSON.parse(value);
      }
    } catch (e) {
      // error reading value
      console.log(e, 'error reading');
    }
  };

  async componentDidUpdate(prevProps) {
    //check if premium
    if (
      this.props.AccountReducer.isPremium &&
      this.props.AccountReducer.isPremium !== prevProps.AccountReducer.isPremium
    ) {
      const isPremium = this.props.AccountReducer.isPremium;
      console.log(isPremium, 'ascadfcadf');
    }

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
      xmppConnect(
        manipulatedWalletAddress,
        password,
        this.props.apiReducer.xmppDomains.DOMAIN,
        this.props.apiReducer.xmppDomains.SERVICE,
      );
      xmppListener(
        manipulatedWalletAddress,
        this.props.updatedRoster,
        this.props.loginReducer.initialData,
        this.props.updateUserProfile,
        this.props.setOtherUserVcard,
        this.props.finalMessageArrivalAction,
        this.props.participantsUpdateAction,
        this.props.updateMessageComposingState,
        this.props.setRoomRoles,
        this.getStoredItems,
        this.props.setRosterAction,
        this.props.setRecentRealtimeChatAction,
        this.props.setOtherUserDetails,
        this.props.logOut,
        this.props.debugReducer.debugMode,
        this.props.addLogsXmpp,
        this.props.apiReducer.xmppDomains.DOMAIN,
        this.props.apiReducer.xmppDomains.CONFERENCEDOMAIN,
      );
    }
  }

  setRoutes() {
    if (this.state.userToken === 'loading') {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={logoPath} style={{height: 100, width: 100}} />
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
          {this.state.isSkipForever || !tutorialStartUponLogin ? null : (
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
            name="DebugScreenComponent"
            component={DebugScreenComponent}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="NftItemHistoryComponent"
            component={NftItemHistoryComponent}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="MintItemsComponent"
            component={mintitemsComponent}
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
          {/* <Stack.Screen
            options={{headerShown: false}}
            name="AccountComponent"
            component={accountComponent}
          />    */}
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
module.exports = connect(mapStateToProps, {
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
  setRoomRoles,
  logOut,
  setOtherUserDetails,
  addLogsXmpp,
})(Routes);
