import CryptoJS from 'react-native-crypto-js';
import {RSA} from 'react-native-rsa-native';

interface IDataDecryptor {
  cryptoKey: string;
  userPassword: string;
  decryptObject<T extends Record<string, string>>(
    enryptedObject: T,
  ): Promise<T>;
  decryptArray<T extends Record<string, string>>(
    encryptedArray: T[],
  ): Promise<T[] | []>;
  decryptString(message: string): Promise<string>;
}

type TUnencryptedKeys =
  | '_id'
  | 'user_jid'
  | 'creator_jid'
  | 'creator_wallet'
  | 'contractAddress'
  | 'userId'
  | 'createdAt'
  | 'updatedAt'
  | 'ownerId';

const unencryptedKeys: Record<TUnencryptedKeys, TUnencryptedKeys> = {
  _id: '_id',
  user_jid: 'user_jid',
  creator_jid: 'creator_jid',
  creator_wallet: 'creator_wallet',
  contractAddress: 'contractAddress',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  ownerId: 'ownerId',
};

export class DataDecryptor implements IDataDecryptor {
  cryptoKey = '';
  userPassword = '';
  constructor(cryptoKey: string, userPassword: string) {
    this.cryptoKey = cryptoKey;
    this.userPassword = userPassword;
  }

  async decryptArray<T extends Record<string, string>>(
    encryptedArray: T[],
  ): Promise<T[] | []> {
    const result: T[] = [];
    for (const item of encryptedArray) {
      const decryptedObject = await this.decryptObject<T>(item);
      result.push(decryptedObject);
    }
    return result;
  }

  async decryptObject<T extends Record<string, string>>(
    enryptedObject: T,
  ): Promise<T> {
    const entries = Object.entries(enryptedObject);
    const result: string[][] = [];
    for (const item of entries) {
      if (!(item[0] in unencryptedKeys)) {
        const decryptedMessage = await this.decryptString(item[1]);
        item[1] = decryptedMessage;
      }
      result.push(item);
    }
    return Object.fromEntries(result);
  }

  async decryptString(message: string): Promise<string> {
    try {
      const privatePem = CryptoJS.AES.decrypt(
        this.cryptoKey,
        this.userPassword,
      ).toString(CryptoJS.enc.Utf8);
      const decryptedData = await RSA.decrypt(message, privatePem);
      return decryptedData;
    } catch (error) {
      return '';
    }
  }
}

export async function decryptObject<T extends Record<string, string>>(
  enryptedObject: T,
  cryptoKey: string,
  userPassword: string,
): Promise<T> {
  const entries = Object.entries(enryptedObject);
  const result: string[][] = [];
  for (const item of entries) {
    if (!(item[0] in unencryptedKeys)) {
      const decryptedMessage = await decryptString(
        item[1],
        cryptoKey,
        userPassword,
      );
      item[1] = decryptedMessage;
    }
    result.push(item);
  }
  return Object.fromEntries(result);
}

async function decryptString(
  message: string = '',
  cryptoKey: string,
  userPassword: string,
): Promise<string> {
  try {
    const privatePem = CryptoJS.AES.decrypt(cryptoKey, userPassword).toString(
      CryptoJS.enc.Utf8,
    );
    const decryptedData = await RSA.decrypt(message, privatePem);
    return decryptedData;
  } catch (error) {
    return '';
  }
}

export async function decryptArray<T extends Record<string, string>>(
  encryptedArray: T[],
  cryptoKey: string = '',
  userPassword: string = '',
): Promise<T[] | []> {
  const result: T[] = [];
  for (const item of encryptedArray) {
    const decryptedObject = await decryptObject<T>(
      item,
      cryptoKey,
      userPassword,
    );
    result.push(decryptedObject);
  }
  return result;
}
