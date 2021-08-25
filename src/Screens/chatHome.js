import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  RefreshControl,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';

import {Card} from 'react-native-elements';
import styles from './style/chatHomeStyle';
import {CommonTextInput} from '../components/shared/customTextInputs';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  setCurrentChatDetails,
  shouldCountAction,
  participantsUpdateAction,
  updatedRoster,
} from '../actions/chatAction';
import {logOut} from '../actions/auth';
import {getEmailList} from '../actions/accountAction';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  fetchRosterList,
  updateRosterList,
  updateChatRoom,
  getChatRoom,
} from '../components/realmModels/chatList';
import {
  get_archive_by_room,
  subscribe,
  fetchRosterlist as fetchStanzaRosterList,
  setSubscriptions,
  roomConfigurationForm,
} from '../helpers/xmppStanzaRequestMessages';
import {xmpp} from '../helpers/xmppCentral';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Menu, {MenuItem} from 'react-native-material-menu';

import * as connectionURL from '../config/url';
import fetchFunction from '../config/api';
import {gkHubspotToken} from '../config/token';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {commonColors, textStyles} from '../../docs/config';
import { underscoreManipulation } from '../helpers/underscoreLogic';
import * as xmppConstants from '../constants/xmppConstants'

const hitAPI = new fetchFunction();

const _ = require('lodash');
const subscriptionsStanzaID = 'subscriptions';

const {primaryColor, primaryDarkColor} = commonColors;
const {thinFont, regularFont, mediumFont, semiBoldFont, lightFont} = textStyles;

const RenderDragItem = ({
  item,
  index,
  drag,
  isActive,
  openChat,
  showMenu,
  activeMenuIndex,
  onMenuItemPress,
  walletAddress,
  setMenuRef,
  onMenuHide,
  roomRoles,
  movingActive,
}) => {
  console.log(roomRoles, item, 'activeee');
  return (
    <TouchableOpacity
      onPress={() => openChat(item.jid, item.name)}
      // onLongPress={drag}
      onLongPress={() => (!movingActive ? showMenu(index) : drag())}
      style={{
        backgroundColor:
          activeMenuIndex === index ? 'lightgrey' : 'transparent',
      }}
      key={index}>
      <View
        style={{
          flexDirection: 'row',
          margin: 20,
          alignItems: 'center',
          marginRight: 0,
          marginLeft: 0,
        }}>
        <View
          style={{
            flex: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {item.counter ? (
            <View
              style={{
                alignItems: 'flex-end',
                justifyContent: 'flex-end',

                flex: 1,
                zIndex: 1,
                alignSelf: 'flex-end',
                height: hp('5.5%'),
                width: hp('5.5%'),
                marginTop: hp('1%'),
                marginRight: hp('0.5'),
              }}>
              <View
                style={{
                  height: hp('2.1%'),
                  width: hp('2.1%'),

                  borderRadius: hp('2.1') / 2,
                  backgroundColor: '#FF0000',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: regularFont,
                    fontSize: hp('1%'),

                    color: '#FFFFFF',
                  }}>
                  {item.counter}
                </Text>
              </View>
            </View>
          ) : null}
          <ImageBackground
            imageStyle={{borderRadius: 5}}
            style={{
              height: hp('5.5%'),
              width: hp('5.5%'),
              // flex: 1,
              borderRadius: 5,
              position: 'absolute',
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: primaryDarkColor,
                backgroundColor: primaryDarkColor,
                height: hp('5.54%'),
                width: hp('5.54%'),
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                borderRadius: hp('0.7%'),
              }}>
              <Text
                style={{
                  color: 'white',
                  marginRight: 3,
                //   fontFamily: mediumRobotoFont,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}>
                {' '}
                {item.name[0] + (item.name[1] ? item.name[1] : '')}
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View
          style={{
            justifyContent: 'center',

            marginLeft: wp('0.1%'),
            flex: 1,
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: mediumFont,
              fontSize: hp('2%'),
              color: '#4C5264',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {item.name}
            {item.muted && (
              <IonIcon
                name="volume-mute-outline"
                size={hp('2%')}
                style={{
                  marginRight: hp('0.9%'),
                  marginLeft: hp('0.4%'),
                }}
              />
            )}
          </Text>

          {item.lastUserName ? (
            <Fragment>
              <View style={{flexDirection: 'row', marginTop: hp('0.8%')}}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: regularFont,
                    fontSize: hp('1.8%'),
                    color: '#4C5264',
                  }}>
                  {item.lastUserName}:{' '}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: thinFont,
                    fontSize: hp('1.8%'),
                    color: '#4C5264',
                  }}>
                  {item.lastUserText}
                </Text>
                <Text
                  style={{
                    fontFamily: regularFont,
                    fontSize: hp('1.2%'),
                    flex: 1,
                    color: '#BCC5D3',
                    marginTop: hp('0.6%'),
                  }}>{` :${item.createdAt.getHours()}:${item.createdAt.getMinutes()}`}</Text>
              </View>
            </Fragment>
          ) : (
            <Text
              numberOfLines={1}
              style={{
                fontFamily: thinFont,
                fontSize: hp('1.8%'),
                color: '#4C5264',
              }}>
              Join this chat to view updates
            </Text>
          )}
        </View>
        <View style={{flex: 0.17}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{height: hp('3.8%'), width: wp('15%')}}>
              <View
                style={{
                  // flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  // borderTopLeftRadius: 50,
                  // borderBottomLeftRadius: 50,
                  borderRadius: 10,
                  // width: 15,
                  // height: 15,
                  shadowOffset: {width: -1, height: 1},
                  shadowColor: primaryColor,
                  shadowOpacity: 1.0,
                  borderWidth: 1,
                  borderColor: 'white',
                  shadowRadius: 1,
                  backgroundColor: 'white',
                  // position: 'absolute',
                  // top: 25,
                  // left: 25,
                  // width: 20,
                  height: 20,
                  width: 40,
                  // boxShadowColor: 'grey'
                }}>
                <MaterialIcon
                  name="group"
                  size={hp('2%')}
                  style={{
                    marginRight: hp('0.9%'),
                    marginLeft: hp('0.4%'),
                  }}
                />
                <Text
                  style={{
                    fontSize: hp('1.5%'),
                    fontFamily: regularFont,
                  }}>
                  {item.participants}
                </Text>
              </View>
              <Menu
                onHidden={onMenuHide}
                ref={ref => setMenuRef(ref, index)}
                button={
                  <View>
                    {/* <Icon name="ellipsis-v" color="#FFFFFF" size={hp('3%')} /> */}
                  </View>
                }>
                {/* <MenuItem
                  textStyle={{
                    color: '#000000',
                    fontFamily: mediumFont,
                    fontSize: hp('1.6%'),
                  }}
                  onPress={() => onMenuItemPress(index, item.jid, 'mute')}>
                  {item.muted ? 'Unmute' : 'Mute'}
                </MenuItem> */}
                {/* <MenuItem
                  textStyle={{
                    color: '#000000',
                    fontFamily: mediumFont,
                    fontSize: hp('1.6%'),
                  }}
                  onPress={() => onMenuItemPress(index, item.jid, 'leave')}
                  // onPress={() => openKebabItem('profile')}
                >
                  Leave
                </MenuItem> */}

                <MenuItem
                  textStyle={{
                    color: '#000000',
                    fontFamily: mediumFont,
                    fontSize: hp('1.6%'),
                  }}
                  onPress={() => onMenuItemPress(index, item.jid, 'move')}>
                  Move
                </MenuItem>
                { roomRoles[item.jid] !== 'participant' && (
                  <MenuItem
                    textStyle={{
                      color: '#000000',
                      fontFamily: mediumFont,
                      fontSize: hp('1.6%'),
                    }}
                    onPress={() => onMenuItemPress(index, item.jid, 'rename')}>
                    Rename
                  </MenuItem>
                    )}
              </Menu>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

class ChatHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      error: null,
      searchText: null,
      isScanResult: false,
      stanzaId: 'subscribed_rooms',
      rosterListArray: [],
      refreshing: false,
      walletAddress: '',
      username: '',
      chat_jid: '',
      chat_name: '',
      lastUserName: '',
      lastUserText: '',
      pushChatName: '',
      pushChatJID: '',
      movingActive: false,
      modalVisible: false
    };
  }

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  onMenuHide = () => {
    this.setState({activeMenuIndex: null});
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = (item) => {
    console.log(this.props.ChatReducer.roomRoles, 'rooldklnflkdjsf')
    this.setState({
      chat_name: item.chat_name,
      chat_jid: item.chat_jid,
    });
    this._menu.show();
  };

  async componentDidMount() {
    const {token} = this.props.loginReducer;
    this.props.getEmailList(token);

    fetchRosterList().then((rosterListFromRealm) => {
      let loading = false;
      let pushChatName = '';
      let pushChatJID = '';
      if (rosterListFromRealm) {
        let rosterListArray = [];

        rosterListFromRealm.map((item) => {
          if (item.jid === this.props.ChatReducer.pushData.mucId) {
            pushChatName = item.name;
            pushChatJID = item.jid;
            loading = true;
          }

          rosterListArray.push({
            name: item.name,
            participants: item.participants,
            avatar: item.avatar,
            jid: item.jid,
            counter: item.counter,
            lastUserText: item.lastUserText,
            lastUserName: item.lastUserName,
             priority: item.priority,
            createdAt: item.createdAt,
          });
        });

        this.setState({
          rosterListArray,
          pushChatName,
          pushChatJID,
          loading,
        });
      }
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (xmpp) {
      //when roster updated with human readable chat room names call the realm for the same.
      if (this.props.ChatReducer.isRosterUpdated) {
        let {pushChatJID, pushChatName} = this.state;
        fetchRosterList()
          .then((rosterListFromRealm) => {
            if (rosterListFromRealm) {
              let rosterListArrayTemp = [];
              rosterListFromRealm.map((item) => {
                rosterListArrayTemp.push({
                  name: item.name,
                  participants: item.participants,
                  avatar: item.avatar,
                  jid: item.jid,
                  counter: item.counter,
                  lastUserText: item.lastUserText,
                  lastUserName: item.lastUserName,
                   priority: item.priority,
                  createdAt: item.createdAt,
                });
              });

              this.setState({
                rosterListArray: rosterListArrayTemp,
              });
            }
          })
          .then(() => {
            this.props.updatedRoster(false);
          })
          .then(() => {
            if (pushChatJID && pushChatName) {
              this.setState(
                {
                  pushChatJID: '',
                  pushChatName: '',
                  loading: false,
                },
                () => this.openChat(pushChatJID, pushChatName),
              );
            }
          });
      }

      //execute if the component is updated with new chat_jid/room jid. When new room visited
      if (
        this.props.ChatReducer.rosterList.length !==
          prevProps.ChatReducer.rosterList.length &&
        this.props.ChatReducer.rosterList.length > 0
      ) {
        const rosterFromReducer = this.props.ChatReducer.rosterList;
        if (rosterFromReducer) {
          let rosterListArray = [];
          rosterFromReducer.map((item, index) => {
            rosterListArray.push({
              name: item.name,
              participants: item.participants,
              avatar: item.avatar,
              jid: item.jid,
              counter: item.counter,
              lastUserText: item.lastUserText,
              lastUserName: item.lastUserName,
               priority: item.priority,
              createdAt: item.createdAt,
            });
          });

          this.setState({
            rosterListArray,
            loading: false,
          });
        }
      }
      if (
        this.props.ChatReducer.recentRealtimeChat.message_id !==
        prevProps.ChatReducer.recentRealtimeChat.message_id
      ) {
        const recentRealtimeChat = this.props.ChatReducer.recentRealtimeChat; //the recent message object from the reducer
        const from = recentRealtimeChat.name; //the nick name of the user who sent the message
        const roomJID = recentRealtimeChat.room_name; // the jid of the room
        const text = recentRealtimeChat.text; // the text message sent

        let rosterListArray = this.state.rosterListArray;

        rosterListArray.map((item) => {
          if (item.jid === roomJID) {
            //the count will not happen if you are already inside the room
            if (this.props.ChatReducer.shouldCount) {
              item.counter = item.counter + 1;
            }
            item.lastUserName = from;
            item.lastUserText = text;
            item.createdAt = recentRealtimeChat.createdAt;
            item.priority = recentRealtimeChat?.priority;

            updateRosterList({
              jid: roomJID,
              lastUserName: from,
              lastUserText: text,
              counter: item.counter,
              createdAt: recentRealtimeChat.createdAt,
              participants: null,
              name: null,
            });
          }
        });

        this.setState({
          rosterListArray,
        });
      }

      //participant number update
      if (
        this.props.ChatReducer.participantsUpdate !==
          prevProps.ChatReducer.participantsUpdate &&
        this.props.ChatReducer.participantsUpdate
      ) {
        fetchRosterList().then((rosterListFromRealm) => {
          let rosterListArray = [];
          rosterListFromRealm.map((item) => {
            rosterListArray.push({
              name: item.name,
              participants: item.participants,
              avatar: item.avatar,
              jid: item.jid,
              counter: item.counter,
              lastUserText: item.lastUserText,
              lastUserName: item.lastUserName,
               priority: item.priority,
              createdAt: item.createdAt,
            });
          });
          this.setState({
            rosterListArray,
          });

          this.props.participantsUpdateAction(false);
        });
      }
    }
  }
  onMenuItemPress = (index, jid, type) => {
    const initialData = this.props.loginReducer.initialData;
    let walletAddress = initialData.walletAddress;
    const manipulatedWalletAddress = underscoreManipulation(walletAddress);

    if (type === 'mute') {
      this.unsubscribeFromRoom(jid);
      this.hideMenu(index);
    }

    if (type === 'leave') {
      this.leaveTheRoom(jid);
      this.hideMenu(index);
    }
    if (type === 'rename') {
      this.setState({modalVisible: true, pickedChatJid: jid});
      this.hideMenu(index);
    }
    if (type === 'move') {
      this.setState({movingActive: true});
      this.hideMenu(index);
    }
    // fetchStanzaRosterList(manipulatedWalletAddress, subscriptionsStanzaID);
  };
  leaveTheRoom = jid => {
    // <presence
    // from='hag66@shakespeare.lit/pda'
    // to='coven@chat.shakespeare.lit/thirdwitch'
    // type='unavailable'/>

    let walletAddress = this.props.loginReducer.initialData.walletAddress;
    const manipulatedWalletAddress = underscoreManipulation(walletAddress);

    const presence = xml('presence', {
      from: manipulatedWalletAddress + '@' + xmppConstants.DOMAIN,
      to: jid + '/' + this.props.loginReducer.initialData.username,
    });
    xmpp.send(presence);
  };

  renameTheRoom = (jid, name) => {
    const initialData = this.props.loginReducer.initialData;
    let walletAddress = initialData.walletAddress;
    const manipulatedWalletAddress = underscoreManipulation(walletAddress);

    roomConfigurationForm(manipulatedWalletAddress, jid, {
      roomName: name,
    });
    fetchStanzaRosterList(manipulatedWalletAddress, subscriptionsStanzaID);

    // fetchStanzaRosterList(manipulatedWalletAddress, subscriptionsStanzaID);
  };
  unsubscribeFromRoom = jid => {
    let walletAddress = this.props.loginReducer.initialData.walletAddress;
    const manipulatedWalletAddress = underscoreManipulation(walletAddress);
    getChatRoom(jid).then(room => {
      if (!room.muted) {
        const message = xml(
          'iq',
          {
            from: manipulatedWalletAddress + '@' + xmppConstants.DOMAIN,
            to: jid,
            type: 'set',
            id: 'unsubscribe',
          },
          xml(
            'unsubscribe',
            {
              xmlns: 'urn:xmpp:mucsub:0',
              // nick: nickName,
            },
            // xml('event', {node: 'urn:xmpp:mucsub:nodes:messages'}),
            // xml('event', {node: 'urn:xmpp:mucsub:nodes:subject'}),
          ),
        );
        xmpp.send(message);
        updateChatRoom(jid, 'muted', true);
      } else {
        setSubscriptions(
          manipulatedWalletAddress,
          jid,
          this.props.loginReducer.initialData.username,
        );
        updateChatRoom(jid, 'muted', false);
        Toast.show('Notifications unmuted', Toast.SHORT);
      }
      fetchRosterList().then(rosterListFromRealm => {
        console.log(rosterListFromRealm, 'roster from ');
        let rosterListArray = [];
        rosterListFromRealm.map(item => {
          rosterListArray.push({
            name: item.name,
            participants: item.participants,
            avatar: item.avatar,
            jid: item.jid,
            counter: item.counter,
            lastUserText: item.lastUserText,
            lastUserName: item.lastUserName,
            createdAt: item.createdAt,
            muted: item.muted,
            priority: item.priority,
          });
        });
        this.setState({
          rosterListArray,
        });
      });
    });

    //   <iq from='hag66@shakespeare.example'
    //     to='coven@muc.shakespeare.example'
    //     type='set'
    //     id='E6E10350-76CF-40C6-B91B-1EA08C332FC7'>
    //   <unsubscribe xmlns='urn:xmpp:mucsub:0' />

    // </iq>
  };
  setNewChatName = () => {
    // updateVCard(this.state.userAvatar, data);
    if (this.state.newChatName) {
      this.renameTheRoom(this.state.pickedChatJid, this.state.newChatName);
      this.setState({newChatName: '', pickedChatJid: ''});
    }
    this.setState({modalVisible: false});
  };
  onNameChange = text => {
    this.setState({newChatName: text});
  };
  setMenuRef = (ref, index) => {
    this[`menu${index}`] = ref;
  };

  hideMenu = index => {
    this[`menu${index}`].hide();
  };

  showMenu = (index, item) => {
    this.setState({activeMenuIndex: index});

    this[`menu${index}`].show();
  };



  //view to display when Chat Home component is empty
  chatEmptyComponent = () => {
    return (
      <View style={styles.emptyChatContainer}>
        <View>
          <Image source={require('../assets/chatEmpty.png')} />
        </View>
        <View
          style={{
            justifyContent: 'center',
            margin: 5,
          }}>
          <Text style={styles.noChatText}>No chats found</Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            margin: 5,
          }}>
          <Text style={styles.descText}>
            You can start by creating new chats orjoin existing chats
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 20,
          }}>
          {/* Button to create new chat qrcode */}
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('CreateNewChatComponent')
            }
            style={styles.button1Container}>
            <Text style={styles.button1}>Create new</Text>
          </TouchableOpacity>

          {/* Button to scan a chat qrcode */}
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('QRScreenComponent')}
            style={styles.button2Container}>
            <Text style={styles.button2}>Scan QR to join</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //View to display invite card
  joinNewChatCard = () => {
    return (
      <View>
        <Card containerStyle={{borderRadius: 4}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.2}}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: primaryColor,
                  height: hp('5.54%'),
                  width: hp('5.54%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: hp('0.7%'),
                }}>
                <MaterialIcon
                  name="group"
                  size={hp('4.06%')}
                  style={{marginRight: hp('0.9%'), marginLeft: hp('0.4%')}}
                  color={primaryColor}
                />
              </View>
            </View>
            <View style={{flex: 0.8}}>
              <View>
                <Text
                  style={{
                    color: '#4C5264',
                    fontFamily: semiBoldFont,
                    fontSize: hp('1.9%'),
                  }}>
                  Managing company
                </Text>
                <Text
                  style={{
                    color: '#4C5264',
                    fontFamily: regularFont,
                    fontSize: hp('1.6%'),
                  }}>
                  We are a group of blockchain expertsto help you in technical
                  developmentand business queries.
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <TouchableOpacity
                  style={{
                    width: wp('25%'),
                    height: hp('5%'),
                    backgroundColor: primaryColor,
                    borderRadius: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontFamily: regularFont,
                      fontSize: hp('1.8%'),
                    }}>
                    Join
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: wp('25%'),
                    height: hp('5%'),
                    borderWidth: 1,
                    borderColor: '#FF0000',
                    borderRadius: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      color: '#FF0000',
                      fontFamily: regularFont,
                      fontSize: hp('1.8%'),
                    }}>
                    Decline
                  </Text>
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
    );
  };
  onBackdropPress = () => {
    this.setState({
      modalVisible: false,
    });
  };
  storeRosterList = async value => {
    let map = {};
    let arr = value.map((item, index) => {
      item.priority = index;
      map[item.jid] = item.priority;

      // insertRosterList(item)
      return item;
    });
    try {
      await AsyncStorage.setItem('rosterListHashMap', JSON.stringify(map));
    } catch (e) {
      // saving error
      console.log('savingError');
    }
    //  console.log(map, 'arrrrrrr')
    this.setState({rosterListArray: arr});
    // fetchStanzaRosterList(underscoreManipulation(this.props.loginReducer.initialData.walletAddress), subscriptionsStanzaID);
  };

  //fucntion to open a chat room
  openChat(chat_jid, chat_name) {
    let rosterListArray = this.state.rosterListArray;
    rosterListArray.map((item) => {
      if (item.counter !== 0) {
        item.counter = 0;
      }
    });
    updateRosterList({
      counter: 0,
      jid: chat_jid,
      lastUserName: null,
      lastUserText: null,
      participants: null,
      createdAt: null,
      name: null,
    });
    this.setState({
      rosterListArray,
    });

    this.props.shouldCountAction(false); //this means we don't need to increase the counter as the user is already inside the room when this function was called

    get_archive_by_room(chat_jid);
    this.props.setCurrentChatDetails(
      chat_jid,
      chat_name,
      this.props.navigation,
    );
  }

  //View to display list of chats
  chatListComponent = () => {
    return (
      // <ScrollView
      //   keyboardShouldPersistTaps="always"
      //   nestedScrollEnabled={true}
      //   refreshControl={
      //     <RefreshControl
      //       refreshing={this.state.refreshing}
      //       onRefresh={() => this.onRefresh}
      //     />
      //   }
      //   style={{flex: 1}}>
      <>
        <DraggableFlatList
          nestedScrollEnabled={true}
          onRelease={() => this.setState({movingActive: false})}
          data={this.state.rosterListArray.sort(
            (a, b) => a.priority - b.priority,
          )}
          renderItem={({item, index, drag, isActive}) => {
            return (
              <RenderDragItem
                key={index}
                index={index}
                roomRoles={this.props.ChatReducer.roomRoles}
                item={item}
                isActive={isActive}
                openChat={() => this.openChat(item.jid, item.name)}
                showMenu={this.showMenu}
                setMenuRef={this.setMenuRef}
                drag={drag}
                onMenuHide={this.onMenuHide}
                activeMenuIndex={this.state.activeMenuIndex}
                onMenuItemPress={this.onMenuItemPress}
                movingActive={this.state.movingActive}
                walletAddress={
                  this.props.loginReducer.initialData.walletAddress
                }
                // onPress={ () => this.assetSelected(item) }
              />
            );
          }}
          keyExtractor={(item, index) => `draggable-item-${index}`}
          onDragEnd={({data}) => this.storeRosterList(data)}
        />
         <Modal
          animationType="slide"
          transparent={true}
          isVisible={this.state.modalVisible}
          onBackdropPress={this.onBackdropPress}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          {true ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 8,
                paddingVertical: 20,
              }}>
              <CommonTextInput
                maxLength={128}
                containerStyle={{
                  borderWidth: 0.5,
                  // borderTopWidth: 0,
                  borderColor: primaryColor,
                  backgroundColor: 'white',
                  width: wp('81%'),
                  height: hp('6.8%'),
                  // padding: hp('2.4'),
                  paddingLeft: wp('3.73'),
                  borderRadius: 0,
                  marginBottom: 10,
                  // marginTop: 10
                }}
                fontsStyle={{
                  fontFamily: lightFont,
                  fontSize: hp('1.6%'),
                  color: 'black',
                }}
                value={this.state.newChatName}
                onChangeText={text => this.onNameChange(text)}
                placeholder="Enter new chat name"
                placeholderTextColor={primaryColor}
              />

              <TouchableOpacity
                onPress={() => this.setNewChatName()}
                style={{
                  backgroundColor: primaryColor,
                  borderRadius: 5,
                  height: hp('4.3'),
                  padding: 4,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <Text style={{...styles.createButtonText, color: 'white'}}>
                    Done editing
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
        </Modal>
        </>
       
      // </ScrollView>
    );
  };

  //function to decide which view to display
  setScreenFucntion = () => {
    //loading view
    if (this.state.loading) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text>Loading...</Text>
        </View>
      );
    }

    //when rosterListArray is empty and isScanresult is false display empty chat view
    else if (!this.state.rosterListArray.length && !this.state.isScanResult) {
      return this.chatEmptyComponent();
    }

    //when isScanResult is true show invite card view
    else if (this.state.isScanResult) {
      return this.joinNewChatCard();
    }

    //when rosterListArray is not empty show Chat list view
    else if (this.state.rosterListArray.length) {
      return this.chatListComponent();
    }
    //else show chat Empty defaultly
    else {
      return this.chatEmptyComponent();
    }
  };

  render() {
    return <View style={styles.container}>{this.setScreenFucntion()}</View>;
  }
}

const mapStateToProps = (state) => {
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
  logOut,
})(ChatHome);
