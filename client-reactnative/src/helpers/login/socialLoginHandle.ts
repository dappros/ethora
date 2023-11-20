/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethorablob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { LoginManager, AccessToken } from "react-native-fbsdk-next"
import auth from "@react-native-firebase/auth"
import { sha256 } from "react-native-sha256"
import { checkEmailExist } from "../../config/routesConstants"
import { httpGet } from "../../config/apiService"
import { showToast } from "../../components/Toast/toast"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { Alert, Platform } from "react-native"
import appleAuth, {
  appleAuthAndroid,
} from "@invertase/react-native-apple-authentication"
import { v4 as uuid } from "uuid"

export const loginOrRegisterSocialUser = async (
  user: any,

  defaultToken: string,
  loginUser: any,
  registerSocialUser: any,
  loginType: string
) => {
  const url = checkEmailExist + user.email
  try {
    const response = await httpGet(url, defaultToken)
    if (!response.data.success) {
      loginUser(loginType, user.authToken, user.uid, user)
    } else {
      const dataObject =
        loginType === "apple"
          ? {
              loginType: loginType,
              authToken: user.authToken,
              displayName: user.displayName,
              password: user.uid,
              username: user.email,
              email: user.email,
              firstName: user.firstName || "Anonymous",
              lastName: user.lastName || "Raccoon",
            }
          : {
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.email,
              email: user.email,
              password: user.uid,
              loginType,
              authToken: user.authToken,
            }
      registerSocialUser(dataObject, user)
    }
  } catch (error) {
    showToast(
      "error",
      "Error",
      "Something went wrong, please try again later",
      "top"
    )
  }
}

export const handleFaceBookLogin = async (
  defaultToken: string,
  loginUser: any,
  registerSocialUser: any,
  type: string
) => {
  LoginManager.logOut()

  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions([
    "public_profile",
    "email",
  ])

  if (result.isCancelled) {
    throw "User cancelled the login process"
  }

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken()

  if (!data) {
    throw "Something went wrong obtaining access token"
  }

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(
    data.accessToken
  )

  const facebookUser = await auth().signInWithCredential(facebookCredential)

  let hashUID = ""

  await sha256(facebookUser.user.uid).then((hash) => {
    hashUID = hash
  })

  const user = {
    firstName: facebookUser.additionalUserInfo.profile.first_name,
    lastName: facebookUser.additionalUserInfo.profile.last_name,
    email: facebookUser.additionalUserInfo.profile.email,
    photo: facebookUser.additionalUserInfo.profile.picture.data.url,
    authToken: facebookCredential.token,
    uid: hashUID,
  }

  loginOrRegisterSocialUser(
    user,
    defaultToken,
    loginUser,
    registerSocialUser,
    type
  )
}

const signInGoogle = (googleCredential: any, callback: any) => {
  auth()
    .signInWithCredential(googleCredential)
    .then((data) => callback(data))
    .catch((error) => {
      if (
        error.message ===
        "[auth/network-request-failed] A network error (such as timeout, interrupted connection or unreachable host) has occurred."
      ) {
        Alert.alert(
          "No Internet Connection",
          "Connect your phone to the Internet by using an available Wi-Fi or cellular network.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel"),
            },
            {
              text: "Retry",
              onPress: () => handleGoogleLogin(),
            },
          ]
        )
      }
    })
}

export const handleGoogleLogin = async (
  defaultToken: string,
  loginUser: any,
  registerSocialUser: any,
  type: string
) => {
  LoginManager.logOut()

  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn()

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken)

  // Sign-in the user with the credential
  // AsyncStorage.setItem('GToken', googleCredential.token);

  const googleUser = await auth().signInWithCredential(googleCredential)

  let hashUID = ""

  await sha256(googleUser.user.uid).then((hash) => {
    hashUID = hash
  })

  const user = {
    firstName: googleUser.additionalUserInfo.profile.given_name,
    lastName: googleUser.additionalUserInfo.profile.family_name,
    email: googleUser.additionalUserInfo.profile.email,
    photo: googleUser.additionalUserInfo.profile.picture,
    authToken: idToken,
    uid: hashUID,
  }

  await loginOrRegisterSocialUser(
    user,
    defaultToken,
    loginUser,
    registerSocialUser,
    type
  )
}

export const handleAppleLogin = async (
  defaultToken: string,
  loginUser: any,
  registerSocialUser: any,
  type: string
) => {
  const appleUser = {
    loginType: "apple",
    authToken: "",
    displayName: "",
    uid: "",
    email: "",
  }
  LoginManager.logOut()
  // performs login request
  if (Platform.OS === "android") {
    // Generate secure, random values for state and nonce
    const rawNonce = uuid()
    const state = uuid()

    // Configure the request
    appleAuthAndroid.configure({
      // The Service ID you registered with Apple
      clientId: "com.ethora.service",

      // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
      // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
      redirectUri: "https://ethora-668e9.firebaseapp.com/__/auth/handler",

      // The type of response requested - code, id_token, or both.
      responseType: appleAuthAndroid.ResponseType.ALL,

      // The amount of user information requested from Apple.
      scope: appleAuthAndroid.Scope.ALL,

      // Random nonce value that will be SHA256 hashed before sending to Apple.
      nonce: rawNonce,

      // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
      state,
    })
    // console.log(appleAuthAndroid.isSupported)

    // Open the browser window for user sign in
    const responseFromApple = await appleAuthAndroid.signIn()

    const { id_token, nonce } = responseFromApple

    const appleCredentialAndroid = auth.AppleAuthProvider.credential(
      id_token,
      nonce
    )
    const data = await auth().signInWithCredential(appleCredentialAndroid)
    const hashUID = await sha256(data.user.uid)
    const user = {
      loginType: "apple",
      authToken: id_token,
      displayName: "",
      uid: hashUID,
      email: data.additionalUserInfo.profile.email,
      firstName: data.user.displayName,
      lastName: data.user.displayName,
    }
    return user

    // Send the authorization code to your backend for verification
  } else {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    })

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw "Apple Sign-In failed - no identify token returned"
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce
    )

    const data = await auth().signInWithCredential(appleCredential)
    const hashUID = await sha256(data.user.uid)
    const user = {
      loginType: "apple",
      authToken: identityToken,
      displayName: "",
      uid: hashUID,
      email: data.additionalUserInfo.profile.email,
      firstName: data.user.displayName,
      lastName: data.user.displayName,
    }
    return user
  }
}
