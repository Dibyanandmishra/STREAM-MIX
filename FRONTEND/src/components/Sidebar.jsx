import React from 'react';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, Flame, Play, Film, User, Settings, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, path, isActive }) => {
    return (
        <Link
            to={path}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-accent-primary/10 text-accent-glow font-medium'
                    : 'text-text-secondary hover:bg-white/5 hover:text-white'
                }`}
        >
            <Icon size={20} className={isActive ? 'text-accent-glow drop-shadow-[0_0_8px_rgba(255,46,99,0.5)]' : ''} />
            <span className="text-sm tracking-wide">{label}</span>
        </Link>
    );
};

const SidebarDivider = () => <div className="h-px bg-white/5 my-3 mx-2" />;

const Sidebar = ({ isOpen }) => {
    const location = useLocation();

    return (
        <aside
            className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-background-base flex-shrink-0 z-40 overflow-y-auto hide-scrollbar border-r border-border transition-all duration-300 ease-in-out
        ${isOpen ? 'w-60 translate-x-0' : 'w-0 lg:w-[72px] -translate-x-full lg:translate-x-0'}
      `}
        >
            <div className="py-4 px-2 flex flex-col gap-1 min-w-[240px]">
                <SidebarItem icon={Home} label="Home" path="/" isActive={location.pathname === '/'} />
                <SidebarItem icon={Compass} label="Explore" path="/explore" isActive={location.pathname === '/explore'} />
                <SidebarItem icon={PlaySquare} label="Subscriptions" path="/subscriptions" isActive={location.pathname === '/subscriptions'} />

                <SidebarDivider />
                <div className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider">Library</div>

                <SidebarItem icon={Clock} label="History" path="/history" isActive={location.pathname === '/history'} />
                <SidebarItem icon={Play} label="Your Videos" path="/studio" isActive={location.pathname === '/studio'} />
                <SidebarItem icon={Film} label="Playlists" path="/playlists" isActive={location.pathname === '/playlists'} />
                <SidebarItem icon={ThumbsUp} label="Liked" path="/liked" isActive={location.pathname === '/liked'} />

                <SidebarDivider />
                <div className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider">Trending</div>

                <SidebarItem icon={Flame} label="Movies" path="/movies" isActive={location.pathname === '/movies'} />

                <SidebarDivider />

                <SidebarItem icon={Settings} label="Settings" path="/settings" isActive={location.pathname === '/settings'} />
                <SidebarItem icon={HelpCircle} label="Help" path="/help" isActive={location.pathname === '/help'} />
            </div>
        </aside>
    );
};

export default Sidebar;
