import {client, xml} from '@xmpp/client';
import {format} from 'date-fns';
import {
  action,
  isObservableObject,
  makeAutoObservable,
  runInAction,
  toJS,
} from 'mobx';
import {Toast} from 'native-base';
import {defaultChats} from '../../docs/config';
import {
  addChatRoom,
  getChatRoom,
  getRoomList,
  insertRosterList,
} from '../components/realmModels/chatList';
import {
  getAllMessages,
  insertMessages,
  queryRoomAllMessages,
  updateMessageToWrapped,
  updateTokenAmount,
} from '../components/realmModels/messages';
import {showToast} from '../components/Toast/toast';
import {asyncStorageConstants} from '../constants/asyncStorageConstants';
import {asyncStorageGetItem} from '../helpers/cache/asyncStorageGetItem';
import {asyncStorageSetItem} from '../helpers/cache/asyncStorageSetItem';
import {createMessageObject} from '../helpers/chat/createMessageObject';
import {playCoinSound} from '../helpers/chat/playCoinSound';
import {underscoreManipulation} from '../helpers/underscoreLogic';
import {
  getLastMessageArchive,
  getUserRoomsStanza,
  presenceStanza,
  subscribeStanza,
  subscribeToRoom,
  updateVCard,
  vcardRetrievalRequest,
} from '../xmpp/stanzas';
import {
  CONFERENCEDOMAIN,
  DOMAIN,
  SERVICE,
  XMPP_TYPES,
} from '../xmpp/xmppConstants';
import {RootStore} from './context';

interface recentRealtimeChatProps {
  avatar?: string;
  createdAt: any;
  message_id: string;
  name?: string;
  room_name: string;
  text: string;
  user_id?: string;
  system: boolean;
  shouldUpdateChatScreen: boolean;
  mimetype?: string;
  tokenAmount?: string;
  image?: string;
  realImageURL?: string;
  isStoredFile?: boolean;
  size?: string;
  duration?: any;
  waveForm?: any;
}

interface roomListProps {
  name: string;
  participants: number;
  avatar: string;
  jid: string;
  counter: number;
  lastUserText: string;
  lastUserName: string;
  createdAt: string;
  priority?: number;
  muted?: boolean;
}

interface isComposingProps {
  state: boolean;
  username: string;
  manipulatedWalletAddress: string;
  chatJID: string;
}

interface defaultChatProps {
  name: string;
  premiumOnly: boolean;
  stickyOrder: boolean;
  removable: boolean;
}

export class ChatStore {
  messages: any = [];
  xmpp: any = null;
  xmppError: any = '';
  roomList: roomListProps | [] = [];
  stores: RootStore | {} = {};
  roomsInfoMap: any = {};
  allMessagesArrived: boolean = false;
  recentRealtimeChat: recentRealtimeChatProps = {
    createdAt: undefined,
    message_id: '',
    room_name: '',
    text: '',
    system: false,
    shouldUpdateChatScreen: false,
  };
  shouldCount: boolean = true;
  roomRoles = [];
  isOnline = false;
  isComposing: isComposingProps = {
    state: false,
    username: '',
    manipulatedWalletAddress: '',
    chatJID: '',
  };

  constructor(stores: RootStore) {
    makeAutoObservable(this);
    this.stores = stores;
  }

  toggleShouldCount = action((value: boolean) => {
    runInAction(() => {
      this.shouldCount = value;
    });
  });

  setInitialState = () => {
    runInAction(() => {
      this.messages = [];
      this.xmpp = null;
      this.xmppError = '';
      this.roomList = [];
      this.roomsInfoMap = {};
      this.allMessagesArrived = false;
      this.recentRealtimeChat = {
        createdAt: undefined,
        message_id: '',
        room_name: '',
        text: '',
        system: false,
        shouldUpdateChatScreen: false,
      };
      this.shouldCount = true;
      this.roomRoles = [];
      this.isComposing = {
        state: false,
        username: '',
        manipulatedWalletAddress: '',
        chatJID: '',
      };
    });
  };

  setRoomRoles = action((data: any) => {
    this.roomRoles = data;
  });

  xmppConnect = (username: string, password: string) => {
    runInAction(() => {
      this.xmpp = client({
        service: SERVICE,
        domain: DOMAIN,
        username,
        password,
      });
    });
    this.xmpp.start().catch(console.log);
  };
  getRoomsFromCache = async () => {
    try {
      const rooms: roomListProps = await getRoomList();
      runInAction(() => {
        this.roomList = rooms;
      });
    } catch (error) {}
  };
  getCachedMessages = async () => {
    const messages = await getAllMessages();
    runInAction(() => {
      this.messages = messages;
    });
  };
  getCachedRoomsInfo = async () => {
    const res = await asyncStorageGetItem(
      asyncStorageConstants.roomsListHashMap,
    );
    if (res) {
      runInAction(() => {
        this.roomsInfoMap = res;
      });
    }
  };

  updateRoomInfo = async (jid: string, data: any) => {
    runInAction(() => {
      this.roomsInfoMap[jid] = {...this.roomsInfoMap[jid], ...data};
    });
    await asyncStorageSetItem(
      asyncStorageConstants.roomsListHashMap,
      this.roomsInfoMap,
    );
  };

  addMessage = (message: any) => {
    runInAction(() => {
      this.messages.push(message);
    });
  };
  addRoom = (room: any) => {
    runInAction(() => {
      this.roomList.push(room);
    });
  };
  setRooms = (roomsArray: any) => {
    runInAction(() => {
      this.roomList = roomsArray;
    });
  };
  updateMessageProperty = (messageId, property, value) => {
    const messages = toJS(this.messages);
    const index = messages.findIndex(item => item._id === messageId);

    if (index !== -1) {
      const message = {
        ...JSON.parse(JSON.stringify(messages[index])),
        [property]:
          property === 'tokenAmount'
            ? messages[index][property] + value
            : value,
      };
      runInAction(() => {
        this.messages[index] = message;
      });
    }
  };

  updateBadgeCounter = action((roomJid: string, type: 'CLEAR' | 'UPDATE') => {
    this.roomList.map((item: any, index: number) => {
      if (item.jid === roomJid) {
        if (type === 'CLEAR') {
          runInAction(() => {
            return (item.counter = 0);
          });
        }
        if (type === 'UPDATE') {
          console.log(item);
          item.counter = item.counter + 1;
        }
      }
    });
  });

  updateMessageComposingState = (props: isComposingProps) => {
    runInAction(() => {
      this.isComposing = props;
    });
  };

  updateAllRoomsInfo = async () => {
    let map = {};
    this.roomList.forEach(item => {
      const latestMessage = this.messages
        .filter(message => item.jid === message.roomJid)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )[0];
      if (latestMessage) {
        map[latestMessage?.roomJid] = {
          name: item.name,
          archiveRequested: false,
          lastUserName: latestMessage?.user.name,
          lastUserText: latestMessage?.text,
          lastMessageTime:
            latestMessage.createdAt && format(latestMessage.createdAt, 'hh:mm'),
        };
      }
    });
    runInAction(() => {
      this.roomsInfoMap = map;
    });
    await asyncStorageSetItem(
      asyncStorageConstants.roomsListHashMap,
      this.roomsInfoMap,
    );
  };

  subscribeToDefaultChats = () => {
    Object.entries(defaultChats).forEach(([key, value]) => {
      const jid = key + this.stores.apiStore.xmppDomains.CONFERENCEDOMAIN;
      const manipulatedWalletAddress = underscoreManipulation(
        this.stores.loginStore.initialData.walletAddress,
      );
      subscribeToRoom(jid, manipulatedWalletAddress, this.xmpp);
    });
  };

  xmppListener = async () => {
    let archiveRequestedCounter = 0;
    const xmppUsername = underscoreManipulation(
      this.stores.loginStore.initialData.walletAddress,
    );
    // xmpp.reconnect.start();
    this.xmpp.on('stanza', async (stanza: any) => {
      this.stores.debugStore.addLogsXmpp(stanza);
      if (stanza.attrs.id === XMPP_TYPES.otherUserVCardRequest) {
        let anotherUserAvatar = '';
        let anotherUserDescription = '';
        stanza.children[0].children.map((item: any) => {
          if (item.name === 'DESC') {
            anotherUserDescription = item.children[0];
          }
          if (item.name === 'PHOTO') {
            anotherUserAvatar = item.children[0].children[0];
          }
        });
        this.stores.otherUserStore.setDataFromVCard(
          anotherUserDescription,
          anotherUserAvatar,
        );
      }
      if (
        stanza.attrs.id === 'GetArchive' &&
        stanza.children[0].name === 'fin'
      ) {
        archiveRequestedCounter += 1;
        if (archiveRequestedCounter === this.roomList.length) {
          this.updateAllRoomsInfo();
        }
        this.getCachedMessages();
      }

      if (stanza.attrs.id === XMPP_TYPES.vCardRequest) {
        let profilePhoto = this.stores.loginStore.initialData.photo;
        let profileDescription = 'No description';
        if (!stanza.children[0].children.length) {
          updateVCard(profilePhoto, profileDescription, this.xmpp);
        } else {
          stanza.children[0].children.map((item: any) => {
            if (item.name === 'DESC') {
              profileDescription = item.children[0];
            }
            // if (item.name === 'PHOTO') {
            //   profilePhoto = initialData.photo;
            // }
          });
          this.stores.loginStore.updateUserPhotoAndDescription(
            profilePhoto,
            profileDescription,
          );
        }
      }

      if (stanza.attrs.id === XMPP_TYPES.roomPresence) {
        let roomJID = stanza.attrs.from.split('/')[0];
        let userJID = stanza.attrs.from.split('/')[1];

        let role = stanza.children[0].children[0].attrs.role;
        let rolesMap = [];
        rolesMap[roomJID] = role;
        // usersLastSeen[userJID] = moment().format('DD hh:mm');
        // setOtherUserDetails({
        //   anotherUserLastSeen: usersLastSeen,
        // });
        this.setRoomRoles(rolesMap);
      }

      if (stanza.attrs.id === XMPP_TYPES.updateVCard) {
        if (stanza.attrs.type === 'result') {
          vcardRetrievalRequest(xmppUsername, this.xmpp);
        }
      }

      //to catch error
      if (stanza.attrs.type === 'error') {
        console.log(stanza.children, 'stanzaerror-------');
      }

      if (stanza.attrs.id === XMPP_TYPES.createRoom) {
        getUserRoomsStanza(xmppUsername, this.xmpp);
      }

      if (stanza.attrs.id === XMPP_TYPES.getUserRooms) {
        const roomsArray: any = [];
        const rosterFromXmpp = stanza.children[0].children;
        rosterFromXmpp.forEach((item: any) => {
          const rosterObject = {
            name: item.attrs.name,
            jid: item.attrs.jid,
            participants: +item.attrs.users_cnt,
            avatar: 'https://placeimg.com/140/140/any',
            counter: 0,
            lastUserText: '',
            lastUserName: '',
            createdAt: new Date(),
            priority: 0,
          };

          presenceStanza(xmppUsername, item.attrs.jid, this.xmpp);

          getChatRoom(item.attrs.jid).then(cachedChat => {
            if (!cachedChat?.jid) {
              addChatRoom(rosterObject);
              this.updateRoomInfo(item.attrs.jid, {
                name: item.attrs.name,
                participants: +item.attrs.users_cnt,
              });
            }
            if (
              cachedChat?.jid &&
              (+cachedChat.participants !== +item.attrs.users_cnt ||
                cachedChat.name !== item.attrs.name)
            ) {
              this.updateRoomInfo(item.attrs.jid, {
                name: item.attrs.name,
                participants: +item.attrs.users_cnt,
              });
            }
          });

          roomsArray.push(rosterObject);

          //insert the list of rooms in realm
          // insertRosterList(rosterObject);
        });
        this.setRooms(roomsArray);
        console.log('rooms called');
        // await AsyncStorage.setItem('roomsArray', JSON.stringify(roomsArray));
      }
      if (stanza.is('iq') && stanza.attrs.id === XMPP_TYPES.newSubscription) {
        presenceStanza(xmppUsername, stanza.attrs.from, this.xmpp);
        const room = await getChatRoom(stanza.attrs.from);
        if (!room) {
          getUserRoomsStanza(xmppUsername, this.xmpp);
        }
      }
      if (stanza.is('message')) {
        //capture message composing
        if (
          stanza?.children[0]?.children[0]?.children[0]?.children[2]
            ?.children[0]?.name === 'invite'
        ) {
          let jid =
            stanza?.children[0]?.children[0]?.children[0]?.children[3]?.attrs
              ?.jid;
          subscribeStanza(xmppUsername, jid, this.xmpp);
          presenceStanza(xmppUsername, jid, this.xmpp);
        }
        if (stanza?.children[2]?.children[0]?.name === 'invite') {
          const jid = stanza.children[3].attrs.jid;
          subscribeStanza(xmppUsername, jid, this.xmpp);
        }

        if (stanza?.children[2]?.children[0]?.name === XMPP_TYPES.invite) {
          const jid = stanza.children[3].attrs.jid;
          subscribeStanza(xmppUsername, jid, this.xmpp);
          getUserRoomsStanza(xmppUsername, this.xmpp);
        }

        //capture archived message of a room
        if (stanza.children[0].attrs.xmlns === 'urn:xmpp:mam:2') {
          const singleMessageDetailArray =
            stanza.children[0].children[0].children[0].children;

          const roomJID = stanza.attrs.from;
          const message = createMessageObject(singleMessageDetailArray);

          if (message.system) {
            if (message?.contractAddress) {
              await updateMessageToWrapped(message.receiverMessageId, {
                nftId: message.nftId,
                contractAddress: message.contractAddress,
              });
            }
            await updateTokenAmount(
              message.receiverMessageId,
              message.tokenAmount,
            );
          }
          const messageAlreadyExist = this.messages.findIndex(
            x => x._id === message._id,
          );
          if (messageAlreadyExist === -1) {
            this.addMessage(message);
            insertMessages(message);
          }
        }

        if (stanza.attrs.id === XMPP_TYPES.sendMessage) {
          const messageDetails = stanza.children;
          const message = createMessageObject(messageDetails);
          if (this.shouldCount) {
            this.updateBadgeCounter(message.roomJid, 'UPDATE');
          }
          this.addMessage(message);

          this.updateRoomInfo(message.roomJid, {
            lastUserText: message?.text,
            lastUserName: message?.user?.name,
            messageTime:
              message?.createdAt && format(message?.createdAt, 'hh:mm'),
          });
          if (message.system) {
            if (message?.contractAddress) {
              await updateMessageToWrapped(message.receiverMessageId, {
                nftId: message.nftId,
                contractAddress: message.contractAddress,
              });
              this.updateMessageProperty(
                message.receiverMessageId,
                'nftId',
                message.nftId,
              );
            }
            this.updateMessageProperty(
              message.receiverMessageId,
              'tokenAmount',
              message.tokenAmount,
            );
            await updateTokenAmount(
              message.receiverMessageId,
              message.tokenAmount,
            );
            playCoinSound(message.tokenAmount);
          }
          insertMessages(message);
        }

        //capture message composing
        if (stanza.attrs.id === XMPP_TYPES.isComposing) {
          const chatJID = stanza.attrs.from.split('/')[0];

          const fullName = stanza.children[1].attrs.fullName;
          const manipulatedWalletAddress =
            stanza.children[1].attrs.manipulatedWalletAddress;
          this.updateMessageComposingState({
            state: true,
            username: fullName,
            manipulatedWalletAddress,
            chatJID,
          });
        }

        //capture message composing paused
        if (stanza.attrs.id === XMPP_TYPES.pausedComposing) {
          const chatJID = stanza.attrs.from.split('/')[0];
          const manipulatedWalletAddress =
            stanza.children[1].attrs.manipulatedWalletAddress;
          this.updateMessageComposingState({
            state: false,
            manipulatedWalletAddress,
            chatJID,
            username: '',
          });
        }
      }
    });

    this.xmpp.on('online', async address => {
      this.xmpp.reconnect.delay = 2000;
      this.xmpp.send(xml('presence'));
      this.subscribeToDefaultChats();
      runInAction(() => {
        this.isOnline = true;
      });
      getUserRoomsStanza(xmppUsername, this.xmpp);
      vcardRetrievalRequest(xmppUsername, this.xmpp);
    });
  };
}
