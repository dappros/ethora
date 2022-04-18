import { NavigationContainer } from '@react-navigation/native';
import React,{useEffect, useState} from 'react';
import {View, Spinner} from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Screens/login';
import AppIntroScreen from './Screens/AppIntro';
import ChatHomeScreen from './Screens/ChatHomeScreen';
import DebugScreen from './Screens/DebugScreen';
import NftItemHistoryScreen from './Screens/NftItemHistory';
import MintItemScreen from './Screens/mintItems';
import QrCodeScreen from './Screens/qrcodescreen';
import ChatScreen from './Screens/chat';
import CreateNewChatScreen from './Screens/createNewChat';
import TransanctionScreen from './Screens/transactionScreen';
import ProfileScreen from './Screens/profileScreen';
import AnotherUserProfileScreen from './Screens/anotherUserProfileScreen';
import SettingsScreen from './Screens/settingsScreen';
import QrGeneratorScreen from './Screens/qrCodeGenerator';
import AccountScreen from './Screens/AccountScreen';
import { tutorialStartUponLogin } from '../docs/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {observer} from 'mobx-react';
import { realm } from './components/realmModels/allSchemas';
import { underscoreManipulation } from './helpers/underscoreLogic';
import { xmppListener, xmppConnect, xmpp } from './helpers/xmppCentral';
import { useStores } from './stores/context';


const Stack = createStackNavigator();

const Routes = async() => {

    const {
        walletStore,
        chatStore,
        loginStore,
        debugStore,
        apiStore
    } = useStores()
    const isSkipForeverFromAsyncStore = await AsyncStorage.getItem("@skipForever");
    const userTokenFromStore = loginStore.token;
    

    const [userToken, setUserToken] = useState("loading");
    const [isSkipForever, setIsSkipForever] = useState(isSkipForeverFromAsyncStore);

    const {
        updateUserProfile,
        initialData,
        setOtherUserVcard,
        setOtherUserDetails,
        logOut,
    } = loginStore;
    const {
        updatedRoster,
        updateMessageComposingState,
        setRoomRoles,
        setRosterAction,
        finalMessageArrivalAction,
        participantsUpdateAction,
        setRecentRealtimeChatAction,
    } = chatStore;

    const {
        debugMode,
        addLogsXmpp,
    } = debugStore;

    const {
        xmppDomains,
    } = apiStore

    const {
        walletAddress,
        xmppPassword
    } = initialData

    const manipulatedWalletAddress = underscoreManipulation(walletAddress);

    const handleAppStateChange = (nextAppState: string) => {
        if(nextAppState === 'active') {
            if(xmpp){
                if(xmpp.statues === 'disconnect'){
                    NetInfo.fetch().then(state => {
                        if(state.isConnected){
                            xmpp.start();
                        }
                    })
                }
            }
        }
    }


    useEffect(()=>{
        loginStore.setTokenFromAsyncStorage();
        const changeAppstateEvent = AppState.addEventListener('change', handleAppStateChange);

        return() => {
            changeAppstateEvent.remove()
        }
        
    },[])

    useEffect(() => {
        if(userTokenFromStore === 'loading'){
            xmpp.stop().catch(console.error);
            realm.removeAllListeners();
            return;
        }
        if(userTokenFromStore){
            setUserToken(userTokenFromStore);
        }
    }, [userTokenFromStore])

    useEffect(() => {
        if(walletAddress){
            walletStore.fetchWalletBalance(
                walletAddress,
                null,
                userTokenFromStore,
                true
            );

            xmppConnect(
                manipulatedWalletAddress,
                xmppPassword,
                xmppDomains.DOMAIN,
                xmppDomains.SERVICE
            );

            const rosterListHashMap = async() => {
                try{
                    const value = await AsyncStorage.getItem('rosterListHashMap');
                    if(value !== null){
                        return JSON.parse(value);
                    }
                }catch(error){
                    console.log(error, 'error reading');
                }
            }

            xmppListener(
                manipulatedWalletAddress,
                updatedRoster,
                initialData,
                updateUserProfile,
                setOtherUserVcard,
                finalMessageArrivalAction,
                participantsUpdateAction,
                updateMessageComposingState,
                setRoomRoles,
                rosterListHashMap,
                setRosterAction,
                setRecentRealtimeChatAction,
                setOtherUserDetails,
                logOut,
                debugMode,
                addLogsXmpp,
                xmppDomains.DOMAIN,
                xmppDomains.CONFERENCEDOMAIN
            );  
        }

    }, [walletAddress])


    const setRoutes = () => {

        //when there is not token or user has not logged in yet
        if(userToken === "loading"){
            return(
                <View>
                    <Spinner size={"lg"} />
                </View>
            )
        }

        if(userToken === null){
            return(
                <Stack.Navigator>
                    <Stack.Screen
                    options={{headerShown: false}}
                    name="Login"
                    component={LoginScreen} 
                    />
                </Stack.Navigator>
            )
        }

        if(userToken && userToken !== "loading"){
            return(
                <Stack.Navigator>
                    {
                        isSkipForever || !tutorialStartUponLogin ? null :(
                            <Stack.Screen
                                options={{headerShown: false}}
                                name = "AppIntroComponent"
                                component = {AppIntroScreen}
                            />
                        )
                    }

                    <Stack.Screen
                        options={{headerShown: false}}
                        name="ChatHomeComponent"
                        component={ChatHomeScreen}
                    />
                    <Stack.Screen
                    options={{headerShown: false}}
                    name='DebugScreenComponent'
                    component={DebugScreen}
                    />
                    <Stack.Screen
                    options={{headerShown: false}}
                    name="NftItemHistoryComponent"
                    component={NftItemHistoryScreen}
                    />
                    <Stack.Screen
                        options={{headerShown: false}}
                        name="MintItemsComponent"
                        component={MintItemScreen}
                    />
                    <Stack.Screen
                        options={{headerShown: false}}
                        name="QRScreenComponent"
                        component={QrCodeScreen}
                    />
                    <Stack.Screen
                        options={{headerShown: false}}
                        name="ChatComponent"
                        component={ChatScreen}
                    />
                    <Stack.Screen
                        options={{headerShown: false}}
                        name="CreateNewChatComponent"
                        component={CreateNewChatScreen}
                    />
                    <Stack.Screen
                        options={{headerShown: false}}
                        name="TransactionComponent"
                        component={TransanctionScreen}
                    />
                    <Stack.Screen
                        options={{headerShown: false}}
                        name="ProfileComponent"
                        component={ProfileScreen}
                    />
                    <Stack.Screen
                        options={{headerShown: false}}
                        name="AnotherProfileComponent"
                        component={AnotherUserProfileScreen}
                    />
                    <Stack.Screen
                        options={{headerShown: false}}
                        name="SettingsComponent"
                        component={SettingsScreen}
                    />
                    <Stack.Screen
                        options={{headerShown: false}}
                        name="QRGenScreenComponent"
                        component={QrGeneratorScreen}
                    />
                    <Stack.Screen
                        options={{headerShown: false}}
                        name="AccountComponent"
                        component={AccountScreen}
                    />   
                </Stack.Navigator>
            )
        }


    }

  return (
    <NavigationContainer>
    {/* {setRoutes()} */}
    <Stack.Navigator>
                    <Stack.Screen
                    options={{headerShown: false}}
                    name="Login"
                    component={LoginScreen} 
                    />
                </Stack.Navigator>
    </NavigationContainer>
  );
}


export default observer<any>(Routes);
