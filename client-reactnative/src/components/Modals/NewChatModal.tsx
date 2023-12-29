import {
  Button,
  HStack,
  Icon,
  Input,
  TextArea,
  View,
  Modal,
} from "native-base";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { defaultBotsList, textStyles } from "../../../docs/config";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from "react-native-image-picker";
import { sha256 } from "react-native-sha256";
import { useStores } from "../../stores/context";
import { underscoreManipulation } from "../../helpers/underscoreLogic";
import {
  createNewRoom,
  roomConfig,
  sendInvite,
  setOwner,
  setRoomImage,
  subscribeToRoom,
} from "../../xmpp/stanzas";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { uploadFiles } from "../../helpers/uploadFiles";
import { fileUpload } from "../../config/routesConstants";
import { Alert, Text } from "react-native";
import { HomeStackNavigationProp } from "../../navigation/types";
import { httpPost } from "../../config/apiService";

interface NewChatModalProps {
  modalVisible: boolean;
  setModalVisible: any;
}

const options: ImageLibraryOptions = {
  mediaType: "photo",
};

const NewChatModal: React.FC<NewChatModalProps> = ({
  modalVisible,
  setModalVisible,
}) => {
  const [chatAvatar, setChatAvatar] = useState();
  const [chatName, setChatName] = useState("");
  const [chatDescription, setChatDescription] = useState("");
  const [loading, setLoading] = useState(false);
  //@ts-ignore
  const { loginStore, chatStore, apiStore } = useStores();

  const { walletAddress } = loginStore.initialData;
  const manipulatedWalletAddress = underscoreManipulation(walletAddress);

  const navigation = useNavigation<HomeStackNavigationProp>();

  const sendFiles = async (data: any) => {
    setLoading(true);
    try {
      const url = fileUpload;
      const response = await uploadFiles(data, loginStore.userToken, url);
      setLoading(false);
      setChatAvatar(response.results[0].location);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChatAvatar = () => {
    launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        Alert.alert("ImagePicker Error: ", response.errorMessage);
      } else {
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        const data = new FormData();

        if (response.assets) {
          data.append("files", {
            name: response.assets[0].fileName,
            type: response.assets[0].type,
            uri: response.assets[0].uri,
          });

          sendFiles(data);
        }
      }
    });
  };

  const handleCreateNewChat = () => {
    let roomHash = "";
    if (!chatName) {
      Alert.alert("Please fill Chat Name");
      return;
    }
    const randomNumber = Math.round(Math.random() * 100000);

    const name = chatName + new Date().getTime() + randomNumber;
    sha256(name).then(async (hash) => {
      roomHash = hash;

      createNewRoom(manipulatedWalletAddress, roomHash, chatStore.xmpp);

      setOwner(manipulatedWalletAddress, roomHash, chatStore.xmpp);

      roomConfig(
        manipulatedWalletAddress,
        roomHash,
        { roomName: chatName, roomDescription: chatDescription },
        chatStore.xmpp
      );
      chatAvatar &&
        setRoomImage(
          manipulatedWalletAddress + "@" + apiStore.xmppDomains.DOMAIN,
          roomHash + apiStore.xmppDomains.CONFERENCEDOMAIN,
          chatAvatar,
          "none",
          "icon",
          chatStore.xmpp
        );

      subscribeToRoom(
        roomHash + apiStore.xmppDomains.CONFERENCEDOMAIN,
        manipulatedWalletAddress,
        chatStore.xmpp
      );
      defaultBotsList.forEach((bot) => {
        sendInvite(
          manipulatedWalletAddress,
          roomHash + apiStore.xmppDomains.CONFERENCEDOMAIN,
          bot.jid,
          chatStore.xmpp
        );
      });

      //maybe use for the respond to the message new chat creatio
      // if (params?.metaDirection) {
      //   const body = {
      //     name: chatName,
      //     roomJid: roomHash,
      //     from: {
      //       direction: params.metaDirection,
      //       roomJid: params.metaRoom.roomJid,
      //     },
      //   };
      //   const res = await httpPost("/room", body, loginStore.userToken);
      //   console.log(res?.data);
      // }

      navigation.navigate("ChatScreen", {
        chatJid: roomHash + apiStore.xmppDomains.CONFERENCEDOMAIN,
        chatName: chatName,
      });
    });
  };

  const handleClose = () => {
    setModalVisible(false);
    setChatAvatar(null);
  };

  return (
    <Modal
      isOpen={modalVisible}
      onClose={handleClose}
      _backdrop={{
        bg: "black",
      }}
      animationPreset="fade"
      style={{
        paddingHorizontal: 34,
        paddingVertical: 210,
        backgroundColor: "#E8EDF2",
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 1 },
          elevation: 10,
          borderRadius: 15,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 20,
          marginVertical: 24,
        }}
      >
        <Text style={{ fontSize: 16, fontFamily: textStyles.boldFont }}>
          Create new chat
        </Text>
        <Button
          w={wp("15%")}
          h={wp("15%")}
          borderRadius={wp("15%") / 2}
          bg="#0052CD"
          justifyContent="center"
          alignItems={"center"}
          onPress={handleChatAvatar}
          marginTop={8}
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
              color={"#fff"}
            />
          )}
        </Button>
        <HStack
          flexDirection={"column"}
          width={"full"}
          style={{ paddingHorizontal: 20 }}
        >
          <Input
            testID="newChatName"
            _input={{
              maxLength: 50,
            }}
            onChangeText={(text) => setChatName(text)}
            placeholder="Chat name"
            placeholderTextColor={"#8F8F8F"}
            color="#8F8F8F"
            borderWidth={0}
            borderRadius={15}
            bg={"#F5F7F9"}
            fontFamily={textStyles.lightFont}
            fontSize={hp("1.5%")}
            h={wp("12%")}
            marginTop={8}
          />

          <TextArea
            testID="chatDescription"
            scrollEnabled
            placeholder="Description (optional)"
            onChangeText={(desc) => setChatDescription(desc)}
            placeholderTextColor={"#8F8F8F"}
            color="#8F8F8F"
            borderWidth={0}
            borderRadius={15}
            bg={"#F5F7F9"}
            fontFamily={textStyles.lightFont}
            fontSize={hp("1.5%")}
            multiline
            h={wp("23%")}
            marginTop={8}
            autoCompleteType={undefined}
          />
        </HStack>
        <HStack
          style={{
            display: "flex",
            marginLeft: 20,
            marginTop: 24,
          }}
        >
          <Button
            onPress={handleClose}
            style={{
              marginRight: 20,
              paddingVertical: 20,
              paddingHorizontal: 10,
            }}
            bg={"#CDCDCD"}
            borderRadius={25}
            fontSize={hp("2%")}
            color="white"
            fontFamily={textStyles.regularFont}
          >
            Cancel
          </Button>
          <Button
            testID="createNewChat"
            onPress={handleCreateNewChat}
            bg={"#0052CD"}
            borderRadius={25}
            fontSize={hp("2%")}
            color="white"
            fontFamily={textStyles.regularFont}
            style={{
              paddingVertical: 20,
              paddingHorizontal: 10,
            }}
          >
            Create new chat
          </Button>
        </HStack>
      </View>
    </Modal>
  );
};

export default NewChatModal;
