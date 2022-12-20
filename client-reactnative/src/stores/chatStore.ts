import {client, xml} from '@xmpp/client';
import {format} from 'date-fns';
import {makeAutoObservable, runInAction, toJS} from 'mobx';
import {
  defaultChatBackgroundTheme,
  defaultChats,
  IMetaRoom,
  metaRooms,
} from '../../docs/config';
import {
  addChatRoom,
  getChatRoom,
  getRoomList,
} from '../components/realmModels/chatList';
import {
  getAllMessages,
  insertMessages,
  updateMessageToWrapped,
  updateNumberOfReplies,
  updateTokenAmount,
} from '../components/realmModels/messages';
import {showToast} from '../components/Toast/toast';
import {httpPost} from '../config/apiService';
import {asyncStorageConstants} from '../constants/asyncStorageConstants';
import {asyncStorageGetItem} from '../helpers/cache/asyncStorageGetItem';
import {asyncStorageSetItem} from '../helpers/cache/asyncStorageSetItem';
import {createMessageObject} from '../helpers/chat/createMessageObject';
import {playCoinSound} from '../helpers/chat/playCoinSound';
import {underscoreManipulation} from '../helpers/underscoreLogic';
import {
  getBlackList,
  getRoomInfo,
  getUserRoomsStanza,
  presenceStanza,
  subscribeStanza,
  subscribeToRoom,
  updateVCard,
  vcardRetrievalRequest,
} from '../xmpp/stanzas';
import {XMPP_TYPES} from '../xmpp/xmppConstants';
import {RootStore} from './context';
const ROOM_KEYS = {
  official: 'official',
  private: 'private',
  groups: 'groups',
};

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
  isFavourite?: boolean;
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

interface replyProps {
  messageID: string;
  message: string;
  isReply: boolean;
}

interface roomMemberInfoProps {
  ban_status: string;
  jid: string;
  last_active: string;
  name: string;
  profile: string;
  role: string;
}

export interface BlackListUser {
  userJid: string;
  date: number;
  name: string;
}

export class ChatStore {
  messages: any = [];
  xmpp: any = null;
  xmppError: any = '';
  roomList: roomListProps | [] = [];
  stores: RootStore | {} = {};
  roomsInfoMap: any = {isUpdated: 0};
  chatLinkInfo: any = {};
  blackList: BlackListUser[] = [];
  allMessagesArrived: boolean = false;
  metaRooms: IMetaRoom[] = [];
  recentRealtimeChat: recentRealtimeChatProps = {
    createdAt: undefined,
    message_id: '',
    room_name: '',
    text: '',
    system: false,
    shouldUpdateChatScreen: false,
  };
  shouldCount: boolean = true;
  roomRoles = {};
  isOnline = false;
  showMetaNavigation = false;

  isLoadingEarlierMessages = false;
  activeChats = ROOM_KEYS.official;
  isComposing: isComposingProps = {
    state: false,
    username: '',
    manipulatedWalletAddress: '',
    chatJID: '',
  };
  listOfThreads = [];
  roomMemberInfo = [];
  unreadMessagesForGroups = {
    [ROOM_KEYS.official]: 0,
    [ROOM_KEYS.private]: 0,
    [ROOM_KEYS.groups]: 0,
  };
  backgroundTheme = defaultChatBackgroundTheme;
  selectedBackgroundIndex = 0;

  constructor(stores: RootStore) {
    makeAutoObservable(this);
    this.stores = stores;
  }

  toggleShouldCount = (value: boolean) => {
    runInAction(() => {
      this.shouldCount = value;
    });
  };
  toggleMetaNavigation = (value: boolean) => {
    runInAction(() => {
      this.showMetaNavigation = value;
    });
  };

  changeBackgroundTheme = (index: number) => {
    runInAction(() => {
      this.backgroundTheme = defaultChatBackgroundTheme;
      if (index != -1) {
        this.backgroundTheme[index].isSelected = true;
      }
      this.selectedBackgroundIndex = index;
    });
  };

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
      this.roomRoles = {};
      this.isComposing = {
        state: false,
        username: '',
        manipulatedWalletAddress: '',
        chatJID: '',
      };
      this.listOfThreads = [];
      this.backgroundTheme = defaultChatBackgroundTheme;
      this.selectedBackgroundIndex = 0;
    });
  };

  setRoomRoles = (jid: string, role: string) => {
    runInAction(() => {
      this.roomRoles[jid] = role;
    });
  };

  xmppConnect = (username: string, password: string) => {
    runInAction(() => {
      this.xmpp = client({
        service: this.stores.apiStore.xmppDomains.SERVICE,
        domain: this.stores.apiStore.xmppDomains.DOMAIN,
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

  setUnreadMessages = (unreadMessagesObject: any) => {
    runInAction(() => {
      this.unreadMessagesForGroups = unreadMessagesObject;
    });
  };

  updateCounter = () => {
    const notificationsCount: Record<string, number> = {
      official: 0,
      private: 0,
      groups: 0,
    };
    this.roomList?.forEach(item => {
      const splitedJid = item?.jid?.split('@')[0];
      if (item.participants < 3 && !defaultChats[splitedJid]) {
        notificationsCount[ROOM_KEYS.private] +=
          this.roomsInfoMap[item.jid]?.counter || 0;
      }

      if (
        defaultChats[splitedJid] ||
        this.roomsInfoMap[item.jid]?.isFavourite
      ) {
        notificationsCount[ROOM_KEYS.official] +=
          this.roomsInfoMap[item.jid]?.counter || 0;
      }

      if (item.participants > 2 && !defaultChats[splitedJid]) {
        notificationsCount[ROOM_KEYS.groups] +=
          this.roomsInfoMap[item.jid]?.counter || 0;
      }
    });
    this.setUnreadMessages(notificationsCount);
  };
  updateRoomInfo = async (jid: string, data: any) => {
    runInAction(() => {
      this.roomsInfoMap[jid] = {...this.roomsInfoMap[jid], ...data};
      if (data?.isFavourite !== undefined) {
        this.roomsInfoMap.isUpdated += 1;
      }
    });
    await asyncStorageSetItem(
      asyncStorageConstants.roomsListHashMap,
      this.roomsInfoMap,
    );
  };
  changeActiveChats = (type: string) => {
    runInAction(() => {
      this.activeChats = type;
    });
  };

  addMessage = (message: any) => {
    if (!this.messages.some(msg => msg._id === message._id)) {
      runInAction(() => {
        this.messages.push(message);
      });
    }
  };

  addThreadMessage = (message: any) => {
    runInAction(() => {
      this.listOfThreads.push(message);
    });
  };
  addRoom = (room: any) => {
    runInAction(() => {
      this.roomList.push(room);
    });
  };
  setRooms = async (roomsArray: any) => {
    const rooms = await this.checkMetaRooms(roomsArray);
    runInAction(() => {
      this.roomList = rooms;
    });
  };

  updateMessageReplyNumbers = (messageId: any) => {
    const messages = toJS(this.messages);
    const index = messages.findIndex(item => item._id === messageId);
    if (index !== -1) {
      const message = {
        ...JSON.parse(JSON.stringify(messages[index])),
        ['numberOfReplies']: messages[index]['numberOfReplies'] + 1,
      };

      runInAction(() => {
        this.messages[index] = message;
      });
    }
  };

  updateMessageProperty = (messageId, property, value) => {
    const messages = toJS(this.messages);
    const index = messages.findIndex(item => item._id === messageId);

    if (index !== -1) {
      const message = {
        ...JSON.parse(JSON.stringify(messages[index])),
        [property]:
          property === 'tokenAmount' || 'numberOfReplies'
            ? messages[index][property] + value
            : value,
      };
      runInAction(() => {
        this.messages[index] = message;
      });
    }
  };

  updateBadgeCounter = (roomJid: string, type: 'CLEAR' | 'UPDATE') => {
    this.roomList.map((item: any, index: number) => {
      if (item.jid === roomJid) {
        if (type === 'CLEAR') {
          runInAction(() => {
            item.counter = 0;
            this.roomsInfoMap[roomJid].counter = 0;
          });
        }
        if (type === 'UPDATE') {
          runInAction(() => {
            item.counter++;
            this.roomsInfoMap[roomJid].counter = item.counter;
          });
        }
      }
    });
    this.updateCounter();
  };

  updateMessageComposingState = (props: isComposingProps) => {
    runInAction(() => {
      this.isComposing = props;
    });
  };

  updateAllRoomsInfo = async () => {
    let map = {isUpdated: 0};
    this.roomList.forEach(item => {
      const latestMessage = this.messages
        .filter(message => item.jid === message.roomJid)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0];

      if (latestMessage) {
        map[latestMessage?.roomJid] = {
          ...this.roomsInfoMap[latestMessage?.roomJid],

          lastUserName: latestMessage?.user.name,
          lastUserText: latestMessage?.text,
          muted: this.roomsInfoMap[item.jid]?.muted,

          lastMessageTime: latestMessage.createdAt,
        };
      }
      if (!latestMessage) {
        map[item.jid] = this.roomsInfoMap[item.jid];
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
  setChatMessagesLoading = value => {
    runInAction(() => {
      this.isLoadingEarlierMessages = value;
    });
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
  subscribeToMetaRooms = async () => {
    const cachedRooms = await asyncStorageGetItem('metaRooms');
    const allRooms = cachedRooms || metaRooms;
    if (allRooms) {
      allRooms.forEach(room => {
        subscribeToRoom(
          room.idAddress + this.stores.apiStore.xmppDomains.CONFERENCEDOMAIN,
          underscoreManipulation(
            this.stores.loginStore.initialData.walletAddress,
          ),
          this.xmpp,
        );
      });
    }
  };
  checkMetaRooms = async (rooms = []) => {
    const roomsCopy = rooms;
    const roomJids = roomsCopy.map(item => item.jid.split('@')[0]);
    try {
      const body = {jids: roomJids};
      const res = await httpPost(
        this.stores.apiStore.defaultUrl + '/room/check-for-meta-room',
        body,
        this.stores.loginStore.userToken,
      );
      for (const item of res.data.results) {
        const roomIndex = roomsCopy.findIndex(
          r => r.jid.split('@')[0] === item,
        );
        if (roomIndex !== -1) {
          roomsCopy[roomIndex].meta = true;
        }
      }
      return roomsCopy;
    } catch (error) {
      console.log(error);
      return rooms;
    }
  };
  xmppListener = async () => {
    let archiveRequestedCounter = 0;
    const xmppUsername = underscoreManipulation(
      this.stores.loginStore.initialData.walletAddress,
    );
    // xmpp.reconnect.start();
    this.xmpp.on('stanza', async (stanza: any) => {
      //capture room info
      if (stanza.attrs.id === 'roomInfo') {
        const featureList = stanza.children[0].children.find(
          item => item.attrs.xmlns === 'jabber:x:data',
        );
        this.updateRoomInfo(stanza.attrs.from, {
          roomDescription: featureList.children.find(
            item => item.attrs.var === 'muc#roominfo_description',
          ).children[0].children[0],
        });
        runInAction(() => {
          this.chatLinkInfo[stanza.attrs.from] =
            stanza.children[0].children[0].attrs.name;
        });
      }

      if (stanza.attrs.id === XMPP_TYPES.changeRoomDescription) {
        const walletAddress = stanza.attrs.to.split('@')[0];
        getRoomInfo(walletAddress, stanza.attrs.from, this.xmpp);
        showToast('success', 'Success', 'Description changed', 'top');
      }

      if (stanza.attrs.id === XMPP_TYPES.setRoomImage) {
        console.log(
          stanza.children[0].attrs,
          stanza.children[0].children,
          stanza,
        );
        getUserRoomsStanza(xmppUsername, this.xmpp);
        showToast('success', 'Success', 'Chat icon set successfully', 'bottom');
      }

      if (stanza.attrs.id === XMPP_TYPES.setRoomBackgroundImage) {
        console.log(
          stanza.children[0].attrs,
          stanza.children[0].children,
          stanza,
        );
        getUserRoomsStanza(xmppUsername, this.xmpp);
        showToast(
          'success',
          'Success',
          'Chat background set successfully',
          'bottom',
        );
      }

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
        stanza.attrs.id === XMPP_TYPES.paginatedArchive &&
        stanza.children[0].name === 'fin'
      ) {
        runInAction(() => {
          this.isLoadingEarlierMessages = false;
        });
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
        const {photo, firstName, lastName} = this.stores.loginStore.initialData;
        let fullName = firstName + ' ' + lastName;
        let profilePhoto = photo;
        let profileDescription = 'No description';
        if (!stanza.children[0].children.length) {
          updateVCard(photo, profileDescription, fullName, this.xmpp);
        } else {
          stanza.children[0].children.map((item: any) => {
            if (item.name === 'DESC') {
              profileDescription = item.children[0];
            }
            if (item.name === 'URL') {
              profilePhoto = item.children[0];
            }
            if(item.name === 'FN') {
              fullName = item.children[0]
            }
          });
          this.stores.loginStore.updateUserPhotoAndDescription(
            profilePhoto,
            profileDescription,
          );

          this.stores.loginStore.updateUserName(
            fullName
          );
        }
      }

      if (stanza.attrs.id === XMPP_TYPES.roomMemberInfo) {
        if (stanza.children[0].children.length) {
          runInAction(() => {
            this.roomMemberInfo = stanza.children[0].children.map(
              item => item.attrs,
            );
          });
        }
      }

      if (stanza.attrs.id === XMPP_TYPES.roomPresence) {
        let roomJID = stanza.attrs.from.split('/')[0];
        let userJID = stanza.attrs.from.split('/')[1];

        let role = stanza.children[1].children[0].attrs.role;
        this.setRoomRoles(roomJID, role);
      }

      if (stanza.attrs.id === XMPP_TYPES.updateVCard) {
        if (stanza.attrs.type === 'result') {
          vcardRetrievalRequest(xmppUsername, this.xmpp);
        }
      }

      //to catch error
      if (stanza.attrs.type === 'error') {
        stanza.children.filter(item => {
          if (item.name === 'error') {
            console.log(item.children, 'stanza error==============');
            item.children.filter(subItem => {
              if (subItem.name === 'text') {
                console.log(subItem.children[0]);
                if (subItem.children[0] === 'You are banned in this room!') {
                  showToast(
                    'error',
                    'Banned!',
                    'You have been banned from this room.',
                    'top',
                  );
                }
                if (subItem.children[0] === 'Traffic rate limit is exceeded') {
                  showToast(
                    'error',
                    'XMPP: Too much traffic!',
                    'Traffic rate limit is exceeded',
                    'top',
                  );
                }
              }
            });
          }
        });
      }

      // if(stanza.attrs.id === XMPP_TYPES.getBannedUserListOfRoom){
      //   console.log(stanza.children[0].children, 'banned user list of a room')
      // }

      if (stanza.attrs.id === XMPP_TYPES.ban) {
        console.log(stanza.children[0].children, 'dfsdsdsdsd');
        if (stanza.children[0].children[0].attrs.status === 'success') {
          showToast('success', 'Success', 'User banned!', 'top');
        }
      }

      if (stanza.attrs.id === XMPP_TYPES.createRoom) {
        getUserRoomsStanza(xmppUsername, this.xmpp);
      }

      if (stanza.attrs.id === 'activity') {
        console.log(stanza.children[0].children, 'activityyyy');
      }

      if (stanza.attrs.id === XMPP_TYPES.roomConfig) {
        // console.log(stanza,"roooooom config")
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
            roomThumbnail:
              item.attrs.room_thumbnail === 'none'
                ? ''
                : item.attrs.room_thumbnail,
            roomBackground:
              item.attrs.room_background === 'none'
                ? ''
                : item.attrs.room_background,
          };

          presenceStanza(xmppUsername, item.attrs.jid, this.xmpp);
          getChatRoom(item.attrs.jid).then(cachedChat => {
            if (!cachedChat) {
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
        await this.setRooms(roomsArray);
        // await AsyncStorage.setItem('roomsArray', JSON.stringify(roomsArray));
      }
      if (stanza.attrs.id === XMPP_TYPES.getBlackList) {
        const blackList = stanza.children[0].children.map(item => ({
          userJid: item.attrs.user,
          date: +item.attrs.date * 1000,
          name: item.attrs.fullname,
        }));
        runInAction(() => {
          this.blackList = blackList;
        });
      }
      if (
        stanza.attrs.id === XMPP_TYPES.addToBlackList ||
        stanza.attrs.id === XMPP_TYPES.removeFromBlackList
      ) {
        getBlackList(xmppUsername, this.xmpp);
      }
      if (stanza.attrs.id === XMPP_TYPES.deleteMessage) {
        console.log(stanza.children, '1');
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

          const message = createMessageObject(singleMessageDetailArray);

          // const threadIndex = this.listOfThreads.findIndex(item => item.mainMessageId === message._id);
          // if(threadIndex != -1){
          //   // alert(threadIndex)
          //   const threadMessage = {
          //     ...JSON.parse(JSON.stringify(this.listOfThreads[threadIndex]))
          //   };

          //   this.addMessage(threadMessage);
          //   await insertMessages(threadMessage);
          //   this.listOfThreads.splice(threadIndex,1);
          //   message.numberOfReplies = message.numberOfReplies + 1;
          // }

          // console.log(threadsOfCurrentMessage,"dsagfdskmsldvmcs")

          const messageAlreadyExist = this.messages.findIndex(
            x => x._id === message._id,
          );
          if (messageAlreadyExist === -1) {
            if (
              this.blackList.find(item => item.userJid === message.user._id)
                ?.userJid
            ) {
              return;
            }

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

            if (message.isReply) {
              const threadIndex = this.listOfThreads.findIndex(
                item => message._id === item._id,
              );
              if (threadIndex === -1) {
                this.addThreadMessage(message);
              }
            }

            const threadsOfCurrentMessage = this.listOfThreads.filter(
              (item: any) => item.mainMessageId === message._id,
            );

            if (threadsOfCurrentMessage) {
              message.numberOfReplies = threadsOfCurrentMessage.length;
            }
            await insertMessages(message);
            this.addMessage(message);
          }
        }

        if (stanza.attrs.id === XMPP_TYPES.sendMessage) {
          const messageDetails = stanza.children;
          const message = createMessageObject(messageDetails);
          if (
            this.blackList.find(item => item.userJid === message.user._id)
              ?.userJid
          ) {
            console.log('finded user');
            return;
          }
          if (this.shouldCount) {
            this.updateBadgeCounter(message.roomJid, 'UPDATE');
          }
          this.addMessage(message);

          this.updateRoomInfo(message.roomJid, {
            lastUserText: message?.text,
            lastUserName: message?.user?.name,
            lastMessageTime: message?.createdAt,
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
          if (message.isReply) {
            this.updateMessageProperty(
              message.mainMessageId,
              'numberOfReplies',
              1,
            );
            await updateNumberOfReplies(message.mainMessageId);
          }
          await insertMessages(message);
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
      this.subscribeToMetaRooms();
      getBlackList(xmppUsername, this.xmpp);
      vcardRetrievalRequest(xmppUsername, this.xmpp);
      getUserRoomsStanza(xmppUsername, this.xmpp);
    });
  };
}
