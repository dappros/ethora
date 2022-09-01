import { Box, Center, Divider, FlatList, HStack, Image, Menu, Pressable, Switch, Text, useColorModeValue, View } from 'native-base';
import * as React from 'react';
import { commonColors, defaultChats, textStyles } from '../../docs/config';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { Alert, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { useStores } from '../stores/context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { underscoreManipulation } from '../helpers/underscoreLogic';
import { observer } from 'mobx-react-lite';
import { leaveRoomXmpp, subscribeToRoom, unsubscribeFromChatXmpp } from '../xmpp/stanzas';
import { deleteChatRoom } from '../components/realmModels/chatList';

interface ChatDetailsScreenProps {}

    const data = [{
      fullName: "Yehor Markelov",
      role: "admin",
    }, 
    {
        fullName: "Eillie Bilish",
        role: "admin",
    }, 
    {
        fullName: "Roger Jetson",
        role: null,
    }];

const ChatDetailsScreen = observer(({route}: any) => {
    const {chatStore, loginStore} = useStores();
    const currentRoomDetail = chatStore.roomList?.filter((item:any)=>{
        if(item.name === route.params.roomName){
            return item
        }
    })
    const roomJID = currentRoomDetail[0].jid;

    const isFavourite = chatStore.roomsInfoMap[roomJID]?.isFavourite;

    const [open, setOpen] = React.useState<boolean>(false);
    const [index, setIndex] = React.useState<number>(0);
    // const [isNotification, setIsNotification] = React.useState<boolean>(roomInfo.muted)


    const walletAddress = loginStore.initialData.walletAddress;
    const manipulatedWalletAddress = underscoreManipulation(walletAddress);
    


    const unsubscribeFromRoom = () => {
        unsubscribeFromChatXmpp(manipulatedWalletAddress, roomJID, chatStore.xmpp);
        chatStore.updateRoomInfo(roomJID, {muted: true});
    };

    const subscribeRoom = () => {
        subscribeToRoom(roomJID, manipulatedWalletAddress, chatStore.xmpp);
        chatStore.updateRoomInfo(roomJID, {muted: false});
    }

    const toggleNotification = (value) => {
        if(!value){
            // unsubscribeFromChatXmpp(manipulatedWalletAddress, roomJID, chatStore.xmpp);
            // chatStore.updateRoomInfo(roomJID, {muted: true});
            unsubscribeFromRoom()
        }else{
            subscribeRoom()
        }
    }

    const leaveTheRoom = async() => {
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
    }

    const deleteRoomAlert = async() => {
        Alert.alert(
            "Delete",
            "Do you want to delete this room?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("canceled"),
              },
              {
                text: "Yes",
                onPress: () => leaveTheRoom()
              }
            ],
          );
      };

    const routes =[{
        key: 'first',
        title: `Members (${currentRoomDetail[0].participants})`
      }, {
        key: 'second',
        title: 'Bots'
      }, {
        key: 'third',
        title: 'Items'
      }];


    const toggleFavourite = () => {
        chatStore.updateRoomInfo(roomJID, {isFavourite:!chatStore.roomsInfoMap[roomJID]?.isFavourite})
    }

    const toggleMenu = () => {
        open ? setOpen(false) : setOpen(true);
    };

    const navigation = useNavigation();

    const chatDetailsNavBar = () => {

        const FavMenuContent = chatStore.roomsInfoMap[roomJID]?.isFavourite?'Remove from favourites':'Add to favourites';
        return(
            <Box h={60} justifyContent={'center'} bg={commonColors.primaryColor}>
                <HStack>
                    <View flex={0.6}>
                        <TouchableOpacity
                        onPress={()=>navigation.goBack()}
                        >
                            <AntIcon
                            name={'arrowleft'}
                            style={{marginRight: 5, marginLeft: 5}}
                            size={hp('3%')}
                            color={'white'}
                            />
                        </TouchableOpacity>
                    </View>


                    <View flex={0.4} flexDirection="row">
                        <View flex={0.3}>
                            <TouchableOpacity
                            disabled={defaultChats[roomJID.split('@')[0]]?true:false}
                            onPress={toggleFavourite}
                            >
                                <AntIcon
                                name={chatStore.roomsInfoMap[roomJID]?.isFavourite||defaultChats[roomJID.split('@')[0]]?'star':'staro'}
                                style={{marginRight: 5, marginLeft: 5}}
                                size={hp('3%')}
                                color={'white'}
                                />
                            </TouchableOpacity>
                        </View>

                        {
                        defaultChats[roomJID.split('@')[0]]?<View flex={0.3}></View>:
                        <View flex={0.3}>
                            <TouchableOpacity
                            disabled={defaultChats[roomJID.split('@')[0]]?true:false}
                            onPress={deleteRoomAlert}
                            >
                                <AntIcon
                                name={'delete'}
                                style={{marginRight: 5, marginLeft: 5}}
                                size={hp('3%')}
                                color={'white'}
                                />
                            </TouchableOpacity>
                        </View>
                        }

                        <View paddingRight={2} alignItems={"flex-end"} flex={0.4}>
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
                                    <EntypoIcon name="menu" color="#FFFFFF" size={hp('3%')} />
                                    </TouchableOpacity>
                                );
                            }}>
                                {
                                defaultChats[roomJID.split('@')[0]]?null:
                                <>
                                    <Menu.Item
                                    onPress={toggleFavourite}
                                    _text={{
                                        fontFamily:textStyles.lightFont
                                    }}
                                    >{FavMenuContent}</Menu.Item>
                                    
                                    <Divider/>
                                </>
                                }
                                <Menu.Item
                                _text={{
                                    fontFamily:textStyles.lightFont
                                }}
                                >Edit settings</Menu.Item>
                                {
                                defaultChats[roomJID.split('@')[0]]?null:
                                <>
                                    <Divider/>
                                    <Menu.Item
                                    onPress={deleteRoomAlert}
                                    _text={{
                                        fontFamily:textStyles.lightFont,
                                        color:"#D32222"
                                    }}>Delete and leave</Menu.Item>
                                </>
                                }
                            </Menu>
                        </View>
                    </View>
                </HStack>
            </Box>

        )
    }

    const FirstRoute = () => 
    <Box bg={"#E5EBF5"}>
        <FlatList
        data={data}
        renderItem={({
            item
          }) => 
            <Box 
            h={hp("10%")}
            flexDirection={"row"}
            alignItems="center"
            flex={1}
            >
                <Box 
                h={hp("6.5")}
                w={hp("6.5%")}
                rounded={"md"}
                justifyContent={"center"}
                alignItems={"center"}
                shadow="2"
                bg={commonColors.primaryColor}
                margin={2}
                >
                    <Text
                    fontWeight={"bold"}
                    fontFamily={textStyles.boldFont}
                    fontSize={hp("2.2%")}
                    shadow="10"
                    color={"white"}
                    >
                        {item.fullName[0]}
                    </Text>
                </Box>
                <Box
                flex={0.7}
                >
                    <Text
                    fontFamily={textStyles.boldFont}
                    fontWeight="bold"
                    shadow="2"
                    fontSize={hp("1.8%")}
                    >{item.fullName}</Text>
                </Box>

                <Box
                borderWidth={item.role?1:0}
                rounded="full"
                justifyContent={"center"}
                alignItems={"center"}
                flex={0.2}
                >
                    {item.role}
                </Box>

            </Box>
        }
        />
    </Box>;

    const SecondRoute = () => 
    <Center flex={1} my="4">
        This is Tab 2
    </Center>;

    const ThirdRoute = () => 
    <Center flex={1} my="4">
        This is Tab 3
    </Center>;

    const initialLayout = {
        width: Dimensions.get('window').width
    };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute
  });

    const renderTabBar = props => {
        const inputRange = props.navigationState.routes.map((x, i) => i);
        return <Box flexDirection="row">
            {props.navigationState.routes.map((route, i) => {
            const opacity = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map(inputIndex => inputIndex === i ? 1 : 0.5)
            });
            const color = index === i ? useColorModeValue(commonColors.primaryColor, '#e5e5e5') : useColorModeValue('#1f2937', '#a1a1aa');
            const borderColor = index === i ? commonColors.primaryColor : useColorModeValue('coolGray.200', 'gray.400');
            return <Box borderBottomWidth="3" borderColor={borderColor} flex={1} alignItems="center" p="3">
                  <Pressable onPress={() => {
                console.log(i);
                setIndex(i);
              }}>
                    <Animated.Text
                    style={{
                  color,
                  fontFamily:textStyles.boldFont
                  
                }}>{route.title}</Animated.Text>
                  </Pressable>
                </Box>;
          })}
          </Box>;
      };

    const roomDetails = () => {

        const roomName = route.params.roomName;

        return(
            <View
            margin={10}
            justifyContent="center" 
            alignItems="center">
                <Box
                justifyContent={"center"}
                alignItems={"center"}
                rounded="md"
                shadow={"5"}
                bg={commonColors.primaryDarkColor}
                h={hp('18%')}
                w={hp('18%')}
                marginBottom={4}
                >
                    <Text
                    shadow={"8"}
                    fontSize={hp('8%')}
                    fontFamily={textStyles.semiBoldFont}
                    color={"white"}
                    >{roomName[0]}</Text>
                </Box>


                <Text
                fontSize={hp('2.5%')}
                fontFamily={textStyles.boldFont}
                >
                    {roomName}
                </Text>
                <Text
                textAlign={"center"}
                fontSize={hp('1.5%')}
                fontFamily={textStyles.regularFont}
                >
                    Description entered during chat creation will be displayed here      
                </Text>
            </View>
        )
    }
    
    const slider = () => {
        return(
            <TabView navigationState={{
                index,
                routes
            }}
            renderScene={renderScene}
            renderTabBar={renderTabBar} 
            onIndexChange={setIndex} 
            initialLayout={initialLayout}/>
        )
    }

    const footerControls = () => {
        return(
            <Box
            bg={"#E5EBF5"}
            h={hp('7%')}
            justifyContent="center"
            paddingLeft={"2"}
            paddingRight={"2"}
            >
                <HStack
                >
                    {
                    defaultChats[roomJID.split('@')[0]]?<View flex={0.5}></View>:
                    <TouchableOpacity
                    onPress={deleteRoomAlert}
                    style={{
                    flexDirection:"row",
                    alignItems:"center",
                    flex:0.5
                    }}>
                        <MaterialIcons
                        name='exit-to-app'
                        size={hp('3%')}
                        color="#D32222"
                        />
                        <Text
                        fontFamily={textStyles.boldFont}
                        fontSize={hp('2%')}
                        color="#D32222"
                        >
                            Leave Room
                        </Text>
                    </TouchableOpacity>
                    }

                    <HStack
                    justifyContent={"flex-end"}
                    alignItems="center"
                    flex={0.5}>
                        <Text
                        fontFamily={textStyles.boldFont}
                        fontSize={hp('2%')}
                        color={commonColors.primaryColor}
                        >
                            Notifications
                        </Text>
                        <Switch
                        isChecked={!chatStore.roomsInfoMap[roomJID].muted}
                        onToggle={(args)=>toggleNotification(args)}
                        onTrackColor={commonColors.primaryColor}
                        size={"sm"}
                        />
                    </HStack>
                </HStack>
            </Box>
        )
    }
    

    return (
        <View 
        justifyContent={"center"}
        flex={1}>
            <View
            justifyContent={"flex-start"}
            flex={0.2}>
            {chatDetailsNavBar()}
            </View>
            <View
            justifyContent={"center"}
            flex={0.3}>
            {roomDetails()}
            </View>
            <View
            justifyContent={"center"}
            flex={0.3}>
            {slider()}
            </View>
            <View
            justifyContent={"center"}
            flex={0.2}>
            {footerControls()}
            </View>
        </View>
    );
});

export default ChatDetailsScreen;
