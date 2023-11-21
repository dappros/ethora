import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { Avatar, Box, HStack, VStack, Text, View } from "native-base"
import { HeaderMenu } from "../MainHeader/HeaderMenu"
import React from "react"
import { useStores } from "../../stores/context"

const RoomsHeader = () => {
  const { loginStore } = useStores()
  return (
    <Box
      style={{
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -4,
      }}
      height={hp("10%")}
      justifyContent={"flex-end"}
      bgColor={"#fff"}
      width={"100%"}
    >
      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        paddingBottom={1}
      >
        <View>
          <HeaderMenu />
        </View>

        <Text color={"#000"} fontWeight={700} fontSize={16}>
          Chats
        </Text>
        <Avatar
          bgColor={"#000"}
          marginRight={3}
          source={{
            uri: loginStore.userAvatar,
          }}
        >
          <Text>MP</Text>
        </Avatar>
      </HStack>
    </Box>
  )
}

export default RoomsHeader
