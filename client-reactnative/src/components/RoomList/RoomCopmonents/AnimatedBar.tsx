import React, { FC, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { Animated, Easing } from "react-native";
import RoomsCategories from "../RoomsCategories";
import { View } from "native-base";
import SearchInput from "./SearchInput";
import NewChatButton from "./CreateRoomButton";

interface AnimatedRoomCategoryBlockProps {
  handleSearchChange: (value: any) => void;
  searchValue: string;
  scrollY: any;
  setModalVisible: any;
}

const AnimatedRoomCategoryBlock: FC<AnimatedRoomCategoryBlockProps> = ({
  handleSearchChange,
  searchValue,
  scrollY,
  setModalVisible,
}) => {
  const [placeholderAnimationEnded, setPlaceholderAnimationEnded] =
    useState(false);

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
          placeholderAnimationEnded={placeholderAnimationEnded}
          setPlaceholderAnimationEnded={setPlaceholderAnimationEnded}
        />
        {!placeholderAnimationEnded ? (
          <NewChatButton setModalVisible={setModalVisible} />
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
      {!placeholderAnimationEnded ? <RoomsCategories /> : null}
    </LinearGradient>
  );
};

export default AnimatedRoomCategoryBlock;
