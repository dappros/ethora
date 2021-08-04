import React, {Component, Fragment} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, Platform, Alert} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import styles from './style/scanStyle';
import {connect} from 'react-redux';
import {fetchchatRoomDetails} from '../actions/chatAction';
import {launchImageLibrary} from 'react-native-image-picker';
import jsQR from 'jsqr';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {PNG} from 'pngjs/browser';
import JpegDecoder from 'jpeg-js';
import {setCurrentChatDetails, roomCreated} from '../actions/chatAction';
import {xmpp} from '../helpers/xmppCentral';
import {
  get_archive_by_room,
  fetchRosterlist,
} from '../helpers/xmppStanzaRequestMessages';
import CustomHeader from '../components/shared/customHeader';

import * as xmppConstants from '../constants/xmppConstants';
import {underscoreManipulation} from '../helpers/underscoreLogic';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {xml} = require('@xmpp/client');
const Buffer = require('buffer').Buffer;
global.Buffer = Buffer; // very important

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
  mediaType: 'photo',
  includeBase64: true,
  maxHeight: 200,
  maxWidth: 200,
};

function createImageData(base64ImageData, imageType, callback) {
  let decodedData = {};
  const bufferFrom = Buffer.from(base64ImageData, 'base64');
  if (imageType === 'image/jpeg') {
    console.log('decoded jpeg');
    decodedData = JpegDecoder.decode(bufferFrom, {useTArray: true});
    console.log(decodedData.data, 'decoded jpeg');
  } else if (imageType === 'image/png') {
    decodedData = PNG.sync.read(bufferFrom);
    console.log(decodedData, 'decoded png');
  }
  // const png = PNG.sync.read(Buffer.from(base64ImageData, 'base64'));
  const code = jsQR(
    Uint8ClampedArray.from(decodedData.data),
    decodedData.width,
    decodedData.height,
  );
  console.log(code, 'this is it');
  callback(code);
}

class qrcodescreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scan: false,
      ScanResult: false,
      result: null,
      walletAddress: '',
      manipulatedWalletAddress: '',
      username: '',
      isLoading: false,
    };
  }

  componentDidMount() {
    const initialData = this.props.loginReducer.initialData;
    const walletAddress = initialData.walletAddress;
    const manipulatedWalletAddress = underscoreManipulation(walletAddress);
    let username = initialData.username;

    this.setState({
      walletAddress,
      username,
      manipulatedWalletAddress,
    });
  }

  activeQR = () => {
    this.setState({
      scan: true,
    });
  };

  scanAgain = () => {
    this.setState({
      scan: true,
      ScanResult: false,
    });
  };

  onSuccess = e => {
    const check = e.data.substring(0, 4);
    console.log('scanned data' + e.data);
    this.setState({
      result: e,
      scan: false,
      ScanResult: true,
      isLoading: true,
    });
    this.openChat(e.data);
  };

subscribeRoomAndOpenChat(chat_jid){
  const subscribe = xml(
    'iq',
    {
      from: this.state.manipulatedWalletAddress + '@' + xmppConstants.DOMAIN,
      to: chat_jid,
      type: 'set',
      id: 'subscription',
    },
    xml(
      'subscribe',
      {xmlns: 'urn:xmpp:mucsub:0', nick: this.state.manipulatedWalletAddress},
      xml('event', {node: 'urn:xmpp:mucsub:nodes:messages'}),
      xml('event', {node: 'urn:xmpp:mucsub:nodes:subject'}),
    ),
  );
  xmpp.send(subscribe);
  get_archive_by_room(chat_jid);

  this.props.setCurrentChatDetails(
    chat_jid,
    'Loading...',
    this.props.navigation,
    true,
  );
  this.setState({
    isLoading: false,
  });
  fetchRosterlist(this.state.manipulatedWalletAddress, subscriptionsStanzaID);
}

  async openChat(chat_jid) {
    // if(chat_jid.includes(xmppConstants.DOMAIN))
    // {
    //   chat_name=chat_jid.split("@"+xmppConstants.CONFERENCEDOMAIN)[0]
    // }

    this.checkUserPremium(callback => {
      console.log(callback,"thisisit")
      if(callback){
        this.subscribeRoomAndOpenChat(chat_jid)
      }else{
        this.subscribeRoomAndOpenChat(chat_jid);
      }
    })



    // insertRosterList(chatListObject);

    // this.props.navigation.navigate({name:"ChatComponent"})
  }

  openGallery() {
    this.setState({
      isLoading: true,
    });
    launchImageLibrary(options, async response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        this.setState({
          isLoading: false,
        });
        console.log('User cancelled image picker');
      } else if (response.error) {
        this.setState({
          isLoading: false,
        });
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        this.setState({
          isLoading: false,
        });
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const qrCodeFileUri = {uri: response.uri};
        createImageData(response.base64, response.type, res => {
          // console.log(res.data,'returned data')
          if (res) {
            this.openChat(res.data);
          } else {
            alert('Invalid QR');
            this.setState({
              isLoading: false,
            });
          }
        });
        //   this.setState({
        //     avatarSource: source,
        //   });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{zIndex:Platform.OS==="android"?+1:0, flex:0.2}}>
        <CustomHeader
          title = "Scan"
          isQR={false}
          navigation={this.props.navigation}
        />
        </View>
        <View style={{flex:0.7, justifyContent:'flex-start'}}>
          {/* <StatusBar barStyle="dark-content" /> */}
          {this.state.isLoading ? (
            <ActivityIndicator
              size="large"
              color={'black'}
              animating={this.state.isLoading}
            />
          ) : (
            <QRCodeScanner
              showMarker={true}

              topViewStyle={{flex: 0}}
              containerStyle={{flex:1}}
              cameraStyle={{flex:Platform.OS==="android"?0.8:1, height:hp("40%"), width:"100%", justifyContent:'flex-start'}}
              ref={node => {
                this.scanner = node;
              }}
              bottomViewStyle={{flex:0.2}}
              onRead={e => this.onSuccess(e)}
              bottomContent={
                <View>
                  <TouchableOpacity
                    onPress={() => this.openGallery()}
                    style={styles.buttonTouchable}>
                    <Text style={styles.buttonTextStyle}>
                      Upload from gallery
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state,
  };
};

module.exports = connect(
  mapStateToProps,
  {
    fetchchatRoomDetails,
    setCurrentChatDetails,
    roomCreated,
    fetchRosterlist,
  },
)(qrcodescreen);
