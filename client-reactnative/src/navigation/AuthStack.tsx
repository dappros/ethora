import * as React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/Login/LoginScreen"
import { RegisterScreen } from "../screens/Login/RegisterScreen"
import { RegularLoginScreen } from "../screens/Login/RegularLoginScreen"
import { ResetPasswordScreen } from "../screens/Login/ResetPasswordScreen"
import { AuthStackParamList } from "./types"

const Stack = createNativeStackNavigator<AuthStackParamList>()

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
          headerTransparent: true,
          headerTitle: "",
        }}
        component={LoginScreen}
        name={"LoginScreen"}
      />
      <Stack.Screen
        options={{ headerShown: false, headerTitle: "" }}
        component={RegularLoginScreen}
        name={"RegularLogin"}
      />
      <Stack.Screen
        options={{ headerShown: false, headerTitle: "" }}
        component={RegisterScreen}
        name={"Register"}
      />
      <Stack.Screen
        options={{ headerShown: false, headerTitle: "" }}
        component={ResetPasswordScreen}
        name={"ResetPasswordScreen"}
      />
    </Stack.Navigator>
  )
}

export default AuthStack
