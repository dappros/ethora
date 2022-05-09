import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import TransactionsList from '../components/Transactions/TransactionsList';
import {useStores} from '../stores/context';

const TransactionsScreen = observer(() => {
  const {apiStore, transactionsStore} = useStores();
  useEffect(() => {
    apiStore.changeXmpp();

    return () => {};
  }, []);

  return (
    <SafeAreaView>
      <SecondaryHeader title="Transactions" />
      <TransactionsList transactions={transactionsStore.transactions} />
    </SafeAreaView>
  );
});

export default TransactionsScreen;