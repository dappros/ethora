import {useNavigation} from '@react-navigation/native';
import {HStack, Image} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityBase,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  coinImagePath,
  commonColors,
  IMetaRoom,
  ROOM_KEYS,
  textStyles,
} from '../../../docs/config';
import {ROUTES} from '../../constants/routes';
import {asyncStorageGetItem} from '../../helpers/cache/asyncStorageGetItem';
import {useStores} from '../../stores/context';
import {CONFERENCEDOMAIN} from '../../xmpp/xmppConstants';
import {MainHeader} from '../MainHeader/MainHeader';
import {CreateNewChatButton} from './CreateNewChatButton';
import {metaRooms as predefinedMeta} from '../../../docs/config';
import {underscoreManipulation} from '../../helpers/underscoreLogic';
import {sendMessageStanza} from '../../xmpp/stanzas';
export interface IMetaNavigation {
  chatId: string;
  open: boolean;
  onClose: () => void;
}

const findRoom = (id: string | undefined, arr: IMetaRoom[]) => {
  if (!id) {
    return null;
  }
  const room = arr.find(item => item.idAddress === id);
  if (!room) {
    return null;
  }
  return room;
};
const CompassItem = ({
  room,
  name,
  chatId,
  setDirection,
}: {
  room: IMetaRoom | null;
  name: string;
  chatId: string;
  setDirection: () => void;
}) => {
  const navigation = useNavigation();
  const {apiStore} = useStores();
  if (!room) {
    return (
      <HStack
        justifyContent={'center'}
        alignItems={'center'}
        style={{paddingVertical: 10}}>
        <TouchableOpacity
          disabled={!chatId}
          onPress={() => {
            setDirection();
            navigation.navigate(ROUTES.CHAT, {
              chatJid: '',
            });
          }}>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontFamily: textStyles.mediumFont,
              fontSize: 16,
            }}>
            {'Empty'}
          </Text>
        </TouchableOpacity>
      </HStack>
    );
  }
  return (
    <HStack
      justifyContent={'center'}
      alignItems={'center'}
      style={{paddingVertical: 10}}>
      <TouchableOpacity
        onPress={() => {
          setDirection();

          navigation.navigate(ROUTES.CHAT, {
            chatJid: room.idAddress + apiStore.xmppDomains.CONFERENCEDOMAIN,
          });
        }}>
        <Text
          style={{
            color: 'black',
            textAlign: 'center',
            fontFamily: textStyles.mediumFont,
            fontSize: 16,
          }}>
          {name}
        </Text>
      </TouchableOpacity>
    </HStack>
  );
};

const MetaHeader = ({
  room,
  direction,
  previousRoom,
}: {
  room: IMetaRoom | undefined;
  direction: string;
  previousRoom: IMetaRoom | undefined;
}) => {
  const navigation = useNavigation();
  if (!room) {
    return (
      <View style={[styles.top, styles.innerContainer]}>
        <Text style={{fontFamily: textStyles.semiBoldFont, color: 'black'}}>
          This space is empty. You can build your own room here for 120{' '}
          <Image
            alt="Coin Image"
            source={coinImagePath}
            h={hp('3%')}
            w={hp('3%')}
          />
        </Text>
        <CreateNewChatButton
          onPress={() =>
            navigation.navigate(ROUTES.NEWCHAT, {
              metaDirection: direction,
              metaRoom: previousRoom,
            })
          }
        />
      </View>
    );
  }
  return (
    <View style={[styles.top, styles.innerContainer]}>
      <Text style={{fontFamily: textStyles.semiBoldFont, color: 'black'}}>
        {room.description}
      </Text>
    </View>
  );
};
export const MetaNavigation: React.FC<IMetaNavigation> = ({
  chatId,
  open,
  onClose,
}) => {
  const [direction, setDirection] = useState('');
  const [metaRooms, setMetaRooms] = useState<IMetaRoom[]>([]);
  const metaRoom = metaRooms.find(item => item.idAddress === chatId);
  const [previousRoom, setPreviuosRoom] = useState<IMetaRoom | undefined>();
  const {loginStore, chatStore, apiStore} = useStores();
  const getMetaRooms = async () => {
    const rooms = await asyncStorageGetItem('metaRooms');
    setMetaRooms(rooms || predefinedMeta);
  };
  useEffect(() => {
    getMetaRooms();
  }, []);
  const checkEmptyDirections = () => {
    return (
      !findRoom(metaRoom?.linkW, metaRooms)?.name &&
      !findRoom(metaRoom?.linkS, metaRooms)?.name &&
      !findRoom(metaRoom?.linkE, metaRooms)?.name &&
      !findRoom(metaRoom?.linkN, metaRooms)?.name
    );
  };
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

  useEffect(() => {
    if (previousRoom) {
      sendMessage(
        previousRoom.name,
        previousRoom.idAddress + apiStore.xmppDomains.CONFERENCEDOMAIN,
        true,
      );
    }
  }, [previousRoom]);
  useEffect(() => {
    if (metaRoom) {
      sendMessage(
        metaRoom.name,
        metaRoom.idAddress + apiStore.xmppDomains.CONFERENCEDOMAIN,
        false,
      );
    }
  }, [metaRoom]);
  return (
    <Modal isVisible={open} onBackdropPress={onClose}>
      <View style={styles.container}>
        <MetaHeader
          room={metaRoom}
          direction={direction}
          previousRoom={previousRoom}
        />
        <View style={[styles.bottom, styles.innerContainer]}>
          {checkEmptyDirections() ? (
            <CompassItem
              name={'N:' + metaRooms[0]?.name}
              chatId={chatId}
              room={metaRooms[0]}
              setDirection={() => {
                setDirection('N');
                setPreviuosRoom(metaRooms[0]);
              }}
            />
          ) : (
            <CompassItem
              name={'N:' + findRoom(metaRoom?.linkN, metaRooms)?.name}
              chatId={chatId}
              room={findRoom(metaRoom?.linkN, metaRooms)}
              setDirection={() => {
                setDirection('N');
                setPreviuosRoom(metaRoom);
              }}
            />
          )}
          <HStack justifyContent={'space-between'} alignItems={'center'}>
            <View style={{width: '30%'}}>
              <CompassItem
                name={'W:' + findRoom(metaRoom?.linkW, metaRooms)?.name}
                chatId={chatId}
                room={findRoom(metaRoom?.linkW, metaRooms)}
                setDirection={() => {
                  setDirection('W');
                  setPreviuosRoom(metaRoom);
                }}
              />
            </View>
            <View
              style={{
                width: '30%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                name={'compass'}
                size={70}
                color={commonColors.primaryDarkColor}
              />
            </View>
            <View style={{width: '30%'}}>
              <CompassItem
                name={'E:' + findRoom(metaRoom?.linkE, metaRooms)?.name}
                chatId={chatId}
                room={findRoom(metaRoom?.linkE, metaRooms)}
                setDirection={() => {
                  setDirection('E');
                  setPreviuosRoom(metaRoom);
                }}
              />
            </View>
          </HStack>
          <CompassItem
            name={'S:' + findRoom(metaRoom?.linkS, metaRooms)?.name}
            chatId={chatId}
            room={findRoom(metaRoom?.linkS, metaRooms)}
            setDirection={() => {
              setDirection('S');
              setPreviuosRoom(metaRoom);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: hp('100%'),
    justifyContent: 'space-between',
  },
  innerContainer: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: commonColors.primaryColor,
  },
  top: {
    backgroundColor: 'white',
    height: '20%',
  },
  bottom: {
    backgroundColor: 'white',
    height: '40%',
  },
});
