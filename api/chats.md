# Working with Ethora/DP Chat server (aka RTC, Real-Time Communication module)

## Ethora (Dappros Platform) client-server Chat flow

**About this document**
<br />This document describes how client Apps interact with Ethora Chat server and API in order to carry out instant messaging (RTC) related functionalities.



## Definitions 

* **App** - an Ethora/DP App that you have created. An App may have a set of default (Pinned) Rooms which all Users of the App will automatically join 
* **User** - an XMPP user which is identified by JID (Jabber ID). In our platform, each platform User automatically has an XMPP user identity
* **Join**, **Participate**, become **Occupant** - this all has the same meaning of User being a member of a Room which means the server will be sending the User all messages from that Room unless User leaves the Room
* **Subscribe** - Users may remain Participants of the Room but unsubscribe or subscribe to Rooms at the same time. This can be used, for example, to manage notifications. 
* **Room** - a chat room (MUC, a Multi-User Chat, by XMPP definition, sometimes also called Conferences) to which Users may be subscribed to send and receive messages. Rooms may be private (1:1 direct messaging), Group (private discussion of more than 2 Users) or Public (publicly available Room) depending on their settings and who they were shared with
* **Owner (Room Owner)** - Room Owner is a User who has full controls over the Room (typically the User who has created it in the first place)
* **Admin (Room Admin)** - Room Admin is a User who has certain administrative privileges over the specific Room (e.g. a chat moderator)
* **Stanza** - an XMPP stanza which is basically a chat message encoded in 
* **XMPP** - XMPP messaging protocol which handles the instant messaging via the XMPP chat server as part of our RTC component
* **Push Notification** - Users who are currently inactive but are subscribed to a Room will receive a Push Notification to their Devices unless they have disabled alerts in your App settings
* **Device** - A User might have multiple Devices they use to access your Apps and for messaging. This means at our Chat server side, we handle subscriptions to Push Notifications separately for each device. Your App instances running on different Devices will also have individual local storage caching for assets such as chat history.
* **Block** - when one User blocks another User, they won't be able to see messages from them
* **Ban** - when a Room Owner or Admin bans a User, that User won't be able to post messages into the Room where they are banned

## Brief architecture note

At the core of the Ethora RTC is an open-source Ejabberd server with our own custom made plugins and add-ons to it developed and maintained jointly with DeepX https://deepxhub.com/. Main components listed below:

CORE SERVER 
* XMPP Chat Server (Ejabberd) - responsible for handling the core functionality of instant messaging. Stores data in an SQL database.

MAIN FEATURES PLUGINS
* Plugin: mod_delete - allows to delete chat messages
* Plugin: mod_edit - allows to edit chat messages
* Plugin: mod_get_user_rooms - allows to easily obtain a list of all Rooms the User is participating in
* Plugin: mod_get_users_activity - gets all participants and last activity from Room (used e.g. for Chat Details screen)
* Plugin: mod_offline_post - sends a push notification to a webservice (e.g. Apple, Google push services) to alert the subscribers who are currently offline
* Plugin: mod_user_ban - allows to ban Users
* Plugin: mod_user_block - allows to block Users

STATS 
* Plugin: mod_send_message_to_stat - sends message data to Stats server
 

## XMPP functions used in this flow
* sendMessage
* roomPresence
* getRooms
* getRoomInfo
* roomConfig
* getArchive
* subscribe
* createNewRoom

## Typical client-server flows

### Standard flow (register, subscribe to rooms, read rooms, send messages, receive push notifications)

#### Registration
* App registers the User using DP Users API.
* DP Users API sends an API request to Chat server’s own API which creates a Chat server user ID (JID aka jabber ID). DP Users logic derives the JID to be used from the wallet address property of the DP User entity. 

#### Show and subscribe to Default Rooms
* App requests the Default Rooms (“pinned” rooms) with the current App JWT using DP API: /v1/apps/get-default-rooms. 
* DP API returns the list of default rooms.
* App sends XMPP “subscribe” request to subscribe User JID to the Default Rooms.

#### Display User’s Rooms
* App sends getRooms request to Chat server.
* Chat server returns the list of rooms the User is participant/occupant (this works via our custom module at Ejabberd)
* App sends getRoomArchiveStanza request to Chat server for all rooms from the above list. App includes the X last messages parameter within getRoomArchiveStanza to only receive last X messages. 
* Chat server returns X messages for each room.
* App (Mobile or Web client) adds the received messages into Messages array (all new messages for all new rooms). XMPP messages IDs are used for IDs (timestamp with microseconds) in frontend storage as well.
* App displays the Chats List screen showing all rooms User is subscribed to including the last message for each room (including metadata such as timestamp and author). 

#### User enters a Room and receives chat history (messages archive) 
* User taps / clicks on the desired room name. 
* App sends getRoomArchiveStanza for 30 last messages request to Chat server. 
* Chat server returns messages one by one. 
* App displays the received messages.
* User scrolls to view older messages.
* App sends getPaginatedArchive with ID (timestamp) of the last known message.
* Chat server returns another portion of chat history. 

#### User sends a message
* User composes a chat message and sends it via App UI. 
* App forms sendMessage stanza and sends it to Chat server
* Chat server broadcasts this message to all room subscribers including our User
* App displays User’s own message in the Room

#### Push Notifications
* Chat server plugin mod_offline_post checks which Users are offline over 5 minutes for each room. For those who are offline, it calls the Push Service via http request.
* Push Service forms a Push Notification request for each Device of each offline User according to Devices and services subscription table it stores. Push Service sends Push Notifications requests to Apple, Google or other external push notification services according to the Device subscriptions. 
* Offline Users receive push notification messages along with metadata according to their subscriptions, their App and Room settings. Typically they receive an excerpt of the chat message they have missed while being offline. 

### Advanced flows 

#### View Room details
* User clicks on chat Room header while in the room 
* App sends XMPP “getRoomInfo” request.
* Chat server returns the list of all participants (subscribers) of the Room along with their roles
* App displays the total number of Room participants, their detailed list with avatars and names along with roles (such as Owner or Admin, if applicable)
* App checks the XMPP role of the User for current room. If role includes Owner or Admin then App displays “ban” button against room participants where applicable allowing the User to act as Room moderator

#### Create a new Room
* User selects “New Chat” in the App menu.
* User enters Room title, Room description (optional) and uploads a Room photo (optional)
* App sends XMPP “createNewRoom” request to Chat server
* Chat server creates the new Room, assigns User as its Owner and subscribes User to it
* App redirects the User to the list of Rooms showing the newly created Room

#### Messages formats

Currently there are three message types:

* Text message
* Media 
* System message (e.g. coin transferred)

### XMPP stanza contents

#### sendMessageStanza

This is a standard type of stanza for sending most of the messages.

```
sendMessageStanza data content
 const data = {senderFirstName, senderLastName, senderWalletAddress, isSystemMessage, tokenAmount, receiverMessageId, mucName, photoURL, roomJid, isReply, mainMessage, showInChannel, push
    };
```

(here User means the author of the message)

* **senderFirstName**, **senderLastName** - first and last name of the User, to display in chat Room
* **senderWalletAddress** - the wallet address of the User (in Ethereum / EVM format) so that message author can be easily tipped with Coins or receive other transfers directly in the chat Room
* **isSystemMessage** - if this flag is set, App UI will not process this as a standard text message, and will instead process this as a system message. For example, this could be a system message informing others about a Coin transfer from one User to another. Such message will be displayed in a different, more subtle way, in order to not clutter the Room
* **tokenAmount** - the number of tokens received to a specific message. Typically this is used for “tipping” or social ranking mechanism. Users can tap on Messages of other users and tip them with Coins. Message will display a counter of Coins received, similarly to ‘likes’ in social networks
* **receiverMessageId** - this is used in the use case of sending Coins (tokens) to a message e.g. rewarding or ‘liking’ a message of another user. Here we specify the ID of the message that receives our token. App will increment the counter at the receiverMessage. 
* **mucName** - chat Room name to display in Push Notifications
* **photoURL** - location of the User’s avatar picture file
* **roomJid** - shows to which room message is related
* **isReply (boolean)** - will be specified if current message is a reply to another message. In such case, App UI will embed the quote of the original message. TF: we may remove this as now we have ‘mainMessage’ param which covers replies and threads. 
* **mainMessage** - used for threads feature so that new messages related to a thread can be nested under the thread in the UI
* **push** - specifies whether this message should be included in push notifications. Offline users subscribed to the Room will receive push alerts to their devices for those messages that have this parameter enabled. Should be enabled for all standard messages.

Please note we continue below showing the “mainMessage” parameters however it should be noted that the same parameters could be included into message stanza even if it’s not a part of a thread discussion.

Where **mainMessage** can be either undefined or include such fields 
{
  * **text**: string; // the main body (text) of the message 
  * **id**: string; // a unique message ID (based on unix timestamp)
  * **userName**: string; // user name or login name of the User (TF: this may be deprecated since firstName and lastName are used for display purposes now)
  * **createdAt?**: string | number | Date; // when the message was sent 
  * **fileName?**: string; // (optional) for file attachments this is used to display the file name
  * **imageLocation?**: string;  // (optional) for file attachments this is URL of the file itself, typically from our IPFS or Minio buckets based files service
  * **imagePreview?**: string; //  (optional) for file attachments that are pictures and some other supported file types (PDF etc) this will be a path to the preview / thumbnail version of the attachment
  * **mimeType?**: string; // (optional) for file attachments this is the mimeType of the file, so that App interface can display the correct UI and/or icon (e.g. PDF, DOC) for this type of file  
  * **originalName?**: string; // (optional) similar to fileName, but uses full system name of the file attachments including extension etc. TF: either this or fileName may be deprecated.
  * **size?**: string; // (optional) for file attachments this will be used to display the file size so that users can estimate the impact of opening or downloading it
  * **duration?**: string; // (optional) for attachments that are audio or video, this is their duration in seconds to inform the users how long it would take to to play it
  * **waveForm?**: string; // (optional) for attachments that are audio, this will display the waveForm so that users can visually estimate the contents of the record
  * **attachmentId?**: string; // this refers to the file object ID as per /files/ API. This is used to enable actions over the files in certain use cases
  * **wrappable?**: string | boolean; // (optional) this is used for the purposes of digital art and NFT. If enabled, this means users can wrap this content into NFT 
  * **nftId?**: string; // (optional) this is used for the purposes of digital art and NFT. This is used to link content with an NFT collection.
  * **nftActionType?**: string; // (optional) this is used for the purposes of digital art and NFT. This is to inform App interface of what type of actions are available. 
  * **contractAddress?**: string;  // (optional) this is used when messages are linked to smart contracts
  * **roomJid?**: string;  // JID of the current Chat Room. It shows to which room this message is related TF: we might need to deprecate this as we already have room Jid in the main stanza above.
}

#### sendMediaMessageStanza

For developers convenience, this stanza is normally used for sending the media messages such as audio, video etc. This focuses on media specific fields specified below.

**sendMediaMessageStanza** 
```
{senderFirstName, senderLastName, senderWalletAddress, photoURL, location, locationPreview, mimetype, originalName, wrappable, push, mucName, roomJid, receiverMessageId, fileName, size, duration, waveForm, attachmentId}
```

### List of functions

```
subsribe(address: string) {
    const message = xml(
      "iq",
      {
        from: this.client?.jid?.toString(),
        to: address,
        type: "set",
        id: "newSubscription",
      },
      xml(
        "subscribe",
        { xmlns: "urn:xmpp:mucsub:0", nick: this.client?.jid?.getLocal() },
        xml("event", { node: "urn:xmpp:mucsub:nodes:messages" }),
        xml("event", { node: "urn:xmpp:mucsub:nodes:presence" }),
        xml("event", { node: "urn:xmpp:mucsub:nodes:subscribers" }),
        xml("event", { node: "urn:xmpp:mucsub:nodes:subject" })
      )
    );

    this.client.send(message);
  }
```

```
  discoInfo() {
    const message = xml(
      "iq",
      {
        from: this.client?.jid?.toString(),
        to: this.client?.jid?.getDomain(),
        type: "get",
        id: "discover",
      },
      xml("query", { xmlns: "http://jabber.org/protocol/disco#info" })
    );

    this.client.send(message);
  }
```

```
  unsubscribe(address: string) {
    const message = xml(
      "iq",
      {
        from: this.client?.jid?.toString(),
        to: address,
        type: "set",
        id: "unsubscribe",
      },
      xml("unsubscribe", { xmlns: "urn:xmpp:mucsub:0" })
    );

    this.client.send(message);
  }
```

```
  getRooms() {
    const message = xml(
      "iq",
      {
        type: "get",
        from: from
        id: "getUserRooms",
      },
      xml("query", { xmlns: "ns:getrooms" })
    );
    this.client.send(message);
  }
```

```
  getVcard(username: string) {
    if (username !== this.client.jid?.getLocal()) {
      // get other vcard
      const message = xml(
        "iq",
        {
          from: from
          id: "vCardOther",
          to: username + "@" + this.client.jid?.getDomain(),
          type: "get",
        },
        xml("vCard", { xmlns: "vcard-temp" })
      );

      this.client.send(message);
    } else {
      const message = xml(
        "iq",
        {
          from: username + "@" + this.client.jid?.getDomain(),
          id: "vCardMy",
          type: "get",
        },
        xml("vCard", {
          xmlns: "vcard-temp",
        })
      );
      this.client.send(message);
    }
  }
```

```
  presence() {
    this.client.send(xml("presence"));
  }
```


```
  botPresence(room: string) {
    const xmlMsg = xml(
      "presence",
      {
        from: from
        to: `${room}/${this.client.jid?.getLocal()}`,
      },
      xml("x", "http://jabber.org/protocol/muc")
    );
    this.client.send(xmlMsg);
  }
```

```
  roomPresence(room: string) {
    const presence = xml(
      "presence",
      {
        from: from
        to: `${room}/${this.client.jid?.getLocal()}`,
      },
      xml("x", "http://jabber.org/protocol/muc")
    );
    this.client.send(presence);
  }
```

```
  leaveTheRoom(room: string) {
    const presence = xml("presence", {
      from: from
      to: room + "/" + this.client.jid?.getLocal(),
      type: "unavailable",
    });
    this.client.send(presence);
  }
  presenceInRoom(room: string) {
    const presence = xml(
      "presence",
      {
        from: from
        to: room + "/" + this.client.jid?.getLocal(),
        id: "presenceInRoom",
      },
      xml("x", "http://jabber.org/protocol/muc")
    );
    this.client.send(presence);
  }
```

```
  getRoomArchiveStanza(chatJID: string, amount: number) {
    let message = xml(
      "iq",
      {
        type: "set",
        to: chatJID,
        id: "GetArchive",
      },
      xml(
        "query",
        { xmlns: "urn:xmpp:mam:2" },
        xml(
          "set",
          { xmlns: "http://jabber.org/protocol/rsm" },
          xml("max", {}, String(amount)),
          xml("before")
        )
      )
    );
    this.client.send(message);
  }
```

```
  getPaginatedArchive = (
    chatJID: string,
    firstUserMessageID: string,
    amount: number
  ) => {
    if (xmppMessagesHandler.lastMsgId === firstUserMessageID) {
      return;
    }
    xmppMessagesHandler.isGettingMessages = true;
    xmppMessagesHandler.isGettingFirstMessages = true;
    useStoreState.getState().setLoaderArchive(true);
    const message = xml(
      "iq",
      {
        type: "set",
        to: chatJID,
        id: "paginatedArchive",
      },
      xml(
        "query",
        { xmlns: "urn:xmpp:mam:2" },
        xml(
          "set",
          { xmlns: "http://jabber.org/protocol/rsm" },
          xml("max", {}, String(amount)),
          xml("before", {}, firstUserMessageID)
        )
      )
    );
    this.client.send(message);
  };
```

```
  getLastMessageArchive(chat_jid: string) {
    xmppMessagesHandler.isGettingMessages = true;
    let message = xml(
      "iq",
      {
        type: "set",
        to: chat_jid,
        id: "GetArchive",
      },
      xml(
        "query",
        { xmlns: "urn:xmpp:mam:2" },
        xml(
          "set",
          { xmlns: "http://jabber.org/protocol/rsm" },
          xml("max", {}, "1"),
          xml("before")
        )
      )
    );
    this.client.send(message);
  }
```

```
  sendMessage(
    roomJID: string,
    firstName: string,
    lastName: string,
    photo: string,
    walletAddress: string,
    userMessage: string,
    notDisplayedValue?: string
  ) {
    const message = xml(
      "message",
      {
        to: roomJID,
        type: "groupchat",
        id: "sendMessage",
      },
      xml("data", {
        xmlns: SERVICE,
        senderFirstName: firstName,
        senderLastName: lastName,
        photoURL: photo,
        senderJID: from
        senderWalletAddress: walletAddress,
        roomJid: roomJID,
        isSystemMessage: false,
        tokenAmount: 0,
        quickReplies: [],
        notDisplayedValue: notDisplayedValue ? notDisplayedValue : "",
      }),
      xml("body", {}, userMessage)
    );
    this.client.send(message);
  }
```

```
  sendMessageStanza = (roomJID: string, messageText: string, data: any) => {
    const message = xml(
      "message",
      {
        id: "sendMessage",
        type: "groupchat",
        from: from
        to: roomJID,
      },
      xml("body", {}, messageText),
      xml("data", {
        xmlns: SERVICE,

        senderJID: from
        ...data,
      })
    );
    this.client.send(message);
  };
```

```
  sendSystemMessage(
    roomJID: string,
    firstName: string,
    lastName: string,
    walletAddress: string,
    userMessage: string,
    amount: number,
    receiverMessageId: number,
    transactionId: string
  ) {
    const message = xml(
      "message",
      {
        to: roomJID,
        type: "groupchat",
        id: "sendMessage",
      },
      xml("data", {
        xmlns: SERVICE,
        senderFirstName: firstName,
        senderLastName: lastName,
        senderJID: from
        senderWalletAddress: walletAddress,
        roomJid: roomJID,
        isSystemMessage: true,
        tokenAmount: amount,
        receiverMessageId: receiverMessageId,
        transactionId,
      }),
      xml("body", {}, userMessage)
    );
    this.client.send(message);
  }
```


```
  sendMediaMessageStanza(roomJID: string, data: any) {
    const message = xml(
      "message",
      {
        id: "sendMessage",
        type: "groupchat",
        from: from
        to: roomJID,
      },
      xml("body", {}, "media"),
      xml("store", { xmlns: "urn:xmpp:hints" }),
      xml("data", {
        xmlns: SERVICE,
        senderJID: from
        senderFirstName: data.firstName,
        senderLastName: data.lastName,
        senderWalletAddress: data.walletAddress,
        isSystemMessage: false,
        tokenAmount: "0",
        receiverMessageId: "0",
        mucname: data.chatName,
        photoURL: data.userAvatar ? data.userAvatar : "",
        isMediafile: true,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
        fileName: data.fileName,
        isVisible: data.isVisible,
        location: data.location,
        locationPreview: data.locationPreview,
        mimetype: data.mimetype,
        originalName: data.originalName,
        ownerKey: data.ownerKey,
        size: data.size,
        duration: data?.duration,
        updatedAt: data.updatedAt,
        userId: data.userId,
        waveForm: data.waveForm,
        attachmentId: data?.attachmentId,
        wrappable: data?.wrappable,
        nftId: data?.nftId,
        isReply: data?.isReply,
        mainMessage: data?.mainMessage,
        roomJid: data?.roomJid,
      })
    );

    this.client.send(message);
  }
```

```
  createNewRoom(to: string) {
    let message = xml(
      "presence",
      {
        id: "createRoom",
        from: from

        to:
          to +
          CONFERENCEDOMAIN +
          "/" +
          this.client.jid?.toString().split("@")[0],
      },
      xml("x", "http://jabber.org/protocol/muc")
    );
    // console.log(message.toString());
    this.client.send(message);
  }
```

```
  roomConfig(to: string, data: { roomName: string; roomDescription?: string }) {
    const message = xml(
      "iq",
      {
        from: from
        id: "roomConfig",
        to: to + CONFERENCEDOMAIN,
        type: "set",
      },
      xml(
        "query",
        { xmlns: "http://jabber.org/protocol/muc#owner" },
        xml(
          "x",
          { xmlns: "jabber:x:data", type: "submit" },
          xml(
            "field",
            { var: "FORM_TYPE" },
            xml("value", {}, "http://jabber.org/protocol/muc#roomconfig")
          ),
          xml(
            "field",
            { var: "muc#roomconfig_roomname" },
            xml("value", {}, data.roomName)
          ),
          xml(
            "field",
            { var: "muc#roomconfig_roomdesc" },
            xml("value", {}, data.roomDescription)
          )
        )
      )
    );

    this.client.send(message);
  }
```

```
  getArchive = (userJID: string) => {
    let message = xml(
      "iq",
      { type: "set", id: userJID },
      xml(
        "query",
        { xmlns: "urn:xmpp:mam:2", queryid: "userArchive" },
        xml("set", { xmlns: "http://jabber.org/protocol/rsm" }, xml("before"))
      )
    );
    this.client.send(message);
  };
```

```
  sendInvite(from: string, to: string, otherUserId: string) {
    const stanza = xml(
      "message",
      {
        from: this.client.jid?.toString().split("/")[0],
        to: to,
      },
      xml(
        "x",
        "http://jabber.org/protocol/muc#user",
        xml(
          "invite",
          { to: otherUserId + DOMAIN },
          xml("reason", {}, "Hey, this is the place with amazing cookies!")
        )
      )
    );
    this.client.send(stanza);
  }
```

```
  setOwner(to: string) {
    const message = xml(
      "iq",
      {
        to: to + CONFERENCEDOMAIN,
        from: from
        id: "setOwner",
        type: "set",
      },
      xml("query", { xmlns: "http://jabber.org/protocol/muc#owner" })
    );

    this.client.send(message);
  }
```

```
  getRoomInfo = (roomJID: string) => {
    const message = xml(
      "iq",
      {
        from: from
        id: "roomInfo",
        to: roomJID,
        type: "get",
      },
      xml("query", { xmlns: "http://jabber.org/protocol/disco#info" })
    );
    this.client.send(message);
  };
```

```
  getAndReceiveRoomInfo = (roomJID: string) => {
    const message = xml(
      "iq",
      {
        from: from
        id: "roomInfo",
        to: roomJID,
        type: "get",
      },
      xml("query", { xmlns: "http://jabber.org/protocol/disco#info" })
    );
    return this.client.sendReceive(message);
  };
```

```
  isComposing = (walletAddress: string, chatJID: string, fullName: string) => {
    const message = xml(
      "message",
      {
        from: from
        to: chatJID,
        id: "isComposing",
        type: "groupchat",
      },
      xml("composing", {
        xmlns: "http://jabber.org/protocol/chatstates",
      }),
      xml("data", {
        xmlns: SERVICE,
        fullName: fullName,
        manipulatedWalletAddress: walletAddress,
      })
    );
    this.client.send(message);
  };
```

```
  pausedComposing = (walletAddress: string, chatJID: string) => {
    const message = xml(
      "message",
      {
        from: from
        to: chatJID,
        id: "pausedComposing",
        type: "groupchat",
      },
      xml("paused", {
        xmlns: "http://jabber.org/protocol/chatstates",
      }),
      xml("data", {
        xmlns: SERVICE,
        manipulatedWalletAddress: walletAddress,
      })
    );
    this.client.send(message);
  };
```

```
  blacklistUser = (userJIDToBlacklist: string) => {
    const stanza = xml(
      "iq",
      {
        from: from

        type: "set",
        id: "addToBlackList",
      },
      xml("query", {
        xmlns: "ns:deepx:muc:user:block",
        user: userJIDToBlacklist,
      })
    );
    this.client.send(stanza);
  };
```

```
  getBlackList = () => {
    const stanza = xml(
      "iq",
      {
        from: from
        type: "get",
        id: "blackList",
      },
      xml("query", {
        xmlns: "ns:deepx:muc:user:blocklist",
      })
    );
    this.client.send(stanza);
  };
```

```
  getRoomMemberInfo = (roomJID) => {
    const stanza = xml(
      "iq",
      {
        from: from
        type: "get",
        id: "roomMemberInfo",
      },
      xml("query", {
        xmlns: "ns:room:last",
        room: roomJID,
      })
    );
    this.client.send(stanza);
  };
```

```
  changeRoomDescription = (roomJID: string, newDescription: string) => {
    const stanza = xml(
      "iq",
      {
        from: from
        id: "changeRoomDescription",
        to: roomJID,
        type: "set",
      },
      xml(
        "query",
        { xmlns: "http://jabber.org/protocol/muc#owner" },
        xml(
          "x",
          { xmlns: "jabber:x:data", type: "submit" },
          xml(
            "field",
            { var: "FORM_TYPE" },
            xml("value", {}, "http://jabber.org/protocol/muc#roomconfig")
          ),
          xml(
            "field",
            { var: "muc#roomconfig_roomdesc" },
            xml("value", {}, newDescription)
          )
        )
      )
    );

    this.client.send(stanza);
  };
```

```
  changeRoomName = (roomJID: string, newRoomName: string) => {
    console.log(roomJID, newRoomName);
    const stanza = xml(
      "iq",
      {
        from: from
        id: "changeRoomName",
        to: roomJID,
        type: "set",
      },
      xml(
        "query",
        { xmlns: "http://jabber.org/protocol/muc#owner" },
        xml(
          "x",
          { xmlns: "jabber:x:data", type: "submit" },
          xml(
            "field",
            { var: "FORM_TYPE" },
            xml("value", {}, "http://jabber.org/protocol/muc#roomconfig")
          ),
          xml(
            "field",
            { var: "muc#roomconfig_roomname" },
            xml("value", {}, newRoomName)
          )
        )
      )
    );

    this.client.send(stanza);
  };
```

```
  banUserStanza = (banUserId: string, roomJID: string) => {
    const stanza = xml(
      "iq",
      {
        from: from
        type: "set",
        id: "ban",
      },
      xml("query", {
        xmlns: "ns:deepx:muc:user:ban",
        action: "ban",
        user: banUserId,
        type: "room",
        room: roomJID,
        time: "2592000",
        comment: "Ban",
      })
    );

    this.client.send(stanza);
  };
```

```
  unbanUserStanza = (unbanUserId: string, roomJID: string) => {
    const stanza = xml(
      "iq",
      {
        from: from
        type: "set",
        id: "unBan",
      },
      xml("query", {
        xmlns: "ns:deepx:muc:user:ban",
        action: "unban",
        user: unbanUserId,
        type: "room",
        room: roomJID,
      })
    );

    this.client.send(stanza);
  };
```

```
  removeUserFromBlackList = (userAddressToRemoveFromBlacklist: string) => {
    const stanza = xml(
      "iq",
      {
        from: from
        type: "set",
        id: "removeFromBlackList",
      },
      xml("query", {
        xmlns: "ns:deepx:muc:user:unblock",
        user: userAddressToRemoveFromBlacklist,
      })
    );

    this.client.send(stanza);
  };
```

```
  //stanza to edit/replace message.
  sendReplaceMessageStanza = (
    roomJID: string,
    replaceText: string,
    messageId: string,
    data: any
  ) => {
    const stanza = xml(
      "message",
      {
        from: from
        id: "replaceMessage",
        type: "groupchat",
        to: roomJID,
      },
      xml("body", {}, replaceText),
      xml("replace", {
        id: messageId,
        xmlns: "urn:xmpp:message-correct:0",
      }),
      xml("data", {
        xmlns: "http://dev.dxmpp.com",
        senderJID: from
        ...data,
      })
    );
    this.client.send(stanza);
  };
```

```
  //stanza to delete message
  deleteMessageStanza = (roomJid: string, messageId: string) => {
    // <message
    //   from="olek@localhost"
    //   id="1635229272917013"
    //   to="test_olek@conference.localhost"
    //   type="groupchat">
    //   <body>Wow</body>
    //   <delete id="1635229272917013" />
    // </message>;

    const stanza = xml(
      "message",
      {
        from: from
        to: roomJid,
        id: "deleteMessageStanza",
        type: "groupchat",
      },
      xml("body", "wow"),
      xml("delete", {
        id: messageId,
      })
    );

    this.client.send(stanza);
  };
```


