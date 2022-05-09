import AsyncStorage from '@react-native-async-storage/async-storage';

export const asyncStorageGetItem = async key => {
  try {
    const res = await AsyncStorage.getItem(key);
    if (!res) return '';
    return JSON.parse(res);
  } catch (e) {
    console.log('ERROR: Cannot get item from asyncStorage');
  }
};
