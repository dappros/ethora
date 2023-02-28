import {
  getMessaging,
  getToken,
  MessagePayload,
  onMessage,
} from "firebase/messaging";
import { firebaseApp } from "./firebase";

const messaging = getMessaging(firebaseApp);

export function getFirebaseMesagingToken() {
  const token =
    "BIZdmCnHiDRMrBBRzW79Dm1i7hMFRQM9CS1QfbalxjNwY-yvLtkj3IuZQaZ0ChZtjzlRSowkXUCmJC_jVgbFqew";
  return getToken(messaging, {
    vapidKey: token,
  });
}

export const onMessageListener = (): Promise<MessagePayload> =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
