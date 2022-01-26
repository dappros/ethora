/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {Component, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {View, ActivityIndicator, SafeAreaView, AppState} from 'react-native';

//routes
import HeaderComponent from './components/shared/defaultHeader';
import Login from './Screens/login';
import AccountScreen from './Screens/AccountScreen';

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
import {connect, useSelector} from 'react-redux';
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
import {underscoreManipulation} from './helpers/underscoreLogic';
import {fetchWalletBalance} from './actions/wallet';
import {realm} from './components/realmModels/allSchemas';
import * as schemaTypes from './constants/realmConstants';
import store from './config/store';
import {commonColors, logoPath, tutorialStartUponLogin} from '../docs/config';
import {DebugScreen} from './Screens/DebugScreen';
import {AccountScreenRefactored} from './Screens/AccountScreenRefactored';
import {SEND_MESSAGE} from './constants/xmppConstants';
import {useDispatch} from 'react-redux';
import {useXmppListener} from './helpers/xmppListener';
const {primaryColor} = commonColors;

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
        name="AccountScreen"
        initialParams={navigation}
        component={AccountScreenRefactored}
      />
    </Stack.Navigator>
  );
}

const RefactoredRoutes = () => {
  const [roomRolesMap, setRoomRolesMap] = useState({});

  const walletAddress = useSelector(
    state => state.loginReducer.initialData.walletAddress,
  );
  const userToken = useSelector(state => state.loginReducer.token);
  const initialData = useSelector(state => state.loginReducer.initialData);
  const loginReducer = useSelector(state => state.loginReducer);

  const apiReducer = useSelector(state => state.apiReducer);
  const dispatch = useDispatch();
  const manipulatedWalletAddress = underscoreManipulation(walletAddress);

  // obj = this;
  // this.rolesMap = {};
  // this.usersLastSeen = {
  //   '0xc_f803e3c4e9_b_d_c8636665_d10_d4_a277b48415d421@dev.dxmpp.com':
  //     '26 August 12:02',
  // };

  const configurePush = () => {
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

  useEffect(() => {
    configurePush();
    dispatch(getUserToken());
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = nextAppState => {
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
  const getArchive = () => {
    let message = xml(
      'iq',
      {type: 'set', id: manipulatedWalletAddress},
      xml('query', {xmlns: 'urn:xmpp:mam:2', queryid: 'userArchive'}),
    );
    // write_logs("Query : " + message);
    xmpp.send(message);
  };
  const submitMessage = async (messageObject, chatJID) => {
    // let messageText = messageString[0].text;
    // let tokenAmount = messageString[0].tokenAmount
    //   ? messageString[0].tokenAmount
    //   : '0';
    // let receiverMessageId = messageString[0].receiverMessageId
    //   ? messageString[0].receiverMessageId
    //   : '0';

    //xml for the message to send
    const message = xml(
      'message',
      {
        id: SEND_MESSAGE,
        type: 'groupchat',
        from: manipulatedWalletAddress + '@' + apiReducer.xmppDomains.DOMAIN,
        to: chatJID,
      },
      xml('body', {}, messageObject[0].text),
      xml('data', {
        xmlns: 'http://' + apiReducer.xmppDomains.DOMAIN,
        senderJID:
          manipulatedWalletAddress + '@' + apiReducer.xmppDomains.DOMAIN,
        senderFirstName: initialData.firstName,
        senderLastName: initialData.lastName,
        senderWalletAddress: initialData.walletAddress,
        isSystemMessage: true,
        tokenAmount: 0,
        receiverMessageId: '',
        // mucname: chatRoomDetails.chat_name,
        photoURL: null,
      }),
    );

    //call to send message to the xmpp server
    await xmpp.send(message);

    //function call to add message to gifted chat
    // this.addMessage(messageString,this.state.loadMessageIndex,false)
  };

  useEffect(() => {
    if (loginReducer.token && loginReducer.token === 'loading') {
      xmpp.stop().catch(console.error);
      realm.removeAllListeners();
    }
  }, [loginReducer.token]);

  useEffect(() => {
    const xmppPassword = initialData.xmppPassword;
    if (userToken) {
      dispatch(fetchWalletBalance(walletAddress, null, userToken, true));
    }

    xmppConnect(
      manipulatedWalletAddress,
      xmppPassword,
      apiReducer.xmppDomains.DOMAIN,
      apiReducer.xmppDomains.SERVICE,
    );
    xmppListener(
      manipulatedWalletAddress,
      dispatch(updatedRoster),
      loginReducer.initialData,
      dispatch(updateUserProfile),
      dispatch(setOtherUserVcard),
      dispatch(finalMessageArrivalAction),
      dispatch(participantsUpdateAction),
      dispatch(updateMessageComposingState),
      dispatch(setRoomRoles),
      () => {},
      dispatch(setRosterAction),
      dispatch(setRecentRealtimeChatAction),
      dispatch(setOtherUserDetails),
      dispatch(logOut),
      false,
      dispatch(addLogsXmpp),
      apiReducer.xmppDomains.DOMAIN,
      apiReducer.xmppDomains.CONFERENCEDOMAIN,
    );
  }, [loginReducer.initialData.walletAddress]);

  function setRoutes() {
    if (userToken === 'loading') {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      );
    }

    if (userToken === null) {
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

    if (userToken && userToken !== 'loading') {
      return (
        <Stack.Navigator>
          {/* {this.state.isSkipForever || !tutorialStartUponLogin ? null : (
            <Stack.Screen
              options={{headerShown: false}}
              name="AppIntroComponent"
              component={AppIntroComponent}
            />
          )} */}
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
          <Stack.Screen
            options={{headerShown: false}}
            name="AccountComponent"
            component={accountComponent}
          />
        </Stack.Navigator>
      );
    }
  }

  // alert(this.state.userToken)
  return <NavigationContainer>{setRoutes()}</NavigationContainer>;
};

export default RefactoredRoutes;
