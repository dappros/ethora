import React, { Component, Fragment } from 'react';
import { 
	View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    Image, 
    ImageBackground,
    RefreshControl,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import styles from './style/chatHomeStyle';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {setCurrentChatDetails, shouldCountAction, participantsUpdateAction, updatedRoster} from '../actions/chatAction';
import {logOut} from '../actions/auth';
import {getEmailList, setISPremium} from '../actions/accountAction';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {fetchRosterList, updateRosterList} from '../components/realmModels/chatList';
import {xmpp} from '../helpers/xmppCentral';
import {get_archive_by_room} from '../helpers/xmppStanzaRequestMessages';
import * as connectionURL from '../config/url'
import fetchFunction from '../config/api'
import {gkHubspotToken} from '../config/token';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as GlobalTheme from '../config/globalTheme';

const hitAPI = new fetchFunction

const _ = require('lodash');

const {primaryColor} = GlobalTheme.commonColors;

const {
    thinFont,
    regularFont,
    mediumFont,
    semiBoldFont
} = GlobalTheme.textStyles
class ChatHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            error: null,
            searchText:null,
            isScanResult:false,
            stanzaId:"subscribed_rooms",
            rosterListArray:[],
            refreshing:false,
            walletAddress:"",
            username:"",
            chat_jid:"",
            chat_name:"",
            lastUserName:"",
            lastUserText:"",
            pushChatName:"",
            pushChatJID:"",
            isPremium:false,
            isCheckPremium:false
        };
    }

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = (item) => {
        this.setState({
            chat_name:item.chat_name,
            chat_jid:item.chat_jid
        })
        this._menu.show();
    };

    componentWillUnmount(){
        this.setState({
            isCheckPremium:false
        })
    }

    async componentDidMount(){
        //call email list api
        let isPremium = false;
        try {
            isPremium = await AsyncStorage.getItem('isPremium');
          } catch(e) {
            // error reading value
          }
          
        const {token} = this.props.loginReducer;
        this.props.getEmailList(token);

        fetchRosterList().then(rosterListFromRealm=>{
            let loading = false;
            let pushChatName = "";
            let pushChatJID = "";
            if(rosterListFromRealm){
                let rosterListArray = [];

                rosterListFromRealm.map(item => {

                    if(item.jid===this.props.ChatReducer.pushData.mucId){
                        pushChatName = item.name;
                        pushChatJID = item.jid;
                        loading = true;
                    }

                    rosterListArray.push({
                        name:item.name,
                        participants:item.participants,
                        avatar:item.avatar,
                        jid:item.jid,
                        counter:item.counter,
                        lastUserText:item.lastUserText,
                        lastUserName:item.lastUserName,
                        createdAt:item.createdAt
                    })
                })

                this.setState({
                    rosterListArray,
                    pushChatName,
                    pushChatJID,
                    loading,
                    isPremium
                })
            }
        })

    }

  	async componentDidUpdate(prevProps, prevState){
        const prevEmailList = prevProps.AccountReducer.emailList;
        const prevIsPremium = prevProps.AccountReducer.isPremium
        const {emailList, isPremium} = this.props.AccountReducer;

        if(xmpp){

            //when roster updated with human readable chat room names call the realm for the same.
            if(this.props.ChatReducer.isRosterUpdated){
                let {pushChatJID, pushChatName} = this.state
                fetchRosterList().then(rosterListFromRealm=>{
                    
                    if(rosterListFromRealm){
                        let rosterListArrayTemp = [];
                        rosterListFromRealm.map(item => {
                            rosterListArrayTemp.push({
                                name:item.name,
                                participants:item.participants,
                                avatar:item.avatar,
                                jid:item.jid,
                                counter:item.counter,
                                lastUserText:item.lastUserText,
                                lastUserName:item.lastUserName,
                                createdAt:item.createdAt
                            })
                        })
                        

                        this.setState({
                            rosterListArray:rosterListArrayTemp,
                        })

                    }
                }).then(()=>{
                    this.props.updatedRoster(false);
                }).then(()=>{
                    if(pushChatJID&&pushChatName){
                        this.setState({
                            pushChatJID:"",
                            pushChatName:"",
                            loading:false
                        },()=>this.openChat(pushChatJID, pushChatName))
                    }
                })
            }

            //execute if the component is updated with new chat_jid/room jid. When new room visited
            if(this.props.ChatReducer.rosterList.length!==prevProps.ChatReducer.rosterList.length&&this.props.ChatReducer.rosterList.length>0){
                    const rosterFromReducer = this.props.ChatReducer.rosterList;
                    if(rosterFromReducer){
                        let rosterListArray = []
                        rosterFromReducer.map((item,index) => {
                            rosterListArray.push({
                                name:item.name,
                                participants:item.participants,
                                avatar:item.avatar,
                                jid:item.jid,
                                counter:item.counter,
                                lastUserText:item.lastUserText,
                                lastUserName:item.lastUserName,
                                createdAt:item.createdAt
                            })
                        })

                        this.setState({
                            rosterListArray,
                            loading:false
                        })
                    }
            }
            if(this.props.ChatReducer.recentRealtimeChat.message_id!==prevProps.ChatReducer.recentRealtimeChat.message_id){
                const recentRealtimeChat = this.props.ChatReducer.recentRealtimeChat; //the recent message object from the reducer
                const from = recentRealtimeChat.name; //the nick name of the user who sent the message
                const roomJID = recentRealtimeChat.room_name; // the jid of the room 
                const text = recentRealtimeChat.text; // the text message sent

                let rosterListArray = this.state.rosterListArray;


                rosterListArray.map(item=>{
                    if(item.jid===roomJID)
                    {

                        //the count will not happen if you are already inside the room
                        if(this.props.ChatReducer.shouldCount){
                            item.counter = item.counter+1;
                        }
                        item.lastUserName = from;
                        item.lastUserText = text;
                        item.createdAt = recentRealtimeChat.createdAt
                        
                        updateRosterList(
                            {
                                jid:roomJID, 
                                lastUserName:from, 
                                lastUserText:text, 
                                counter:item.counter, 
                                createdAt:recentRealtimeChat.createdAt
                            }
                        )
                    }

                })


                this.setState({
                    rosterListArray
                })
            }

            //participant number update
            if(this.props.ChatReducer.participantsUpdate!==prevProps.ChatReducer.participantsUpdate&&this.props.ChatReducer.participantsUpdate){
                fetchRosterList().then(rosterListFromRealm=>{
                    let rosterListArray = [];
                    rosterListFromRealm.map(item => {
                        rosterListArray.push({
                            name:item.name,
                            participants:item.participants,
                            avatar:item.avatar,
                            jid:item.jid,
                            counter:item.counter,
                            lastUserText:item.lastUserText,
                            lastUserName:item.lastUserName,
                            createdAt:item.createdAt
                        })
                    })
                    this.setState({
                        rosterListArray
                    })

                    this.props.participantsUpdateAction(false)

                })
            }
        }

        if(isPremium!=prevIsPremium && isPremium){
            this.setState({
                isPremium:true
            })
        }

        //check for emailListUpdate
        if(emailList.length && !this.state.isCheckPremium && !this.state.isPremium){
            //call hubspot api
            emailList.map(item => {
                const url = connectionURL.gkHubspotContacts+"/"+item.email+"/profile?hapikey="+gkHubspotToken;
                hitAPI.fetchHubspotContact(url, ()=>{
                    this.props.logOut
                }, data => {
                    if(data){
                    const hubspotProfile = data["list-memberships"];
                    hubspotProfile.map( async item => {
                        if(item["static-list-id"] === 46){
                            if(item["is-member"]){
                                let isPremiumMember = true;
                                this.props.setISPremium(true);
                                try{
                                    await AsyncStorage.setItem('isPremium', "1");
                                }catch(error){
                                    console.log(error);
                                }

                                this.setState({
                                    isCheckPremium:true,
                                    isPremium: isPremiumMember
                                })
                                
                            }
                        }
                    })
                    }
                    else{
                        this.setState({
                            isCheckPremium: true,
                            isPremium: false
                        })
                    }
                })
            })
        }

  	}

	//view to display when Chat Home component is empty
    chatEmptyComponent = () => {
        return(
            <View style={styles.emptyChatContainer}>
                <View>
                    <Image source={require('../assets/chatEmpty.png')} />
                </View>
                <View style={{
                    justifyContent:'center',
                    margin:5
                }}>
                    <Text style={styles.noChatText}>
                        No chats found
                    </Text>
                </View>
                <View style={{
                    justifyContent:'center',
                    margin:5
                }}>
                    <Text style={styles.descText}>
                        You can start by creating new chats orjoin existing chats
                    </Text>
                </View>
                <View style={{
                    justifyContent:'center',
                    alignItems:'center',
                    flexDirection:'row',
                    marginTop:20
                }}>

					{/* Button to create new chat qrcode */}
                    <TouchableOpacity 
                    onPress={()=>this.props.navigation.navigate('CreateNewChatComponent')} 
                    style={styles.button1Container}>
                        <Text style={styles.button1}>Create new</Text>
                    </TouchableOpacity>

					{/* Button to scan a chat qrcode */}
                    <TouchableOpacity 
                    onPress={()=>this.props.navigation.navigate('QRScreenComponent')}
                    style={styles.button2Container}>
                        <Text style={styles.button2}>Scan QR to join</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

	//View to display invite card
    joinNewChatCard = () => {
        return(
            <View>
                <Card containerStyle={{borderRadius:4}}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:0.2}}>
                            <View style={{borderWidth:1, borderColor:primaryColor, height:hp("5.54%"), width:hp("5.54%"), justifyContent:'center', alignItems:'center', borderRadius:hp("0.7%")}}>
                                <MaterialIcon name = "group" size={hp('4.06%')} style={{marginRight:hp('0.9%'), marginLeft:hp('0.4%')}} color={primaryColor} />
                            </View>
                        </View>
                        <View style={{flex:0.8}}>
                            <View>
                                <Text style={{color:'#4C5264', fontFamily:semiBoldFont, fontSize:hp('1.9%')}}>Managing company</Text>
                                <Text style={{color:'#4C5264', fontFamily:regularFont, fontSize:hp('1.6%')}}>We are a group of blockchain expertsto help you in technical developmentand business queries.</Text>
                            </View>
                            <View style={{flexDirection:'row', marginTop:20}}>
                                <TouchableOpacity style={{width:wp('25%'), height:hp('5%'), backgroundColor:primaryColor, borderRadius:4, justifyContent:'center', alignItems:'center', marginRight:10}}>
                                    <Text style={{color:'#FFFFFF', fontFamily:regularFont, fontSize:hp('1.8%')}}>Join</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:wp('25%'), height:hp('5%'), borderWidth:1, borderColor:'#FF0000', borderRadius:4, justifyContent:'center', alignItems:'center', marginLeft:10}}>
                                    <Text style={{color:'#FF0000', fontFamily:regularFont, fontSize:hp('1.8%')}}>Decline</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Card>
                {/* <ModalList 
                type="tokenTransfer"
                show={this.state.showModal}
                data={this.state.tokenDetails}
                closeModal={this.closeModal}/> */}
            </View>
        )
    }

	//fucntion to open a chat room
    openChat(chat_jid, chat_name){

        let rosterListArray = this.state.rosterListArray;
        rosterListArray.map(item=>{
            if(item.counter!==0){
                item.counter = 0;
            }
        })
        updateRosterList({counter:0,jid:chat_jid})
        this.setState({
            rosterListArray
        })

        this.props.shouldCountAction(false);//this means we don't need to increase the counter as the user is already inside the room when this function was called

        get_archive_by_room(chat_jid)
        this.props.setCurrentChatDetails(chat_jid,chat_name,this.props.navigation);

        
    }

	//View to display list of chats
    chatListComponent = () => {
        return(
            <ScrollView keyboardShouldPersistTaps="always" refreshControl={
                <RefreshControl refreshing={this.state.refreshing} />
            } style={{flex:1}}>
                {this.state.rosterListArray.map((item,index)=>(
                    <TouchableOpacity onPress={()=>this.openChat(item.jid, item.name)} key={index}>
                        <View style={{flexDirection:'row', margin:20, alignItems:'center', marginRight:0, marginLeft:0}}>
                            <View style={{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                                {item.counter?
                                <View style={{alignItems:'flex-end', justifyContent:'flex-end', flex:1, zIndex:1, alignSelf:'flex-end',height:hp('5.5%'),width:hp('5.5%'), marginTop:hp('1%'), marginRight:hp('0.5')}}>
                                    <View style={{height:hp('2.1%'),width:hp('2.1%'), borderRadius:hp('2.1')/2, backgroundColor:'#FF0000', alignItems:'center', justifyContent:'center'}}>
                                        <Text style={{fontFamily:regularFont, fontSize:hp('1%'), color:'#FFFFFF'}}>{item.counter}</Text>
                                    </View>
                                </View>:null
                                }
                                <ImageBackground  imageStyle={{borderRadius:5}} style={{height:hp('5.5%'),width:hp('5.5%'), flex:1, borderRadius:5, position:'absolute'}} >
                                    <View style={{borderWidth:1, borderColor:primaryColor, height:hp("5.54%"), width:hp("5.54%"), justifyContent:'center', alignItems:'center', borderRadius:hp("0.7%")}}>
                                        <MaterialIcon name = "group" size={hp('4.06%')}  color={primaryColor} />
                                    </View>
                                </ImageBackground>
                            </View>
                            <View style={{justifyContent:'center', marginLeft:wp("0.1%"), flex:0.73}}>
                                <Text numberOfLines={1} style={{fontFamily:mediumFont, fontSize:hp('2%'), color:"#4C5264"}}>{item.name}</Text>

                                {item.lastUserName?
                                <Fragment>
                                <View style={{flexDirection:'row', marginTop:hp('0.8%')}}>
                                    <Text numberOfLines={1} style={{fontFamily:regularFont, fontSize:hp('1.8%'), color:'#4C5264'}}>{item.lastUserName}: </Text>
                                    <Text numberOfLines={1} style={{fontFamily:thinFont, fontSize:hp('1.8%'), color:"#4C5264"}}>{item.lastUserText}</Text>
                                </View>
                                <Text style={{fontFamily:regularFont, fontSize:hp('1.2%'), flex:1, color:'#BCC5D3', marginTop:hp('0.6%')}}>{`${item.createdAt.getHours()}:${item.createdAt.getMinutes()}`}</Text>
                                </Fragment>:
                                <Text numberOfLines={1} style={{fontFamily:thinFont, fontSize:hp('1.8%'), color:"#4C5264"}}>Join this chat to view updates</Text>
                                }

                            </View>
                            <View style={{flex:0.17}}>
                                <View style={{flex:1, alignItems:'flex-end', justifyContent:'center'}}>
                                    <View style={{height:hp('3.8%'), width:wp('15%')}}>
                                        <View style={{flex:1,flexDirection:'row', alignItems:'center', borderTopLeftRadius:50,borderBottomLeftRadius:50, shadowOffset:{  width: -1,  height: 1,  }, shadowColor:'#F0B310', shadowOpacity: 1.0, borderWidth:1, borderColor:'#ffff', shadowRadius:1, backgroundColor:'white'}}>
                                            <MaterialIcon name = "group" size={hp('2%')} style={{marginRight:hp('0.9%'), marginLeft:hp('0.4%')}} />
                                            <Text style={{fontSize:hp('1.5%'), fontFamily:regularFont}}>{item.participants}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        )
    }

	//function to decide which view to display
    setScreenFucntion = () => {

		//loading view
        if(this.state.loading){
            return(<View style={{justifyContent:'center', alignItems:'center', flex:1}}><Text>Loading...</Text></View>)
		}
		
		//when rosterListArray is empty and isScanresult is false display empty chat view
        else if(!this.state.rosterListArray.length&&!this.state.isScanResult){
            return(this.chatEmptyComponent())
		}
		
		//when isScanResult is true show invite card view
        else if(this.state.isScanResult){
            return(this.joinNewChatCard())
		}
		
		//when rosterListArray is not empty show Chat list view
        else if(this.state.rosterListArray.length){
            return(this.chatListComponent())
		}
		//else show chat Empty defaultly
        else{
            return(this.chatEmptyComponent())
        }
    }

  	render() {

		return (
			<View style={styles.container}>
				{
                this.setScreenFucntion()
                
				}
			</View>
		);
  	}
}

const mapStateToProps = state => {
    return {
      ...state,
    };
  };


module.exports = connect(mapStateToProps, {
    setCurrentChatDetails,
    shouldCountAction,
    participantsUpdateAction,
    updatedRoster,
    getEmailList,
    setISPremium,
    logOut
})(ChatHome)
