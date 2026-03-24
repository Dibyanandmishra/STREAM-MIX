import React, { useState, useEffect } from 'react';
import { Eye, Users, TrendingUp, PlaySquare, Heart, MessageCircle, Loader2, Trash2 } from 'lucide-react';
import { getChannelStats, getChannelVideos } from '../api/dashboard.api';
import { deleteVideo, togglePublishStatus } from '../api/video.api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <h3 className="text-text-secondary font-medium text-sm">{title}</h3>
            <div className={`p-2 rounded-lg ${colorClass}`}><Icon size={20} /></div>
        </div>
        <h2 className="text-3xl font-bold text-white">{value}</h2>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, videosRes] = await Promise.all([getChannelStats(), getChannelVideos()]);
                setStats(statsRes.data?.data);
                setVideos(videosRes.data?.data?.videos || []);
            } catch { /* ignore */ } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
        else setLoading(false);
    }, [user]);

    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm('Delete this video permanently?')) return;
        try {
            await deleteVideo(videoId);
            setVideos(prev => prev.filter(v => v._id !== videoId));
        } catch { /* ignore */ }
    };

    const handleTogglePublish = async (videoId) => {
        try {
            await togglePublishStatus(videoId);
            setVideos(prev => prev.map(v => v._id === videoId ? { ...v, isPublished: !v.isPublished } : v));
        } catch { /* ignore */ }
    };

    if (!user) return <div className="flex justify-center py-32 text-text-secondary">Please sign in to access your dashboard.</div>;
    if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-accent-primary" size={40} /></div>;

    return (
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Channel Dashboard</h1>
                    <p className="text-text-secondary mt-1">Welcome back, {user.fullName}</p>
                </div>
                <Link to="/upload" className="bg-accent-primary hover:bg-accent-glow text-white px-6 py-2.5 rounded-lg font-bold shadow-[0_0_15px_rgba(229,9,20,0.4)] transition-all flex items-center justify-center gap-2 self-start md:self-auto">
                    <PlaySquare size={18} /> Upload Video
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                <StatCard title="Total Views" value={stats?.totalViews?.toLocaleString() || '0'} icon={Eye} colorClass="bg-blue-500/20 text-blue-400" />
                <StatCard title="Subscribers" value={stats?.totalSubscribers?.toLocaleString() || '0'} icon={Users} colorClass="bg-green-500/20 text-green-400" />
                <StatCard title="Total Likes" value={stats?.totalLikes?.toLocaleString() || '0'} icon={TrendingUp} colorClass="bg-purple-500/20 text-purple-400" />
                <StatCard title="Total Videos" value={stats?.totalVideos?.toLocaleString() || '0'} icon={PlaySquare} colorClass="bg-red-500/20 text-red-400" />
            </div>

            {/* Videos Table */}
            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Your Videos</h2>
                </div>
                {videos.length === 0 ? (
                    <div className="p-12 text-center text-text-secondary">No videos uploaded yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-muted text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">Video</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Views</th>
                                    <th className="px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {videos.map(video => (
                                    <tr key={video._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 flex items-center gap-4 min-w-[280px]">
                                            <div className="w-16 h-9 bg-surface-elevated rounded border border-white/10 flex-shrink-0 overflow-hidden relative">
                                                {video.thumbnail && <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />}
                                            </div>
                                            <span className="font-semibold text-white text-sm line-clamp-1">{video.title}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleTogglePublish(video._id)}
                                                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${video.isPublished ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-gray-500/20 text-text-secondary hover:bg-gray-500/30'}`}>
                                                {video.isPublished ? 'Public' : 'Private'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white">{video.views?.toLocaleString() || '0'}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleDeleteVideo(video._id)} className="p-2 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
