// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDQdkvvxKKx4-WrjLQoYf08GFARgi_qO4g",
  authDomain: "ethora-668e9.firebaseapp.com",
  projectId: "ethora-668e9",
  storageBucket: "ethora-668e9.appspot.com",
  messagingSenderId: "972933470054",
  appId: "1:972933470054:web:d4682e76ef02fd9b9cdaa7",
  measurementId: "G-WHM7XRZ4C8",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
