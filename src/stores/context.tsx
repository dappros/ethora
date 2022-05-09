import React, { createContext, useContext } from "react";
import { AccountStore } from "./accountStore";
import { ApiStore } from "./apiStore";
import { ChatStore } from "./chatStore";
import { DebugStore } from "./debugStore";
import { LoginStore } from "./loginStore";
import { OtherUserStore } from "./otherUserStore";
import { TransactionsStore } from "./transactionsStore";
import { WalletStore } from "./walletStore";


export class RootStore{
    loginStore: LoginStore;
    apiStore: ApiStore;
    chatStore: ChatStore;
    otherUserStore: OtherUserStore;
    debugStore: DebugStore;
    walletStore: WalletStore;
    transactionsStore: TransactionsStore;
    accountStore: AccountStore;

    constructor(){
        this.loginStore = new LoginStore(this);
        this.apiStore = new ApiStore();
        this.otherUserStore = new OtherUserStore();
        this.chatStore = new ChatStore(this);
        this.debugStore = new DebugStore(this);
        this.walletStore = new WalletStore(this);
        this.transactionsStore = new TransactionsStore(this);
        this.accountStore = new AccountStore(this);
    }

    resetStore=()=>{
        this.loginStore.setInitialState()
    }
}

const rootStore = new RootStore();

const StoreContext = createContext<RootStore>(rootStore);

export const StoreProvider = ({children}:any) => {
    return (
      <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
    );
};

export const useStores = () => useContext(StoreContext);