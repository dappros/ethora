import React, {Component} from 'react';

import styles from './style/loginStyle';
import {
  Text,
  View,
  ActivityIndicator,
  Image,
  SafeAreaView,
  ImageBackground,
  Linking,
  Platform,
  Alert
} from 'react-native';
import {CommonButton} from '../components/shared/customButtons';
import {
  wordpressLoginAction,
  loginUser,
  registerUser,
} from '../actions/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {connect} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {sha256} from 'react-native-sha256';
import AntIcon from 'react-native-vector-icons/AntDesign';
import fetchFunction from '../config/api';
import * as connectionURL from '../config/url';
import { AppleButton, appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid'
import {logoPath, appTitle, APP_TOKEN, commonColors, textStyles, loginScreenBackgroundImage} from "../../docs/config"
const hitAPI = new fetchFunction();

  const {
    primaryColor,
    secondaryColor
  } = commonColors;

  const {
    mediumFont,
    lightFont,
    boldFont
  } = textStyles
  
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      userInfo: null,
      error: null,
      isPasswordFilled: true,
      isUsernameFilled: true,
      isSecureEntry: true,
      version: '',
      token: '',
      email: '',
    };
  }

  async componentDidMount() {
    const date = new Date();
    const version = `${date
      .getFullYear()
      .toString()
      .substring(
        2,
      )}.${date.getMonth().toString()}.${date.getDate().toString()}`;
    this.setState({
      version,
    });
    GoogleSignin.configure({
      forceCodeForRefreshToken: true,
      webClientId:
        '972933470054-hbsf29ohpato76til2jtf6jgg1b4374c.apps.googleusercontent.com',
    });
    const onAuthStateChanged = user => {
      this.setState({
        googleUser: user,
      });
    };
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  }

  onLoginPress = async () => {
    let {navigation} = this.props;
    let {username, password} = this.state;
    if (username == '' || password == '') {
      alert('Please fill all the fields');
    } else {
      this.setState({
        username: '',
        password: '',
      });
      await this.props.loginUser(username, password, navigation);
    }
  };

  signInGoogle=(googleCredential, callback)=>{
    let googleUserInfo = {};
    auth().signInWithCredential(googleCredential)
    .then(data => callback(data))
    .catch(error => {
      if(error.message === "[auth/network-request-failed] A network error (such as timeout, interrupted connection or unreachable host) has occurred."){
        Alert.alert('No Internet Connection',
        'Connect your phone to the Internet by using an available Wi-Fi or cellular network.',[
          {
            text:"Cancel",
            onPress: () => console.log("Cancel")
          },
          {
            text:"Retry",
            onPress: () => this.onGoogleButtonPress()
          }
        ]
        )
      }
    });
  }

  async onGoogleButtonPress() {
    await LoginManager.logOut();
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    // AsyncStorage.setItem('GToken', googleCredential.token);
    

    this.signInGoogle(googleCredential,async callback=>{
      const googleUser = callback;

      let hashUID = "";

      await sha256(googleUser.user.uid).then(hash => {
        hashUID = hash
      })

      let user = {
        firstName: googleUser.additionalUserInfo.profile.given_name,
        lastName: googleUser.additionalUserInfo.profile.family_name,
        email: googleUser.additionalUserInfo.profile.email,
        photo:googleUser.additionalUserInfo.profile.picture,
        authToken: idToken,
        uid: hashUID
      };
      await this.loginOrRegisterSocialUser(
        user,
        user.email,
        'google',
      );

    })
  }

  async onFacebookButtonPress() {
    await LoginManager.logOut()
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    const subscriber = auth().onAuthStateChanged(e => console.log('e', e));

    let facebookUser = await auth().signInWithCredential(facebookCredential);
    let hashUID = "";
    await sha256(facebookUser.user.uid).then(hash => {
      hashUID = hash
    })
    let user = {
      firstName: facebookUser.additionalUserInfo.profile.first_name,
      lastName: facebookUser.additionalUserInfo.profile.last_name,
      email: facebookUser.additionalUserInfo.profile.email,
      photo:facebookUser.additionalUserInfo.profile.picture.data.url,
      authToken: facebookCredential.token,
      uid: hashUID
    };
    // Sign-in the user with the credential
    await this.loginOrRegisterSocialUser(
      user,
      user.email,
      "facebook",
    );
  }

  onAppleButtonPress= async() =>{
    await LoginManager.logOut();
    // performs login request
    if(Platform.OS==="android"){
        // Generate secure, random values for state and nonce
    const rawNonce = uuid();
    const state = uuid();

    // Configure the request
    appleAuthAndroid.configure({
      // The Service ID you registered with Apple
      clientId: 'com.ethora.service',

      // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
      // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
      redirectUri: 'https://ethora-668e9.firebaseapp.com/__/auth/handler',

      // The type of response requested - code, id_token, or both.
      responseType: appleAuthAndroid.ResponseType.ALL,

      // The amount of user information requested from Apple.
      scope: appleAuthAndroid.Scope.ALL,

      // Random nonce value that will be SHA256 hashed before sending to Apple.
      nonce: rawNonce,

      // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
      state,
    });

  // Open the browser window for user sign in
  const responseFromApple = await appleAuthAndroid.signIn();
  
  const {id_token, nonce} = responseFromApple;

  const appleCredentialAndroid = auth.AppleAuthProvider.credential(id_token, nonce);
  auth().signInWithCredential(appleCredentialAndroid).then(async data=>{

    let hashUID = await sha256(data.user.uid);
    let user = {
      loginType: "apple",
      authToken: id_token,
      displayName: "",
      uid: hashUID,
      email:data.additionalUserInfo.profile.email
    }

    this.loginOrRegisterSocialUser(
      user,
      data.additionalUserInfo.profile.email,
      'apple'
    );
  })
  // Send the authorization code to your backend for verification
  }else{
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
  
    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }
  
    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
  

    auth().signInWithCredential(appleCredential).then(async data=>{
      let hashUID = await sha256(data.user.uid);
      let user = {
        loginType: "apple",
        authToken: identityToken,
        displayName: "",
        uid: hashUID,
        email:data.additionalUserInfo.profile.email
      }

      this.loginOrRegisterSocialUser(
        user,
        data.additionalUserInfo.profile.email,
        'apple'
      )
    })

    
  }
  }

  loginOrRegisterSocialUser = async (user, userEmail, loginType) => {
    const url = connectionURL.checkEmailExist+userEmail

    hitAPI.fetchGet(url, APP_TOKEN, this.props.logOut, callback=>{
      if(!callback.success){
        this.props.loginUser(
          loginType,
          user.authToken,
          user.uid,
          user
        )
      }else{
        this.registerSocialUser(user, loginType);
      }
    })
  };

  registerSocialUser = async (user, loginType) => {

    const dataObject = loginType==="apple"?{
      loginType: loginType,
      authToken: user.authToken,
      displayName: user.displayName,
      password: user.uid,
      username: user.email,
      email: user.email
    }:{
      firstName: user.firstName,
      lastName: user.lastName,
      username:user.email,
      email: user.email,
      password: user.uid,
      loginType,
      authToken: user.authToken,
    }
    await this.props.registerUser(
      dataObject,
      user
    );
  };

  openMembership = () => {
    Linking.openURL('https://www.goldenkey.org/golden-key-eligibility/');
  };

  revealPassword() {
    this.setState({
      isSecureEntry: !this.state.isSecureEntry,
    });
  }

  renderError() {
    const {error} = this.state;
    if (!error) {
      return null;
    }
    const text = `${error.toString()} ${error.code ? error.code : ''}`;
    return <Text>{text}</Text>;
  }

  renderSignInButton() {
    let {isFetching, error, errorMessage} = this.props.loginReducer;
    let {username, isSecureEntry, password} = this.state;


    return (
      <SafeAreaView
        style={{
          flex: 1,
          // backgroundColor: primaryColor,
          justifyContent:"center",
          height: Platform.OS == 'ios' ? hp('14%') : hp('10%'),
        }}>
        <ImageBackground
          source = {loginScreenBackgroundImage}
          resizeMode="stretch"
          style={{
            flex:1,
            justifyContent:"center",
            alignItems:"center"
          }}
        >
          <View style={[{justifyContent: 'center', flex: 1, alignItems:"center"}]}>
            <View style={styles.loginScreenContainer}>
                <View style={styles.loginFormView}>
                  <View style={{justifyContent: 'center', alignItems: 'center', flex:1}}>
                    <Image
                      source={logoPath}
                      style={{width: wp('70%'), height: wp('20%')}}
                    />
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontFamily: mediumFont,
                        marginTop: hp('1.84%'),
                        fontSize: hp('3.44%'),
                      }}>
                      {/* {appTitle} */}
                    </Text>
                  </View>

                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: hp('1%'),
                      fontFamily: lightFont,
                    }}>
                    <CommonButton
                      buttonText="Sign in with Facebook"
                      textStyle={{
                      color: "white",
                      fontFamily:boldFont,
                      textTransform:"uppercase",
                      fontSize:hp("1.47%")
                      }}
                      icon
                      iconType={<AntIcon name="facebook-square" size={hp('2.25%')} style={{marginRight:wp("4.981%")}} color="white" />}
                      onPress={() =>
                        this.onFacebookButtonPress()}
                      style={{
                        borderWidth: 1,
                        borderColor: '#4D6DA4',
                        backgroundColor: '#4D6DA4',
                        margin: wp('2%'),
                        width: wp('80%'),
                        height: hp('5.91%'),
                        borderRadius: 5,
                        fontFamily: lightFont,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    />
                    <CommonButton
                      buttonText={'Sign in with Google'}
                      textStyle={{
                      color:"#696969",
                      fontFamily:boldFont,
                      textTransform:"uppercase",
                      fontSize:hp("1.47%")
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: '#FFFFFF',
                        backgroundColor: '#FFFFFF',
                        margin: wp('2%'),
                        width: wp('80%'),
                        height: hp('5.91%'),
                        borderRadius: 5,
                        fontFamily: lightFont,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      icon
                      iconType={<Image source={require('../assets/google-logo.png')} style={{height:hp('2.25%'), width:hp('2.25%'), marginRight:wp("5.06%")}}/>}
                      onPress={() =>
                        this.onGoogleButtonPress()
                      }
                    />
                    <CommonButton
                      buttonText={'Sign in with Apple'}
                      textStyle={{
                      color:"#fff",
                      fontFamily:boldFont,
                      textTransform:"uppercase",
                      fontSize:hp("1.47%")
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: '#000000',
                        backgroundColor: '#000000',
                        margin: wp('2%'),
                        width: wp('80%'),
                        height: hp('5.91%'),
                        borderRadius: 5,
                        fontFamily: lightFont,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      icon
                      iconType={
                      <Image 
                      source={require('../assets/appleWhite.png')} 
                      style={{height:hp('2.25%'), width:hp('2.25%'), 
                      marginRight:wp("5.06%")}}/>}
                      onPress={() =>
                        this.onAppleButtonPress()
                      }
                    />
                  </View>

                  <View style={{justifyContent: 'center', padding: 10}}>
                    <ActivityIndicator
                      size="small"
                      color={'white'}
                      animating={isFetching}
                    />
                  </View>

                  <View style={{alignItems: 'center'}}>
                    {error ? (
                      <Text style={{color: 'red'}}>{errorMessage}</Text>
                    ) : null}
                  </View>

                  <View
                    style={{
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        color: 'grey',
                        fontFamily: lightFont,
                        fontSize: hp("0.98%")
                      }}>
                      Version 21.10
                    </Text>
                    <Text
                      style={{
                        color: 'grey',
                        fontFamily: lightFont,
                        fontSize: hp("0.98%")
                      }}>
                      Powered by Dappros Platform
                    </Text>
                    <View style={{padding: 5}}>
                      <Image
                        source={require('../assets/poweredBy.png')}
                        style={{height: hp('1.84%'), width: hp('1.84%')}}
                      />
                    </View>
                  </View>
                </View>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  render() {
    const body = this.renderSignInButton();
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        {body}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state,
  };
};

module.exports = connect(
  mapStateToProps,
  {
    wordpressLoginAction,
    loginUser,
    registerUser,
  },
)(Login);
