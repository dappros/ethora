import React, {Component, Fragment} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  View,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import {transferTokens} from '../../actions/wallet';
import {connect} from 'react-redux';
import QRGenerator from '../../Screens/qrCodeGenerator';
import {coinsMainName} from '../../../docs/config';
import {ActivityIndicator} from 'react-native';
import {commonColors, textStyles, coinImagePath} from '../../../docs/config';
import PrivacyPolicy from './PrivacyPolicy';
import * as xmppConstants from '../../constants/xmppConstants';
import {
  setCurrentChatDetails,
  shouldCountAction,
} from '../../actions/chatAction';
import {underscoreManipulation} from '../../helpers/underscoreLogic';
import {
  fetchRosterlist,
  roomConfigurationForm,
  get_archive_by_room,
  setSubscriptions,
} from '../../helpers/xmppStanzaRequestMessages';
import {sha256} from 'react-native-sha256';
import {xmpp} from '../../helpers/xmppCentral';
const {xml} = require('@xmpp/client');

const {primaryColor, secondaryColor} = commonColors;
const {regularFont, semiBoldFont} = textStyles;

const QRCodeComponent = (props) => {
  return (
    <View style={{justifyContent: 'center'}}>
      <QRGenerator close={() => props.closeModal()} value={props.chat_key} />
    </View>
  );
};

const TokenTransfer = (props) => {
  return (
    <Fragment>
      <Text style={styles.tokenTransferHeaderText}>
        Reward{' '}
        <Text
          style={{
            fontFamily: regularFont,
            fontSize: hp('1.5%'),
            fontWeight: 'bold',
          }}>
          {props.name}
        </Text>{' '}
        with coins
      </Text>
      <View style={styles.coinSetContainer}>
        <Pressable
          onPress={() => props.tokenTransferFunc(1)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: props.tokenAmount === 1 ? 1 : null,
            borderColor: props.tokenAmount === 1 ? '#A1A9B4' : null,
            padding: 5,
          }}>
          <Image source={coinImagePath} style={styles.gkcIconStyle} />
          <Text>1</Text>
        </Pressable>

        <Pressable
          onPress={() => props.tokenTransferFunc(3)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: props.tokenAmount === 3 ? 1 : null,
            borderColor: props.tokenAmount === 3 ? '#A1A9B4' : null,
            padding: 5,
          }}>
          <Image source={coinImagePath} style={styles.gkcIconStyle} />
          <Text>3</Text>
        </Pressable>

        <Pressable
          onPress={() => props.tokenTransferFunc(5)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: props.tokenAmount === 5 ? 1 : null,
            borderColor: props.tokenAmount === 5 ? '#A1A9B4' : null,
            padding: 5,
          }}>
          <Image source={coinImagePath} style={styles.gkcIconStyle} />
          <Text>5</Text>
        </Pressable>

        <Pressable
          onPress={() => props.tokenTransferFunc(7)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: props.tokenAmount === 7 ? 1 : null,
            borderColor: props.tokenAmount === 7 ? '#A1A9B4' : null,
            padding: 5,
          }}>
          <Image source={coinImagePath} style={styles.gkcIconStyle} />
          <Text>7</Text>
        </Pressable>
      </View>

      {/* <View style={{flexDirection:'row', justifyContent:'center', width:'100%'}}>
        <TouchableOpacity onPress={()=>props.closeModal()} style={{flex:0.5, justifyContent:'center', alignItems:'center'}}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={()=>props.tokenTransferFunc()} style={{flex:0.5, justifyContent:'center', alignItems:'center'}}>
          <Text>OK</Text>
        </TouchableOpacity>
      </View> */}
    </Fragment>
  );
};

const SendItem = (props) => {
  return (
    <TouchableOpacity onPress={() => {}}>
      <View style={styles.sendItemAndDMContainer}>
        <View style={styles.sendItemAndDMIconContainer}>
          <FontistoIcon name="arrow-swap" size={15} color="black" />
        </View>
        <Text>Send Items</Text>
      </View>
    </TouchableOpacity>
  );
};

const DirectMessage = (props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress();
      }}>
      <View style={styles.sendItemAndDMContainer}>
        <View style={styles.sendItemAndDMIconContainer}>
          <Icon name="send" size={15} color="black" />
        </View>
        <Text>Direct Message</Text>
      </View>
    </TouchableOpacity>
  );
};

const ReportAndBlockButton = (props) => {
  const textLabel =
    props.type === '0' ? 'Report this message' : 'Block this user';
  const iconName = props.type === '0' ? 'report-problem' : 'block';
  return (
    <TouchableOpacity onPress={() => {}}>
      <View style={styles.reportAndBlockContainer}>
        <View style={styles.sendItemAndDMIconContainer}>
          <MaterialIcons name={iconName} size={15} color="#fff" />
        </View>
        <Text style={styles.reportAndBlockText}>{textLabel}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Seperator = () => {
  return <View style={styles.seperator} />;
};
class CommonModal extends Component {
  state = {
    modalVisible: false,
    tokenAmount: null,
    tokenName: coinsMainName,
    tokenState: {type: null, amnt: null},
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  componentDidMount() {
    let modalVisible = this.props.show;
    this.setModalVisible(modalVisible);
    if (this.props.extraData) {
      if (this.props.extraData && this.props.extraData.type === 'receive') {
        this.setState({
          tokenState: this.props.extraData,
        });
      }
    }
  }

  static getDerivedStateFromProps(nextProp, prevState) {
    if (nextProp.show !== prevState.modalVisible) {
      if (
        nextProp.extraData !== null &&
        nextProp.extraData !== prevState.tokenState
      ) {
        return {tokenState: nextProp.extraData, modalVisible: nextProp.show};
      } else return {modalVisible: nextProp.show};
    } else return null;
  }

  setTokenAmount(amt) {
    this.setState({
      tokenAmount: amt,
    });
  }

  closeModal() {
    if (this.state.tokenAmount === null) {
      this.props.closeModal();
    } else {
      this.setState(
        {tokenAmount: null, tokenState: {type: 'transfer', amnt: 'null'}},
        () => this.props.closeModal(),
      );
    }
  }

  //send or transfer token
  tokenTransferFunc = async (amt) => {
    this.props.closeModal();
    const receiverName = this.props.extraData.name;
    const receiverMessageId = this.props.extraData.message_id;
    const senderName = this.props.extraData.senderName;
    const tokenList = this.props.walletReducer.balance;
    const {token, initialData} = this.props.loginReducer;
    const fromWalletAddress = initialData.walletAddress;
    // const amt = this.state.tokenAmount;
    const walletAddress = this.props.extraData.walletFromJid
      ? this.props.extraData.walletFromJid
      : '0x11B73ed272273a6a96bE2800d543E1638563B47A';
    let walletBalance = 0;
    const bodyData = {
      toWallet: walletAddress,
      amount: amt,
      tokenId: 'ERC20',
      tokenName: coinsMainName,
    };

    tokenList.map((item) => {
      if (item.tokenName === coinsMainName) {
        if (item.balance.hasOwnProperty('_hex')) {
          walletBalance = parseInt(item.balance._hex, 16);
        } else {
          walletBalance = item.balance;
        }
      }
    });
    if (walletBalance) {
      if (amt <= walletBalance) {
        await this.props.transferTokens(
          bodyData,
          token,
          fromWalletAddress,
          senderName,
          receiverName,
          receiverMessageId,
        );
        this.setState({tokenState: {type: 'sent', amt: amt}});
      } else {
        alert('Not enough token');
      }
    } else {
      alert('You do not have enough ' + coinsMainName);
    }
  };
  async createChatRoom(
    manipulatedWalletAddress,
    combinedWalletAddress,
    chatName,
    username,
  ) {
    let roomHash = '';
    // let {chatName, manipulatedWalletAddress, username} = this.state;
    let {navigation} = this.props;
    sha256(chatName).then((hash) => {
      console.log(hash, 'hash');
      roomHash = hash;

      let message = xml(
        'presence',
        {
          id: 'CreateRoom',
          from: manipulatedWalletAddress + '@' + xmppConstants.DOMAIN,
          to:
            combinedWalletAddress +
            '@' +
            xmppConstants.CONFERENCEDOMAIN +
            '/' +
            username,
        },
        xml('x', 'http://jabber.org/protocol/muc'),
      );
      // console.log(message.toString());
      xmpp.send(message);
      // createChatRoom(
      //   this.state.manipulatedWalletAddress,
      //   roomHash,
      //   this.state.username,
      // );
      console.log('thisismessagebef');
      message = xml(
        'iq',
        {
          to: combinedWalletAddress + xmppConstants.CONFERENCEDOMAIN,
          from: manipulatedWalletAddress + '@' + xmppConstants.DOMAIN,
          id: 'setOwner',
          type: 'get',
        },
        xml('query', {xmlns: 'http://jabber.org/protocol/muc#owner'}),
      );

      xmpp.send(message);
      // createRoomWithOwner(roomHash, this.state.manipulatedWalletAddress);

      //       <iq from='hag66@shakespeare.example'
      //     to='coven@muc.shakespeare.example'
      //     type='set'
      //     id='E6E10350-76CF-40C6-B91B-1EA08C332FC7'>
      //   <subscribe xmlns='urn:xmpp:mucsub:0'
      //              nick='mynick'
      //              password='roompassword'>
      //     <event node='urn:xmpp:mucsub:nodes:messages' />
      //     <event node='urn:xmpp:mucsub:nodes:affiliations' />
      //     <event node='urn:xmpp:mucsub:nodes:subject' />
      //     <event node='urn:xmpp:mucsub:nodes:config' />
      //   </subscribe>
      // </iq>

      roomConfigurationForm(
        manipulatedWalletAddress,
        combinedWalletAddress + xmppConstants.CONFERENCEDOMAIN,
        {roomName: chatName},
      );

      message = xml(
        'iq',
        {
          from: manipulatedWalletAddress + '@' + xmppConstants.DOMAIN,
          to: combinedWalletAddress + xmppConstants.CONFERENCEDOMAIN,
          type: 'set',
          id: 'subscription',
        },
        xml(
          'subscribe',
          {
            xmlns: 'urn:xmpp:mucsub:0',
            nick: username,
          },
          xml('event', {node: 'urn:xmpp:mucsub:nodes:messages'}),
          xml('event', {node: 'urn:xmpp:mucsub:nodes:subject'}),
        ),
      );

      xmpp.send(message);

      // subscribe(
      //   this.state.manipulatedWalletAddress,
      //   roomHash,
      //   this.state.username,
      // );

      setTimeout(() => {
        fetchRosterlist(manipulatedWalletAddress, 'subscriptions');
      }, 2000);

      // roomCreated(true, this.props.navigation,);
      // this.props.setCurrentChatDetails(
      //   manipulatedWalletAddress,
      //   'Loading...',
      //   navigation,
      //   true,
      // );
    });
  }
  sendInvite = (username, chatName, to) => {
    const stanza = xml(
      'message',
      {from: username + '@' + xmppConstants.DOMAIN, to: chatName},
      xml(
        'x',
        'http://jabber.org/protocol/muc#user',
        xml(
          'invite',
          {to: to + '@' + xmppConstants.DOMAIN},
          xml('reason', {}, 'Hey, this is the place with amazing cookies!'),
        ),
      ),
    );

    xmpp.send(stanza);
  };

  onDirectMessagePress = async () => {
    const otherUserWalletAddress = this.props.extraData?.walletFromJid;
    const myWalletAddress = this.props.loginReducer.initialData.walletAddress;
    const combinedWalletAddress = [myWalletAddress, otherUserWalletAddress]
      .sort()
      .join('_');

    const roomJid =
      combinedWalletAddress + '@' + xmppConstants.CONFERENCEDOMAIN;
    const combinedUsersName = [
      this.props.loginReducer.initialData.firstName,
      this.props.extraData.name.split(' ')[0],
    ]
      .sort()
      .join(' and ');
    console.log(combinedWalletAddress,underscoreManipulation(myWalletAddress), this.props.loginReducer.initialData.password, 'combined');
    this.createChatRoom(
      underscoreManipulation(myWalletAddress),
      combinedWalletAddress.toLowerCase(),
      combinedUsersName,
      this.props.loginReducer.initialData.username,
    );

    // setSubscriptions(
    //   underscoreManipulation(myWalletAddress),
    //    roomJid,
    //    this.props.loginReducer.initialData.username,
    //  );

    this.props.navigation.navigate('ChatHomeComponent');

    this.props.shouldCountAction(false);
    get_archive_by_room(roomJid.toLowerCase());

    this.props.setCurrentChatDetails(
      roomJid.toLowerCase(),
      combinedUsersName,
      this.props.navigation,
      // true
    );
    setTimeout(() => {
      this.sendInvite(
        underscoreManipulation(myWalletAddress),
        roomJid.toLowerCase(),
        underscoreManipulation(otherUserWalletAddress),
      );
    }, 3000);
    //  setTimeout(()=> {

    //   console.log('2000')

    //  }, 2000)
    this.closeModal();
  };

  render() {
    const {modalVisible} = this.state;
    let extraData = this.props.extraData;
    if (this.props.type === undefined || this.props.type === null) {
      return null;
    }

    if (this.props.type === 'privacyPolicy') {
      return (
        <Modal transparent animationType="fade" visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.privacyPolicyMainContainer}>
              <View style={styles.privacyPolicyBodySection}>
                {PrivacyPolicy()}
              </View>
              <View style={styles.privacyPolicyButtonSection}>
                <TouchableOpacity
                  style={styles.privacyAgree}
                  onPress={() => {
                    extraData.register();
                    this.closeModal();
                  }}>
                  <Text style={styles.privacyAgreeTextStyle}>Agree</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.privacyCancel}
                  onPress={() => this.closeModal()}>
                  <Text style={styles.privacyCancelTextStyle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    }

    if (this.props.type === 'loading') {
      return (
        <View>
          <Modal animationType="fade" transparent={true} visible={modalVisible}>
            <View styles={styles.centeredView}>
              <Text>Loading profile information...</Text>
              <ActivityIndicator
                animating={modalVisible}
                size="small"
                color={primaryColor}
              />
            </View>
          </Modal>
        </View>
      );
    }
    if (this.props.type === 'tokenTransfer') {
      const modalPosition =
        this.state.tokenState.type === 'receive' ? 'center' : 'flex-end';
      const modalBackgroundColor =
        this.state.tokenState.type === 'receive' ? '#ffff' : 'rgba(0,0,0,0.5)';
      const modalViewHeight =
        this.state.tokenState.type === 'receive' ? hp('30%') : hp('20%');
      const modalViewBackgroundColor =
        this.state.tokenState.type === 'receive' ? primaryColor : 'white';
      return (
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <View
              style={[
                styles.centeredView,
                {backgroundColor: modalBackgroundColor},
              ]}>
              <TouchableOpacity
                onPress={() => this.closeModal()}
                style={{
                  position: 'absolute',
                  height: hp('100%'),
                  width: wp('100%'),
                }}
              />
              <View
                style={[
                  styles.modalView,
                  {backgroundColor: modalViewBackgroundColor},
                ]}>
                <View style={styles.tokenTransferContainer}>
                  <TokenTransfer
                    state={this.state.tokenState}
                    tokenAmount={this.state.tokenAmount}
                    setTokenAmount={(amt) => this.setTokenAmount(amt)}
                    closeModal={() => this.closeModal()}
                    tokenTransferFunc={this.tokenTransferFunc}
                    name={extraData.name}
                  />
                </View>
                <Seperator />
                <SendItem />
                <Seperator />
                <DirectMessage onPress={this.onDirectMessagePress} />
                {/* <Seperator/>
              <ReportAndBlockButton type="0" />
              <ReportAndBlockButton type="1" /> */}
              </View>
            </View>
          </Modal>
        </View>
      );
    }

    if (this.props.type === 'generateQR') {
      return (
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View
              style={[
                styles.modalView,
                {borderRadius: 5, height: wp('80%'), width: wp('80%')},
              ]}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  height: hp('3.5%'),
                  width: hp('3.5%'),
                }}
                onPress={() => this.closeModal()}>
                <MaterialIcons name="close" size={hp('3.5%')} />
              </TouchableOpacity>
              <QRCodeComponent
                closeModal={() => this.closeModal()}
                chat_key={extraData}
              />
            </View>
          </View>
        </Modal>
      );
    }
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  privacyPolicyMainContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    height: hp('70%'),
    width: wp('80%'),
  },
  privacyPolicyBodySection: {
    flex: 0.9,
    width: '100%',
    padding: hp('2%'),
  },
  privacyPolicyButtonSection: {
    flex: 0.1,
    width: '100%',
    padding: hp('2%'),
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  privacyAgree: {
    height: hp('4%'),
    width: wp('15%'),
    backgroundColor: secondaryColor,
    margin: hp('1.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyAgreeTextStyle: {
    fontFamily: semiBoldFont,
    fontSize: hp('1.4%'),
    color: '#ffffff',
  },
  privacyCancel: {
    height: hp('4%'),
    width: wp('15%'),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyCancelTextStyle: {
    fontFamily: semiBoldFont,
    fontSize: hp('1.4%'),
    textDecorationLine: 'underline',
  },
  modalView: {
    margin: 20,
    // height:hp('60%'),
    width: wp('70%'),
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  row: {
    elevation: 1,
    borderRadius: 2,
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row', // main axis
    justifyContent: 'flex-start', // main axis
    alignItems: 'center', // cross axis
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 18,
    paddingRight: 16,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
  },
  sendItemAndDMContainer: {
    width: wp('50%'),
    height: hp('5%'),
    borderRadius: hp('1%'),
    borderWidth: 1,
    borderColor: primaryColor,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendItemAndDMIconContainer: {
    position: 'absolute',
    left: 10,
  },
  reportAndBlockContainer: {
    width: wp('50%'),
    height: hp('5%'),
    borderRadius: hp('1%'),
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B22222',
  },
  reportAndBlockText: {
    fontFamily: semiBoldFont,
    color: '#fff',
  },
  sendItemAndDMText: {
    fontFamily: regularFont,
  },
  seperator: {
    width: wp('40%'),
    height: 0,
    borderWidth: 1,
    borderColor: '#A1A1A1',
    margin: hp('1.5%'),
  },
  tokenTransferContainer: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenTransferHeaderText: {
    fontFamily: regularFont,
    fontSize: hp('1.5%'),
    margin: 5,
    textAlign: 'center',
  },
  gkcIconStyle: {
    height: hp('3%'),
    width: hp('3%'),
  },
  coinSetContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
});

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

module.exports = connect(mapStateToProps, {
  transferTokens,
  setCurrentChatDetails,
  shouldCountAction,
})(CommonModal);
