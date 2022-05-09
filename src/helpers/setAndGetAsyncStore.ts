import AsyncStorage from "@react-native-async-storage/async-storage";

export const setAsyncStore = async(data:any, key:string, callback:any) => {
    await AsyncStorage.setItem(key, JSON.stringify(data))
      .then(() => {
        callback(data);
      })
      .catch(error => console.log(error));
};

export const getAsyncStore = async(key:string, callback: (arg0: string | null) => void) => {
  await AsyncStorage.getItem(key)
  .then(data => {
    callback(data)
  })
}