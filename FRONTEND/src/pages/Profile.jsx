import React, { useState, useEffect } from 'react';
import { Camera, Loader2, Check, Clock, Heart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getWatchHistory } from '../api/auth.api';
import { getLikedVideos } from '../api/like.api';
import { updateAvatar, updateAccountDetails } from '../api/auth.api';
import { logoutUser } from '../api/auth.api';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
    const { user, logout, refetchUser } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('Watch History');
    const [watchHistory, setWatchHistory] = useState([]);
    const [likedVideos, setLikedVideos] = useState([]);
    const [loadingSec, setLoadingSec] = useState(false);
    const [editForm, setEditForm] = useState({ fullName: '', email: '' });
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (user) setEditForm({ fullName: user.fullName, email: user.email });
    }, [user]);

    useEffect(() => {
        if (!user) return;
        const load = async () => {
            setLoadingSec(true);
            try {
                if (activeSection === 'Watch History') {
                    const res = await getWatchHistory();
                    setWatchHistory(res.data?.data || []);
                } else if (activeSection === 'Liked Videos') {
                    const res = await getLikedVideos();
                    setLikedVideos(res.data?.data || []);
                }
            } catch { /* ignore */ } finally {
                setLoadingSec(false);
            }
        };
        load();
    }, [activeSection, user]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('avatar', file);
        try {
            await updateAvatar(fd);
            await refetchUser();
        } catch { /* ignore */ }
    };

    const handleSaveAccount = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateAccountDetails(editForm);
            await refetchUser();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch { /* ignore */ } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try { await logoutUser(); } catch { /* ignore */ }
        logout();
        navigate('/login');
    };

    if (!user) return (
        <div className="flex flex-col items-center justify-center py-32 text-text-secondary">
            <p className="text-lg mb-4">Please sign in to view your profile.</p>
            <Link to="/login" className="px-6 py-2.5 bg-accent-primary text-white font-bold rounded-lg hover:bg-accent-glow transition-colors">Sign In</Link>
        </div>
    );

    const SECTIONS = ['Watch History', 'Liked Videos', 'Account Settings'];

    const VideoMiniCard = ({ video }) => (
        <Link to={`/watch/${video._id}`} className="flex gap-3 group hover:bg-surface-elevated/30 p-2.5 rounded-xl border border-transparent hover:border-white/5 transition-all">
            <div className="w-28 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-surface-elevated">
                {video.thumbnail && <img src={video.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-sm font-semibold text-white line-clamp-1 group-hover:text-accent-glow transition-colors">{video.title}</p>
                <p className="text-xs text-text-secondary mt-0.5">{video.owner?.fullName}</p>
            </div>
        </Link>
    );

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen pb-20">
            {/* Sidebar */}
            <aside className="w-full lg:w-[300px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/5 p-6 flex flex-col gap-6">
                <div className="flex flex-col items-center gap-4 pb-6 border-b border-white/5">
                    <div className="relative group">
                        <img src={user.avatar} alt={user.fullName} className="w-24 h-24 rounded-full border-4 border-surface-elevated object-cover" />
                        <label htmlFor="avatar-upload" className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={22} className="text-white" />
                        </label>
                        <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-white">{user.fullName}</p>
                        <p className="text-text-secondary text-sm mt-0.5">@{user.username}</p>
                    </div>
                </div>

                <nav className="flex flex-col gap-1">
                    {SECTIONS.map(section => (
                        <button key={section} onClick={() => setActiveSection(section)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left
                ${activeSection === section ? 'bg-accent-primary/10 text-accent-glow border border-accent-primary/20' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}>
                            {section === 'Watch History' && <Clock size={16} />}
                            {section === 'Liked Videos' && <Heart size={16} />}
                            {section === 'Account Settings' && <Settings size={16} />}
                            {section}
                        </button>
                    ))}
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all text-left mt-2 border-t border-white/5 pt-4">
                        <LogOut size={16} /> Sign Out
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-6">{activeSection}</h2>

                {loadingSec ? (
                    <div className="flex justify-center py-16"><Loader2 className="animate-spin text-accent-primary" size={32} /></div>
                ) : activeSection === 'Watch History' ? (
                    <div className="flex flex-col gap-2">
                        {watchHistory.length === 0 ? <p className="text-text-secondary">No watch history yet.</p> : watchHistory.map(v => <VideoMiniCard key={v._id} video={v} />)}
                    </div>
                ) : activeSection === 'Liked Videos' ? (
                    <div className="flex flex-col gap-2">
                        {likedVideos.length === 0 ? <p className="text-text-secondary">No liked videos yet.</p> : likedVideos.map(v => <VideoMiniCard key={v._id} video={v} />)}
                    </div>
                ) : (
                    <form onSubmit={handleSaveAccount} className="max-w-lg flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text-secondary">Full Name</label>
                            <input type="text" value={editForm.fullName} onChange={e => setEditForm(p => ({ ...p, fullName: e.target.value }))}
                                className="bg-surface rounded-xl border border-white/10 focus:border-accent-primary/50 outline-none text-white px-4 py-3 text-sm transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text-secondary">Email</label>
                            <input type="email" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                                className="bg-surface rounded-xl border border-white/10 focus:border-accent-primary/50 outline-none text-white px-4 py-3 text-sm transition-colors" />
                        </div>
                        <button type="submit" disabled={saving}
                            className="self-start flex items-center gap-2 px-6 py-2.5 bg-accent-primary hover:bg-accent-glow text-white font-bold rounded-lg disabled:opacity-60 transition-colors shadow-[0_0_15px_rgba(229,9,20,0.3)]">
                            {saving ? <Loader2 size={16} className="animate-spin" /> : saveSuccess ? <Check size={16} /> : null}
                            {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
                        </button>
                    </form>
                )}
            </main>
        </div>
    );
};

export default Profile;
