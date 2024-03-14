import axios from "axios"
import { config } from "../config"
import { useZustandStore } from "../store_"
import { history } from "../utils/history"

let isRefreshing = false
let failedRequestsQueue = []

export const http = axios.create({
  baseURL: config.API_URL,
})

const addRequestToQueue = (config: any) => {
  return new Promise((resolve, reject) => {
    failedRequestsQueue.push({ resolve, reject, config })
  })
}

// Process the queued requests
const processQueue = (newAccessToken: string) => {
  console.log(failedRequestsQueue)
  for (const request of failedRequestsQueue) {
    if (newAccessToken) {
      // Update the access token in the request header
      request.config.headers["Authorization"] = newAccessToken
    }

    request.resolve(http(request.config))
  }

  failedRequestsQueue = []
}

export function refresh(): Promise<{
  data: { refreshToken: string; token: string }
}> {
  return new Promise((resolve, reject) => {
    const state = useZustandStore.getState()
    http
      .post(
        "/users/login/refresh",
        {},
        { headers: { Authorization: state.user.refreshToken } }
      )
      .then((response) => {
        const {token, refreshToken} = response.data
        useZustandStore.getState().setUserAuthTokens(token, refreshToken)
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const onLogout = () => {
  useZustandStore.getState().clearUser()
  localStorage.clear()
  history.push("/")
}

http.interceptors.response.use(undefined, async (error) => {
  const user = useZustandStore.getState().user
  const request = error.config

  if (user.firstName) {
    if (!error.response || error.response.status !== 401) {
      throw error
    }

    if (
      (error.config.url === "/users/login/refresh" ||
        error.config.url === "/users/login") &&
      !request._retry
    ) {
      onLogout()
      throw error
    }

    request._retry = true
    if (isRefreshing) {
      // Add the request to the queue
      const retryOriginalRequest = addRequestToQueue(request)

      return retryOriginalRequest
    } else {
      isRefreshing = true
      try {
        const tokens = await refresh()
        isRefreshing = false
        request.headers["Authorization"] = tokens.data.token
        processQueue(tokens.data.token)
        return http(request)
      } catch (error) {
        isRefreshing = false
        return Promise.reject(error)
      }
    }
  }
  throw error
})
