// Master switches

import { TActiveRoomFilter } from "../store"

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

// LOGIN SCREEN

// Enable or disable options below to control which login options your Users should have.

export const googleSignIn = true // social sign on with existing Gmail account
export const appleSignIn = true // social sign on with existing Apple account
export const facebookSignIn = true // social sign on with existing Facebook account
export const metamaskSignIn = true // sign in with Metamask or Wallet Connect crypto ID
export const regularLogin = true // custom login+password - users have to register first
export const regularLoginEmail = true // custom login using e-mail address for login - users have to register first
export const regularLoginUsername = false

export const coinsMainSymbol = "DPT" //done
export const coinsMainName = "Dappros Platform Token" //done
export const coinReplacedSymbol = "ETO" //done
export const coinReplacedName = "Ethora Coin" //done
export const appName = "Ethora" //done

export const defaultChats = {
  "5dc237d5792e95ba96240223e14ee00b13d2548c5cdfcf2e27ca67a0b11f5b9d": {
    name: "Random talks",
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
  },
  cc39004bf432f6dc34b47cd64251236c9ae65eadd890daef3ff7dbc94c3caecb: {
    name: "Technical support",
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
  },
  dc635d74fb77f53701d48899d86175c3a62a3e8a2a76e9f5ea0e9a3918cf6152: {
    name: "NFT Factory",
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
  },
}

export const defaultMetaRoom = {
  name: "Agora (Start here) 🇬🇧🏛️👋💬",
  jid: "1c525d51b2a0e9d91819933295fcd82ba670371b92c0bf45ba1ba7fb904dbcdc",
}

export const ROOMS_FILTERS = {
  official: "official",
  private: "private",
  groups: "groups",
  meta: "meta",
  favourite: "favourite",
} as const

export const defaultChatBackgroundThemes = [
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
// TO BE DEPRECATED

// images for tutorial screens
// TUTORIAL
// EMAIL MANAGEMENT
// PREMIUM MEMBER CHECK
