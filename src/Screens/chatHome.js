/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {
  Component,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Linking,
  Alert,
  NativeModules,
  TouchableHighlight,
  Animated,
  StyleSheet,
  Easing,
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';

import {Card} from 'react-native-elements';
import styles from './style/chatHomeStyle';
import {CommonTextInput} from '../components/shared/customTextInputs';
import parseChatLink from '../helpers/parseChatLink';
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
import IonIcons from 'react-native-vector-icons/Ionicons';

import AntIcon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';


import {
  fetchRosterList,
  updateRosterList,
  updateChatRoom,
  getChatRoom,
  deleteChatRoom,
} from '../components/realmModels/chatList';
import {
  get_archive_by_room,
  fetchRosterlist as fetchStanzaRosterList,
  setSubscriptions,
  roomConfigurationForm,
  getUserRooms,
} from '../helpers/xmppStanzaRequestMessages';
import {xmpp} from '../helpers/xmppCentral';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Menu, {MenuItem} from 'react-native-material-menu';
import fetchFunction from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {commonColors, defaultChats, textStyles} from '../../docs/config';
import {underscoreManipulation} from '../helpers/underscoreLogic';
import * as xmppConstants from '../constants/xmppConstants';
import openChatFromChatLink from '../helpers/openChatFromChatLink';

import xml from '@xmpp/xml';
import {Swipeable} from 'react-native-gesture-handler';
import {joinNewChatCard} from '../components/ChatHome/JoinNewChatCard';
import {ChatEmptyComponent} from '../components/ChatHome/ChatEmpty';
import {FloatingActionButton} from '../components/FloatingActionButton';
// import { ChatHomeItem } from '../components/ChatHome/ChatHomeItem';

const _ = require('lodash');
const subscriptionsStanzaID = 'subscriptions';

const {primaryColor, primaryDarkColor} = commonColors;
const {thinFont, regularFont, mediumFont, semiBoldFont, lightFont} = textStyles;

const RenderDragItem = ({
  item,
  index,
  drag,
  renameChat,
  leaveChat,
  unsubscribeFromRoom,
  openChat,
  activeMenuIndex,
  roomRoles,
  movingActive,
}) => {
  const ref = useRef();
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const stopAnimation = () => {
    // Animated.sequence(animation).stop();
    animation.stopAnimation();
    animation.setValue(0);
  };
  const startShake = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(animation, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]),
    ).start();
  };

  useEffect(() => {
    if (movingActive) {
      startShake();
    } else {
      stopAnimation();
    }
  }, [movingActive]);
  const LeftActions = (progress, dragX) => {
    return (
      <>
        {/* <TouchableOpacity
          onPress={() => {
            unsubscribeFromRoom(item.jid);
            ref.current.close();
          }}>
          <View
            style={[chatHomeStyles.swipeActionItem, {backgroundColor: 'grey'}]}>
            <IonIcons name="notifications" size={hp('3%')} color={'white'} />
          </View>
        </TouchableOpacity> */}
        {roomRoles[item.jid] !== 'participant' && (
          <TouchableOpacity
            onPress={() => {
              renameChat(item.jid, item.name);
              ref.current.close();
            }}>
            <View
              style={[
                chatHomeStyles.swipeActionItem,
                {backgroundColor: primaryDarkColor},
              ]}>
              <AntIcon color={'white'} size={hp('3%')} name={'edit'} />
            </View>
          </TouchableOpacity>
        )}
      </>
    );
  };
  const RightActions = (progress, dragX) => {
    const jidWithoutConference = item.jid?.split('@')[0];
    return (
      <>
        {!defaultChats[jidWithoutConference] && (
          <TouchableOpacity
            onPress={() => {
              leaveChat(item.jid);
              ref.current.close();
            }}>
            <View
              style={[
                chatHomeStyles.swipeActionItem,
                {backgroundColor: 'red'},
              ]}>
              <AntIcon color={'white'} size={hp('3%')} name={'delete'} />
            </View>
          </TouchableOpacity>
        )}
      </>
    );
  };
  return (
    <Swipeable
      ref={ref}
      renderLeftActions={LeftActions}
      renderRightActions={RightActions}>
      {/* <ChatHomeItem onItemPress={() => openChat(item.jid, item.name)} onItemLongPress={drag} item={item} /> */}
      <Animated.View style={{transform: [{translateX: animation}]}}>
        <TouchableOpacity
          onPress={() => openChat(item.jid, item.name)}
          activeOpacity={0.6}
          onLongPress={() => movingActive && drag()}
          style={{
            backgroundColor: activeMenuIndex === index ? 'lightgrey' : 'white',
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
                <View style={chatHomeStyles.chatHomeItemIcon}>
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
                        width: wp('30%'),
                      }}>
                      {item.lastUserText}
                    </Text>
                    <Text
                      style={{
                        fontFamily: regularFont,
                        fontSize: hp('1.2%'),
                        // flex: 1,
                        color: '#BCC5D3',
                        marginTop: hp('0.6%'),
                      }}>{` ${item.createdAt.getHours()}:${item.createdAt.getMinutes()}`}</Text>
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
                  <View style={chatHomeStyles.chatHomeItemParticipants}>
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
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
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
      modalVisible: false,
    };
  }

  setMenuRef = ref => {
    this._menu = ref;
  };

  onMenuHide = () => {
    this.setState({activeMenuIndex: null});
  };

  hideMenu = () => {
    this._menu.hide();
  };

  // showMenu = item => {
  //   this.setState({
  //     chat_name: item.chat_name,
  //     chat_jid: item.chat_jid,
  //   });
  //   this._menu.show();
  // };
  getRosterList = () => {
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
  };
  async componentDidMount() {
    const {token} = this.props.loginReducer;
    // this.props.getEmailList(token);
    Linking.getInitialURL().then(url => {
      if (url) {
        const chatJID = parseChatLink(url);
        setTimeout(() => {
          openChatFromChatLink(
            chatJID,
            this.props.loginReducer.initialData.walletAddress,
            this.props.setCurrentChatDetails,
            this.props.navigation,
          );
        }, 2000);
      }
    });

    Linking.addEventListener('url', data => {
      if (data.url) {
        const chatJID = parseChatLink(data.url);
        openChatFromChatLink(
          chatJID,
          this.props.loginReducer.initialData.walletAddress,
          this.props.setCurrentChatDetails,
          this.props.navigation,
        );
      }
    });

    fetchRosterList().then(rosterListFromRealm => {
      let loading = false;
      let pushChatName = '';
      let pushChatJID = '';
      if (rosterListFromRealm) {
        let rosterListArray = [];

        rosterListFromRealm.map(item => {
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
          .then(rosterListFromRealm => {
            if (rosterListFromRealm) {
              let rosterListArrayTemp = [];
              rosterListFromRealm.map(item => {
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

        rosterListArray.map(item => {
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
        fetchRosterList().then(rosterListFromRealm => {
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
  renameChat = (jid, name) => {
    this.setState({
      modalVisible: true,
      pickedChatJid: jid,
      newChatName: name,
    });
  };
  onMenuItemPress = (index, jid, type, name) => {
    if (type === 'mute') {
      this.unsubscribeFromRoom(jid);
      this.hideMenu(index);
    }

    if (type === 'leave') {
      this.leaveTheRoom(jid);
      this.hideMenu(index);
    }

    if (type === 'move') {
      this.setState({movingActive: true});
      this.hideMenu(index);
    }
    // fetchStanzaRosterList(manipulatedWalletAddress, subscriptionsStanzaID);
  };

  toggleMovingChats = () => {
    this.setState({movingActive: !this.state.movingActive});
  };
  leaveTheRoom = async jid => {
    // <presence
    // from='hag66@shakespeare.lit/pda'
    // to='coven@chat.shakespeare.lit/thirdwitch'
    // type='unavailable'/>
    await deleteChatRoom(jid);

    let walletAddress = this.props.loginReducer.initialData.walletAddress;
    const manipulatedWalletAddress = underscoreManipulation(walletAddress);

    const presence = xml('presence', {
      from:
        manipulatedWalletAddress +
        '@' +
        this.props.apiReducer.xmppDomains.DOMAIN,
      to: jid + '/' + this.props.loginReducer.initialData.username,
      type: 'unavailable',
    });
    xmpp.send(presence);
    this.unsubscribeFromRoom(jid);

    this.getRosterList();
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
      // if (!room.muted) {
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
          xml('event', {node: 'urn:xmpp:mucsub:nodes:messages'}),
          xml('event', {node: 'urn:xmpp:mucsub:nodes:subject'}),
        ),
      );
      xmpp.send(message);
      updateChatRoom(jid, 'muted', true);
      // } else {
      //   setSubscriptions(
      //     manipulatedWalletAddress,
      //     jid,
      //     this.props.loginReducer.initialData.username,
      //   );
      //   updateChatRoom(jid, 'muted', false);
      //   // Toast.show('Notifications unmuted', Toast.SHORT);
      // }
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
  // setMenuRef = (ref, index) => {
  //   this[`menu${index}`] = ref;
  // };

  // hideMenu = index => {
  //   this[`menu${index}`].hide();
  // };

  // showMenu = (index, item) => {
  //   this.setState({activeMenuIndex: index});
  //   this[`menu${index}`].show();
  // };

  //view to display when Chat Home component is empty

  //View to display invite card

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
    rosterListArray.map(item => {
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
        <Modal
          animationType="slide"
          transparent={true}
          isVisible={this.state.modalVisible}
          // onBackdropPress={this.onBackdropPress}
        >
          <View style={chatHomeStyles.modalContainer}>
            <CommonTextInput
              maxLength={128}
              containerStyle={chatHomeStyles.modalInput}
              fontsStyle={chatHomeStyles.modalInputText}
              value={this.state.newChatName}
              onChangeText={text => this.onNameChange(text)}
              placeholder="Enter new chat name"
              placeholderTextColor={primaryColor}
            />

            <TouchableOpacity
              onPress={() => this.setNewChatName()}
              style={chatHomeStyles.modalButton}>
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
        </Modal>
        <FloatingActionButton
          style={{position: 'absolute', bottom: 10, right: 10}}
          action={this.toggleMovingChats}>
          {this.state.movingActive ? (
            <AntIcon color={'white'} size={hp('3%')} name={'check'} />
          ) : (
            <Entypo color={'white'} size={hp('3%')} name={'list'} />
          )}
        </FloatingActionButton>
        <DraggableFlatList
          nestedScrollEnabled={true}
          // onRelease={() => this.setState({movingActive: false})}
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
                renameChat={this.renameChat}
                leaveChat={this.leaveTheRoom}
                unsubscribeFromRoom={this.unsubscribeFromRoom}
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
      return <ChatEmptyComponent navigation={this.props.navigation} />;
    }

    //when isScanResult is true show invite card view
    else if (this.state.isScanResult) {
      return <joinNewChatCard />;
    }

    //when rosterListArray is not empty show Chat list view
    else if (this.state.rosterListArray.length) {
      return this.chatListComponent();
    }
    //else show chat Empty defaultly
    else {
      return <ChatEmptyComponent navigation={this.props.navigation} />;
    }
  };

  render() {
    return <View style={styles.container}>{this.setScreenFucntion()}</View>;
  }
}

const chatHomeStyles = StyleSheet.create({
  swipeActionItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    // borderRadius: 4
  },
  chatHomeItemParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 10,
    shadowOffset: {width: -1, height: 1},
    shadowColor: primaryColor,
    shadowOpacity: 1.0,
    borderWidth: 1,
    borderColor: 'white',
    shadowRadius: 1,
    backgroundColor: 'white',

    height: 20,
    width: 40,
  },
  chatHomeItemIcon: {
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
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 20,
  },
  modalInput: {
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
  },
  modalButton: {
    backgroundColor: primaryColor,
    borderRadius: 5,
    height: hp('4.3'),
    padding: 4,
  },
  modalInputText: {
    fontFamily: lightFont,
    fontSize: hp('1.6%'),
    color: 'black',
  },
});

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
  logOut,
})(ChatHome);
