import api from './axios';

export const getVideoComments = (videoId, params = {}) => api.get(`/comment/${videoId}`, { params });
export const addComment = (videoId, content) => api.post(`/comment/${videoId}`, { content });
export const updateComment = (commentId, content) => api.patch(`/comment/c/${commentId}`, { content });
export const deleteComment = (commentId) => api.delete(`/comment/c/${commentId}`);
