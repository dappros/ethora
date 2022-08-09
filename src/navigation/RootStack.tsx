import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useStores} from '../stores/context';
import HomeStack from './HomeStack';
import {ROUTES} from '../constants/routes';
import AuthStack from './AuthStack';
import {observer} from 'mobx-react-lite';
import {Center, Spinner, View} from 'native-base';
import { SafeAreaView } from 'react-native';

const Stack = createNativeStackNavigator();

const RootStack = observer(() => {
  const {loginStore} = useStores();
  const {
    setTokenFromAsyncStorage,
    setInitialDetailsFromAsyncStorage,
    userToken,
    loading,
  } = loginStore;

  useEffect(() => {
    // this action will first check
    // if the the user already has an
    // active session by retrieving
    // the token for async store
    setInitialDetailsFromAsyncStorage();
    setTokenFromAsyncStorage();
  }, []);

  return (
    <>
      {loading ? (
        <View flex={1}>
          <Center>
            <Spinner />
          </Center>
        </View>
      ) : (
        <SafeAreaView style={{flex:1}}>
        <Stack.Navigator>
          {userToken ? (
            <Stack.Screen
              options={{headerShown: false}}
              name={ROUTES.HOMESTACK}
              component={HomeStack}
            />
          ) : (
            <Stack.Screen
              options={{headerShown: false}}
              name={ROUTES.AUTHSTACK}
              component={AuthStack}
            />
          )}
        </Stack.Navigator>
        </SafeAreaView>
      )}
    </>
  );
});

export default RootStack;
