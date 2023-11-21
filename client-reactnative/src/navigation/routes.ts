import {
  AuthStackParamList,
  HomeStackParamList,
  RootStackParamList,
} from "./types"

export const homeStackRoutes: Record<
  keyof HomeStackParamList,
  keyof HomeStackParamList
> = {
  RoomsListScreem: "RoomsListScreem",
  ChatScreen: "ChatScreen",
  ProfileScreen: "ProfileScreen",
  TransactionsScreen: "TransactionsScreen",
  AccountScreen: "AccountScreen",
  DebugScreen: "DebugScreen",
  MintScreen: "MintScreen",
  ScanScreen: "ScanScreen",
  NewChatScreen: "NewChatScreen",
  OtherUserProfileScreen: "OtherUserProfileScreen",
  NftItemHistory: "NftItemHistory",
  InviteFriendsScreen: "InviteFriendsScreen",
  ChatDetailsScreen: "ChatDetailsScreen",
  ResetPasswordScreen: "ResetPasswordScreen",
  PrivacyAndDataScreen: "PrivacyAndDataScreen",
  ThreadScreen: "ThreadScreen",
  SwiperChatScreen: "SwiperChatScreen",
  DocumentHistoryScreen: "DocumentHistoryScreen",
  ChangeBackgroundScreen: "ChangeBackgroundScreen",
  UploadDocumentsScreen: "UploadDocumentsScreen",
  CoinPurchaseScreen: "CoinPurchaseScreen",
  AuthenticationScreen: "AuthenticationScreen",
}

export const authStackRoutes: Record<
  keyof AuthStackParamList,
  keyof AuthStackParamList
> = {
  LoginScreen: "LoginScreen",
  Logout: "Logout",
  SplashScreen: "SplashScreen",
  RegularLogin: "RegularLogin",
  Register: "Register",
  ResetPasswordScreen: "ResetPasswordScreen",
}

export const rootStackRoutes: Record<
  keyof RootStackParamList,
  keyof RootStackParamList
> = {
  HomeStackScreen: "HomeStackScreen",
  AuthStackScreen: "AuthStackScreen",
}
