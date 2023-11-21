import { Button, HStack, Icon, Input, TextArea, View } from "native-base"
import React, { useState } from "react"
import SecondaryHeader from "../../components/SecondaryHeader/SecondaryHeader"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"
import { commonColors, defaultBotsList, textStyles } from "../../../docs/config"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from "react-native-image-picker"
import { sha256 } from "react-native-sha256"
import { useStores } from "../../stores/context"
import { underscoreManipulation } from "../../helpers/underscoreLogic"
import {
  createNewRoom,
  roomConfig,
  sendInvite,
  setOwner,
  setRoomImage,
  subscribeToRoom,
} from "../../xmpp/stanzas"
import { useNavigation } from "@react-navigation/native"
import { httpPost } from "../../config/apiService"
import FastImage from "react-native-fast-image"
import { uploadFiles } from "../../helpers/uploadFiles"
import { fileUpload } from "../../config/routesConstants"
import { Alert } from "react-native"
import { HomeStackNavigationProp } from "../../navigation/types"

interface NewChatScreenProps {}

const options: ImageLibraryOptions = {
  mediaType: "photo",
}

const OPOSITE_DIRECTIONS: Record<string, string> = {
  W: "E",
  E: "W",
  S: "N",
  N: "S",
}

const getOpositeDirection = (direction: string) => {
  return OPOSITE_DIRECTIONS[direction]
}

const NewChatScreen = (props: NewChatScreenProps) => {
  const [chatAvatar, setChatAvatar] = useState()
  const [chatName, setChatName] = useState("")
  const [chatDescription, setChatDescription] = useState("")
  const [loading, setLoading] = useState(false)
  //@ts-ignore
  const params = props.route.params
  const { loginStore, chatStore, apiStore } = useStores()

  const { walletAddress } = loginStore.initialData
  const manipulatedWalletAddress = underscoreManipulation(walletAddress)

  const navigation = useNavigation<HomeStackNavigationProp>()

  const sendFiles = async (data: any) => {
    setLoading(true)
    try {
      const url = fileUpload
      const response = await uploadFiles(data, loginStore.userToken, url)
      setLoading(false)
      setChatAvatar(response.results[0].location)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChatAvatar = () => {
    launchImageLibrary(options, (response) => {
      console.log("Response = ", response)

      if (response.didCancel) {
        console.log("User cancelled image picker")
      } else if (response.errorMessage) {
        Alert.alert("ImagePicker Error: ", response.errorMessage)
      } else {
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        const data = new FormData()

        if (response.assets) {
          data.append("files", {
            name: response.assets[0].fileName,
            type: response.assets[0].type,
            uri: response.assets[0].uri,
          })

          sendFiles(data)
        }
      }
    })
  }

  const handleCreateNewChat = () => {
    let roomHash = ""
    if (!chatName) {
      Alert.alert("Please fill Chat Name")
      return
    }
    const randomNumber = Math.round(Math.random() * 100000)

    const name = chatName + new Date().getTime() + randomNumber
    sha256(name).then(async (hash) => {
      roomHash = hash

      createNewRoom(manipulatedWalletAddress, roomHash, chatStore.xmpp)

      setOwner(manipulatedWalletAddress, roomHash, chatStore.xmpp)

      roomConfig(
        manipulatedWalletAddress,
        roomHash,
        { roomName: chatName, roomDescription: chatDescription },
        chatStore.xmpp
      )
      chatAvatar &&
        setRoomImage(
          manipulatedWalletAddress + "@" + apiStore.xmppDomains.DOMAIN,
          roomHash + apiStore.xmppDomains.CONFERENCEDOMAIN,
          chatAvatar,
          "none",
          "icon",
          chatStore.xmpp
        )

      subscribeToRoom(
        roomHash + apiStore.xmppDomains.CONFERENCEDOMAIN,
        manipulatedWalletAddress,
        chatStore.xmpp
      )
      defaultBotsList.forEach((bot) => {
        sendInvite(
          manipulatedWalletAddress,
          roomHash + apiStore.xmppDomains.CONFERENCEDOMAIN,
          bot.jid,
          chatStore.xmpp
        )
      })
      if (params?.metaDirection) {
        const body = {
          name: chatName,
          roomJid: roomHash,
          from: {
            direction: params.metaDirection,
            roomJid: params.metaRoom.roomJid,
          },
        }
        const res = await httpPost("/room", body, loginStore.userToken)
        console.log(res?.data)
      }

      navigation.navigate("ChatScreen", {
        chatJid: roomHash + apiStore.xmppDomains.CONFERENCEDOMAIN,
        chatName: chatName,
      })
    })
  }
  return (
    <View testID="NewChatScreen">
      <SecondaryHeader title="Create new chat" />
      <View margin={5}>
        <HStack>
          <View flex={0.2}>
            <Button
              w={wp("15%")}
              h={wp("15%")}
              borderRadius={wp("15%") / 2}
              borderColor={commonColors.primaryColor}
              borderWidth={1}
              bg="transparent"
              justifyContent="center"
              alignItems={"center"}
              onPress={handleChatAvatar}
            >
              {chatAvatar ? (
                <FastImage
                  source={{ uri: chatAvatar }}
                  style={{
                    width: wp("15%"),
                    height: wp("15%"),
                    borderRadius: wp("15%") / 2,
                  }}
                />
              ) : (
                <Icon
                  as={SimpleLineIcons}
                  name="camera"
                  size={hp("3.5%")}
                  color={commonColors.primaryColor}
                />
              )}
            </Button>
          </View>
          <Input
            testID="newChatName"
            _input={{
              maxLength: 50,
            }}
            onChangeText={(text) => setChatName(text)}
            placeholder="Chat name"
            placeholderTextColor={commonColors.primaryColor}
            color="black"
            borderWidth={1}
            borderRadius={5}
            borderColor={commonColors.primaryColor}
            bg={commonColors.primaryColor + "26"}
            height={wp("15%")}
            fontFamily={textStyles.lightFont}
            fontSize={hp("1.8%")}
            flex={0.8}
          />
        </HStack>

        <TextArea
          testID="chatDescription"
          scrollEnabled
          placeholder="Short description about the chat"
          onChangeText={(desc) => setChatDescription(desc)}
          placeholderTextColor={commonColors.primaryColor}
          multiline
          color={"black"}
          borderWidth={1}
          h={wp("35%")}
          borderColor={commonColors.primaryColor}
          bg={commonColors.primaryColor + "26"}
          borderRadius={5}
          marginTop={5}
          fontFamily={textStyles.lightFont}
          fontSize={hp("1.8%")}
          autoCompleteType={undefined}
        />

        <Button
          testID="createNewChat"
          onPress={handleCreateNewChat}
          bg={commonColors.primaryColor}
          borderRadius={5}
          h={hp("7%")}
          marginTop={5}
          fontSize={hp("2%")}
          color="white"
          fontFamily={textStyles.regularFont}
        >
          Create new chat
        </Button>
      </View>
    </View>
  )
}

export default NewChatScreen
