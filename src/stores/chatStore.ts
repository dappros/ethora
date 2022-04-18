import {makeAutoObservable} from 'mobx';
import { insertMessages } from '../components/realmModels/messages';

export class ChatStore{
    chatRoomDetails= {
        chat_id: <string>'',
        chat_name: <string>'',
    };
    isRoom= false;
    rosterList= [];
    recentRealtimeChat= {
    avatar: '',
    createdAt: '',
    message_id: '',
    name: '',
    room_name: '',
    text: '',
    user_id: '',
    system: false,
    shouldUpdateChatScreen: true,
    mimetype: '',
    };
    archivesRequested= {};

    finalMessageArrived= false;
    shouldCount= true;
    participantsUpdate= false;
    isRosterUpdated= false;
    tokenAmountUpdate= false;
    pushData= {msgId: '', mucId: ''};
    isComposing= {state: false, username: ''};
    roomRoles= {};
    stores= {};

    constructor(stores:any){
        makeAutoObservable(this);
        this.stores = stores
    }


    

    setRecentRealtimeChatAction(
        messageObject: { system: boolean; createdAt: any; _id: any; text: any; user: { avatar: any; name: any; _id: any; }; mimetype: any; image: any; realImageURL: any; isStoredFile: any; size: any; duration: any; waveForm: any; },
        roomName: any,
        shouldUpdateChatScreen: any,
        tokenAmount: any,
        receiverMessageId: any,
    ){
        insertMessages(
            messageObject,
            roomName,
            tokenAmount,
            receiverMessageId
        );
        
        let recentRealtimeChat =<any> {};
        
        //if system message then create object with corresponding values
        if(messageObject.system){
            recentRealtimeChat = {
                createdAt: messageObject.createdAt,
                message_id: messageObject._id,
                room_name: roomName,
                text: messageObject.text,
                system: true,
                shouldUpdateChatScreen,
                tokenAmount,
            }
        }else{
            recentRealtimeChat = {
                avatar: messageObject.user.avatar,
                createdAt: messageObject.createdAt,
                message_id: messageObject._id,
                name: messageObject.user.name,
                room_name: roomName,
                text: messageObject.text,
                system: false,
                mimetype: messageObject.mimetype,
        
                image: messageObject.image,
                realImageURL: messageObject.realImageURL,
                isStoredFile: messageObject.isStoredFile,
                size: messageObject.size,
                duration: messageObject.duration,
        
                waveForm: messageObject.waveForm,
                user_id: messageObject.user._id,
                shouldUpdateChatScreen,
            };
        }
        this.recentRealtimeChat = recentRealtimeChat;
    }

    finalMessageArrivalAction(data: boolean):void{
        this.finalMessageArrived = data;
    }

    shouldCountAction(data: any){
        this.shouldCount = data;
    }

    participantsUpdateAction(data: boolean){
        this.participantsUpdate = data;
    }

    tokenAmountUpdateAction(value: boolean){
        this.tokenAmountUpdate = value;
    }

    setPushNotificationData(data: any){
        this.pushData = data
    }

    updateMessageComposingState(data: any){
        this.isComposing = data;
    }

    setRoomRoles(data: any){
        this.roomRoles = data;
    }

    setRosterAction(data: any){
        if(data){
            this.rosterList = data
        }
    }

    async setCurrentChatDetails(
        chat_id:string,
        chat_name:string,
        navigation:any,
        isRoom:boolean
    ){
        this.chatRoomDetails = {
            chat_id,
            chat_name
        };
        isRoom ? this.isRoom = isRoom : null;
        navigation.navigate('ChatComponent')
    }

    roomCreated(isRoom:boolean, navigation:any){
        this.isRoom = isRoom;
        navigation.navigate('ChatHomeComponent');
    }

    setRequestedArchives(data:any){
        this.archivesRequested = {...this.archivesRequested, ...data};
    }

    updatedRoster(data:boolean){
        this.isRosterUpdated = data;
    }
}