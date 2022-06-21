import axios from 'axios';
import {rootStore} from '../stores/context';
import {refreshTokenURL} from './routesConstants';

const http = axios.create();

http.interceptors.response.use(undefined, async error => {
  if (error?.response?.status === 401) {
    await rootStore.loginStore.getRefreshToken();

    if (
      error?.request?.responseURL ===
      rootStore.apiStore.defaultUrl + refreshTokenURL
    ) {
      rootStore.loginStore.logOut();
      return Promise.reject(error);
    }
    let request = error.config;
    const token = rootStore.loginStore.userToken;
    request.headers['Authorization'] = token;

    return new Promise(resolve => {
      resolve(http(request));
    });
  }
  return Promise.reject(error);
});

export const httpGet = async (url: string, token: string | null) => {
  return await http.get(url, {
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
};

export const httpPost = async (url: string, body: any, token: string) => {
  console.log(body);
  return await http.post(url, body, {
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
};

export const httpDelete = async (url, token) => {
  return await http.delete(url, {
    headers: {
      Authorization: token,
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
    },
  });
};

export const httpUpload = async (url, body, token, onProgress) => {
  return await http.post(url, body, {
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'multipart/form-data',
      Authorization: token,
    },
    onUploadProgress: ev => {
      const progress = (ev.loaded / ev.total) * 100;
      console.log(ev)
      onProgress(Math.round(progress));
    },
  });
};

export const httpPut = async(url:string, body:any, token:string) => {
  return await axios.put(
    url,
    body,
    {
      headers: {
      Authorization: token,
      'Accept-encoding': 'gzip, deflate',
      }
    },
  )
}
