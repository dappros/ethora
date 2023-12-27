import React, { useState, ReactNode } from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>;
  activeStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
  onPress?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  style,
  activeStyle,
  children,
  onPress,
  ...props
}) => {
  const [isActive, setIsActive] = useState(false);

  const handlePressIn = () => {
    setIsActive(true);
  };

  const handlePressOut = () => {
    setIsActive(false);
  };

  const combinedStyle = isActive
    ? [style, activeStyle, styles.activeStyle]
    : [style];

  const handlePress = () => {
    onPress?.();
  };

  return (
    <TouchableOpacity
      style={combinedStyle}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {children}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  activeStyle: { backgroundColor: "transparent" },
});
