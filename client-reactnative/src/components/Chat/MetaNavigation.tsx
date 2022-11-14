import {useNavigation} from '@react-navigation/native';
import {HStack, Image} from 'native-base';
import React from 'react';
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
  metaRooms,
  ROOM_KEYS,
  textStyles,
} from '../../../docs/config';
import {ROUTES} from '../../constants/routes';
import {useStores} from '../../stores/context';
import {CONFERENCEDOMAIN} from '../../xmpp/xmppConstants';
import {MainHeader} from '../MainHeader/MainHeader';
import {CreateNewChatButton} from './CreateNewChatButton';

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
}: {
  room: IMetaRoom | null;
  name: string;
  chatId: string;
}) => {
  const navigation = useNavigation();
  const {apiStore} = useStores();
  if (!room) {
    return (
      <HStack justifyContent={'center'} alignItems={'center'}>
        <TouchableOpacity
          disabled={!chatId}
          onPress={() =>
            navigation.navigate(ROUTES.CHAT, {
              chatJid: '',
            })
          }>
          <Text style={{color: 'black'}}>{'Empty'}</Text>
        </TouchableOpacity>
      </HStack>
    );
  }
  return (
    <HStack justifyContent={'center'} alignItems={'center'}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(ROUTES.CHAT, {
            chatJid: room.idAddress + apiStore.xmppDomains.CONFERENCEDOMAIN,
          })
        }>
        <Text style={{color: 'black', textAlign: 'center'}}>{name}</Text>
      </TouchableOpacity>
    </HStack>
  );
};

const MetaHeader = ({room}: {room: IMetaRoom | undefined}) => {
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
          onPress={() => navigation.navigate(ROUTES.NEWCHAT)}
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
  const metaRoom = metaRooms.find(item => item.idAddress === chatId);
  return (
    <Modal isVisible={open} onBackdropPress={onClose}>
      <View style={styles.container}>
        <MetaHeader room={metaRoom} />
        <View style={[styles.bottom, styles.innerContainer]}>
          <CompassItem
            name={'N:' + findRoom(metaRoom?.linkN, metaRooms)?.name}
            chatId={chatId}
            room={findRoom(metaRoom?.linkN, metaRooms)}
          />
          <HStack justifyContent={'space-between'} alignItems={'center'}>
            <View style={{width: '30%'}}>
              <CompassItem
                name={'W:' + findRoom(metaRoom?.linkW, metaRooms)?.name}
                chatId={chatId}
                room={findRoom(metaRoom?.linkW, metaRooms)}
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
                size={100}
                color={commonColors.primaryDarkColor}
              />
            </View>
            <View style={{width: '30%'}}>
              <CompassItem
                name={'E:' + findRoom(metaRoom?.linkE, metaRooms)?.name}
                chatId={chatId}
                room={findRoom(metaRoom?.linkE, metaRooms)}
              />
            </View>
          </HStack>
          <CompassItem
            name={'S:' + findRoom(metaRoom?.linkS, metaRooms)?.name}
            chatId={chatId}
            room={findRoom(metaRoom?.linkS, metaRooms)}
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
