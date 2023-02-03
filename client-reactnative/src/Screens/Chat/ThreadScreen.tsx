import React from 'react';
import {
  commonColors
} from '../../../docs/config';
import {useStores} from '../../stores/context';
import {
  StyleSheet,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import ChatContainer from '../../components/Chat/ChatContainer';
import { roomListProps } from '../../stores/chatStore';

const ThreadScreen = observer((props: any) => {
  const {chatStore} =
    useStores();
  const {currentMessage, chatJid} = props.route.params;


  const room = chatStore.roomList.find(item => item.jid === chatJid);

  const messages = chatStore.messages
    .filter(
      (item: any) =>
        item.roomJid === chatJid &&
        item?.mainMessage?.id === currentMessage._id,
    )
    .sort((a: any, b: any) => b._id - a._id);

  return (
    <>
    <ChatContainer
    containerType='thread'
    messages={messages}
    roomDetails={room as roomListProps}
    currentMessage={currentMessage}
    />
    </>
  );
});

const styles = StyleSheet.create({
  sendButton: {
    backgroundColor: commonColors.primaryDarkColor,
    borderRadius: 100,
    padding: 5,
    marginRight: 5,
    paddingLeft: 7,
    marginBottom: 5,
  },
});

export default ThreadScreen;