import React, { FC } from "react";
import LinearGradient from "react-native-linear-gradient";
import { Animated, Easing } from "react-native";
import RoomsCategories from "../RoomsCategories";
import { View } from "native-base";
import SearchInput from "./SearchInput";
import NewChatButton from "./CreateRoomButton";
import { useNavigation } from "@react-navigation/native";
import { HomeStackNavigationProp } from "../../../navigation/types";

interface AnimatedRoomCategoryBlockProps {
  handleSearchChange: (value: any) => void;
  searchValue: string;
  scrollY: any;
}

const AnimatedRoomCategoryBlock: FC<AnimatedRoomCategoryBlockProps> = ({
  handleSearchChange,
  searchValue,
  scrollY,
}) => {
  const navigation = useNavigation<HomeStackNavigationProp>();

  const createRoomBlockOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const createRoomBlockTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [84, 0],
    easing: Easing.sin(1024),
  });

  const createRoomBlock = (
    <Animated.View
      style={{
        opacity: createRoomBlockOpacity,
        transform: [{ translateY: createRoomBlockTranslateY }],
        paddingLeft: 4,
        paddingRight: 4,
        width: "100%",
      }}
    >
      <View paddingLeft={4} paddingRight={4} width={"full"}>
        <SearchInput
          onSearchChange={handleSearchChange}
          searchValue={searchValue}
        />
        {!searchValue ? (
          <NewChatButton
            navigateToNewChat={() => navigation.navigate("NewChatScreen")}
          />
        ) : null}
      </View>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={["#ECF0F4", "#fff"]}
      style={{ width: "100%", position: "relative" }}
    >
      {createRoomBlock}
      <Animated.View
        style={{
          height: createRoomBlockTranslateY,
          zIndex: -1,
        }}
      />
      {!searchValue ? <RoomsCategories /> : null}
    </LinearGradient>
  );
};

export default AnimatedRoomCategoryBlock;
