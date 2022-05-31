import PushNotification from 'react-native-push-notification';

export const getPushToken = async () => {
  let deviceToken = '';
  await PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: async function (token) {
      console.log('TOKEN:', token);
      deviceToken = token.token
      console.log('devv')
      return deviceToken;
    },
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },

    onAction: function (notification) {
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
