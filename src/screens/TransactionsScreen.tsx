import {observer} from 'mobx-react-lite';
import {View} from 'native-base';
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
      walletStore.limit,
      walletStore.offset,
    );
    return () => {};
  }, []);

  return (
    <View flex={1}>
      <SecondaryHeader title="Transactions" />
      <TransactionsList
        transactions={walletStore.transactions.slice().reverse()}
        onEndReached={() => {
          if (walletStore.transactions.length < walletStore.total) {
            walletStore.fetchTransaction(
              loginStore.initialData.walletAddress,
              loginStore.userToken,
              true,
              walletStore.limit,
              walletStore.offset,
            );
          }
        }}
        walletAddress={loginStore.initialData.walletAddress}
      />
    </View>
  );
});

export default TransactionsScreen;
