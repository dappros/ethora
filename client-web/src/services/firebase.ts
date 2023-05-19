import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { useStoreState } from "../store";

class Firebase {
  firebaseApp: FirebaseApp = null;

  init() {
    const firebaseConfig = {
      apiKey: useStoreState.getState().config.REACT_APP_FIREBASE_API_KEY,
      authDomain:
        useStoreState.getState().config.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: useStoreState.getState().config.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket:
        useStoreState.getState().config.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId:
        useStoreState.getState().config.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: useStoreState.getState().config.REACT_APP_FIREBASE_APP_ID,
      measurementId:
        useStoreState.getState().config.REACT_APP_FIREBASE_MEASURMENT_ID,
    };
    this.firebaseApp = initializeApp(firebaseConfig);
  }
}
export const firebase = new Firebase();

type IUser = User & { accessToken: string };

export const signInWithGoogle = async () => {
  const auth = getAuth(firebase.firebaseApp);
  const googleProvider = new GoogleAuthProvider();
  googleProvider.addScope("https://www.googleapis.com/auth/userinfo.email");
  googleProvider.addScope("https://www.googleapis.com/auth/userinfo.profile");
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user as IUser;
    const idToken = await auth?.currentUser?.getIdToken();
    const credential = GoogleAuthProvider.credentialFromResult(res);
    return {
      user,
      idToken,
      credential,
    };
  } catch (err) {
    console.error(err);
    return {};
  }
};
