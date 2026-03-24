import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bell, Loader2 } from 'lucide-react';
import { getChannelProfile } from '../api/auth.api';
import { getAllVideos } from '../api/video.api';
import { toggleSubscription } from '../api/subscription.api';
import { useAuth } from '../context/AuthContext';

const formatViews = (n) => {
    if (!n) return '0';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
};

const Channel = () => {
    const { username } = useParams();
    const { user } = useAuth();
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Videos');
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fetchChannel = async () => {
            setLoading(true);
            try {
                const res = await getChannelProfile(username);
                const data = res.data?.data;
                setChannel(data);
                setIsSubscribed(data?.isSubscribed || false);

                // fetch videos for this channel
                const vRes = await getAllVideos({ userId: data?._id });
                setVideos(vRes.data?.data || []);
            } catch {
                setChannel(null);
            } finally {
                setLoading(false);
            }
        };
        if (username) fetchChannel();
    }, [username]);

    const handleSubscribe = async () => {
        if (!user || !channel?._id) return;
        try {
            await toggleSubscription(channel._id);
            setIsSubscribed(!isSubscribed);
        } catch { /* ignore */ }
    };

    if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-accent-primary" size={40} /></div>;
    if (!channel) return <div className="flex justify-center py-32 text-text-secondary">Channel not found.</div>;

    return (
        <div className="flex flex-col w-full min-h-screen pb-20">
            {/* Banner */}
            <div className="w-full h-[200px] md:h-[280px] relative">
                <img src={channel.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop'} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background-base via-background-base/20 to-transparent"></div>
            </div>

            {/* Channel Header */}
            <div className="px-4 md:px-12 -mt-10 md:-mt-16 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 pb-6 border-b border-white/5">
                <img src={channel.avatar} alt={channel.fullName} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background-base shadow-2xl object-cover" />
                <div className="flex flex-col items-center md:items-start flex-1 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{channel.fullName}</h1>
                    <div className="text-text-secondary text-sm mt-2 flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1">
                        <span className="font-medium text-white">@{channel.username}</span>
                        <span>{channel.subscribersCount || 0} subscribers</span>
                    </div>
                </div>
                {user && user._id !== channel._id && (
                    <button onClick={handleSubscribe}
                        className={`mb-2 px-8 py-2.5 rounded-full font-bold transition-all shadow-lg ${isSubscribed ? 'bg-surface-elevated text-white hover:bg-white/10 border border-white/10 flex items-center gap-2' : 'bg-white hover:bg-gray-200 text-black'}`}>
                        {isSubscribed ? <><Bell size={18} />Subscribed</> : 'Subscribe'}
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="px-4 md:px-12 pt-2 flex items-center gap-8 overflow-x-auto hide-scrollbar border-b border-white/5">
                {['Videos', 'Playlists', 'Community', 'About'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors -mb-px
              ${activeTab === tab ? 'border-white text-white' : 'border-transparent text-text-secondary hover:text-white hover:border-text-secondary'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="px-4 md:px-12 py-8">
                {activeTab === 'Videos' && (
                    <div>
                        {videos.length === 0 ? (
                            <div className="flex flex-col items-center py-20 text-text-secondary">
                                <div className="text-5xl mb-4">🎬</div>
                                <p>No videos uploaded yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
                                {videos.map(video => (
                                    <div key={video._id} className="group flex flex-col gap-3 cursor-pointer">
                                        <Link to={`/watch/${video._id}`} className="relative block aspect-video rounded-xl overflow-hidden bg-surface-elevated border border-white/5 group-hover:border-white/20 transition-colors">
                                            <img src={video.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </Link>
                                        <h3 className="text-sm font-semibold text-white line-clamp-2">{video.title}</h3>
                                        <div className="text-xs text-muted">{formatViews(video.views)} views</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {activeTab !== 'Videos' && (
                    <div className="flex flex-col items-center py-20 text-text-secondary">
                        <p className="text-lg">Content coming soon</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Channel;
