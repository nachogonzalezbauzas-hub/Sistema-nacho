import React from 'react';
import { Lock } from 'lucide-react';
import { AvatarFrame, AvatarFrameId } from '@/types';
import { PremiumParticleEffect } from './PremiumParticleEffect';

// Get frame styles with fallback to frame's own properties for shop frames
export const getFrameStyles = (frameId: string, frame?: AvatarFrame) => {
    let frameStyle = "";
    let effect = "";

    // First check if frame has its own styles (shop frames)
    if (frame && (frame.borderStyle || frame.glowStyle)) {
        frameStyle = `${frame.borderStyle || ''} ${frame.glowStyle || ''}`;
        if (frame.animation) {
            effect = frame.animation;
        }
        return { frameStyle, effect };
    }

    // Legacy switch for base frames
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
        case 'blue_flame':
            frameStyle = "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]";
            effect = "after:absolute after:inset-[-4px] after:border-2 after:border-blue-400/50 after:rounded-full after:animate-pulse";
            break;
        case 'golden_glory':
            frameStyle = "border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.9)] ring-2 ring-yellow-600";
            effect = "after:absolute after:inset-[-6px] after:border-2 after:border-yellow-300/60 after:rounded-full after:animate-spin-slow";
            break;
        case 'monarch_aura':
            frameStyle = "border-black shadow-[0_0_50px_rgba(0,0,0,1)] ring-2 ring-purple-900 bg-black";
            effect = "after:absolute after:inset-[-10px] after:bg-gradient-to-r after:from-purple-900/50 after:via-black after:to-blue-900/50 after:rounded-full after:animate-pulse after:-z-10 before:absolute before:inset-0 before:bg-[url('https://grainy-gradients.vercel.app/noise.svg')] before:opacity-20 before:rounded-full";
            break;
        case 'season_crest':
            frameStyle = "border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.7)]";
            effect = "after:absolute after:inset-[-4px] after:border after:border-indigo-300/40 after:rounded-full after:animate-pulse";
            break;
        case 'goblin_frame':
            frameStyle = "border-green-700 shadow-[0_0_15px_rgba(21,128,61,0.6)] bg-green-950";
            effect = "after:absolute after:inset-[-2px] after:border-2 after:border-green-800/50 after:rounded-full";
            break;
        case 'insect_carapace':
            frameStyle = "border-amber-700 shadow-[0_0_15px_rgba(180,83,9,0.6)] bg-amber-950";
            effect = "after:absolute after:inset-[-3px] after:border after:border-amber-600/40 after:rounded-full";
            break;
        case 'red_gate_frost':
            frameStyle = "border-sky-300 shadow-[0_0_20px_rgba(125,211,252,0.7)] bg-sky-950";
            effect = "after:absolute after:inset-0 after:bg-sky-400/10 after:rounded-full after:animate-pulse";
            break;
        case 'orc_tusk':
            frameStyle = "border-red-800 shadow-[0_0_20px_rgba(153,27,27,0.7)] bg-red-950";
            effect = "after:absolute after:inset-[-4px] after:border-2 after:border-red-700/50 after:rounded-full";
            break;
        case 'ant_king_crown':
            frameStyle = "border-purple-900 shadow-[0_0_30px_rgba(88,28,135,0.8)] bg-black";
            effect = "after:absolute after:inset-[-5px] after:border-2 after:border-purple-700/60 after:rounded-full after:animate-pulse";
            break;
        case 'god_statue_aura':
            frameStyle = "border-rose-600 shadow-[0_0_40px_rgba(225,29,72,0.9)] bg-black";
            effect = "after:absolute after:inset-[-8px] after:bg-gradient-to-r after:from-rose-900/50 after:via-black after:to-rose-900/50 after:rounded-full after:animate-pulse after:-z-10";
            break;
        default:
            frameStyle = "border-blue-500/50";
            effect = "";
    }
    return { frameStyle, effect };
};

export const AvatarOrb: React.FC<{
    level?: number;
    initials?: string;
    frame: AvatarFrame;
    imageUrl?: string;
    icon?: React.ReactNode;
    titleIcon?: React.ReactNode;
    bgColor?: string;
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ level, initials, frame, imageUrl, icon, titleIcon, bgColor = "bg-slate-900", onClick, size = 'md' }) => {
    const { frameStyle, effect } = getFrameStyles(frame.id, frame);

    const sizeClasses = {
        sm: "w-10 h-10",
        md: "w-16 h-16",
        lg: "w-24 h-24",
        xl: "w-32 h-32"
    };

    // Explicit icon sizes in pixels for crisp rendering
    const iconPixelSizes = {
        sm: 20,
        md: 32,
        lg: 40,
        xl: 56
    };

    // Dynamic border width based on size
    const borderWidth = (size === 'lg' || size === 'xl') ? 'border-[3px]' : 'border-2';

    const isPremium = frame.rarity === 'SSS';

    return (
        <div className={`relative group cursor-pointer ${sizeClasses[size]} mx-auto mb-4`} onClick={onClick}>
            {/* Main Avatar Circle */}
            <div className={`absolute inset-0 rounded-full ${borderWidth} ${frameStyle} transition-all duration-500 ${effect} flex items-center justify-center overflow-hidden ${bgColor} z-10`}>



                {imageUrl ? (
                    <img src={imageUrl} alt="Avatar" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity relative z-10" />
                ) : icon ? (
                    <div className={`text-white transform transition-transform duration-300 group-hover:scale-110 flex items-center justify-center relative z-10`}>
                        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: iconPixelSizes[size], strokeWidth: 1.5 }) : icon}
                    </div>
                ) : (
                    <span className={`${size === 'xl' ? 'text-4xl' : size === 'lg' ? 'text-3xl' : 'text-xl'} font-black text-white relative z-10`}>{initials}</span>
                )}

                {/* Title Icon Overlay (if equipped) */}
                {titleIcon && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none opacity-80 mix-blend-screen">
                        {/* We clone the element to force a specific size if needed, or just render it */}
                        {React.isValidElement(titleIcon) ? React.cloneElement(titleIcon as React.ReactElement, { size: size === 'xl' ? 48 : 24, strokeWidth: 1.5 }) : titleIcon}
                    </div>
                )}

                {/* Edit Overlay */}
                {onClick && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider border border-white/20 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">Edit</span>
                    </div>
                )}
            </div>

            {/* Level Indicator Badge */}
            {level !== undefined && (
                <div className={`absolute -bottom-1 -right-1 bg-slate-950 border border-blue-500/50 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full z-20 shadow-sm ${frameStyle} ${effect} !border-2 !static-border`}>
                    LV {level}
                </div>
            )}
        </div>
    );
};

// Helper to get rarity colors
export const getFrameRarityColors = (rarity: string) => {
    switch (rarity) {
        case 'C': return { border: 'border-slate-600', bg: 'bg-slate-900/50', text: 'text-slate-400', glow: '' };
        case 'B': return { border: 'border-green-600', bg: 'bg-green-950/30', text: 'text-green-400', glow: 'shadow-[0_0_10px_rgba(34,197,94,0.2)]' };
        case 'A': return { border: 'border-blue-600', bg: 'bg-blue-950/30', text: 'text-blue-400', glow: 'shadow-[0_0_10px_rgba(59,130,246,0.2)]' };
        case 'S': return { border: 'border-purple-600', bg: 'bg-purple-950/30', text: 'text-purple-400', glow: 'shadow-[0_0_10px_rgba(168,85,247,0.2)]' };
        case 'SS': return { border: 'border-yellow-500', bg: 'bg-yellow-950/30', text: 'text-yellow-400', glow: 'shadow-[0_0_10px_rgba(234,179,8,0.2)]' };
        case 'SSS': return { border: 'border-rose-600', bg: 'bg-rose-950/30', text: 'text-rose-400', glow: 'shadow-[0_0_10px_rgba(225,29,72,0.2)]' };
        default: return { border: 'border-slate-600', bg: 'bg-slate-900/50', text: 'text-slate-400', glow: '' };
    }
};

export const AvatarFrameSelector: React.FC<{
    frames: AvatarFrame[];
    selectedId: AvatarFrameId;
    unlockedIds: AvatarFrameId[];
    onSelect: (id: AvatarFrameId) => void;
    layout?: 'row' | 'grid';
}> = ({ frames, selectedId, unlockedIds = [], onSelect, layout = 'row' }) => {
    const containerClass = layout === 'grid'
        ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4"
        : "flex gap-4 overflow-x-auto pb-4 pt-2 px-2 scrollbar-hide";

    return (
        <div className={containerClass}>
            {frames.map(frame => {
                const isUnlocked = unlockedIds.includes(frame.id);
                const isSelected = selectedId === frame.id;
                const rarityColors = getFrameRarityColors(frame.rarity || 'C');
                const isPremium = frame.rarity === 'SSS';

                // Mini-frame styles logic (reused but slightly adjusted for larger display)
                let miniFrameStyle = "";
                let miniEffect = null;
                let isGradientBorder = false;

                switch (frame.id) {
                    case 'lightning':
                        miniFrameStyle = "border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]";
                        miniEffect = <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-pulse"></div>;
                        break;
                    case 'arcane':
                        miniFrameStyle = "border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]";
                        miniEffect = <div className="absolute inset-0 border border-purple-400/30 rounded-full animate-spin-slow"></div>;
                        break;
                    case 'inferno':
                        miniFrameStyle = "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]";
                        miniEffect = <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>;
                        break;
                    case 'shadow':
                        miniFrameStyle = "border-blue-900 shadow-[0_0_10px_rgba(30,58,138,0.9)] bg-black";
                        break;
                    case 'royal':
                        miniFrameStyle = "border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.7)]";
                        break;
                    case 'storm_rider':
                        miniFrameStyle = "border-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]";
                        miniEffect = <div className="absolute inset-[-4px] border border-dashed border-cyan-200/50 rounded-full animate-spin-slow"></div>;
                        break;
                    case 'inner_flame_frame':
                        miniFrameStyle = "border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]";
                        miniEffect = <div className="absolute inset-0 bg-orange-500/20 animate-pulse"></div>;
                        break;
                    case 'golden_fortune':
                        miniFrameStyle = "border-yellow-300 shadow-[0_0_12px_rgba(253,224,71,0.8)]";
                        miniEffect = <div className="absolute inset-[-4px] border border-yellow-200/50 rounded-full animate-shimmer"></div>;
                        break;
                    case 'monarch_crest':
                        miniFrameStyle = "border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.9)]";
                        miniEffect = <div className="absolute inset-[-5px] border border-purple-300/30 rounded-full animate-spin-reverse-slow"></div>;
                        break;
                    case 'season_monarch':
                        miniFrameStyle = "border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.9)]";
                        miniEffect = <div className="absolute inset-[-4px] border border-indigo-300/40 rounded-full animate-pulse"></div>;
                        break;
                    case 'rainbow_monarch':
                        isGradientBorder = true;
                        miniFrameStyle = "bg-gradient-to-br from-red-500 via-green-500 to-blue-500 p-[3px]";
                        miniEffect = <div className="absolute inset-[-4px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full opacity-50 animate-spin-slow -z-10"></div>;
                        break;
                    case 'eternal_chain':
                        miniFrameStyle = "border-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.6)] ring-1 ring-slate-700";
                        miniEffect = <div className="absolute inset-[-4px] border border-dashed border-slate-400/50 rounded-full animate-spin-slow"></div>;
                        break;
                    case 'blue_flame':
                        miniFrameStyle = "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.7)]";
                        miniEffect = <div className="absolute inset-0 border border-blue-400/30 rounded-full animate-pulse"></div>;
                        break;
                    case 'golden_glory':
                        miniFrameStyle = "border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]";
                        miniEffect = <div className="absolute inset-[-4px] border border-yellow-300/40 rounded-full animate-spin-slow"></div>;
                        break;
                    case 'monarch_aura':
                        miniFrameStyle = "border-black shadow-[0_0_20px_rgba(0,0,0,0.9)] bg-black";
                        miniEffect = <div className="absolute inset-[-5px] bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-full animate-pulse -z-10"></div>;
                        break;
                    case 'season_crest':
                        miniFrameStyle = "border-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.7)]";
                        miniEffect = <div className="absolute inset-[-4px] border border-indigo-300/30 rounded-full animate-pulse"></div>;
                        break;
                    case 'goblin_frame':
                        miniFrameStyle = "border-green-700 shadow-[0_0_10px_rgba(21,128,61,0.6)] bg-green-950";
                        break;
                    case 'insect_carapace':
                        miniFrameStyle = "border-amber-700 shadow-[0_0_10px_rgba(180,83,9,0.6)] bg-amber-950";
                        break;
                    case 'red_gate_frost':
                        miniFrameStyle = "border-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.7)] bg-sky-950";
                        miniEffect = <div className="absolute inset-0 bg-sky-400/10 animate-pulse"></div>;
                        break;
                    case 'orc_tusk':
                        miniFrameStyle = "border-red-800 shadow-[0_0_12px_rgba(153,27,27,0.7)] bg-red-950";
                        break;
                    case 'ant_king_crown':
                        miniFrameStyle = "border-purple-900 shadow-[0_0_15px_rgba(88,28,135,0.8)] bg-black";
                        miniEffect = <div className="absolute inset-[-4px] border border-purple-700/40 rounded-full animate-pulse"></div>;
                        break;
                    case 'god_statue_aura':
                        miniFrameStyle = "border-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.9)] bg-black";
                        miniEffect = <div className="absolute inset-[-5px] bg-gradient-to-r from-rose-900/30 to-black rounded-full animate-pulse -z-10"></div>;
                        break;
                    default:
                        // Use frame's own styles for shop frames
                        if (frame.borderStyle || frame.glowStyle) {
                            miniFrameStyle = `${frame.borderStyle || ''} ${frame.glowStyle || ''}`;
                            if (frame.animation) {
                                miniEffect = <div className={`absolute inset-[-4px] rounded-full ${frame.animation}`}></div>;
                            }
                        } else {
                            miniFrameStyle = "border-slate-500";
                        }
                }

                return (
                    <div
                        key={frame.id}
                        onClick={() => isUnlocked && onSelect(frame.id)}
                        className={`
                            relative group flex flex-col items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer aspect-square
                            ${isSelected
                                ? `${rarityColors.border} ${rarityColors.bg} shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-105 z-10`
                                : `${rarityColors.border} bg-slate-950/40 hover:bg-slate-900/60 hover:scale-105 hover:z-10`
                            }
                            ${!isUnlocked && 'opacity-60 grayscale hover:grayscale-0'}
                        `}
                    >
                        {/* Rarity Badge */}
                        <div className={`absolute top-2 left-2 text-[10px] font-black px-1.5 py-0.5 rounded border ${rarityColors.border} ${rarityColors.text} bg-black/50`}>
                            {frame.rarity || 'C'}
                        </div>

                        {/* Selected Indicator */}
                        {isSelected && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(59,130,246,1)] animate-pulse"></div>
                        )}

                        {/* Frame Preview */}
                        <div className="flex-1 flex items-center justify-center w-full">
                            <div className={`
                                w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center relative overflow-visible transition-transform duration-300 group-hover:scale-110
                                ${isGradientBorder ? miniFrameStyle : `border-[3px] ${miniFrameStyle} bg-slate-900`}
                            `}>


                                {isGradientBorder ? (
                                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center relative z-10">
                                        {miniEffect}
                                        {!isUnlocked && <Lock size={20} className="absolute text-white/50 z-20" />}
                                    </div>
                                ) : (
                                    <>
                                        {miniEffect}
                                        {!isUnlocked && <Lock size={20} className="absolute text-white/50 z-20" />}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Name */}
                        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center leading-tight w-full truncate ${isSelected ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                            {frame.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
