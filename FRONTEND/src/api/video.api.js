import api from './axios';

export const getAllVideos = (params = {}) => api.get('/video', { params });
export const getVideoById = (videoId) => api.get(`/video/${videoId}`);
export const publishVideo = (formData) => api.post('/video', formData);
export const updateVideoDetails = (videoId, formData) => api.patch(`/video/${videoId}`, formData);
export const deleteVideo = (videoId) => api.delete(`/video/${videoId}`);
export const togglePublishStatus = (videoId) => api.patch(`/video/toggle/publish/${videoId}`);
