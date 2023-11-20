import { makeAutoObservable, runInAction } from "mobx"
import { Alert } from "react-native"
import { httpGet, httpPost } from "../config/apiService"
import {
  docsURL,
  etherTransferURL,
  fileUpload,
  itemTransferURL,
  nfmtCollectionTransferURL,
  nfmtTransferURL,
  otherProfileBalance,
  tokenEtherBalanceURL,
  tokenTransferURL,
  transactionURL,
} from "../config/routesConstants"
import {
  addTransaction,
  getTransaction,
  queryAllTransactions,
} from "../components/realmModels/transaction"
import { RootStore } from "./context"
import { coinsMainName, commonColors } from "../../docs/config"
import { showToast } from "../components/Toast/toast"
import { weiToNormalUnits } from "../helpers/weiToNormalUnits"
import { IDocument, ITransation, TBalance } from "./types"

export const NFMT_TYPES = {
  "1": { type: "free", color: "chocolate" },
  "2": { type: "silver", color: "grey" },
  "3": { type: "gold", color: "orange" },
}

export const NFMT_TRAITS = {
  Free: { color: commonColors.primaryDarkColor },
  Silver: { color: "grey" },
  Gold: { color: "orange" },
  Bronze: { color: "chocolate" },
  Rare: { color: "lightgreen" },
  "Unique!": { color: "black" },
  Diamond: { color: commonColors.primaryColor },
  Copper: { color: "brown" },
  Steel: { color: "lightgrey" },
  Paper: { color: "#E0C9A6" },
}

// function to check transaction sender and receiver and modify balances to view them later in the Transaction tab
export const mapTransactions = (item: any, walletAddress: string) => {
  if (item.tokenId === "NFT") {
    if (item.from === walletAddress && item.from !== item.to) {
      item.balance = item.senderBalance + "/" + item.nftTotal
    } else {
      item.balance = item.receiverBalance + "/" + item.nftTotal
    }

    return item
  } else if (item.from === walletAddress && item.from !== item.to) {
    item.balance = item.senderBalance
    return item
  } else if (item.from === item.to) {
    item.balance = item.receiverBalance
    return item
  } else {
    item.balance = item.receiverBalance
    return item
  }
}
// function for filtering coins from NFT or NFMT
export const filterNftBalances = (item: {
  tokenSymbol: string
  tokenType: string
  balance: number
}) => {
  return (
    (item.tokenType === "NFT" || item.tokenType === "NFMT") && item.balance > 0
  )
}
// function for filtering NFT or NFMT from other items like coins
export const filterNfts = (item: {
  tokenSymbol: string
  tokenType: string
}) => {
  return (
    item.tokenSymbol !== "ETHD" &&
    item.tokenType !== "NFT" &&
    item.tokenType !== "NFMT"
  )
}
// function checks if item is NFMT, if so it will check its trait and add its total based on other items of same type

export const produceNfmtItems = (array: any[]) => {
  const result = []
  const rareTotal = 20
  const uniqueTotal = 1

  for (const item of array) {
    if (
      item.tokenType === "NFMT" &&
      item.balances &&
      item.contractTokenIds &&
      item.maxSupplies &&
      item.traits
    ) {
      for (let i = 0; i < item.balances.length; i++) {
        const tokenBalance = item.balances[i]
        const tokenType = +item.contractTokenIds[i]
        const total = item.maxSupplies.find(
          (supply, index) => tokenType === index + 1
        )
        const traits = item.traits.map((trait) =>
          trait.find((el, index) => tokenType === index + 1)
        )
        total && total < rareTotal && traits.push("Rare")
        total && total === uniqueTotal && traits.push("Unique!")
        const resItem = {
          ...item,
          balance: tokenBalance,
          nfmtType: tokenType,
          total: total,
          traits,
        }
        ;+tokenBalance > 0 && result.push(resItem)
      }
    }
  }
  return result
}

// function generates collections based on NFMT item

export const generateCollections = (item: {
  minted: number[]
  maxSupplies: number[]
  costs: number[]
  _id: string
}) => {
  const total = item.maxSupplies.reduce((acc, i) => (acc += i))
  const minted = item.minted.reduce((acc, i) => (acc += i))
  const costs = item.costs.map((cost) => weiToNormalUnits(+cost))
  return {
    ...item,
    isCollection: true,
    total,
    balance: total - minted,
    costs,
    nftId: item._id,
  }
}
export class WalletStore {
  isFetching = false
  error = false
  errorMessage = ""
  transactions: any = []
  anotherUserTransaction: [] = []
  anotherUserBalance: [] = []
  anotherUserNfmtCollections: [] = []
  balance = []
  offset = 0
  limit = 10
  total = 0
  nftItems: TBalance[] = []
  collections = []
  documents: IDocument[] = []
  tokenTransferSuccess: {
    success: boolean
    senderName: string
    receiverName: string
    amount: number
    receiverMessageId: string | null
    tokenName: string
    nftId?: string
    transaction: ITransation | null
  } = {
    success: false,
    senderName: "",
    receiverName: "",
    amount: 0,
    receiverMessageId: "",
    tokenName: "",
    nftId: "",
    transaction: null,
  }
  stores: RootStore
  coinBalance = 0

  constructor(stores: RootStore) {
    makeAutoObservable(this)
    this.stores = stores
  }

  setInitialState() {
    runInAction(() => {
      this.isFetching = false
      this.error = false

      this.transactions = []
      this.anotherUserTransaction = []
      this.collections = []

      this.anotherUserBalance = []
      this.anotherUserNfmtCollections = []
      this.balance = []
      this.offset = 0
      this.limit = 10
      this.total = 0
      this.nftItems = []
      this.tokenTransferSuccess = {
        success: false,
        senderName: "",
        receiverName: "",
        amount: 0,
        receiverMessageId: "",
        tokenName: "",
        nftId: "",
        transaction: null,
      }
      this.coinBalance = 0
    })
  }
  // fetches metadata from external item (Metamask)
  getExternalBalanceMetadata = async (items) => {
    const externalBalanceNft = []
    try {
      for (const item of items) {
        const metadata = await httpGet(
          item.tokenUri?.raw.replace("http://", "https://"),
          ""
        )
        const prefix = "ipfs://"
        const gateway = "https://dapprossplatform.mypinata.cloud/ipfs/"
        externalBalanceNft.push({
          balance: item.balance,
          tokenName: item.title || metadata.data?.name || "Title not found",
          nftFileUrl:
            metadata.data?.image
              .replace("http://", "https://")
              .replace(prefix, gateway) || "",
          total: item.balance,
          nftId: item.id.tokenId,
          nftMimetype: "image/png",
          external: true,
        })
      }
      return externalBalanceNft
    } catch (error) {
      return []
    }
  }
  // fetches user balance (items, coins)
  async fetchWalletBalance(token: string, isOwn: boolean) {
    const url = tokenEtherBalanceURL
    runInAction(() => {
      this.isFetching = true
    })

    try {
      const response = await httpGet(url, token)
      runInAction(() => {
        this.isFetching = false
      })
      this.stores.debugStore.addLogsApi(response.data)
      const extBalance = response.data?.extBalance || []
      // const externalBalanceNft = await this.getExternalBalanceMetadata(
      //   extBalance,
      // );
      if (isOwn) {
        runInAction(() => {
          this.balance = response.data.balance.filter(filterNfts)
          const nfmtItems = produceNfmtItems(response.data.balance)
          this.nftItems = response.data.balance
            .filter(filterNftBalances)
            .concat(nfmtItems)
            .concat(extBalance)

            .reverse()
          this.collections = response.data.nfmtContracts.map((item) =>
            generateCollections(item)
          )
          this.coinBalance = response.data.balance
            .filter(filterNfts)
            .map((item: any) => {
              if (item.tokenName === coinsMainName) {
                return item.balance
              }
            })[0]
        })
      } else {
        runInAction(() => {
          this.anotherUserBalance = response.data.balance
          this.anotherUserNfmtCollections = response.data.nfmtContracts.map(
            (item) => generateCollections(item)
          )
        })
      }
    } catch (error: any) {
      runInAction(() => {
        this.stores.debugStore.addLogsApi(error)
        this.isFetching = false
        this.error = true
        this.errorMessage = error
      })
    }
  }
  setCoinBalance = (newBalance: number) => {
    runInAction(() => {
      this.coinBalance = newBalance
    })
  }
  // fetches other user balance (items, coins)

  async fetchOtherUserWalletBalance(
    walletAddress: string,
    token: string,
    linkToken?: string
  ) {
    const url = otherProfileBalance + walletAddress + "/" + (linkToken || "")
    console.log(url)
    runInAction(() => {
      this.isFetching = true
    })
    try {
      const response = await httpGet(url, token)

      runInAction(() => {
        this.isFetching = false
      })
      this.stores.debugStore.addLogsApi(response.data)
      // const extBalance = response.data?.extBalance || [];

      runInAction(() => {
        this.anotherUserBalance = response.data.balances.balance
        this.anotherUserNfmtCollections =
          response.data.balances.nfmtContracts.map((item) =>
            generateCollections(item)
          )
      })
    } catch (error: any) {
      runInAction(() => {
        this.anotherUserBalance = []
        this.anotherUserNfmtCollections = []
        this.anotherUserNfmtCollections = []
        console.log(this.anotherUserBalance, "error in balanceceees")

        this.stores.debugStore.addLogsApi(error)
        this.isFetching = false
        this.error = true
        this.errorMessage = error
      })
    }
  }
  clearPreviousTransfer = () => {
    runInAction(() => {
      this.tokenTransferSuccess = {
        success: false,
        senderName: "",
        receiverName: "",
        amount: 0,
        receiverMessageId: "",
        tokenName: "",
        nftId: "",
        transaction: null,
      }
    })
  }
  // fetches user documents

  async getDocuments(walletAddress: string) {
    try {
      const docs = await httpGet(
        docsURL + "/" + walletAddress,
        this.stores.loginStore.userToken
      )
      const documents = docs.data.results
      const mappedDocuments = []
      for (const item of documents) {
        try {
          const { data: file } = await httpGet(
            fileUpload + item.files[0],
            this.stores.loginStore.userToken
          )
          item.file = file
          mappedDocuments.push(item)
        } catch (error) {}
      }
      this.documents = mappedDocuments
    } catch (error) {
      console.log(error, "404")
    }
  }
  async transferCollection(
    body: any,
    senderName: string,
    receiverName: string,
    tokenName: string
  ) {
    const response = await httpPost(
      nfmtCollectionTransferURL,
      body,
      this.stores.loginStore.userToken
    )

    if (response.data.success) {
      runInAction(() => {
        this.tokenTransferSuccess = {
          success: true,
          senderName,
          receiverName,
          amount: 1,
          receiverMessageId: "",
          tokenName: tokenName,
          transaction: response.data?.transaction,
        }
      })

      this.fetchWalletBalance(this.stores.loginStore.userToken, true)
    }
  }

  // transfer coins or nft items
  async transferTokens(
    bodyData: any,
    token: string,
    fromWallet: string,
    senderName: string,
    receiverName: string,
    receiverMessageId: string | null,
    itemUrl: boolean
  ) {
    let url = ""
    if (bodyData.isNfmt) {
      url = nfmtTransferURL
    } else if (bodyData.tokenName && !itemUrl) {
      url = tokenTransferURL
    } else if (itemUrl) {
      url = itemTransferURL
    } else {
      url = etherTransferURL
    }

    if (bodyData.nftId) {
      Alert.alert(
        "item transfer",
        `You have successfully sent ${bodyData.tokenName}. After confirming the blockchain transaction, it will appear in the recipient's profile.`,
        [{ text: "Ok", onPress: () => console.log("ok") }]
      )
    }

    runInAction(() => {
      this.isFetching = true
    })

    try {
      const response = await httpPost(url, bodyData, token)

      runInAction(() => {
        this.isFetching = false
        this.stores.debugStore.addLogsApi(response.data)
      })
      if (response.data.success) {
        runInAction(() => {
          this.tokenTransferSuccess = {
            success: true,
            senderName,
            receiverName,
            amount: bodyData.amount,
            receiverMessageId,
            tokenName: bodyData.tokenName,
            nftId: bodyData.nftId || "",
            transaction: response.data?.transaction,
          }
        })

        this.fetchWalletBalance(this.stores.loginStore.userToken, true)
      } else {
        runInAction(() => {
          this.error = true
          this.errorMessage = response.data.msg
        })
      }
    } catch (error: any) {
      console.log(error.response)
      runInAction(() => {
        this.isFetching = false
        this.error = true
        this.errorMessage = error
      })

      showToast("error", "Error", JSON.stringify(error), "top")
    }
  }

  fetchOwnTransactions = async (
    walletAddress: string,
    limit: number | string,
    offset: number | string
  ) => {
    const url =
      transactionURL +
      "walletAddress=" +
      walletAddress +
      `&limit=${limit}&offset=${offset}`
    if (!walletAddress) {
      return
    }

    try {
      const response = await httpGet(url, this.stores.loginStore.userToken)
      if (response.data.items) {
        this.stores.debugStore.addLogsApi(response.data)
        runInAction(() => {
          this.offset = this.offset + response.data.limit
          this.total = response.data.total
        })
        const modifiedTransactions = response.data.items.map((item) =>
          mapTransactions(item, walletAddress)
        )
        for (const item of modifiedTransactions) {
          const transaction = await getTransaction(item.transactionHash)
          if (!transaction?.transactionHash) {
            await addTransaction(item)
          }
        }

        this.getCachedTransactions()
      }
    } catch (error) {
      runInAction(() => {
        this.stores.debugStore.addLogsApi(error)
        this.error = true
        this.errorMessage = JSON.stringify(error)
      })
    }
  }

  getCachedTransactions = async () => {
    const transactions = await queryAllTransactions()
    runInAction(() => {
      this.transactions = transactions.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    })
  }

  async fetchTransaction(
    walletAddress: string,

    limit: number,
    offset: number
  ) {
    const url =
      transactionURL +
      "walletAddress=" +
      walletAddress +
      `&limit=${limit}&offset=${offset}`
    if (!walletAddress) return

    try {
      const response = await httpGet(url, null)
      if (response.data.items) {
        this.stores.debugStore.addLogsApi(response.data)

        runInAction(() => {
          this.offset = this.offset + response.data.limit
          this.total = response.data.total
          this.anotherUserTransaction = response.data.items.map((item) =>
            mapTransactions(item, walletAddress)
          )
        })
      }
    } catch (error) {
      runInAction(() => {
        this.stores.debugStore.addLogsApi(error)
        this.error = true
        this.errorMessage = JSON.stringify(error)
      })
    }
  }

  //clear pagination data
  clearPaginationData() {
    runInAction(() => {
      this.offset = 0
      this.limit = 10
      this.total = 0
      this.anotherUserTransaction = []
    })
  }

  //set the offset for retrieving transaction data
  setOffset(value: number) {
    runInAction(() => {
      this.offset = value
    })
  }

  setTotal(value: number) {
    runInAction(() => {
      this.total = value
    })
  }
}
