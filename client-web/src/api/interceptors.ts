import axios from "axios";
import { config } from "../config";
import { useStoreState } from "../store";
import { history } from "../utils/history";
import xmpp from "../xmpp";

let isRefreshing = false;
let failedRequestsQueue = [];
export const http = axios.create({
    baseURL: config.API_URL,
  });
  
const addRequestToQueue = (config: any) => {
  return new Promise((resolve, reject) => {
    failedRequestsQueue.push({ resolve, reject, config });
  });
};

// Process the queued requests
const processQueue = (newAccessToken: string) => {
    console.log(failedRequestsQueue)
  failedRequestsQueue.forEach((request) => {
    if (newAccessToken) {
      // Update the access token in the request header
      request.config.headers["Authorization"] = newAccessToken;
    }

    request.resolve(http(request.config));
  });

  failedRequestsQueue = [];
};

export function refresh(): Promise<{
  data: { refreshToken: string; token: string };
}> {
  return new Promise((resolve, reject) => {
    const state = useStoreState.getState();
    http
      .post(
        "/users/login/refresh",
        {},
        { headers: { Authorization: state.user.refreshToken } }
      )
      .then((response) => {
        useStoreState.setState((state) => {
          state.user.token = response.data.token;
          state.user.refreshToken = response.data.refreshToken;

          resolve(response);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}
const onLogout = () => {
  useStoreState.getState().clearUser();
  xmpp.stop();
  localStorage.clear();
  history.push("/");
};

http.interceptors.response.use(undefined, async (error) => {
  const user = useStoreState.getState().user;
  const request = error.config;

  if (user.firstName) {
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (
      (error.config.url === "/users/login/refresh" ||
        error.config.url === "/users/login") &&
      !request._retry
    ) {
      onLogout();
      return Promise.reject(error);
    }

    request._retry = true;
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const tokens = await refresh();
        isRefreshing = false;
        request.headers["Authorization"] = tokens.data.token;
        processQueue(tokens.data.token);
        return http(request);
      } catch (error) {
        isRefreshing = false;
        return Promise.reject(error);
      }
    } else {
      // Add the request to the queue
      const retryOriginalRequest = addRequestToQueue(request);

      return retryOriginalRequest;
    }
  }
  return Promise.reject(error);
});
