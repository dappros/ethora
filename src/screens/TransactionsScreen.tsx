import {observer} from 'mobx-react-lite';
import { View } from 'native-base';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import TransactionsList from '../components/Transactions/TransactionsList';
import {useStores} from '../stores/context';

const TransactionsScreen = observer(() => {
  const {walletStore, loginStore} = useStores();
  useEffect(() => {
    walletStore.fetchTransaction(
      loginStore.initialData.walletAddress,
      loginStore.userToken,
      true,
      10,
      0
    )
    return () => {};
  }, []);

  return (
    <View flex={1}>
      <SecondaryHeader title="Transactions" />
      <TransactionsList
      transactions={walletStore.transactions}
      onEndReached={() => {
        if (
          walletStore.transactions.length < walletStore.total
        ) {

          walletStore.fetchTransaction(
            loginStore.initialData.walletAddress,
            loginStore.userToken,
            false,
            walletStore.limit,
            walletStore.offset + walletStore.limit
          )
        }
      }}
      walletAddress={loginStore.initialData.walletAddress}
      />
    </View>
  );
});

export default TransactionsScreen;