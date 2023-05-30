import axios from "axios";

const url = new URL(window.location.href)
const baseURL = url.origin
export const http = axios.create({
    baseURL: baseURL
})