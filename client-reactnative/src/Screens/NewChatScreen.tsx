import {Button, HStack, Icon, Image, Input, TextArea, View} from 'native-base';
import React, {useState} from 'react';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  commonColors,
  defaultBotsList,
  metaRooms,
  textStyles,
} from '../../docs/config';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import {sha256} from 'react-native-sha256';
import {useStores} from '../stores/context';
import {underscoreManipulation} from '../helpers/underscoreLogic';
import {
  createNewRoom,
  getUserRoomsStanza,
  roomConfig,
  sendInvite,
  setOwner,
  subscribeStanza,
  subscribeToRoom,
} from '../xmpp/stanzas';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../constants/routes';
import {CONFERENCEDOMAIN} from '../xmpp/xmppConstants';
import {asyncStorageSetItem} from '../helpers/cache/asyncStorageSetItem';
import {asyncStorageGetItem} from '../helpers/cache/asyncStorageGetItem';

interface NewChatScreenProps {}

const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const NewChatScreen = (props: NewChatScreenProps) => {
  const [chatAvatar, setChatAvatar] = useState('');
  const [chatName, setChatName] = useState('');
  const [chatDescription, setChatDescription] = useState('');
  const params = props.route.params;
  const {loginStore, chatStore, apiStore} = useStores();

  const {walletAddress} = loginStore.initialData;
  const manipulatedWalletAddress = underscoreManipulation(walletAddress);

  const navigation = useNavigation();

  const handleChatAvatar = () => {
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        alert('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = {uri: response.uri};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        setChatAvatar(source);
      }
    });
  };

  const handleCreateNewChat = () => {
    let roomHash = '';
    sha256(chatName).then(async hash => {
      roomHash = hash;

      if (chatName === '') {
        alert('Please fill Chat Name');
      } else {
        createNewRoom(manipulatedWalletAddress, roomHash, chatStore.xmpp);

        setOwner(manipulatedWalletAddress, roomHash, chatStore.xmpp);

        roomConfig(
          manipulatedWalletAddress,
          roomHash,
          {roomName: chatName, roomDescription: chatDescription},
          chatStore.xmpp,
        );

        subscribeToRoom(
          roomHash + apiStore.xmppDomains.CONFERENCEDOMAIN,
          manipulatedWalletAddress,
          chatStore.xmpp,
        );
        defaultBotsList.forEach(bot => {
          sendInvite(
            manipulatedWalletAddress,
            roomHash + apiStore.xmppDomains.CONFERENCEDOMAIN,
            bot.jid,
            chatStore.xmpp,
          );
        });
        if (params.metaDirection) {
          const metaRoom = {
            name: chatName,
            description: chatDescription,
            idAddress: roomHash,
            meta: true,
            linkN: '',
            linkS: params.metaRoom.idAddress,
            linkW: '',
            linkE: '',
          };
          const cachedMetaRooms = await asyncStorageGetItem('metaRooms');
          const metaRoomsList = cachedMetaRooms || metaRooms;
          const linkedRoom = metaRoomsList.find(
            item => item.idAddress === params.metaRoom.idAddress,
          );
          linkedRoom['link' + params.metaDirection] = roomHash;
          metaRoomsList.push(metaRoom);
          console.log(metaRoomsList, 'akkjalfjsd');
          await asyncStorageSetItem('metaRooms', metaRoomsList);
        }

        navigation.navigate(ROUTES.ROOMSLIST);
      }
    });
  };
  return (
    <View>
      <SecondaryHeader title="Create new chat" />
      <View margin={5}>
        <HStack>
          <View flex={0.2}>
            <Button
              w={wp('15%')}
              h={wp('15%')}
              borderRadius={wp('15%') / 2}
              borderColor={commonColors.primaryColor}
              borderWidth={1}
              bg="transparent"
              justifyContent="center"
              alignItems={'center'}
              onPress={handleChatAvatar}>
              {chatAvatar ? (
                <Image
                  source={chatAvatar}
                  w={wp('15%')}
                  h={wp('15%')}
                  borderRadius={wp('15%') / 2}
                />
              ) : (
                <Icon
                  as={SimpleLineIcons}
                  name="camera"
                  size={hp('3.5%')}
                  color={commonColors.primaryColor}
                />
              )}
            </Button>
          </View>
          <Input
            _input={{
              maxLength: 20,
            }}
            onChangeText={chatName => setChatName(chatName)}
            placeholder="Chat name"
            placeholderTextColor={commonColors.primaryColor}
            color="black"
            borderWidth={1}
            borderRadius={5}
            borderColor={commonColors.primaryColor}
            bg={commonColors.primaryColor + '26'}
            height={wp('15%')}
            fontFamily={textStyles.lightFont}
            fontSize={hp('1.8%')}
            flex={0.8}
          />
        </HStack>

        <TextArea
          scrollEnabled
          placeholder="Short description about the chat"
          onChangeText={desc => setChatDescription(desc)}
          placeholderTextColor={commonColors.primaryColor}
          multiline
          color={'black'}
          borderWidth={1}
          h={wp('35%')}
          borderColor={commonColors.primaryColor}
          bg={commonColors.primaryColor + '26'}
          borderRadius={5}
          marginTop={5}
          fontFamily={textStyles.lightFont}
          fontSize={hp('1.8%')}
          autoCompleteType={undefined}
        />

        <Button
          onPress={handleCreateNewChat}
          bg={commonColors.primaryColor}
          borderRadius={5}
          h={hp('7%')}
          marginTop={5}
          fontSize={hp('2%')}
          color="white"
          fontFamily={textStyles.regularFont}>
          Create new chat
        </Button>
      </View>
    </View>
  );
};

export default NewChatScreen;
