import {makeAutoObservable} from 'mobx';
import { httpDelete, httpGet, httpPost } from '../config/apiService';
import { showError, showSuccess } from '../config/toastAction';
import { addOrDeleteEmail, getListOfEmails } from '../config/url';
import { RootStore } from './context';

export class AccountStore{
    isFetching = false
    error = false
    errorMessage = ''  
    emailList = [];
    stores:RootStore;
    defaultUrl = '';

    constructor(stores:RootStore){
        makeAutoObservable(this);
        this.stores = stores;

        // this.defaultUrl = stores.apiStore.defaultUrl;
        // alert(JSON.stringify(this.stores))
    }

    // defaultUrl = this.stores.apiStore.defaultUrl;

    async getEmailList(token:any){
        const url = this.defaultUrl + getListOfEmails;
        this.isFetching = true;
        try{
            const res = await httpGet(url,token);
            this.isFetching = false;
            if(res.data.success){
                this.emailList = res.data.emails;
            }else{
                this.error = true;
                this.errorMessage = res.data;
            }
        }catch(error:any){
            this.isFetching = false;
            this.error = true;
            this.errorMessage = error;
        }
    }

    async addEmailToList(token:any, body:any){
        const url = this.defaultUrl + addOrDeleteEmail;
        this.isFetching = true;
        try{
            const res = await httpPost(url, body, token);
            this.isFetching = false;
            if(res.data.success || res.data === ''){
                this.getEmailList(token);
                showSuccess('success', 'Email added successfully');
            }else{
                this.error = true;
                this.errorMessage = res.data.msg;
            }
        }catch(error:any){
            showError('Error', 'This email already exists');
            this.isFetching = false;
            this.error = true;
            this.errorMessage = error;
        }
    }

    async deletEmailFromList(token:any, email:any){
        const url = this.defaultUrl + addOrDeleteEmail + '/' + email;
        this.isFetching = true
        try {
            const res = await httpDelete(url, token);
            this.isFetching = false;
            if (res.data.success) {
                this.getEmailList(token);
                showSuccess('Success', 'Email deleted successfully');
            } else {
                this.error = true;
                this.errorMessage = res.data.msg
            }
        } catch (error:any) {
            this.isFetching = false;
            this.error = true;
            this.errorMessage = error;
        }
    };
}