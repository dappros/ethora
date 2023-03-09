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
import SocialButton from '../../components/Buttons/SocialButton';
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
} from '../../../docs/config';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useStores} from '../../stores/context';
import {observer} from 'mobx-react-lite';
import {
  handleAppleLogin,
  handleFaceBookLogin,
  handleGoogleLogin,
  loginOrRegisterSocialUser,
} from '../../helpers/login/socialLoginHandle';
import {socialLoginType} from '../../constants/socialLoginConstants';
import {httpPost} from '../../config/apiService';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useRegisterModal} from '../../hooks/useRegisterModal';
import {UserNameModal} from '../../components/Modals/Login/UserNameModal';
import {checkWalletExist} from '../../config/routesConstants';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/types';

type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'LoginScreen'
>;

const LoginScreen = observer(({navigation}: LoginScreenProps) => {
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
      apiStore.defaultToken,
      loginStore.loginUser,
      loginStore.registerUser,
      socialLoginType.APPLE,
    );

    await loginOrRegisterSocialUser(
      user,
      apiStore.defaultToken,
      loginStore.loginUser,
      loginStore.registerUser,
      socialLoginType.APPLE,
    );
  };

  const openModalForWallet = (message:string) => {
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
        checkWalletExist,
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
      <Box testID='login-screen' margin={3} justifyContent={'center'} alignItems={'center'}>
        <Image
          alt="App logo"
          accessibilityLabel="App logo"
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
          <View accessibilityLabel="Sign in with Facebook">
            <SocialButton
              label="Sign in with Facebook"
              color="white"
              fontFamily={textStyles.boldFont}
              fontSize={hp('1.47%')}
              leftIcon={
                <Icon
                  color={'white'}
                  size={hp('2.2%')}
                  as={AntIcon}
                  name={'facebook-square'}
                />
              }
              bg="#4D6DA4"
              onPress={() => {
                handleFaceBookLogin(
                  apiStore.defaultToken,
                  loginStore.loginUser,
                  loginStore.registerUser,
                  socialLoginType.FACEBOOK,
                );
              }}
            />
          </View>
        )}
        {googleSignIn && (
          <View accessibilityLabel="Sign in with Google">
            <SocialButton
              label="Sign in with Google"
              color="black"
              fontFamily={textStyles.boldFont}
              fontSize={hp('1.47%')}
              leftIcon={
                <Icon
                  color={'#696969'}
                  size={hp('2.2%')}
                  as={AntIcon}
                  name={'google'}
                />
              }
              bg="#FFFF"
              onPress={() =>
                handleGoogleLogin(
                  apiStore.defaultToken,
                  loginStore.loginUser,
                  loginStore.registerUser,
                  socialLoginType.GOOGLE,
                )
              }
            />
          </View>
        )}
        {appleSignIn && (
          <View accessibilityLabel="Sign in with Apple">
            <SocialButton
              label="Sign in with Apple"
              color="white"
              fontFamily={textStyles.boldFont}
              fontSize={hp('1.47%')}
              leftIcon={
                <Icon
                  color={'white'}
                  size={hp('2.2%')}
                  as={AntIcon}
                  name={'apple1'}
                />
              }
              bg="#000000"
              onPress={onAppleButtonPress}
            />
          </View>
        )}
        <View accessibilityLabel="Sign in with Metamask">
          <SocialButton
            label="Sign in with MetaMask"
            color="white"
            fontFamily={textStyles.boldFont}
            fontSize={hp('1.47%')}
            leftIcon={
              <Icon
                color={'white'}
                size={hp('2.2%')}
                as={AntIcon}
                name={'antdesign'}
              />
            }
            bg="#cc6228"
            onPress={() => {
              connector.connect();
            }}
          />
        </View>
        <HStack justifyContent={'center'}>
          {regularLogin && (
            <TouchableOpacity
              testID='login-with-cred'
              accessibilityLabel="Log in with password"
              onPress={() => navigation.navigate('RegularLogin')}>
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

      <VStack
        style={{position: 'absolute', bottom: 0}}
        justifyContent={'center'}
        accessibilityLabel="Ethora version details"
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
