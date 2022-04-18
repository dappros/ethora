import {makeAutoObservable} from 'mobx';
import { Alert } from 'react-native';
import { httpGet, httpPost } from '../config/apiService';
import { itemTransferURL, tokenEtherBalanceURL, tokenTransferURL, transactionURL } from '../config/routesConstants';
import { showError } from '../config/toastAction';
import { etherTransferURL } from '../config/url';
import {insertTransaction} from '../components/realmModels/transaction';
import { RootStore } from './context';

export class WalletStore{
    isFetching = false;
    error = false;
    errorMessage = '';
    transactions= [];
    anotherUserTransaction= [];
    anotherUserBalance= [];
    balance= [];
    offset= 0;
    limit= 10;
    total= 0;
    tokenTransferSuccess: {
      success: false,
      senderName: '',
      receiverName: '',
      amount: 0,
      receiverMessageId: '',
      tokenName: ''
    };
    stores:RootStore;
    defaultUrl = ''

    constructor(stores:RootStore){
        makeAutoObservable(this);
        this.stores = stores;
        this.defaultUrl = stores.apiStore.defaultUrl
    }

    async fetchWalletBalance(walletAddress, tokenName, token, isOwn){
        let url = this.defaultUrl + tokenEtherBalanceURL + walletAddress;

        this.isFetching = true;

        try{
            const response = await httpGet(url, token);
            this.isFetching = false;
            this.stores.debugStore.addLogsApi(response.data);
            if(isOwn){
                this.balance = response.data
            }else{
                this.anotherUserBalance = response.data
            }
        }catch(error:any){
            this.stores.debugStore.addLogsApi(error);
            this.isFetching = false;
            this.error = true
            this.errorMessage = error
        }
    }

    async transferTokens(
        bodyData,
        token,
        fromWallet,
        senderName,
        receiverName,
        receiverMessageId,
        itemUrl
    ){
        let url = '';
        if(bodyData.tokenName && !itemUrl){
            url = this.defaultUrl + tokenTransferURL;
        }else if(itemUrl){
            url = this.defaultUrl + itemTransferURL;
        }else{
            url = this.defaultUrl + etherTransferURL;
        }

        if(bodyData.nftId){
            Alert.alert(
                'item transfer',
                `You have successfully sent ${bodyData.tokenName}. After confirming the blockchain transaction, it will appear in the recipient's profile.`,
                [{text: 'Ok', onPress: () => console.log('ok')}],
            )
        }

        this.isFetching = true;

        try{
            const response = await httpPost(url, bodyData, token);
            this.isFetching = false;
            this.stores.debugStore.addLogsApi(response.data);

            if(response.data.success){
                this.tokenTransferSuccess = {
                    success: true,
                    senderName,
                    receiverName,
                    amount: bodyData.amount,
                    receiverMessageId,
                    tokenName: bodyData.tokenName
                }

                this.fetchWalletBalance(fromWallet, null, token, true);
            }else{
                this.error = true;
                this.errorMessage = response.data.msg;
            }
        }catch(error:any){
            this.isFetching = false;
            this.error = true;
            this.errorMessage = error;

            showError('Error', JSON.stringify(error));
        }
    }

    async fetchTransaction(
        walletAddress,
        token,
        isOwn,
        limit: 10,
        offset: 0
    ){
        let url = this.defaultUrl + transactionURL +
        'walletAddress=' +
        walletAddress +
        `&limit=${limit}&offset=${offset}`;

        if(!walletAddress) return;

        try{
            const response = await httpGet(url, token);
            if(response.data.items){
                this.stores.debugStore.addLogsApi(response.data);
                this.offset = this.offset + response.data.limit;
                this.total = response.data.total;
                if(isOwn){
                    this.transactions = [...this.transactions, ...response.data.items];
                    insertTransaction(response.data.items);
                }else{
                    this.anotherUserTransaction = [...this.anotherUserTransaction, ...response.data.items];
                }
            }
        }catch(error){
            this.stores.debugStore.addLogsApi(error)
            this.error = true;
            this.errorMessage = JSON.stringify(error);
        }
    }
}