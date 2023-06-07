import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { useStoreState } from "../store";

class Firebase {
  firebaseApp: FirebaseApp = null;
  firebaseConfig: FirebaseOptions = null;
  init() {
    const config = useStoreState.getState().config.firebaseConfig;
    const firebaseConfig = {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
      measurementId: config.measurementId,
    };
    this.firebaseConfig = firebaseConfig;
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
