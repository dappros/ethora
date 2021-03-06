import {xml} from '@xmpp/client';
import {autorun, reaction} from 'mobx';
import {showToast} from '../components/Toast/toast';
import {ApiStore} from '../stores/apiStore';
import {CONFERENCEDOMAIN, XMPP_TYPES} from './xmppConstants';
const store = new ApiStore();

let DOMAIN = store.xmppDomains.DOMAIN;
let CONFERENCEDOMAIN_WITHOUT = store.xmppDomains.CONFERENCEDOMAIN_WITHOUT;

export const subscribeStanza = (from: string, to: string, xmpp: any) => {
  const subscribe = xml(
    'iq',
    {
      from: from + '@' + DOMAIN,
      to: to,
      type: 'set',
      id: XMPP_TYPES.newSubscription,
    },
    xml(
      'subscribe',
      {
        xmlns: 'urn:xmpp:mucsub:0',
        nick: from,
      },
      xml('event', {node: 'urn:xmpp:mucsub:nodes:messages'}),
      xml('event', {node: 'urn:xmpp:mucsub:nodes:subject'}),
    ),
  );
  xmpp.send(subscribe);
};

export const presenceStanza = (from: string, to: string, xmpp: any) => {
  const presence = xml(
    'presence',
    {
      from: from + '@' + DOMAIN,
      to: to + '/' + from,
    },
    xml('x', 'http://jabber.org/protocol/muc'),
  );
  xmpp.send(presence);
};
export const getUserRoomsStanza = (
  manipulatedWalletAddress: string,
  xmpp: any,
) => {
  const message = xml(
    'iq',
    {
      type: 'get',
      from: manipulatedWalletAddress + '@' + DOMAIN,
      id: XMPP_TYPES.getUserRooms,
    },
    xml('query', {xmlns: 'ns:getrooms'}),
  );
  xmpp.send(message);
};
/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

//For now only subscibed muc are being fetched
export const sendMessageStanza = (
  from: string,
  to: string,
  messageText: string,
  data: any,
  xmpp: any,
) => {
  const message = xml(
    'message',
    {
      id: XMPP_TYPES.sendMessage,
      type: 'groupchat',
      from: from + '@' + DOMAIN,
      to: to,
    },
    xml('body', {}, messageText),
    xml('data', {
      xmlns: 'http://' + DOMAIN,
      senderJID: from + '@' + DOMAIN,
      ...data,
    }),
  );
  xmpp.send(message);
};

export const sendMediaMessageStanza = async (
  from: string,
  to: string,
  data: any,
  xmpp: any,
) => {
  const message = xml(
    'message',
    {
      id: XMPP_TYPES.sendMessage,
      type: 'groupchat',
      from: from + '@' + DOMAIN,
      to: to,
    },
    xml('body', {}, 'media file'),
    xml('data', {
      xmlns: 'http://' + DOMAIN,
      senderJID: from + '@' + DOMAIN,
      senderFirstName: data.firstName,
      senderLastName: data.lastName,
      senderWalletAddress: data.walletAddress,
      isSystemMessage: false,
      tokenAmount: '0',
      receiverMessageId: '0',
      mucname: data.chatName,
      photoURL: data.userAvatar ? data.userAvatar : '',
      isMediafile: true,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt,
      filename: data.filename,
      isVisible: data.isVisible,
      location: data.location,
      locationPreview: data.locationPreview,
      mimetype: data.mimetype,
      originalname: data.originalname,
      ownerKey: data.ownerKey,
      size: data.size,
      duration: data?.duration,
      updatedAt: data.updatedAt,
      userId: data.userId,
      waveForm: JSON.stringify(data.waveForm),
    }),
  );

  await xmpp.send(message);
};

export const fetchRosterlist = (
  walletAddress: string,
  stanzaId: string,
  xmpp: any,
) => {
  const message = xml(
    'iq',
    {
      from: walletAddress + '@' + DOMAIN,
      to: CONFERENCEDOMAIN_WITHOUT,
      type: 'get',
      id: stanzaId,
    },
    xml('subscriptions', 'urn:xmpp:mucsub:0'),
  );

  xmpp.send(message);
};
export const getPaginatedArchive = (
  chat_jid: string,
  firstUserMessageID: string,
  xmpp: any,
) => {
  let message = xml(
    'iq',
    {
      type: 'set',
      to: chat_jid,
      id: 'GetArchive',
    },
    xml(
      'query',
      {xmlns: 'urn:xmpp:mam:2'},
      xml(
        'set',
        {xmlns: 'http://jabber.org/protocol/rsm'},
        xml('max', {}, 10),
        xml('before', {}, firstUserMessageID),
      ),
    ),
  );
  xmpp.send(message);
};

export const getLastMessageArchive = (chat_jid: string, xmpp: any) => {
  let message = xml(
    'iq',
    {
      type: 'set',
      to: chat_jid,
      id: 'GetArchive',
    },
    xml(
      'query',
      {xmlns: 'urn:xmpp:mam:2'},
      xml(
        'set',
        {xmlns: 'http://jabber.org/protocol/rsm'},
        xml('max', {}, 1),
        xml('before'),
      ),
    ),
  );
  xmpp.send(message);
}

export const subscribeToRoom = (
  roomJID: string,
  manipulatedWalletAddress: string,
  xmpp: any,
) => {
  const message = xml(
    'iq',
    {
      from: manipulatedWalletAddress + '@' + DOMAIN,
      to: roomJID,
      type: 'set',
      id: XMPP_TYPES.newSubscription,
    },
    xml(
      'subscribe',
      {xmlns: 'urn:xmpp:mucsub:0', nick: manipulatedWalletAddress},
      xml('event', {node: 'urn:xmpp:mucsub:nodes:messages'}),
      xml('event', {node: 'urn:xmpp:mucsub:nodes:presence'}),
      xml('event', {node: 'urn:xmpp:mucsub:nodes:subscribers'}),
      xml('event', {node: 'urn:xmpp:mucsub:nodes:subject'}),
    ),
  );

  xmpp.send(message);
};
export const unsubscribeFromChatXmpp = (
  manipulatedWalletAddress: string,
  jid: string,
  xmpp: any,
) => {
  const message = xml(
    'iq',
    {
      from: manipulatedWalletAddress + '@' + DOMAIN,
      to: jid,
      type: 'set',
      id: XMPP_TYPES.unsubscribeFromRoom,
    },
    xml(
      'unsubscribe',
      {
        xmlns: 'urn:xmpp:mucsub:0',
        // nick: nickName,
      },
      xml('event', {node: 'urn:xmpp:mucsub:nodes:messages'}),
      xml('event', {node: 'urn:xmpp:mucsub:nodes:subject'}),
    ),
  );
  xmpp.send(message);
};
export const leaveRoomXmpp = (
  manipulatedWalletAddress: string,
  jid: string,
  username: string,
  xmpp: any,
) => {
  const presence = xml('presence', {
    from: manipulatedWalletAddress + '@' + DOMAIN,
    to: jid + '/' + username,
    type: 'unavailable',
  });
  xmpp.send(presence);
};
export const getRoomArchiveStanza = (chat_jid: string, xmpp: any) => {
  let message = xml(
    'iq',
    {
      type: 'set',
      to: chat_jid,
      id: 'GetArchive',
    },
    xml(
      'query',
      {xmlns: 'urn:xmpp:mam:2'},
      xml(
        'set',
        {xmlns: 'http://jabber.org/protocol/rsm'},
        xml('max', {}, 10),
        xml('before'),
      ),
    ),
  );
  xmpp.send(message);
};
export const get_list_of_subscribers = (
  chat_jid: string,
  walletAddress: string,
  xmpp: any,
) => {
  let message = xml(
    'iq',
    {
      from: walletAddress + '@' + DOMAIN,
      to: chat_jid,
      type: 'get',
      id: XMPP_TYPES.participants,
    },
    xml('subscriptions', 'urn:xmpp:mucsub:0'),
  );
  xmpp.send(message);
};

export const roomConfigurationForm = (
  user_jid: string,
  chat_jid: string,
  roomConfig: any,
  xmpp: any,
) => {
  const message = xml(
    'iq',
    {
      from: user_jid + '@' + DOMAIN,
      id: 'create2',
      to: chat_jid,
      type: 'set',
    },
    xml(
      'query',
      {xmlns: 'http://jabber.org/protocol/muc#owner'},
      xml(
        'x',
        {xmlns: 'jabber:x:data', type: 'submit'},
        xml(
          'field',
          {var: 'FORM_TYPE'},
          xml('value', {}, 'http://jabber.org/protocol/muc#roomconfig'),
        ),
        xml(
          'field',
          {var: 'muc#roomconfig_roomname'},
          xml('value', {}, roomConfig.roomName),
        ),
      ),
    ),
  );

  xmpp.send(message);
};

export const getRoomInfo = (
  walletAddress: string,
  chat_jid: string,
  xmpp: any,
) => {
  const message = xml(
    'iq',
    {
      from: walletAddress + '@' + DOMAIN,
      id: 'roomInfo',
      to: chat_jid,
      type: 'get',
    },
    xml('query', {xmlns: 'http://jabber.org/protocol/disco#info'}),
  );

  xmpp.send(message);
};

export const isComposing = async (
  walletAddress: string,
  chat_jid: string,
  fullName: string,
  xmpp: any,
) => {
  // <message
  // from='bernardo@shakespeare.lit/pda'
  // to='francisco@shakespeare.lit/elsinore'
  // type='chat'>
  //     <composing xmlns='http://jabber.org/protocol/chatstates'/>
  // </message>
  const message = xml(
    'message',
    {
      from: walletAddress + '@' + DOMAIN,
      to: chat_jid,
      id: XMPP_TYPES.isComposing,
      type: 'groupchat',
    },
    xml('composing', {
      xmlns: 'http://jabber.org/protocol/chatstates',
    }),
    xml('data', {
      xmlns: 'http://' + DOMAIN,
      fullName: fullName,
      manipulatedWalletAddress: walletAddress,
    }),
  );

  // setTimeout((, xmpp) => {
  xmpp.send(message);
  // }, 100);
};

export const pausedComposing = async (
  walletAddress: string,
  chat_jid: string,
  xmpp: any,
) => {
  //     <message
  //     from='romeo@montague.net/orchard'
  //     to='juliet@capulet.com/balcony'
  //     type='chat'>
  //   <thread>act2scene2chat1</thread>
  //   <paused xmlns='http://jabber.org/protocol/chatstates'/>

  // </message>
  const message = xml(
    'message',
    {
      from: walletAddress + '@' + DOMAIN,
      to: chat_jid,
      id: XMPP_TYPES.pausedComposing,
      type: 'groupchat',
    },
    xml('paused', {
      xmlns: 'http://jabber.org/protocol/chatstates',
    }),
    xml('data', {
      xmlns: 'http://' + DOMAIN,
      manipulatedWalletAddress: walletAddress,
    }),
  );

  xmpp.send(message);
};

export const activeChatState = async (
  walletAddress: string,
  chat_jid: string,
  xmpp: any,
) => {
  // <message
  //     from='bernardo@shakespeare.lit/pda'
  //     to='francisco@shakespeare.lit/elsinore'
  //     type='chat'>
  // <body>Long live the king!</body>
  // <active xmlns='http://jabber.org/protocol/chatstates'/>
  // </message>

  const message = xml(
    'message',
    {
      from: walletAddress + '@' + DOMAIN,
      to: chat_jid,
      id: XMPP_TYPES.pausedComposing,
      type: 'groupchat',
    },
    xml('active', {
      xmlns: 'http://jabber.org/protocol/chatstates',
    }),
  );

  xmpp.send(message);
};

export const commonDiscover = (
  walletAddress: string,
  chat_jid: string,
  xmpp: any,
) => {
  //     <iq from='romeo@shakespeare.lit/orchard'
  //     id='disco1'
  //     to='juliet@capulet.com/balcony'
  //     type='get'>
  //   <query xmlns='http://jabber.org/protocol/disco#info'/>
  // </iq>

  const message = xml(
    'iq',
    {
      from: walletAddress + '@' + DOMAIN,
      to: chat_jid,
      id: XMPP_TYPES.commonDiscover,
      type: 'get',
    },
    xml('query', {
      xmlns: 'http://jabber.org/protocol/disco#info',
    }),
  );

  xmpp.send(message);
};

export const discoverProfileSupport = (
  walletAddress: string,
  chat_jid: string,
  xmpp: any,
) => {
  //     <iq type='get'
  //     from='hamlet@denmark.lit/elsinore'
  //     to='shakespeare.lit'
  //     id='iq1'>
  //   <profile xmlns='urn:xmpp:tmp:profile'/>
  // </iq>

  const message = xml(
    'iq',
    {
      type: 'get',
      from: walletAddress + '@' + DOMAIN,
      to: chat_jid,
      id: 'iq1',
    },
    xml('profile', {
      xmlns: 'urn:xmpp:tmp:profile',
    }),
  );

  xmpp.send(message);
};

export const discoverChatStates = (
  walletAddress: string,
  chat_jid: string,
  xmpp: any,
) => {
  //     <iq from='juliet@capulet.com/balcony'
  //     id='disco1'
  //     to='romeo@shakespeare.lit/orchard'
  //     type='result'>
  //   <query xmlns='http://jabber.org/protocol/disco#info'>
  //     <feature var='http://jabber.org/protocol/chatstates'/>
  //   </query>
  // </iq>
  // const message = xml('iq',{
  //     'from': walletAddress + '@z.okey.com.ua',
  //     'id': 'disco1'
  // })
};

export const vcardRetrievalRequest = (walletAddress: string, xmpp: any) => {
  //     <iq from='stpeter@jabber.org/roundabout'
  //     id='v1'
  //     type='get'>
  //   <vCard xmlns='vcard-temp'/>
  // </iq>

  const message = xml(
    'iq',
    {
      from: walletAddress + '@' + DOMAIN,
      id: XMPP_TYPES.vCardRequest,
      type: 'get',
    },
    xml('vCard', {
      xmlns: 'vcard-temp',
    }),
  );

  xmpp.send(message);
};

export const updateVCard = (photoURL: string, desc: string, xmpp: any) => {
  const message = xml(
    'iq',
    {
      id: XMPP_TYPES.updateVCard,
      type: 'set',
    },
    xml(
      'vCard',
      {
        xmlns: 'vcard-temp',
      },
      xml('DESC', {}, desc),
      xml('PHOTO', {}, xml('EXTVAL', {}, photoURL)),
    ),
  );
  xmpp.send(message);
};

export const retrieveOtherUserVcard = (
  username: string,
  userJID: string,
  xmpp: any,
) => {
  const message = xml(
    'iq',
    {
      from: username + '@' + DOMAIN,
      id: XMPP_TYPES.otherUserVCardRequest,
      to: userJID + '@' + DOMAIN,
      type: 'get',
    },
    xml('vCard', {xmlns: 'vcard-temp'}),
  );

  xmpp.send(message);
};

export const createNewRoom = (from, to, xmpp) => {
  let message = xml(
    'presence',
    {
      id: XMPP_TYPES.createRoom,
      from: from + '@' + DOMAIN,
      to: to + CONFERENCEDOMAIN + '/' + from,
    },
    xml('x', 'http://jabber.org/protocol/muc'),
  );
  // console.log(message.toString());
  xmpp.send(message);
};

export const setOwner = (from, to, xmpp) => {
  const message = xml(
    'iq',
    {
      to: to + CONFERENCEDOMAIN,
      from: from + '@' + DOMAIN,
      id: XMPP_TYPES.setOwner,
      type: 'get',
    },
    xml('query', {xmlns: 'http://jabber.org/protocol/muc#owner'}),
  );

  xmpp.send(message);
};

export const roomConfig = (from, to, data, xmpp) => {
  const message = xml(
    'iq',
    {
      from: from + '@' + DOMAIN,
      id: XMPP_TYPES.roomConfig,
      to: to + CONFERENCEDOMAIN,
      type: 'set',
    },
    xml(
      'query',
      {xmlns: 'http://jabber.org/protocol/muc#owner'},
      xml(
        'x',
        {xmlns: 'jabber:x:data', type: 'submit'},
        xml(
          'field',
          {var: 'FORM_TYPE'},
          xml('value', {}, 'http://jabber.org/protocol/muc#roomconfig'),
        ),
        xml(
          'field',
          {var: 'muc#roomconfig_roomname'},
          xml('value', {}, data.roomName),
        ),
      ),
    ),
  );

  xmpp.send(message);
};

export const sendInvite = (
  from: string,
  to: string,
  otherUserId: string,
  xmpp: any,
) => {
  const stanza = xml(
    'message',
    {from: from + '@' + DOMAIN, to: to},
    xml(
      'x',
      'http://jabber.org/protocol/muc#user',
      xml(
        'invite',
        {to: otherUserId + '@' + DOMAIN},
        xml('reason', {}, 'Hey, this is the place with amazing cookies!'),
      ),
    ),
  );

  xmpp.send(stanza);
};

export const banUser = (
  to: string,
  from: string,
  bannedUserWalletAddres: string,
  xmpp: any,
) => {
  //   <iq from='kinghenryv@shakespeare.lit/throne'
  //     id='ban1'
  //     to=
  //     type='set'>
  //   <query xmlns='http://jabber.org/protocol/muc#admin'>
  //     <item affiliation='outcast'
  //           jid='earlofcambridge@shakespeare.lit'/>
  //   </query>
  // </iq>
  const message = xml(
    'iq',
    {
      id: 'ban_user',
      to: to,
      from: from + '@' + DOMAIN,
      type: 'set',
    },
    xml(
      'query',
      'http://jabber.org/protocol/muc#owner',
      xml('item', {
        affiliation: 'outcast',
        jid: bannedUserWalletAddres + '@' + DOMAIN,
      }),
    ),
  );
  xmpp.send(message);
};
