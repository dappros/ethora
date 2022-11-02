import { Button, FlatList, HStack, Text, View } from 'native-base';
import * as React from 'react';
import { commonColors, defaultChatBackgroundTheme, textStyles } from '../../docs/config';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ChatBackgroundCard from '../components/Chat/ChatBackgroundCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStores } from '../stores/context';
import { observer } from 'mobx-react-lite';
import { setRoomImage } from '../xmpp/stanzas';
import { underscoreManipulation } from '../helpers/underscoreLogic';
import DocumentPicker from 'react-native-document-picker';
import { uploadFiles } from '../helpers/uploadFiles';
import { fileUpload } from '../config/routesConstants';

interface ChangeBackgroundScreenProps {}

const renderCard = (index:number, item:{value:string, isSelected:boolean, title:string, isImage:boolean}, onSelect:any) => {
    const mod = index%2;
    return(
        <View
        marginTop={1}
        marginRight={mod===0?0.5:0} 
        marginLeft={mod===1?0.5:0}>
            <ChatBackgroundCard
                value={item.value}
                isSelected={item.isSelected}
                title={item.title}
                isImage={item.isImage}
                index={index}
                onSelect={onSelect}
            />
        </View>
    )
}

const ChangeBackgroundScreen = observer((props: any) => {
    const navigation = useNavigation();
    const {chatStore, loginStore, apiStore} = useStores()
    const roomJID = props.route.params.roomJID

    React.useEffect(()=>{
        const selectedRoomBackgroundIndex = chatStore.roomsInfoMap[roomJID]?.roomBackgroundIndex
        chatStore.changeBackgroundTheme(selectedRoomBackgroundIndex?parseInt(selectedRoomBackgroundIndex):0)
    },[])

    const currentRoomDetail = chatStore.roomList?.find((item: any) => {
        if (item.name === props.route.params.roomName) {
          return item;
        }
      });

    const userJid =
    underscoreManipulation(loginStore.initialData.walletAddress) +
    '@' +
    apiStore.xmppDomains.DOMAIN;
    
    const roomJid = currentRoomDetail.jid;
    function onSelect(index:number){
        chatStore.changeBackgroundTheme(index)
    }
    const sendFiles = async (data: any) => {
        try {
            const url = apiStore.defaultUrl + fileUpload;
            const response = await uploadFiles(data, loginStore.userToken, url);
            const file = response.results[0];
            setRoomImage(
                userJid,
                roomJid,
                currentRoomDetail.roomThumbnail?currentRoomDetail.roomThumbnail:'none',
                file.location,
                chatStore.xmpp
            );
            chatStore.updateRoomInfo(roomJID,{
                roomBackgroundIndex:-1
            })
            chatStore.changeBackgroundTheme(-1);
            
        } catch (error) {
            console.log(error);
        }
    };

    const onUploadPress = async () => {
        if (
          chatStore.roomRoles[currentRoomDetail.jid] === 'moderator' ||
          chatStore.roomRoles[currentRoomDetail.jid] === 'admin'
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

    // React.useEffect(()=>{
    //     setBackgroundTheme(chatStore.backgroundTheme);
    // },[chatStore.backgroundTheme])

    function onSetBackround() {
        if(chatStore.selectedBackgroundIndex!=-1){
            setRoomImage(
                userJid,
                roomJid,
                currentRoomDetail.roomThumbnail?currentRoomDetail.roomThumbnail:'none',
                defaultChatBackgroundTheme[chatStore.selectedBackgroundIndex].value,
                chatStore.xmpp
            );
        }
        chatStore.updateRoomInfo(roomJID,{
            roomBackgroundIndex:chatStore.selectedBackgroundIndex
        })
    }

    return (
        <View flex={1} padding="5">

            <HStack justifyContent={"flex-start"} alignItems={"center"}>
                <HStack justifyContent={"flex-start"} alignItems={"center"}>
                    <Pressable onPress={()=>navigation.goBack()}>
                        <MaterialIcons
                        color={"black"}
                        name='arrow-back-ios'
                        size={hp('3%')}
                        />
                    </Pressable>
                    <Text
                    fontWeight={"bold"}
                    fontSize={hp('2.5')}
                    fontFamily={textStyles.boldFont}
                    >Change Background</Text>
                </HStack>
                <Button
                isDisabled={chatStore.selectedBackgroundIndex===-1}
                onPress={onSetBackround}
                padding={0} 
                h={hp("4%")} 
                w={hp('8%')} 
                marginLeft={6} 
                bg={commonColors.primaryDarkColor}>
                    <Text
                    fontFamily={textStyles.regularFont}
                    color="white"
                    fontSize={hp("1.5%")}
                    >Set</Text>
                </Button>
            </HStack>

            <Button
            bgColor={"transparent"}
            borderWidth={1}
            borderColor={commonColors.primaryDarkColor}
            onPress={onUploadPress}
            marginTop={2}
            marginBottom={2}>
                <Text
                color={commonColors.primaryDarkColor}
                fontFamily={textStyles.boldFont}
                >Upload image</Text>
            </Button>

            <Text
            fontSize={hp("1.8%")}
            fontFamily={textStyles.lightFont}
            >
                Select one of the backgrounds
            </Text>

            <FlatList
            numColumns={2}
            data={chatStore.backgroundTheme}
            renderItem={({index,item})=>renderCard(index,item, onSelect)}
            />

        </View>
    );
});

export default ChangeBackgroundScreen;

