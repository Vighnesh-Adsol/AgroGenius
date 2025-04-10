import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
    validateStatus: status => {
        return status >= 200 && status < 500;
    }
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            // Handle unauthorized access
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

