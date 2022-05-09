import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {useStores} from '../stores/context';
import {
  getPaginatedArchive,
  getRoomArchiveStanza,
  retrieveOtherUserVcard,
  sendMessageStanza,
} from '../xmpp/stanzas';
import MessageBody from '../components/Chat/MessageBody';
import {StyleSheet} from 'react-native';
import {DOMAIN} from '../xmpp/xmppConstants';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import {format} from 'date-fns';
import {reverseUnderScoreManipulation, underscoreManipulation} from '../helpers/underscoreLogic';
import {ROUTES} from '../constants/routes';
import {ImageMessage} from '../components/Chat/ImageMessage';
import {ChatMediaModal} from '../components/Modals/ChatMediaModal';
import { Spinner } from 'native-base';
import { queryRoomAllMessages } from '../components/realmModels/messages';
import TransactionModal from '../components/Modals/TransactionModal/Test';
import { modalTypes } from '../constants/modalTypes';

const ChatScreen = observer(({route, navigation}:any) => {

  const [modalType, setModalType] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [extraData, setExtraData] = useState({});

  const {
    loginStore,
    chatStore,
    otherUserStore,
    apiStore
  } = useStores();
  const {chatJid, chatName} = route.params;
  const [mediaModal, setMediaModal] = useState({
    open: false,
    url: '',
    type: '',
  });

  const messages = chatStore.messages
    .filter((item:any) => item.roomJid === chatJid)
    .sort((a:any, b:any) => b._id - a._id);

  useEffect(() => {
    if (!chatStore.roomsInfoMap?.[chatJid]?.archiveRequested) {
      getRoomArchiveStanza(chatJid, chatStore.xmpp);
    }
    const lastMessage = messages?.[0];
    chatStore.updateRoomInfo(chatJid, {
      archiveRequested: true,
      lastUserText: lastMessage?.text,
      lastUserName: lastMessage?.user?.name,
      lastMessageTime:
        lastMessage?.createdAt && format(lastMessage?.createdAt, 'hh:mm'),
    });
  }, [chatJid]);

  useEffect(()=>{
    queryRoomAllMessages(chatJid).then(chats=>{
      // alert(JSON.stringify(chats))
    })
  },[])

  const renderMessage = props => {
    return <MessageBody {...props} />;
  };

  const onLoadEarlier = () => {
    // messages.length - 1 means last message, but because chat is inverted it will the first message by date

    const lastMessage = messages.length - 1;
    // const lastMessage = 0;
    getPaginatedArchive(chatJid, messages[lastMessage]._id, chatStore.xmpp);
  };

  const sendMessage = (messageString:any, isSystemMessage:boolean) => {
    const messageText = messageString[0].text;
    const tokenAmount = messageString[0].tokenAmount || 0;

    const receiverMessageId = messageString[0].receiverMessageId || 0;
    const manipulatedWalletAddress = underscoreManipulation(loginStore.initialData.walletAddress)
    const data = {
      senderFirstName: loginStore.initialData.firstName,
      senderLastName: loginStore.initialData.lastName,
      senderWalletAddress: loginStore.initialData.walletAddress,
      isSystemMessage: isSystemMessage,
      tokenAmount: tokenAmount,
      receiverMessageId: receiverMessageId,
      mucname: chatName,
      photoURL: loginStore.userAvatar,
      roomJid: chatJid,
    };
    sendMessageStanza(
      manipulatedWalletAddress,
      chatJid,
      messageText,
      data,
      chatStore.xmpp,
    );
  };

  const onUserAvatarPress = (props:any) => {
    const {avatar, name, _id} = props;
    const firstName = name.split(' ')[0];
    const lastName = name.split(' ')[1];
    const xmppID = _id.split('@')[0];
    // const {anotherUserWalletAddress} = this.props.loginReducer;
    const walletAddress = reverseUnderScoreManipulation(xmppID);
    if (walletAddress === loginStore.walletAddress) {
      navigation.navigate(ROUTES.PROFILE);
      return;
    }
    //fetch transaction

    //check if user clicked their own avatar/profile

    const theirXmppUsername = xmppID;
    //this will get the other user's Avatar and description
    retrieveOtherUserVcard(
      loginStore.xmppUsername,
      theirXmppUsername,
      chatStore.xmpp,
    );

    //to set the current another user profile
    otherUserStore.setUserData(firstName, lastName, avatar);

    navigation.navigate(ROUTES.OTHERUSERPROFILESCREEN);
  };
  const onMediaMessagePress = (type:any, url:any) => {
    setMediaModal({open: true, type, url});
  };

  const closeMediaModal = () => {
    setMediaModal({type: '', open: false, url: ''});
  };
  const renderMessageImage = (props:any) => {
    const {
      image,
      realImageURL,
      mimetype,
      size,
      duration,
      waveForm,
      id,
      imageLocation,
    } = props.currentMessage;
    if (mimetype === 'image/jpeg' || mimetype === 'image/png') {
      return (
        <ImageMessage
          url={imageLocation}
          size={size}
          onPress={() => onMediaMessagePress(mimetype, imageLocation)}
        />
      );
    } else {
      return;
    }
  };

  const handleOnLongPress=(context:any, message:any)=>{
    let extraData = {};
    if (!message.user._id.includes(apiStore.xmppDomains.CONFERENCEDOMAIN_WITHOUT)) {
      const jid = message.user._id.split(
        '@' + apiStore.xmppDomains.DOMAIN,
      )[0];
      const walletFromJid = reverseUnderScoreManipulation(jid);
      const token = loginStore.userToken;

      extraData = {
        type: 'transfer',
        amnt: null,
        name: message.user.name,
        message_id: message._id,
        walletFromJid,
        chatJid,
        token,
        jid,
        senderName: message.name,
      };
    } else {
      extraData = {
        type: 'transfer',
        amnt: null,
        name: message.user.name,
        chatJid,
        message_id: message._id,
        jid:message.jid,
        senderName: message.name,
      };
    }
    setShowModal(true)
    setModalType(modalTypes.TOKENTRANSFER);
    setExtraData(extraData)
  }

  const closeModal = () => {
    setShowModal(false);
  }

  return (
    <>
      <SecondaryHeader title={chatName} />
      <GiftedChat
        renderLoading={()=><Spinner/>}
        renderUsernameOnMessage
        renderMessage={renderMessage}
        renderMessageImage={props => renderMessageImage(props)}
        messages={messages}
        renderAvatarOnTop
        onPressAvatar={onUserAvatarPress}
        listViewProps={{
          onEndReached: onLoadEarlier,
          onEndReachedThreshold: 0.05,
        }}
        keyboardShouldPersistTaps={'handled'}
        onSend={messageString => sendMessage(messageString, false)}
        user={{
          _id: loginStore.xmppUsername + '@' + DOMAIN,
          name: loginStore.initialData.username,
        }}
        inverted={true}
        alwaysShowSend
        showUserAvatar
        onLongPress={(context:any, message:any)=>handleOnLongPress(context, message)}
        // onInputTextChanged={()=>{alert('hhh')}}
      />
      <ChatMediaModal
        url={mediaModal.url}
        type={mediaModal.type}
        onClose={closeMediaModal}
        open={mediaModal.open}
      />
      <TransactionModal
        type={modalType}
        closeModal={closeModal}
        extraData={extraData}
        isVisible={showModal}
      />
    </>
  );
});

const styles = StyleSheet.create({
  usernameStyle: {
    fontWeight: 'bold',
    color: '#FFFF',
    fontSize: heightPercentageToDP('1.47%'),
  },
});

export default ChatScreen;
