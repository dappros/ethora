import React, { useRef } from "react";
import {
  Animated,
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ChatProfileScreen = () => {
  const panY = useRef(new Animated.Value(0)).current;

  const headerHeight = panY.interpolate({
    inputRange: [-hp("50%"), 0],
    outputRange: [hp("55%"), hp("24%")],
    extrapolate: "clamp",
  });

  const imageOpacity = panY.interpolate({
    inputRange: [-hp("20%"), 0],
    outputRange: [1, 0], // Прозрачность изображения
    extrapolate: "clamp",
  });

  // Анимация сдвига блока с табами
  const tabsTranslateY = panY.interpolate({
    inputRange: [-hp("50%"), 0],
    outputRange: [0, -hp("25%")], // Сдвиг блока табов
    extrapolate: "clamp",
  });

  // Обработка жестов
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: panY } }],
    { useNativeDriver: false },
  );

  // Обработка завершения жеста
  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      Animated.spring(panY, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View style={{ flex: 1 }}>
          <Animated.View style={[styles.header, { height: headerHeight }]}>
            <Animated.Image
              source={require("../../assets/temporary/BGExample.png")}
              style={[styles.headerImage, { opacity: imageOpacity }]}
            />
            <Text style={styles.userName}>User Name</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.tabsContainer,
              { transform: [{ translateY: tabsTranslateY }] },
            ]}
          >
            <View style={styles.tabs}>
              <Text style={styles.tabText}>Items</Text>
              <Text style={styles.tabText}>Collections</Text>
              <Text style={styles.tabText}>Documents</Text>
            </View>

            <View style={styles.content}>
              <Text>Legal contract 1</Text>
              <Text>Legal contract 2</Text>
              <Text>Legal contract 3</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  userName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  tabsContainer: {
    position: "absolute",
    top: hp("24%"),
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    backgroundColor: "#fff",
    paddingVertical: 16,
  },
});

export default ChatProfileScreen;
