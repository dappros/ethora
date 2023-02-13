import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {appLinkingUrl} from '../../docs/config';
import {MainHeader} from '../components/MainHeader/MainHeader';
import {useStores} from '../stores/context';
import {Linking} from 'react-native';
import parseChatLink from '../helpers/parseChatLink';
import openChatFromChatLink from '../helpers/chat/openChatFromChatLink';
import {useNavigation} from '@react-navigation/native';
import {getLastMessageArchive, retrieveOtherUserVcard} from '../xmpp/stanzas';
import {getPushToken} from '../helpers/pushNotifications';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
import AccountScreen from '../Screens/Account/AccountScreen';
import {AuthenticationScreen} from '../Screens/Account/Authentication';
import {CoinPurchaseScreen} from '../Screens/Account/CoinPurchaseScreen';
import {InviteFriendsScreen} from '../Screens/Account/InviteFriendsScreen';
import MintScreen from '../Screens/Actions/MintScreen';
import ScanScreen from '../Screens/Actions/ScanScreen';
import UploadDocumentsScreen from '../Screens/Actions/UploadDocumentsScreen';
import ChangeBackgroundScreen from '../Screens/Chat/ChangeBackgroundScreen';
import ChatDetailsScreen from '../Screens/Chat/ChatDetailsScreen';
import ChatScreen from '../Screens/Chat/ChatScreen';
import NewChatScreen from '../Screens/Chat/NewChatScreen';
import RoomListScreen from '../Screens/Chat/RoomListScreen';
import ThreadScreen from '../Screens/Chat/ThreadScreen';
import {PrivacyAndDataScreen} from '../Screens/Privacy/PrivacyAndDataScreen';
import {DocumentHistoryScreen} from '../Screens/Profile/DocumentHistoryScreen';
import NftItemHistoryScreen from '../Screens/Profile/NftItemHistoryScreen';
import OtherUserProfileScreen from '../Screens/Profile/OtherUserProfileScreen';
import {ProfileScreen} from '../Screens/Profile/ProfileScreen';
import TransactionsScreen from '../Screens/Profile/TransactionsScreen';
import {DebugScreen} from '../Screens/System/DebugScreen';
import {HomeStackParamList, HomeStackNavigationProp} from './types';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackScreen = observer(() => {
  const {chatStore, loginStore, walletStore, apiStore} = useStores();
  const {initialData} = loginStore;
  const {xmppPassword, xmppUsername, walletAddress} = initialData;
  const navigation = useNavigation<HomeStackNavigationProp>();

  useEffect(() => {
    if (chatStore.roomList.length && chatStore.isOnline) {
      chatStore.roomList.forEach(item => {
        getLastMessageArchive(item.jid, chatStore.xmpp);
      });
    }
  }, [chatStore.roomList, chatStore.isOnline]);

  const getCache = async () => {
    try {
      const trackingStatus = await requestTrackingPermission();
    } catch (error) {
      console.log(error);
    }
    await chatStore.getCachedRoomsInfo();
    await chatStore.getRoomsFromCache();
    await chatStore.getCachedMessages();
    await walletStore.getCachedTransactions();
    // if (walletAddress) {
    //   await walletStore.getDocuments(walletAddress);
    // }
  };

  useEffect(() => {
    getCache();
    if (xmppUsername && xmppPassword) {
      getPushToken(
        loginStore.initialData.walletAddress,
        apiStore.xmppDomains.DOMAIN,
        apiStore.pushURL,
        navigation,
      );
      chatStore.xmppConnect(xmppUsername, xmppPassword);
      chatStore.xmppListener();
    }
    if (walletAddress) {
      walletStore.fetchWalletBalance(loginStore.userToken, true);
    }
  }, [initialData.xmppPassword]);

  useEffect(() => {
    //when the app opens for the first time, when clicked url from outside, this will be called
    Linking.getInitialURL().then(url => {
      if (url) {
        if (url.includes('profileLink')) {
          const params = url.split(appLinkingUrl)[1];
          const queryParams = new URLSearchParams(params);
          const firstName: string = queryParams.get('firstName') as string;
          const lastName: string = queryParams.get('lastName') as string;
          const xmppId: string = queryParams.get('xmppId') as string;
          const walletAddressFromLink: string = queryParams.get(
            'walletAddress',
          ) as string;
          const linkToken = queryParams.get('linkToken');

          if (walletAddress === walletAddressFromLink) {
            navigation.navigate('ProfileScreen');
          } else {
            setTimeout(() => {
              retrieveOtherUserVcard(
                initialData.xmppUsername,
                xmppId,
                chatStore.xmpp,
              );

              loginStore.setOtherUserDetails({
                anotherUserFirstname: firstName,
                anotherUserLastname: lastName,
                anotherUserLastSeen: {},
                anotherUserWalletAddress: walletAddressFromLink,
              });
            }, 2000);
            //@ts-ignore
            navigation.navigate('OtherUserProfileScreen', {
              linkToken: linkToken,
            });
          }
        } else {
          const chatJID =
            parseChatLink(url) + apiStore.xmppDomains.CONFERENCEDOMAIN;
          setTimeout(() => {
            openChatFromChatLink(
              chatJID,
              initialData.walletAddress,
              navigation,
              chatStore.xmpp,
            );
          }, 2000);
        }
      }
    });

    //when the app is already open and url is clicked from outside this will be called
    const removeListener = Linking.addEventListener('url', data => {
      if (data.url) {
        if (data.url.includes('profileLink')) {
          const params = data.url.split(appLinkingUrl)[1];
          const queryParams = new URLSearchParams(params);
          const firstName: string = queryParams.get('firstName') as string;
          const lastName: string = queryParams.get('lastName') as string;
          const xmppId: string = queryParams.get('xmppId') as string;
          const linkToken: string = queryParams.get('linkToken') as string;

          const walletAddressFromLink: string = queryParams.get(
            'walletAddress',
          ) as string;
          if (walletAddress === walletAddressFromLink) {
            navigation.navigate('ProfileScreen');
          } else {
            retrieveOtherUserVcard(
              initialData.xmppUsername,
              xmppId,
              chatStore.xmpp,
            );

            loginStore.setOtherUserDetails({
              anotherUserFirstname: firstName,
              anotherUserLastname: lastName,
              anotherUserLastSeen: {},
              anotherUserWalletAddress: walletAddressFromLink,
            });
          }
        } else {
          const chatJID =
            parseChatLink(data.url) + apiStore.xmppDomains.CONFERENCEDOMAIN;
          openChatFromChatLink(
            chatJID,
            initialData.walletAddress,
            navigation,
            chatStore.xmpp,
          );
        }
      }
    });

    return () => {
      removeListener.remove();
    };
  }, []);

  return (
    <HomeStack.Navigator options={{headerShown: true, headerTitle: ''}}>
      <HomeStack.Screen
        name={'RoomsListScreem'}
        component={RoomListScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'ChatScreen'}
        component={ChatScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'ProfileScreen'}
        component={ProfileScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'TransactionsScreen'}
        component={TransactionsScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'OtherUserProfileScreen'}
        //@ts-ignore
        component={OtherUserProfileScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'NewChatScreen'}
        component={NewChatScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'ScanScreen'}
        component={ScanScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'AccountScreen'}
        component={AccountScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'DebugScreen'}
        component={DebugScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'MintScreen'}
        component={MintScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'UploadDocumentsScreen'}
        component={UploadDocumentsScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'NftItemHistory'}
        component={NftItemHistoryScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'InviteFriendsScreen'}
        component={InviteFriendsScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'PrivacyAndDataScreen'}
        component={PrivacyAndDataScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />

      <HomeStack.Screen
        name={'ChatDetailsScreen'}
        component={ChatDetailsScreen}
        options={() => ({
          // header: ({}) => <MainHeader />,
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name={'DocumentHistoryScreen'}
        //@ts-ignore
        component={DocumentHistoryScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'ThreadScreen'}
        component={ThreadScreen}
        options={() => ({
          // header: ({}) => <MainHeader />,
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name={'ChangeBackgroundScreen'}
        component={ChangeBackgroundScreen}
        options={() => ({
          // header: ({}) => <MainHeader />,
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name={'CoinPurchaseScreen'}
        component={CoinPurchaseScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={'AuthenticationScreen'}
        component={AuthenticationScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
    </HomeStack.Navigator>
  );
});

export default HomeStackScreen;
