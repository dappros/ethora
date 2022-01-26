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

import {Badge, Card} from 'react-native-elements';
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
  roomConfigurationForm,
  unsubscribeFromChatXmpp,
  leaveRoomXmpp,
  getUserRooms,
  setSubscriptions,
  subscribeToRoom,
} from '../helpers/xmppStanzaRequestMessages';
import {xmpp} from '../helpers/xmppCentral';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {commonColors, defaultChats, textStyles} from '../../docs/config';
import {underscoreManipulation} from '../helpers/underscoreLogic';
import openChatFromChatLink from '../helpers/openChatFromChatLink';

import xml from '@xmpp/xml';
import {ChatEmptyComponent} from '../components/ChatHome/ChatEmpty';
import {FloatingActionButton} from '../components/FloatingActionButton';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {ChatDragItem} from '../components/ChatDragItem';
// import { ChatHomeItem } from '../components/ChatHome/ChatHomeItem';

const _ = require('lodash');
const subscriptionsStanzaID = 'subscriptions';

const {primaryColor, primaryDarkColor} = commonColors;
const {lightFont} = textStyles;

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
      routeIndex: 0,
      routes: [
        {key: 'official', title: 'Official'},
        {key: 'private', title: 'Private'},
        {key: 'groups', title: 'Groups'},
      ],
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
            muted: item.muted,
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
                  muted: item.muted,
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
              muted: item.muted,
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
              muted: item.muted,
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

    leaveRoomXmpp(
      manipulatedWalletAddress,
      jid,
      this.props.loginReducer.initialData.username,
    );
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
    // fetchStanzaRosterList(manipulatedWalletAddress, subscriptionsStanzaID);
    getUserRooms(manipulatedWalletAddress);

    // fetchStanzaRosterList(manipulatedWalletAddress, subscriptionsStanzaID);
  };
  unsubscribeFromRoom = jid => {
    let walletAddress = this.props.loginReducer.initialData.walletAddress;
    const manipulatedWalletAddress = underscoreManipulation(walletAddress);
    getChatRoom(jid).then(room => {
      if (!room.muted) {
        unsubscribeFromChatXmpp(manipulatedWalletAddress, jid);
      } else {
        subscribeToRoom(jid, manipulatedWalletAddress);
        // updateChatRoom(jid, 'muted', false);
        this.getRosterList();

        // Toast.show('Notifications unmuted', Toast.SHORT);
      }
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
    const newRoster = this.state.rosterListArray.filter(
      item => arr.indexOf(item) === -1,
    );
    try {
      await AsyncStorage.setItem('rosterListHashMap', JSON.stringify(map));
    } catch (e) {
      // saving error
      console.log('savingError');
    }
    this.setState({rosterListArray: [...arr, ...newRoster]});
    // fetchStanzaRosterList(underscoreManipulation(this.props.loginReducer.initialData.walletAddress), subscriptionsStanzaID);
  };

  //fucntion to open a chat room
  openChat(chat_jid, chat_name) {
    let rosterListArray = this.state.rosterListArray;
    let pickedChatItem = null;
    rosterListArray.map(item => {
      if (item.jid === chat_jid) {
        pickedChatItem = item;
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
      priority: pickedChatItem.priority,
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
  chatListComponent = chats => {
    // console.log(chats)
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
          data={chats.sort((a, b) => a.priority - b.priority)}
          renderItem={({item, index, drag, isActive}) => {
            return (
              <ChatDragItem
                key={index}
                index={index}
                item={item}
                isActive={isActive}
                openChat={() => this.openChat(item.jid, item.name)}
                drag={drag}
                renameChat={this.renameChat}
                leaveChat={this.leaveTheRoom}
                unsubscribeFromRoom={this.unsubscribeFromRoom}
                movingActive={this.state.movingActive}
              />
            );
          }}
          keyExtractor={(item, index) => `draggable-item-${item.jid}`}
          onDragEnd={({data}) => this.storeRosterList(data)}
        />
      </>

      // </ScrollView>
    );
  };
  renderTabBar = props => {
    return (
      <TabBar
        {...props}
        renderBadge={({route}) => {
          if (props.navigationState.notificationsCount[route.key])
            return (
              <Badge
                badgeStyle={{
                  borderWidth: 0,
                  backgroundColor: commonColors.primaryDarkColor,
                  marginTop: 16,
                }}
                value={props.navigationState.notificationsCount[route.key]}
              />
            );
        }}
        indicatorStyle={{backgroundColor: 'white'}}
        style={{backgroundColor: commonColors.primaryColor}}
      />
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
      const notificationsCount = {
        official: 0,
        private: 0,
        groups: 0,
      };
      const privateChats = this.state.rosterListArray.filter(item => {
        const splitedJid = item.jid.split('@')[0];

        if (item.participants < 3 && !defaultChats[splitedJid]) {
          notificationsCount['private'] += item.counter;
          return item;
        }
      });

      const officialChats = this.state.rosterListArray.filter(item => {
        const splitedJid = item.jid.split('@')[0];
        if (defaultChats[splitedJid]) {
          notificationsCount['official'] += item.counter;
          return item;
        }
      });

      const groupsChats = this.state.rosterListArray.filter(item => {
        const splitedJid = item.jid.split('@')[0];

        if (item.participants > 2 && !defaultChats[splitedJid]) {
          notificationsCount['groups'] += item.counter;
          return item;
        }
      });

      return (
        <TabView
          renderTabBar={this.renderTabBar}
          navigationState={{
            index: this.state.routeIndex,
            routes: this.state.routes,
            notificationsCount,
          }}
          renderScene={SceneMap({
            official: () => this.chatListComponent(officialChats),
            private: () => this.chatListComponent(privateChats),
            groups: () => this.chatListComponent(groupsChats),
          })}
          onIndexChange={index => this.setState({routeIndex: index})}
          initialLayout={{width: wp('100%')}}
        />
      );
      // return this.chatListComponent();
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
