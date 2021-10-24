/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {Component} from "react";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

export default class PushController extends Component{
    componentDidMount(){
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function(token) {
              // console.log("TOKEN:", token);
            },
          
            // (required) Called when a remote or local notification is opened or received
            onNotification: function(notification) {
              // console.log("NOTIFICATION:", notification);
          
              // process the notification here
          
              // required on iOS only 
              notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
            // Android only
            senderID: "1044836348423",
            // iOS only
            permissions: {
              alert: true,
              badge: true,
              sound: true
            },
            popInitialNotification: true,
            requestPermissions: true
          });
    }

    render(){
        return null;
    }
}
