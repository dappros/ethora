/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import Realm from "realm"
import { databaseOptions } from "./allSchemas"
import * as schemaTypes from "../../constants/realmConstants"

async function checkTransactionExist(transactionHash, callback) {
  // const realm = new Realm(databaseOptions)
  const realm = await Realm.open(databaseOptions)

  const transactionObject = realm.objects(schemaTypes.TRANSACTION_SCHEMA)
  if (
    Array.from(
      transactionObject.filtered(`transactionHash="${transactionHash}"`)
    ).length > 0
  ) {
    callback(true)
  } else callback(false)
}

export const getTransaction = async (hash) => {
  try {
    const realm = await Realm.open(databaseOptions)
    const transaction = realm.objectForPrimaryKey(
      schemaTypes.TRANSACTION_SCHEMA,
      hash
    )
    return transaction
  } catch (error) {
    return false
  }
}
export const addTransaction = async (transaction) => {
  try {
    const realm = await Realm.open(databaseOptions)
    realm.write(() => {
      realm.create(schemaTypes.TRANSACTION_SCHEMA, transaction)
    })
  } catch (error) {
    console.log(error)
  }
}
export const insertTransaction = (data) =>
  new Promise(async (resolve, reject) => {
    data.map((item) => {
      if (!item.nftTotal) item.nftTotal = "0"
      const data = {
        blockNumber: item.blockNumber ? item.blockNumber : 0,
        from: item.from ? item.from : "N/A",
        fromFirstName: item.fromFirstName ? item.fromFirstName : "N/A",
        fromLastName: item.fromLastName ? item.fromLastName : "N/A",
        toFirstName: item.toFirstName ? item.toFirstName : "N/A",
        toLastName: item.toLastName ? item.toLastName : "N/A",
        timestamp: item.timestamp ? item.timestamp : "N/A",
        to: item.to ? item.to : "N/A",
        tokenId: item.tokenId ? item.tokenId : "N/A",
        tokenName: item.tokenName ? item.tokenName : "N/A",
        transactionHash: item.transactionHash ? item.transactionHash : "N/A",
        type: item.type ? item.type : "N/A",
        value: item.value ? item.value : "N/A",
        nftTotal: item.nftTotal || 0,
        receiverBalance: item.receiverBalance,
        senderBalance: item.senderBalance,
        nftPreview: item.nftPreview ? item.nftPreview : "null",
        nftFileUrl: item.nftFileUrl || "null",
      }
      checkTransactionExist(item.transactionHash, async (callback) => {
        if (!callback) {
          const realm = await Realm.open(databaseOptions)

          const date = new Date(item.timestamp)
          item.timestamp = date
          item.tokenId = item.tokenId === undefined ? "Ether" : item.tokenId
          item.tokenName = !item.tokenName ? "Ether" : item.tokenName
          item.nftPreview = item.nftPreview ? item.nftPreview : "null"
          // const realm = new Realm(databaseOptions)
          realm.write(() => {
            realm.create(schemaTypes.TRANSACTION_SCHEMA, data)
            resolve(true)
          })
        } else {
          return null
        }
      })
    })
  })

export const queryAllTransactions = () =>
  new Promise(async (resolve, reject) => {
    const realm = await Realm.open(databaseOptions)

    // const realm = new Realm(databaseOptions)
    const transactions = realm
      .objects(schemaTypes.TRANSACTION_SCHEMA)
      .filtered(`tokenName!="${" "}" SORT(timestamp ASC)`)
    resolve(Array.from(transactions))
  })
