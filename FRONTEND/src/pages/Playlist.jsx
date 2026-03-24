import React from 'react';
import { Play, Shuffle, Share2, MoreHorizontal, Clock, ListPlus } from 'lucide-react';
import VideoCard from '../components/VideoCard';

const DUMMY_VIDEOS = Array(12).fill(0).map((_, i) => ({
    id: `pv${i}`,
    title: `React Performance Optimization - Part ${i + 1}`,
    thumbnail: `https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop&random=${i + 20}`,
    duration: '12:30',
    views: '110K',
    uploadedAt: '5 months ago',
    channel: { id: 'c1', name: 'ByteStream TV', verified: true },
    channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'
}));

const Playlist = () => {
    return (
        <div className="flex flex-col lg:flex-row w-full min-h-screen bg-background-base">

            {/* Left Sidebar: Playlist Info (Sticky on Desktop) */}
            <div className="w-full lg:w-[420px] xl:w-[480px] lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 bg-gradient-to-b from-surface-elevated/80 to-background-base p-6 md:p-8 flex flex-col hide-scrollbar overflow-y-auto border-r border-white/5">

                {/* Playlist Cover */}
                <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative group cursor-pointer border border-white/10">
                    <img
                        src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop"
                        alt="Playlist Cover"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-accent-primary p-4 rounded-full shadow-[0_0_20px_rgba(229,9,20,0.6)]">
                            <Play size={32} className="fill-white translate-x-1 border-white text-white" />
                        </div>
                    </div>
                </div>

                {/* Info */}
                <h1 className="text-3xl font-black text-white mb-2 leading-tight">Advanced React Patterns 2024</h1>

                <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-semibold text-white flex items-center gap-1">
                        ByteStream TV
                        <span className="w-3.5 h-3.5 rounded-full bg-text-secondary text-background-base text-[8px] flex items-center justify-center font-bold">✓</span>
                    </h3>
                </div>

                <div className="text-sm font-medium flex gap-2 text-text-secondary mb-4">
                    <span>12 videos</span>
                    <span>•</span>
                    <span>142,504 views</span>
                    <span>•</span>
                    <span>Updated today</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mb-6">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black py-2.5 rounded-full font-bold transition-colors">
                        <Play size={18} className="fill-black" /> Play All
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-full font-bold transition-colors border border-white/10">
                        <Shuffle size={18} /> Shuffle
                    </button>
                </div>

                <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-6">
                    <button className="p-2.5 bg-white/5 hover:bg-white/15 rounded-full text-white transition-colors border border-white/5">
                        <ListPlus size={20} />
                    </button>
                    <button className="p-2.5 bg-white/5 hover:bg-white/15 rounded-full text-white transition-colors border border-white/5">
                        <Share2 size={20} />
                    </button>
                    <button className="p-2.5 bg-white/5 hover:bg-white/15 rounded-full text-white transition-colors border border-white/5">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                {/* Description */}
                <p className="text-sm text-text-muted leading-relaxed">
                    Take your React skills to the next level with this comprehensive guide on advanced patterns, state management overrides, custom hooks architecture, and performance optimization techniques for 2024.
                </p>
            </div>

            {/* Right Content: Video List */}
            <div className="flex-1 p-4 md:p-6 lg:p-8 xl:p-12 pb-20">
                <div className="flex flex-col gap-4 max-w-5xl mx-auto">
                    {DUMMY_VIDEOS.map((video, idx) => (
                        <div key={video.id} className="flex gap-4 p-3 rounded-xl hover:bg-surface-elevated/50 transition-colors group cursor-pointer border border-transparent hover:border-white/5 items-center">
                            <span className="text-text-muted font-medium w-6 text-center">{idx + 1}</span>

                            <div className="w-[160px] sm:w-[200px] flex-shrink-0 aspect-video rounded-lg relative overflow-hidden bg-surface">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    {video.duration}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                    <Play className="text-white fill-white" size={24} />
                                </div>
                            </div>

                            <div className="flex flex-col flex-1 py-1">
                                <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-accent-glow transition-colors line-clamp-2 leading-tight mb-1">
                                    {video.title}
                                </h3>
                                <p className="text-sm text-text-secondary mt-1 hidden sm:block">ByteStream TV</p>
                                <div className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                                    <span>{video.views}</span>
                                    <span className="w-1 h-1 rounded-full bg-text-muted/50"></span>
                                    <span>{video.uploadedAt}</span>
                                </div>
                            </div>

                            <button className="hidden sm:flex p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-full transition-all opacity-0 group-hover:opacity-100">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Playlist;
