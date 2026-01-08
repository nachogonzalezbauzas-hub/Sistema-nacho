import React from 'react';
import { Lock } from 'lucide-react';
import { AvatarFrame, AvatarFrameId } from '@/types';
import { PremiumParticleEffect } from './PremiumParticleEffect';

import { rarityColors, frameRankColors } from '@/data/rarityColors';

// Helper to get rarity colors
export const getFrameRarityColors = (rarity: string) => {
    // Check frameRankColors first (for C, B, A, S classes), then default rarity colors
    return frameRankColors[rarity] || rarityColors[rarity] || rarityColors.common;
};

// Get frame styles with fallback to frame's own properties
export const getFrameStyles = (frameId: string, frame?: AvatarFrame) => {
    let frameStyle = "border-blue-500/50";
    let effect = "";

    if (frame) {
        // Use properties defined in the data
        if (frame.borderStyle || frame.glowStyle) {
            frameStyle = `${frame.borderStyle || ''} ${frame.glowStyle || ''}`;
        }
        if (frame.animation) {
            effect = frame.animation;
        }
        // Support for visual gene system (legacy/generated)
        if ((frame as any).cssClass) {
            frameStyle = (frame as any).cssClass;
        }
    }

    return { frameStyle, effect };
};

import { FrameAssets } from './FrameAssets';
import { FrameAssetType } from '@/types';

// Helper to determine frame asset
const getFrameAsset = (frame: AvatarFrame): { type: FrameAssetType, color: string } | null => {
    // If defined in data, use it
    if (frame.assetType && frame.assetColor) {
        return { type: frame.assetType, color: frame.assetColor };
    }
    return null;
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
    const asset = getFrameAsset(frame);

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

    // Premium check including zones
    const isPremium = frame.rarity === 'SSS' || ['magma', 'abyssal', 'verdant', 'storm', 'lunar', 'solar', 'nebula', 'singularity', 'nova', 'cyber', 'crystal', 'ethereal', 'crimson', 'heavenly', 'antimatter', 'temporal', 'chaotic', 'void', 'omega'].includes(frame.rarity);

    const AssetComponent = asset ? FrameAssets[asset.type] : null;

    return (
        <div className={`relative group cursor-pointer mx-auto mb-4 flex items-center justify-center`} onClick={onClick}>
            {/* Asset Overlay (Behind/Over - controlled by its own z-index in Asset or here) */}
            {/* We force a stacking context here. Use z-10 for Asset, z-20 for Main Circle */}
            {AssetComponent && (
                <div className={`${sizeClasses[size]} absolute flex items-center justify-center`} style={{ zIndex: 10 }}>
                    <AssetComponent className={`${asset?.color} opacity-90`} />
                </div>
            )}

            {/* Main Avatar Circle */}
            <div
                className={`${sizeClasses[size]} rounded-full ${borderWidth} ${frameStyle} transition-all duration-500 ${effect} flex items-center justify-center overflow-hidden ${bgColor} relative`}
                style={{ zIndex: 20 }}
            >
                {/* Premium Effect for Zones */}
                {isPremium && (
                    <div className="absolute inset-0 z-0 opacity-80">
                        <PremiumParticleEffect rarity={frame.rarity as any} />
                    </div>
                )}



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
            {
                level !== undefined && (
                    <div className={`absolute -bottom-1 -right-1 bg-slate-950 border border-blue-500/50 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full z-20 shadow-sm ${frameStyle} ${effect} !border-2 !static-border translate-x-1/2 -translate-y-1/2`}>
                        LV {level}
                    </div>
                )
            }
        </div >
    );
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

                // Get styles from frame data
                const { frameStyle: miniFrameStyle, effect: miniEffectClass } = getFrameStyles(frame.id, frame);
                const miniEffect = miniEffectClass ? <div className={`absolute inset-0 rounded-full ${miniEffectClass}`}></div> : null;
                const isGradientBorder = miniFrameStyle.includes('bg-gradient');

                // Check for asset overlay
                const asset = getFrameAsset(frame);
                const AssetComponent = asset ? FrameAssets[asset.type] : null;

                return (
                    <div
                        key={frame.id}
                        onClick={() => isUnlocked && onSelect(frame.id)}
                        className={`
                            relative group flex flex-col items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer aspect-square
                            ${isSelected
                                ? `shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-105 z-10`
                                : `hover:scale-105 hover:z-10`
                            }
                            ${!isUnlocked && 'opacity-60 grayscale hover:grayscale-0'}
                        `}
                        style={{
                            borderColor: rarityColors.border,
                            backgroundColor: isSelected ? rarityColors.bg : (isUnlocked ? rarityColors.bg : 'rgba(2,6,23,0.4)'),
                            boxShadow: isSelected ? `0 0 20px ${rarityColors.glow}` : undefined
                        }}
                    >
                        {/* Rarity Badge */}
                        <div
                            className={`absolute top-2 left-2 text-[10px] font-black px-1.5 py-0.5 rounded border bg-black/50`}
                            style={{ borderColor: rarityColors.border, color: rarityColors.text }}
                        >
                            {frame.rarity || 'C'}
                        </div>

                        {/* Selected Indicator */}
                        {isSelected && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] animate-pulse" style={{ backgroundColor: rarityColors.text, color: rarityColors.glow }}></div>
                        )}

                        {/* Frame Preview */}
                        <div className="flex-1 flex items-center justify-center w-full relative">
                            {/* Asset Layer (Behind) */}
                            {AssetComponent && (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 absolute flex items-center justify-center" style={{ zIndex: 10 }}>
                                    <AssetComponent className={`${asset?.color} opacity-90`} />
                                </div>
                            )}

                            <div
                                className={`
                                    w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-110
                                    ${isGradientBorder ? miniFrameStyle : `border-[3px] ${miniFrameStyle} bg-slate-900`}
                                `}
                                style={{ zIndex: 20 }}
                            >


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
