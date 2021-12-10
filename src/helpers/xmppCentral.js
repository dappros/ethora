/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import {
  newSubscription,
  subscriptionsStanzaID,
} from '../constants/xmppConstants';
import {
  insertRosterList,
  fetchRosterList as fetchChatListRealm,
  updateRosterList,
} from '../components/realmModels/chatList';
import {insertMessages} from '../components/realmModels/messages';
import {
  fetchRosterlist,
  vcardRetrievalRequest,
  get_list_of_subscribers,
  commonDiscover,
  getRoomInfo,
  updateVCard,
} from './xmppStanzaRequestMessages';
import Toast from 'react-native-simple-toast';
import {Alert} from 'react-native';
import * as types from '../constants/types';
import {joinSystemMessage} from '../components/SystemMessage';

const {client, xml} = require('@xmpp/client');
const debug = require('@xmpp/debug');

let profileDescription = '';
let profilePhoto = '';
let usersLastSeen = {};

export let xmpp;

export const xmppListener = (
  manipulatedWalletAddress,
  updatedRoster,
  initialData,
  updateUserProfile,
  setOtherUserVcard,
  finalMessageArrivalAction,
  participantsUpdateAction,
  updateMessageComposingState,
  setRoles,
  getStoredItems,
  setRosterAction,
  setRecentRealtimeChatAction,
  setOtherUserDetails,
  logOut,
  appDebugMode,
  printLogs,
  DOMAIN,
  CONFERENCEDOMAIN,
) => {
  debug(xmpp, true);
  let rolesMap = {};

  xmpp.on('error', err => {
    // xmpp.reconnect.start();
    if (err.message === 'not-authorized - Invalid username or password') {
      xmpp.stop().catch(console.error);
      Alert.alert(
        'User Not found',
        'User account not found. Please sign in again.',
        [
          {
            text: 'Ok',
            onPress: () => logOut(),
          },
        ],
      );
    }

    if (
      err.message === 'WebSocket ECONNERROR wss://rtc-cc.dappros.com:5443/ws'
    ) {
      xmpp.stop();
    }
    console.log(err.message, 'xmpperror');
  });

  xmpp.on('offline', () => {
    console.log('offline');
  });

  // xmpp.reconnect.start();

  xmpp.reconnect.on('reconnecting', () => {
    // console.log("reconnecting...")
  });

  xmpp.on('stanza', async stanza => {
    printLogs(stanza);
    console.log(stanza, 'stanza');
    let featureList = {};
    if (stanza.is('iq')) {
      if (
        stanza?.children[0]?.attrs?.queryid === 'userArchive' &&
        stanza?.children[0]?.attrs?.complete
      ) {
        console.log(stanza, 'archiveksdlfsdfdsfjsdlfjkls');
        fetchRosterlist(manipulatedWalletAddress, subscriptionsStanzaID);
      }
      if (stanza.attrs.id === 'disco1') {
        stanza.children[0].children.map(item => {
          if (item.name === 'feature') {
            featureList = {...featureList, item};
            if (item.attrs.var === 'http://jabber.org/protocol/chatstates') {
            }
          }
        });
      }
      //capture error
      if (stanza.attrs.type === 'error') {
        let errorMessage = '';
        errorMessage = stanza.children[1].children[1].children[0];
        // alert(errorMessage);
      }
      //capture room info
      if (stanza.attrs.id === 'roomInfo') {
        const roomName = stanza.children[0].children[0].attrs.name;
        const roomJID = stanza.attrs.from;
        let exist = false;
        fetchChatListRealm()
          .then(chatList => {
            if (chatList.length) {
              chatList.map(chat => {
                if (chat.jid === roomJID && chat.name === roomName) {
                  exist = true;
                } else {
                  exist = false;
                }
              });
            } else {
              exist = false;
            }
          })
          .then(() => {
            if (!exist) {
              updateRosterList({jid: roomJID, name: roomName}).then(() => {
                //roasterUpdatedAction
                updatedRoster(true);
              });
            }
          });
      }

      //capture vcard request response
      if (stanza.attrs.id === types.V_CARD_REQUEST) {
        console.log(stanza, 'vcarddddddd');
        if (!stanza.children[0].children.length) {
          profilePhoto = initialData.photo;
          profileDescription = 'No description';
          updateVCard(profilePhoto, profileDescription);
        } else {
          stanza.children[0].children.map(item => {
            if (item.name === 'DESC') {
              profileDescription = item.children[0];
            }
            if (item.name === 'PHOTO') {
              profilePhoto = initialData.photo;
            }
          });
          updateUserProfile({
            desc: profileDescription,
            photoURL: profilePhoto,
          });
        }
      }

      //capture other user Vcard
      if (stanza.attrs.id === types.OTHER_USER_V_CARD_REQUEST) {
        let anotherUserAvatar = '';
        let anotherUserDescription = '';
        stanza.children[0].children.map(item => {
          if (item.name === 'DESC') {
            anotherUserDescription = item.children[0];
          }
          if (item.name === 'PHOTO') {
            anotherUserAvatar = item.children[0].children[0];
          }
        });
        setOtherUserVcard({
          anotherUserAvatar,
          anotherUserDescription,
        });
      }

      if (stanza.attrs.id === types.UPDATE_VCARD) {
        if (stanza.attrs.type === 'result') {
          vcardRetrievalRequest(manipulatedWalletAddress);
        }
      }

      if (stanza.attrs.type === 'error') {
        console.log(stanza.children[1].children[1].children[0]);
      }

      //capture fin event, which comes after final message of the archived list has come
      if (stanza.attrs.id === 'GetArchive') {
        if (stanza.children[0].name === 'fin') {
          console.log('finevent', stanza);
          finalMessageArrivalAction(true);
        }
      }

      //capture participants of subscribed room
      if (stanza.attrs.id === 'participants') {
        const chat_jid = stanza.attrs.from;
        const numberOfParticipants = stanza.children[0].children.length;
        let exist = false;
        fetchChatListRealm()
          .then(chatList => {
            if (chatList.length) {
              chatList.map(chat => {
                if (chat.participants === numberOfParticipants) {
                  exist = true;
                } else {
                  exist = false;
                }
              });
            } else {
              exist = false;
            }
          })
          .then(() => {
            if (!exist) {
              updateRosterList({
                jid: chat_jid,
                participants: numberOfParticipants,
              }).then(() => {
                participantsUpdateAction(true);
              });
            }
          });
      }
    }

    if (stanza.is('presence')) {
      //catch when "you have joined too many conference issue"
      if (stanza.attrs.type === 'error') {
        console.log(
          stanza.children[1].children[1].children[0],
          'fdsmlfnsdddsdffslfmn',
        );
        // stanza.children[1].children[1].children[0] ===
        //   'You have been banned from this room' &&
        //   Alert.alert(' You have been banned from this room');
        if (stanza.children[1].attrs.code === '500') {
          console.log(stanza.children[1].children[1].children[0], 'xmpperrorr');
          xmpp.reconnect.stop();
        }
      }
      if (stanza.attrs.id === 'roomPresence') {
        let roomJID = stanza.attrs.from.split('/')[0];
        let userJID = stanza.attrs.from.split('/')[1];

        let role = stanza.children[0].children[0].attrs.role;
        rolesMap[roomJID] = role;
        // usersLastSeen[userJID] = moment().format('DD hh:mm');
        await setOtherUserDetails({
          anotherUserLastSeen: usersLastSeen,
        });
        setRoles(rolesMap);
      }

      if (stanza.attrs.id === 'CreateRoom') {
        if (stanza.children[1] !== undefined) {
          if (stanza.children[1].children[1].attrs.code === '201') {
            Toast.show('Room created successfully', Toast.LONG);
            fetchRosterlist(manipulatedWalletAddress, subscriptionsStanzaID);
          }

          if (stanza.children[1].children[1].attrs.code === '110') {
            Toast.show('Room joined successfully', Toast.LONG);
            fetchRosterlist(manipulatedWalletAddress, subscriptionsStanzaID);
          }
        }
      }
    }

    if (stanza.name === 'message') {
      //capture message composing
      if (
        stanza?.children[0]?.children[0]?.children[0]?.children[2]?.children[0]
          ?.name === 'invite'
      ) {
        let jid =
          stanza?.children[0]?.children[0]?.children[0]?.children[3]?.attrs
            ?.jid;
        console.log(jid, 'messageforвапвminvid');
        const subscribe = xml(
          'iq',
          {
            from: manipulatedWalletAddress + '@' + DOMAIN,
            to: jid,
            type: 'set',
            id: 'inviteFromArchive',
          },
          xml(
            'subscribe',
            {
              xmlns: 'urn:xmpp:mucsub:0',
              nick: manipulatedWalletAddress,
            },
            xml('event', {node: 'urn:xmpp:mucsub:nodes:messages'}),
            xml('event', {node: 'urn:xmpp:mucsub:nodes:subject'}),
          ),
        );

        xmpp.send(subscribe);
        const presence = xml(
          'presence',
          {
            from: manipulatedWalletAddress + '@' + DOMAIN,
            to: jid + '/' + manipulatedWalletAddress,
          },
          xml('x', 'http://jabber.org/protocol/muc'),
        );
        xmpp.send(presence);
      }
      if (stanza?.children[2]?.children[0]?.name === 'invite') {
        console.log(stanza, 'invite');

        const jid = stanza.children[3].attrs.jid;
        // console.log(jid, 'dsfjkdshjfksdu439782374')
        const subscribe = xml(
          'iq',
          {
            from: manipulatedWalletAddress + '@' + DOMAIN,
            to: jid,
            type: 'set',
            id: newSubscription,
          },
          xml(
            'subscribe',
            {
              xmlns: 'urn:xmpp:mucsub:0',
              nick: manipulatedWalletAddress,
            },
            xml('event', {node: 'urn:xmpp:mucsub:nodes:messages'}),
            xml('event', {node: 'urn:xmpp:mucsub:nodes:subject'}),
          ),
        );

        xmpp.send(subscribe);
      }

      if (stanza.attrs.id === types.IS_COMPOSING) {
        const mucRoom = stanza.attrs.from.split('/')[0];
        console.log('captured');

        const fullName = stanza.children[1].attrs.fullName;
        const manipulatedWalletAddress =
          stanza.children[1].attrs.manipulatedWalletAddress;
        await updateMessageComposingState({
          state: true,
          username: fullName,
          manipulatedWalletAddress,
          mucRoom,
        });
      }

      //capture message composing pause
      if (stanza.attrs.id === types.PAUSED_COMPOSING) {
        console.log('pause');
        const mucRoom = stanza.attrs.from.split('/')[0];
        const manipulatedWalletAddress =
          stanza.children[1].attrs.manipulatedWalletAddress;
        await updateMessageComposingState({
          state: false,
          manipulatedWalletAddress,
          mucRoom,
        });
      }
      if (stanza?.children[2]?.children[0]?.name === 'invite') {
        console.log(stanza, 'invite');

        const jid = stanza.children[3].attrs.jid;
        // console.log(jid, 'dsfjkdshjfksdu439782374')
        const subscribe = xml(
          'iq',
          {
            from: manipulatedWalletAddress + '@' + DOMAIN,
            to: jid,
            type: 'set',
            id: newSubscription,
          },
          xml(
            'subscribe',
            {
              xmlns: 'urn:xmpp:mucsub:0',
              nick: manipulatedWalletAddress,
            },
            xml('event', {node: 'urn:xmpp:mucsub:nodes:messages'}),
            xml('event', {node: 'urn:xmpp:mucsub:nodes:subject'}),
          ),
        );

        xmpp.send(subscribe);
        fetchRosterlist(manipulatedWalletAddress, subscriptionsStanzaID);
      }

      //capture archived message of a room
      if (stanza.children[0].attrs.xmlns === 'urn:xmpp:mam:2') {
        const singleMessageDetailArray =
          stanza.children[0].children[0].children[0].children;
        let _id = stanza.children[0].children[0].children[0].attrs.from; // message owner id
        const roomName = stanza.attrs.from; //the jid of room
        let user_name = _id.replace(roomName + '/', '');
        let _messageId = ''; //message id
        let text = ''; //the message text sent by the owner
        let isSystemMessage = 'false';
        let messageObject = {};
        let tokenAmount = 0;
        let receiverMessageId = '';
        let userAvatar = '';
        let isMediafile = false;
        let imageLocation = '';
        let imageLocationPreview = '';
        let mimetype = '';
        let size = '';
        let duration = '';
        let waveForm = '';
        await singleMessageDetailArray.forEach(item => {
          if (item.name === 'body') {
            text = item.children[0];
          }
          if (item.name === 'archived') {
            _messageId = item.attrs.id;
          }
          if (item.name === 'data') {
            user_name =
              item.attrs.senderFirstName + ' ' + item.attrs.senderLastName;
            _id = item.attrs.senderJID;
            isSystemMessage = item.attrs.isSystemMessage
              ? item.attrs.isSystemMessage
              : isSystemMessage;
            tokenAmount = item.attrs.tokenAmount
              ? parseInt(item.attrs.tokenAmount)
              : tokenAmount;
            receiverMessageId = item.attrs.receiverMessageId
              ? item.attrs.receiverMessageId
              : receiverMessageId;

            userAvatar = item.attrs.photoURL ? item.attrs.photoURL : null;

            isMediafile = item.attrs.isMediafile === 'true' ? true : false;

            imageLocation = item.attrs.location;

            imageLocationPreview =
              item.attrs.locationPreview || item.attrs.location;
            waveForm = item.attrs.waveForm;
            mimetype = item.attrs.mimetype;
            console.log(item, '3202394023-49-23');
            duration = item.attrs.duration;

            size = item.attrs.size;
          }
        });

        if (isSystemMessage === 'false') {
          if (isMediafile) {
            messageObject = {
              _id: _messageId,
              text: '',
              createdAt: new Date(parseInt(_messageId.substring(0, 13))),
              system: false,
              user: {
                _id,
                name: user_name,
                avatar: userAvatar !== 'false' ? userAvatar : null,
              },
              image:
                mimetype === 'application/pdf'
                  ? 'https://image.flaticon.com/icons/png/128/174/174339.png'
                  : imageLocationPreview,
              realImageURL: imageLocation,
              localURL: '',
              isStoredFile: false,
              mimetype: mimetype,
              size: size,
              duration,
              waveForm,
            };
          } else {
            messageObject = {
              _id: _messageId,
              text,
              createdAt: new Date(parseInt(_messageId.substring(0, 13))),
              system: false,
              user: {
                _id,
                name: user_name,
                avatar: userAvatar !== 'false' ? userAvatar : null,
              },
            };
          }
        }
        if (isSystemMessage === 'true') {
          messageObject = {
            _id: _messageId,
            text,
            createdAt: new Date(parseInt(_messageId.substring(0, 13))),
            system: true,
          };
        }

        if (receiverMessageId) {
          insertMessages(
            messageObject,
            roomName,
            tokenAmount,
            receiverMessageId,
          );
        }
      }
    }

    //when default rooms are just subscribed, this function will send presence to them and fetch it again to display in chat home screen
    if (stanza.attrs.id === newSubscription) {
      const presence = xml(
        'presence',
        {
          from: manipulatedWalletAddress + '@' + DOMAIN,
          to: stanza.attrs.from + '/' + manipulatedWalletAddress,
        },
        xml('x', 'http://jabber.org/protocol/muc'),
      );
      xmpp.send(presence);
      fetchRosterlist(manipulatedWalletAddress, subscriptionsStanzaID);
    }

    //To capture the response for list of rosters (for now only subscribed muc)
    if (stanza.attrs.id === subscriptionsStanzaID) {
      const rosterFromXmpp = stanza.children[0].children;
      let rosterListArray = [];
      let rosterMap = await getStoredItems();

      let nonMemberchat = {
        name: 'f6b35114579afc1cb5dbdf5f19f8dac8971a90507ea06083932f04c50f26f1c5',
        exist: false,
      };

      rosterFromXmpp.map(item => {
        //check if the default rooms already subscribed, if not then subscibe it
        const rosterObject = {
          name: 'Loading...',
          jid: item.attrs.jid,
          participants: 0,
          avatar: 'https://placeimg.com/140/140/any',
          counter: 0,
          lastUserText: '',
          lastUserName: '',
          createdAt: new Date(),
          // pri
        };

        if (item.attrs.jid.split(CONFERENCEDOMAIN)[0] === nonMemberchat.name) {
          nonMemberchat.exist = true;
        }
        let exist = false;
        fetchChatListRealm()
          .then(chatListFromRealm => {
            if (chatListFromRealm.length) {
              chatListFromRealm.map(chat => {
                if (!!rosterMap) {
                  rosterObject.priority = rosterMap[item.attrs.jid];
                  // console.log(rosterMap[item.attrs.jid], rosterObject, 'helsdflosdkhjfskdfjh')
                  insertRosterList(rosterObject);
                }

                // if(chat.jid === item.attrs.jid){
                //   exist = true;
                // }else{
                //   exist = false;
                // }
              });
            } else {
              exist = false;
            }
          })
          .then(() => {
            if (!exist) {
              insertRosterList(rosterObject);
              rosterListArray.push(rosterObject);
            }
          });

        //presence is sent to every contact in roster
        const presence = xml(
          'presence',
          {
            id: 'roomPresence',
            from: manipulatedWalletAddress + '@' + DOMAIN,
            to: item.attrs.jid + '/' + manipulatedWalletAddress,
          },
          // xml('data', {
          //   senderName: this.props.loginReducer.initialData.firstName + ' ' + this.props.loginReducer.initialData.lastName
          // }),
          xml('x', 'http://jabber.org/protocol/muc'),
        );

        xmpp.send(presence);
        let message = joinSystemMessage({
          username: initialData.firstName + ' ' + initialData.lastName,
        });
        // this.submitMessage(message, item.attrs.jid);
        get_list_of_subscribers(item.attrs.jid, manipulatedWalletAddress);
        setTimeout(function () {
          getRoomInfo(manipulatedWalletAddress, item.attrs.jid);
        }, 2000);
      });

      if (!nonMemberchat.exist) {
        const subscribe = xml(
          'iq',
          {
            from: manipulatedWalletAddress + '@' + DOMAIN,
            to: nonMemberchat.name + CONFERENCEDOMAIN,
            type: 'set',
            id: newSubscription,
          },
          xml(
            'subscribe',
            {
              xmlns: 'urn:xmpp:mucsub:0',
              nick: manipulatedWalletAddress,
            },
            xml('event', {node: 'urn:xmpp:mucsub:nodes:messages'}),
            xml('event', {node: 'urn:xmpp:mucsub:nodes:subject'}),
          ),
        );

        xmpp.send(subscribe);
      }

      setRosterAction(rosterListArray);
    }

    //to capture realtime incoming message
    if (stanza.attrs.id === 'sendMessage') {
      if (
        stanza.children[0].attrs &&
        stanza.children[0].attrs.xmlns === 'urn:xmpp:mam:tmp'
      ) {
        let text = ''; //the text message
        let _id = ''; //the id of the sender
        let user_name = '';
        let _messageId = ''; //the id of the message
        let roomName = '';
        let isSystemMessage = 'false';
        let tokenAmount = 0;
        let receiverMessageId = '';
        let messageObject = {};
        let userAvatar = '';
        let isMediafile = false;
        let imageLocation = '';
        let imageLocationPreview = '';
        let mimetype = '';
        let duration = '';
        let size = '';
        let waveForm = '';
        stanza.children.map(item => {
          if (item.name === 'body') {
            text = item.children[0];
          }

          if (item.name === 'archived') {
            _messageId = item.attrs.id;
            roomName = item.attrs.by;
          }

          if (item.name === 'data') {
            user_name =
              item.attrs.senderFirstName + ' ' + item.attrs.senderLastName;

            _id = item.attrs.senderJID;

            isSystemMessage = item.attrs.isSystemMessage
              ? item.attrs.isSystemMessage
              : isSystemMessage;

            tokenAmount = item.attrs.tokenAmount
              ? parseInt(item.attrs.tokenAmount)
              : tokenAmount;

            receiverMessageId = item.attrs.receiverMessageId
              ? item.attrs.receiverMessageId
              : receiverMessageId;

            userAvatar = item.attrs.photoURL ? item.attrs.photoURL : null;

            isMediafile = item.attrs.isMediafile === 'true' ? true : false;

            imageLocation = item.attrs.location;

            imageLocationPreview =
              item.attrs.locationPreview || item.attrs.location;
            console.log(item, '2349u0234920384293084');
            mimetype = item.attrs.mimetype;
            duration = item.attrs.duration;
            waveForm = item.attrs.waveForm;

            size = item.attrs.size;
          }
        });

        if (isSystemMessage === 'false') {
          if (isMediafile) {
            messageObject = {
              _id: _messageId,
              text: '',
              createdAt: new Date(parseInt(_messageId.substring(0, 13))),
              system: false,
              user: {
                _id,
                name: user_name,
                avatar: userAvatar !== 'false' ? userAvatar : null,
              },
              image:
                mimetype === 'application/pdf'
                  ? 'https://image.flaticon.com/icons/png/128/174/174339.png'
                  : imageLocationPreview,
              realImageURL: imageLocation,
              localURL: '',
              isStoredFile: false,
              mimetype: mimetype,
              duration,
              size: size,
              waveForm,
            };
          } else {
            messageObject = {
              _id: _messageId,
              text,
              createdAt: new Date(parseInt(_messageId.substring(0, 13))),
              system: false,
              user: {
                _id,
                name: user_name,
                avatar: userAvatar !== 'false' ? userAvatar : null,
              },
            };
          }
        }
        if (isSystemMessage === 'true') {
          messageObject = {
            _id: _messageId,
            text,
            createdAt: new Date(parseInt(_messageId.substring(0, 13))),
            system: true,
          };
        }
        if (receiverMessageId) {
          setRecentRealtimeChatAction(
            messageObject,
            roomName,
            true,
            tokenAmount,
            receiverMessageId,
          );
        }
      }
    }
  });

  xmpp.on('online', async address => {
    xmpp.reconnect.delay = 2000;
    xmpp.send(xml('presence'));

    fetchRosterlist(manipulatedWalletAddress, subscriptionsStanzaID);

    commonDiscover(manipulatedWalletAddress, DOMAIN);
    vcardRetrievalRequest(manipulatedWalletAddress);
  });
};

export const xmppConnect = (walletAddress, password, DOMAIN, SERVICE) => {
  xmpp = client({
    service: SERVICE,
    domain: DOMAIN,
    username: walletAddress,
    password: password,
  });
  xmpp.start();
};
