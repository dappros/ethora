/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import axios from "axios"
import { Platform } from "react-native"
import PushNotification from "react-native-push-notification"
import { subscribePushNotification } from "../config/routesConstants"
import { HomeStackNavigationProp } from "../navigation/types"
import { rootStore } from "../stores/context"
import { playCoinSound } from "./chat/playCoinSound"
import { underscoreManipulation } from "./underscoreLogic"
import { xmppPushUrl } from "../../docs/config"

export const subscribeForPushNotifications = async (data: any) => {
  const qs = require("qs")
  return await axios.post(
    "https://push.qa.ethoradev.com/api/v1/subscriptions",
    qs.stringify(data),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  )
}

export const getPushToken = async (
  walletAddress: string,
  DOMAIN: string,
  defaultUrl: string,
  navigation: HomeStackNavigationProp
) => {
  console.log("ousj")
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: async function (token: any) {
      console.log("TOKEN:", token)
      try {
        const res = await subscribeForPushNotifications({
          appId: "Ethora",
          deviceId: token.token,
          deviceType: Platform.OS === "ios" ? "0" : "1",
          environment: "Production",
          externalId: "",
          isSubscribed: "1",
          jid: underscoreManipulation(walletAddress) + "@" + DOMAIN,
          screenName: "Ethora",
        })
        console.log(res.data)
      } catch (error) {
        console.log("error", error)
      }

      // creating channel for local notifications
      PushNotification.createChannel(
        {
          channelId: "fcm_fallback_notification_channel", // (required)
          channelName: "My channel",
          playSound: false,
          soundName: "default",
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      )
    },
    onNotification: function (notification: any) {
      console.log("NOTIFICATION:", notification)
      const chatJID = notification.data.mucId
      // navigating to chat if notification came from chat
      if (chatJID) {
        setTimeout(() => {
          navigation.navigate("ChatScreen", { chatJid: chatJID })
        }, 2000)
      }
      // navigating to the Transactions screen after user tapped on the transaction notification
      if (
        notification.userInteraction &&
        notification.message.includes("transaction")
      ) {
        navigation.navigate("TransactionsScreen")
      }
      // displaying local notification after receiving push from server with transaction
      if (notification?.data?.customValue?.includes("receiverFirstName")) {
        PushNotification.localNotification({
          /* Android Only Properties */
          channelId: "fcm_fallback_notification_channel", // (required) channelId, if the channel doesn't exist, notification will not trigger.
          invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
          /* iOS only properties */
          subtitle: "My Notification Subtitle", // (optional) smaller title below notification title
          /* iOS and Android properties */
          title: "Transaction",
          message: "Received transaction",
        })
        playCoinSound(7)
        return
      }
    },

    onAction: function (notification: any) {
      console.log("ACTION:", notification.action)
    },
    onRegistrationError: function (err) {
      console.error(err.message, err)
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  })
}
