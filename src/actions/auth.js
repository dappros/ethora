/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import * as types from '../constants/types';
import * as connectionURL from '../config/url';
import fetchFunction from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {deleteAllRealm} from '../components/realmModels/allSchemas';
import {LoginManager} from 'react-native-fbsdk-next';
import {APP_TOKEN} from '../../docs/config';

const hitAPI = new fetchFunction();

export const fetchingCommonRequest = () => ({
  type: types.FETCHING_COMMON_REQUEST,
});

export const fetchingCommonFailure = errorMsg => ({
  type: types.FETCHING_COMMON_FAILURE,
  payload: errorMsg,
});

export const loginUserSuccess = data => ({
  type: types.FETCHING_USER_LOGIN_SUCCESS,
  payload: data,
});

export const setPushSubsData = data => ({
  type: types.PUSH_SUBSCRIPTION,
  payload: data,
});

export const registerUserSuccess = () => ({
  type: types.FETCHING_USER_REGISTER_SUCCESS,
});

export const getToken = token => ({
  type: types.GET_TOKEN,
  token,
});

export const saveToken = token => ({
  type: types.SAVE_TOKEN,
  token,
});

export const removeToken = () => ({
  type: types.REMOVE_TOKEN,
});

export const getInitialData = data => ({
  type: types.INITIAL_DATA,
  data,
});

export const saveInitialDataAction = data => ({
  type: types.SAVE_INITIAL_DATA,
  data,
});

export const updateUserDescription = desc => ({
  type: types.UPDATE_USER_DESCRIPTION,
  payload: desc,
});

export const updateUserAvatar = url => ({
  type: types.UPDATE_USER_PHOTO,
  payload: url
})

export const setOtherUserVcard = (data) => ({
  type: types.SET_OTHER_USER_VCARD,
  payload: data
})

export const setOtherUserDetails = (data) => ({
  type: types.SET_OTHER_USER_DETAILS,
  payload: data
})

export const setIsPreviousUser = (value) => ({
  type: types.SET_IS_PREVIOUS_USER,
  payload: value
})

export const updateUserProfile = profileData => ({
  type:types.UPDATE_USER_PROFILE,
  payload: profileData
})

export const wordpressLogin = data => ({
  type: types.WORDPRESS_AUTH,
  payload: data,
});

export const logoutAction = () => ({
  type: types.LOGOUT,
});

export const cancel = () => ({
  type: types.CANCEL,
});

export const loading = bool => ({
  type: types.LOADING,
  isLoading: bool,
});

export const isSkipForever = bool => ({
  type: types.SKIP_FOREVER,
  payload: bool,
});

// export const removeUserToken = () => dispatch =>
// AsyncStorage.removeItem('token')
//     .then((data) => {
//         dispatch(loading(false));
//         dispatch(removeToken(data));
//     })
//     .catch((err) => {
//         dispatch(loading(false));
//         dispatch(error(err.message || 'ERROR'));
//     })

export const getUserToken = () => dispatch =>
  AsyncStorage.getItem('token').then(data => {
    dispatch(loading(false));
    dispatch(getToken(data));
  });

export const retrieveInitialData = () => dispatch =>
  AsyncStorage.getItem('initialLoginData').then(data => {
    dispatch(loading(false));
    dispatch(getInitialData(JSON.parse(data)));
  });

export const saveInitialData = (data, callback) => {
  AsyncStorage.setItem('initialLoginData', JSON.stringify(data))
    .then(() => {
      callback(data);
    })
    .catch(error => console.log(error));
};

export const saveUserToken = token => AsyncStorage.setItem('token', token);

export const loginUser = (loginType, authToken, password, ssoUserData) => {
  // prettier-ignore
  let bodyData = {
    "loginType": loginType,
    "authToken": authToken,
  };
  return dispatch => {
    console.log("in dispatch");
    dispatch(fetchingCommonRequest());
    try {
      console.log("in try")
      hitAPI.fetchPost(connectionURL.loginURL, bodyData, APP_TOKEN, () => {
        dispatch(logOut());
      }, data => {
        if (data.success) {
          saveUserToken(data.token)
            .then(data => {
              dispatch(loading(false));
              dispatch(saveToken(data));
            })
            .catch(error => {
              console.log(error);
            });
          // console.log(data,'loginData')
          const photo = ssoUserData.photo
          let {firstName, lastName, username} = data.user;
          if(!lastName){
            lastName = firstName.split(" ")[1];
            firstName = firstName.split(" ")[0];
          }
          let {walletAddress} = data.user.defaultWallet;
          // saveInitialData({firstName,lastName,walletAddress,image,username,password}).
          // then((data)=>{
          //     console.log('save initial data called')
          //     dispatch(saveInitialDataAction(data))
          // }).then(dispatch(loginUserSuccess(data)))
          saveInitialData(
            {firstName, lastName, walletAddress, photo, username, password},
            callback => {
              dispatch(saveInitialDataAction(callback));
              dispatch(loginUserSuccess(data));
            },
          );

          // navigation.navigate('ChatHomeComponent');
        } 
        else {
          dispatch(fetchingCommonFailure(data.msg));
        }
      });
    } catch (error) {
      console.log(error,"asdfasdfcasdf");
      dispatch(fetchingCommonFailure('Something went wrong'));
    }
  };
};

const registerUserWordpress = dataObject => {
  return dispatch => {
    try {
      hitAPI.fetchPost(
        connectionURL.registerUserURL,
        dataObject,
        APP_TOKEN,
        () => {
          dispatch(logOut());
        },
        data => {
          if (data.success) {
            dispatch(
              loginWordpressUser(
                dataObject.username,
                dataObject.password,
                null,
                null,
              ),
            );
          } else {
            dispatch(fetchingCommonFailure(data));
          }
        },
      );
    } catch (error) {
      console.log(error);
    }
  };
};

const loginWordpressUser = (username, password) => {
  return dispatch => {
    dispatch(loginUser(username, password, null, null));
  };
};

export const registerUser = (dataObject, ssoUserData) => {
  console.log(dataObject);
  return dispatch => {
    console.log('data', 'yedata');

    try {
      hitAPI.fetchPost(
        connectionURL.registerUserURL,
        dataObject,
        APP_TOKEN,
        () => {
          dispatch(logOut());
        },
        data => {
          if (data.success === true) {
              dispatch(registerUserSuccess());
              dispatch(loginUser(dataObject.loginType, dataObject.authToken, dataObject.password, ssoUserData));
            // dispatch(loginUser(dataObject.username,dataObject.password,navigation))
          } else {
            dispatch(fetchingCommonFailure(data));
          }
        },
      );
    } catch (error) {
      console.log(error);
      dispatch(fetchingCommonFailure('Something went wrong'));
    }
  };
};

export const checkInDb = async email => {
  let axios = require('axios');
  let configAxios = {
    method: 'get',
    url: 'http://18.222.34.175/v1/users/checkEmail/' + email,
    headers: {
      'Content-Type': 'application/json',
      Authorization: APP_TOKEN,
    },
  };

  return await axios(configAxios);
};

export const logOut = () => {
  return async dispatch => {
    dispatch(fetchingCommonRequest());
    try {
      // navigation.navigate("loginComponent");
      LoginManager.logOut();
      try {
        console.log("inhereasdas")
        await AsyncStorage.clear()
      } catch(e) {
        // clear error
        console.log(e,"adcafgtsafc")
      }
      deleteAllRealm();
      dispatch(logoutAction());
    } catch (error) {
      console.log(error);
      dispatch(fetchingCommonFailure(error));
    }
  };
};

// export const wordpressLoginAction = (username, password, navigation) => {
//   let wordpressAuthURL =
//     connectionURL.wordpressLogin +
//     '?username=' +
//     username +
//     '&password=' +
//     password;
//   return dispatch => {
//     dispatch(fetchingCommonRequest());
//     try {
//       hitAPI.fetchPost(wordpressAuthURL, null, '', data => {
//         console.log(data);
//         if (data.token) {
//           dispatch(wordpressLogin(data));
//           dispatch(loginUser(data.user_nicename, password, navigation, data));
//         }
//         if (data.status === 403) {
//           console.log('asfdsdgvsdvsd');
//           dispatch(fetchingCommonFailure('Invalid Credentials!'));
//         }
//       });
//     } catch (error) {
//       console.log(error);
//       dispatch(fetchingCommonFailure('something went wrong!'));
//     }
//   };
// };

export const pushSubscription = bodyData => {
  return dispatch => {
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
      deviceId: bodyData.deviceId,
      deviceType: bodyData.deviceType,
      jid: bodyData.jid,
      externalId: bodyData.externalId,
      appId: bodyData.appId,
      environment: bodyData.environment,
      screenName: bodyData.screenName,
      isSubscribed: bodyData.isSubscribed,
    });

    var configPush = {
      method: 'post',
      url: connectionURL.subscribePushNotification,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    };

    var configCheck = {
      method: 'get',
      url: connectionURL.checkPushSubscribe + bodyData.deviceId,
    };

    try {
      axios(configCheck)
        .then(function(response) {
          if (response.data.ok) {
            response.data.result.map(item => {
              if (item.jid !== bodyData.jid) {
                console.log('asdasdxasdasd');
                axios(configPush)
                  .then(function(response) {
                    if (response.data.ok) {
                      dispatch(setPushSubsData(response.data));
                    }
                  })
                  .catch(function(error) {
                    console.log(error, 'asbdfhdmgsdd');
                  });
              } else {
                dispatch(setPushSubsData(response.data));
              }
              console.log(item.jid, 'hgvhgfhgfv');
            });
            // console.log(typeof(response.data.result[0].jid),"ASdasdasd")
          } else if (!response.data.ok) {
            console.log('Asdcdgdsbdsbnsd');
            axios(configPush)
              .then(function(response) {
                if (response.data.ok) {
                  dispatch(setPushSubsData(response.data));
                }
              })
              .catch(function(error) {
                console.log(error, 'asbdfhdmgsdd');
              });
          }
        })
        .catch(function(error) {
          console.log(error, 'Asfasfasfasf');
          dispatch(fetchingCommonFailure(error));
        });
    } catch (error) {
      dispatch(fetchingCommonFailure(error));
    }
  };
};
