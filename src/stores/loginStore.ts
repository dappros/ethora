import AsyncStorage from '@react-native-async-storage/async-storage';
import {makeAutoObservable} from 'mobx';
import { LoginManager } from 'react-native-fbsdk-next';
import { saveInitialData, saveUserToken } from '../actions/auth';
import { deleteAllRealm } from '../components/realmModels/allSchemas';
import { httpPost } from '../config/apiService';
import { loginURL } from '../config/routesConstants';
import { setAsyncStore } from '../helpers/setAndGetAsyncStore';
import { RootStore } from './context';

export interface InitialDataProps {
	firstName: string,
	lastName: string,
	walletAddress: string,
	photo: string,
	username: string,
	password: string,
	desc: string,
	xmppPassword: string
}


export class LoginStore {
    isFetching = false;
    loading = false;
    error = false;
    errorMessage = "";
    token = null;
    initialData:InitialDataProps = {
        firstName: '',
        lastName: '',
        walletAddress: '',
        photo: '',
        username: '',
        password: '',
        desc: '',
		xmppPassword: ''
    };
    userDescription = "";
    userAvatar = "";
    anotherUserAvatar = "";
    anotherUserDescription = "";
    anotherUserFirstname = "Loading";
    anotherUserLastname = "...";
    anotherUserLastSeen = {};
    anotherUserWalletAddress = {};
    isPreviousUser = false;
    pushSubscriptionData= {
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
    }
    skipForever= false;
	stores:RootStore

	constructor(stores:RootStore) {
		makeAutoObservable(this);
		this.stores = stores;
	}

	setInitialState(){
	this.isFetching = false;
    this.loading = false;
    this.error = false;
    this.errorMessage = "";
    this.token = null;
    this.initialData = {
        firstName: '',
        lastName: '',
        walletAddress: '',
        photo: '',
        username: '',
        password: '',
        desc: '',
		xmppPassword: ''
    };
    this.userDescription = "";
    this.userAvatar = "";
    this.anotherUserAvatar = "";
    this.anotherUserDescription = "";
    this.anotherUserFirstname = "Loading";
    this.anotherUserLastname = "...";
    this.anotherUserLastSeen = {};
    this.anotherUserWalletAddress = {};
    this.isPreviousUser = false;
    this.pushSubscriptionData= {
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
    }
    this.skipForever= false;
	}


	updateUserProfile(data:any){
		this.userDescription = data.userDescription;
		this.userAvatar = data.userAvatar;
	}

	setOtherUserVcard(data:any){
		this.anotherUserAvatar = data.anotherUserAvatar;
		this.anotherUserDescription = data.anotherUserDescription;
	}

	setOtherUserDetails(data:any){
		this.anotherUserFirstname = data.anotherUserFirstname;
		this.anotherUserLastname = data.anotherUserLastname;
		this.anotherUserLastSeen = data.anotherUserLastSeen;
		this.anotherUserWalletAddress = data.anotherUserWalletAddress;
	}

	async logOut(){
		this.isFetching = true;
		try{
			LoginManager.logOut();
			try{
				await AsyncStorage.clear();
			}catch(e){
				// console.log(e)
			}
			deleteAllRealm();
			this.setInitialState()
		}catch(error:any){
			this.isFetching = false;
			this.error = true;
			this.errorMessage = error
		}
	}

	async loginUser(
		loginType: any, 
		authToken: any, 
		password: any, 
		ssoUserData: { photo: any; }
		){
		const token = this.stores.apiStore.defaultToken;

		let bodyData = {
			"loginType": loginType,
			"authToken": authToken,
		};

		const url = this.stores.apiStore.defaultUrl + loginURL
		this.isFetching = true
		try{
			const response = await httpPost(
			url,
			bodyData,
			token
			);
			if(response.data.success){
				// alert(JSON.stringify(response))

				//save token in async storage
				setAsyncStore(
					response.data.token,
					'token',
					(callback: any) => {
						this.loading = false;
						this.token = callback;
					}
				)

				const photo = ssoUserData.photo;
				let {
					firstName,
					lastName,
					username,
					xmppPassword
				} = response.data.user;

				if(!lastName){
					lastName = firstName.split(' ')[1];
					firstName = firstName.split(' ')[0];
				}

				const {walletAddress} = response.data.user.defaultWallet;

				// save user login details received after login
				setAsyncStore(
					{
						firstName,
						lastName,
						walletAddress,
						photo,
						username,
						password,
						xmppPassword,
					},
					'initialLoginData',
					(callback:any) => {
						this.initialData = callback;
						this.isFetching = false;
					}
				)
			}
			else{
				// alert(JSON.stringify(response))
				this.error = true;
				this.errorMessage = response.data.msg;
			}
		}catch(error:any){
			// alert(JSON.stringify(error));
			this.error = true;
			this.errorMessage = error.response;
		}
	}

	setTokenFromAsyncStorage = () => {
		AsyncStorage.getItem('token')
		.then((data:any) => {
			this.token = data;
		})
	}

}
