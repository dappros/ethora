import React, { Component, Fragment } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import styles from './style/createNewChatStyle';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';
import CustomHeader from '../components/shared/customHeader';
import {roomCreated} from '../actions/chatAction';
import { connect } from 'react-redux';
import {xmpp} from '../helpers/xmppCentral';
import * as xmppConstants from '../constants/xmppConstants';
import { sha256 } from 'react-native-sha256';
import {roomConfigurationForm, fetchRosterlist} from '../helpers/xmppStanzaRequestMessages';
import {underscoreManipulation} from '../helpers/underscoreLogic';
import * as GlobalTheme from '../config/globalTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {primaryColor} = GlobalTheme.commonColors;

const { xml } = require("@xmpp/client");

const subscriptionsStanzaID = 'subscriptions';

const checkDefaultRoom = [
  // {exist:false, name:"3981a2b9c1ef7fce8dbf5e3d44fefc58746dee11b3de35655e166c25142612ba"}, //Communication
  // {exist:false, name:"680c3097aabc902bb129eaa23a974408856fbdccb7630cfd074ddf0639fc8ec0"}, //Workplace Readiness
  {
    exist: false,
    name:
      '9c8f9e5ee96519c5251b79f9da4f0ad210cd7450ce7e04c8fbbcfbf748436ee0',
  }, //GK Leadership
  // {exist:false, name:"91bfaa5cbfaab8a5661c0c5e15e54196d4ed4f76bb86b6cef07d337ff5c7fd41"}, //Career Development
  {
    exist: false,
    name:
      'a258b30f88c30650e73073d5bdde5cfcc6987100ae62d37789e5c46a0d85b7c6',
  }, //Global
  {
    exist: false,
    name:
      'aa2f4a79e1413b444fd531a394a01befa3b5e8b559dfbc67b54ce9a1b91cedf2',
  }, //Southern Africa
  // {exist:false, name:"c67531e3ec3d5090acc25d6768140ad37789000fb4c5e254af6be5538c49ee56"}, //Life Skills
  // {exist:false, name:"cf5f45da57a2ca0e4a581d40099751bcb4919fbb984b547e1d9d12c8ca710412"}, //Personal Finance
  // {exist:false, name:"d677190e0a9990e7d5fa9e4c1bbde44271fb8959c4acb6d43e02ed991128b4bf"}, //Service
  // {exist:false, name:"ec75f79040af17557c450e94a4214a484350634a433592d2eb31784c5a46e865"}, //Leadership
];

const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};


class CreateNewGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
        avatarSource:null,
        chatName:"",
        walletAddress:"",
        manipulatedWalletAddress:"",
        username:"",
        password:""
    };
  }

  componentDidMount(){
    const initialData = this.props.loginReducer.initialData;
    let walletAddress = initialData.walletAddress
    const manipulatedWalletAddress = underscoreManipulation(walletAddress);
    let password = initialData.password
    let username = initialData.username
    this.setState({
      walletAddress,
      password,
      username,
      manipulatedWalletAddress
    })
  }

  async checkUserPremium(callback){
    let isPremium = false;
    try {
      isPremium = await AsyncStorage.getItem('isPremium');
      // console.log(Boolean(Number(isPremium)),"AsyncValue");
      callback(Boolean(Number(isPremium)));
    } catch(e) {
      // error reading value
      callback(Boolean(Number(isPremium)));
    }
  }

  async checkIfPremiumRoom (roomHash, callback){
    let isPremiumRoom = false
    await checkDefaultRoom.map(item=>{
      console.log(item.name, roomHash, "checkthissss")
      if(item.name === roomHash){
        isPremiumRoom = true
        Alert.alert("Not Allowed", "You need to be a premium member to join this room",[
          {
            text:"Ok",
            onPress: ()=>this.setState({
              isLoading:false
            })
          }
        ])
      }
    })
  
    if(isPremiumRoom){
      callback(true)
    }
    else{
      console.log("notPremium")
      callback(false)
    }
  
  }

  createAndSubscribeRoom(manipulatedWalletAddress, roomHash, chatName, roomCreated, navigation){

    let message = xml('presence', 
    {
      id:"CreateRoom",
      from : manipulatedWalletAddress+'@'+xmppConstants.DOMAIN,
      to: roomHash+xmppConstants.CONFERENCEDOMAIN+'/'+manipulatedWalletAddress
    },
    xml('x', 'http://jabber.org/protocol/muc'));
    // console.log(message.toString());
    xmpp.send(message);
    console.log(message,'thisismessagebef')
    message = xml("iq", {
        'to': roomHash + xmppConstants.CONFERENCEDOMAIN,
        'from': manipulatedWalletAddress + '@' + xmppConstants.DOMAIN,
        'id': 'setOwner',
        'type': 'get'
      },
        xml('query', {'xmlns':'http://jabber.org/protocol/muc#owner'}),
    );

    xmpp.send(message);

    roomConfigurationForm(manipulatedWalletAddress,roomHash + xmppConstants.CONFERENCEDOMAIN,{roomName:chatName})

    message = xml('iq', {
      "from":manipulatedWalletAddress + '@' + xmppConstants.DOMAIN,
      "to":roomHash + xmppConstants.CONFERENCEDOMAIN,
      "type":"set",
      "id":"subscription"
      },
      xml('subscribe',
        {
          "xmlns":"urn:xmpp:mucsub:0","nick":manipulatedWalletAddress
        },
        xml('event', {"node":"urn:xmpp:mucsub:nodes:messages"}),
        xml('event', {"node":"urn:xmpp:mucsub:nodes:subject"}),
      )
    )

    xmpp.send(message);
    setTimeout(()=>{
      fetchRosterlist(manipulatedWalletAddress, subscriptionsStanzaID);
    },2000)
    
    roomCreated(true, navigation);
  }

  //function to create new chat room
  async createChatRoom(){
    let roomHash="";
    let {chatName, manipulatedWalletAddress, username} = this.state;
    let {roomCreated, navigation} = this.props;
    sha256(chatName).then(hash => {
      roomHash = hash;

      if(chatName===""){
        alert('Please fill Chat Name');
      }else{
        this.checkUserPremium(callback => {
          if(callback){
            this.createAndSubscribeRoom(manipulatedWalletAddress, roomHash, chatName, roomCreated, navigation)
          }else{
            this.checkIfPremiumRoom(roomHash, isPremiumRoomCheck=>{
              if(!isPremiumRoomCheck){
                this.createAndSubscribeRoom(manipulatedWalletAddress, roomHash, chatName, roomCreated, navigation);
              }
            })
          }
        })
      }
    });
    
  }
  

  //function to set avatar for chat
  setChatAvatar=()=>{
    ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);
      
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.uri };
      
          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      
          this.setState({
            avatarSource: source,
          });
        }
      });
  }

  render() {
    return (
        <Fragment>
        <View>
            <CustomHeader title="Create new chat" navigation={this.props.navigation}/>
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.section1}>
                <TouchableOpacity onPress={this.setChatAvatar} style={{alignItems:'flex-start', flex:0.2}}>
                    <View style={styles.camOuter}>
                        {this.state.avatarSource!==null?
                        <Image source={this.state.avatarSource} style={{width:wp('15%'),height:wp('15%'),borderRadius:wp('15%')/2,}}/>:
                        <SimpleLineIcons name='camera' size={hp('3.5%')} color={primaryColor} />
                        }
                        
                    </View>
                </TouchableOpacity>
                <TextInput onChangeText={(chatName)=>this.setState({chatName})} placeholder="Chat name" placeholderTextColor={primaryColor} style={styles.textInputOuter} />
            </View>

                <TextInput scrollEnabled placeholder="Short description about the chat" placeholderTextColor={primaryColor} multiline style={styles.textFieldouter} numberOfLines={5} />

                <TouchableOpacity
                onPress={()=>this.createChatRoom()}
                style={styles.createButton}
                >
                    <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
                        <Text style={styles.createButtonText}>Create new chat</Text>
                    </View>
                </TouchableOpacity>
          </View>
      </ScrollView>
      </Fragment>
    );
  }
}


const mapStateToProps = state => {
  return {
    ...state,
  };
};

module.exports = connect(mapStateToProps, {
  roomCreated
})(CreateNewGroup)