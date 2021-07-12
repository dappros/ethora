import {realm} from './allSchemas';
import * as schemaTypes from '../../constants/realmConstants';

//fucntion to check if the room exists
function checkQuery(checkType,check,callback){
        let messages = realm.objects(schemaTypes.MESSAGE_SCHEMA)
        if(messages.filtered(`${checkType}="${check}"`)){
            callback(true);
        }
}

//function to check message_id exists
function filter(query,schema,callback){
    let schemaSelected = realm.objects(schema);
    let check = schemaSelected.filtered(query);
    callback(Array.from(check));
}

//insert message
export const insertMessages = (data,room_name,tokenAmount,receiverMessageId) => new Promise((resolve,reject)=>{
    let messageObject = {};
    if(!data.system){
        messageObject = {
            message_id: data._id, //unique
            text:data.text,
            createdAt:data.createdAt,
            user_id:data.user._id,
            name:data.user.name,
            avatar:data.user.avatar,
            system:data.system,
            realImageURL: data.realImageURL,
            localURL: data.localURL,
            image:data.image,
            mimetype: data.mimetype,
            size: data.size,
            isStoredFile:data.isStoredFile,
            room_name,
            tokenAmount
        }
    }
    if(data.system) {
        console.log("yes system", data)
        messageObject = {
            message_id: data._id, //unique
            text:data.text,
            createdAt:data.createdAt,
            system:data.system,
            room_name,
        }
    }
    //check if message_id already exists
    filter(`message_id="${data._id}"`,schemaTypes.MESSAGE_SCHEMA,callback=>{
        //if not
        if(callback.length===0){
            realm.write(()=>{
                realm.create(schemaTypes.MESSAGE_SCHEMA, messageObject);
                resolve(messageObject);
            });
            updateMessageObject({tokenAmount,receiverMessageId})
        }
        //if yes
        else return null;
    })
});

//fetch message object of a particular room
export const queryRoomAllMessages = (room_name) => new Promise((resolve,reject)=>{
    checkQuery('room_name',room_name,callback=>{
        if(callback){
            let chats = realm.objects(schemaTypes.MESSAGE_SCHEMA).filtered(`room_name="${room_name}" SORT(createdAt ASC)`);
            resolve(Array.from(chats));
        }
    })
})

//update message object
export const updateMessageObject = (data) => new Promise((resolve,reject)=>{
    console.log(data,"Adsndfgytdscd")
    realm.write(()=>{
    let messageObject = realm.objectForPrimaryKey(schemaTypes.MESSAGE_SCHEMA, data.receiverMessageId);
    // console.log(messageObject.tokenAmount,"Bgvdsbfshjmgfvd")
    //update token amount for a message
        if(data.tokenAmount){
            messageObject.tokenAmount = messageObject.tokenAmount + data.tokenAmount;
        }

        if(data.localURL){
            console.log(data.localURL,"inasdnajsncakljsn")
            messageObject.localURL = data.localURL;
            messageObject.isStoredFile = true;
        }
    })
})