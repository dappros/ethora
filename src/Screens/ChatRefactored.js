/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {Component, Fragment, useEffect, useState} from 'react';
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
} from 'react-native';
import {connect, useDispatch, useSelector} from 'react-redux';
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
import AntIcon from 'react-native-vector-icons/AntDesign';

import {
  fetchRosterList,
  updateRosterList,
  updateChatRoom,
  getChatRoom,
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
import {commonColors, textStyles} from '../../docs/config';
import {underscoreManipulation} from '../helpers/underscoreLogic';
import * as xmppConstants from '../constants/xmppConstants';
import openChatFromChatLink from '../helpers/openChatFromChatLink';

import xml from '@xmpp/xml';
import {Swipeable} from 'react-native-gesture-handler';

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
  isActive,
  openChat,
  activeMenuIndex,
  walletAddress,
  onMenuHide,
  roomRoles,
}) => {
  const LeftActions = (progress, dragX) => {
    return (
      <>
        <TouchableOpacity onPress={() => unsubscribeFromRoom(item.jid)}>
          <View
            style={[chatHomeStyles.swipeActionItem, {backgroundColor: 'grey'}]}>
            <MaterialIcon name="volume-mute" size={hp('3%')} color={'white'} />
          </View>
        </TouchableOpacity>
        {roomRoles[item.jid] !== 'participant' && (
          <TouchableOpacity onPress={() => renameChat(item.jid, item.name)}>
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
    return (
      <>
        <TouchableOpacity onPress={() => leaveChat(item.jid)}>
          <View
            style={[chatHomeStyles.swipeActionItem, {backgroundColor: 'red'}]}>
            <AntIcon color={'white'} size={hp('3%')} name={'delete'} />
          </View>
        </TouchableOpacity>
      </>
    );
  };
  return (
    <Swipeable
      renderLeftActions={LeftActions}
      renderRightActions={RightActions}>
      <TouchableOpacity
        onPress={() => openChat(item.jid, item.name)}
        activeOpacity={0.6}
        onLongPress={drag}
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
    </Swipeable>
  );
};

export const ChatHome = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isScanResult, setIsScanResult] = useState(false);
  const [stanzaId, setStanzaId] = useState('subscribed_rooms');
  const [rosterListArray, setRosterListArray] = useState([]);
  const [refreing, setRefreing] = useState(false);
  const [walletAddress, setWalletAddres] = useState('');
  const [username, setUsername] = useState('');
  const [chatJID, setChatJID] = useState('');
  const [chatName, setChatName] = useState('');
  const [lastUserName, setLastUserName] = useState('');
  const [lastUserText, setLastUserText] = useState('');
  const [pushChatName, setPushChatName] = useState('');
  const [pushChatText, setPushChatText] = useState('');
  const [pushChatJID, setPushChatJID] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [pickedChatJid, setPickedChatJid] = useState('');

  const [newChatName, setNewChatName] = useState('');
  const loginReducer = useSelector(state => state.loginReducer);
  const chatReducer = useSelector(state => state.ChatReducer);
  const apiReducer = useSelector(state => state.apiReducer);

  const dispatch = useDispatch();

  // showMenu = item => {
  //   this.setState({
  //     chat_name: item.chat_name,
  //     chat_jid: item.chat_jid,
  //   });
  //   this._menu.show();
  // };

  const getRosterFromRealm = async () => {
    try {
      let rosterListFromRealm = await fetchRosterList();

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

      setRosterListArray(rosterListArrayTemp);
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   const {token} = loginReducer;
  //   Linking.getInitialURL().then(url => {
  //       if (url) {
  //         const chatJID = parseChatLink(url);
  //         setTimeout(() => {
  //           openChatFromChatLink(
  //             chatJID,
  //             loginReducer.initialData.walletAddress,
  //             dispatch(setCurrentChatDetails),
  //             navigation,
  //           );
  //         }, 2000);
  //       }
  //     });

  //     Linking.addEventListener('url', data => {
  //       if (data.url) {
  //         const chatJID = parseChatLink(data.url);
  //         openChatFromChatLink(
  //           chatJID,
  //          loginReducer.initialData.walletAddress,
  //           dispatch(setCurrentChatDetails),
  //           navigation,
  //         );
  //       }
  //     });

  //     fetchRosterList().then(rosterListFromRealm => {
  //       let loading = false;
  //       let pushChatName = '';
  //       let pushChatJID = '';
  //       if (rosterListFromRealm) {
  //         let roster = [];

  //         rosterListFromRealm.map(item => {
  //           if (item.jid === chatReducer.pushData.mucId) {
  //             pushChatName = item.name;
  //             pushChatJID = item.jid;
  //             loading = true;
  //           }

  //           roster.push({
  //             name: item.name,
  //             participants: item.participants,
  //             avatar: item.avatar,
  //             jid: item.jid,
  //             counter: item.counter,
  //             lastUserText: item.lastUserText,
  //             lastUserName: item.lastUserName,
  //             priority: item.priority,
  //             createdAt: item.createdAt,
  //           });
  //         });
  //       }
  // setRosterListArray(roster)
  // setPushChatName(pushChatName)
  // setPushChatJID(pushChatJID)
  // setLoading(loading)

  //     return () => {
  //     }
  // }, [])
  useEffect(() => {
    const getData = async () => {
      await getRosterFromRealm();
      dispatch(updatedRoster(false));
    };

    getData();
    return () => {};
  }, []);
  useEffect(() => {
    const getData = async () => {
      await getRosterFromRealm();
      dispatch(updatedRoster(false));
    };

    if (chatReducer.isRosterUpdated) getData();
    return () => {};
  }, [chatReducer.isRosterUpdated]);

  useEffect(() => {
    const rosterFromReducer = chatReducer.rosterList;
    if (rosterFromReducer.length) {
      let roster = [];
      roster.map((item, index) => {
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
      setRosterListArray(roster);
      setLoading(false);
    }
  }, [chatReducer.rosterList.length]);

  useEffect(() => {
    const recentRealtimeChat = chatReducer.recentRealtimeChat; //the recent message object from the reducer
    const from = recentRealtimeChat.name; //the nick name of the user who sent the message
    const roomJID = recentRealtimeChat.room_name; // the jid of the room
    const text = recentRealtimeChat.text; // the text message sent
    const modifiedRoster = rosterListArray;

    modifiedRoster.map(item => {
      if (item.jid === roomJID) {
        //the count will not happen if you are already inside the room
        if (chatReducer.shouldCount) {
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

    setRosterListArray(modifiedRoster);
  }, [chatReducer.recentRealtimeChat.message_id]);
  //execute if the component is updated with new chat_jid/room jid. When new room visited

  useEffect(() => {
    const getData = async () => {
      await getRosterFromRealm();
      dispatch(updatedRoster(false));
    };

    getData();
    dispatch(participantsUpdateAction(false));
  }, [chatReducer.participantsUpdate]);

  //participant number update

  const renameChat = (jid, name) => {
    setModalVisible(true);
    setPushChatJID(jid);
    setNewChatName(name);
  };

  const leaveTheRoom = jid => {
    // <presence
    // from='hag66@shakespeare.lit/pda'
    // to='coven@chat.shakespeare.lit/thirdwitch'
    // type='unavailable'/>

    let walletAddress = loginReducer.initialData.walletAddress;
    const manipulatedWalletAddress = underscoreManipulation(walletAddress);

    const presence = xml('presence', {
      from: manipulatedWalletAddress + '@' + apiReducer.xmppDomains.DOMAIN,
      to: jid + '/' + loginReducer.initialData.username,
      type: 'unavailable',
    });
    xmpp.send(presence);
  };

  const renameTheRoom = (jid, name) => {
    const initialData = loginReducer.initialData;
    let walletAddress = initialData.walletAddress;
    const manipulatedWalletAddress = underscoreManipulation(walletAddress);

    roomConfigurationForm(manipulatedWalletAddress, jid, {
      roomName: name,
    });
    fetchStanzaRosterList(manipulatedWalletAddress, subscriptionsStanzaID);

    // fetchStanzaRosterList(manipulatedWalletAddress, subscriptionsStanzaID);
  };
  const unsubscribeFromRoom = async jid => {
    let walletAddress = loginReducer.initialData.walletAddress;
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
          loginReducer.initialData.username,
        );
        updateChatRoom(jid, 'muted', false);
        Toast.show('Notifications unmuted', Toast.SHORT);
      }
      //   await getRosterFromRealm();
    });

    //   <iq from='hag66@shakespeare.example'
    //     to='coven@muc.shakespeare.example'
    //     type='set'
    //     id='E6E10350-76CF-40C6-B91B-1EA08C332FC7'>
    //   <unsubscribe xmlns='urn:xmpp:mucsub:0' />

    // </iq>
  };
  const setName = () => {
    // updateVCard(this.state.userAvatar, data);
    if (newChatName) {
      renameTheRoom(pickedChatJid, newChatName);
      setNewChatName('');
      setPickedChatJid('');
      setModalVisible(false);
    }
  };
  const onNameChange = text => {
    setNewChatName(text);
  };
  //view to display when Chat Home component is empty
  const chatEmptyComponent = () => {
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
            onPress={() => navigation.navigate('CreateNewChatComponent')}
            style={styles.button1Container}>
            <Text style={styles.button1}>Create new</Text>
          </TouchableOpacity>

          {/* Button to scan a chat qrcode */}
          <TouchableOpacity
            onPress={() => navigation.navigate('QRScreenComponent')}
            style={styles.button2Container}>
            <Text style={styles.button2}>Scan QR to join</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //View to display invite card
  const joinNewChatCard = () => {
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
  const onBackdropPress = () => {
    setModalVisible(false);
  };
  const storeRosterList = async value => {
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
    setRosterListArray(arr);
    // fetchStanzaRosterList(underscoreManipulation(this.props.loginReducer.initialData.walletAddress), subscriptionsStanzaID);
  };

  //fucntion to open a chat room
  const openChat = (chat_jid, chat_name) => {
    let changedRosterListArray = rosterListArray;
    changedRosterListArray.map(item => {
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
    setRosterListArray(changedRosterListArray);

    dispatch(shouldCountAction(false)); //this means we don't need to increase the counter as the user is already inside the room when this function was called

    get_archive_by_room(chat_jid);
    dispatch(setCurrentChatDetails(chat_jid, chat_name, navigation));
  };

  //View to display list of chats
  const chatListComponent = () => {
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
          isVisible={modalVisible}
          // onBackdropPress={this.onBackdropPress}
        >
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
              value={newChatName}
              onChangeText={text => onNameChange(text)}
              placeholder="Enter new chat name"
              placeholderTextColor={primaryColor}
            />

            <TouchableOpacity
              onPress={() => setName()}
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
        </Modal>
        <DraggableFlatList
          nestedScrollEnabled={true}
          //   onRelease={() => this.setState({movingActive: false})}
          data={rosterListArray.sort((a, b) => a.priority - b.priority)}
          renderItem={({item, index, drag, isActive}) => {
            return (
              <RenderDragItem
                key={index}
                index={index}
                roomRoles={chatReducer.roomRoles}
                item={item}
                isActive={true}
                openChat={() => openChat(item.jid, item.name)}
                drag={drag}
                renameChat={renameChat}
                leaveChat={leaveTheRoom}
                unsubscribeFromRoom={unsubscribeFromRoom}
                walletAddress={loginReducer.initialData.walletAddress}
                // onPress={ () => this.assetSelected(item) }
              />
            );
          }}
          keyExtractor={(item, index) => `draggable-item-${index}`}
          onDragEnd={({data}) => storeRosterList(data)}
        />
      </>

      // </ScrollView>
    );
  };

  //function to decide which view to display
  const setScreenFucntion = () => {
    //loading view
    if (loading) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text>Loading...</Text>
        </View>
      );
    }

    //when rosterListArray is empty and isScanresult is false display empty chat view
    else if (!rosterListArray.length) {
      return chatEmptyComponent();
    }

    //when isScanResult is true show invite card view
    else if (isScanResult) {
      return joinNewChatCard();
    }

    //when rosterListArray is not empty show Chat list view
    else if (rosterListArray.length) {
      return chatListComponent();
    }
    //else show chat Empty defaultly
    else {
      return chatEmptyComponent();
    }
  };

  return setScreenFucntion();
};

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
});
