/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { observer } from "mobx-react-lite"
import React, { useState } from "react"
// import {FlatList} from 'react-native-gesture-handler';
// import {useStores} from '../../stores/context';
import { TransactionFilter } from "./TransactionFilter"
import { TransactionsListItem } from "./TransactionsListItem"
import { compareTransactionsDate } from "../../helpers/transactions/compareTransactionsDate"
import { Box, FlatList } from "native-base"
import { FILTERS } from "../../constants/transactionsFilter"
import { appWallets } from "../../../docs/config"

const RenderTransactionItem = ({
  item,
  transactionOwnerWalletAddress,
}: any) => {
  const {
    from,
    to,
    value,
    timestamp,
    senderFirstName,
    senderLastName,
    receiverFirstName,
    receiverLastName,
    blockNumber,
    transactionHash,
    showDate,
    formattedDate,
    balance,
  } = item
  const isApp = appWallets.find((wallet) => wallet === from)
  const name =
    to === transactionOwnerWalletAddress
      ? isApp
        ? senderFirstName
        : senderFirstName + " " + senderLastName
      : receiverFirstName + " " + receiverLastName
  return (
    <TransactionsListItem
      from={from}
      to={to}
      balance={balance}
      transactionAmount={value}
      transactionSender={senderFirstName + " " + senderLastName}
      transactionReceiver={receiverFirstName + " " + receiverLastName}
      blockNumber={blockNumber}
      transactionHash={transactionHash}
      timestamp={timestamp}
      showDate={showDate}
      formattedDate={formattedDate}
      image={item.nftFileUrl || item.nftPreview}
      name={name}
      transactionOwnerWalletAddress={transactionOwnerWalletAddress}
    />
  )
}

interface TransactionListProps {
  transactions: any
  walletAddress: string
  onEndReached: any
}

const TransactionsList = observer(
  ({ transactions, walletAddress, onEndReached }: TransactionListProps) => {
    const [activeFilter, setActiveFilter] = useState(FILTERS.all)
    const getFilteredTransactions = () => {
      if (activeFilter === FILTERS.all) {
        return transactions
      }
      if (activeFilter === FILTERS.sent) {
        const filteredTransactions = transactions.filter(
          (item: any) => item.from === walletAddress
        )
        return filteredTransactions
      }

      if (activeFilter === FILTERS.received) {
        const filteredTransactions = transactions.filter(
          (item: any) => item.to === walletAddress && item.to !== item.from
        )
        return filteredTransactions
      }
    }

    return (
      <Box>
        <TransactionFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <FlatList
          height={"100%"}
          scrollEnabled
          style={{ paddingBottom: 50 }}
          renderItem={({ item }) => (
            <RenderTransactionItem
              item={item}
              transactionOwnerWalletAddress={walletAddress}
            />
          )}
          onEndReached={onEndReached}
          data={compareTransactionsDate(getFilteredTransactions())}
          keyExtractor={(item) => item?.transactionHash}
        />
      </Box>
    )
  }
)

export default TransactionsList
