import React, { FC } from "react";
import { Animated } from "react-native";

interface HeaderProps {
  headerHeight: any;
}

const RoomListHeader: FC<HeaderProps> = ({ headerHeight }) => {
  return (
    <Animated.View
      style={{
        height: headerHeight,
        width: "100%",
        zIndex: 0,
        overflow: "visible",
      }}
    ></Animated.View>
  );
};
export default RoomListHeader;
