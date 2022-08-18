/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {Component, useEffect, useState} from 'react';

import {
  Text,
  View,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {
  commonColors,
  loginScreenBackgroundImage,
  logoHeight,
  logoPath,
  logoWidth,
  textStyles,
} from '../../docs/config';
import {httpPost} from '../config/apiService';
import IonIcons from 'react-native-vector-icons/Ionicons';

import CheckBox from '@react-native-community/checkbox';
import {useStores} from '../stores/context';
import {ROUTES} from '../constants/routes';
import {registerUserURL} from '../config/routesConstants';
import {Button} from '../components/Button';
import {showError, showSuccess} from '../components/Toast/toast';

const {mediumFont, lightFont, boldFont} = textStyles;

export const RegisterScreen = ({navigation, route}) => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [firstname, setFirstname] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSelected, setSelection] = useState(true);
  const {apiStore} = useStores();
  const [lastname, setLastname] = useState('');
  const registerUser = async () => {
    const body = {
      firstName: firstname,
      lastName: lastname,
      password,
      username,
    };
    if (
      !firstname ||
      !lastname ||
      !username ||
      !password ||
      !passwordCheck ||
      !isSelected
    ) {
      showError('Error', 'Please, fill all the fields');
      return;
    }
    if (password !== passwordCheck) {
      showError('Error', 'Passwords doesnt match');
      return;
    }
    setLoading(true);
    try {
      const res = await httpPost(
        apiStore.defaultUrl + registerUserURL,
        body,
        apiStore.defaultToken,
      );
      if (res.data.success) {
        showSuccess('Registration', 'User registered successfully');

        navigation.navigate(ROUTES.REGULARLOGIN);
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        showError('Error', 'Someone already has that username. Try another?');
      } else {
        showError('Error', 'Something went wrong');
      }
    }
    setLoading(false);
  };
  const goBack = () => {
    navigation.navigate(ROUTES.REGULARLOGIN);
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
       
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: 30,
          height: 30,
          backgroundColor: commonColors.primaryDarkColor,
          left: 0,
          zIndex: 1,
        }}
      />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          // top: 10,
          // left: "50%",
          backgroundColor: commonColors.primaryDarkColor,
          zIndex: +1,
          width: '100%',
          height: 50,
          borderTopLeftRadius: 30,
          // borderTopLeftColor: "black",
        }}>
        <View style={{position: 'absolute', top: 15}}>
          <Text style={loginStyles.headerText}>Create account</Text>
        </View>

        <TouchableOpacity style={loginStyles.goBackButton} onPress={goBack}>
          <IonIcons size={hp('4%')} name="close" color={'white'} />
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
      source={loginScreenBackgroundImage}
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginTop: 200,
          }}>
          <View
            style={[
              {
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              },
            ]}>
            <View style={loginStyles.form}>
             
              <TextInput
                style={loginStyles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Username"
              />

              <TextInput
                style={loginStyles.input}
                onChangeText={setFirstname}
                value={firstname}
                placeholder="Firstname"
              />
              <TextInput
                style={loginStyles.input}
                onChangeText={setLastname}
                value={lastname}
                placeholder="Lastname"
              />
              <TextInput
                style={loginStyles.input}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
                placeholder="Password"
              />
              <TextInput
                style={loginStyles.input}
                onChangeText={setPasswordCheck}
                value={passwordCheck}
                secureTextEntry={true}
                placeholder="Repeat password"
              />

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  onCheckColor={commonColors.primaryDarkColor}
                  onTintColor={commonColors.primaryDarkColor}
                  value={isSelected}
                  onValueChange={setSelection}
                  style={{
                    marginRight: 5,
                    color: commonColors.primaryDarkColor,
                  }}
                />
                <Text>I agree to </Text>
                <TouchableOpacity>
                  <Text
                    style={{
                      textDecorationLine: 'underline',
                    }}>
                    Terms and conditions
                  </Text>
                </TouchableOpacity>
              </View>
              <Button
                title={'Create'}
                onPress={registerUser}
                loading={loading}
                style={loginStyles.submitButton}
              />
            </View>
          </View>
          {/* </ImageBackground> */}
        </View>
      </ImageBackground>
      </TouchableWithoutFeedback>
    </View>
  );
};

const loginStyles = StyleSheet.create({
  input: {
    // height: 40,
    margin: 12,
    padding: Platform.OS === 'ios' ? 15 : 7,

    paddingLeft: 20,
    borderRadius: 30,
    width: wp('83%'),
    borderWidth: 2,
    borderColor: 'grey',
    color: 'black',
  },
  submitButton: {
    backgroundColor: commonColors.primaryDarkColor,
    padding: 5,
    width: wp('50%'),
    height: hp('5.7%'),
    borderRadius: 30,
    fontFamily: mediumFont,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  form: {
    flex: 1,
    height: hp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -hp('12%'),
    fontFamily: lightFont,
  },
  headerText: {
    color: 'white',
    fontFamily: textStyles.semiBoldFont,
    fontSize: 24,
  },
  goBackButton: {
    position: 'absolute',
    right: 10,
    top: 16,
    zIndex: 99999,
  },
});
