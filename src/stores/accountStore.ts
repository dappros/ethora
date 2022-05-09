import {makeAutoObservable, runInAction} from 'mobx';
import { showToast } from '../components/Toast/toast';
import { httpDelete, httpGet, httpPost } from '../config/apiService';
import { addOrDeleteEmail, getListOfEmails } from '../config/routesConstants';
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
    }

    setInitialState(){
        this.isFetching = false;
        this.error = false;
        this.errorMessage = '';
        this.emailList = [];
        this.defaultUrl = '';
    }

    async getEmailList(token:any){
        const url = this.defaultUrl + getListOfEmails;
        runInAction(()=>{
            this.isFetching = true;
        })
        try{
            const res = await httpGet(url,token);
            this.isFetching = false;
            if(res.data.success){
                runInAction(()=>{
                    this.emailList = res.data.emails;
                })
            }else{
                runInAction(()=>{
                    this.error = true;
                    this.errorMessage = res.data;
                })
            }
        }catch(error:any){
            runInAction(()=>{
                this.isFetching = false;
                this.error = true;
                this.errorMessage = error;
            })
        }
    }

    async addEmailToList(token:any, body:any){
        const url = this.defaultUrl + addOrDeleteEmail;
        this.isFetching = true;
        try{
            const res:any = await httpPost(url, body, token);
            this.isFetching = false;
            if(res.data.success || res.data === ''){
                this.getEmailList(token);
                showToast('success','Success', 'This email already exists', 'top');
            }else{
                this.error = true;
                this.errorMessage = res.data.msg;
            }
        }catch(error:any){
            showToast('error','Error', 'This email already exists', 'top');
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
                showToast('success','Success', 'Email deleted successfully', 'top');
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