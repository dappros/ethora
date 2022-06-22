import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
// import {FlatList} from 'react-native-gesture-handler';
import {useStores} from '../../stores/context';
import {TransactionFilter} from './TransactionFilter';
import {TransactionsListItem} from './TransactionsListItem';
import {compareTransactionsDate} from '../../helpers/transactions/compareTransactionsDate';
import {Box, FlatList} from 'native-base';
import {FILTERS} from '../../constants/transactionsFilter';

const RenderTransactionItem = ({item, transactionOwnerWalletAddress}: any) => {
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
    balance,
  } = item;
  return (
    <TransactionsListItem
      balance={balance}
      transactionValue={value}
      senderWalletAddress={from}
      transactionSender={senderFirstName + ' ' + senderLastName}
      transactionReceiver={receiverFirstName + ' ' + receiverLastName}
      transactionOwnerWalletAddress={transactionOwnerWalletAddress}
      blockNumber={blockNumber}
      transactionHash={transactionHash}
      timestamp={timestamp}
      showDate={showDate}
      formattedDate={formattedDate}
      image={item.nftFileUrl || item.nftPreview}
    />
  );
};

interface TransactionListProps {
  transactions: any;
  walletAddress: string;
  onEndReached: any;
}

const TransactionsList = observer(
  ({transactions, walletAddress, onEndReached}: TransactionListProps) => {
    const [activeFilter, setActiveFilter] = useState(FILTERS.all);
    const getFilteredTransactions = () => {
      if (activeFilter === FILTERS.all) {
        return transactions;
      }
      if (activeFilter === FILTERS.sent) {
        const filteredTransactions = transactions.filter(
          (item: any) => item.from === walletAddress,
        );
        return filteredTransactions;
      }

      if (activeFilter === FILTERS.received) {
        const filteredTransactions = transactions.filter(
          (item: any) => item.to === walletAddress,
        );
        return filteredTransactions;
      }
    };

    return (
      <Box>
        <TransactionFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <FlatList
          height={'100%'}
          scrollEnabled
          style={{paddingBottom: 50}}
          renderItem={({item}) => (
            <RenderTransactionItem
              item={item}
              transactionOwnerWalletAddress={walletAddress}
            />
          )}
          onEndReached={onEndReached}
          data={compareTransactionsDate(getFilteredTransactions())}
          keyExtractor={item => item.transactionHash}
        />
      </Box>
    );
  },
);

export default TransactionsList;
