/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import axios from 'axios';
import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {subscribePushNotification} from '../config/routesConstants';
import { ROUTES } from '../constants/routes';
import {underscoreManipulation} from './underscoreLogic';

export const subscribeForPushNotifications = async (data:any, defaultUrl:string) => {
  const qs = require('qs');
  return await axios.post("https://"+defaultUrl+":7777/api/v1"+subscribePushNotification, qs.stringify(data), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const getPushToken = async (walletAddress:string, DOMAIN:string, defaultUrl:string, navigation:any) => {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: async function (token:any) {
      console.log('TOKEN:', token);
      const res = await subscribeForPushNotifications({
        appId: 'Ethora',
        deviceId: token.token,
        deviceType: Platform.OS === 'ios' ? '0' : '1',
        environment: 'Production',
        externalId: '',
        isSubscribed: '1',
        jid: underscoreManipulation(walletAddress) + '@' + DOMAIN,
        screenName: 'Ethora',
      }, defaultUrl);

    },
    onNotification: function (notification:any) {
      console.log('NOTIFICATION:', notification);
      const chatJID = notification.data.mucId;
      setTimeout(()=>{
        navigation.navigate(ROUTES.CHAT, {chatJid: chatJID})
      },2000)
    },

    onAction: function (notification:any) {
      console.log('ACTION:', notification.action);
    },
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });
};
