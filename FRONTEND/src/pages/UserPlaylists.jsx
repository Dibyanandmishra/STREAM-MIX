import React, { useState, useEffect } from 'react';
import { Plus, Loader2, Film, Trash2 } from 'lucide-react';
import { getUserPlaylists, createPlaylist, deletePlaylist } from '../api/playlist.api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserPlaylists = () => {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const fetch = async () => {
            try {
                const res = await getUserPlaylists(user._id);
                setPlaylists(res.data?.data || []);
            } catch { setPlaylists([]); } finally { setLoading(false); }
        };
        fetch();
    }, [user]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setCreating(true);
        try {
            const res = await createPlaylist({ name: newName.trim(), description: newDesc.trim() });
            setPlaylists(prev => [res.data?.data, ...prev]);
            setNewName(''); setNewDesc(''); setShowCreate(false);
        } catch { /* ignore */ } finally { setCreating(false); }
    };

    const handleDelete = async (playlistId) => {
        if (!window.confirm('Delete this playlist?')) return;
        try {
            await deletePlaylist(playlistId);
            setPlaylists(prev => prev.filter(p => p._id !== playlistId));
        } catch { /* ignore */ }
    };

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-text-secondary">
            <Film size={48} className="text-muted" />
            <p className="text-lg">Sign in to access your playlists</p>
            <Link to="/login" className="px-6 py-2.5 bg-accent-primary text-white font-bold rounded-lg">Sign In</Link>
        </div>
    );

    if (loading) return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-accent-primary" size={36} /></div>;

    return (
        <div className="p-4 md:p-8 w-full max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Film size={24} className="text-accent-primary" /> Playlists
                </h1>
                <button onClick={() => setShowCreate(!showCreate)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-glow text-white text-sm font-bold rounded-lg transition-colors">
                    <Plus size={16} /> New Playlist
                </button>
            </div>

            {showCreate && (
                <form onSubmit={handleCreate} className="mb-6 p-6 glass rounded-2xl border border-white/10 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-white">Create Playlist</h2>
                    <input type="text" placeholder="Playlist name *" value={newName} onChange={e => setNewName(e.target.value)} required
                        className="bg-background-base border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-accent-primary/50 transition-colors" />
                    <textarea placeholder="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={2}
                        className="bg-background-base border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none resize-none focus:border-accent-primary/50 transition-colors" />
                    <div className="flex gap-3">
                        <button type="submit" disabled={creating}
                            className="px-5 py-2 bg-accent-primary hover:bg-accent-glow text-white text-sm font-bold rounded-lg disabled:opacity-60 transition-colors">
                            {creating ? 'Creating...' : 'Create'}
                        </button>
                        <button type="button" onClick={() => setShowCreate(false)}
                            className="px-5 py-2 bg-surface-elevated hover:bg-white/10 text-white text-sm rounded-lg transition-colors border border-white/10">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {playlists.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-text-secondary">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-lg">You haven't created any playlists yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {playlists.map(pl => (
                        <div key={pl._id} className="group relative glass rounded-2xl border border-white/5 hover:border-white/15 transition-all p-5 flex flex-col gap-3">
                            <div className="flex items-start justify-between">
                                <Link to={`/playlist/${pl._id}`} className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-accent-glow transition-colors">{pl.name}</h3>
                                    {pl.description && <p className="text-xs text-text-secondary mt-1 line-clamp-2">{pl.description}</p>}
                                </Link>
                                <button onClick={() => handleDelete(pl._id)} className="ml-3 p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                            <div className="text-xs text-muted">{pl.videos?.length || 0} videos</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserPlaylists;
