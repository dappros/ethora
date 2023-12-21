import CryptoJS from "react-native-crypto-js"
import { RSA } from "react-native-rsa-native"

type TEncryptedObject = Record<string, string | string[] | any>

interface IDataDecryptor {
  cryptoKey: string
  userPassword: string
  decryptObject<T extends TEncryptedObject>(enryptedObject: T): Promise<T>
  decryptObjectsArray<T extends Record<string, string>>(
    encryptedArray: T[]
  ): Promise<T[] | []>
  decryptStringsArray(encryptedArray: string[]): Promise<string[]>
  decryptString(message: string): Promise<string>
}
type TUnencryptedKeys =
  | "_id"
  | "user_jid"
  | "creator_jid"
  | "creator_wallet"
  | "contractAddress"
  | "userId"
  | "createdAt"
  | "updatedAt"
  | "ownerId"

const unencryptedKeys: Record<TUnencryptedKeys, TUnencryptedKeys> = {
  _id: "_id",
  user_jid: "user_jid",
  creator_jid: "creator_jid",
  creator_wallet: "creator_wallet",
  contractAddress: "contractAddress",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ownerId: "ownerId",
}

export class DataDecryptor implements IDataDecryptor {
  cryptoKey = ""
  userPassword = ""
  constructor(cryptoKey: string, userPassword: string) {
    this.cryptoKey = cryptoKey
    this.userPassword = userPassword
  }

  async decryptObjectsArray<T extends TEncryptedObject>(
    encryptedArray: T[]
  ): Promise<T[]> {
    const result: T[] = []
    for (const item of encryptedArray) {
      const decryptedObject = await this.decryptObject<T>(item)
      result.push(decryptedObject)
    }
    return result
  }

  async decryptStringsArray(encryptedArray: string[]): Promise<string[]> {
    const result: string[] = []
    for (const item of encryptedArray) {
      const decryptedObject = await this.decryptString(item)
      result.push(decryptedObject)
    }
    return result
  }
  async checkMessageType<
    T extends string | string[] | TEncryptedObject | TEncryptedObject[],
  >(
    message: T
  ): Promise<string | string[] | TEncryptedObject | TEncryptedObject[]> {
    if (Array.isArray(message) && typeof message[0] === "object") {
      return await this.decryptObjectsArray<TEncryptedObject>(
        message as TEncryptedObject[]
      )
    }
    if (Array.isArray(message)) {
      return await this.decryptStringsArray(message)
    }
    if (typeof message === "string") {
      return await this.decryptString(message)
    }
    return await this.decryptObject(message)
  }
  async decryptObject<T extends TEncryptedObject>(
    encryptedObject: T
  ): Promise<T> {
    const entries: [string, any][] = Object.entries(encryptedObject)
    const result = []
    for (const item of entries) {
      if (!(item[0] in unencryptedKeys)) {
        const decryptedMessage = await this.checkMessageType(item[1])
        item[1] = decryptedMessage
      }
      result.push(item)
    }
    return Object.fromEntries(result) as T
  }

  async decryptString(message: string): Promise<string> {
    try {
      const privatePem = CryptoJS.AES.decrypt(
        this.cryptoKey,
        this.userPassword
      ).toString(CryptoJS.enc.Utf8)
      const decryptedData = await RSA.decrypt(message, privatePem)
      return decryptedData
    } catch (error) {
      return ""
    }
  }
}
