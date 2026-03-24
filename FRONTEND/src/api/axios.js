import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true, // send cookies for JWT auth
});

// Intercept responses — on 401, attempt a token refresh once
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await api.post('/users/refresh-token');
                return api(originalRequest);
            } catch {
                // Refresh failed — user must log in again
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
