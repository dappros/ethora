// Master switches

/*
START SCREEN switch.
This specifies which screen is going to be the default one for Users. See options below.
(A) Starred rooms. In social-focused applications which is also default for Ethora, this is ’roomsStarred’ which means user will first see the messaging interface with ‘starred’ tab selected.
(B) Own Profile screen. In business-focused applications you may prefer to have ‘profileOwn’ be the start screen. That’s where User can view their own profile, see their documents / assets and share their information via QR and links.
(C) Chat Bot. In some business and social applications, User needs to be greeted by a chat bot. It may be the case that most of the interaction will happen in one Room via a conversational interface. In such case, specify ‘roomBot’. This means that the app will send a “hi” message to your default chat bot and the User will be redirected to their individual Room with the bot, as their start screen experience. The default chat bot will prompt the User for further actions from there.
(D) Metaverse mode. If you prefer a gamified / metaverse experience, however, you may want to start from ‘roomsNav’ option which prompts the User to start ‘walking’ around Rooms in a metaverse presence mode.
*/

const configStartScreenOptions = {
  roomsStarred: "roomsStarred",
  profileOwn: "profileOwn",
  roomBot: "roomBot",
  roomsNav: "roomsNav",
}
export const configStartScreen = configStartScreenOptions.roomsStarred // default option (A) - start with the starred or default chat Rooms
// const configStartScreen = 'profileOwn'; // option (B) - users start from own Profile
// const configStartScreen = 'roomBot'; // option (C) - User starts in a room guided by your default Chat Bot
// const configStartScreen = 'roomsNav'; // option (D) - User starts in a ‘metaverse’ mode

/*
META / NAV master switch.
When enabled, this means that your Users can use the “metaverse” navigation mode to move between Rooms.
In this mode, Users can also create their own Rooms next to existing ones, collaboratively building a social metaspace.
If disabled, all rooms will be static and no navigation UI will be shown.
*/

export const configMetaNav = true // most business apps would prefer this disabled

/*
ITEMS / NFT master switch.
When this setting is enabled, your Users can mint and trade NFTs a.k.a Items.
Business applications may prefer this disabled and use Documents asset type instead.

Developers notes:
(1) We hide “Mint NFT” from Actions menu when this is enabled.
(2) In Profile, we already hide types of assets that User doesn’t have, however we should also check this switch to make sure we don’t display contextual NFT related UI in apps where this is disabled.
*/

export const configNFT = true

/*
DOCUMENTS master switch.
When this setting is enabled, your Users can create and share Documents asset type.
Most business applications would prefer this enabled.
*/

export const configDocuments = true

// TITLE
// App title / name shown in Login screen and top nav bar
const appTitle = "Ethora" //done

// LOGO (LOGIN SCREEN)
// App logo (displayed in login screen) image path:
import logoPath from "../src/assets/logo.png" //done
import DeviceInfo from "react-native-device-info"

//images for tutorial screens
// import slide1Image1 from '../src/assets/tutorials/slide1Img1.png';
// import slide2Image1 from '../src/assets/tutorials/slide2Img1.png';
// import slide2Image2 from '../src/assets/tutorials/slide2Img2.png';
// import slide2Image3 from '../src/assets/tutorials/slide2Img3.png';
// import slide3Image1 from '../src/assets/tutorials/slide3Img1.png';
// import slide3Image2 from '../src/assets/tutorials/slide3Img2.png';
// import slide4Image1 from '../src/assets/tutorials/slide4Img1.png';
// import slide4Image2 from '../src/assets/tutorials/slide4Img2.png';

import loginScreenBackgroundImage from "../src/assets/login_background.png"

// NAVBAR LOGO
// If ’true’, same as above logo will also be displayed in the top left of the navbar before the app title
const navbarLogoShow = false //done

// COLOUR THEME
const commonColors = {
  primaryColor: "#003E9C",
  primaryDarkColor: "#2775EA",
  secondaryColor: "#133452",
} //done

// FONTS
const textStyles = {
  lightFont: "Poppins-Light",
  regularFont: "Poppins-Regular",
  mediumFont: "Poppins-Medium",
  boldFont: "Poppins-Bold",
  semiBoldFont: "Poppins-SemiBold",
  thinFont: "Poppins-Thin",
} //done

export const googleWebClientId =
  "972933470054-hbsf29ohpato76til2jtf6jgg1b4374c.apps.googleusercontent.com"

const defaultChatBackgroundTheme = [
  {
    value:
      "https://etofs.com/ipfs/QmaRpkWFgMhxjp6kkugCYNTF9rE4vmXdfHE4DVNDvzwTvK",
    isSelected: false,
    alt: "Default",
  },
  {
    value:
      "https://etofs.com/ipfs/QmWcAQtoz3RaSy9LXDuUu4fqtWKygnF13pDD3XbkdYW6Mn",
    isSelected: false,
    alt: "#00C49F",
  },
  {
    value:
      "https://etofs.com/ipfs/QmVZRCSBPrKRuKtESQWAXseP6EWkqPEiUFXMZKxAPjraay",
    isSelected: false,
    alt: "#85BACD",
  },
  {
    value:
      "https://etofs.com/ipfs/QmWwxZcpFsU4hQiZfpwiCRB2VZf29iULy45HiBQnjg4MPS",
    isSelected: false,
    alt: "#D6A4A6",
  },
  {
    value:
      "https://etofs.com/ipfs/QmbtsYaGpTHVmwC4Ch622hA8DCaCbeyWNagTYUz8GHpWP9",
    isSelected: false,
    alt: "Colourful",
  },
  {
    value:
      "https://etofs.com/ipfs/QmWqq6YZ4b7stmH5YiuVWF72emVzSk26vd1vSvBs1mitoY",
    isSelected: false,
    alt: "Pattern",
  },
  {
    value:
      "https://etofs.com/ipfs/QmXV6XgrHhVcKpY73nxvpF6YTyqKhfywixbPXbFCTEUEUT",
    isSelected: false,
    alt: "Pillars of creation",
  },
  {
    value:
      "https://etofs.com/ipfs/QmXzK3H1MpMTdjUQ2fffENKW5bDxjocbwt7qMZNBFsLkV4",
    isSelected: false,
    alt: "Tech Doodle",
  },
]

/* TUTORIAL */
// If enabled, users will be shown on-boarding tutorial screens to explain how to use the app and the token economy. Additionally, in the menu there will be “Tutorial” item that will allow users to review the tutorial again in future. We aim to keep the UI self-explanatory so keeping this disabled by default.
const tutorialStartUponLogin = false // show tutorial upon login //done
const tutorialShowInMenu = false // show tutorial item in the menu //done

/* USERS AND ACCOUNTS */
// EMAIL MANAGEMENT
// If enabled, we allow users to add / remove additional e-mails via E-mail menu item. This allows the system to “merge” user accounts when they use different social sign-in (SSO) mechanisms or 3rd parties for user accounts sign in, verification and premium features.
const usersEmailsManageEnabled = false

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
    chatKey: "",
    chatDefaultOrder: "",
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
  },
]

const defaultChats = [
  {
    jid: "5dc237d5792e95ba96240223e14ee00b13d2548c5cdfcf2e27ca67a0b11f5b9d",
    name: "Random talks",
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
  },
  {
    jid: "cc39004bf432f6dc34b47cd64251236c9ae65eadd890daef3ff7dbc94c3caecb",
    name: "Technical support",
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
  },
  {
    jid: "dc635d74fb77f53701d48899d86175c3a62a3e8a2a76e9f5ea0e9a3918cf6152",
    name: "NFT Factory",
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
  },
]

export const defaultMetaRoom = {
  name: "Agora (Start here) 🇬🇧🏛️👋💬",
  jid: "1c525d51b2a0e9d91819933295fcd82ba670371b92c0bf45ba1ba7fb904dbcdc",
}

export interface IMetaRoom {
  name: string
  description: string
  meta: boolean
  idAddress: string
  linkN: string
  linkS: string
  linkW: string
  linkE: string
}
export const metaRooms: IMetaRoom[] = [
  {
    name: "Agora (Start here) 🇬🇧🏛️👋💬",
    description: "Central Place",
    idAddress:
      "1c525d51b2a0e9d91819933295fcd82ba670371b92c0bf45ba1ba7fb904dbcdc",
    meta: true,
    linkN: "d0df15e359b5d49aaa965bca475155b81784d9e4c5f242cebe405ae0f0046a22",
    linkS: "fd6488675183a9db2005879a945bf5727c8594eaae5cdbd35cb0b02c5751760e",
    linkW: "a3d524e04e928107d73bd82b65ea3aa2d9b08849019382614e1cae81203b6816",
    linkE: "fc8083067e0cdc43010d04269ec262a164f72f07c54b3ba3909b072551261149",
  },
  {
    name: "Майдан (Maidan) 🇺🇦🏛️🫂💬",
    description: "Central Place",
    idAddress:
      "d0df15e359b5d49aaa965bca475155b81784d9e4c5f242cebe405ae0f0046a22",
    meta: true,
    linkN: "1c525d51b2a0e9d91819933295fcd82ba670371b92c0bf45ba1ba7fb904dbcdc",
    linkS: "1c525d51b2a0e9d91819933295fcd82ba670371b92c0bf45ba1ba7fb904dbcdc",
    linkW: "",
    linkE: "",
  },
  {
    name: "मैदान (Maidan) 🇮🇳🏛️🫂",
    description: "Central Place",
    idAddress:
      "fd6488675183a9db2005879a945bf5727c8594eaae5cdbd35cb0b02c5751760e",
    meta: true,
    linkN: "1c525d51b2a0e9d91819933295fcd82ba670371b92c0bf45ba1ba7fb904dbcdc",
    linkS: "",
    linkW: "",
    linkE: "",
  },
  {
    name: "Agora West 🇪🇸",
    description: "You speak Spanish here",
    idAddress:
      "a3d524e04e928107d73bd82b65ea3aa2d9b08849019382614e1cae81203b6816",
    meta: true,
    linkN: "",
    linkS: "",
    linkW: "601dc84c0c939dc5adf2f28f01a56b0d0fe70fce056ff3b6b03500c51af72a19",
    linkE: "1c525d51b2a0e9d91819933295fcd82ba670371b92c0bf45ba1ba7fb904dbcdc",
  },
  {
    name: "The Street (BazaarP)",
    description: "Bazaar Pass",
    idAddress:
      "601dc84c0c939dc5adf2f28f01a56b0d0fe70fce056ff3b6b03500c51af72a19",
    meta: true,
    linkN: "782bef1c87061bf71be8b71b7bed20572334f873c7d04380f2285fc94036400e",
    linkS: "6d48896c18ef0b953a69ed7aff94f549b8263f11985682d37c882103be0a0112",
    linkW: "72e9a59f5a1d6289dbacb35df897d6c007c55a27e77018455c37e7b372668475",
    linkE: "a3d524e04e928107d73bd82b65ea3aa2d9b08849019382614e1cae81203b6816",
  },
  {
    name: "Bazaar Square N1",
    description: "",
    idAddress:
      "782bef1c87061bf71be8b71b7bed20572334f873c7d04380f2285fc94036400e",
    meta: true,
    linkN: "",
    linkS: "601dc84c0c939dc5adf2f28f01a56b0d0fe70fce056ff3b6b03500c51af72a19",
    linkW: "",
    linkE: "",
  },
  {
    name: "Bazaar Square S1",
    description: "",
    idAddress:
      "6d48896c18ef0b953a69ed7aff94f549b8263f11985682d37c882103be0a0112",
    meta: true,
    linkN: "601dc84c0c939dc5adf2f28f01a56b0d0fe70fce056ff3b6b03500c51af72a19",
    linkS: "",
    linkW: "",
    linkE: "",
  },
  {
    name: "Port",
    description:
      "Sea starts to the west from here.\nYou can do export-import operations here.",
    idAddress:
      "72e9a59f5a1d6289dbacb35df897d6c007c55a27e77018455c37e7b372668475",
    meta: true,
    linkN: "",
    linkS: "",
    linkW: "",
    linkE: "601dc84c0c939dc5adf2f28f01a56b0d0fe70fce056ff3b6b03500c51af72a19",
  },
  {
    name: "Agora East 🇨🇳",
    description: "Chinatown",
    idAddress:
      "fc8083067e0cdc43010d04269ec262a164f72f07c54b3ba3909b072551261149",
    meta: true,
    linkN: "",
    linkS: "",
    linkW: "1c525d51b2a0e9d91819933295fcd82ba670371b92c0bf45ba1ba7fb904dbcdc",
    linkE: "c0338e6a249360af2e5c9c2e4256b42105579bb5c286cb34d661686133e09d8a",
  },
  {
    name: "Street (Pubs Alley)",
    description: "",
    idAddress:
      "c0338e6a249360af2e5c9c2e4256b42105579bb5c286cb34d661686133e09d8a",
    meta: true,
    linkN: "",
    linkS: "debdb4572f301ea313956c513bd7e3824304a881b213ffb1592e811c7c8e3291",
    linkW: "fc8083067e0cdc43010d04269ec262a164f72f07c54b3ba3909b072551261149",
    linkE: "449be8664bdc4427f6a9b0845f363fd5a38429f01a3ca018b2ae2f50326b2cb7",
  },
  {
    name: "Downtown Abbey",
    description: "",
    idAddress:
      "debdb4572f301ea313956c513bd7e3824304a881b213ffb1592e811c7c8e3291",
    meta: true,
    linkN: "c0338e6a249360af2e5c9c2e4256b42105579bb5c286cb34d661686133e09d8a",
    linkS: "",
    linkW: "",
    linkE: "",
  },
  {
    name: "Downtown (Street)",
    description: "",
    idAddress:
      "449be8664bdc4427f6a9b0845f363fd5a38429f01a3ca018b2ae2f50326b2cb7",
    meta: true,
    linkN: "c1701b7b5e02665c89e8d578174761ac86f41384c69b6b914c737799c6ed61db",
    linkS: "03adb005b8c2cdbba33221f5677dc07908512f36e0c47c051df6e6907eeafd13",
    linkW: "c0338e6a249360af2e5c9c2e4256b42105579bb5c286cb34d661686133e09d8a",
    linkE: "",
  },
  {
    name: "Downtown North",
    description: "",
    idAddress:
      "c1701b7b5e02665c89e8d578174761ac86f41384c69b6b914c737799c6ed61db",
    meta: true,
    linkN: "c6ae1923457cd8147bc5da2f2842fde18371e78c4d4242a9dd1fe49217d97d7a",
    linkS: "449be8664bdc4427f6a9b0845f363fd5a38429f01a3ca018b2ae2f50326b2cb7",
    linkW: "",
    linkE: "",
  },
  {
    name: "Downtown South",
    description: "",
    idAddress:
      "03adb005b8c2cdbba33221f5677dc07908512f36e0c47c051df6e6907eeafd13",
    meta: true,
    linkN: "449be8664bdc4427f6a9b0845f363fd5a38429f01a3ca018b2ae2f50326b2cb7",
    linkS: "81d096805567127d9cc6d2548c81e7c68d9e725a28d6421fada996c3e2cd738a",
    linkW: "",
    linkE: "",
  },
  {
    name: "University N1",
    description: "",
    idAddress:
      "81d096805567127d9cc6d2548c81e7c68d9e725a28d6421fada996c3e2cd738a",
    meta: true,
    linkN: "03adb005b8c2cdbba33221f5677dc07908512f36e0c47c051df6e6907eeafd13",
    linkS: "9d38443e2220ded5f60ba39b85acdad3af96f810e359bb741f6d273470c7bf9b",
    linkW: "",
    linkE: "",
  },
  {
    name: "University",
    description: "",
    idAddress:
      "9d38443e2220ded5f60ba39b85acdad3af96f810e359bb741f6d273470c7bf9b",
    meta: true,
    linkN: "81d096805567127d9cc6d2548c81e7c68d9e725a28d6421fada996c3e2cd738a",
    linkS: "c50bb01e1ef7fd9ca0bbabce8c062d2ab88553bc59f71c6754157f94694167cc",
    linkW: "",
    linkE: "",
  },
  {
    name: "University S1",
    description: "",
    idAddress:
      "c50bb01e1ef7fd9ca0bbabce8c062d2ab88553bc59f71c6754157f94694167cc",
    meta: true,
    linkN: "9d38443e2220ded5f60ba39b85acdad3af96f810e359bb741f6d273470c7bf9b",
    linkS: "9d3023ab0032809d9133ca90dd9771dcd8022b40e790798b484298d923695a30",
    linkW: "",
    linkE: "",
  },
  {
    name: "University S2",
    description: "",
    idAddress:
      "9d3023ab0032809d9133ca90dd9771dcd8022b40e790798b484298d923695a30",
    meta: true,
    linkN: "c50bb01e1ef7fd9ca0bbabce8c062d2ab88553bc59f71c6754157f94694167cc",
    linkS: "8e99e5159d9442f9221e1bb53c3b373243c1f040f89c793dbb31a004fe3ead6b",
    linkW: "",
    linkE: "",
  },
  {
    name: "Eastern Bridge",
    description: "",
    idAddress:
      "8e99e5159d9442f9221e1bb53c3b373243c1f040f89c793dbb31a004fe3ead6b",
    meta: true,
    linkN: "9d3023ab0032809d9133ca90dd9771dcd8022b40e790798b484298d923695a30",
    linkS: "e9d7a5284b6c4db5ca999f484a1bff3944cdeb660bed2bbe0a3cc623cf076dad",
    linkW: "",
    linkE: "",
  },
  {
    name: "Three Perches",
    description: "",
    idAddress:
      "e9d7a5284b6c4db5ca999f484a1bff3944cdeb660bed2bbe0a3cc623cf076dad",
    meta: true,
    linkN: "8e99e5159d9442f9221e1bb53c3b373243c1f040f89c793dbb31a004fe3ead6b",
    linkS: "446bbafc54d1f356a8c056e119e3988539c435095fd032f475604bed935c7121",
    linkW: "",
    linkE: "",
  },
  {
    name: "Woodside E S1",
    description: "",
    idAddress:
      "446bbafc54d1f356a8c056e119e3988539c435095fd032f475604bed935c7121",
    meta: true,
    linkN: "e9d7a5284b6c4db5ca999f484a1bff3944cdeb660bed2bbe0a3cc623cf076dad",
    linkS: "",
    linkW: "",
    linkE: "",
  },
  {
    name: "Downtown Ave N1",
    description: "",
    idAddress:
      "c6ae1923457cd8147bc5da2f2842fde18371e78c4d4242a9dd1fe49217d97d7a",
    meta: true,
    linkN: "da73b7305fc21207f7585d7b360d5b24e9d28d09d343fb6194a12f33d7c97ef1",
    linkS: "c1701b7b5e02665c89e8d578174761ac86f41384c69b6b914c737799c6ed61db",
    linkW: "",
    linkE: "",
  },
  {
    name: "Downtown Ave N2",
    description: "",
    idAddress:
      "da73b7305fc21207f7585d7b360d5b24e9d28d09d343fb6194a12f33d7c97ef1",
    meta: true,
    linkN: "c5246e42ed9c8d578555c803b5c39718f16805d429302249c99ec765eed383e8",
    linkS: "c6ae1923457cd8147bc5da2f2842fde18371e78c4d4242a9dd1fe49217d97d7a",
    linkW: "",
    linkE: "",
  },
  {
    name: "Downtown Ave N3",
    description: "",
    idAddress:
      "c5246e42ed9c8d578555c803b5c39718f16805d429302249c99ec765eed383e8",
    meta: true,
    linkN: "68457a4f3210ce2f23078182ef450a59f173868f0d80e24ce24cc2000aa446f5",
    linkS: "da73b7305fc21207f7585d7b360d5b24e9d28d09d343fb6194a12f33d7c97ef1",
    linkW: "",
    linkE: "",
  },
  {
    name: "Gaming Ave S3",
    description: "",
    idAddress:
      "68457a4f3210ce2f23078182ef450a59f173868f0d80e24ce24cc2000aa446f5",
    meta: true,
    linkN: "8e40b32b2dfde2db5ad650c2f6103d8ed5ddec6b87a8f29f91abcfac0836a176",
    linkS: "c5246e42ed9c8d578555c803b5c39718f16805d429302249c99ec765eed383e8",
    linkW: "",
    linkE: "",
  },
  {
    name: "Gaming Ave S2",
    description: "",
    idAddress:
      "8e40b32b2dfde2db5ad650c2f6103d8ed5ddec6b87a8f29f91abcfac0836a176",
    meta: true,
    linkN: "f35f7ce8e0db16c2804b2988ed28c3cf6e115cbb520cd45e2007755a9d1028c5",
    linkS: "68457a4f3210ce2f23078182ef450a59f173868f0d80e24ce24cc2000aa446f5",
    linkW: "",
    linkE: "",
  },
  {
    name: "Gaming Ave S1",
    description: "",
    idAddress:
      "f35f7ce8e0db16c2804b2988ed28c3cf6e115cbb520cd45e2007755a9d1028c5",
    meta: true,
    linkN: "bd594c6b94b204e50bf33f107c8b6a8d0888501b681b73910727bc6c14a2e69d",
    linkS: "8e40b32b2dfde2db5ad650c2f6103d8ed5ddec6b87a8f29f91abcfac0836a176",
    linkW: "",
    linkE: "172bd6f711a0dbdd2890b9e702ff3bad6c24a624c240f91f1dca1ffeee0c4729",
  },
  {
    name: "Casino",
    description: "",
    idAddress:
      "172bd6f711a0dbdd2890b9e702ff3bad6c24a624c240f91f1dca1ffeee0c4729",
    meta: true,
    linkN: "",
    linkS: "",
    linkW: "f35f7ce8e0db16c2804b2988ed28c3cf6e115cbb520cd45e2007755a9d1028c5",
    linkE: "",
  },
  {
    name: "Game Theory ",
    description: "",
    idAddress:
      "bd594c6b94b204e50bf33f107c8b6a8d0888501b681b73910727bc6c14a2e69d",
    meta: true,
    linkN: "e576936a398333e806a5c865d2f23b274354e586816dd5a9f094942a884eedb2",
    linkS: "f35f7ce8e0db16c2804b2988ed28c3cf6e115cbb520cd45e2007755a9d1028c5",
    linkW: "58e38b23800a205494489c6c56bc3eb2352fbff2adfb4ab3b99a44f4ce599871",
    linkE: "",
  },
  {
    name: "Gaming Ave N1",
    description: "",
    idAddress:
      "e576936a398333e806a5c865d2f23b274354e586816dd5a9f094942a884eedb2",
    meta: true,
    linkN: "",
    linkS: "bd594c6b94b204e50bf33f107c8b6a8d0888501b681b73910727bc6c14a2e69d",
    linkW: "",
    linkE: "31928208ce519bf0986c2a93a8237f45d72b9555405bb65d50aaf5e321d227b3",
  },
  {
    name: "Prison",
    description: "",
    idAddress:
      "31928208ce519bf0986c2a93a8237f45d72b9555405bb65d50aaf5e321d227b3",
    meta: true,
    linkN: "",
    linkS: "",
    linkW: "e576936a398333e806a5c865d2f23b274354e586816dd5a9f094942a884eedb2",
    linkE: "",
  },
  {
    name: "Gaming alley W1",
    description: "",
    idAddress:
      "58e38b23800a205494489c6c56bc3eb2352fbff2adfb4ab3b99a44f4ce599871",
    meta: true,
    linkN: "",
    linkS: "",
    linkW: "f5b75fcb70cf6bbce6a7098b695af0fd4695e5cb297c5d7f21a9c6d17f965c8e",
    linkE: "bd594c6b94b204e50bf33f107c8b6a8d0888501b681b73910727bc6c14a2e69d",
  },
  {
    name: "Artists Quarter East",
    description: "",
    idAddress:
      "f5b75fcb70cf6bbce6a7098b695af0fd4695e5cb297c5d7f21a9c6d17f965c8e",
    meta: true,
    linkN: "",
    linkS: "",
    linkW: "13f5971f3f3c395a2c272dab81d016644eb5d1e7dffd562e0c0a9bef3f39a241",
    linkE: "58e38b23800a205494489c6c56bc3eb2352fbff2adfb4ab3b99a44f4ce599871",
  },
  {
    name: "Public Gallery",
    description: "",
    idAddress:
      "13f5971f3f3c395a2c272dab81d016644eb5d1e7dffd562e0c0a9bef3f39a241",
    meta: true,
    linkN: "d62408ba76a951a67adeeaf42746f45bc881f38c88ea8a171f2c954ab92ec26c",
    linkS: "81ee5b8a59042a873395fc9daa0d0066fd563e2716800148f23e59789424aea6",
    linkW: "3c8283cab7f2fabbd89033778c76a45f88b2cf17c373b2fe75f577bf24389462",
    linkE: "f5b75fcb70cf6bbce6a7098b695af0fd4695e5cb297c5d7f21a9c6d17f965c8e",
  },
  {
    name: "Artists Quarter N",
    description: "",
    idAddress:
      "d62408ba76a951a67adeeaf42746f45bc881f38c88ea8a171f2c954ab92ec26c",
    meta: true,
    linkN: "",
    linkS: "13f5971f3f3c395a2c272dab81d016644eb5d1e7dffd562e0c0a9bef3f39a241",
    linkW: "",
    linkE: "",
  },
  {
    name: "Artists Quarter West",
    description: "",
    idAddress:
      "3c8283cab7f2fabbd89033778c76a45f88b2cf17c373b2fe75f577bf24389462",
    meta: true,
    linkN: "",
    linkS: "0d80f50cd62975998abfd7fd4cc1f0d0d9397ecf10e796cb9aae908124dea901",
    linkW: "0495e59912dd4df1a862eed04e1a2353dc2e432299223dd14a9e9f600035e373",
    linkE: "13f5971f3f3c395a2c272dab81d016644eb5d1e7dffd562e0c0a9bef3f39a241",
  },
  {
    name: "NFT workshop",
    description: "",
    idAddress:
      "0d80f50cd62975998abfd7fd4cc1f0d0d9397ecf10e796cb9aae908124dea901",
    meta: true,
    linkN: "3c8283cab7f2fabbd89033778c76a45f88b2cf17c373b2fe75f577bf24389462",
    linkS: "",
    linkW: "",
    linkE: "",
  },
  {
    name: "Performers Quarter",
    description: "",
    idAddress:
      "0495e59912dd4df1a862eed04e1a2353dc2e432299223dd14a9e9f600035e373",
    meta: true,
    linkN: "",
    linkS: "",
    linkW: "",
    linkE: "3c8283cab7f2fabbd89033778c76a45f88b2cf17c373b2fe75f577bf24389462",
  },
  {
    name: "Artists Quarter S",
    description: "",
    idAddress:
      "81ee5b8a59042a873395fc9daa0d0066fd563e2716800148f23e59789424aea6",
    meta: true,
    linkN: "13f5971f3f3c395a2c272dab81d016644eb5d1e7dffd562e0c0a9bef3f39a241",
    linkS: "8ee128498369208f15ffcbf4a0294edf51f217604f12bb5caee32760c4993365",
    linkW: "",
    linkE: "",
  },
  {
    name: "Artists Pass S1",
    description: "",
    idAddress:
      "8ee128498369208f15ffcbf4a0294edf51f217604f12bb5caee32760c4993365",
    meta: true,
    linkN: "81ee5b8a59042a873395fc9daa0d0066fd563e2716800148f23e59789424aea6",
    linkS: "f3476d5596c9cc8b4733326854c30d37c6cd09e884f4082085db00451f748cb6",
    linkW: "",
    linkE: "",
  },
  {
    name: "Artists Pass S2",
    description: "",
    idAddress:
      "f3476d5596c9cc8b4733326854c30d37c6cd09e884f4082085db00451f748cb6",
    meta: true,
    linkN: "8ee128498369208f15ffcbf4a0294edf51f217604f12bb5caee32760c4993365",
    linkS: "5c0acfbf91a392ffe8e6f6f4bf239ed55c6837b7f528a61269269fed0680ea5d",
    linkW: "",
    linkE: "",
  },
  {
    name: "Agoras Pass N3",
    description: "",
    idAddress:
      "5c0acfbf91a392ffe8e6f6f4bf239ed55c6837b7f528a61269269fed0680ea5d",
    meta: true,
    linkN: "f3476d5596c9cc8b4733326854c30d37c6cd09e884f4082085db00451f748cb6",
    linkS: "f5b6e88e26eff20a663b42b4620d5a54a253ecbabd1b4183eb751f807d1da9b3",
    linkW: "",
    linkE: "",
  },
  {
    name: "Agoras Pass N2",
    description: "",
    idAddress:
      "f5b6e88e26eff20a663b42b4620d5a54a253ecbabd1b4183eb751f807d1da9b3",
    meta: true,
    linkN: "5c0acfbf91a392ffe8e6f6f4bf239ed55c6837b7f528a61269269fed0680ea5d",
    linkS: "",
    linkW: "",
    linkE: "",
  },
]
/* TOKEN ECONOMY */
// Coins image path
import coinImagePath from "../src/assets/coin.png" //done

// Coins symbol
const coinsMainSymbol = "DPT" //done
const coinsMainName = "Dappros Platform Token" //done
const coinReplacedSymbol = "ETO" //done
const coinReplacedName = "Ethora Coin" //done

//ITEMS
//Allow Minting by users
const itemsMintingAllowed = true

// Allow Transfers by users
// if set to ‘false’ users won’t be able to transfer items between each other or drop them in the chat rooms. This way you may, for example, support “badges” or “achievements”, as well as other scenarios where you may want Items to only be received from the system or chat bots.
const itemsTransfersAllowed = true

// Minting Fee
// (a proposed parameter, not implemented yet, if set will require N Coins to be spent towards minting each Item or a copy of an Item)
const itemsMintingFee = 10

// SYSTEM WALLET NAME FOR TRANSACTIONS
// Users receive transactions from your ’system’ wallet (or main app wallet) time to time. For example, 100 Coins upon first sign up. Transactions from other users typically display the counter-party first name and last name. From system it displays as “Anonymous” by default.
const appWalletName = "Anonymous"

const allowIsTyping = true

const endPoints: ["DEV", "QA", "PROD"] = ["DEV", "QA", "PROD"]

type TappEndpoint = "DEV" | "QA" | "PROD"
const appEndpoint: TappEndpoint = endPoints[0]

export interface IAPImodes {
  DEV: string
  PROD: string
  QA: string
}

interface IxmppEndpointsValues {
  DOMAIN: string
  SERVICE: string
  CONFERENCEDOMAIN: string
  CONFERENCEDOMAIN_WITHOUT: string
}

export interface IxmppEndpoints {
  DEV: IxmppEndpointsValues
  PROD: IxmppEndpointsValues
  QA: IxmppEndpointsValues
}

const xmppEndpoints: IxmppEndpoints = {
  DEV: {
    DOMAIN: "dev.dxmpp.com",
    SERVICE: "wss://dev.dxmpp.com:5443/ws",
    CONFERENCEDOMAIN: "@conference.dev.dxmpp.com",
    CONFERENCEDOMAIN_WITHOUT: "conference.dev.dxmpp.com",
  },
  QA: {
    DOMAIN: "xmpp.qa.ethoradev.com",
    SERVICE: "wss://xmpp.qa.ethoradev.com:5443/ws",
    CONFERENCEDOMAIN: "@conference.xmpp.qa.ethoradev.com",
    CONFERENCEDOMAIN_WITHOUT: "conference.xmpp.qa.ethoradev.com",
  },
  PROD: {
    DOMAIN: "dxmpp.com",
    SERVICE: "wss://dxmpp.com:5443/ws",
    CONFERENCEDOMAIN: "@conference.dxmpp.com",
    CONFERENCEDOMAIN_WITHOUT: "conference.dxmpp.com",
  },
}
const apiModes: IAPImodes = {
  DEV: "https://api.ethoradev.com/v1",
  PROD: "https://app.dappros.com/v1",
  QA: "https://api.qa.ethoradev.com/v1",
}

const appVersion = DeviceInfo.getVersion()
const domain = "ethora"

//universal link url
//@ts-ignore
const env = appEndpoint === "PROD" ? "p" : "d"
const unv_url = "https://eto.li?c="
const appLinkingUrl = "https://eto.li/"

//Application token

type TTokensMode = "DEV" | "QA" | "PROD"

const TOKENS: Record<TTokensMode, string> = {
  DEV: "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlzVXNlckRhdGFFbmNyeXB0ZWQiOmZhbHNlLCJwYXJlbnRBcHBJZCI6bnVsbCwiaXNBbGxvd2VkTmV3QXBwQ3JlYXRlIjp0cnVlLCJpc0Jhc2VBcHAiOnRydWUsIl9pZCI6IjY0NmNjOGRjOTZkNGE0ZGM4ZjdiMmYyZCIsImRpc3BsYXlOYW1lIjoiRXRob3JhIiwiZG9tYWluTmFtZSI6ImV0aG9yYSIsImNyZWF0b3JJZCI6IjY0NmNjOGQzOTZkNGE0ZGM4ZjdiMmYyNSIsInVzZXJzQ2FuRnJlZSI6dHJ1ZSwiZGVmYXVsdEFjY2Vzc0Fzc2V0c09wZW4iOnRydWUsImRlZmF1bHRBY2Nlc3NQcm9maWxlT3BlbiI6dHJ1ZSwiYnVuZGxlSWQiOiJjb20uZXRob3JhIiwicHJpbWFyeUNvbG9yIjoiIzAwM0U5QyIsInNlY29uZGFyeUNvbG9yIjoiIzI3NzVFQSIsImNvaW5TeW1ib2wiOiJFVE8iLCJjb2luTmFtZSI6IkV0aG9yYSBDb2luIiwiUkVBQ1RfQVBQX0ZJUkVCQVNFX0FQSV9LRVkiOiJBSXphU3lEUWRrdnZ4S0t4NC1XcmpMUW9ZZjA4R0ZBUmdpX3FPNGciLCJSRUFDVF9BUFBfRklSRUJBU0VfQVVUSF9ET01BSU4iOiJldGhvcmEtNjY4ZTkuZmlyZWJhc2VhcHAuY29tIiwiUkVBQ1RfQVBQX0ZJUkVCQVNFX1BST0pFQ1RfSUQiOiJldGhvcmEtNjY4ZTkiLCJSRUFDVF9BUFBfRklSRUJBU0VfU1RPUkFHRV9CVUNLRVQiOiJldGhvcmEtNjY4ZTkuYXBwc3BvdC5jb20iLCJSRUFDVF9BUFBfRklSRUJBU0VfTUVTU0FHSU5HX1NFTkRFUl9JRCI6Ijk3MjkzMzQ3MDA1NCIsIlJFQUNUX0FQUF9GSVJFQkFTRV9BUFBfSUQiOiIxOjk3MjkzMzQ3MDA1NDp3ZWI6ZDQ2ODJlNzZlZjAyZmQ5YjljZGFhNyIsIlJFQUNUX0FQUF9GSVJFQkFTRV9NRUFTVVJNRU5UX0lEIjoiRy1XSE03WFJaNEM4IiwiUkVBQ1RfQVBQX1NUUklQRV9QVUJMSVNIQUJMRV9LRVkiOiIiLCJSRUFDVF9BUFBfU1RSSVBFX1NFQ1JFVF9LRVkiOiIiLCJjcmVhdGVkQXQiOiIyMDIzLTA1LTIzVDE0OjA4OjI4LjEzNloiLCJ1cGRhdGVkQXQiOiIyMDIzLTA1LTIzVDE0OjA4OjI4LjEzNloiLCJfX3YiOjB9LCJpYXQiOjE2ODQ4NTA5MjV9.-IqNVMsf8GyS9Z-_yuNW7hpSmejajjAy-W0J8TadRIM",
  QA: "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlzVXNlckRhdGFFbmNyeXB0ZWQiOmZhbHNlLCJwYXJlbnRBcHBJZCI6bnVsbCwiaXNBbGxvd2VkTmV3QXBwQ3JlYXRlIjp0cnVlLCJpc0Jhc2VBcHAiOnRydWUsIl9pZCI6IjY0ZWVlMzI5OTkxY2NkMDAyZWIxOTA1OSIsImRpc3BsYXlOYW1lIjoiRXRob3JhIiwiZG9tYWluTmFtZSI6ImV0aG9yYSIsImNyZWF0b3JJZCI6IjY0ZWVlMzIxOTkxY2NkMDAyZWIxOTA1MSIsInVzZXJzQ2FuRnJlZSI6dHJ1ZSwiZGVmYXVsdEFjY2Vzc0Fzc2V0c09wZW4iOnRydWUsImRlZmF1bHRBY2Nlc3NQcm9maWxlT3BlbiI6dHJ1ZSwiYnVuZGxlSWQiOiJjb20uZXRob3JhIiwicHJpbWFyeUNvbG9yIjoiIzAwM0U5QyIsInNlY29uZGFyeUNvbG9yIjoiIzI3NzVFQSIsImNvaW5TeW1ib2wiOiJFVE8iLCJjb2luTmFtZSI6IkV0aG9yYSBDb2luIiwiUkVBQ1RfQVBQX1NUUklQRV9QVUJMSVNIQUJMRV9LRVkiOiIiLCJSRUFDVF9BUFBfU1RSSVBFX1NFQ1JFVF9LRVkiOiIiLCJkZWZhdWx0Um9vbXMiOltdLCJjcmVhdGVkQXQiOiIyMDIzLTA4LTMwVDA2OjM1OjIxLjg1NVoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA4LTMwVDA2OjM1OjIxLjg1NVoiLCJfX3YiOjB9LCJpYXQiOjE2OTMzNzczMzR9.5i2nlPk4Sw_si0qNbFd2CclBIX__3VWIjAsyLb75ryw",
  PROD: "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlzVXNlckRhdGFFbmNyeXB0ZWQiOmZhbHNlLCJwYXJlbnRBcHBJZCI6bnVsbCwiX2lkIjoiNjNjNmE4YjdlNGI5ZDIyZTAwMTZlODU3IiwiYXBwTmFtZSI6IkV0aG9yYSIsImFwcERlc2NyaXB0aW9uIjoiIiwiYXBwTG9nbyI6IiIsImNyZWF0b3JJZCI6IjYzYzZhODk4ZTRiOWQyMmUwMDE2ZTgyZiIsImFwcEdvb2dsZUlkIjoiIiwiZGVmYXVsdEFjY2Vzc1Byb2ZpbGVPcGVuIjp0cnVlLCJkZWZhdWx0QWNjZXNzQXNzZXRzT3BlbiI6dHJ1ZSwidXNlcnNDYW5GcmVlIjp0cnVlLCJjcmVhdGVkQXQiOiIyMDIzLTAxLTE3VDEzOjU1OjAzLjA5M1oiLCJ1cGRhdGVkQXQiOiIyMDIzLTAxLTE3VDEzOjU1OjAzLjA5M1oiLCJfX3YiOjB9LCJpYXQiOjE2NzM5NjM3MTl9.jORqppQYgirljdwgMDtWDxNdZDtec7Wm93g-ewPQ3Fk",
}

const APP_TOKEN = TOKENS[appEndpoint]

const logoWidth = "70%" //represents the percentage of the width of device
const logoHeight = 70 //represents the percetage of the height of the device

const defaultBotsList = [
  {
    name: "Merchant Bot",
    id: "0x9_b8_d0cd_c_dba8ef_e145de2_e5986d1b455_c07_b78c0",
    jid: "0x9_b8_d0cd_c_dba8ef_e145de2_e5986d1b455_c07_b78c0",
    walletAddress: "0x9B8D0cdCDba8efE145de2E5986d1b455C07B78c0",
  },
]
export const ROOM_KEYS: Record<string, string> = {
  official: "official",
  private: "private",
  groups: "groups",
}

export const xmppPushUrl = "https://push.dxmpp.com:7777/api/v1"

//weather to show title in the login screen or not. For logo image that already has title, set the below property to false
const isLogoTitle = false
export const appWallets = ["0xB91F341f948469D77D607E36E5264aB0e0479c9C"]

// LOGIN SCREEN

// Enable or disable options below to control which login options your Users should have.

const googleSignIn = true // social sign on with existing Gmail account
const appleSignIn = true // social sign on with existing Apple account
const facebookSignIn = true // social sign on with existing Facebook account
const metamaskSignIn = true // sign in with Metamask or Wallet Connect crypto ID
const regularLogin = true // custom login+password - users have to register first
const regularLoginEmail = true // custom login using e-mail address for login - users have to register first
const regularLoginUsername = false

// TO BE DEPRECATED

// images for tutorial screens
// TUTORIAL
// EMAIL MANAGEMENT
// PREMIUM MEMBER CHECK

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
  googleSignIn,
  appleSignIn,
  facebookSignIn,
  regularLoginEmail,
  regularLogin,
  metamaskSignIn,
  regularLoginUsername,
  defaultChatBackgroundTheme,
  xmppEndpoints,
  apiModes,
}
