import axios from "axios";
const baseURL = 'https://app-dev.dappros.com/v1'
export const http = axios.create({
    baseURL: baseURL
})