import React, { useState, useEffect } from 'react';
import { Film, Loader2 } from 'lucide-react';
import { getAllVideos } from '../api/video.api';
import { Link } from 'react-router-dom';

const formatViews = (n) => {
    if (!n) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
};

const Movies = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                // Filter by 'movie' query — falls back to all videos if backend has no category
                const res = await getAllVideos({ query: 'movie', limit: 30, sortBy: 'views', sortType: 'desc' });
                const data = res.data?.data || [];
                setVideos(data.length > 0 ? data : (await getAllVideos({ limit: 30, sortBy: 'views', sortType: 'desc' })).data?.data || []);
            } catch { setVideos([]); } finally { setLoading(false); }
        };
        fetch();
    }, []);

    return (
        <div className="p-4 md:p-8 w-full max-w-[1800px] mx-auto pb-20">
            <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Film size={24} className="text-accent-primary" /> Movies & Long-form Content
            </h1>

            {loading ? (
                <div className="flex justify-center py-24"><Loader2 className="animate-spin text-accent-primary" size={36} /></div>
            ) : videos.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-text-secondary">
                    <div className="text-5xl mb-4">🎬</div>
                    <p className="text-lg">No movies found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                    {videos.map(video => (
                        <div key={video._id} className="group flex flex-col gap-3 cursor-pointer">
                            <Link to={`/watch/${video._id}`} className="relative block aspect-video rounded-xl overflow-hidden bg-surface-elevated border border-white/5 group-hover:border-white/20 transition-colors">
                                <img src={video.thumbnail || 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop'} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </Link>
                            <h3 className="text-sm font-semibold text-white line-clamp-2 px-1 group-hover:text-accent-glow transition-colors"><Link to={`/watch/${video._id}`}>{video.title}</Link></h3>
                            <div className="text-xs text-muted px-1">{formatViews(video.views)} views</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Movies;
