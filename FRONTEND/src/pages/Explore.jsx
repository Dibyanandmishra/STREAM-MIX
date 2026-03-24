import React, { useState, useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';
import { getAllVideos } from '../api/video.api';
import { Link } from 'react-router-dom';

const formatViews = (n) => {
    if (!n) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
};

const VideoCard = ({ video }) => (
    <div className="group flex flex-col gap-3 cursor-pointer">
        <Link to={`/watch/${video._id}`} className="relative block aspect-video rounded-xl overflow-hidden bg-surface-elevated border border-white/5 group-hover:border-white/20 transition-colors">
            <img src={video.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'} alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-accent-primary/80 flex items-center justify-center">
                    <svg className="text-white ml-1" fill="white" viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14l11-7z" /></svg>
                </div>
            </div>
        </Link>
        <div className="flex gap-3 px-1">
            <Link to={`/channel/${video.owner?.username}`} className="flex-shrink-0">
                <img src={video.owner?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'}
                    alt="" className="w-9 h-9 rounded-full object-cover border border-white/10" />
            </Link>
            <div className="flex flex-col flex-grow min-w-0">
                <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight group-hover:text-accent-glow transition-colors">
                    <Link to={`/watch/${video._id}`}>{video.title}</Link>
                </h3>
                <Link to={`/channel/${video.owner?.username}`} className="text-sm text-text-secondary hover:text-white transition-colors mt-0.5 truncate">
                    {video.owner?.fullName || video.owner?.username}
                </Link>
                <div className="text-xs text-muted mt-0.5">{formatViews(video.views)} views</div>
            </div>
        </div>
    </div>
);

const Explore = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await getAllVideos({ limit: 50 });
                const data = res.data?.data || [];
                setVideos(data);
                setFiltered(data);
            } catch { setVideos([]); } finally { setLoading(false); }
        };
        fetchVideos();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) { setFiltered(videos); return; }
        setFiltered(videos.filter(v => v.title?.toLowerCase().includes(searchQuery.toLowerCase())));
    }, [searchQuery, videos]);

    return (
        <div className="p-4 md:p-8 w-full max-w-[1800px] mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white flex-1">Explore</h1>
                <div className="flex items-center bg-surface rounded-xl border border-white/10 focus-within:border-accent-primary/40 overflow-hidden w-full md:w-80 transition-colors">
                    <Search size={16} className="ml-4 text-muted flex-shrink-0" />
                    <input type="text" placeholder="Search videos..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-white text-sm py-2.5 px-3 outline-none placeholder:text-muted/60" />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-24"><Loader2 className="animate-spin text-accent-primary" size={36} /></div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-text-secondary">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-lg">No videos found{searchQuery ? ` for "${searchQuery}"` : '.'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
                    {filtered.map(video => <VideoCard key={video._id} video={video} />)}
                </div>
            )}
        </div>
    );
};

export default Explore;
