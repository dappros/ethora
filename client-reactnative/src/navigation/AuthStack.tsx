import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../constants/routes';
import LoginScreen from '../Screens/Login/LoginScreen';
import {RegisterScreen} from '../Screens/Login/RegisterScreen';
import {RegularLoginScreen} from '../Screens/Login/RegularLoginScreen';
import {ResetPasswordScreen} from '../Screens/Login/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false, headerTitle: ''}}
        component={LoginScreen}
        name={ROUTES.LOGIN}
      />
      <Stack.Screen
        options={{headerShown: false, headerTitle: ''}}
        component={RegularLoginScreen}
        name={ROUTES.REGULARLOGIN}
      />
      <Stack.Screen
        options={{headerShown: false, headerTitle: ''}}
        component={RegisterScreen}
        name={ROUTES.REGISTER}
      />
      <Stack.Screen
        options={{headerShown: false, headerTitle: ''}}
        component={ResetPasswordScreen}
        name={ROUTES.RESETPASSWORD}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
