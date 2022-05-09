import {client, xml} from '@xmpp/client';
import { action, makeAutoObservable, runInAction} from 'mobx';
import { insertRosterList } from '../components/realmModels/chatList';
import { insertMessages } from '../components/realmModels/messages';
import {asyncStorageConstants} from '../constants/asyncStorageConstants';
import {asyncStorageGetItem} from '../helpers/asyncStorageGetItem';
import {createMessageObject} from '../helpers/createMessageObject';
import { underscoreManipulation } from '../helpers/underscoreLogic';
import {
  getUserRoomsStanza,
  presenceStanza,
  subscribeStanza,
  subscribeToRoom,
  updateVCard,
  vcardRetrievalRequest,
} from '../xmpp/stanzas';
import {DOMAIN, SERVICE, XMPP_TYPES} from '../xmpp/xmppConstants';
import { RootStore } from './context';

interface recentRealtimeChatProps{
  avatar?:string,
  createdAt:any,
  message_id:string,
  name?:string,
  room_name:string,
  text:string,
  user_id?:string,
  system:boolean,
  shouldUpdateChatScreen:boolean,
  mimetype?:string,
  tokenAmount?:string,
  image?:string,
  realImageURL?:string,
  isStoredFile?:boolean,
  size?:string,
  duration?:any,
  waveForm?:any,
}

interface roomListProps{
  name: string,
  participants: number,
  avatar: string,
  jid: string,
  counter: number,
  lastUserText: string,
  lastUserName: string,
  createdAt: string,
  priority?: number,
  muted?: boolean,
}
export class ChatStore {
  messages:any = [];
  xmpp:any = null;
  xmppError:any = '';
  roomList:any = [];
  stores:RootStore;
  roomsInfoMap:any = {};
  allMessagesArrived:boolean = false;
  recentRealtimeChat:recentRealtimeChatProps = {
    createdAt: undefined,
    message_id: '',
    room_name: '',
    text: '',
    system: false,
    shouldUpdateChatScreen: false
  }
  shouldCount:boolean = true
  roomRoles = []

  constructor(stores:RootStore) {
    makeAutoObservable(this);
    this.stores = stores;
  }

  setInitialState=action(()=>{
    this.messages = [];
    this.xmpp = [];
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
      shouldUpdateChatScreen: false
    }
    this.roomRoles=[]
  })

  toggleShouldCount = action((value:boolean) => {
    this.shouldCount = value
  })

  setRoomRoles = action((data:any)=>{
    this.roomRoles = data
  })

  xmppConnect = (username:string, password:string) => {
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
  updateRoomInfo = (jid:string, data:any) => {
    runInAction(() => {
      this.roomsInfoMap[jid] = {...this.roomsInfoMap[jid], ...data};
    });
  };

  addMessage = (message:any) => {
    runInAction(() => {
      this.messages.push(message);
    });
  };
  addRoom = (room:any) => {
    runInAction(() => {
      this.roomList.push(room);
    });
  };
  setRooms = (roomsArray:any) => {
    runInAction(() => {
      this.roomList = roomsArray;
    });
  };

  setRecentRealtimeChatAction = (
    messageObject:any,
    roomName:string,
    shouldUpdateChatScreen:boolean,
    tokenAmount:string,
    receiverMessageId:string
  ) => {
    insertMessages(
      messageObject,
      roomName,
      tokenAmount,
      receiverMessageId
    );

    if (messageObject.system) {
      this.recentRealtimeChat.createdAt = messageObject.createdAt;
      this.recentRealtimeChat.message_id = messageObject._id;
      this.recentRealtimeChat.room_name = roomName;
      this.recentRealtimeChat.text = messageObject.text;
      this.recentRealtimeChat.system = true;
      this.recentRealtimeChat.shouldUpdateChatScreen = shouldUpdateChatScreen;
      this.recentRealtimeChat.tokenAmount = tokenAmount
    }
    if (!messageObject.system) {

       this.recentRealtimeChat.avatar = messageObject.user.avatar;
       this.recentRealtimeChat.createdAt = messageObject.createdAt;
       this.recentRealtimeChat.message_id = messageObject._id;
       this.recentRealtimeChat.name = messageObject.user.name;
       this.recentRealtimeChat.room_name = roomName;
       this.recentRealtimeChat.text = messageObject.text;
       this.recentRealtimeChat.system = false;
       this.recentRealtimeChat.mimetype = messageObject.mimetype;

       this.recentRealtimeChat.image = messageObject.image;
       this.recentRealtimeChat.realImageURL = messageObject.realImageURL;
       this.recentRealtimeChat.isStoredFile = messageObject.isStoredFile;
       this.recentRealtimeChat.size = messageObject.size;
       this.recentRealtimeChat.duration = messageObject.duration;

       this.recentRealtimeChat.waveForm = messageObject.waveForm;
       this.recentRealtimeChat.user_id = messageObject.user._id;
       this.recentRealtimeChat.shouldUpdateChatScreen = shouldUpdateChatScreen;
    }

  }

  xmppListener = async () => {
    const xmppUsername = this.stores.loginStore.initialData.xmppUsername;
    // xmpp.reconnect.start();
    this.xmpp.on('stanza', async (stanza:any) => {
      if (stanza.attrs.id === XMPP_TYPES.otherUserVCardRequest) {
        let anotherUserAvatar = '';
        let anotherUserDescription = '';
        stanza.children[0].children.map((item:any) => {
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
      if (stanza.attrs.id === XMPP_TYPES.vCardRequest) {
        let profilePhoto = this.stores.loginStore.initialData.photo;
        let profileDescription = 'No description';
        if (!stanza.children[0].children.length) {
          updateVCard(profilePhoto, profileDescription, this.xmpp);
        } else {
          stanza.children[0].children.map((item:any) => {
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
      if (
        stanza.attrs.id === XMPP_TYPES.createRoom &&
        stanza.children[1] !== undefined &&
        (stanza.children[1].children[1].attrs.code === '110' ||
          stanza.children[1].children[1].attrs.code === '201')
      ) {
        getUserRoomsStanza(xmppUsername, this.xmpp);
      }
      if (stanza.attrs.id === XMPP_TYPES.getUserRooms) {
        const roomsArray:any = [];
        const rosterFromXmpp = stanza.children[0].children;
        rosterFromXmpp.forEach((item:any) => {
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
          presenceStanza(
            xmppUsername,
            item.attrs.jid,
            this.xmpp,
          );
          subscribeToRoom(
            item.attrs.jid,
            xmppUsername,
            this.xmpp,
          );
          this.updateRoomInfo(item.attrs.jid, {
            name: item.attrs.name,
            participants: +item.attrs.users_cnt,
          });
          roomsArray.push(rosterObject);

          //insert the list of rooms in realm
          // insertRosterList(rosterObject);
        });
        this.setRooms(roomsArray);
        // await AsyncStorage.setItem('roomsArray', JSON.stringify(roomsArray));
      }
      if (stanza.name === 'message') {
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
          // console.log(jid, 'dsfjkdshjfksdu439782374')
          subscribeStanza(xmppUsername, jid, this.xmpp);
        }

        if (stanza?.children[2]?.children[0]?.name === XMPP_TYPES.invite) {
          const jid = stanza.children[3].attrs.jid;
          // console.log(jid, 'dsfjkdshjfksdu439782374')
          subscribeStanza(xmppUsername, jid, this.xmpp);
          getUserRoomsStanza(xmppUsername, this.xmpp);
        }

        //capture archived message of a room
        if (stanza.children[0].attrs.xmlns === 'urn:xmpp:mam:2') {
          const singleMessageDetailArray =
            stanza.children[0].children[0].children[0].children;

          const roomJID = stanza.attrs.from
          const message = createMessageObject(singleMessageDetailArray);
          if (message.system) {
            const messageIndexToUpdate = this.messages.findIndex(
              item => item._id === message.receiverMessageId,
            );
            runInAction(() => {
              this.messages[messageIndexToUpdate].tokenAmount =
                message.tokenAmount;
            });
          }
          const messageAlreadyExist = this.messages.findIndex(
            x => x._id === message._id,
          );
          if (messageAlreadyExist === -1) {
            this.addMessage(message);
            // if(message.receiverMessageId){
            //   insertMessages(
            //     message,
            //     roomJID,
            //     parseInt(message.tokenAmount),
            //     message.receiverMessageId
            //   )
            // }
          }
        }

        if (
          stanza.attrs.id === XMPP_TYPES.sendMessage
          // stanza.children[0].attrs.xmlns === 'urn:xmpp:mam:tmp'
        ) {
          const messageDetails = stanza.children;
          const message = createMessageObject(messageDetails);

          this.addMessage(message);
        }

        //when default rooms are just subscribed, this function will send presence to them and fetch it again to display in chat home screen
        if (stanza.attrs.id === XMPP_TYPES.newSubscription) {
          presenceStanza(
            xmppUsername,
            stanza.attrs.from,
            this.xmpp,
          );
        }

        //To capture the response for list of rosters (for now only subscribed muc)

        //to capture realtime incoming message
      }
    });

    this.xmpp.on('online', async address => {
      this.xmpp.reconnect.delay = 2000;
      this.xmpp.send(xml('presence'));
      getUserRoomsStanza(xmppUsername, this.xmpp);

      // commonDiscover(xmppUsername, DOMAIN, this.xmpp);
      vcardRetrievalRequest(xmppUsername, this.xmpp);
    });
  };
}
