import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import LoginScreen from '../Screens/LoginScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen
                options={{headerShown: false, headerTitle: ''}}
                component={LoginScreen}
                name={ROUTES.LOGIN}
            />
        </Stack.Navigator>
    )
}

export default AuthStack;