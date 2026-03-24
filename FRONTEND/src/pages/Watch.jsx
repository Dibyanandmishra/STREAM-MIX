import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ThumbsUp, Share2, Plus, MessageSquare, MoreHorizontal, Loader2, Send, Copy, Check, ListPlus, Flag, BookmarkPlus } from 'lucide-react';
import { getVideoById, getAllVideos } from '../api/video.api';
import { toggleVideoLike } from '../api/like.api';
import { toggleSubscription } from '../api/subscription.api';
import { getVideoComments, addComment, deleteComment } from '../api/comment.api';
import { getUserPlaylists, addVideoToPlaylist, createPlaylist } from '../api/playlist.api';
import { useAuth } from '../context/AuthContext';

const formatViews = (n) => {
    if (!n) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
const fromNow = (d) => {
    if (!d) return '';
    const diff = Math.floor((new Date() - new Date(d)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

const RelatedVideoCard = ({ video }) => (
    <Link to={`/watch/${video._id}`} className="flex gap-3 group hover:bg-surface-elevated/30 p-1.5 rounded-xl transition-colors border border-transparent hover:border-white/5 items-start">
        <div className="w-[140px] sm:w-[160px] flex-shrink-0 relative rounded-lg overflow-hidden">
            <img src={video.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'} alt={video.title}
                className="w-full h-[80px] sm:h-[90px] object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex flex-col flex-1 py-0.5 min-w-0">
            <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight group-hover:text-accent-glow transition-colors">{video.title}</h3>
            <p className="text-xs text-text-secondary mt-1 truncate">{video.owner?.fullName}</p>
            <div className="text-[11px] text-muted mt-0.5">{formatViews(video.views)} views</div>
        </div>
    </Link>
);

// Save to Playlist modal
const SaveModal = ({ videoId, onClose }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);
    const [saved, setSaved] = useState({});
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;
        getUserPlaylists(user._id).then(r => setPlaylists(r.data?.data || [])).catch(() => { }).finally(() => setLoading(false));
    }, [user]);

    const handleAdd = async (playlistId) => {
        try {
            await addVideoToPlaylist(playlistId, videoId);
            setSaved(prev => ({ ...prev, [playlistId]: true }));
        } catch { /* ignore */ }
    };

    const handleCreateAndAdd = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setCreating(true);
        try {
            const res = await createPlaylist({ name: newName.trim() });
            const pl = res.data?.data;
            setPlaylists(prev => [pl, ...prev]);
            await addVideoToPlaylist(pl._id, videoId);
            setSaved(prev => ({ ...prev, [pl._id]: true }));
            setNewName('');
        } catch { /* ignore */ } finally { setCreating(false); }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-surface rounded-2xl border border-white/10 max-w-sm w-full p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold">Save to playlist</h3>
                    <button onClick={onClose} className="text-muted hover:text-white text-xl">×</button>
                </div>
                {loading ? <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-accent-primary" size={24} /></div> : (
                    <div className="flex flex-col gap-2 max-h-52 overflow-y-auto hide-scrollbar mb-4">
                        {playlists.map(pl => (
                            <button key={pl._id} onClick={() => handleAdd(pl._id)}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-colors text-left ${saved[pl._id] ? 'border-green-500/40 bg-green-500/10' : 'border-white/5 hover:border-white/20 bg-surface-elevated/50'}`}>
                                <span className="text-sm text-white font-medium">{pl.name}</span>
                                {saved[pl._id] ? <Check size={16} className="text-green-400" /> : <Plus size={16} className="text-muted" />}
                            </button>
                        ))}
                        {playlists.length === 0 && <p className="text-text-secondary text-sm py-2">No playlists yet.</p>}
                    </div>
                )}
                <form onSubmit={handleCreateAndAdd} className="flex gap-2">
                    <input type="text" placeholder="New playlist name..." value={newName} onChange={e => setNewName(e.target.value)}
                        className="flex-1 bg-background-base border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-accent-primary/50 transition-colors" />
                    <button type="submit" disabled={creating || !newName.trim()}
                        className="px-3 py-2 bg-accent-primary hover:bg-accent-glow text-white text-sm font-bold rounded-xl disabled:opacity-40 transition-colors">
                        {creating ? '...' : 'Create'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Watch = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [shareSuccess, setShareSuccess] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [viewIncremented, setViewIncremented] = useState(false);
    const videoRef = useRef(null);
    const optionsRef = useRef(null);

    // Close options menu when clicking outside
    useEffect(() => {
        const handleClick = (e) => {
            if (optionsRef.current && !optionsRef.current.contains(e.target)) setShowOptions(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        setLoading(true);
        setError('');
        setVideo(null);
        setIsLiked(false);
        setLikeCount(0);
        setIsSubscribed(false);
        setComments([]);
        setViewIncremented(false);

        const fetchVideo = async () => {
            try {
                const res = await getVideoById(id);
                const v = res.data?.data;
                setVideo(v);
                setLikeCount(v?.likes || 0);
            } catch {
                setError('Video not found or unavailable.');
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();

        // Fetch related videos
        getAllVideos({ limit: 15 }).then(res => {
            const all = res.data?.data || [];
            setRelatedVideos(all.filter(v => v._id !== id));
        }).catch(() => { });

        // Fetch comments
        getVideoComments(id).then(res => setComments(res.data?.data?.comments || [])).catch(() => { });
    }, [id]);

    // Increment view count when video starts playing (simulate)
    const handleVideoPlay = () => {
        if (!viewIncremented) {
            setViewIncremented(true);
            // The backend doesn't have a dedicated "increment view" endpoint,
            // so we optimistically update the local UI only
            setVideo(prev => prev ? { ...prev, views: (prev.views || 0) + 1 } : prev);
        }
    };

    const handleLike = async () => {
        if (!user) { navigate('/login'); return; }
        try {
            await toggleVideoLike(id);
            if (isLiked) {
                setIsLiked(false);
                setLikeCount(prev => Math.max(0, prev - 1));
            } else {
                setIsLiked(true);
                setLikeCount(prev => prev + 1);
            }
        } catch { /* ignore */ }
    };

    const handleSubscribe = async () => {
        if (!user) { navigate('/login'); return; }
        if (!video?.owner?._id) return;
        try {
            await toggleSubscription(video.owner._id);
            setIsSubscribed(!isSubscribed);
        } catch { /* ignore */ }
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setShareSuccess(true);
            setTimeout(() => setShareSuccess(false), 2500);
        }).catch(() => {
            // Fallback: prompt
            window.prompt('Copy this URL:', url);
        });
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !user) return;
        setCommentLoading(true);
        try {
            const res = await addComment(id, commentText.trim());
            setComments(prev => [res.data?.data, ...prev]);
            setCommentText('');
        } catch { /* ignore */ } finally { setCommentLoading(false); }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(prev => prev.filter(c => c._id !== commentId));
        } catch { /* ignore */ }
    };

    if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-accent-primary" size={40} /></div>;
    if (error) return <div className="flex justify-center items-center py-32 text-text-secondary">{error}</div>;
    if (!video) return null;

    return (
        <div className="flex flex-col xl:flex-row gap-6 p-4 lg:p-6 w-full max-w-[1800px] mx-auto">
            {showSaveModal && <SaveModal videoId={id} onClose={() => setShowSaveModal(false)} />}

            {/* Main Column */}
            <div className="flex-1 min-w-0">
                {/* Player */}
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/5">
                    <video ref={videoRef} src={video.videoFile} poster={video.thumbnail} controls className="w-full h-full" onPlay={handleVideoPlay} />
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-white mt-4 mb-3 leading-tight break-words">{video.title}</h1>

                {/* Channel info row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Link to={`/channel/${video.owner?.username}`} className="flex-shrink-0">
                            <img src={video.owner?.avatar} alt="" className="w-10 h-10 rounded-full cursor-pointer border border-white/10 hover:border-white/40 transition-colors object-cover" />
                        </Link>
                        <div className="flex flex-col min-w-0">
                            <Link to={`/channel/${video.owner?.username}`} className="text-white font-semibold text-sm hover:text-accent-glow transition-colors truncate">
                                {video.owner?.fullName}
                            </Link>
                            <span className="text-muted text-xs truncate">@{video.owner?.username}</span>
                        </div>
                        {user && user._id !== video.owner?._id && (
                            <button onClick={handleSubscribe}
                                className={`ml-4 flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all shadow-sm ${isSubscribed ? 'bg-surface-elevated text-white hover:bg-white/10 border border-white/10' : 'bg-white text-black hover:bg-gray-200'}`}>
                                {isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
                            </button>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Like */}
                        <button onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${isLiked ? 'bg-accent-primary/10 border-accent-primary/40 text-accent-glow' : 'bg-surface-elevated border-white/5 text-white hover:border-white/20'}`}>
                            <ThumbsUp size={16} className={isLiked ? 'fill-accent-glow' : ''} />
                            <span>{formatViews(likeCount)}</span>
                        </button>

                        {/* Share */}
                        <button onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 bg-surface-elevated hover:bg-white/10 rounded-full text-sm font-medium text-white border border-white/5 hover:border-white/20 transition-all">
                            {shareSuccess ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
                            {shareSuccess ? 'Copied!' : 'Share'}
                        </button>

                        {/* Save */}
                        <button onClick={() => { if (!user) { navigate('/login'); return; } setShowSaveModal(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-surface-elevated hover:bg-white/10 rounded-full text-sm font-medium text-white border border-white/5 hover:border-white/20 transition-all whitespace-nowrap">
                            <BookmarkPlus size={16} /> Save
                        </button>

                        {/* Options (...) */}
                        <div className="relative" ref={optionsRef}>
                            <button onClick={() => setShowOptions(!showOptions)}
                                className="flex items-center justify-center w-9 h-9 bg-surface-elevated hover:bg-white/10 rounded-full text-white border border-white/5 hover:border-white/20 transition-all">
                                <MoreHorizontal size={18} />
                            </button>
                            {showOptions && (
                                <div className="absolute right-0 top-11 w-52 bg-surface-elevated border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                                    {[
                                        { icon: ListPlus, label: 'Add to playlist', action: () => { setShowOptions(false); if (!user) { navigate('/login'); return; } setShowSaveModal(true); } },
                                        { icon: Share2, label: 'Share video', action: () => { setShowOptions(false); handleShare(); } },
                                        { icon: BookmarkPlus, label: 'Save for later', action: () => { setShowOptions(false); if (!user) { navigate('/login'); return; } setShowSaveModal(true); } },
                                        { icon: Flag, label: 'Report', action: () => { setShowOptions(false); alert('Report submitted. Thank you!'); } },
                                    ].map(({ icon: Icon, label, action }) => (
                                        <button key={label} onClick={action} className="flex items-center gap-3 px-4 py-3 w-full text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors text-left">
                                            <Icon size={16} /> {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats + Description */}
                <div className="mt-4 p-4 rounded-xl bg-surface-elevated/50 hover:bg-surface-elevated transition-colors border border-white/5 cursor-pointer group">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                        <span>{formatViews(video.views)} views</span>
                        <span>•</span>
                        <span>{formatDate(video.createdAt)}</span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                        {video.description || 'No description provided.'}
                    </p>
                </div>

                {/* Comments */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                        <MessageSquare size={22} className="text-accent-primary" />
                        {comments.length} Comments
                    </h2>

                    {user ? (
                        <form onSubmit={handleAddComment} className="flex gap-3 mb-8">
                            <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                            <div className="flex-1 flex items-end gap-2 border-b border-white/10 focus-within:border-white/40 pb-2 transition-colors">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="flex-1 bg-transparent outline-none text-white placeholder:text-muted text-sm py-1"
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                />
                                <button type="submit" disabled={commentLoading || !commentText.trim()}
                                    className="p-1 text-accent-primary hover:text-accent-glow transition-colors disabled:opacity-30 flex-shrink-0">
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={() => navigate('/login')} className="mb-6 px-5 py-2 bg-surface border border-white/10 rounded-full text-sm text-text-secondary hover:text-white transition-colors">
                            Sign in to comment
                        </button>
                    )}

                    <div className="flex flex-col gap-5">
                        {comments.filter(Boolean).map(comment => (
                            <div key={comment._id} className="flex gap-3 group">
                                <img src={comment.owner?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-white">@{comment.owner?.username}</span>
                                        <span className="text-xs text-muted">{fromNow(comment.createdAt)}</span>
                                    </div>
                                    <p className="text-sm text-text-secondary break-words">{comment.content}</p>
                                </div>
                                {user && user._id === comment.owner?._id && (
                                    <button onClick={() => handleDeleteComment(comment._id)}
                                        className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-all text-xs flex-shrink-0">
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Related Videos Sidebar */}
            <div className="w-full xl:w-[380px] flex-shrink-0">
                <p className="text-text-secondary text-sm font-semibold mb-3">Related Videos</p>
                <div className="flex flex-col gap-2">
                    {relatedVideos.length === 0 ? (
                        <p className="text-muted text-sm">No related videos.</p>
                    ) : (
                        relatedVideos.slice(0, 12).map(v => <RelatedVideoCard key={v._id} video={v} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default Watch;
