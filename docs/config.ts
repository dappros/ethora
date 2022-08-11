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
  'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYyZDAwNTQyMGY5NTFhNjA0MjJhNTRhNCIsImFwcE5hbWUiOiJFdGhvcmEgUHJvZCIsImFwcERlc2NyaXB0aW9uIjoidW5kZWZpbmVkIiwiYXBwVXJsIjoidW5kZWZpbmVkIiwiYXBwR29vZ2xlSWQiOiI5NzI5MzM0NzAwNTQtdjY0dWE5NDc5MWczMmZhMHNoZG0zbGZvZjkzMGhvbjAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJjcmVhdG9ySWQiOiI2MmQwMDM5NzBmOTUxYTYwNDIyYTUzNTAiLCJjcmVhdGVkQXQiOiIyMDIyLTA3LTE0VDEyOjAwOjAyLjM4OFoiLCJfX3YiOjB9LCJpYXQiOjE2NTc4MDAwMTR9.qCOeOhL6fFMzmHr3rI6CF28KUS4c9mMNaWN0rxnSniY';

// NAVBAR LOGO
// If ’true’, same as above logo will also be displayed in the top left of the navbar before the app title
const navbarLogoShow = false; //done

//universal link url
const unv_url = 'https://www.eto.li/go?c=';
const appLinkingUrl = 'https://www.eto.li/go';

// COLOUR THEME
const commonColors = {
  primaryColor: '#003E9C',
  primaryDarkColor: '#2775EA',
  secondaryColor: '#133452',
}; //done

// FONTS
const textStyles = {
  lightFont: 'Poppins-Light',
  regularFont: 'Poppins-Regular',
  mediumFont: 'Poppins-Medium',
  boldFont: 'Poppins-Bold',
  semiBoldFont: 'Poppins-SemiBold',
  thinFont: 'Poppins-Thin',
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
  '1c525d51b2a0e9d91819933295fcd82ba670371b92c0bf45ba1ba7fb904dbcdc': {
    name: 'Agora (Start here) 🇬🇧🏛️👋💬',
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
  },
  d0df15e359b5d49aaa965bca475155b81784d9e4c5f242cebe405ae0f0046a22: {
    name: 'Майдан (Maidan) 🇺🇦🏛️🫂💬',
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
  },
  fd6488675183a9db2005879a945bf5727c8594eaae5cdbd35cb0b02c5751760e: {
    name: 'मैदान (Maidan) 🇮🇳🏛️🫂',
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
  },
};
defaultChats[
  '1c525d51b2a0e9d91819933295fcd82ba670371b92c0bf45ba1ba7fb904dbcdc'
];

/* TOKEN ECONOMY */
// Coins image path
import coinImagePath from '../src/assets/coin.png'; //done

// Coins symbol
const coinsMainSymbol = 'DPT'; //done
const coinsMainName = 'Dappros Platform Token'; //done
const coinReplacedSymbol = 'ETO'; //done
const coinReplacedName = 'Ethora Coin'; //done

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

const appEndpoint = endPoints[2];

const appVersion = DeviceInfo.getVersion();

const logoWidth: string = '70%'; //represents the percentage of the width of device
const logoHeight = 70; //represents the percetage of the height of the device

const defaultBotsList = [
  {
    name: 'Atom Bot',
    id: '0x_d6005_ca397a6_d_f3963_a5802873c31_f243152_a6_c9',
    jid: '0x_d6005_ca397a6_d_f3963_a5802873c31_f243152_a6_c9',
  },
  {
    name: 'Atom Bot Dev',
    jid: '0xd891a_c12_d8_b51947548844_ec4f287d_c2_b267cae6',
    id: '0xd891a_c12_d8_b51947548844_ec4f287d_c2_b267cae6',
  },
];

//weather to show title in the login screen or not. For logo image that already has title, set the below property to false
const isLogoTitle: boolean = false;

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
  slide1Image1,
  slide2Image1,
  slide2Image2,
  slide2Image3,
  slide3Image1,
  slide3Image2,
  slide4Image1,
  slide4Image2,
  allowIsTyping,
  defaultBotsList,
  appEndpoint,
  appVersion,
  defaultChats,
  logoWidth,
  coinReplacedName,
  coinReplacedSymbol,
  logoHeight,
  isLogoTitle,
  appLinkingUrl,
};
