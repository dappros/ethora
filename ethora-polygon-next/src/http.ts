import axios from 'axios'
import { config } from './constants/config'

const _httpClient = axios.create({
  baseURL: config.apiUrl
})

export const httpClient = _httpClient