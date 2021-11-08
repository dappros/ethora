import axios from 'axios';

export class ApiService {
  host = '';
  constructor(host, token) {
    this.host = host;
    this.token = token;
    this.http = axios.create({
      baseURL: host,
      headers: {Authorization: token},
    });
  }

  httpGet = async route => {
    try {
      const res = await this.http.get(route);
      return res;
    } catch (error) {
      console.log(error);
    }
  };
  httpPost = async (route, body) => {
    try {
      const res = await this.http.post(route, body);
      return res;
    } catch (error) {
      console.log(error);
    }
  };
}
