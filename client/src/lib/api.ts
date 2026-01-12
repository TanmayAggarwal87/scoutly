import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const auth = {
    loginOtp: (email: string, phone: string) => api.post('/auth/login-otp', { email, phone }),
    verifyOtp: (email: string, phone: string, otp: string) => api.post('/auth/verify-otp', { email, phone, otp }),
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    },
};

export const user = {
    getMe: () => api.get('/user/me'),
    updateKeywords: (keywords: string[]) => api.put('/user/keywords', { keywords }),
    updateSources: (sources: string[]) => api.put('/user/sources', { sources }),
};

export const jobs = {
    getAll: () => api.get('/jobs'),
};

export const notifications = {
    getAll: () => api.get('/notifications'),
    markRead: (id: string) => api.put(`/notifications/${id}/read`),
};

export const sources = {
    getAll: () => api.get('/sources'),
    addCustom: (data: any) => api.post('/sources', data),
};

export default api;
