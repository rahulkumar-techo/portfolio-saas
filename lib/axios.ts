/**
 * Axios Instance
 * Centralized API config
 */

import axios from "axios"

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
})

export default api