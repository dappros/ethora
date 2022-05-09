import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigation/RootStack';
import { StoreProvider } from './stores/context';
import { NativeBaseProvider } from "native-base";
import NetInfo from "@react-native-community/netinfo";

const App = () => {

  // React.useEffect(()=>{
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     console.log("Connection type", state.type);
  //     console.log("Is connected?", state.isConnected);
  //   });
  //   return function cleanup(){
  //     unsubscribe();
  //   }
  // },[])
  return (
    <StoreProvider>
      <NativeBaseProvider>
        <NavigationContainer>
          <RootStack/>
        </NavigationContainer>
      </NativeBaseProvider>
    </StoreProvider>
  );
};

export default App;
