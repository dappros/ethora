import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDQdkvvxKKx4-WrjLQoYf08GFARgi_qO4g",
  authDomain: "ethora-668e9.firebaseapp.com",
  projectId: "ethora-668e9",
  storageBucket: "ethora-668e9.appspot.com",
  messagingSenderId: "972933470054",
  appId: "1:972933470054:web:d4682e76ef02fd9b9cdaa7",
  measurementId: "G-WHM7XRZ4C8",
};

const app = initializeApp(firebaseConfig);

// function requestPermission() {
//   Notification.requestPermission().then((permission) => {
//     if (permission === "granted") {
//       console.log("granted !!!");
//       const messaging = getMessaging(app);
//       console.log({ messaging });
//       getToken(messaging, {
//         vapidKey:
//           "BCzcT7yzF8F188maOgPAISXqWCTDavGzWW0SWLOBx9vX2mYFjBXMaTMBDR3HXlmXOduyE253sblF9HP6aEBbx38",
//       })
//         .then((currentToken) => {
//           if (currentToken) {
//             console.log({ currentToken });
//           } else {
//             console.log({ currentToken });
//           }
//         })
//         .catch((error) => console.log({ error }));
//     } else {
//       console.log("does not granted");
//     }
//   });
// }

// export { app as default, requestPermission };
