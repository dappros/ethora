import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';
import {underscoreManipulation} from '../helpers/underscoreLogic';
import {useStores} from '../stores/context';
import {sendMessageStanza} from '../xmpp/stanzas';
import ChatScreen from './ChatScreen';

export interface ISwiperChatScreen {}
const defaultChats = [
  {
    name: 'Agora (Start here) 🇬🇧🏛️👋💬',
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
    jid: '1c525d51b2a0e9d91819933295fcd82ba670371b92c0bf45ba1ba7fb904dbcdc',
  },
  {
    name: 'Майдан (Maidan) 🇺🇦🏛️🫂💬',
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
    jid: 'd0df15e359b5d49aaa965bca475155b81784d9e4c5f242cebe405ae0f0046a22',
  },
  {
    name: 'मैदान (Maidan) 🇮🇳🏛️🫂',
    premiumOnly: true,
    stickyOrder: false,
    removable: false,
    jid: 'fd6488675183a9db2005879a945bf5727c8594eaae5cdbd35cb0b02c5751760e',
  },
];

export const SwiperChatScreen: React.FC<ISwiperChatScreen> = ({navigation}) => {
  const {apiStore, loginStore, chatStore} = useStores();
  const [chatIndex, setChatIndex] = useState(0);
  const sendMessage = (chatName: string, jid: string, isPrevious: boolean) => {
    const manipulatedWalletAddress = underscoreManipulation(
      loginStore.initialData.walletAddress,
    );
    const textEnter =
      loginStore.initialData.firstName +
      ' ' +
      loginStore.initialData.lastName +
      ' ' +
      'has joined' +
      ' ' +
      '<-';
    const textLeave =
      loginStore.initialData.firstName +
      ' ' +
      loginStore.initialData.lastName +
      ' ' +
      'has left' +
      ' ' +
      '->';
    const data = {
      senderFirstName: loginStore.initialData.firstName,
      senderLastName: loginStore.initialData.lastName,
      senderWalletAddress: loginStore.initialData.walletAddress,
      isSystemMessage: true,
      tokenAmount: 0,
      receiverMessageId: '',
      mucname: chatName,
      photoURL: loginStore.userAvatar,
      roomJid: jid,
      isReply: false,
      mainMessageText: '',
      mainMessageId: '',
      mainMessageUserName: '',
    };

    sendMessageStanza(
      manipulatedWalletAddress,
      jid,
      isPrevious ? textLeave : textEnter,
      data,
      chatStore.xmpp,
    );
  };

  const onSwipeIndexChanged = (index: number) => {
    const chat = defaultChats.find((item, i) => index === i);
    const previousChat = defaultChats.find((item, i) => chatIndex === i);

    sendMessage(
      chat!.name,
      chat?.jid + apiStore.xmppDomains.CONFERENCEDOMAIN,
      false,
    );
    sendMessage(
      previousChat!.name,
      previousChat?.jid + apiStore.xmppDomains.CONFERENCEDOMAIN,
      true,
    );

    setChatIndex(index);
  };
  useEffect(() => {
    sendMessage(
      defaultChats[0]!.name,
      defaultChats[0].jid + apiStore.xmppDomains.CONFERENCEDOMAIN,
      false,
    );
  }, []);
  return (
    <Swiper
      style={styles.wrapper}
      showsButtons={false}
      showsPagination={false}
      onIndexChanged={onSwipeIndexChanged}
      loop={false}>
      {defaultChats.map(item => {
        return (
          <ChatScreen
            navigation={navigation}
            route={{
              params: {
                chatJid: item.jid + apiStore.xmppDomains.CONFERENCEDOMAIN,
              },
            }}
            key={item.jid}
          />
        );
      })}
    </Swiper>
  );
};

const styles = StyleSheet.create({});
