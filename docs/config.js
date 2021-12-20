// TITLE
// App title / name shown in Login screen and top nav bar
const appTitle = 'Ethora'; //done

// LOGO (LOGIN SCREEN)
// App logo (displayed in login screen) image path:
import logoPath from '../src/assets/logo.png'; //done
import DeviceInfo from 'react-native-device-info';

//images for tutorial screens
import slide1Image1 from '../src/assets/tutorials/slide1Img1.png';
import slide2Image1 from '../src/assets/tutorials/slide2Img1.png';
import slide2Image2 from '../src/assets/tutorials/slide2Img2.png';
import slide2Image3 from '../src/assets/tutorials/slide2Img3.png';
import slide3Image1 from '../src/assets/tutorials/slide3Img1.png';
import slide3Image2 from '../src/assets/tutorials/slide3Img2.png';
import slide4Image1 from '../src/assets/tutorials/slide4Img1.png';
import slide4Image2 from '../src/assets/tutorials/slide4Img2.png';

import loginScreenBackgroundImage from '../src/assets/login_background.png';

//Application token
const APP_TOKEN =
  'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYxYmM2ZWMxY2VlN2Q4MGIxOWVjMmE1ZiIsImFwcE5hbWUiOiJFdGhvcmEiLCJhcHBEZXNjcmlwdGlvbiI6InVuZGVmaW5lZCIsImFwcFVybCI6InVuZGVmaW5lZCIsImFwcExvZ29IYXNoIjpudWxsLCJjcmVhdG9ySWQiOiI2MWJjNmRhY2NlZTdkODBiMTllYzI5YjciLCJjcmVhdGVkQXQiOiIyMDIxLTEyLTE3VDExOjA0OjMzLjI2M1oiLCJfX3YiOjAsInJhbmRvbVN0cmluZyI6ImZycXlyMG53b0s5UElOdE5tSkg0Q3drVERZcW5uWUdzaU1Ib0hTL2w2RTVERjZyRnM3OUNFcHVJVVJBcWcvN0lmU0VTdjFRWitVNnMrQUo3elh3UTExaUFOMkdMU2dqMkVSaXRySjMxdmxVeGpxMEZ0STlLSzRWdUVQNlFqcUFiTyJ9LCJpYXQiOjE2Mzk3MzkwODN9.Vpm-iGCS9S_v5cejAsUhOxTs29nc5O_M92fqecld3tI'; //done
  
// NAVBAR LOGO
// If ’true’, same as above logo will also be displayed in the top left of the navbar before the app title
const navbarLogoShow = false; //done

//universal link url
const unv_url = 'https://www.eto.li/go?c=';
const unv_url1 = 'https://www.eto.li/go/?c=';

// COLOUR THEME
const commonColors = {
  primaryColor: '#4E8AC2',
  primaryDarkColor: '#3774AD',
  secondaryColor: '#133452',
}; //done

// FONTS
const textStyles = {
  lightFont: 'Montserrat-Light',
  regularFont: 'Montserrat-Regular',
  mediumFont: 'Montserrat-Medium',
  boldFont: 'Montserrat-Bold',
  semiBoldFont: 'Montserrat-SemiBold',
  thinFont: 'Montserrat-Thin',
}; //done

/* TUTORIAL */
// If enabled, users will be shown on-boarding tutorial screens to explain how to use the app and the token economy. Additionally, in the menu there will be “Tutorial” item that will allow users to review the tutorial again in future. We aim to keep the UI self-explanatory so keeping this disabled by default.
const tutorialStartUponLogin = false; // show tutorial upon login //done
const tutorialShowInMenu = false; // show tutorial item in the menu //done

/* USERS AND ACCOUNTS */
// EMAIL MANAGEMENT
// If enabled, we allow users to add / remove additional e-mails via E-mail menu item. This allows the system to “merge” user accounts when they use different social sign-in (SSO) mechanisms or 3rd parties for user accounts sign in, verification and premium features.
const usersEmailsManageEnabled = false;

// PREMIUM MEMBER CHECK
// For discussion - include here possibility to enable custom “premium member check” logic - possibly via custom ‘include’ code and then use it elsewhere in the engine, without breaking compatibility if this isn’t enabled. E.g. Hubspot e-mail verification etc.
// export const usersPremiumCheck = "src/usersPremiumCheck.js";

/* LOBBY (CHATS) SCREEN */
// LIST OF CHATS
// Here we display a list of group chats that are going to be shown by default to all users joining the app. Users may later reorder or remove these chats.
/*
"chatKey" - public key or Ethereum wallet address of the chat room
“chatDefaultOrder” - default sorting order of the chat room in the users screen
“premiumOnly” - if true, only show this room to premium users
“stickyOrder” - if true, users can’t change the order of this chat room 
“removable” - if false, users cannot remove or leave this chat room
*/
const defaultChatRooms = [
  {
    chatKey: '',
    chatDefaultOrder: '',
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
  },
];
const defaultChats = {
  f6b35114579afc1cb5dbdf5f19f8dac8971a90507ea06083932f04c50f26f1c5: {
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
  },
};

/* TOKEN ECONOMY */
// Coins image path
import coinImagePath from '../src/assets/coin.png'; //done

// Coins symbol
const coinsMainSymbol = 'ETO'; //done
const coinsMainName = 'Ethora Coin'; //done

//ITEMS
//Allow Minting by users
const itemsMintingAllowed = true;

// Allow Transfers by users
// if set to ‘false’ users won’t be able to transfer items between each other or drop them in the chat rooms. This way you may, for example, support “badges” or “achievements”, as well as other scenarios where you may want Items to only be received from the system or chat bots.
const itemsTransfersAllowed = true;

// Minting Fee
// (a proposed parameter, not implemented yet, if set will require N Coins to be spent towards minting each Item or a copy of an Item)
const itemsMintingFee = 10;

// SYSTEM WALLET NAME FOR TRANSACTIONS
// Users receive transactions from your ’system’ wallet (or main app wallet) time to time. For example, 100 Coins upon first sign up. Transactions from other users typically display the counter-party first name and last name. From system it displays as “Anonymous” by default.
const appWalletName = 'Anonymous';

const allowIsTyping = true;

const endPoints = ['DEV', 'QA', 'PROD'];

const appEndpoint = endPoints[0];

const appVersion = DeviceInfo.getVersion();

export {
  appTitle,
  logoPath,
  navbarLogoShow,
  commonColors,
  textStyles,
  tutorialStartUponLogin,
  tutorialShowInMenu,
  usersEmailsManageEnabled,
  defaultChatRooms,
  coinImagePath,
  coinsMainSymbol,
  itemsMintingAllowed,
  itemsTransfersAllowed,
  itemsMintingFee,
  appWalletName,
  APP_TOKEN,
  coinsMainName,
  loginScreenBackgroundImage,
  unv_url,
  unv_url1,
  slide1Image1,
  slide2Image1,
  slide2Image2,
  slide2Image3,
  slide3Image1,
  slide3Image2,
  slide4Image1,
  slide4Image2,
  allowIsTyping,
  appEndpoint,
  appVersion,
  defaultChats
};
