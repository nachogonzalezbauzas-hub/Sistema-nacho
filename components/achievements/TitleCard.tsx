import React from 'react';
import { motion } from 'framer-motion';
import { TitleDefinition } from '@/data/titles';
import { CheckCircle, Lock } from 'lucide-react';
import { getIconByName } from '@/utils/iconMapper';
import { rarityStyles, PremiumParticleEffect } from '@/components';

interface TitleCardProps {
    title: TitleDefinition;
    isUnlocked: boolean;
    isEquipped: boolean;
    onEquip: (id: string) => void;
    index: number;
}

export const TitleCard: React.FC<TitleCardProps> = ({ title, isUnlocked, isEquipped, onEquip, index }) => {
    // Default to common if rarity not found (safety)
    const style = rarityStyles[title.rarity as keyof typeof rarityStyles] || rarityStyles.common;

    // Render icon logic
    const renderIcon = () => {
        // String handling (icon name)
        if (typeof title.icon === 'string') {
            const IconComponent = getIconByName(title.icon, 32);
            if (IconComponent) return IconComponent;
            return <div className="text-xs">{title.icon}</div>;
        }

        // React Element handling
        if (React.isValidElement(title.icon)) {
            return React.cloneElement(title.icon as React.ReactElement, { size: 32 });
        }

        // CORRUPTION SAFETY: If we have an object that isn't a valid React element (e.g. serialized JSON),
        // we must NOT return it directly as it crashes React.
        // We fallback to a generic icon or text.
        console.warn('Invalid/Corrupt Title Icon detected:', title);
        const CrownIcon = getIconByName('Crown', 32);
        return CrownIcon || <span>👑</span>;
    };

    const isPremium = ['godlike', 'celestial', 'transcendent'].includes(title.rarity);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => isUnlocked && onEquip(title.id)}
            className={`
                relative group flex flex-col items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer min-h-[160px] overflow-hidden
                ${isEquipped
                    ? `${style.borderColor} bg-slate-900/80 shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-[1.02] z-10 ring-1 ring-offset-1 ring-offset-slate-950 ${style.labelColor.replace('text-', 'ring-')}`
                    : isUnlocked
                        ? `${style.borderColor} bg-slate-950/40 hover:bg-slate-900/60 hover:scale-[1.02] hover:z-10 hover:shadow-lg`
                        : 'border-slate-800 bg-slate-950/20 opacity-50 grayscale'
                }
            `}
        >
            {/* Premium Effect */}
            {isPremium && isUnlocked && (
                <PremiumParticleEffect rarity={title.rarity as any} />
            )}

            {/* Rarity Badge */}
            <div className={`absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded border z-20 ${isUnlocked ? `${style.borderColor} ${style.labelColor} bg-black/50` : 'border-slate-700 text-slate-500 bg-black/30'}`}>
                {title.rarity.toUpperCase()}
            </div>

            {/* Selected Indicator */}
            {isEquipped && (
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full z-20 ${style.labelColor.replace('text-', 'bg-')} shadow-[0_0_5px_currentColor] animate-pulse`}></div>
            )}

            {/* Icon */}
            <div className="flex-1 flex items-center justify-center w-full py-2 z-10">
                <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center relative overflow-visible transition-transform duration-300
                    ${isUnlocked ? `bg-gradient-to-br ${style.bgGradient} shadow-inner` : 'bg-slate-900 border border-slate-800'}
                `}>
                    {isUnlocked ? (
                        <span className="text-3xl filter drop-shadow-md flex items-center justify-center">
                            {renderIcon()}
                        </span>
                    ) : (
                        <Lock size={20} className="text-slate-600" />
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="w-full text-center space-y-1 z-10">
                <h4 className={`text-xs font-black uppercase tracking-wider truncate ${isUnlocked ? style.textColor : 'text-slate-600'}`}>
                    {title.name}
                </h4>
                <p className="text-[9px] text-slate-500 font-mono leading-tight line-clamp-2 h-[2.2em]">
                    {title.description}
                </p>
            </div>
        </motion.div>
    );
};
