import React, { useState } from "react"
import {
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import {
  commonColors,
  loginScreenBackgroundImage,
  logoHeight,
  logoPath,
  logoWidth,
  textStyles,
} from "../../../docs/config"
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen"

import { HStack, Image, Input, VStack } from "native-base"
import { SafeAreaView } from "react-native-safe-area-context"
import { Button } from "../../components/Button"
import { useStores } from "../../stores/context"
import { showError, showSuccess } from "../../components/Toast/toast"
import { httpPost } from "../../config/apiService"
import { resetPasswordURL } from "../../config/routesConstants"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AuthStackParamList } from "../../navigation/types"
import { authStackRoutes } from "../../navigation/routes"

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPasswordScreen">

export const ResetPasswordScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState("")
  const [isLoading, setisLoading] = useState(false)
  const { apiStore } = useStores()

  const onSubmit = async () => {
    setisLoading(true)
    try {
      await httpPost(resetPasswordURL, { email }, apiStore.defaultToken)
      showSuccess("Success", "Check your email")
    } catch (error) {
      showError("Error", "Something went wrong")
    }
    setisLoading(false)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={loginScreenBackgroundImage}
        style={styles.imageBg}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <VStack justifyContent={"center"} height={"full"}>
            <VStack justifyContent={"center"} height={"full"} padding={"1"}>
              <HStack paddingY={5}>
                <Image
                  alt="App logo Ethora"
                  source={logoPath}
                  resizeMode={"cover"}
                  w={wp(logoWidth)}
                  h={logoHeight}
                />
              </HStack>
              <View>
                <Input
                  maxLength={40}
                  marginBottom={2}
                  fontFamily={textStyles.lightFont}
                  fontSize={hp("1.6%")}
                  color={"black"}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={commonColors.primaryColor}
                />
                <View>
                  <Button
                    title={"Reset"}
                    onPress={onSubmit}
                    loading={isLoading}
                  />
                </View>
              </View>

              <VStack
                justifyContent={"center"}
                alignItems={"center"}
                paddingY={10}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(authStackRoutes.LoginScreen)
                  }
                >
                  <Text style={{ fontSize: 13, color: "black" }}>
                    Back to login
                  </Text>
                </TouchableOpacity>
              </VStack>
            </VStack>
          </VStack>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  imageBg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
})
