import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Avatar, Box, HStack, VStack, Text, View } from "native-base";
import { HeaderMenu } from "../MainHeader/HeaderMenu";
import React from "react";
import { useStores } from "../../stores/context";
import { HomeStackNavigationProp as HomeStackNavigationProperty } from "../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { homeStackRoutes } from "../../navigation/routes";

const RoomsHeader = ({ style }) => {
  const { loginStore } = useStores();
  const navigation = useNavigation<HomeStackNavigationProperty>();

  const onAvatartPress = () => {
    navigation.navigate(homeStackRoutes.ProfileScreen);
  };

  return (
    <Box
      style={{
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        zIndex: 12,
        width: "100%",
        height: 75,
        position: "absolute",
        top: 0,
        left: 0,
        ...style,
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
        <TouchableOpacity onPress={onAvatartPress}>
          <Avatar
            bgColor={"#000"}
            marginRight={3}
            source={{
              uri: loginStore.userAvatar,
            }}
          >
            <Text>MP</Text>
          </Avatar>
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};

export default RoomsHeader;
