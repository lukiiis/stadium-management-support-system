import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://192.168.1.27:7234/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "true"
    },
});

export default axiosInstance;