

// Master switches 

/*
START SCREEN switch.
This specifies which screen is going to be the default one for Users. See options below.
(A) Starred rooms. In social-focused applications which is also default for Ethora, this is ’roomsStarred’ which means user will first see the messaging interface with ‘starred’ tab selected.
(B) Own Profile screen. In business-focused applications you may prefer to have ‘profileOwn’ be the start screen. That’s where User can view their own profile, see their documents / assets and share their information via QR and links.
(C) Chat Bot. In some business and social applications, User needs to be greeted by a chat bot. It may be the case that most of the interaction will happen in one Room via a conversational interface. In such case, specify ‘roomBot’. This means that the app will send a “hi” message to your default chat bot and the User will be redirected to their individual Room with the bot, as their start screen experience. The default chat bot will prompt the User for further actions from there.
(D) Metaverse mode. If you prefer a gamified / metaverse experience, however, you may want to start from ‘roomsNav’ option which prompts the User to start ‘walking’ around Rooms in a metaverse presence mode.
*/

const configStartScreenOptions = {roomsStarred: 'roomsStarred', profileOwn: 'profileOwn', roomBot: 'roomBot', roomsNav: 'roomsNav'}
export const configStartScreen = configStartScreenOptions.roomsStarred; // default option (A) - start with the starred or default chat Rooms
// const configStartScreen = 'profileOwn'; // option (B) - users start from own Profile
// const configStartScreen = 'roomBot'; // option (C) - User starts in a room guided by your default Chat Bot
// const configStartScreen = 'roomsNav'; // option (D) - User starts in a ‘metaverse’ mode


/*
META / NAV master switch.
When enabled, this means that your Users can use the “metaverse” navigation mode to move between Rooms.
In this mode, Users can also create their own Rooms next to existing ones, collaboratively building a social metaspace.
If disabled, all rooms will be static and no navigation UI will be shown.
*/

export const configMetaNav = true; // most business apps would prefer this disabled

/*
ITEMS / NFT master switch.
When this setting is enabled, your Users can mint and trade NFTs a.k.a Items.
Business applications may prefer this disabled and use Documents asset type instead.

Developers notes:
(1) We hide “Mint NFT” from Actions menu when this is enabled.
(2) In Profile, we already hide types of assets that User doesn’t have, however we should also check this switch to make sure we don’t display contextual NFT related UI in apps where this is disabled.
*/

export const configNFT = true;



/*
DOCUMENTS master switch.
When this setting is enabled, your Users can create and share Documents asset type.
Most business applications would prefer this enabled.
*/

export const configDocuments = true;


// LOGIN SCREEN

// Enable or disable options below to control which login options your Users should have.

export const googleSignIn = true; // social sign on with existing Gmail account
export const appleSignIn = true; // social sign on with existing Apple account
export const facebookSignIn = true; // social sign on with existing Facebook account
export const metamaskSignIn = true; // sign in with Metamask or Wallet Connect crypto ID
export const regularLogin = true; // custom login+password - users have to register first
export const regularLoginEmail = true; // custom login using e-mail address for login - users have to register first
export const regularLoginUsername = true;

export const coinsMainSymbol = 'DPT'; //done
export const coinsMainName = 'Dappros Platform Token'; //done
export const coinReplacedSymbol = 'ETO'; //done
export const coinReplacedName = 'Ethora Coin'; //done


export const defaultChats = {
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
// TO BE DEPRECATED

// images for tutorial screens
// TUTORIAL
// EMAIL MANAGEMENT
// PREMIUM MEMBER CHECK

