import axios from 'axios';

export const httpGet = async (url:string, token:string|null) => {
  return await axios.get(url, {
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })
};

export const httpPost = async (url:string, body:any, token:string) => {
  console.log(body)
  return await axios.post(url, body, {
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })
};

export const httpDelete = async (url, token) => {
  return await axios.delete(url, {
    headers: {
      Authorization: token,
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
    },
  });
};

export const httpUpload = async (url, body, token, onProgress) => {
  return await axios.post(url, body, {
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'multipart/form-data',
      Authorization: token,
    },
    onUploadProgress: ev => {
      const progress = (ev.loaded / ev.total) * 100;
      onProgress(Math.round(progress));
    },
  });
};
