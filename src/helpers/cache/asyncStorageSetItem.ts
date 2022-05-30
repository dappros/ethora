import AsyncStorage from '@react-native-async-storage/async-storage';

export const asyncStorageSetItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log('ERROR: Cannot store item in asyncStorage', e);
  }
};
