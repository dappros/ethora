import AsyncStorage from '@react-native-async-storage/async-storage';
import {makeAutoObservable, runInAction, autorun, action} from 'mobx';
import {LoginManager} from 'react-native-fbsdk-next';
import {deleteAllRealm} from '../components/realmModels/allSchemas';
import {httpPost, httpPut} from '../config/apiService';
import {
  loginURL,
  refreshTokenURL,
  registerUserURL,
} from '../config/routesConstants';
import {asyncStorageSetItem} from '../helpers/cache/asyncStorageSetItem';

import {underscoreManipulation} from '../helpers/underscoreLogic';
import {rootStore, RootStore} from './context';
import {asyncStorageGetItem} from '../helpers/cache/asyncStorageGetItem';
import {regularLoginEmail} from '../../docs/config';

export interface InitialDataProps {
  firstName: string;
  lastName: string;
  walletAddress: string;
  photo: string;
  username: string;
  password: string;
  desc: string;
  xmppPassword: string;
  xmppUsername: string;
  _id: string;
  referrerId: string;
  isProfileOpen: boolean;
  isAssetsOpen: boolean;
  email: string;
  cryptoKey?: string;
}
export class LoginStore {
  isFetching: boolean = false;
  loading: boolean = false;
  error: boolean = false;
  errorMessage: string = '';
  initialData: InitialDataProps = {
    firstName: '',
    lastName: '',
    walletAddress: '',
    photo: '',
    username: '',
    password: '',
    desc: '',
    xmppPassword: '',
    xmppUsername: '',
    _id: '',
    referrerId: '',
    isProfileOpen: false,
    isAssetsOpen: false,
    email: '',
    cryptoKey: '',
  };
  userDescription: string = '';
  userAvatar: string = '';
  anotherUserAvatar: string = '';
  anotherUserDescription: string = '';
  anotherUserFirstname: string = 'Loading';
  anotherUserLastname: string = '...';
  anotherUserLastSeen: any = {};
  anotherUserWalletAddress: any = {};
  isPreviousUser: boolean = false;
  pushSubscriptionData: any = {
    ok: false,
    subscription_info: {
      appId: '',
      country: '',
      createdAt: null,
      deviceId: '',
      deviceType: null,
      environment: 'Development',
      expiresAt: null,
      externalId: '',
      id: null,
      isSubscribed: '0',
      jid: null,
      language: 'en',
      lat: '',
      long: '',
      screenName: null,
      timezone: 0,
      updatedAt: 0,
    },
  };
  skipForever: boolean = false;
  stores: RootStore | {} = {};
  userToken: string = '';
  refreshToken: string = '';
  walletAddress: string = '';
  xmppUsername: string = '';

  constructor(stores: RootStore) {
    makeAutoObservable(this);
    this.stores = stores;
  }
  setInitialState = () => {
    runInAction(() => {
      this.isFetching = false;
      this.loading = false;
      this.error = false;
      this.errorMessage = '';
      this.initialData = {
        firstName: '',
        lastName: '',
        walletAddress: '',
        photo: '',
        username: '',
        password: '',
        desc: '',
        xmppPassword: '',
        xmppUsername: '',
        email: '',
        cryptoKey: '',
        _id: '',
        referrerId: '',
        isProfileOpen: true,
        isAssetsOpen: true,
      };
      this.userDescription = '';
      this.userAvatar = '';
      this.anotherUserAvatar = '';
      this.anotherUserDescription = '';
      this.anotherUserFirstname = 'Loading';
      this.anotherUserLastname = '...';
      this.anotherUserLastSeen = {};
      this.anotherUserWalletAddress = {};
      this.isPreviousUser = false;
      this.pushSubscriptionData = {
        ok: false,
        subscription_info: {
          appId: '',
          country: '',
          createdAt: null,
          deviceId: '',
          deviceType: null,
          environment: 'Development',
          expiresAt: null,
          externalId: '',
          id: null,
          isSubscribed: '0',
          jid: null,
          language: 'en',
          lat: '',
          long: '',
          screenName: null,
          timezone: 0,
          updatedAt: 0,
        },
      };
      this.skipForever = false;
      this.userToken = '';
      this.refreshToken = '';
      this.walletAddress = '';
      this.xmppUsername = '';
    });
  };

  updateUserPhotoAndDescription(avatar: string, description: string) {
    runInAction(() => {
      this.userAvatar = avatar;
      this.userDescription = description;
    });
  }

  updateUserName(name: string) {
    runInAction(() => {
      this.initialData.firstName = name.split(' ')[0];
      this.initialData.lastName = name.split(' ')[1];
    });
  }

  setOtherUserVcard(data: any) {
    runInAction(() => {
      this.anotherUserAvatar = data.anotherUserAvatar;
      this.anotherUserDescription = data.anotherUserDescription;
    });
  }

  setOtherUserDetails(data: {
    anotherUserFirstname: string;
    anotherUserLastname: string;
    anotherUserLastSeen?: any;
    anotherUserWalletAddress?: string;
    anotherUserAvatar?: string;
  }) {
    runInAction(() => {
      this.anotherUserFirstname = data.anotherUserFirstname;
      this.anotherUserLastname = data.anotherUserLastname;
      this.anotherUserLastSeen = data.anotherUserLastSeen;
      this.anotherUserWalletAddress = data.anotherUserWalletAddress;
      this.anotherUserAvatar = data.anotherUserAvatar || '';
    });
  }

  async logOut() {
    runInAction(() => {
      this.isFetching = true;
    });
    try {
      LoginManager.logOut();
      try {
        await AsyncStorage.clear();
      } catch (e) {
        // console.log(e)
      }
      deleteAllRealm();
      rootStore.resetStore();
    } catch (error: any) {
      runInAction(() => {
        this.isFetching = false;
        this.error = true;
        this.errorMessage = error;
      });
    }
  }

  getRefreshToken = async () => {
    try {
      const response = await httpPost(
        this.stores.apiStore.defaultUrl + refreshTokenURL,
        {},
        this.refreshToken,
      );
      runInAction(() => {
        this.userToken = response.data.token;
        this.refreshToken = response.data.refreshToken;
      });
      await asyncStorageSetItem('userToken', response.data.token);
      await asyncStorageSetItem('refreshToken', response.data.refreshToken);
    } catch (error) {
      console.log(error);
    }
  };

  regularLogin = async ({username, password}) => {
    const body = regularLoginEmail
      ? {email: username, password}
      : {username, password};
    const response = await httpPost(
      this.stores.apiStore.defaultUrl + loginURL,
      body,
      this.stores.apiStore.defaultToken,
    );
    if (response.data.success) {
      this.loginHandler(response, '');
    }
  };

  loginUser = async (
    loginType: any,
    authToken: any,
    password: any,
    ssoUserData: {photo: any},
  ) => {
    const token = this.stores.apiStore.defaultToken;
    let bodyData = {
      loginType: loginType,
      authToken: authToken,
    };
    runInAction(() => {
      this.isFetching = true;
    });
    const url = this.stores.apiStore.defaultUrl + loginURL;
    try {
      const response: any = await httpPost(url, bodyData, token);
      if (response.data.success) {
        this.loginHandler(response, ssoUserData.photo);
      } else {
        this.error = true;
        this.errorMessage = response.data.msg;
      }
    } catch (error: any) {
      this.error = true;
      this.errorMessage = error.response;
    }
  };

  loginHandler = async (response: any, photo: string) => {
    await asyncStorageSetItem('userToken', response.data.token);
    await asyncStorageSetItem('refreshToken', response.data.refreshToken);
    runInAction(() => {
      this.loading = false;
      this.userToken = response.data.token;
      this.refreshToken = response.data.refreshToken;
    });

    let {
      firstName,
      lastName,
      username,
      password,
      xmppPassword,
      _id,
      isProfileOpen,
      isAssetsOpen,
      email,
      cryptoKey,
    } = response.data.user;

    if (!lastName) {
      lastName = firstName.split(' ')[1];
      firstName = firstName.split(' ')[0];
    }
    const {walletAddress} = response.data.user.defaultWallet;
    const xmppUsername = underscoreManipulation(walletAddress);

    // save user login details received after login
    const dataForStorage = {
      firstName,
      lastName,
      walletAddress,
      photo: photo,
      username,
      password,
      xmppPassword,
      xmppUsername,
      _id,
      referrerId: response.data.referrerId || '',
      isProfileOpen: isProfileOpen,
      isAssetsOpen: isAssetsOpen,
      desc: '',
      email,
      cryptoKey,
    };
    await asyncStorageSetItem('initialLoginData', dataForStorage);
    runInAction(() => {
      this.initialData = dataForStorage;
      this.isFetching = false;
    });
  };

  updateCurrentUser = async (user: any) => {
    let {
      firstName,
      lastName,
      username,
      password,
      xmppPassword,
      _id,
      isProfileOpen,
      isAssetsOpen,
    } = user;
    const {walletAddress} = user.defaultWallet;
    const xmppUsername = underscoreManipulation(walletAddress);

    // save user login details received after login
    const dataForStorage = {
      ...this.initialData,
      firstName,
      lastName,
      walletAddress,
      username,
      password,
      xmppPassword,
      xmppUsername,
      _id,
      isProfileOpen: isProfileOpen,
      isAssetsOpen: isAssetsOpen,
    };
    await asyncStorageSetItem('initialLoginData', dataForStorage);
    runInAction(() => {
      this.initialData = dataForStorage;
      this.isFetching = false;
    });
  };

  loginExternalWallet = async (body: {
    walletAddress: string;
    signature: string;
    msg: string;
    loginType: string;
  }) => {
    const url = this.stores.apiStore.defaultUrl + loginURL;

    try {
      const response = await httpPost(
        url,
        body,
        this.stores.apiStore.defaultToken,
      );
      await this.loginHandler(response, '');
    } catch (error) {
      console.log(error);
    }
  };
  updateInitialData = async (data: InitialDataProps) => {
    try {
      await asyncStorageSetItem('initialLoginData', data);
      runInAction(() => {
        this.initialData = data;
        this.isFetching = false;
      });
    } catch (error) {
      console.log(error);
    }
  };

  setTokenFromAsyncStorage = async () => {
    runInAction(() => {
      this.loading = true;
    });

    const userToken = await asyncStorageGetItem('userToken');
    const refreshToken = await asyncStorageGetItem('refreshToken');

    runInAction(() => {
      this.userToken = userToken;
      this.refreshToken = refreshToken;
      this.loading = false;
    });
  };

  setInitialDetailsFromAsyncStorage = async () => {
    this.isFetching = true;
    await AsyncStorage.getItem('initialLoginData').then(
      action((data: any) => {
        if (data) {
          this.initialData = JSON.parse(data);
        }
        this.isFetching = false;
      }),
    );
  };

  registerUser = async (body: any, ssoUserData: any) => {
    const token = this.stores.apiStore.defaultToken;
    try {
      const url = this.stores.apiStore.defaultUrl + registerUserURL;
      const response: any = await httpPost(url, body, token);
      if (response.data.success) {
        this.loginUser(
          body.loginType,
          body.authToken,
          body.password,
          ssoUserData,
        );
      } else {
        runInAction(() => {
          this.isFetching = false;
          this.error = true;
          this.errorMessage = response.data;
        });
      }
    } catch (error: any) {
      console.log(error, 'sdjfklsdjfjlsdkfj');
      runInAction(() => {
        this.isFetching = false;
        this.error = true;
        this.errorMessage = error;
      });
    }
  };

  registerExternalWalletUser = async (body: {
    walletAddress: string;
    firstName: string;
    lastName: string;
    loginType: string;
    msg: string;
    signature: string;
  }) => {
    const token = this.stores.apiStore.defaultToken;
    try {
      const url = this.stores.apiStore.defaultUrl + registerUserURL;
      const response: any = await httpPost(url, body, token);
      if (response.data.success) {
        this.loginHandler(response, '');
      }
    } catch (error: any) {
      runInAction(() => {
        this.isFetching = false;
        this.error = true;
        this.errorMessage = error;
      });
    }
  };
  //this will first hit dapp api to update user's display name
  //will call updateInitialData which will store the updated data in async store and then in mobx store.
  updateUserDisplayName = async (bodyData: {
    firstName: string;
    lastName: string;
  }) => {
    const fd = new FormData();
    fd.append('firstName', bodyData.firstName);
    fd.append('lastName', bodyData.lastName);

    const url = this.stores.apiStore.defaultUrl + registerUserURL;
    const response: any = await httpPut(url, fd, this.userToken);
    if (response.data.success) {
      const updatedData = {
        ...this.initialData,
        firstName: bodyData.firstName,
        lastName: bodyData.lastName,
      };
      this.updateInitialData(updatedData);
    }
  };
}
