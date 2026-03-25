import api from './axios';

export const toggleVideoLike = (videoId) => api.post(`/like/toggle/v/${videoId}`);
export const toggleCommentLike = (commentId) => api.post(`/like/toggle/c/${commentId}`);
export const getLikedVideos = () => api.get('/like/videos');
