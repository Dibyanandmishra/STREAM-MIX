import React, { useState, useEffect } from 'react';
import { ThumbsUp, Loader2 } from 'lucide-react';
import { getLikedVideos } from '../api/like.api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const formatViews = (n) => {
    if (!n) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
};

const Liked = () => {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const fetch = async () => {
            try {
                const res = await getLikedVideos();
                setVideos(res.data?.data || []);
            } catch { setVideos([]); } finally { setLoading(false); }
        };
        fetch();
    }, [user]);

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-text-secondary">
            <ThumbsUp size={48} className="text-muted" />
            <p className="text-lg">Sign in to see your liked videos</p>
            <Link to="/login" className="px-6 py-2.5 bg-accent-primary text-white font-bold rounded-lg hover:bg-accent-glow transition-colors">Sign In</Link>
        </div>
    );

    if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-accent-primary" size={36} /></div>;

    return (
        <div className="p-4 md:p-8 w-full max-w-[1800px] mx-auto pb-20">
            <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ThumbsUp size={24} className="text-accent-primary fill-accent-primary" /> Liked Videos
            </h1>

            {videos.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-text-secondary">
                    <div className="text-5xl mb-4">👍</div>
                    <p className="text-lg">You haven't liked any videos yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
                    {videos.map(video => (
                        <div key={video._id} className="group flex flex-col gap-3 cursor-pointer">
                            <Link to={`/watch/${video._id}`} className="relative block aspect-video rounded-xl overflow-hidden bg-surface-elevated border border-white/5 group-hover:border-white/20 transition-colors">
                                <img src={video.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </Link>
                            <div className="flex gap-3 px-1">
                                <img src={video.owner?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                                <div className="flex-col min-w-0">
                                    <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-accent-glow transition-colors">
                                        <Link to={`/watch/${video._id}`}>{video.title}</Link>
                                    </h3>
                                    <p className="text-xs text-text-secondary mt-0.5 truncate">{video.owner?.fullName}</p>
                                    <p className="text-xs text-muted">{formatViews(video.views)} views</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Liked;
