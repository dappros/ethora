import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {useStores} from '../../stores/context';
import {TransactionFilter} from './TransactionFilter';
import {TransactionsListItem} from './TransactionsListItem';
import {compareTransactionsDate} from '../../helpers/compareTransactionsDate';
import {Box} from 'native-base';
import { FILTERS } from '../../constants/transactionsFilter';

const RenderTransactionItem = ({item, transactionOwnerWalletAddress}:any) => {
  const {
    tokenId,
    from,
    to,
    tokenName,
    value,
    type,
    timestamp,
    senderFirstName,
    senderLastName,
    receiverFirstName,
    receiverLastName,
    senderBalance,
    receiverBalance,
    createdAt,
    updatedAt,
    blockNumber,
    transactionHash,
    fromFirstName,
    fromLastName,
    toFirstName,
    toLastName,
    showDate,
    formattedDate,
  } = item;
  return (
    <TransactionsListItem
      transactionValue={value}
      receiverWalletAddress={to}
      senderWalletAddress={from}
      receiverBalance={receiverBalance}
      senderbalance={senderBalance}
      transactionSender={senderFirstName + ' ' + senderLastName}
      transactionReceiver={receiverFirstName + ' ' + receiverLastName}
      transactionOwnerWalletAddress={transactionOwnerWalletAddress}
      item={item}
      showDate={showDate}
      formattedDate={formattedDate}
    />
  );
};

const TransactionsList = observer(
  ({boxHeight = '100%', transactions}:any) => {
    const {loginStore} = useStores();
    const [activeFilter, setActiveFilter] = useState('all');

    const getFilteredTransactions = () => {
      if (activeFilter === FILTERS.all) {
        return transactions;
      }
      if (activeFilter === FILTERS.sent) {
        const filteredTransactions = transactions.filter(
          (item:any) => item.from === loginStore.walletAddress,
        );
        return filteredTransactions;
      }

      const filteredTransactions = transactions.filter(
        (item:any) => item.to === loginStore.walletAddress,
      );
      return filteredTransactions;
    };

    return (
      <Box h={boxHeight}>
        <TransactionFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <FlatList
          renderItem={({item}) => (
            <RenderTransactionItem
              item={item}
              transactionOwnerWalletAddress={loginStore.walletAddress}
              // showHeaderDate={}
            />
          )}
          data={compareTransactionsDate(getFilteredTransactions())}
          keyExtractor={item => item._id}
        />
      </Box>
    );
  },
);

export default TransactionsList;
