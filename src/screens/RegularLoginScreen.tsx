import React, {useState} from 'react';
import {
  ImageBackground,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  commonColors,
  loginScreenBackgroundImage,
  logoHeight,
  logoPath,
  logoWidth,
  regularLoginEmail,
  textStyles,
} from '../../docs/config';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {HStack, Image, Input, VStack} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from '../components/Button';
import {useStores} from '../stores/context';
import {ROUTES} from '../constants/routes';
export const RegularLoginScreen = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const {loginStore} = useStores();

  const onSubmit = async () => {
    if (!userName || !password) {
      return;
    }
    setisLoading(true);
    try {
      await loginStore.regularLogin({username: userName, password});
    } catch (error) {
      console.log(error.response);
    }
    setisLoading(false);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ImageBackground
        source={loginScreenBackgroundImage}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <VStack justifyContent={'center'} height={'full'}>
            <VStack justifyContent={'center'} height={'full'} padding={'1'}>
              <HStack paddingY={5}>
                <Image
                  alt="App logo Ethora"
                  source={logoPath}
                  resizeMode={'cover'}
                  w={wp(logoWidth)}
                  h={logoHeight}
                />
              </HStack>
              <View>
                <Input
                  maxLength={30}
                  marginBottom={2}
                  fontFamily={textStyles.lightFont}
                  fontSize={hp('1.6%')}
                  color={'black'}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder={
                    regularLoginEmail
                      ? 'Enter your email'
                      : 'Enter your username'
                  }
                  placeholderTextColor={commonColors.primaryColor}
                />
                <Input
                  maxLength={15}
                  marginBottom={2}
                  fontFamily={textStyles.lightFont}
                  fontSize={hp('1.6%')}
                  color={'black'}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={commonColors.primaryColor}
                />
                <View>
                  <Button
                    title={'Login'}
                    onPress={onSubmit}
                    loading={isLoading}
                  />
                </View>
              </View>

              <VStack
                justifyContent={'center'}
                alignItems={'center'}
                paddingY={10}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(ROUTES.REGISTER)}>
                  <Text
                    style={{fontSize: 18, color: commonColors.primaryColor}}>
                    Create new account
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate(ROUTES.LOGIN)}>
                  <Text style={{fontSize: 13, color: 'black', marginTop: 5}}>
                    Back to login
                  </Text>
                </TouchableOpacity>
              </VStack>
            </VStack>

            {/* </ImageBackground> */}
          </VStack>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </SafeAreaView>
  );
};
