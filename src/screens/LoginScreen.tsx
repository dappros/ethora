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
import {ImageBackground, StyleSheet, TouchableOpacity} from 'react-native';
import {
  appleSignIn,
  appTitle,
  appVersion,
  commonColors,
  facebookSignIn,
  googleSignIn,
  isLogoTitle,
  loginScreenBackgroundImage,
  logoHeight,
  logoPath,
  logoWidth,
  regularLogin,
  textStyles,
} from '../../docs/config';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useStores} from '../stores/context';
import {observer} from 'mobx-react-lite';
import {
  handleAppleLogin,
  handleFaceBookLogin,
  handleGoogleLogin,
  socialLoginHandle,
} from '../helpers/login/socialLoginHandle';
import {socialLoginType} from '../constants/socialLoginConstants';
import {httpGet, httpPost} from '../config/apiService';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useRegisterModal} from '../hooks/useRegisterModal';
import {UserNameModal} from '../components/Modals/Login/UserNameModal';
import {checkEmailExist, checkWalletExist} from '../config/routesConstants';
import {ROUTES} from '../constants/routes';
import {useWalletConnect} from '@walletconnect/react-native-dapp';

interface LoginScreenProps {}

const LoginScreen = observer(({navigation}) => {
  const {loginStore, apiStore} = useStores();
  const {isFetching} = loginStore;
  const connector = useWalletConnect();
  const [externalWalletModalData, setExternalWalletModalData] = useState({
    walletAddress: '',
    message: '',
  });
  const [signedMessage, setSignedMessage] = useState('');
  const {
    firstName,
    lastName,
    setFirstName,
    setLastName,
    modalOpen,
    setModalOpen,
  } = useRegisterModal();
  const [appleUser, setAppleUser] = useState({});
  useEffect(() => {
    GoogleSignin.configure({
      forceCodeForRefreshToken: true,
      webClientId:
        '972933470054-hbsf29ohpato76til2jtf6jgg1b4374c.apps.googleusercontent.com',
    });
  }, []);
  const onAppleButtonPress = async () => {
    const user = await handleAppleLogin(
      apiStore.defaultUrl,
      apiStore.defaultToken,
      loginStore.loginUser,
      loginStore.registerUser,
      socialLoginType.APPLE,
    );
    const url = apiStore.defaultUrl + checkEmailExist + user.email;
    try {
      const response = await httpGet(url, apiStore.defaultToken);
      if (!response.data.success) {
        console.log(user);
        loginStore.loginUser(
          socialLoginType.APPLE,
          user.authToken,
          user.uid,
          user,
        );
      } else {
        setModalOpen(true);
        setAppleUser(user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const openModalForWallet = message => {
    setExternalWalletModalData({
      message,
      walletAddress: connector.accounts[0],
    });
    setModalOpen(true);
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
      ? openModalForWallet(message)
      : loginStore.loginExternalWallet({
          walletAddress: connector.accounts[0],
          signature: message,
          loginType: 'signature',
          msg: 'Login',
        });
    connector.killSession();
  };
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
  const onAppleLogin = async () => {
    const user = {...appleUser, firstName, lastName};

    const dataObject = {
      loginType: socialLoginType.APPLE,
      authToken: user.authToken,
      displayName: user.displayName,
      password: user.uid,
      username: user.email,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    await loginStore.registerUser(dataObject, user);
    setModalOpen(false);
  };
  const onModalSubmit = async () => {
    if (!externalWalletModalData.message) {
      await onAppleLogin();
    } else {
      await loginStore.registerExternalWalletUser({
        walletAddress: externalWalletModalData.walletAddress,
        msg: 'Registration',
        signature: externalWalletModalData.message,
        loginType: 'signature',
        firstName,
        lastName,
      });
    }
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
      source={loginScreenBackgroundImage}
      style={{
        backgroundColor: 'rgba(0,0,255, 0.05)',
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
        {isLogoTitle && (
          <Text
            color={commonColors.primaryColor}
            fontFamily={textStyles.semiBoldFont}
            fontSize={hp('6.44%')}>
            {appTitle}
          </Text>
        )}
      </Box>

      <Stack margin={3} space={3}>
        {facebookSignIn && (
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
              handleFaceBookLogin(
                apiStore.defaultUrl,
                apiStore.defaultToken,
                loginStore.loginUser,
                loginStore.registerUser,
                socialLoginType.FACEBOOK,
              );
            }}
          />
        )}
        {googleSignIn && (
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
              handleGoogleLogin(
                apiStore.defaultUrl,
                apiStore.defaultToken,
                loginStore.loginUser,
                loginStore.registerUser,
                socialLoginType.GOOGLE,
              )
            }
          />
        )}
        {appleSignIn && (
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
            onPress={onAppleButtonPress}
          />
        )}
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
            connector.connect();
          }}
        />
        <HStack justifyContent={'center'}>
          {regularLogin && (
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.REGULARLOGIN)}>
              <Text
                style={{
                  fontSize: 14,
                  color: commonColors.primaryColor,
                  fontFamily: textStyles.semiBoldFont,
                }}>
                Login with credentials
              </Text>
            </TouchableOpacity>
          )}
        </HStack>
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
      <UserNameModal
        modalVisible={modalOpen}
        closeModal={() => setModalOpen(false)}
        firstName={firstName}
        lastName={lastName}
        setFirstName={setFirstName}
        setLastName={setLastName}
        onSubmit={onModalSubmit}
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
