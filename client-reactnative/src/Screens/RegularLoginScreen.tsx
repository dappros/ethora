import React, {useState} from 'react';
import {
  ImageBackground,
  Keyboard,
  StyleSheet,
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
import Modal from 'react-native-modal';

import {HStack, Image, Input, VStack} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from '../components/Button';
import {useStores} from '../stores/context';
import {ROUTES} from '../constants/routes';
import {showError} from '../components/Toast/toast';

export const RegularLoginScreen = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const {loginStore} = useStores();
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const onSubmit = async () => {
    if (!userName || !password) {
      return;
    }
    setisLoading(true);
    try {
      await loginStore.regularLogin({username: userName, password});
    } catch (error) {
      if (error?.response?.status === 409) {
        showError('Error', 'This email is not verified');
      } else {
        showError('Error', 'Something went wrong');
      }
    }
    setisLoading(false);
  };

  return (
    <>
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
                <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                  <Button
                    title={'Login'}
                    onPress={onSubmit}
                    loading={isLoading}
                     style={{width: '50%'}}
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
                  onPress={() =>
                    !regularLoginEmail
                      ? setResetModalOpen(true)
                      : navigation.navigate(ROUTES.RESETPASSWORD)
                  }>
                  <Text style={{fontSize: 13, color: 'black', marginTop: 5}}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate(ROUTES.LOGIN)}>
                  <Text style={{fontSize: 13, color: 'black', marginTop: 15}}>
                    Back to login
                  </Text>
                </TouchableOpacity>
              </VStack>
            </VStack>

            {/* </ImageBackground> */}
          </VStack>
        </TouchableWithoutFeedback>
      </ImageBackground>
      {!regularLoginEmail && (
        <Modal
          onBackdropPress={() => setResetModalOpen(false)}
          isVisible={resetModalOpen}>
          <View style={styles.modal}>
            <Text style={{color: 'black'}}>
              For some privacy reasons, Ethora does not store any user
              credential information. Please, create a new account if you forget
              your password.
            </Text>
            <Button
              title="Close"
              onPress={() => setResetModalOpen(false)}
              loading={false}
              style={{marginTop: 10}}
            />
          </View>
        </Modal>
      )}
      </>
  );
};
const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: commonColors.primaryDarkColor,
    width: 150,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
});
