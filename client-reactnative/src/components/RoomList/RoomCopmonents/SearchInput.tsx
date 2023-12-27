import React, { useRef, useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, Animated } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { View } from "native-base";

const SearchInput = ({ onSearchChange, searchValue }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderAnimationEnded, setPlaceholderAnimationEnded] =
    useState(false);
  const inputReference = useRef(null);
  const placeholderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const placeholderMoveAnimation = Animated.timing(placeholderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    });
    placeholderMoveAnimation.start(({ finished }) => {
      if (finished) {
        setPlaceholderAnimationEnded(isFocused);
      }
    });
    return () => {
      placeholderMoveAnimation.stop();
    };
  }, [isFocused, placeholderAnim]);

  const translateX = placeholderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [widthPercentageToDP("-5%"), widthPercentageToDP("-33%")],
  });

  const handleSearchFocus = () => setIsFocused(true);
  const handleSearchBlur = () => {
    if (!searchValue) setIsFocused(false);
  };

  const handleTextInputFocus = () => {
    inputReference.current?.focus();
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffff",
        width: "100%",
        borderRadius: 25,
      }}
      onPress={handleTextInputFocus}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            left: "50%",
          },
          { transform: [{ translateX }] },
        ]}
      >
        <Text
          style={{
            color: "#8F8F8F",
            paddingTop: 2,
            opacity: placeholderAnimationEnded ? 0 : 1,
          }}
        >
          Search..
        </Text>

        <Icon
          name="search"
          style={{ position: "absolute", top: 3, left: -22 }}
          size={15}
          color="#888"
        />
      </Animated.View>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <TextInput
          ref={inputReference}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onChangeText={onSearchChange}
          value={searchValue}
          style={{
            paddingLeft: 50,
            width: "100%",
            height: 37,
            paddingRight: 15,
            paddingBottom: 8,
          }}
          caretHidden={!placeholderAnimationEnded}
        />
      </View>
    </TouchableOpacity>
  );
};
export default SearchInput;
