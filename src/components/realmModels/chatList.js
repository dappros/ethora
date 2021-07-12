import {realm} from './allSchemas';
import * as schemaTypes from '../../constants/realmConstants';
import {queryRoomAllMessages} from './messages';

//check for room name
function checkRoomExist(jid,callback){
        let chatObject = realm.objects(schemaTypes.CHAT_LIST_SCHEMA);
        if(Array.from(chatObject.filtered(`jid="${jid}"`)).length>0){
            callback(true);
        }else callback(false);
}

export const insertRosterList = (chatsObject) => new Promise((resolve,reject)=>{

    try{
    queryRoomAllMessages(chatsObject.jid).then(chats=>{
        const lastUserName = chats.length?chats[chats.length-1].name:"";
        const lastUserText = chats.length?chats[chats.length-1].text:"";
        const createdAt = chats.length?chats[chats.length-1].createdAt:new Date();
        const chatListObject = {
            name: chatsObject.name,
            jid:chatsObject.jid,
            participants:chatsObject.participants,
            avatar:chatsObject.avatar,
            counter:chatsObject.counter,
            lastUserName:lastUserName,
            lastUserText:lastUserText,
            createdAt:createdAt
        }
        checkRoomExist(chatsObject.jid, callback=>{
            
            if(!callback){
                    
                realm.write(()=>{
                    realm.create(schemaTypes.CHAT_LIST_SCHEMA, chatListObject)
                    resolve(chatListObject);
                });
            }
            else {
                resolve(chatListObject);
            }
        })
    })
}catch(error){
    reject(error);
}

    
})

export const updateRosterList = (data) => new Promise((resolve,reject)=>{
    realm.write(()=>{
        const chatList = realm.objectForPrimaryKey(schemaTypes.CHAT_LIST_SCHEMA, data.jid);
        if(data.lastUserName&&data.lastUserText){
            chatList.lastUserText = data.lastUserText;
            chatList.lastUserName = data.lastUserName;
        }
        if(data.chatList){
        chatList.counter = data.counter;
        }
        if(data.participants){
            chatList.participants = data.participants;
        }
        if(data.createdAt){
            chatList.createdAt = data.createdAt;
        }
        if(data.name){
            chatList.name = data.name
        }
        resolve();
    })
})

export const fetchRosterList = () => new Promise((resolve, reject)=>{
    const rosterList = realm.objects(schemaTypes.CHAT_LIST_SCHEMA)
    rosterList.isValid()?rosterList.isEmpty?
    resolve(Array.from(rosterList)):reject("is empty"):reject("not valid")
})