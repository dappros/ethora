import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { appLinkingUrl, unv_url } from "../../docs/config"
import { MainHeader } from "../components/MainHeader/MainHeader"
import { useStores } from "../stores/context"
import { Linking } from "react-native"
import parseChatLink from "../helpers/parseLink"
import openChatFromChatLink from "../helpers/chat/openChatFromChatLink"
import { useNavigation } from "@react-navigation/native"
import { getLastMessageArchive, retrieveOtherUserVcard } from "../xmpp/stanzas"
import { getPushToken } from "../helpers/pushNotifications"
import { requestTrackingPermission } from "react-native-tracking-transparency"
import AccountScreen from "../screens/Account/AccountScreen"
import { AuthenticationScreen } from "../screens/Account/Authentication"
import { CoinPurchaseScreen } from "../screens/Account/CoinPurchaseScreen"
import { InviteFriendsScreen } from "../screens/Account/InviteFriendsScreen"
import MintScreen from "../screens/Actions/MintScreen"
import ScanScreen from "../screens/Actions/ScanScreen"
import UploadDocumentsScreen from "../screens/Actions/UploadDocumentsScreen"
import ChangeBackgroundScreen from "../screens/Chat/ChangeBackgroundScreen"
import ChatDetailsScreen from "../screens/Chat/ChatDetailsScreen"
import ChatScreen from "../screens/Chat/ChatScreen"
import NewChatScreen from "../screens/Chat/NewChatScreen"
import RoomListScreen from "../screens/Chat/RoomListScreen"
import ThreadScreen from "../screens/Chat/ThreadScreen"
import { PrivacyAndDataScreen } from "../screens/Privacy/PrivacyAndDataScreen"
import { DocumentHistoryScreen } from "../screens/Profile/DocumentHistoryScreen"
import NftItemHistoryScreen from "../screens/Profile/NftItemHistoryScreen"
import OtherUserProfileScreen from "../screens/Profile/OtherUserProfileScreen"
import { ProfileScreen } from "../screens/Profile/ProfileScreen"
import TransactionsScreen from "../screens/Profile/TransactionsScreen"
import { DebugScreen } from "../screens/System/DebugScreen"
import { HomeStackParamList, HomeStackNavigationProp } from "./types"
import { showToast } from "../components/Toast/toast"

const HomeStack = createNativeStackNavigator<HomeStackParamList>()

export const HomeStackScreen = observer(() => {
  const { chatStore, loginStore, walletStore, apiStore } = useStores()
  const { initialData } = loginStore
  const { xmppPassword, xmppUsername, walletAddress } = initialData
  const navigation = useNavigation<HomeStackNavigationProp>()

  useEffect(() => {
    if (chatStore.roomList.length && chatStore.isOnline) {
      chatStore.roomList.forEach((item) => {
        getLastMessageArchive(item.jid, chatStore.xmpp)
      })
    }
  }, [chatStore.roomList, chatStore.isOnline])

  const getCache = async () => {
    try {
      const trackingStatus = await requestTrackingPermission()
    } catch (error) {
      console.log(error)
    }
    await chatStore.getCachedRoomsInfo()
    await chatStore.getRoomsFromCache()
    await chatStore.getCachedMessages()
    await walletStore.getCachedTransactions()
    // if (walletAddress) {
    //   await walletStore.getDocuments(walletAddress);
    // }
  }

  useEffect(() => {
    getCache()
    if (xmppUsername && xmppPassword) {
      getPushToken(
        loginStore.initialData.walletAddress,
        apiStore.xmppDomains.DOMAIN,
        apiStore.pushURL,
        navigation
      )
      chatStore.xmppConnect(xmppUsername, xmppPassword)
      chatStore.xmppListener()
    }
    if (walletAddress) {
      walletStore.fetchWalletBalance(loginStore.userToken, true)
    }
  }, [initialData.xmppPassword])

  useEffect(() => {
    //when the app opens for the first time, when clicked url from outside, this will be called
    Linking.getInitialURL().then((url) => {
      if (url) {
        if (url.includes("profileLink")) {
          const params = url.split(unv_url)[1]
          const queryParams = new URLSearchParams(params)
          const firstName: string = queryParams.get("firstName") as string
          const lastName: string = queryParams.get("lastName") as string
          const xmppId: string = queryParams.get("xmppId") as string
          const walletAddressFromLink: string = queryParams.get(
            "walletAddress"
          ) as string
          const linkToken = queryParams.get("linkToken")
          console.log(queryParams, "queryparams")
          if (walletAddress === walletAddressFromLink) {
            navigation.navigate("ProfileScreen")
          } else {
            setTimeout(() => {
              retrieveOtherUserVcard(
                initialData.xmppUsername,
                xmppId,
                chatStore.xmpp
              )

              loginStore.setOtherUserDetails({
                anotherUserFirstname: firstName,
                anotherUserLastname: lastName,
                anotherUserLastSeen: {},
                anotherUserWalletAddress: walletAddressFromLink,
              })
            }, 2000)
            //@ts-ignore
            navigation.navigate("OtherUserProfileScreen", {
              linkToken: linkToken,
              walletAddress: walletAddressFromLink,
            })
          }
        } else {
          const parseLink = parseChatLink(url)
          if (parseLink) {
            const chatId = parseLink.searchParams.get("c")
            if (chatId) {
              const chatJID = chatId + apiStore.xmppDomains.CONFERENCEDOMAIN
              setTimeout(() => {
                openChatFromChatLink(
                  chatJID,
                  initialData.walletAddress,
                  navigation,
                  chatStore.xmpp
                )
              }, 2000)
            } else {
              showToast("error", "Error", "Invalid QR", "top")
            }
          }
        }
      }
    })

    //when the app is already open and url is clicked from outside this will be called
    const removeListener = Linking.addEventListener("url", (data) => {
      console.log(data, "tessdfsdf")
      if (data.url) {
        if (data.url.includes("profileLink")) {
          const params = data.url.split(unv_url)[1]
          const queryParams = new URLSearchParams(params)
          const firstName: string = queryParams.get("firstName") as string
          const lastName: string = queryParams.get("lastName") as string
          const xmppId: string = queryParams.get("xmppId") as string
          const linkToken: string = queryParams.get("linkToken") as string

          const walletAddressFromLink: string = queryParams.get(
            "walletAddress"
          ) as string
          console.log(walletAddress, "walletAddress")
          console.log(walletAddressFromLink, "walletAddresslink")
          if (walletAddress === walletAddressFromLink) {
            navigation.navigate("ProfileScreen")
          } else {
            retrieveOtherUserVcard(
              initialData.xmppUsername,
              xmppId,
              chatStore.xmpp
            )

            loginStore.setOtherUserDetails({
              anotherUserFirstname: firstName,
              anotherUserLastname: lastName,
              anotherUserLastSeen: {},
              anotherUserWalletAddress: walletAddressFromLink,
            })
          }
        } else {
          const parsedChatId = parseChatLink(data.url)
          if (parsedChatId) {
            const chatJID = parsedChatId + apiStore.xmppDomains.CONFERENCEDOMAIN
            openChatFromChatLink(
              chatJID,
              initialData.walletAddress,
              navigation,
              chatStore.xmpp
            )
          } else {
            showToast("error", "Error", "Invalid QR", "top")
          }
        }
      }
    })

    return () => {
      removeListener.remove()
    }
  }, [])

  return (
    <HomeStack.Navigator options={{ headerShown: true, headerTitle: "" }}>
      <HomeStack.Screen
        name={"RoomsListScreem"}
        component={RoomListScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"ChatScreen"}
        component={ChatScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"ProfileScreen"}
        component={ProfileScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"TransactionsScreen"}
        component={TransactionsScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"OtherUserProfileScreen"}
        //@ts-ignore
        component={OtherUserProfileScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"NewChatScreen"}
        component={NewChatScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"ScanScreen"}
        component={ScanScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"AccountScreen"}
        component={AccountScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"DebugScreen"}
        component={DebugScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"MintScreen"}
        component={MintScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"UploadDocumentsScreen"}
        component={UploadDocumentsScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"NftItemHistory"}
        component={NftItemHistoryScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"InviteFriendsScreen"}
        component={InviteFriendsScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"PrivacyAndDataScreen"}
        component={PrivacyAndDataScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />

      <HomeStack.Screen
        name={"ChatDetailsScreen"}
        component={ChatDetailsScreen}
        options={() => ({
          // header: ({}) => <MainHeader />,
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name={"DocumentHistoryScreen"}
        //@ts-ignore
        component={DocumentHistoryScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"ThreadScreen"}
        component={ThreadScreen}
        options={() => ({
          // header: ({}) => <MainHeader />,
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name={"ChangeBackgroundScreen"}
        component={ChangeBackgroundScreen}
        options={() => ({
          // header: ({}) => <MainHeader />,
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name={"CoinPurchaseScreen"}
        component={CoinPurchaseScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
      <HomeStack.Screen
        name={"AuthenticationScreen"}
        component={AuthenticationScreen}
        options={() => ({
          header: ({}) => <MainHeader />,
        })}
      />
    </HomeStack.Navigator>
  )
})

export default HomeStackScreen
