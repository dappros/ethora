import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';

import {format} from 'date-fns';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {commonColors} from '../../../docs/config';
import {useStores} from '../../stores/context';
import {getRoomArchiveStanza, getPaginatedArchive} from '../../xmpp/stanzas';
import ChatContainer from '../../components/Chat/ChatContainer';
import {roomListProps} from '../../stores/chatStore';

const ChatScreen = observer(({route}: any) => {
  const {chatStore} = useStores();

  const {chatJid, chatName} = route.params;
  const room = chatStore.roomList.find(item => item.jid === chatJid);
  const messages = chatStore.messages
    .filter((item: any) => {
      if (item.roomJid === chatJid) {
        if (item.isReply) {
          if (item.showInChannel) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    })
    .sort((a: any, b: any) => b._id - a._id);

  //this will ensure that when chat screen is opened then message badge counter should stop counting
  useEffect(() => {
    chatStore.toggleShouldCount(false);
    return () => {
      chatStore.toggleShouldCount(true);
    };
  }, []);

  //everytime chat room changes message archive is called for the corresponing room
  useEffect(() => {
    if (!chatStore.roomsInfoMap?.[chatJid]?.archiveRequested) {
      getRoomArchiveStanza(chatJid, chatStore.xmpp);
    }
  }, [chatJid]);

  useEffect(() => {
    const lastMessage = messages?.[0];
    lastMessage &&
      chatStore.updateRoomInfo(chatJid, {
        archiveRequested: true,
        lastUserText: lastMessage?.text,
        lastUserName: lastMessage?.user?.name,
        lastMessageTime:
          lastMessage?.createdAt && format(lastMessage?.createdAt, 'hh:mm'),
      });
  }, [!!messages]);

  const onLoadEarlier = () => {
    // messages.length - 1 means last message, but because chat is inverted it will the first message by date

    const lastMessage = messages.length - 1;
    // const lastMessage = 0;
    if (messages.length > 5) {
      getPaginatedArchive(chatJid, messages[lastMessage]._id, chatStore.xmpp);
      chatStore.setChatMessagesLoading(true);
    }
  };

  return (
    <>
      <ChatContainer
        containerType="main"
        roomDetails={room as roomListProps}
        messages={messages}
        onLoadEarlier={onLoadEarlier}
      />
    </>
  );
});

const styles = StyleSheet.create({
  usernameStyle: {
    fontWeight: 'bold',
    color: '#FFFF',
    fontSize: hp('1.47%'),
  },
  sendButton: {
    backgroundColor: commonColors.primaryDarkColor,
    borderRadius: 100,
    padding: 5,
    marginRight: 5,
    paddingLeft: 7,
    marginBottom: 5,
  },
});

export default ChatScreen;
