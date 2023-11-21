import * as React from "react"
import { NavigationContainer } from "@react-navigation/native"
import RootStack from "./navigation/RootStack"
import { StoreProvider } from "./stores/context"
import { NativeBaseProvider } from "native-base"
import Toast from "react-native-toast-message"
import NetInfo from "@react-native-community/netinfo"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import SplashScreen from "react-native-splash-screen"

import AsyncStorage from "@react-native-async-storage/async-storage"
import RNBootSplash from "react-native-bootsplash"
import { withIAPContext } from "react-native-iap"
import { StatusBar } from "react-native"

import { LogBox } from "react-native"
LogBox.ignoreLogs(["EventEmitter.removeListener"])

const App = () => {
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type)
      console.log("Is connected?", state.isConnected)
    })
    return function cleanup() {
      unsubscribe()
    }
  }, [])
  return (
    <StoreProvider>
      <NativeBaseProvider>
        <StatusBar backgroundColor={"transparent"} translucent />
        <NavigationContainer onReady={() => RNBootSplash.hide()}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootStack />
          </GestureHandlerRootView>
        </NavigationContainer>
      </NativeBaseProvider>
      <Toast />
    </StoreProvider>
  )
}

export default withIAPContext(App)
