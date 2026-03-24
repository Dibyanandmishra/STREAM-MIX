import React from 'react';
import { Link } from 'react-router-dom';
import { Play, MoreVertical } from 'lucide-react';

const VideoCard = ({ video }) => {
    const { id, title, thumbnail, duration, channel, views, uploadedAt, channelAvatar } = video;

    return (
        <div className="group flex flex-col gap-3 cursor-pointer">
            {/* Thumbnail Container */}
            <Link to={`/watch/${id}`} className="relative block aspect-video rounded-xl overflow-hidden bg-surface-elevated border border-white/5 group-hover:border-white/20 transition-colors">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-accent-primary/80 flex items-center justify-center backdrop-blur-md scale-75 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_20px_rgba(229,9,20,0.6)]">
                        <Play className="text-white ml-1 fill-white" size={20} />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm text-xs font-medium rounded text-white tracking-wide">
                    {duration}
                </div>
            </Link>

            {/* Meta Content */}
            <div className="flex gap-3 px-1">
                <Link to={`/channel/${channel.id}`} className="flex-shrink-0">
                    <img
                        src={channelAvatar}
                        alt={channel.name}
                        className="w-9 h-9 rounded-full object-cover mt-0.5 border border-white/10 hover:border-white/40 transition-colors"
                    />
                </Link>

                <div className="flex flex-col flex-grow overflow-hidden">
                    <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2 leading-tight group-hover:text-accent-glow transition-colors">
                        <Link to={`/watch/${id}`}>{title}</Link>
                    </h3>
                    <Link to={`/channel/${channel.id}`} className="text-sm text-text-secondary hover:text-white transition-colors mt-1.5 flex items-center gap-1.5">
                        {channel.name}
                        {channel.verified && (
                            <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-text-secondary text-background-base text-[8px] font-bold">
                                ✓
                            </span>
                        )}
                    </Link>
                    <div className="text-xs text-text-muted mt-0.5 flex items-center gap-1.5">
                        <span>{views} views</span>
                        <span className="w-1 h-1 rounded-full bg-text-muted/50"></span>
                        <span>{uploadedAt}</span>
                    </div>
                </div>

                <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-full transition-all self-start mt-0.5 text-white">
                    <MoreVertical size={16} />
                </button>
            </div>
        </div>
    );
};

export default VideoCard;
