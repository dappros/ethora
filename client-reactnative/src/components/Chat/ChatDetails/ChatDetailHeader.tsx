import { Box, Divider, HStack, Menu, View } from "native-base"
import React, { useState } from "react"
import { commonColors, textStyles } from "../../../../docs/config"
import { TouchableOpacity } from "react-native"
import AntIcon from "react-native-vector-icons/AntDesign"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../../stores/context"
import { roomListProps } from "../../../stores/chatStore"
import EntypoIcon from "react-native-vector-icons/Entypo"
import { checkIsDefaultChat } from "../../../helpers/chat/checkIsDefaultChat"
import { HomeStackNavigationProp } from "../../../navigation/types"

interface ChatDetailHeaderProps {
  deleteRoomDialog: () => Promise<void>
  toggleFavourite: () => void
  currentRoomDetail: roomListProps
}

const ChatDetailHeader: React.FunctionComponent<ChatDetailHeaderProps> = (
  props: ChatDetailHeaderProps
) => {
  //component props
  const { deleteRoomDialog, toggleFavourite, currentRoomDetail } = props
  //component props

  //mobx stores
  const { chatStore } = useStores()
  //mobx stores

  //local states
  const [open, setOpen] = useState<boolean>(false)
  //local states

  //local variables
  const { jid, name } = currentRoomDetail
  const FavMenuContent = chatStore.roomsInfoMap[jid]?.isFavourite
  const isOwnerOrModerator = chatStore.checkIsModerator(jid)
    ? "Remove from favourites"
    : "Add to favourites"

  const isDefaultChat = checkIsDefaultChat(jid)
  //local variables

  //hooks
  const navigation = useNavigation<HomeStackNavigationProp>()

  return (
    <Box
      h={60}
      padding={2}
      justifyContent={"center"}
      bg={commonColors.primaryColor}
    >
      <HStack>
        <View flex={0.6}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntIcon
              name={"arrowleft"}
              style={{ marginRight: 5, marginLeft: 5 }}
              size={hp("3%")}
              color={"white"}
            />
          </TouchableOpacity>
        </View>

        <View flex={0.4} justifyContent="flex-end" flexDirection="row">
          {isDefaultChat ? null : (
            <View flex={0.3}>
              <TouchableOpacity onPress={deleteRoomDialog}>
                <AntIcon
                  name={"delete"}
                  style={{ marginRight: 5, marginLeft: 5 }}
                  size={hp("3%")}
                  color={"white"}
                />
              </TouchableOpacity>
            </View>
          )}
          <View flex={0.3}>
            <TouchableOpacity
              disabled={isDefaultChat ? true : false}
              onPress={toggleFavourite}
            >
              <AntIcon
                name={
                  chatStore.roomsInfoMap[jid]?.isFavourite || isDefaultChat
                    ? "star"
                    : "staro"
                }
                style={{ marginRight: 5, marginLeft: 5 }}
                size={hp("3%")}
                color={"white"}
              />
            </TouchableOpacity>
          </View>

          {isOwnerOrModerator ? (
            <View paddingRight={2} alignItems={"flex-end"} flex={0.3}>
              <Menu
                w="190"
                isOpen={open}
                placement={"bottom"}
                onClose={() => setOpen(false)}
                trigger={(triggerProps) => {
                  return (
                    <TouchableOpacity
                      {...triggerProps}
                      style={{ zIndex: 99999 }}
                      onPress={() => setOpen(!open)}
                      accessibilityLabel="More options menu"
                    >
                      <EntypoIcon name="menu" color="#FFFFFF" size={hp("3%")} />
                    </TouchableOpacity>
                  )
                }}
              >
                {isDefaultChat ? null : (
                  <>
                    <Menu.Item
                      onPress={toggleFavourite}
                      _text={{
                        fontFamily: textStyles.lightFont,
                      }}
                    >
                      {FavMenuContent}
                    </Menu.Item>

                    <Divider />
                  </>
                )}
                {isOwnerOrModerator ? (
                  <Menu.Item
                    onPress={() =>
                      navigation.navigate("ChangeBackgroundScreen", {
                        roomJID: jid,
                        roomName: name,
                      })
                    }
                    _text={{
                      fontFamily: textStyles.lightFont,
                    }}
                  >
                    Change Background
                  </Menu.Item>
                ) : null}
                {isDefaultChat ? null : (
                  <>
                    <Divider />
                    <Menu.Item
                      onPress={deleteRoomDialog}
                      _text={{
                        fontFamily: textStyles.lightFont,
                        color: "#D32222",
                      }}
                    >
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
  )
}

export default ChatDetailHeader
