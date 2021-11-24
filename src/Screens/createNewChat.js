/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

/*
Part of this file uses or imports open-source code from xmpp.js project. 
Please note the xmpp.js code is distributed under its own license. At the time of this publication it is ISC which is functionally equivalent to the BSD 2-Clause and MIT license.
Refer to xmpp.js project and its license via their official repository: https://github.com/xmppjs/xmpp.js/blob/main/LICENSE
*/

import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import styles from './style/createNewChatStyle';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {launchImageLibrary} from 'react-native-image-picker';
import CustomHeader from '../components/shared/customHeader';
import {roomCreated} from '../actions/chatAction';
import {connect} from 'react-redux';
import {xmpp} from '../helpers/xmppCentral';
import * as xmppConstants from '../constants/xmppConstants';
import {sha256} from 'react-native-sha256';
import {
  roomConfigurationForm,
  fetchRosterlist,
} from '../helpers/xmppStanzaRequestMessages';
import {underscoreManipulation} from '../helpers/underscoreLogic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {commonColors} from '../../docs/config';

const {primaryColor} = commonColors;

const {xml} = require('@xmpp/client');

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
      avatarSource: null,
      chatName: '',
      walletAddress: '',
      manipulatedWalletAddress: '',
      username: '',
      password: '',
    };
  }

  componentDidMount() {
    const initialData = this.props.loginReducer.initialData;
    let walletAddress = initialData.walletAddress;
    const manipulatedWalletAddress = underscoreManipulation(walletAddress);
    let password = initialData.password;
    let username = initialData.username;
    this.setState({
      walletAddress,
      password,
      username,
      manipulatedWalletAddress,
    });
  }

  createAndSubscribeRoom(
    manipulatedWalletAddress,
    roomHash,
    chatName,
    roomCreated,
    navigation,
  ) {
    let message = xml(
      'presence',
      {
        id: 'CreateRoom',
        from: manipulatedWalletAddress + '@' + this.props.apiReducer.xmppDomains.DOMAIN,
        to:
          roomHash +
         this.props.apiReducer.xmppDomains.CONFERENCEDOMAIN +
          '/' +
          manipulatedWalletAddress,
      },
      xml('x', 'http://jabber.org/protocol/muc'),
    );
    // console.log(message.toString());
    xmpp.send(message);
    console.log(message, 'thisismessagebef');
    message = xml(
      'iq',
      {
        to: roomHash + this.props.apiReducer.xmppDomains.CONFERENCEDOMAIN,
        from: manipulatedWalletAddress + '@' + this.props.apiReducer.xmppDomains.DOMAIN,
        id: 'setOwner',
        type: 'get',
      },
      xml('query', {xmlns: 'http://jabber.org/protocol/muc#owner'}),
    );

    xmpp.send(message);

    roomConfigurationForm(
      manipulatedWalletAddress,
      roomHash + this.props.apiReducer.xmppDomains.CONFERENCEDOMAIN,
      {roomName: chatName},
    );

    message = xml(
      'iq',
      {
        from: manipulatedWalletAddress + '@' + this.props.apiReducer.xmppDomains.DOMAIN,
        to: roomHash + this.props.apiReducer.xmppDomains.CONFERENCEDOMAIN,
        type: 'set',
        id: 'subscription',
      },
      xml(
        'subscribe',
        {
          xmlns: 'urn:xmpp:mucsub:0',
          nick: manipulatedWalletAddress,
        },
        xml('event', {node: 'urn:xmpp:mucsub:nodes:messages'}),
        xml('event', {node: 'urn:xmpp:mucsub:nodes:subject'}),
      ),
    );

    xmpp.send(message);
    setTimeout(() => {
      fetchRosterlist(
        manipulatedWalletAddress,
        xmppConstants.subscriptionsStanzaID,
      );
    }, 2000);

    roomCreated(true, navigation);
  }

  //function to create new chat room
  async createChatRoom() {
    let roomHash = '';
    let {chatName, manipulatedWalletAddress, username} = this.state;
    let {roomCreated, navigation} = this.props;
    sha256(chatName).then(hash => {
      roomHash = hash;

      if (chatName === '') {
        alert('Please fill Chat Name');
      } else {
        this.createAndSubscribeRoom(
          manipulatedWalletAddress,
          roomHash,
          chatName,
          roomCreated,
          navigation,
        );
      }
    });
  }

  //function to set avatar for chat
  setChatAvatar = () => {
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        alert('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = {uri: response.uri};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    });
  };

  render() {
    return (
      <Fragment>
        <View>
          <CustomHeader
            title="Create new chat"
            navigation={this.props.navigation}
          />
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.section1}>
              <TouchableOpacity
                onPress={this.setChatAvatar}
                style={{alignItems: 'flex-start', flex: 0.2}}>
                <View style={styles.camOuter}>
                  {this.state.avatarSource ? (
                    <Image
                      source={this.state.avatarSource}
                      style={{
                        width: wp('15%'),
                        height: wp('15%'),
                        borderRadius: wp('15%') / 2,
                      }}
                    />
                  ) : (
                    <SimpleLineIcons
                      name="camera"
                      size={hp('3.5%')}
                      color={primaryColor}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <TextInput
                onChangeText={chatName => this.setState({chatName})}
                placeholder="Chat name"
                placeholderTextColor={primaryColor}
                style={styles.textInputOuter}
                maxLength={30}
              />
            </View>

            <TextInput
              scrollEnabled
              placeholder="Short description about the chat"
              placeholderTextColor={primaryColor}
              multiline
              style={styles.textFieldouter}
              numberOfLines={5}
            />

            <TouchableOpacity
              onPress={() => this.createChatRoom()}
              style={styles.createButton}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
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
  roomCreated,
})(CreateNewGroup);
