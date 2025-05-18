import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: "",
  timeout: 1000 * 60 * 5,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosInstance
