import {
  getMessaging,
  getToken,
  MessagePayload,
  onMessage,
} from "firebase/messaging";
import { firebase } from "./firebase";

export function getFirebaseMesagingToken() {
  const messaging = getMessaging(firebase.firebaseApp);

  const token =
    "BIZdmCnHiDRMrBBRzW79Dm1i7hMFRQM9CS1QfbalxjNwY-yvLtkj3IuZQaZ0ChZtjzlRSowkXUCmJC_jVgbFqew";
  return getToken(messaging, {
    vapidKey: token,
  });
}

export const onMessageListener = (): Promise<MessagePayload> => {
  const messaging = getMessaging(firebase.firebaseApp);

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};
