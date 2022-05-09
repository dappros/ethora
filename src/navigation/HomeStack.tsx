import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import { coinsMainName } from '../../docs/config';
import {MainHeader} from '../components/MainHeader/MainHeader';
import { ROUTES } from '../constants/routes';
import { underscoreManipulation } from '../helpers/underscoreLogic';
import ChatScreen from '../screens/ChatScreen';
import OtherUserPorfileScreen from '../screens/OtherUserProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RoomListScreen from '../screens/RoomListScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import NewChatScreen from '../screens/NewChatScreen';
import {useStores} from '../stores/context';
import { Center, View } from 'native-base';
import { Text } from 'react-native-svg';
import ScanScreen from '../screens/ScanScreen';
import AccountScreen from '../screens/AccountScreen';

const HomeStack = createNativeStackNavigator();

export const HomeStackScreen = observer(() => {
  const {chatStore, loginStore, walletStore} = useStores();
  const {initialData} = loginStore;
  const {
    xmppPassword,
    xmppUsername,
    password,
    walletAddress
  } = initialData
  useEffect(() => {
    chatStore.getCachedRoomsInfo();
    if(xmppUsername && password){
      chatStore.xmppConnect(xmppUsername, xmppPassword);
      chatStore.xmppListener();
    }
    if(walletAddress){
      walletStore.fetchWalletBalance(
        walletAddress,
        coinsMainName,
        true
      )
    }
  }, [initialData.xmppPassword]);


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
    </HomeStack.Navigator>
  );
});

export default HomeStackScreen
