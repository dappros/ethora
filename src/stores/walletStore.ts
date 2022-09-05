import {makeAutoObservable, runInAction} from 'mobx';
import {Alert} from 'react-native';
import {httpGet, httpPost} from '../config/apiService';
import {
  etherTransferURL,
  itemTransferURL,
  nfmtTransferURL,
  tokenEtherBalanceURL,
  tokenTransferURL,
  transactionURL,
} from '../config/routesConstants';
import {
  addTransaction,
  getTransaction,
  queryAllTransactions,
  insertTransaction,
} from '../components/realmModels/transaction';
import {RootStore} from './context';
import {coinsMainName, commonColors} from '../../docs/config';
import {showToast} from '../components/Toast/toast';
import {weiToNormalUnits} from '../helpers/weiToNormalUnits';

export const NFMT_TYPES = {
  '1': {type: 'free', color: 'chocolate'},
  '2': {type: 'silver', color: 'grey'},
  '3': {type: 'gold', color: 'orange'},
};

export const NFMT_TRAITS = {
  Free: {color: commonColors.primaryDarkColor},
  Silver: {color: 'grey'},
  Gold: {color: 'orange'},
  Bronze: {color: 'chocolate'},
  Rare: {color: 'lightgreen'},
  'Unique!': {color: 'black'},
};

export const mapTransactions = (item, walletAddress) => {
  if (item.tokenId === 'NFT') {
    if (item.from === walletAddress && item.from !== item.to) {
      item.balance = item.senderBalance + '/' + item.nftTotal;
    } else {
      item.balance = item.receiverBalance + '/' + item.nftTotal;
    }

    return item;
  } else if (item.from === walletAddress && item.from !== item.to) {
    item.balance = item.senderBalance;
    return item;
  } else if (item.from === item.to) {
    item.balance = item.receiverBalance;
    return item;
  } else {
    item.balance = item.receiverBalance;
    return item;
  }
};
export const filterNftBalances = item => {
  return (
    (item.tokenType === 'NFT' || item.tokenType === 'NFMT') && item.balance > 0
  );
};
export const filterNfts = item => {
  return (
    item.tokenSymbol !== 'ETHD' &&
    item.tokenType !== 'NFT' &&
    item.tokenType !== 'NFMT'
  );
};

export const produceNfmtItems = (array = []) => {
  const result = [];
  const rareTotal = 20;
  const uniqueTotal = 1;

  for (const item of array) {
    if (item.tokenType === 'NFMT') {
      for (let i = 0; i < item.balances.length; i++) {
        const tokenBalance = item.balances[i];
        const tokenType = +item.contractTokenIds[i];
        const total = item.maxSupplies.find((supply, i) => tokenType === i + 1);
        const traits = item.traits.map(trait =>
          trait.find((el, i) => tokenType === i + 1),
        );
        total < rareTotal && traits.push('Rare');
        total === uniqueTotal && traits.push('Unique!');
        const resItem = {
          ...item,
          balance: tokenBalance,
          nfmtType: tokenType,
          total: total,
          traits,
        };
        +tokenBalance > 0 && result.push(resItem);
      }
    }
  }
  return result;
};

export const generateCollections = item => {
  const total = item.maxSupplies.reduce((acc, item) => (acc += item));
  const minted = item.minted.reduce((acc, item) => (acc += item));
  const costs = item.costs.map(cost => weiToNormalUnits(+cost));
  return {
    ...item,
    isCollection: true,
    total,
    balance: total - minted,
    costs,
    nftId: item._id,
  };
};
export class WalletStore {
  isFetching = false;
  error = false;
  errorMessage = '';
  transactions: any = [];
  anotherUserTransaction: [] = [];
  anotherUserBalance: [] = [];
  anotherUserNfmtCollections: [] = [];
  balance = [];
  offset = 0;
  limit = 10;
  total = 0;
  nftItems = [];
  collections = [];
  tokenTransferSuccess: {
    success: boolean;
    senderName: string;
    receiverName: string;
    amount: number;
    receiverMessageId: string;
    tokenName: string;
  } = {
    success: false,
    senderName: '',
    receiverName: '',
    amount: 0,
    receiverMessageId: '',
    tokenName: '',
  };
  stores: RootStore | {} = {};
  defaultUrl = '';
  coinBalance = 0;

  constructor(stores: RootStore) {
    makeAutoObservable(this);
    this.stores = stores;
    this.defaultUrl = stores.apiStore.defaultUrl;
  }

  setInitialState() {
    runInAction(() => {
      this.isFetching = false;
      this.error = false;
      this.errorMessage = '';
      this.transactions = [];
      this.anotherUserTransaction = [];
      this.collections = [];

      this.anotherUserBalance = [];
      this.anotherUserNfmtCollections = [];
      this.balance = [];
      this.offset = 0;
      this.limit = 10;
      this.total = 0;
      this.nftItems = [];
      this.tokenTransferSuccess = {
        success: false,
        senderName: '',
        receiverName: '',
        amount: 0,
        receiverMessageId: '',
        tokenName: '',
      };
      this.defaultUrl = this.stores.apiStore.defaultUrl;
      this.coinBalance = 0;
    });
  }

  getExternalBalanceMetadata = async items => {
    const externalBalanceNft = [];
    try {
      for (const item of items) {
        const metadata = await httpGet(
          item.tokenUri?.raw.replace('http://', 'https://'),
          '',
        );
        const prefix = 'ipfs://';
        const gateway = 'https://dapprossplatform.mypinata.cloud/ipfs/';
        externalBalanceNft.push({
          balance: item.balance,
          tokenName: item.title || metadata.data?.name || 'Title not found',
          nftFileUrl:
            metadata.data?.image
              .replace('http://', 'https://')
              .replace(prefix, gateway) || '',
          total: item.balance,
          nftId: item.id.tokenId,
          nftMimetype: 'image/png',
          external: true,
        });
      }
      return externalBalanceNft;
    } catch (error) {
      console.log(error?.response, 'dskfljdsfdkslfjlsd');
      return [];
    }
  };

  async fetchWalletBalance(
    walletAddress: string,
    token: string,
    isOwn: boolean,
  ) {
    let url = this.defaultUrl + tokenEtherBalanceURL + walletAddress;
    runInAction(() => {
      this.isFetching = true;
    });

    try {
      const response = await httpGet(url, token);
      runInAction(() => {
        this.isFetching = false;
      });
      this.stores.debugStore.addLogsApi(response.data);
      const extBalance = response.data?.extBalance || [];
      const externalBalanceNft = await this.getExternalBalanceMetadata(
        extBalance,
      );
      if (isOwn) {
        runInAction(() => {
          this.balance = response.data.balance.filter(filterNfts);
          const nfmtItems = produceNfmtItems(response.data.balance);
          this.nftItems = response.data.balance
            .filter(filterNftBalances)
            .concat(nfmtItems)
            .concat(extBalance)

            .reverse();
          this.collections = response.data.nfmtContracts.map(item =>
            generateCollections(item),
          );
          this.coinBalance = response.data.balance
            .filter(filterNfts)
            .map((item: any) => {
              if (item.tokenName === coinsMainName) {
                return item.balance;
              }
            });
        });
      } else {
        runInAction(() => {
          this.anotherUserBalance = response.data.balance;
          this.anotherUserNfmtCollections = response.data.nfmtContracts.map(
            item => generateCollections(item),
          );
        });
      }
    } catch (error: any) {
      runInAction(() => {
        this.stores.debugStore.addLogsApi(error);
        this.isFetching = false;
        this.error = true;
        this.errorMessage = error;
      });
    }
  }

  clearPreviousTransfer = () => {
    runInAction(() => {
      this.tokenTransferSuccess = {
        success: false,
        senderName: '',
        receiverName: '',
        amount: 0,
        receiverMessageId: '',
        tokenName: '',
      };
    });
  };

  async transferTokens(
    bodyData: any,
    token: string,
    fromWallet: string,
    senderName: string,
    receiverName: string,
    receiverMessageId: string,
    itemUrl: string,
  ) {
    let url = '';
    if (bodyData.isNfmt) {
      url = this.defaultUrl + nfmtTransferURL;
    } else if (bodyData.tokenName && !itemUrl) {
      url = this.defaultUrl + tokenTransferURL;
    } else if (itemUrl) {
      url = this.defaultUrl + itemTransferURL;
    } else {
      url = this.defaultUrl + etherTransferURL;
    }

    if (bodyData.nftId) {
      Alert.alert(
        'item transfer',
        `You have successfully sent ${bodyData.tokenName}. After confirming the blockchain transaction, it will appear in the recipient's profile.`,
        [{text: 'Ok', onPress: () => console.log('ok')}],
      );
    }

    runInAction(() => {
      this.isFetching = true;
    });

    try {
      const response = await httpPost(url, bodyData, token);

      runInAction(() => {
        this.isFetching = false;
        this.stores.debugStore.addLogsApi(response.data);
      });

      if (response.data.success) {
        runInAction(() => {
          this.tokenTransferSuccess = {
            success: true,
            senderName,
            receiverName,
            amount: bodyData.amount,
            receiverMessageId,
            tokenName: bodyData.tokenName,
          };
        });

        this.fetchWalletBalance(
          fromWallet,
          this.stores.loginStore.userToken,
          true,
        );
      } else {
        runInAction(() => {
          this.error = true;
          this.errorMessage = response.data.msg;
        });
      }
    } catch (error: any) {
      console.log(error.response);
      runInAction(() => {
        this.isFetching = false;
        this.error = true;
        this.errorMessage = error;
      });

      showToast('error', 'Error', JSON.stringify(error), 'top');
    }
  }

  fetchOwnTransactions = async (
    walletAddress: string,
    limit: string,
    offset: string,
  ) => {
    const url =
      this.defaultUrl +
      transactionURL +
      'walletAddress=' +
      walletAddress +
      `&limit=${limit}&offset=${offset}`;
    if (!walletAddress) {
      return;
    }

    try {
      const response = await httpGet(url, this.stores.loginStore.userToken);
      if (response.data.items) {
        this.stores.debugStore.addLogsApi(response.data);
        this.offset = this.offset + response.data.limit;
        this.total = response.data.total;
        const modifiedTransactions = response.data.items.map(item =>
          mapTransactions(item, walletAddress),
        );
        for (const item of modifiedTransactions) {
          const transaction = await getTransaction(item.transactionHash);
          if (!transaction?.transactionHash) {
            await addTransaction(item);
          }
        }

        this.getCachedTransactions();
      }
    } catch (error) {
      runInAction(() => {
        this.stores.debugStore.addLogsApi(error);
        this.error = true;
        this.errorMessage = JSON.stringify(error);
      });
    }
  };

  getCachedTransactions = async () => {
    const transactions = await queryAllTransactions();
    runInAction(() => {
      this.transactions = transactions.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    });
  };

  async fetchTransaction(
    walletAddress: string,

    limit: number,
    offset: number,
  ) {
    let url =
      this.defaultUrl +
      transactionURL +
      'walletAddress=' +
      walletAddress +
      `&limit=${limit}&offset=${offset}`;
    if (!walletAddress) return;

    try {
      const response = await httpGet(url, null);
      if (response.data.items) {
        this.stores.debugStore.addLogsApi(response.data);
        this.offset = this.offset + response.data.limit;
        this.total = response.data.total;

        runInAction(() => {
          this.anotherUserTransaction = [
            ...this.anotherUserTransaction,
            ...response.data.items,
          ].map(item => mapTransactions(item, walletAddress));
        });
      }
    } catch (error) {
      runInAction(() => {
        this.stores.debugStore.addLogsApi(error);
        this.error = true;
        this.errorMessage = JSON.stringify(error);
      });
    }
  }

  //clear pagination data
  clearPaginationData() {
    runInAction(() => {
      this.offset = 0;
      this.limit = 10;
      this.total = 0;
      this.anotherUserTransaction = [];
    });
  }

  //set the offset for retrieving transaction data
  setOffset(value: number) {
    runInAction(() => {
      this.offset = value;
    });
  }

  setTotal(value: number) {
    runInAction(() => {
      this.total = value;
    });
  }
}
