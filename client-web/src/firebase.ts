import { FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, getToken as _getToken } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDQdkvvxKKx4-WrjLQoYf08GFARgi_qO4g",
  authDomain: "ethora-668e9.firebaseapp.com",
  projectId: "ethora-668e9",
  storageBucket: "ethora-668e9.appspot.com",
  messagingSenderId: "972933470054",
  appId: "1:972933470054:web:d4682e76ef02fd9b9cdaa7",
  measurementId: "G-WHM7XRZ4C8",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);

export function getToken() {
  const messaging = getMessaging(firebaseApp);
  return _getToken(messaging, {
    vapidKey:
      "BCzcT7yzF8F188maOgPAISXqWCTDavGzWW0SWLOBx9vX2mYFjBXMaTMBDR3HXlmXOduyE253sblF9HP6aEBbx38",
  });
}
