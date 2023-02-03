import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {appLinkingUrl, coinsMainName} from '../../docs/config';
import {MainHeader} from '../components/MainHeader/MainHeader';
import {ROUTES} from '../constants/routes';
import {useStores} from '../stores/context';
import {Linking, Platform} from 'react-native';
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

const HomeStack = createNativeStackNavigator();

export const HomeStackScreen = observer(() => {
  const {chatStore, loginStore, walletStore, apiStore} = useStores();
  const {initialData} = loginStore;
  const {xmppPassword, xmppUsername, password, walletAddress} = initialData;
  const navigation = useNavigation();

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
          const walletAddressFromLink: string =
            queryParams.get('walletAddress') as string;
          const linkToken = queryParams.get('linkToken');

          if (walletAddress === walletAddressFromLink) {
            navigation.navigate(ROUTES.PROFILE as never);
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
            navigation.navigate(ROUTES.OTHERUSERPROFILESCREEN, {
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

          const walletAddressFromLink: string =
            queryParams.get('walletAddress') as string;
          if (walletAddress === walletAddressFromLink) {
            navigation.navigate(ROUTES.PROFILE as never);
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
    //@ts-ignore
    <HomeStack.Navigator options={{headerShown: true, headerTitle: ''}}>
      <HomeStack.Screen
        name={ROUTES.ROOMSLIST}
        component={RoomListScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.CHAT}
        component={ChatScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.TRANSACTIONS}
        component={TransactionsScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.OTHERUSERPROFILESCREEN}
        //@ts-ignore
        component={OtherUserProfileScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.NEWCHAT}
        component={NewChatScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.SCAN}
        component={ScanScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.ACCOUNT}
        component={AccountScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.DEBUG}
        component={DebugScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.MINT}
        component={MintScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.UPLOADDOCUMENTSSCREEN}
        component={UploadDocumentsScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.NFTITEMHISTORY}
        component={NftItemHistoryScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.INVITEFRIENDS}
        component={InviteFriendsScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.PRIVACY}
        component={PrivacyAndDataScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />

      <HomeStack.Screen
        name={ROUTES.CHATDETAILS}
        component={ChatDetailsScreen}
        options={() => ({
          // header: ({}) => <MainHeader />,
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.DOCUMENTHISTORY}
        //@ts-ignore
        component={DocumentHistoryScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.THREADS}
        component={ThreadScreen}
        options={() => ({
          // header: ({}) => <MainHeader />,
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.CHANGEBACKGROUNDSCREEN}
        component={ChangeBackgroundScreen}
        options={() => ({
          // header: ({}) => <MainHeader />,
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.COINPURCHASESCREEN}
        component={CoinPurchaseScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={ROUTES.AUTHENTICATIONSCREEN}
        component={AuthenticationScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
    </HomeStack.Navigator>
  );
});

export default HomeStackScreen;
