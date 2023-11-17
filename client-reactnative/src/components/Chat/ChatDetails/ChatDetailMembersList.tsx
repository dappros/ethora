import { Box, Button, HStack, Image, Pressable, Text } from "native-base"
import * as React from "react"
import { ActivityIndicator, FlatList } from "react-native"
import { useStores } from "../../../stores/context"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { roomListProps, roomMemberInfoProps } from "../../../stores/chatStore"
import { commonColors, textStyles } from "../../../../docs/config"
import { underscoreManipulation } from "../../../helpers/underscoreLogic"

interface ChatDetailMemebersListProps {
  handleMemberLongTap: (item: roomMemberInfoProps) => void
  onUserAvatarPress: (props: roomMemberInfoProps) => void
  handleKickDialog: (item: roomMemberInfoProps) => void
  currentRoomDetail: roomListProps
}

const ownerRoles = ["moderator", "admin", "owner"]

const ChatDetailMemebersList: React.FC<ChatDetailMemebersListProps> = (
  props: ChatDetailMemebersListProps
) => {
  //component props
  const {
    handleMemberLongTap,
    onUserAvatarPress,
    handleKickDialog,
    currentRoomDetail,
  } = props
  //component props

  //mobx stores
  const { chatStore, loginStore } = useStores()
  //mobx stores

  //store variables
  const roomMemberInfo = chatStore.roomMemberInfo.filter((item) => item)
  const walletAddress = loginStore.initialData.walletAddress
  const manipulatedWalletAddress = underscoreManipulation(walletAddress)
  const isOwnerOrModerator = chatStore.checkIsModerator(currentRoomDetail.jid)
  //store variables

  return (
    <Box bg={"white"} minH={hp("40%")}>
      <Box margin={2}>
        <Text
          color={"black"}
          fontWeight={"bold"}
          fontFamily={textStyles.boldFont}
          fontSize={hp("2%")}
        >
          Members ({roomMemberInfo.length})
        </Text>
      </Box>
      <FlatList
        contentContainerStyle={{
          paddingBottom: 50,
        }}
        scrollEnabled={roomMemberInfo.length < 5 ? false : true}
        data={roomMemberInfo}
        renderItem={({ item }) => (
          <Pressable
            key={item.jid}
            onLongPress={() => handleMemberLongTap(item)}
            onPress={() => onUserAvatarPress(item)}
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
              {item.profile !== "none" ? (
                <Image
                  alt={item.name}
                  source={{ uri: item.profile }}
                  h={hp("6.5")}
                  w={hp("6.5%")}
                  rounded={"md"}
                />
              ) : (
                <Text
                  fontWeight={"bold"}
                  fontFamily={textStyles.boldFont}
                  fontSize={hp("2.2%")}
                  shadow="10"
                  color={"white"}
                >
                  {item.name ? item.name[0] : null}
                </Text>
              )}
            </Box>
            <HStack flex={0.7}>
              <Text
                fontFamily={textStyles.boldFont}
                fontWeight="bold"
                shadow="2"
                fontSize={hp("1.8%")}
              >
                {item.name ? item.name : null}
              </Text>
              {isOwnerOrModerator &&
                !item.jid.includes(manipulatedWalletAddress) &&
                ownerRoles.find((role) => role === item.role) && (
                  <Button
                    padding={"0"}
                    width={hp("7%")}
                    height={hp("3.5%")}
                    justifyContent="center"
                    alignItems="center"
                    variant={"solid"}
                    borderColor={"red.400"}
                    bgColor={"red.400"}
                    marginLeft={2}
                    onPress={() => handleKickDialog(item)}
                  >
                    <Text
                      fontSize={hp("1.5%")}
                      color={"white"}
                      fontFamily={textStyles.boldFont}
                    >
                      {item.ban_status === "clear" ? "Kick" : "Un-kick"}
                    </Text>
                  </Button>
                )}
            </HStack>

            {item.ban_status !== "clear" ? (
              <Box
                borderWidth={1}
                rounded="full"
                justifyContent={"center"}
                alignItems={"center"}
                flex={0.2}
              >
                Kicked
              </Box>
            ) : null}

            {item.role !== "none" && item.role !== "outcast" && (
              <Box
                borderWidth={item.role ? 1 : 0}
                rounded="full"
                justifyContent={"center"}
                alignItems={"center"}
                flex={0.2}
              >
                {item.role}
              </Box>
            )}
          </Pressable>
        )}
      />
    </Box>
  )
}

export default ChatDetailMemebersList
