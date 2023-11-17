import { useNavigation } from "@react-navigation/native"
import { HStack, Image } from "native-base"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import Modal from "react-native-modal"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import Ionicons from "react-native-vector-icons/Ionicons"
import { coinImagePath, commonColors, textStyles } from "../../../docs/config"
import { asyncStorageGetItem } from "../../helpers/cache/asyncStorageGetItem"
import { useStores } from "../../stores/context"
import { CreateNewChatButton } from "./CreateNewChatButton"
import { metaRooms as predefinedMeta } from "../../../docs/config"
import { underscoreManipulation } from "../../helpers/underscoreLogic"
import { sendMessageStanza } from "../../xmpp/stanzas"

import Share from "react-native-share"
import { httpGet, httpPost } from "../../config/apiService"
import { homeStackRoutes } from "../../navigation/routes"
import { HomeStackNavigationProp } from "../../navigation/types"

type IRoom = {
  _id: string
  contractAddress: string
  createdAt: string
  description: string
  name: string
  ownerId: string
}

export interface IApiMetaRoom {
  _id: string
  contractAddress: string
  createdAt: Date
  description: string
  name: string
  ownerId: string
  ownerNavLinks: {
    east: IRoom | null
    north: IRoom | null
    south: IRoom | null
    west: IRoom | null
  }
  roomJid: string
  updatedAt: Date
  userNavLinks: {
    east: IRoom | null
    north: IRoom | null
    south: IRoom | null
    west: IRoom | null
  }
}

export interface IMetaNavigation {
  chatId: string
  open: boolean
  onClose: () => void
}
const DIRECTIONS = {
  NORTH: "north",
  WEST: "west",
  SOUTH: "south",
  EAST: "east",
}
const SHORT_DIRECTIONS: Record<string, string> = {
  north: "n",
  west: "w",
  south: "s",
  east: "e",
}

const OPOSITE_DIRECTIONS: Record<string, string> = {
  [DIRECTIONS.WEST]: DIRECTIONS.EAST,
  [DIRECTIONS.EAST]: DIRECTIONS.WEST,
  [DIRECTIONS.SOUTH]: DIRECTIONS.NORTH,
  [DIRECTIONS.NORTH]: DIRECTIONS.SOUTH,
}

const getOpositeDirection = (direction: string) => {
  return OPOSITE_DIRECTIONS[direction]
}

const CompassItem = ({
  room,
  name,
  chatId,
  setDirection,
}: {
  room: IApiMetaRoom | undefined
  name: string
  chatId: string
  setDirection: () => void
}) => {
  const navigation = useNavigation<HomeStackNavigationProp>()
  const { apiStore } = useStores()
  if (!room) {
    return (
      <HStack
        justifyContent={"center"}
        alignItems={"center"}
        style={{ paddingVertical: 10 }}
      >
        <TouchableOpacity
          disabled={!chatId}
          onPress={() => {
            setDirection()
            navigation.navigate("ChatScreen", {
              chatJid: "",
            })
          }}
        >
          <Text
            style={{
              color: "black",
              textAlign: "center",
              fontFamily: textStyles.mediumFont,
              fontSize: 16,
            }}
          >
            {"Empty"}
          </Text>
        </TouchableOpacity>
      </HStack>
    )
  }
  return (
    <HStack
      justifyContent={"center"}
      alignItems={"center"}
      style={{ paddingVertical: 10 }}
    >
      <TouchableOpacity
        onPress={() => {
          setDirection()

          navigation.navigate("ChatScreen", {
            chatJid: room.roomJid + apiStore.xmppDomains.CONFERENCEDOMAIN,
          })
        }}
      >
        <Text
          style={{
            color: "black",
            textAlign: "center",
            fontFamily: textStyles.mediumFont,
            fontSize: 16,
          }}
        >
          {name}
        </Text>
      </TouchableOpacity>
    </HStack>
  )
}

const MetaHeader = ({
  room,
  direction,
  previousRoom,
}: {
  room: IApiMetaRoom | undefined
  direction: string
  previousRoom: IApiMetaRoom | undefined
}) => {
  const navigation = useNavigation<HomeStackNavigationProp>()
  if (!room?.name) {
    return (
      <View style={[styles.top, styles.innerContainer]}>
        <Text style={{ fontFamily: textStyles.semiBoldFont, color: "black" }}>
          This space is empty. You can build your own room here for 120{" "}
          <Image
            alt="Coin Image"
            source={coinImagePath}
            h={hp("3%")}
            w={hp("3%")}
          />
        </Text>
        <CreateNewChatButton
          onPress={() =>
            navigation.navigate("NewChatScreen", {
              metaDirection: direction,
              metaRoom: previousRoom,
            })
          }
        />
      </View>
    )
  }
  return (
    <View style={[styles.top, styles.innerContainer]}>
      <Text style={{ fontFamily: textStyles.semiBoldFont, color: "black" }}>
        {room.name}
      </Text>
      <Text style={{ fontFamily: textStyles.semiBoldFont, color: "black" }}>
        {room.description}
      </Text>
    </View>
  )
}
const emptyMetaRoom = {
  name: "",
  description: "",
  ownerNavLinks: { west: null, east: null, north: null, south: null },
  ownerId: "",
  contractAddress: "",
  createdAt: new Date(),
  _id: "",
  roomJid: "",
  updatedAt: new Date(),
  userNavLinks: { west: null, east: null, north: null, south: null },
}
const roomRoute = "/room"
export const MetaNavigation: React.FC<IMetaNavigation> = ({
  chatId,
  open,
  onClose,
}) => {
  const [previousDirection, setPreviousDirection] = useState("")
  const [loading, setLoading] = useState(false)

  const [metaRooms, setMetaRooms] = useState<IApiMetaRoom[]>([])
  const [previousRoom, setPreviuosRoom] = useState<IApiMetaRoom | undefined>()
  const { loginStore, chatStore, apiStore } = useStores()
  const [currentMetaRoom, setCurrentMetaRoom] =
    useState<IApiMetaRoom>(emptyMetaRoom)
  const getMetaRooms = async () => {
    const rooms = await asyncStorageGetItem("metaRooms")
    setMetaRooms(rooms || predefinedMeta)
  }

  // getting last rooms where user was
  const getCurrentRoom = async () => {
    setLoading(true)
    try {
      const res = await httpGet(
        roomRoute + "/getRoom/" + chatId,
        loginStore.userToken
      )
      setCurrentMetaRoom(res.data.result)
    } catch (error) {
      setCurrentMetaRoom(emptyMetaRoom)
      console.log(error)
    }
    setLoading(false)
  }
  useEffect(() => {
    getMetaRooms()
  }, [])
  useEffect(() => {
    if (!chatId) {
      setCurrentMetaRoom(emptyMetaRoom)
    }
    if (chatId) {
      getCurrentRoom()
    }
  }, [chatId])
  const checkEmptyDirections = () => {
    return (
      !currentMetaRoom?.ownerNavLinks?.south &&
      !currentMetaRoom?.ownerNavLinks?.east &&
      !currentMetaRoom?.ownerNavLinks?.west &&
      !currentMetaRoom?.ownerNavLinks?.north &&
      !currentMetaRoom?.userNavLinks?.south &&
      !currentMetaRoom?.userNavLinks?.east &&
      !currentMetaRoom?.userNavLinks?.west &&
      !currentMetaRoom?.userNavLinks?.north
    )
  }

  const sendMessage = (chatName: string, jid: string, isPrevious: boolean) => {
    const manipulatedWalletAddress = underscoreManipulation(
      loginStore.initialData.walletAddress
    )
    const textEnter =
      loginStore.initialData.firstName +
      " " +
      loginStore.initialData.lastName +
      " " +
      "has joined" +
      " " +
      "<-"
    const textLeave =
      loginStore.initialData.firstName +
      " " +
      loginStore.initialData.lastName +
      " " +
      "has left" +
      " " +
      "->"
    const data = {
      senderFirstName: loginStore.initialData.firstName,
      senderLastName: loginStore.initialData.lastName,
      senderWalletAddress: loginStore.initialData.walletAddress,
      isSystemMessage: true,
      tokenAmount: 0,
      receiverMessageId: "",
      mucname: chatName,
      photoURL: loginStore.userAvatar,
      roomJid: jid,
      isReply: false,
      mainMessage: undefined,
      push: false,
    }

    sendMessageStanza(
      manipulatedWalletAddress,
      jid,
      isPrevious ? textLeave : textEnter,
      data,
      chatStore.xmpp
    )
  }
  // join request, sends every time when user entered to the room
  const sendRoomJoin = async () => {
    try {
      await httpPost(roomRoute + "/join/" + chatId, {}, loginStore.userToken)
    } catch (error) {
      console.log(error)
    }
  }
  // sends leaving message to the room
  useEffect(() => {
    if (previousRoom?.name) {
      sendMessage(
        previousRoom.name,
        previousRoom.roomJid + apiStore.xmppDomains.CONFERENCEDOMAIN,
        true
      )
    }
  }, [previousRoom])
  // sends joining message to the room
  useEffect(() => {
    if (currentMetaRoom.name) {
      sendMessage(
        currentMetaRoom.name,
        currentMetaRoom.roomJid + apiStore.xmppDomains.CONFERENCEDOMAIN,
        false
      )
      sendRoomJoin()
    }
  }, [currentMetaRoom])

  const exportRooms = async () => {
    try {
      const res = await Share.open({
        message: JSON.stringify(metaRooms),
        title: "Cached rooms",
      })
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  if (!currentMetaRoom.roomJid && !previousDirection) {
    return null
  }

  const renderDirections = (direction: string) => {
    const oppositePreviousDirection = getOpositeDirection(previousDirection)
    if (checkEmptyDirections() && direction === oppositePreviousDirection) {
      return (
        <CompassItem
          name={oppositePreviousDirection + ":" + previousRoom?.name}
          chatId={chatId}
          room={previousRoom}
          setDirection={() => {
            setPreviousDirection(oppositePreviousDirection)
            setPreviuosRoom(previousRoom)
          }}
        />
      )
    }
    return (
      <CompassItem
        name={
          SHORT_DIRECTIONS[direction] +
          ":" +
          (currentMetaRoom.ownerNavLinks[direction]?.name ||
            currentMetaRoom.userNavLinks[direction]?.name)
        }
        chatId={chatId}
        room={
          currentMetaRoom?.ownerNavLinks?.[direction] ||
          currentMetaRoom?.userNavLinks?.[direction]
        }
        setDirection={() => {
          setPreviousDirection(direction)
          setPreviuosRoom(currentMetaRoom)
        }}
      />
    )
  }
  return (
    <Modal isVisible={open} onBackdropPress={onClose}>
      {loading ? (
        <ActivityIndicator color={commonColors.primaryColor} size={50} />
      ) : (
        <View style={styles.container}>
          <MetaHeader
            room={currentMetaRoom}
            direction={previousDirection}
            previousRoom={previousRoom}
          />
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <View style={[styles.bottom, styles.innerContainer]}>
            {renderDirections(DIRECTIONS.NORTH)}
            <HStack justifyContent={"space-between"} alignItems={"center"}>
              <View style={{ width: "30%" }}>
                {renderDirections(DIRECTIONS.WEST)}
              </View>
              <View
                style={{
                  width: "30%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={exportRooms} activeOpacity={0.9}>
                  <Ionicons
                    name={"compass"}
                    size={70}
                    color={commonColors.primaryDarkColor}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ width: "30%" }}>
                {renderDirections(DIRECTIONS.EAST)}
              </View>
            </HStack>
            {renderDirections(DIRECTIONS.SOUTH)}
          </View>
        </View>
      )}
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: hp("100%"),
    justifyContent: "space-between",
  },
  innerContainer: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: commonColors.primaryColor,
  },
  top: {
    backgroundColor: "white",
    height: "20%",
    marginTop: 30,
  },
  bottom: {
    backgroundColor: "white",
    height: "40%",
  },
})
