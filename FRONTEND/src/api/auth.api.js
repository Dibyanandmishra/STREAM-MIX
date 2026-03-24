import api from './axios';

export const loginUser = (data) => api.post('/user/login', data);
export const registerUser = (formData) => api.post('/user/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const logoutUser = () => api.post('/user/logout');
export const getCurrentUser = () => api.get('/user/current-user');
export const refreshAccessToken = () => api.post('/user/refresh-token');
export const changePassword = (data) => api.post('/user/change-password', data);
export const updateAccountDetails = (data) => api.patch('/user/update-account', data);
export const updateAvatar = (formData) => api.patch('/user/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateCoverImage = (formData) => api.patch('/user/cover-Image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const getChannelProfile = (username) => api.get(`/user/c/${username}`);
export const getWatchHistory = () => api.get('/user/history');
