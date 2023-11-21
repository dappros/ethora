/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from "react"
import { observer } from "mobx-react-lite"

import { NftTransactionItem } from "../Transactions/NftTransactionItem"
import { compareTransactionsDate } from "../../helpers/transactions/compareTransactionsDate"
import { Box, FlatList } from "native-base"

const RenderTransactionItem = ({
  transaction,
  transactionOwnerWalletAddress,
}: any) => {
  const {
    from,
    to,
    value,
    type,
    timestamp,
    senderFirstName,
    senderLastName,
    receiverFirstName,
    receiverLastName,
    senderBalance,
    receiverBalance,
    blockNumber,
    transactionHash,
    showDate,
    formattedDate,
    balance,
    nftName,
    nftTotal,
    contractId,
  } = transaction
  const token = JSON.parse(transaction.token || "{}")
  const trait = token?.traits?.[0]?.[+contractId - 1]
  const cost = token?.costs?.[+contractId - 1]
  return (
    <NftTransactionItem
      // historyItemTotal={}
      from={from}
      to={to}
      balance={balance}
      senderBalance={senderBalance}
      receiverBalance={receiverBalance}
      transactionAmount={value}
      transactionSender={senderFirstName + " " + senderLastName}
      transactionReceiver={receiverFirstName + " " + receiverLastName}
      blockNumber={blockNumber}
      transactionHash={transactionHash}
      timestamp={timestamp}
      showDate={showDate}
      formattedDate={formattedDate}
      senderName={senderFirstName + " " + senderLastName}
      receiverName={receiverFirstName + " " + receiverLastName}
      tokenName={nftName}
      transactionOwnerWalletAddress={transactionOwnerWalletAddress}
      type={type}
      nftTotal={nftTotal}
      value={value}
      contractId={contractId}
      trait={trait}
      cost={cost}
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
    return (
      <Box>
        <FlatList
          height={"100%"}
          scrollEnabled
          style={{ paddingBottom: 50 }}
          renderItem={(transaction) => (
            <RenderTransactionItem
              transaction={transaction.item}
              transactionOwnerWalletAddress={walletAddress}
            />
          )}
          onEndReached={onEndReached}
          data={compareTransactionsDate(transactions)}
          keyExtractor={(transaction: any) => transaction.transactionHash}
        />
      </Box>
    )
  }
)

export default TransactionsList
