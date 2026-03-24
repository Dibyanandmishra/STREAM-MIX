import api from './axios';

export const toggleSubscription = (channelId) => api.post(`/subscription/c/${channelId}`);
export const getChannelSubscribers = (channelId) => api.get(`/subscription/u/${channelId}`);
export const getSubscribedChannels = (userId) => api.get(`/subscription/c/${userId}`);
