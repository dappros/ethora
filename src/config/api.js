import {Alert} from 'react-native';
let axios = require('axios');
import NetInfo from "@react-native-community/netinfo";

var context;

let errorCodes = [
  {"code":400, "title":"Bad Request", "description":"Your request is invalid and/or not formed properly. You need to reformulate your request."},
  {"code":401, "title":"Session Expired", "description":"Your login credentials have expired. Please login again"},
  {"code":500, "title":"Internal Server Error", "description":"We did something wrong. We'll be notified and we'll look into it"},
  {"code":502, "title":"Bad Gateway", "description":"We did something wrong. We'll be notified and we'll look into it"}
]
export default class ConnectionAPI {
  constructor() {
    context = this;
  }

  checkNetworkState = (callbackState)=>{
    NetInfo.fetch().then(state => {
      console.log(state.isConnected,"thestate")
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      if(state.isConnected){
        callbackState(true)
      }else{
        callbackState(false)
      }
    });
  }


  async fetchGet(url, token, logOut, callback) {

    console.log("asdasfadgd")
    const configAxios = {
      url:url,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      }
    }
    this.checkNetworkState(callbackState =>{
      if(callbackState){
        try{
          axios(configAxios)
          .then(response => {
            callback(response.data)
          })
          .catch(error => {
            console.log(error.response)
            let title = "";
            let description = "";
            switch(error.response.status){
              case errorCodes[0].code:{
                title = errorCodes[0].title;
                description = errorCodes[0].description;
                break;
              }
              case errorCodes[1].code:{
                title = errorCodes[1].title;
                description = errorCodes[1].description;
                break;
              }
              case errorCodes[2].code:{
                title = errorCodes[2].title;
                description = errorCodes[2].description;
                break;
              }
              case errorCodes[3].code:{
                title = errorCodes[3].title;
                description = errorCodes[3].description;
                break;
              }
              default:{
                title = "Something Went wrong";
                description = error.response.message
              }
            }

            if(title === errorCodes[1].title){
              Alert.alert(title, description,[
                {
                  text:"Ok",
                  onPress: () => logOut()
                }
              ])
            }else{
              Alert.alert(title, description, [
                {
                  text:"Cancel",
                  onPress: () => console.log("Cancel")
                },
                {
                  text:"Retry",
                  onPress: () => this.fetchGet(url, token, logOut, callback)
                },
              ])
            }
          })
        }catch(error){
          if(error.message === "Network Error"){
            Alert.alert('No Internet Connection',
            'Connect your phone to the Internet by using an available Wi-Fi or cellular network.',[
              {
                text:"Cancel",
                onPress: () => console.log("Cancel")
              },
              {
                text:"Retry",
                onPress: () => this.fetchGet(url, token, logOut, callback)
              }
            ]
            )
          }
          console.log(error, "FetchGEt error")
        }
      }else{
        Alert.alert('No Internet Connection',
        'Connect your phone to the Internet by using an available Wi-Fi or cellular network.',[
          {
            text:"Cancel",
            onPress: () => console.log("Cancel")
          },
          {
            text:"Retry",
            onPress: () => this.fetchGet(url, token, logOut, callback)
          }
        ]
        )
      }
    })
  }

  async fetchPost(url, data, token, logOut, callback) {
    
    const configAxios = {
      method: 'post',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: JSON.stringify(data),
    };

    this.checkNetworkState(callbackState =>{
      if(callbackState){
        try {
          axios(configAxios)
            .then(function(response) {
              console.log(response);
              callback(response.data);
            })
            .catch(error=>{
              console.log(error.response,"Asdasdasd")
              callback(error.response.data);

              let title = "";
              let description = "";
              switch(error.response.status){
                case errorCodes[0].code:{
                  title = errorCodes[0].title;
                  description = errorCodes[0].description;
                  break;
                }
                case errorCodes[1].code:{
                  title = errorCodes[1].title;
                  description = errorCodes[1].description;
                  break;
                }
                case errorCodes[2].code:{
                  title = errorCodes[2].title;
                  description = errorCodes[2].description;
                  break;
                }
                case errorCodes[3].code:{
                  title = errorCodes[3].title;
                  description = errorCodes[3].description;
                  break;
                }
              }

              if(title === errorCodes[1].title){
                Alert.alert(title, description,[
                  {
                    text:"Ok",
                    onPress: () => logOut()
                  }
                ])
              }else{
                Alert.alert(title, description, [
                  {
                    text:"Cancel",
                    onPress: () => console.log("Cancel")
                  },
                  {
                    text:"Retry",
                    onPress: () => this.fetchPost(url, data, token, logOut, callback)
                  },
                ])
              }
            });
        } catch (error) {
          if(error.message === "Network Error"){
            Alert.alert('No Internet Connection',
            'Connect your phone to the Internet by using an available Wi-Fi or cellular network.',[
              {
                text:"Cancel",
                onPress: () => console.log("Cancel")
              },
              {
                text:"Retry",
                onPress: () => this.fetchPost(url, data, token, logOut, callback)
              }
            ]
            )
          }
          console.log(error, 'Catch Error from api.js fetchpost');
        }
      }else{
        Alert.alert('No Internet Connection',
        'Connect your phone to the Internet by using an available Wi-Fi or cellular network.',[
          {
            text:"Cancel",
            onPress: () => console.log("Cancel")
          },
          {
            text:"Retry",
            onPress: () => this.fetchPost(url, data, token, logOut, callback)
          }
        ]
        )
      }
    })
  }

  async fetchDelete(url, token, logOut, callback) {

    const configAxios = {
      url: url,
      method: 'delete',
      headers: {
        Authorization: token,
      }
    }

    this.checkNetworkState(callbackState =>{
      if(callbackState){
        try{
          axios(configAxios)
          .then(response => {
            callback(response.data);
          })
          .catch(error => {
            let title = "";
            let description = "";
            switch(error.response.status){
              case errorCodes[0].code:{
                title = errorCodes[0].title;
                description = errorCodes[0].description;
                break;
              }
              case errorCodes[1].code:{
                title = errorCodes[1].title;
                description = errorCodes[1].description;
                break;
              }
              case errorCodes[2].code:{
                title = errorCodes[2].title;
                description = errorCodes[2].description;
                break;
              }
              case errorCodes[3].code:{
                title = errorCodes[3].title;
                description = errorCodes[3].description;
                break;
              }
            }

            if(title === errorCodes[1].title){
              Alert.alert(title, description,[
                {
                  text:"Ok",
                  onPress: () => logOut()
                }
              ])
            }else{
              Alert.alert(title, description, [
                {
                  text:"Cancel",
                  onPress: () => console.log("Cancel")
                },
                {
                  text:"Retry",
                  onPress: () => this.fetchDelete(url, token, logOut, callback)
                },
              ])
            }
          })
        }catch(error){
          if(error.message === "Network Error"){
            Alert.alert('No Internet Connection',
            'Connect your phone to the Internet by using an available Wi-Fi or cellular network.',[
              {
                text:"Cancel",
                onPress: () => console.log("Cancel")
              },
              {
                text:"Retry",
                onPress: () => this.fetchDelete(url, token, logOut, callback)
              }
            ]
            )
          }
          console.log(error, "FetchDelete error")
        }
      }else{
        Alert.alert('No Internet Connection',
        'Connect your phone to the Internet by using an available Wi-Fi or cellular network.',[
          {
            text:"Cancel",
            onPress: () => console.log("Cancel")
          },
          {
            text:"Retry",
            onPress: () => this.fetchDelete(url, token, logOut, callback)
          }
        ]
        )
      }
    })
  }

  async fetchHubspotContact(url, logOut, callback){
    const myHeaders = new Headers();
    const configAxios = {
      url: url,
      method: 'get',
      headers: myHeaders
    }
    this.checkNetworkState(callbackState =>{
      if(callbackState){
        try{
          axios(configAxios)
          .then(response => {
            callback(response.data);
          })
          .catch(error => {
            console.log(error.response)
            let title = "";
            let description = "";
            switch(error.response.status){
              case errorCodes[0].code:{
                title = errorCodes[0].title;
                description = errorCodes[0].description;
                break;
              }
              case errorCodes[1].code:{
                title = errorCodes[1].title;
                description = errorCodes[1].description;
                break;
              }
              case errorCodes[2].code:{
                title = errorCodes[2].title;
                description = errorCodes[2].description;
                break;
              }
              case errorCodes[3].code:{
                title = errorCodes[3].title;
                description = errorCodes[3].description;
                break;
              }
              case 404:{
                break;
              }
              default:{
                title = "Something went wrong";
                description = error.response.message
              }
            }

            if(error.response.status === 404){
              callback(false)
            }else if(title === errorCodes[1].title){
              Alert.alert(title, description, [
                {
                  text: "Ok",
                  onPress: () => logOut()
                }
              ])
            }else{
              Alert.alert(title, description, [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel")
                },
                {
                  text: "Retry",
                  onPress: () => this.fetchHubspotContact(url, logOut, callback)
                }
              ])
            }

          })
        }catch(error){
          if(error.message === "Network Error"){
            Alert.alert('No Internet Connection',
            'Connect your phone to the Internet by using an available Wi-Fi or cellular network.',[
              {
                text:"Cancel",
                onPress: () => console.log("Cancel")
              },
              {
                text:"Retry",
                onPress: () => this.fetchHubspotContact(url, token, logOut, callback)
              }
            ]
            )
          }
        }
      }else{
        Alert.alert('No Internet Connection',
        'Connect your phone to the Internet by using an available Wi-Fi or cellular network.',[
          {
            text:"Cancel",
            onPress: () => console.log("Cancel")
          },
          {
            text:"Retry",
            onPress: () => this.fetchHubspotContact(url, logOut, callback)
          }
        ]
        )
      }
    })
  }

  async fileUpload(url, data, token, logOut, updateUploadProgress, callback){
    const configAxios = {
      method: 'post',
      url: url,
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization' : token
      },
      data: data,
      onUploadProgress: (ev) => {
        const progress = ev.loaded / ev.total * 100;
        console.log(progress,"Asdasdasdasd");
        updateUploadProgress(Math.round(progress));
    },
    }
    axios()
    this.checkNetworkState(callbackState =>{
      if(callbackState){
        try {
          axios(configAxios)
            .then(function(response) {
              console.log(response);
              callback(response.data);
            })
            .catch(error=>{
              console.log(error.response,"Asdasdasd")
              callback(error.response.data);

              let title = "";
              let description = "";
              switch(error.response.status){
                case errorCodes[0].code:{
                  title = errorCodes[0].title;
                  description = errorCodes[0].description;
                  break;
                }
                case errorCodes[1].code:{
                  title = errorCodes[1].title;
                  description = errorCodes[1].description;
                  break;
                }
                case errorCodes[2].code:{
                  title = errorCodes[2].title;
                  description = errorCodes[2].description;
                  break;
                }
                case errorCodes[3].code:{
                  title = errorCodes[3].title;
                  description = errorCodes[3].description;
                  break;
                }
              }

              if(title === errorCodes[1].title){
                Alert.alert(title, description,[
                  {
                    text:"Ok",
                    onPress: () => logOut()
                  }
                ])
              }else{
                Alert.alert(title, description, [
                  {
                    text:"Cancel",
                    onPress: () => console.log("Cancel")
                  },
                  {
                    text:"Retry",
                    onPress: () => this.fetchPost(url, data, token, logOut, callback)
                  },
                ])
              }
            });
        } catch (error) {
          if(error.message === "Network Error"){
            Alert.alert('No Internet Connection',
            'Connect your phone to the Internet by using an available Wi-Fi or cellular network.',[
              {
                text:"Cancel",
                onPress: () => console.log("Cancel")
              },
              {
                text:"Retry",
                onPress: () => this.fetchPost(url, data, token, logOut, callback)
              }
            ]
            )
          }
          console.log(error, 'Catch Error from api.js fetchpost');
        }
      }else{
        Alert.alert('No Internet Connection',
        'Connect your phone to the Internet by using an available Wi-Fi or cellular network.',[
          {
            text:"Cancel",
            onPress: () => console.log("Cancel")
          },
          {
            text:"Retry",
            onPress: () => this.fetchPost(url, data, token, logOut, callback)
          }
        ]
        )
      }
    })
  }

}