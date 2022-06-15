import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {coinsMainName} from '../../docs/config';
import {MainHeader} from '../components/MainHeader/MainHeader';
import {ROUTES} from '../constants/routes';
import {underscoreManipulation} from '../helpers/underscoreLogic';
import ChatScreen from '../screens/ChatScreen';
import OtherUserPorfileScreen from '../screens/OtherUserProfileScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import RoomListScreen from '../screens/RoomListScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import NewChatScreen from '../screens/NewChatScreen';
import {useStores} from '../stores/context';
import {Center, View} from 'native-base';
import {Text} from 'react-native-svg';
import ScanScreen from '../screens/ScanScreen';
import AccountScreen from '../screens/AccountScreen';
import MintScreen from '../screens/MintScreen';
import NftItemHistoryScreen from '../screens/NftItemHistoryScreen';
import PushNotification from 'react-native-push-notification';
import axios from 'axios';
import {subscribePushNotification} from '../config/routesConstants';
import {Linking, Platform} from 'react-native';
import parseChatLink from '../helpers/parseChatLink';
import openChatFromChatLink from '../helpers/chat/openChatFromChatLink';
import { useNavigation } from '@react-navigation/native';
import { DebugScreen } from '../screens/DebugScreen';

const HomeStack = createNativeStackNavigator();
export const subscribeForPushNotifications = async data => {
  const qs = require('qs');

  return await axios.post(subscribePushNotification, qs.stringify(data), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const HomeStackScreen = observer(() => {
  const {chatStore, loginStore, walletStore, apiStore} = useStores();
  const {initialData} = loginStore;
  const {xmppPassword, xmppUsername, password, walletAddress} = initialData;
  const navigation = useNavigation()

  const getPushToken = async () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: async function (token) {
        console.log('TOKEN:', token);
        const res = await subscribeForPushNotifications({
          appId: 'Ethora',
          deviceId: token.token,
          deviceType: Platform.OS === 'ios' ? '0' : '1',
          environment: 'Production',
          externalId: '',
          isSubscribed: '1',
          jid:
            underscoreManipulation(loginStore.initialData.walletAddress) +
            '@' +
            apiStore.xmppDomains.DOMAIN,
          screenName: 'Ethora',
        });
        console.log(res.data);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },

      onAction: function (notification) {
        console.log('ACTION:', notification.action);
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };
  useEffect(() => {
    chatStore.getCachedRoomsInfo();
    chatStore.getRoomsFromCache();
    chatStore.getCachedMessages();
    walletStore.getCachedTransactions();

    if (xmppUsername && password) {
      chatStore.xmppConnect(xmppUsername, xmppPassword);
      chatStore.xmppListener();
    }
    if (walletAddress) {
      walletStore.fetchWalletBalance(walletAddress, coinsMainName, true);
    }
  }, [initialData.xmppPassword]);

  useEffect(() => {
    getPushToken();

    //when the app opens for the first time, when clicked url from outside, this will be called
    Linking.getInitialURL().then(url => {
      if (url) {
        const chatJID = parseChatLink(url) + apiStore.xmppDomains.CONFERENCEDOMAIN;
        setTimeout(() => {
          openChatFromChatLink(
            chatJID,
            initialData.walletAddress,
            navigation,
            chatStore.xmpp,
          );
        }, 2000);
      }
    });

    //when the app is already open and url is clicked from outside this will be called
    Linking.addEventListener('url', data => {
      if (data.url) {
        const chatJID = parseChatLink(data.url) + apiStore.xmppDomains.CONFERENCEDOMAIN;
        openChatFromChatLink(
          chatJID,
          initialData.walletAddress,
          navigation,
          chatStore.xmpp,
        );
      }
    });

    return () => {
      Linking.removeAllListeners()
    }
  }, []);

  return (
    <HomeStack.Navigator options={{headerShown: true, headerTitle: ''}}>
      <HomeStack.Screen
        name={ROUTES.ROOMSLIST}
        component={RoomListScreen}
        options={() => ({
          header: ({navigation}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.CHAT}
        component={ChatScreen}
        options={() => ({
          header: ({navigation}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={() => ({
          header: ({navigation}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.TRANSACTIONS}
        component={TransactionsScreen}
        options={() => ({
          header: ({navigation}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.OTHERUSERPROFILESCREEN}
        component={OtherUserPorfileScreen}
        options={() => ({
          header: ({navigation}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.NEWCHAT}
        component={NewChatScreen}
        options={() => ({
          header: ({navigation}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.SCAN}
        component={ScanScreen}
        options={() => ({
          header: ({navigation}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.ACCOUNT}
        component={AccountScreen}
        options={() => ({
          header: ({navigation}) => <MainHeader />,
        })}
      />
       <HomeStack.Screen
        name={ROUTES.DEBUG}
        component={DebugScreen}
        options={() => ({
          header: ({navigation}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.MINT}
        component={MintScreen}
        options={() => ({
          header: ({navigation}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.NFTITEMHISTORY}
        component={NftItemHistoryScreen}
        options={() => ({
          header: ({navigation}) => <MainHeader />,
        })}
      />
    </HomeStack.Navigator>
  );
});

export default HomeStackScreen;
