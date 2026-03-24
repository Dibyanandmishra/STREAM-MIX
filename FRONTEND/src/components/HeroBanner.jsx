import React from 'react';
import { Play, Info, Plus } from 'lucide-react';

const HeroBanner = ({ featured }) => {
    return (
        <div className="relative w-full h-[60vh] min-h-[500px] max-h-[800px] bg-black mb-8 overflow-hidden rounded-b-2xl shadow-2xl group cursor-pointer">
            {/* Background Image */}
            <img
                src={featured.backdrop}
                alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-[2s]"
            />

            {/* Overlays for cinematic feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-background-base via-background-base/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background-base via-background-base/80 to-transparent w-2/3"></div>

            {/* Content wrapper */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 lg:w-2/3 flex flex-col justify-end h-full">
                {/* Genre / Tags */}
                <div className="flex gap-2 mb-4">
                    {featured.genres.map(genre => (
                        <span key={genre} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider text-white uppercase border border-white/10">
                            {genre}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                    {featured.title}
                </h1>

                {/* Cinematic description */}
                <p className="text-lg md:text-xl text-text-secondary w-full md:w-4/5 leading-relaxed mb-8 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] line-clamp-3">
                    {featured.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                    <button className="flex items-center gap-3 px-8 py-3.5 bg-accent-primary hover:bg-accent-glow text-white rounded-lg font-bold text-lg transition-all shadow-[0_0_20px_rgba(229,9,20,0.5)] hover:shadow-[0_0_30px_rgba(255,46,99,0.8)] hover:scale-105">
                        <Play size={24} className="fill-white" />
                        Watch Now
                    </button>

                    <button className="flex items-center gap-3 px-8 py-3.5 bg-surface-elevated hover:bg-white/20 text-white rounded-lg font-bold text-lg transition-all backdrop-blur border border-white/10 hover:border-white/30">
                        <Info size={24} />
                        More Info
                    </button>

                    <button className="hidden sm:flex items-center justify-center w-14 h-14 bg-surface-elevated hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur border border-white/10 hover:border-white/30 hover:text-accent-glow">
                        <Plus size={28} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
