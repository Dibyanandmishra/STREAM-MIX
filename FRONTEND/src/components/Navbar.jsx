import React, { useState } from 'react';
import { Search, Menu, Bell, Upload, Mic } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../api/auth.api';

const Navbar = ({ toggleSidebar }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) navigate(`/?query=${encodeURIComponent(searchQuery.trim())}`);
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            logout();
            navigate('/login');
        } catch {
            logout();
            navigate('/login');
        }
    };

    return (
        <nav className="sticky top-0 z-50 h-16 w-full glass flex items-center justify-between px-4 lg:px-6 transition-all duration-300">
            {/* Left */}
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                    <Menu size={24} />
                </button>
                <Link to="/" className="text-xl font-bold flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(229,9,20,0.5)]">
                        <span className="text-white text-sm font-black">SM</span>
                    </div>
                    <span className="hidden sm:block tracking-wide">StreamMix</span>
                </Link>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-2xl px-4 flex justify-center items-center gap-3">
                <form onSubmit={handleSearch} className="w-full max-w-[600px] flex items-center bg-background-secondary border border-border rounded-full overflow-hidden focus-within:border-accent-primary/50 focus-within:shadow-[0_0_15px_rgba(255,46,99,0.1)] transition-all">
                    <div className="pl-4 pr-2 text-muted"><Search size={18} /></div>
                    <input type="text" placeholder="Search movies, shows, creators..." className="w-full bg-transparent border-none outline-none text-sm text-white py-2.5 placeholder:text-muted"
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    <button type="submit" className="px-5 py-2.5 bg-surface-elevated hover:bg-white/10 transition-colors border-l border-border text-sm text-white">
                        Search
                    </button>
                </form>
                <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-background-secondary hover:bg-surface-elevated transition-colors border border-border">
                    <Mic size={18} className="text-white" />
                </button>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 sm:gap-4">
                {user && (
                    <Link to="/upload" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium text-white border border-white/10">
                        <Upload size={16} /><span>Upload</span>
                    </Link>
                )}
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white relative">
                    <Bell size={20} />
                    {user && <span className="absolute top-2 right-2 w-2 h-2 bg-accent-glow rounded-full shadow-[0_0_5px_#FF2E63]"></span>}
                </button>

                {user ? (
                    <div className="relative">
                        <button onClick={() => setShowUserMenu(!showUserMenu)}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-accent-primary transition-all shadow-[0_0_10px_rgba(229,9,20,0.3)]">
                            <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                        </button>
                        {showUserMenu && (
                            <div className="absolute right-0 top-12 w-56 bg-surface-elevated border border-white/10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.6)] overflow-hidden z-50">
                                <div className="p-4 border-b border-white/10">
                                    <p className="text-white font-bold text-sm truncate">{user.fullName}</p>
                                    <p className="text-muted text-xs truncate mt-0.5">@{user.username}</p>
                                </div>
                                <div className="py-2">
                                    <Link to="/profile" onClick={() => setShowUserMenu(false)} className="block w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors">Your Profile</Link>
                                    <Link to="/studio" onClick={() => setShowUserMenu(false)} className="block w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors">Creator Studio</Link>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors border-t border-white/5 mt-1">
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="px-4 py-1.5 bg-accent-primary hover:bg-accent-glow text-white rounded-full text-sm font-bold transition-colors shadow-[0_0_10px_rgba(229,9,20,0.3)]">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
