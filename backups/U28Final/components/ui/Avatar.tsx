import React from 'react';
import { Lock } from 'lucide-react';
import { AvatarFrame, AvatarFrameId } from '../../types';

export const getFrameStyles = (frameId: string) => {
    let frameStyle = "";
    let effect = "";

    switch (frameId) {
        case 'lightning':
            frameStyle = "border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]";
            effect = "after:absolute after:inset-[-5px] after:border-2 after:border-cyan-400/50 after:rounded-full after:animate-pulse";
            break;
        case 'arcane':
            frameStyle = "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]";
            effect = "after:absolute after:inset-[-2px] after:border after:border-purple-400 after:rounded-full after:animate-spin-slow";
            break;
        case 'inferno':
            frameStyle = "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)]";
            effect = "after:absolute after:inset-[-4px] after:border-2 after:border-red-500/40 after:rounded-full after:animate-fire-pulse";
            break;
        case 'shadow':
            frameStyle = "border-blue-900 shadow-[0_0_25px_rgba(30,58,138,0.9)] bg-black";
            effect = "after:absolute after:inset-0 after:bg-blue-600/10 after:rounded-full after:animate-pulse";
            break;
        case 'royal':
            frameStyle = "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.7)]";
            effect = "after:absolute after:inset-[-3px] after:border after:border-yellow-200/50 after:rounded-full";
            break;
        case 'storm_rider':
            frameStyle = "border-cyan-300 shadow-[0_0_25px_rgba(103,232,249,0.8)]";
            effect = "after:absolute after:inset-[-6px] after:border-2 after:border-dashed after:border-cyan-200/60 after:rounded-full after:animate-spin-slow before:absolute before:inset-[-2px] before:border before:border-white/50 before:rounded-full before:animate-ping";
            break;
        case 'inner_flame_frame':
            frameStyle = "border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.8)]";
            effect = "after:absolute after:inset-[-4px] after:bg-gradient-to-t after:from-red-600/50 after:to-yellow-400/0 after:rounded-full after:animate-pulse";
            break;
        case 'golden_fortune':
            frameStyle = "border-yellow-300 shadow-[0_0_30px_rgba(253,224,71,0.8)] ring-2 ring-yellow-500/50";
            effect = "after:absolute after:inset-[-5px] after:border after:border-yellow-200/80 after:rounded-full after:animate-shimmer";
            break;
        case 'monarch_crest':
            frameStyle = "border-purple-400 shadow-[0_0_40px_rgba(192,132,252,0.9)] ring-2 ring-purple-600";
            effect = "after:absolute after:inset-[-8px] after:border-2 after:border-purple-300/40 after:rounded-full after:animate-spin-reverse-slow before:absolute before:inset-[-4px] before:border before:border-purple-100/60 before:rounded-full";
            break;
        case 'season_monarch':
            frameStyle = "border-indigo-400 shadow-[0_0_40px_rgba(129,140,248,0.9)] ring-2 ring-indigo-600";
            effect = "after:absolute after:inset-[-6px] after:border-2 after:border-indigo-300/50 after:rounded-full after:animate-pulse before:absolute before:inset-0 before:bg-indigo-500/10 before:rounded-full before:animate-ping";
            break;
        case 'rainbow_monarch':
            frameStyle = "border-transparent bg-gradient-to-br from-red-500 via-green-500 to-blue-500 p-[2px] shadow-[0_0_30px_rgba(255,255,255,0.5)]";
            effect = "after:absolute after:inset-[-4px] after:bg-gradient-to-r after:from-pink-500 after:via-purple-500 after:to-cyan-500 after:rounded-full after:opacity-50 after:animate-spin-slow after:-z-10";
            break;
        case 'eternal_chain':
            frameStyle = "border-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.6)] ring-4 ring-slate-700";
            effect = "after:absolute after:inset-[-4px] after:border-2 after:border-dashed after:border-slate-400 after:rounded-full after:animate-spin-slow";
            break;
        default:
            frameStyle = "border-blue-500/50";
            effect = "";
    }
    return { frameStyle, effect };
};

export const AvatarOrb: React.FC<{
    level: number;
    initials: string;
    frame: AvatarFrame;
    imageUrl?: string;
    icon?: React.ReactNode;
    bgColor?: string;
    onClick?: () => void
}> = ({ level, initials, frame, imageUrl, icon, bgColor = "bg-slate-900", onClick }) => {
    const { frameStyle, effect } = getFrameStyles(frame.id);

    return (
        <div className="relative group cursor-pointer w-24 h-24 mx-auto mb-4" onClick={onClick}>
            <div className={`absolute inset-0 rounded-full border-2 ${frameStyle} transition-all duration-500 ${effect} flex items-center justify-center overflow-hidden ${bgColor} z-10`}>
                {imageUrl ? (
                    <img src={imageUrl} alt="Avatar" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                ) : icon ? (
                    <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
                        {icon}
                    </div>
                ) : (
                    <span className="text-2xl font-black text-white">{initials}</span>
                )}
            </div>
            {/* Level Indicator Badge */}
            <div className={`absolute -bottom-1 -right-1 bg-slate-950 border border-blue-500/50 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full z-20 shadow-sm ${frameStyle} ${effect} !border-2 !static-border`}>
                LV {level}
            </div>
        </div>
    );
};

export const AvatarFrameSelector: React.FC<{
    frames: AvatarFrame[];
    selectedId: AvatarFrameId;
    unlockedIds: AvatarFrameId[];
    onSelect: (id: AvatarFrameId) => void;
    layout?: 'row' | 'grid';
}> = ({ frames, selectedId, unlockedIds, onSelect, layout = 'row' }) => {
    const containerClass = layout === 'grid'
        ? "grid grid-cols-3 gap-y-6 gap-x-4 justify-items-center py-4"
        : "flex gap-3 overflow-x-auto pb-4 pt-2 px-2 scrollbar-hide justify-center";

    return (
        <div className={containerClass}>
            {frames.map(frame => {
                const isUnlocked = unlockedIds.includes(frame.id);
                const isSelected = selectedId === frame.id;

                let borderColor = "border-slate-800";
                if (isSelected) borderColor = "border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]";
                else if (isUnlocked) borderColor = "border-slate-600 hover:border-slate-400";

                // Mini-frame styles
                let miniFrameStyle = "";
                let miniEffect = null;
                let isGradientBorder = false;

                switch (frame.id) {
                    case 'lightning':
                        miniFrameStyle = "border-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]";
                        miniEffect = <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-pulse"></div>;
                        break;
                    case 'arcane':
                        miniFrameStyle = "border-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]";
                        miniEffect = <div className="absolute inset-0 border border-purple-400/30 rounded-full animate-spin-slow"></div>;
                        break;
                    case 'inferno':
                        miniFrameStyle = "border-red-500 shadow-[0_0_5px_rgba(239,68,68,0.6)]";
                        miniEffect = <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>;
                        break;
                    case 'shadow':
                        miniFrameStyle = "border-blue-900 shadow-[0_0_5px_rgba(30,58,138,0.8)] bg-black";
                        break;
                    case 'royal':
                        miniFrameStyle = "border-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.6)]";
                        break;
                    case 'storm_rider':
                        miniFrameStyle = "border-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]";
                        miniEffect = <div className="absolute inset-[-2px] border border-dashed border-cyan-200/50 rounded-full animate-spin-slow"></div>;
                        break;
                    case 'inner_flame_frame':
                        miniFrameStyle = "border-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]";
                        miniEffect = <div className="absolute inset-0 bg-orange-500/20 animate-pulse"></div>;
                        break;
                    case 'golden_fortune':
                        miniFrameStyle = "border-yellow-300 shadow-[0_0_8px_rgba(253,224,71,0.8)]";
                        miniEffect = <div className="absolute inset-[-2px] border border-yellow-200/50 rounded-full animate-shimmer"></div>;
                        break;
                    case 'monarch_crest':
                        miniFrameStyle = "border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.9)]";
                        miniEffect = <div className="absolute inset-[-3px] border border-purple-300/30 rounded-full animate-spin-reverse-slow"></div>;
                        break;
                    case 'season_monarch':
                        miniFrameStyle = "border-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.9)]";
                        miniEffect = <div className="absolute inset-[-2px] border border-indigo-300/40 rounded-full animate-pulse"></div>;
                        break;
                    case 'rainbow_monarch':
                        isGradientBorder = true;
                        // Use a gradient background on the parent, and mask the center or use an inner div
                        miniFrameStyle = "bg-gradient-to-br from-red-500 via-green-500 to-blue-500 p-[2px]";
                        miniEffect = <div className="absolute inset-[-2px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full opacity-50 animate-spin-slow -z-10"></div>;
                        break;
                    case 'eternal_chain':
                        miniFrameStyle = "border-slate-300 shadow-[0_0_5px_rgba(203,213,225,0.6)] ring-1 ring-slate-700";
                        miniEffect = <div className="absolute inset-[-2px] border border-dashed border-slate-400/50 rounded-full animate-spin-slow"></div>;
                        break;
                    default:
                        miniFrameStyle = "border-slate-500";
                }

                return (
                    <div
                        key={frame.id}
                        onClick={() => isUnlocked && onSelect(frame.id)}
                        className={`
              flex flex-col items-center gap-2 min-w-[60px] cursor-pointer transition-all duration-300
              ${!isUnlocked ? 'opacity-50 grayscale' : 'hover:scale-105'}
            `}
                    >
                        <div className={`
              w-12 h-12 rounded-full flex items-center justify-center relative overflow-visible
              ${isGradientBorder ? miniFrameStyle : `border-2 ${miniFrameStyle} bg-slate-900`}
            `}>
                            {isGradientBorder ? (
                                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center relative z-10">
                                    {miniEffect}
                                    {!isUnlocked && <Lock size={14} className="absolute text-white z-20 drop-shadow-md" />}
                                </div>
                            ) : (
                                <>
                                    {miniEffect}
                                    {!isUnlocked && <Lock size={14} className="absolute text-white z-20 drop-shadow-md" />}
                                </>
                            )}
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider text-center leading-tight max-w-[80px] ${isSelected ? 'text-blue-400' : 'text-slate-500'}`}>
                            {frame.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
