import { HStack, Radio, Text, View, VStack } from "native-base"
import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { textStyles } from "../../../docs/config"
import { Button } from "../../components/Button"
import { showSuccess } from "../../components/Toast/toast"
import { httpUploadPut } from "../../config/apiService"
import { changeUserData } from "../../config/routesConstants"
import { useStores } from "../../stores/context"

export interface IVisibility {
  changeScreen: (index: number) => void
}

const state: Record<string, boolean> = {
  open: true,
  restricted: false,
  full: true,
  individual: false,
}

export const Visibility: React.FC<IVisibility> = ({ changeScreen }) => {
  const { apiStore, loginStore } = useStores()
  const [loading, setLoading] = useState<"assets" | "profile" | null>(null)
  const [visibilityValue, setVisibilityValue] = useState(
    loginStore.initialData.isProfileOpen ? "open" : "restricted"
  )
  const [assetsValue, setAssetsValue] = useState(
    loginStore.initialData.isAssetsOpen ? "full" : "individual"
  )

  const updateProfileVisibility = async (value: string) => {
    const profileState = state[value]
    setLoading("profile")

    try {
      const formData = new FormData()
      formData.append("isProfileOpen", profileState)
      const { data } = await httpUploadPut(
        changeUserData,
        formData,
        loginStore.userToken,
        console.log
      )

      showSuccess("Success", "Profile permissions updated")
      loginStore.updateCurrentUser(data.user)
      setVisibilityValue(value)
    } catch (error) {
      console.log(error)
    }
    setLoading(null)
  }
  const updateAssetsVisibility = async (value: string) => {
    setLoading("assets")
    const assetsState = state[value]
    try {
      const formData = new FormData()
      formData.append("isAssetsOpen", assetsState)
      const { data } = await httpUploadPut(
        changeUserData,
        formData,
        loginStore.userToken,
        console.log
      )
      showSuccess("Success", "Assets permissions updated")
      loginStore.updateCurrentUser(data.user)
      setAssetsValue(value)
    } catch (error) {
      console.log(error)
    }

    setLoading(null)
  }
  return (
    <VStack paddingX={10}>
      <View>
        <Text style={styles.title}>Profile Visibility</Text>
        <VStack>
          <Radio.Group
            name="myRadioGroup"
            accessibilityLabel="favorite number"
            value={visibilityValue}
            onChange={updateProfileVisibility}
          >
            <View paddingY={5}>
              <Radio
                value="open"
                justifyContent={"flex-end"}
                style={{ marginTop: -30 }}
                colorScheme={"blue"}
                alignItems={"flex-start"}
              >
                <View width={"90%"} justifyContent={"flex-end"}>
                  <HStack>
                    <Text fontFamily={textStyles.semiBoldFont}>Open </Text>
                    <Text>(default)</Text>
                  </HStack>
                  <Text style={styles.description}>
                    Your profile can be viewed by anyone who follows your
                    profile link or QR code
                  </Text>
                </View>
              </Radio>
            </View>
            <View style={{ paddingTop: 25 }}>
              <Radio
                value="restricted"
                colorScheme={"blue"}
                style={{ marginTop: -40 }}
              >
                <View width={"90%"}>
                  <HStack>
                    <Text fontFamily={textStyles.semiBoldFont}>Restricted</Text>
                  </HStack>
                  <Text style={styles.description}>
                    Only users with your permission or temporary secure link can
                    see your profile
                  </Text>
                </View>
              </Radio>
            </View>
          </Radio.Group>
          <View mt={5}>
            <Button
              title="Manage profile shares"
              onPress={() => changeScreen(1)}
              loading={loading === "profile"}
            />
          </View>
        </VStack>
      </View>
      <View mt={2}>
        <Text style={styles.title}>Documents Visibility</Text>
        <VStack>
          <Radio.Group
            name="myRadioGroup"
            accessibilityLabel="favorite number"
            value={assetsValue}
            onChange={updateAssetsVisibility}
          >
            <View paddingY={5}>
              <Radio
                value="full"
                my={1}
                style={{ marginTop: -30 }}
                justifyContent={"flex-start"}
                colorScheme={"blue"}
                alignItems={"flex-start"}
              >
                <View width={"90%"}>
                  <HStack>
                    <Text fontFamily={textStyles.semiBoldFont}>Full </Text>
                    <Text>(default)</Text>
                  </HStack>
                  <Text style={styles.description}>
                    Show all Documents to those who can see your profile
                  </Text>
                </View>
              </Radio>
            </View>
            <View paddingY={5}>
              <Radio
                value="individual"
                colorScheme={"blue"}
                style={{ marginTop: -30 }}
              >
                <View width={"90%"}>
                  <HStack>
                    <Text fontFamily={textStyles.semiBoldFont}>
                      Individual{" "}
                    </Text>
                  </HStack>
                  <Text style={styles.description}>
                    You need to share each document individually before others
                    can see them
                  </Text>
                </View>
              </Radio>
            </View>
          </Radio.Group>
          <View mt={1}>
            <Button
              loading={loading === "assets"}
              title="Manage documents shares"
              onPress={() => changeScreen(2)}
            />
          </View>
        </VStack>
      </View>
    </VStack>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: textStyles.semiBoldFont,
    color: "black",
    fontSize: 18,
    marginVertical: 10,
    marginBottom: 20,
  },
  description: {
    fontFamily: textStyles.regularFont,
    color: "black",
  },
  shareText: {
    color: "#fff",
    fontFamily: textStyles.mediumFont,
    // textAlign: 'center',
    fontSize: 18,
  },
  note: {
    color: "black",
    marginTop: 10,
    fontStyle: "italic",
  },
})
