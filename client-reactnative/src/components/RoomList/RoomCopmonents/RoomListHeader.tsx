import React, { FC } from "react";
import { Animated, Easing } from "react-native";

interface HeaderProps {
  scrollY: any;
}

const RoomListHeader: FC<HeaderProps> = ({ scrollY }) => {
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 3000],
    outputRange: [0, 84],
    extrapolate: "clamp",
    easing: Easing.linear,
  });

  return (
    <Animated.View
      style={{
        height: headerHeight,
        width: "100%",
        zIndex: 0,
        overflow: "visible",
        backgroundColor: "red",
      }}
    ></Animated.View>
  );
};
export default RoomListHeader;
