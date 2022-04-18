import AsyncStorage from "@react-native-async-storage/async-storage";

export const setAsyncStore = (data:any, key:string, callback:any) => {
    AsyncStorage.setItem(key, JSON.stringify(data))
      .then(() => {
        callback(data);
      })
      .catch(error => console.log(error));
};

export const getAsyncStore = (key:string, callback: (arg0: string | null) => void) => {
  AsyncStorage.getItem(key)
  .then(data => {
    callback(data)
  })
}