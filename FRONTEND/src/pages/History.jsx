import React, { useState, useEffect } from 'react';
import { Clock, Loader2 } from 'lucide-react';
import { getWatchHistory } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
};

const formatViews = (n) => {
    if (!n && n !== 0) return '';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M views';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K views';
    return n + ' views';
};

const History = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const fetch = async () => {
            try {
                const res = await getWatchHistory();
                setHistory(res.data?.data || []);
            } catch { setHistory([]); } finally { setLoading(false); }
        };
        fetch();
    }, [user]);

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-text-secondary">
            <Clock size={48} className="text-muted" />
            <p className="text-lg">Sign in to view your watch history</p>
            <Link to="/login" className="px-6 py-2.5 bg-accent-primary text-white font-bold rounded-lg hover:bg-accent-glow transition-colors">Sign In</Link>
        </div>
    );

    if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-accent-primary" size={36} /></div>;

    return (
        <div className="p-4 md:p-8 w-full max-w-4xl mx-auto pb-20">
            <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Clock size={24} className="text-accent-primary" /> Watch History
            </h1>

            {history.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-text-secondary">
                    <div className="text-5xl mb-4">🎬</div>
                    <p className="text-lg">Your watch history is empty.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {history.map(video => (
                        <Link key={video._id} to={`/watch/${video._id}`}
                            className="flex gap-4 p-3 rounded-xl border border-transparent hover:border-white/5 hover:bg-surface group transition-all">
                            <div className="w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-surface-elevated">
                                <img src={video.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div className="flex flex-col justify-center flex-1 min-w-0">
                                <h3 className="font-semibold text-white line-clamp-2 group-hover:text-accent-glow transition-colors">{video.title}</h3>
                                <p className="text-sm text-text-secondary mt-1">{video.owner?.fullName}</p>
                                <div className="text-xs text-muted mt-0.5 flex items-center gap-2">
                                    <span>{formatViews(video.views)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
