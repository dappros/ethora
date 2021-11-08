/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
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
import parseChatLink from '../helpers/parseChatLink';

const {xml} = require('@xmpp/client');
const Buffer = require('buffer').Buffer;
global.Buffer = Buffer; // very important

const subscriptionsStanzaID = 'subscriptions';

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
    const chatJID = parseChatLink(e.data);
    this.openChat(chatJID);
  };

  subscribeRoomAndOpenChat(chat_jid) {
    console.log(chat_jid, '324290349234890');
    const subscribe = xml(
      'iq',
      {
        from:
          this.state.manipulatedWalletAddress +
          '@' +
          this.props.apiReducer.xmppDomains.DOMAIN,
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
    if (chat_jid.includes(xmppConstants.DOMAIN)) {
      chat_name = chat_jid.split('@' + xmppConstants.CONFERENCEDOMAIN)[0];
    }

    const chatJID =
      parseChatLink(chat_jid) +
      this.props.apiReducer.xmppDomains.CONFERENCEDOMAIN;
    this.subscribeRoomAndOpenChat(chatJID);
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
          console.log(res, '234879234');
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
        <View style={{zIndex: Platform.OS === 'android' ? +1 : 0, flex: 0.2}}>
          <CustomHeader
            flashMode={RNCamera.Constants.FlashMode.torch}
            title="Scan"
            isQR={false}
            navigation={this.props.navigation}
          />
        </View>
        <View style={{flex: 0.7, justifyContent: 'flex-start'}}>
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
              containerStyle={{flex: 1}}
              cameraStyle={{
                flex: Platform.OS === 'android' ? 0.8 : 1,
                height: hp('40%'),
                width: '100%',
                justifyContent: 'flex-start',
              }}
              ref={node => {
                this.scanner = node;
              }}
              bottomViewStyle={{flex: 0.2}}
              onRead={e => this.onSuccess(e)}
              bottomContent={
                <View>
                  <TouchableOpacity
                    onPress={() => this.openGallery()}
                    style={styles.buttonTouchable}>
                    <Text style={styles.buttonTextStyle}>
                      Upload from gallery.
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

module.exports = connect(mapStateToProps, {
  fetchchatRoomDetails,
  setCurrentChatDetails,
  roomCreated,
  fetchRosterlist,
})(qrcodescreen);
