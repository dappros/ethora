import {
  getMessaging,
  getToken,
  MessagePayload,
  onMessage,
} from "firebase/messaging";
import { firebaseApp } from "./firebase";

const messaging = getMessaging(firebaseApp);

export function getFirebaseMesagingToken() {
  return getToken(messaging, {
    vapidKey:
      "BCzcT7yzF8F188maOgPAISXqWCTDavGzWW0SWLOBx9vX2mYFjBXMaTMBDR3HXlmXOduyE253sblF9HP6aEBbx38",
  });
}

export const onMessageListener = (): Promise<MessagePayload> =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
