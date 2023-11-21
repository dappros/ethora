import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { IApiMetaRoom } from "../components/Chat/MetaNavigation"
import { IDocument, TBalance } from "../stores/types"

export type HomeStackParamList = {
  RoomsListScreem: undefined
  ChatScreen: { chatJid: string; chatName?: string }
  ProfileScreen: { viewItems?: boolean } | undefined
  TransactionsScreen: undefined
  AccountScreen: undefined
  DebugScreen: undefined
  MintScreen: undefined
  ScanScreen: undefined
  NewChatScreen:
    | { metaDirection: string; metaRoom: IApiMetaRoom | undefined }
    | undefined
  OtherUserProfileScreen: { linkToken: string } | { walletAddress: string }
  NftItemHistory: { item: TBalance; userWalletAddress: string }
  InviteFriendsScreen: undefined
  ChatDetailsScreen: { roomName: string; roomJID: string }
  ResetPasswordScreen: undefined
  PrivacyAndDataScreen: undefined
  ThreadScreen: undefined
  SwiperChatScreen: undefined
  DocumentHistoryScreen: { item: IDocument; userWalletAddress: string }
  ChangeBackgroundScreen: { roomJID: string; roomName: string }
  UploadDocumentsScreen: undefined
  CoinPurchaseScreen: undefined
  AuthenticationScreen: undefined
}

export type AuthStackParamList = {
  LoginScreen: undefined
  Logout: undefined
  SplashScreen: undefined
  RegularLogin: undefined
  Register: undefined
  ResetPasswordScreen: undefined
}

export type RootStackParamList = {
  HomeStackScreen: undefined
  AuthStackScreen: undefined
}
export type HomeStackNavigationProp =
  NativeStackNavigationProp<HomeStackParamList>
export type AuthStackNavigationProp =
  NativeStackNavigationProp<AuthStackParamList>
