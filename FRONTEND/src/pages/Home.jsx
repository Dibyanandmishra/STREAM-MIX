import React, { useState, useEffect } from 'react';
import { getAllVideos } from '../api/video.api';
import { Play, Info, Plus, ChevronRight, Loader2, Search as SearchIcon, X } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createPlaylist } from '../api/playlist.api';
import { useAuth } from '../context/AuthContext';

const formatViews = (n) => {
    if (!n) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

const VideoCard = ({ video }) => {
    const thumbnail = video.thumbnail || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop`;
    const channelAvatar = video.owner?.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop`;

    return (
        <div className="group flex flex-col gap-3 cursor-pointer">
            <Link to={`/watch/${video._id}`} className="relative block aspect-video rounded-xl overflow-hidden bg-surface-elevated border border-white/5 group-hover:border-white/20 transition-colors">
                <img src={thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-accent-primary/80 flex items-center justify-center backdrop-blur-md scale-75 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_20px_rgba(229,9,20,0.6)]">
                        <Play className="text-white ml-1 fill-white" size={20} />
                    </div>
                </div>
                {video.duration ? (
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm text-xs font-medium rounded text-white">
                        {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                    </div>
                ) : null}
            </Link>
            <div className="flex gap-3 px-1">
                <Link to={`/channel/${video.owner?.username}`} className="flex-shrink-0">
                    <img src={channelAvatar} alt={video.owner?.fullName} className="w-9 h-9 rounded-full object-cover mt-0.5 border border-white/10 hover:border-white/40 transition-colors" />
                </Link>
                <div className="flex flex-col flex-grow min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2 leading-tight group-hover:text-accent-glow transition-colors">
                        <Link to={`/watch/${video._id}`}>{video.title}</Link>
                    </h3>
                    <Link to={`/channel/${video.owner?.username}`} className="text-sm text-text-secondary hover:text-white transition-colors mt-1 truncate">
                        {video.owner?.fullName || video.owner?.username}
                    </Link>
                    <div className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                        <span>{formatViews(video.views)} views</span>
                        <span className="w-1 h-1 rounded-full bg-muted/50"></span>
                        <span>{formatDate(video.createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VideoRow = ({ title, videos }) => (
    <section className="mb-10 px-4 md:px-8">
        <div className="flex items-center mb-6 group w-fit cursor-pointer">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide group-hover:text-accent-glow transition-colors">{title}</h2>
            <ChevronRight className="text-muted opacity-0 group-hover:opacity-100 group-hover:text-accent-glow transition-all ml-1" size={24} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
            {videos.map(video => <VideoCard key={video._id} video={video} />)}
        </div>
    </section>
);

const BACKDROP = 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroVideo, setHeroVideo] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showMoreInfo, setShowMoreInfo] = useState(false);
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const query = searchParams.get('query');

    // Fetch all videos on mount
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await getAllVideos({ limit: 30 });
                const data = res.data?.data || [];
                setVideos(data);
                if (data.length > 0) setHeroVideo(data[0]);
            } catch {
                setVideos([]);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    // React to search query in URL
    useEffect(() => {
        if (!query) { setSearchResults([]); return; }
        const doSearch = async () => {
            setSearchLoading(true);
            try {
                const res = await getAllVideos({ query, limit: 30 });
                setSearchResults(res.data?.data || []);
            } catch { setSearchResults([]); } finally { setSearchLoading(false); }
        };
        doSearch();
    }, [query]);

    // Smart categorization: use all videos, split into sections
    const trending = videos.slice(0, 5);
    // Recommended: shuffle a bit (use items 2–6 or fall back to available)
    const recommended = videos.length >= 10 ? videos.slice(5, 10) : videos.slice(0, Math.min(videos.length, 5));
    // New Releases: sort by date (already sorted desc from backend), take next 5
    const newReleases = videos.length >= 15 ? videos.slice(10, 15) : videos.slice(0, Math.min(videos.length, 5));

    return (
        <div className="flex flex-col w-full pb-20">
            {/* ============ SEARCH RESULTS VIEW ============ */}
            {query ? (
                <div className="p-4 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <SearchIcon size={22} className="text-accent-primary" />
                        <h1 className="text-xl font-bold text-white">Results for <span className="text-accent-glow">"{query}"</span></h1>
                        <button onClick={() => navigate('/')} className="ml-auto p-2 text-muted hover:text-white rounded-full hover:bg-white/10 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                    {searchLoading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent-primary" size={36} /></div>
                    ) : searchResults.length === 0 ? (
                        <div className="flex flex-col items-center py-20 text-text-secondary">
                            <div className="text-5xl mb-4">🔍</div>
                            <p className="text-lg">No videos found for "{query}"</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                            {searchResults.map(v => <VideoCard key={v._id} video={v} />)}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* ============ HERO BANNER ============ */}
                    <div className="relative w-full h-[60vh] min-h-[500px] max-h-[800px] bg-black mb-8 overflow-hidden rounded-b-2xl shadow-2xl group cursor-pointer">
                        <img
                            src={heroVideo?.thumbnail || BACKDROP}
                            alt={heroVideo?.title || 'Featured'}
                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-[2s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-base via-background-base/50 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-background-base via-background-base/80 to-transparent w-2/3"></div>
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 lg:w-2/3 flex flex-col justify-end h-full">
                            <div className="flex gap-2 mb-4">
                                {['Featured', 'Trending', 'New'].map(g => (
                                    <span key={g} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase border border-white/10">{g}</span>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                                {heroVideo?.title || 'Discover Premium Content'}
                            </h1>
                            <p className="text-lg md:text-xl text-text-secondary w-full md:w-4/5 leading-relaxed mb-8 line-clamp-3">
                                {heroVideo?.description || 'Explore thousands of videos from top creators. Stream, watch, and connect with communities around the world.'}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {heroVideo ? (
                                    <Link to={`/watch/${heroVideo._id}`} className="flex items-center gap-3 px-8 py-3.5 bg-accent-primary hover:bg-accent-glow text-white rounded-lg font-bold text-lg transition-all shadow-[0_0_20px_rgba(229,9,20,0.5)] hover:shadow-[0_0_30px_rgba(255,46,99,0.8)] hover:scale-105">
                                        <Play size={24} className="fill-white" /> Watch Now
                                    </Link>
                                ) : null}
                                {/* More Info → opens mini modal or navigates to watch page */}
                                <button onClick={() => heroVideo ? setShowMoreInfo(true) : null}
                                    className="flex items-center gap-3 px-8 py-3.5 bg-surface-elevated hover:bg-white/20 text-white rounded-lg font-bold text-lg transition-all backdrop-blur border border-white/10 hover:border-white/30">
                                    <Info size={24} /> More Info
                                </button>
                                {/* + (save to playlist) */}
                                <button
                                    onClick={() => {
                                        if (!user) { navigate('/login'); return; }
                                        if (heroVideo) navigate(`/watch/${heroVideo._id}`);
                                    }}
                                    className="hidden sm:flex items-center justify-center w-14 h-14 bg-surface-elevated hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur border border-white/10 hover:border-white/30 hover:text-accent-glow"
                                    title="Add to playlist">
                                    <Plus size={28} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* "More Info" mini modal */}
                    {showMoreInfo && heroVideo && (
                        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowMoreInfo(false)}>
                            <div className="bg-surface rounded-2xl border border-white/10 max-w-lg w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                                {heroVideo.thumbnail && <img src={heroVideo.thumbnail} alt="" className="w-full aspect-video object-cover rounded-xl mb-4" />}
                                <h2 className="text-xl font-bold text-white mb-2">{heroVideo.title}</h2>
                                <p className="text-text-secondary text-sm mb-4 leading-relaxed">{heroVideo.description || 'No description available.'}</p>
                                <div className="text-xs text-muted mb-5">{formatViews(heroVideo.views)} views • by {heroVideo.owner?.fullName}</div>
                                <div className="flex gap-3">
                                    <Link to={`/watch/${heroVideo._id}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent-primary hover:bg-accent-glow text-white font-bold rounded-lg transition-colors">
                                        <Play size={18} className="fill-white" /> Watch Now
                                    </Link>
                                    <button onClick={() => setShowMoreInfo(false)} className="px-5 py-2.5 bg-surface-elevated hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 text-sm">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ============ VIDEO ROWS ============ */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-accent-primary" size={40} />
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="text-6xl mb-4">🎬</div>
                            <h2 className="text-2xl font-bold text-white mb-3">No Videos Yet</h2>
                            <p className="text-text-secondary mb-6">Be the first to upload and share your content!</p>
                            <Link to="/upload" className="px-6 py-2.5 bg-accent-primary text-white font-bold rounded-lg hover:bg-accent-glow transition-colors">Upload Video</Link>
                        </div>
                    ) : (
                        <div className="-mt-16 z-10 relative">
                            {trending.length > 0 && <VideoRow title="Trending Now 🔥" videos={trending} />}
                            {recommended.length > 0 && <VideoRow title="Recommended for You ✨" videos={recommended} />}
                            {newReleases.length > 0 && <VideoRow title="New Releases 🆕" videos={newReleases} />}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
