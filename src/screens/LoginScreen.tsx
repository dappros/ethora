import {
  Box,
  HStack,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
  View,
  VStack,
} from 'native-base';
import React, {useEffect} from 'react';
import SocialButton from '../components/Buttons/SocialButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ImageBackground, StyleSheet} from 'react-native';
import {
  appTitle,
  appVersion,
  isLogoTitle,
  loginScreenBackgroundImage,
  logoHeight,
  logoPath,
  logoWidth,
  textStyles,
} from '../../docs/config';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useStores} from '../stores/context';
import {observer} from 'mobx-react-lite';
import {socialLoginHandle} from '../helpers/login/socialLoginHandle';
import {socialLoginType} from '../constants/socialLoginConstants';
import {httpGet} from '../config/apiService';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

interface LoginScreenProps {}

const LoginScreen = observer((props: LoginScreenProps) => {
  const {loginStore, apiStore} = useStores();
  const {isFetching} = loginStore;
  const connector = useWalletConnect()

  const socialLoginProps = {
    defaultUrl: apiStore.defaultUrl,
    defaultToken: apiStore.defaultToken,
    loginUser: loginStore.loginUser,
    registerSocialUser: loginStore.registerUser,
  };
  useEffect(() => {
    GoogleSignin.configure({
      forceCodeForRefreshToken: true,
      webClientId:
        '972933470054-hbsf29ohpato76til2jtf6jgg1b4374c.apps.googleusercontent.com',
    });
  }, []);
console.log(connector.accounts)
  return (
    <ImageBackground
      source={loginScreenBackgroundImage}
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Box margin={3} justifyContent={'center'} alignItems={'center'}>
        <Image
          alt="App logo Ethora"
          source={logoPath}
          resizeMode={'cover'}
          w={wp(logoWidth)}
          h={logoHeight}
        />
        {isLogoTitle ? (
          <Text
            color={'#000'}
            fontFamily={textStyles.mediumFont}
            fontSize={hp('3.44%')}>
            {appTitle}
          </Text>
        ) : null}
      </Box>

      <Stack margin={3} space={3}>
        <SocialButton
          label="Sign in with Facebook"
          color="white"
          fontFamily={textStyles.boldFont}
          fontSize={hp('1.47%')}
          leftIcon={
            <Icon
              color={'white'}
              size={hp('2.25%')}
              as={AntIcon}
              name={'facebook-square'}
            />
          }
          bg="#4D6DA4"
          onPress={() => {
            // socialLoginHandle(socialLoginProps, socialLoginType.FACEBOOK);
            connector.connect()
          }}
        />
        <SocialButton
          label="Sign in with Google"
          color="black"
          fontFamily={textStyles.boldFont}
          fontSize={hp('1.47%')}
          leftIcon={
            <Icon
              color={'#696969'}
              size={hp('2.25%')}
              as={AntIcon}
              name={'google'}
            />
          }
          bg="#FFFF"
          onPress={() =>
            socialLoginHandle(socialLoginProps, socialLoginType.GOOGLE)
          }
        />
        <SocialButton
          label="Sign in with Apple"
          color="white"
          fontFamily={textStyles.boldFont}
          fontSize={hp('1.47%')}
          leftIcon={
            <Icon
              color={'white'}
              size={hp('2.25%')}
              as={AntIcon}
              name={'apple1'}
            />
          }
          bg="#000000"
          onPress={() =>
            socialLoginHandle(socialLoginProps, socialLoginType.APPLE)
          }
        />
      </Stack>
      {isFetching && <Spinner />}

      {/* <Text onPress={()=>Clipboard.setString(apiStore.defaultToken)}>{apiStore.defaultToken}</Text> */}
      <VStack
        style={{position: 'absolute', bottom: 0}}
        justifyContent={'center'}
        alignItems={'center'}>
        <Text style={styles.appVersion}>
          Version {appVersion}. Powered by Dappros Platform
        </Text>
      </VStack>
    </ImageBackground>
  );
});

const styles = StyleSheet.create({
  appVersion: {
    color: 'grey',
    fontFamily: textStyles.lightFont,
    fontSize: hp('1%'),
  },
});

export default LoginScreen;
