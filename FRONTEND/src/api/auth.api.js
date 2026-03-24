import api from './axios';

export const loginUser = (data) => api.post('/users/login', data);
export const registerUser = (formData) => api.post('/users/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const logoutUser = () => api.post('/users/logout');
export const getCurrentUser = () => api.get('/users/current-user');
export const refreshAccessToken = () => api.post('/users/refresh-token');
export const changePassword = (data) => api.post('/users/change-password', data);
export const updateAccountDetails = (data) => api.patch('/users/update-account', data);
export const updateAvatar = (formData) => api.patch('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateCoverImage = (formData) => api.patch('/users/cover-Image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const getChannelProfile = (username) => api.get(`/users/c/${username}`);
export const getWatchHistory = () => api.get('/users/history');
