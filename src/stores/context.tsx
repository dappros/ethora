import React, {createContext, useContext} from 'react';
import {AccountStore} from './accountStore';
import {ApiStore} from './apiStore';
import {ChatStore} from './chatStore';
import {DebugStore} from './debugStore';
import {LoginStore} from './loginStore';
import {WalletStore} from './walletStore';

const StoreContext = createContext<RootStore>(null);

export class RootStore {
    accountStore: AccountStore;
    apiStore: ApiStore;
    chatStore: ChatStore;
    debugStore: DebugStore;
    loginStore: LoginStore;
    walletStore: WalletStore;
    constructor(){
        this.accountStore = new AccountStore(this);
        this.apiStore = new ApiStore(this);
        this.chatStore = new ChatStore(this);
        this.debugStore = new DebugStore(this);
        this.loginStore = new LoginStore(this);
        this.walletStore = new WalletStore(this);
    }
}

const rootStore = new RootStore();
export const StoreProvider = ({children}:any) => {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
};

export const useStores = () => useContext(StoreContext);