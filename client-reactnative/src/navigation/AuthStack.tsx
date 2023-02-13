import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../Screens/Login/LoginScreen';
import {RegisterScreen} from '../Screens/Login/RegisterScreen';
import {RegularLoginScreen} from '../Screens/Login/RegularLoginScreen';
import {ResetPasswordScreen} from '../Screens/Login/ResetPasswordScreen';
import {AuthStackParamList} from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false, headerTitle: ''}}
        component={LoginScreen}
        name={'LoginScreen'}
      />
      <Stack.Screen
        options={{headerShown: false, headerTitle: ''}}
        component={RegularLoginScreen}
        name={'RegularLogin'}
      />
      <Stack.Screen
        options={{headerShown: false, headerTitle: ''}}
        component={RegisterScreen}
        name={'Register'}
      />
      <Stack.Screen
        options={{headerShown: false, headerTitle: ''}}
        component={ResetPasswordScreen}
        name={'ResetPasswordScreen'}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
