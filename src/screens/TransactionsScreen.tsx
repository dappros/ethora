import {observer} from 'mobx-react-lite';
import {View} from 'native-base';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import TransactionsList from '../components/Transactions/TransactionsList';
import {useStores} from '../stores/context';

const TransactionsScreen = observer(() => {
  const {walletStore, loginStore} = useStores();
  useEffect(() => {
    walletStore.fetchOwnTransactions(
      loginStore.initialData.walletAddress,
      walletStore.limit,
      0,
    );
    return () => {};
  }, []);

  return (
    <View flex={1} pb={heightPercentageToDP('15%')}>
      <SecondaryHeader title="Transactions" />
      <TransactionsList
        transactions={walletStore.transactions}
        onEndReached={() => {
          if (walletStore.transactions.length < walletStore.total) {
            walletStore.fetchOwnTransactions(
              loginStore.initialData.walletAddress,

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
