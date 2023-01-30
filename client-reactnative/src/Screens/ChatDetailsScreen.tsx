import {
  Actionsheet,
  AlertDialog,
  Box,
  Button,
  Center,
  Divider,
  FlatList,
  HStack,
  Image,
  Menu,
  Pressable,
  Switch,
  Text,
  useColorModeValue,
  useDisclose,
  View,
} from 'native-base';
import React, {useState, useEffect} from 'react';
import {commonColors, defaultChats, textStyles} from '../../docs/config';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {Alert, Animated, Dimensions, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SceneMap} from 'react-native-tab-view';
import {useStores} from '../stores/context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  reverseUnderScoreManipulation,
  underscoreManipulation,
} from '../helpers/underscoreLogic';
import {observer} from 'mobx-react-lite';
import ChangeRoomDescriptionModal from '../components/Modals/Chat/ChangeRoomDescriptionModal';
import {
  assignModerator,
  banUserr,
  changeRoomDescription,
  getListOfBannedUserInRoom,
  getRoomInfo,
  getRoomMemberInfo,
  leaveRoomXmpp,
  retrieveOtherUserVcard,
  setRoomImage,
  subscribeToRoom,
  unAssignModerator,
  unbanUser,
  unsubscribeFromChatXmpp,
} from '../xmpp/stanzas';
import {deleteChatRoom} from '../components/realmModels/chatList';
import {uploadFiles} from '../helpers/uploadFiles';
import {fileUpload} from '../config/routesConstants';
import FastImage from 'react-native-fast-image';
import DocumentPicker from 'react-native-document-picker';
import {ROUTES} from '../constants/routes';
import ChangeRoomNameModal from '../components/Modals/Chat/ChangeRoomNameModal';
import {renameTheRoom} from '../helpers/RoomList/renameRoom';

interface longTapUserProps {
  ban_status: string;
  jid: string;
  last_active: string;
  name: string;
  profile: string;
  role: string;
}

const ChatDetailsScreen = observer(({route}: any) => {
  const {chatStore, loginStore} = useStores();
  const currentRoomDetail = chatStore.roomList?.find((item: any) => {
    if (item.jid === route.params.roomJID) {
      return item;
    }
  });

  const roomJID = currentRoomDetail?.jid;
  const {isOpen, onOpen, onClose} = useDisclose();

  const roomMemberInfo = chatStore.roomMemberInfo.filter(item => item);

  const [open, setOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [longTapUser, setLongTapUser] = useState<longTapUserProps | {}>({});
  const [kickUserItem, setKickUserItem] = useState<longTapUserProps | {}>({});
  const [descriptionModalVisible, setDescriptionModalVisible] =
    useState<boolean>(false);
  const [isShowKickDialog, setIsShowKickDialog] = useState(false);

  const [roomNameModalVisible, setRoomNameModalVisible] =
    useState<boolean>(false);

  const handleCloseKickDialog = () => setIsShowKickDialog(false);
  const cancelRef = React.useRef(null);
  // const [isNotification, setIsNotification] = useState<boolean>(roomInfo.muted)

  const navigation = useNavigation();

  const walletAddress = loginStore.initialData.walletAddress;
  const manipulatedWalletAddress = underscoreManipulation(walletAddress);

  const unsubscribeFromRoom = () => {
    unsubscribeFromChatXmpp(manipulatedWalletAddress, roomJID, chatStore.xmpp);
    chatStore.updateRoomInfo(roomJID, {muted: true});
  };

  const subscribeRoom = () => {
    subscribeToRoom(roomJID, manipulatedWalletAddress, chatStore.xmpp);
    chatStore.updateRoomInfo(roomJID, {muted: false});
  };

  useEffect(() => {
    getRoomMemberInfo(manipulatedWalletAddress, roomJID, chatStore.xmpp);
    getRoomInfo(manipulatedWalletAddress, roomJID, chatStore.xmpp);
    getListOfBannedUserInRoom(
      manipulatedWalletAddress,
      roomJID,
      chatStore.xmpp,
    );
  }, []);

  const toggleNotification = value => {
    if (!value) {
      // unsubscribeFromChatXmpp(manipulatedWalletAddress, roomJID, chatStore.xmpp);
      // chatStore.updateRoomInfo(roomJID, {muted: true});
      unsubscribeFromRoom();
    } else {
      subscribeRoom();
    }
  };

  const leaveTheRoom = async () => {
    leaveRoomXmpp(
      manipulatedWalletAddress,
      roomJID,
      walletAddress,
      chatStore.xmpp,
    );
    unsubscribeFromRoom();
    await deleteChatRoom(roomJID);
    chatStore.getRoomsFromCache();
    navigation.popToTop();
  };

  const deleteRoomAlert = async () => {
    Alert.alert('Delete', 'Do you want to delete this room?', [
      {
        text: 'Cancel',
        onPress: () => console.log('canceled'),
      },
      {
        text: 'Yes',
        onPress: () => leaveTheRoom(),
      },
    ]);
  };

  const routes = [
    {
      key: 'first',
      title: `Members (${roomMemberInfo.length})`,
    },
    {
      key: 'second',
      title: 'Bots',
    },
    {
      key: 'third',
      title: 'Items',
    },
  ];

  const toggleFavourite = () => {
    chatStore.updateRoomInfo(roomJID, {
      isFavourite: !chatStore.roomsInfoMap[roomJID]?.isFavourite,
    });
  };

  const toggleMenu = () => {
    setOpen(prev => !prev);
  };

  const getOtherUserDetails = (props: any) => {
    const {profile, name, jid, last_active} = props;
    const firstName = name.split(' ')[0];
    const lastName = name.split(' ')[1];
    const xmppID = jid.split('@')[0];
    const walletAddress = reverseUnderScoreManipulation(xmppID);
    const theirXmppUsername = xmppID;

    retrieveOtherUserVcard(
      loginStore.initialData.xmppUsername,
      theirXmppUsername,
      chatStore.xmpp,
    );

    loginStore.setOtherUserDetails({
      anotherUserFirstname: firstName,
      anotherUserLastname: lastName,
      anotherUserLastSeen: last_active,
      anotherUserWalletAddress: walletAddress,
      anotherUserAvatar: profile,
    });
  };

  const onUserAvatarPress = (props: any) => {
    //to set the current another user profile
    // otherUserStore.setUserData(firstName, lastName, avatar);
    const xmppID = props.jid.split('@')[0];
    const walletAddress = reverseUnderScoreManipulation(xmppID);
    if (walletAddress === loginStore.initialData.walletAddress) {
      navigation.navigate(ROUTES.PROFILE);
      return;
    } else {
      getOtherUserDetails(props);
      navigation.navigate(ROUTES.OTHERUSERPROFILESCREEN);
    }
  };

  const handleMemberLongTap = (item: any) => {
    if (
      chatStore.roomRoles[currentRoomDetail.jid] === 'moderator' ||
      chatStore.roomRoles[currentRoomDetail.jid] === 'admin'
    ) {
      setLongTapUser(item);
      onOpen();
    }
  };

  const handleLongTapMenu = (type: number) => {
    if (type === 0) {
      if (longTapUser.ban_status === 'clear') {
        banUserr(
          manipulatedWalletAddress,
          longTapUser.jid,
          currentRoomDetail.jid,
          chatStore.xmpp,
        );
      } else {
        unbanUser(
          manipulatedWalletAddress,
          longTapUser.jid,
          currentRoomDetail.jid,
          chatStore.xmpp,
        );
      }
      getRoomMemberInfo(manipulatedWalletAddress, roomJID, chatStore.xmpp);
      onClose();
    }

    if (type === 1) {
      if (longTapUser.role === 'none' || 'participant') {
        assignModerator(
          manipulatedWalletAddress,
          longTapUser.jid,
          chatStore.xmpp,
        );
      } else {
        unAssignModerator(
          manipulatedWalletAddress,
          longTapUser.jid,
          chatStore.xmpp,
        );
      }
    }
  };

  const handleKickDialog = (item: any) => {
    setKickUserItem(item);
    setIsShowKickDialog(true);
  };

  const handleKick = () => {
    if (kickUserItem.ban_status === 'clear') {
      banUserr(
        manipulatedWalletAddress,
        kickUserItem.jid,
        currentRoomDetail.jid,
        chatStore.xmpp,
      );
    } else {
      unbanUser(
        manipulatedWalletAddress,
        kickUserItem.jid,
        currentRoomDetail.jid,
        chatStore.xmpp,
      );
    }
    getRoomMemberInfo(manipulatedWalletAddress, roomJID, chatStore.xmpp);
    handleCloseKickDialog();
  };

  const RoomDetails = ({
    room,
  }: {
    room: {
      jid: string;
      name: string;
      roomThumbnail: string;
      roomBackground: string;
    };
  }) => {
    const roomName = room.name;
    const [uploadedImage, setUploadedImage] = useState({
      _id: '',
      createdAt: '',
      expiresAt: 0,
      filename: '',
      isVisible: true,
      location: '',
      locationPreview: '',
      mimetype: '',
      originalname: '',
      ownerKey: '',
      size: 0,
      updatedAt: '',
      userId: '',
    });
    const {chatStore, loginStore, apiStore} = useStores();
    const sendFiles = async (data: any) => {
      const userJid =
        underscoreManipulation(loginStore.initialData.walletAddress) +
        '@' +
        apiStore.xmppDomains.DOMAIN;
      const roomJid = room.jid;
      try {
        const url = apiStore.defaultUrl + fileUpload;
        const response = await uploadFiles(data, loginStore.userToken, url);
        const file = response.results[0];
        setUploadedImage(response.results[0]);
        setRoomImage(
          userJid,
          roomJid,
          file.location,
          room.roomBackground ? room.roomBackground : 'none',
          'icon',
          chatStore.xmpp,
        );
      } catch (error) {
        console.log(error);
      }
    };
    const onImagePress = async () => {
      if (
        chatStore.roomRoles[room.jid] === 'moderator' ||
        chatStore.roomRoles[room.jid] === 'admin'
      ) {
        try {
          const res = await DocumentPicker.pickSingle({
            type: [DocumentPicker.types.images],
          });
          const formData = new FormData();
          formData.append('files', {
            name: res.name,
            type: res.type,
            uri: res.uri,
          });
          sendFiles(formData);
        } catch (error) {
          console.log(error);
        }
      }
    };

    const handleEditDesriptionPress = () => {
      if (
        chatStore.roomRoles[room.jid] === 'moderator' ||
        chatStore.roomRoles[room.jid] === 'admin'
      ) {
        setDescriptionModalVisible(true);
      } else {
        alert('Only owners and moderators can edit room details');
      }
    };

    const handleRoomNameEdit = () => {
      if (
        chatStore.roomRoles[room.jid] === 'moderator' ||
        chatStore.roomRoles[room.jid] === 'admin'
      ) {
        setRoomNameModalVisible(true);
      } else {
        alert('Only owners and moderators can edit room details');
      }
    };

    return (
      <View margin={10} justifyContent="center" alignItems="center">
        <TouchableOpacity
          onPress={onImagePress}
          activeOpacity={
            chatStore.roomRoles[room.jid] === 'moderator' ||
            chatStore.roomRoles[room.jid] === 'admin'
              ? 0.8
              : 1
          }>
          <Box
            justifyContent={'center'}
            alignItems={'center'}
            borderRadius={10}
            shadow={'5'}
            bg={commonColors.primaryDarkColor}
            h={wp('22%')}
            w={wp('22%')}
            marginBottom={4}>
            {uploadedImage.location || room.roomThumbnail ? (
              <FastImage
                accessibilityLabel="Chat Image"
                source={{
                  uri: uploadedImage.location || room.roomThumbnail,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
                style={{
                  width: wp('22%'),
                  height: wp('22%'),
                  borderRadius: 10,
                }}
              />
            ) : (
              <Text
                // shadow={'8'}
                fontSize={hp('6%')}
                fontFamily={textStyles.semiBoldFont}
                color={'white'}>
                {roomName ? roomName[0] : 'No name'}
              </Text>
            )}
          </Box>
        </TouchableOpacity>

        <HStack alignItems={'center'}>
          <Text
            color={'black'}
            fontSize={hp('2.5%')}
            fontFamily={textStyles.boldFont}>
            {roomName ? roomName : 'No name'}
          </Text>
          {(chatStore.roomRoles[room.jid] === 'moderator' ||
            chatStore.roomRoles[room.jid] === 'admin') && (
            <Pressable onPress={handleRoomNameEdit}>
              <AntIcon
                name="edit"
                color={
                  chatStore.roomRoles[room.jid] === 'moderator' ||
                  chatStore.roomRoles[room.jid] === 'admin'
                    ? commonColors.primaryColor
                    : 'grey'
                }
                size={hp('2%')}
              />
            </Pressable>
          )}
        </HStack>

        <Text
          color={'black'}
          textAlign={'center'}
          fontSize={hp('1.5%')}
          fontFamily={textStyles.regularFont}>
          {chatStore.roomsInfoMap[roomJID].roomDescription
            ? chatStore.roomsInfoMap[roomJID].roomDescription
            : 'No description here'}
        </Text>
        {(chatStore.roomRoles[room.jid] === 'moderator' ||
          chatStore.roomRoles[room.jid] === 'admin') && (
          <Pressable onPress={handleEditDesriptionPress}>
            <AntIcon
              name="edit"
              color={
                chatStore.roomRoles[room.jid] === 'moderator' ||
                chatStore.roomRoles[room.jid] === 'admin'
                  ? commonColors.primaryColor
                  : 'grey'
              }
              size={hp('2%')}
            />
          </Pressable>
        )}

        <HStack marginTop={2} justifyContent={'flex-end'} alignItems="center">
          <Text
            fontFamily={textStyles.boldFont}
            fontSize={hp('2%')}
            color={commonColors.primaryColor}>
            Notifications
          </Text>
          <Switch
            isChecked={!chatStore.roomsInfoMap[room.jid].muted}
            onToggle={args => toggleNotification(args)}
            onTrackColor={commonColors.primaryColor}
            accessibilityLabel={'Notifications (turn on / turn off)'}
            size={'sm'}
          />
        </HStack>
      </View>
    );
  };

  const chatDetailsNavBar = () => {
    const FavMenuContent = chatStore.roomsInfoMap[roomJID]?.isFavourite
      ? 'Remove from favourites'
      : 'Add to favourites';
    return (
      <Box
        h={60}
        padding={2}
        justifyContent={'center'}
        bg={commonColors.primaryColor}>
        <HStack>
          <View flex={0.6}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntIcon
                name={'arrowleft'}
                style={{marginRight: 5, marginLeft: 5}}
                size={hp('3%')}
                color={'white'}
              />
            </TouchableOpacity>
          </View>

          <View flex={0.4} justifyContent="flex-end" flexDirection="row">
            {defaultChats[roomJID?.split('@')[0]] ? null : (
              <View flex={0.3}>
                <TouchableOpacity
                  disabled={defaultChats[roomJID?.split('@')[0]] ? true : false}
                  onPress={deleteRoomAlert}>
                  <AntIcon
                    name={'delete'}
                    style={{marginRight: 5, marginLeft: 5}}
                    size={hp('3%')}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View flex={0.3}>
              <TouchableOpacity
                disabled={defaultChats[roomJID?.split('@')[0]] ? true : false}
                onPress={toggleFavourite}>
                <AntIcon
                  name={
                    chatStore.roomsInfoMap[roomJID]?.isFavourite ||
                    defaultChats[roomJID?.split('@')[0]]
                      ? 'star'
                      : 'staro'
                  }
                  style={{marginRight: 5, marginLeft: 5}}
                  size={hp('3%')}
                  color={'white'}
                />
              </TouchableOpacity>
            </View>

            {chatStore.roomRoles[currentRoomDetail?.jid] === 'moderator' ||
            chatStore.roomRoles[currentRoomDetail?.jid] === 'admin' ? (
              <View paddingRight={2} alignItems={'flex-end'} flex={0.3}>
                <Menu
                  w="190"
                  isOpen={open}
                  placement={'bottom'}
                  onClose={() => setOpen(false)}
                  trigger={triggerProps => {
                    return (
                      <TouchableOpacity
                        {...triggerProps}
                        style={{zIndex: 99999}}
                        onPress={() => toggleMenu()}
                        accessibilityLabel="More options menu">
                        <EntypoIcon
                          name="menu"
                          color="#FFFFFF"
                          size={hp('3%')}
                        />
                      </TouchableOpacity>
                    );
                  }}>
                  {defaultChats[roomJID?.split('@')[0]] ? null : (
                    <>
                      <Menu.Item
                        accessibilityLabel={'Add to fovourites'}
                        onPress={toggleFavourite}
                        _text={{
                          fontFamily: textStyles.lightFont,
                        }}>
                        {FavMenuContent}
                      </Menu.Item>

                      <Divider />
                    </>
                  )}
                  {chatStore.roomRoles[currentRoomDetail?.jid] ===
                    'moderator' ||
                  chatStore.roomRoles[currentRoomDetail?.jid] === 'admin' ? (
                    <Menu.Item
                      onPress={() =>
                        navigation.navigate(ROUTES.CHANGEBACKGROUNDSCREEN, {
                          roomJID: roomJID,
                          roomName: route.params.roomName,
                        })
                      }
                      _text={{
                        fontFamily: textStyles.lightFont,
                      }}>
                      Change Background
                    </Menu.Item>
                  ) : null}
                  {defaultChats[roomJID?.split('@')[0]] ? null : (
                    <>
                      <Divider />
                      <Menu.Item
                        onPress={deleteRoomAlert}
                        _text={{
                          fontFamily: textStyles.lightFont,
                          color: '#D32222',
                        }}>
                        Delete and leave
                      </Menu.Item>
                    </>
                  )}
                </Menu>
              </View>
            ) : null}
          </View>
        </HStack>
      </Box>
    );
  };

  const FirstRoute = () => (
    <Box bg={'white'} minH={hp('40%')}>
      <FlatList
        contentContainerStyle={{
          paddingBottom: 50,
        }}
        scrollEnabled={roomMemberInfo.length < 5 ? false : true}
        data={roomMemberInfo}
        renderItem={({item}) => (
          <Pressable
            onLongPress={() => handleMemberLongTap(item)}
            onPress={() => onUserAvatarPress(item)}
            h={hp('10%')}
            flexDirection={'row'}
            alignItems="center"
            accessibilityLabel="User profile (tap to open)"
            flex={1}>
            <Box
              h={hp('6.5')}
              w={hp('6.5%')}
              rounded={'md'}
              justifyContent={'center'}
              alignItems={'center'}
              shadow="2"
              bg={commonColors.primaryColor}
              margin={2}>
              {item.profile !== 'none' ? (
                <Image
                  alt={item.name}
                  source={{uri: item.profile}}
                  h={hp('6.5')}
                  w={hp('6.5%')}
                  rounded={'md'}
                />
              ) : (
                <Text
                  fontWeight={'bold'}
                  fontFamily={textStyles.boldFont}
                  fontSize={hp('2.2%')}
                  shadow="10"
                  color={'white'}>
                  {item.name ? item.name[0] : null}
                </Text>
              )}
            </Box>
            <HStack flex={0.7}>
              <Text
                fontFamily={textStyles.boldFont}
                fontWeight="bold"
                shadow="2"
                fontSize={hp('1.8%')}>
                {item.name ? item.name : null}
              </Text>
              {(chatStore.roomRoles[currentRoomDetail?.jid] === 'moderator' ||
                chatStore.roomRoles[currentRoomDetail?.jid] === 'admin') &&
                !item.jid.includes(manipulatedWalletAddress) &&
                (item.role !== 'moderator' ||
                  item.role !== 'admin' ||
                  item.role !== 'owner') && (
                  <Button
                    padding={'0'}
                    width={hp('7%')}
                    height={hp('3.5%')}
                    justifyContent="center"
                    alignItems="center"
                    variant={'solid'}
                    borderColor={'red.400'}
                    bgColor={'red.400'}
                    marginLeft={2}
                    onPress={() => handleKickDialog(item)}>
                    <Text
                      fontSize={hp('1.5%')}
                      color={'white'}
                      fontFamily={textStyles.boldFont}>
                      {item.ban_status === 'clear' ? 'Kick' : 'Un-kick'}
                    </Text>
                  </Button>
                )}
            </HStack>

            {item.ban_status !== 'clear' ? (
              <Box
                borderWidth={1}
                rounded="full"
                justifyContent={'center'}
                alignItems={'center'}
                flex={0.2}>
                {/* Banned */}
                Kicked
              </Box>
            ) : null}

            {item.role !== 'none' && item.role !== 'outcast' && (
              <Box
                borderWidth={item.role ? 1 : 0}
                rounded="full"
                justifyContent={'center'}
                alignItems={'center'}
                flex={0.2}>
                {item.role}
              </Box>
            )}
          </Pressable>
        )}
      />
    </Box>
  );

  const SecondRoute = () => (
    <Center flex={1} my="4">
      This is Tab 2
    </Center>
  );

  const ThirdRoute = () => (
    <Center flex={1} my="4">
      This is Tab 3
    </Center>
  );

  const slider = () => {
    return (
      <View padding={2}>
        <Box margin={2}>
          <Text
            color={'black'}
            fontWeight={'bold'}
            fontFamily={textStyles.boldFont}
            fontSize={hp('2%')}>
            {routes[0].title}
          </Text>
        </Box>
        <FirstRoute />
      </View>
    );
  };

  const handleChangeDescription = (newDescription: string) => {
    setDescriptionModalVisible(false);
    changeRoomDescription(
      manipulatedWalletAddress,
      roomJID,
      newDescription,
      chatStore.xmpp,
    );
  };

  const handleChangeRoomName = (newRoomName: string) => {
    setRoomNameModalVisible(false);
    renameTheRoom(
      manipulatedWalletAddress,
      currentRoomDetail.jid,
      {
        roomName: newRoomName,
      },
      chatStore.xmpp,
      chatStore.updateRoomInfo,
    );
  };

  return (
    <View bg={'white'} flex={1}>
      <View justifyContent={'flex-start'}>{chatDetailsNavBar()}</View>
      <View flex={0.4} justifyContent={'center'}>
        <RoomDetails room={currentRoomDetail} />
      </View>
      <View justifyContent={'center'} flex={0.6}>
        {slider()}
      </View>
      {/* <View justifyContent={'center'} flex={0.3}>
        {footerControls()}
      </View> */}

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            onPress={() => handleLongTapMenu(0)}
            _text={{
              fontFamily: textStyles.mediumFont,
              color: 'red.500',
            }}>
            {longTapUser.ban_status === 'clear' ? 'Ban' : 'Unban'}
          </Actionsheet.Item>

          <Actionsheet.Item
            onPress={() => handleLongTapMenu(1)}
            _text={{
              fontFamily: textStyles.mediumFont,
            }}>
            {longTapUser.role === 'none' || 'participant'
              ? 'Assign Moderator'
              : 'Unassign Moderator'}
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isShowKickDialog}
        onClose={handleCloseKickDialog}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>
            <Text fontSize={hp('2%')} fontFamily={textStyles.boldFont}>
              {kickUserItem.ban_status === 'clear'
                ? 'Kick user'
                : 'Un-Kick user'}
            </Text>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <Text fontSize={hp('1.5%')} fontFamily={textStyles.regularFont}>
              {kickUserItem.ban_status === 'clear'
                ? 'This will block the user from sending any messages to the room. You will be able to ‘un-kick’ them later.'
                : 'This will un-block the user.'}
            </Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={handleCloseKickDialog}
                ref={cancelRef}>
                <Text fontSize={hp('1.5%')} fontFamily={textStyles.boldFont}>
                  Cancel
                </Text>
              </Button>
              <Button colorScheme="danger" onPress={handleKick}>
                <Text
                  fontSize={hp('1.5%')}
                  color={'white'}
                  fontFamily={textStyles.boldFont}>
                  {kickUserItem.ban_status === 'clear' ? 'Kick' : 'Un-kick'}
                </Text>
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      <ChangeRoomDescriptionModal
        modalVisible={descriptionModalVisible}
        setModalVisible={setDescriptionModalVisible}
        currentDescription={chatStore.roomsInfoMap[roomJID]?.roomDescription}
        changeDescription={handleChangeDescription}
      />

      <ChangeRoomNameModal
        modalVisible={roomNameModalVisible}
        setModalVisible={setRoomNameModalVisible}
        currentRoomName={currentRoomDetail?.name}
        changeRoomName={handleChangeRoomName}
      />
    </View>
  );
});

export default ChatDetailsScreen;
