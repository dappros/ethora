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
import React, {useEffect, useState} from 'react';
import SocialButton from '../components/Buttons/SocialButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ImageBackground, StyleSheet} from 'react-native';
import {
  appTitle,
  appVersion,
  commonColors,
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
import {httpGet, httpPost} from '../config/apiService';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import {RegisterExternalWalletModal} from '../components/Login/RegisterExternalWalletModal';
import {checkWalletExist} from '../config/routesConstants';

interface LoginScreenProps {}

const LoginScreen = observer((props: LoginScreenProps) => {
  const {loginStore, apiStore} = useStores();
  const {isFetching} = loginStore;
  const connector = useWalletConnect();
  const [externalWalletModalData, setExternalWalletModalData] = useState({
    open: false,
    walletAddress: '',
    message: '',
  });
  const [signedMessage, setSignedMessage] = useState('');
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

  const checkExternalWalletExist = async () => {
    try {
      const res = await httpPost(
        apiStore.defaultUrl + checkWalletExist,
        {
          walletAddress: connector.accounts[0],
        },
        apiStore.defaultToken,
      );
      return true;
    } catch (error) {
      return false;
    }
  };
  const sendWalletMessage = async () => {
    const walletExist = await checkExternalWalletExist();
    const messageToSend = walletExist ? 'Login' : 'Registration';
    const message = await connector.signPersonalMessage([
      messageToSend,
      connector.accounts[0],
    ]);
    setSignedMessage(message);
    !walletExist
      ? setExternalWalletModalData({
          message,
          open: true,
          walletAddress: connector.accounts[0],
        })
      : loginStore.loginExternalWallet({
          walletAddress: connector.accounts[0],
          signature: message,
          loginType: 'signature',
          msg: 'Login',
        });
    connector.killSession();
  };
  useEffect(() => {
    if (!!connector.accounts && !signedMessage && connector.connected) {
      sendWalletMessage();
    }
  }, [
    connector.accounts,
    connector.session,
    connector.connected,
    signedMessage,
  ]);

  return (
    <ImageBackground
      // source={loginScreenBackgroundImage}
      style={{
        backgroundColor: 'rgba(0,0,255, 0.05)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Box margin={3} justifyContent={'center'} alignItems={'center'}>
        {/* <Image
          alt="App logo Ethora"
          source={logoPath}
          resizeMode={'cover'}
          w={wp(logoWidth)}
          h={logoHeight}
        /> */}
        {isLogoTitle && (
          <Text
            color={commonColors.primaryColor}
            fontFamily={textStyles.semiBoldFont}
            fontSize={hp('6.44%')}>
            {appTitle}
          </Text>
        ) }
      </Box>

      <Stack margin={3} space={3}>
        <SocialButton
          label="Sign in with MetaMask"
          color="white"
          fontFamily={textStyles.boldFont}
          fontSize={hp('1.47%')}
          leftIcon={
            <Icon
              color={'white'}
              size={hp('2.25%')}
              as={AntIcon}
              name={'antdesign'}
            />
          }
          bg="#cc6228"
          onPress={() => {
            connector.connect()
          }}
        />
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
            socialLoginHandle(socialLoginProps, socialLoginType.FACEBOOK);
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
      <RegisterExternalWalletModal
        modalVisible={externalWalletModalData.open}
        closeModal={() => setExternalWalletModalData({open: false})}
        walletAddress={externalWalletModalData.walletAddress}
        message={externalWalletModalData.message}
      />
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
