import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Sparkles, X, RefreshCw, Backpack, Star, Zap } from 'lucide-react';
import { Equipment, ItemRarity, StatType } from '@/types';
import { StatIcon } from '@/components';
import { rarityColors } from '@/data/rarityColors';
import { calculateItemPower } from '@/data/equipmentConstants';

interface ChestOpenAnimationProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenAnother: () => void;
    onGoToInventory: () => void;
    chestRarity: ItemRarity;
    reward: Equipment | null;
    canAffordAnother: boolean;
}

const formatStatName = (statName: string | undefined): string => {
    if (!statName) return 'Unknown';
    return statName.charAt(0).toUpperCase() + statName.slice(1).toLowerCase();
};

const getRarityTier = (rarity: string): number => {
    const tiers: Record<string, number> = {
        common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5, mythic: 6, godlike: 7,
        celestial: 8, transcendent: 9, omnipotent: 10
    };
    return tiers[rarity] || (rarity.length > 7 ? 6 : 4); // Fallback for zone rarities -> mid-high tier
};

export const ChestOpenAnimation: React.FC<ChestOpenAnimationProps> = ({
    isOpen,
    onClose,
    onOpenAnother,
    onGoToInventory,
    chestRarity,
    reward,
    canAffordAnother
}) => {
    const [phase, setPhase] = useState<'closed' | 'shaking' | 'opening' | 'flash' | 'reveal'>('closed');
    const colors = rarityColors[chestRarity] || rarityColors.common;
    const rewardColors = reward ? (rarityColors[reward.rarity] || rarityColors.common) : colors;

    // Determine visual intensity based on rarity
    const rarityTier = useMemo(() => getRarityTier(reward?.rarity || chestRarity), [reward, chestRarity]);
    const isHighTier = rarityTier >= 5; // Legendary+
    const isGodTier = rarityTier >= 7; // Godlike+

    useEffect(() => {
        if (isOpen) {
            setPhase('closed');
            // Sequence: Closed -> Shaking -> Opening -> (Flash) -> Reveal
            const shakeTime = 400;
            const openTime = 1400;
            const flashTime = 1900;
            const revealTime = isGodTier ? 2100 : 1900;

            const t1 = setTimeout(() => setPhase('shaking'), shakeTime);
            const t2 = setTimeout(() => setPhase('opening'), openTime);

            // Add flash phase for high tier items
            const t3 = setTimeout(() => {
                if (isHighTier) setPhase('flash');
                else setPhase('reveal');
            }, flashTime);

            const t4 = setTimeout(() => {
                if (isHighTier) setPhase('reveal');
            }, revealTime);

            return () => {
                clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
            };
        }
    }, [isOpen, isHighTier, isGodTier]);

    // Dynamic particles based on rarity
    const particles = useMemo(() => {
        const count = isGodTier ? 60 : isHighTier ? 40 : 20;
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            angle: (360 / count) * i + (Math.random() * 20 - 10),
            delay: Math.random() * 0.2,
            distance: (isGodTier ? 150 : 100) + Math.random() * 80,
            size: Math.random() * (isGodTier ? 6 : 4) + 2,
            speed: Math.random() * 0.5 + 0.5
        }));
    }, [isGodTier, isHighTier]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop - Darker for high tiers */}
                    <motion.div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        animate={{ opacity: phase === 'reveal' ? 0.95 : 0.9 }}
                    />

                    {/* God Tier Background Beams */}
                    {isHighTier && phase === 'reveal' && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center -z-10"
                            initial={{ opacity: 0, rotate: 0 }}
                            animate={{ opacity: 0.4, rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-[2px] h-[150vmax] origin-[50%_0%]"
                                    style={{
                                        backgroundColor: rewardColors.text,
                                        transform: `rotate(${i * 30}deg) translateY(50%)`,
                                        boxShadow: `0 0 40px 4px ${rewardColors.text}`
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-md mb-32">

                        {/* Close button */}
                        {phase === 'reveal' && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-[-80px] right-0 p-3 bg-slate-900/80 rounded-full text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 transition-all"
                                onClick={onClose}
                            >
                                <X size={24} />
                            </motion.button>
                        )}

                        {/* Chest Container */}
                        <div className="relative h-64 flex items-center justify-center">

                            {/* Flash Effect */}
                            {phase === 'flash' && (
                                <motion.div
                                    className="absolute inset-0 z-50 bg-white"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}

                            {/* Glow behind chest */}
                            <motion.div
                                className="absolute inset-0 rounded-full blur-3xl -z-10"
                                style={{ backgroundColor: colors.glow }}
                                animate={{
                                    scale: phase === 'opening' ? [1, 2, 0] : (phase === 'reveal' ? [0, 1.5] : 1),
                                    opacity: phase === 'opening' ? [0.3, 1, 0] : (phase === 'reveal' ? 0.6 : 0.3),
                                }}
                                transition={{ duration: 0.8 }}
                            />

                            {/* The Chest */}
                            {phase !== 'reveal' && (
                                <motion.div
                                    className="relative"
                                    animate={{
                                        rotate: phase === 'shaking' ? [0, -5, 5, -5, 5, -3, 3, 0] : 0,
                                        scale: phase === 'shaking' ? [1, 1.1, 1, 1.1, 1] : (phase === 'opening' ? [1, 1.5, 0] : 1),
                                        y: phase === 'opening' ? [0, -20, 0] : 0,
                                    }}
                                    transition={{
                                        rotate: { duration: 0.5, repeat: phase === 'shaking' ? 2 : 0 },
                                        scale: { duration: 0.5 },
                                    }}
                                >
                                    <div
                                        className="w-32 h-32 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
                                        style={{
                                            backgroundColor: `${colors.text}20`,
                                            border: `3px solid ${colors.border}`,
                                            boxShadow: `0 0 ${isHighTier ? '60px' : '40px'} ${colors.glow}`,
                                        }}
                                    >
                                        <Package size={64} style={{ color: colors.text }} />
                                        {/* Shimmer effect for high tiers */}
                                        {isHighTier && (
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"
                                                animate={{ x: ['-100%', '100%'] }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Explosion Particles */}
                            {(phase === 'opening' || phase === 'reveal') && (
                                <>
                                    {particles.map((p) => (
                                        <motion.div
                                            key={p.id}
                                            className="absolute left-1/2 top-1/2 rounded-full"
                                            style={{
                                                backgroundColor: phase === 'reveal' ? rewardColors.text : colors.text,
                                                width: p.size,
                                                height: p.size
                                            }}
                                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                            animate={{
                                                x: Math.cos(p.angle * Math.PI / 180) * p.distance,
                                                y: Math.sin(p.angle * Math.PI / 180) * p.distance,
                                                opacity: [1, 1, 0],
                                                scale: [1, 0],
                                            }}
                                            transition={{ duration: 0.8 / p.speed, delay: p.delay, ease: 'easeOut' }}
                                        />
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Reward Reveal */}
                        {phase === 'reveal' && reward && (
                            <motion.div
                                className="w-full flex flex-col items-center"
                                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                {/* Rarity Banner for High Tiers */}
                                {isHighTier && (
                                    <motion.div
                                        initial={{ y: -50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="mb-6 relative"
                                    >
                                        <div className="absolute inset-0 blur-md" style={{ backgroundColor: rewardColors.glow }} />
                                        <h2 className="relative text-3xl font-black italic uppercase tracking-widest" style={{
                                            color: rewardColors.text,
                                            textShadow: `0 0 20px ${rewardColors.glow}`
                                        }}>
                                            {reward.rarity}
                                        </h2>
                                    </motion.div>
                                )}

                                {/* Item Card */}
                                <motion.div
                                    className="relative p-1 rounded-2xl w-full"
                                    style={{
                                        background: `linear-gradient(135deg, ${rewardColors.border}, ${rewardColors.bg})`,
                                        boxShadow: `0 0 50px ${rewardColors.glow}50`,
                                    }}
                                >
                                    <div className="bg-slate-950/90 backdrop-blur-xl rounded-xl p-6 border border-white/10 relative overflow-hidden">

                                        {/* Background pattern */}
                                        <div className="absolute inset-0 opacity-20 pointer-events-none"
                                            style={{
                                                backgroundImage: `radial-gradient(circle at 50% 50%, ${rewardColors.glow} 0%, transparent 70%)`
                                            }}
                                        />

                                        {/* Item Header */}
                                        <div className="flex flex-col items-center relative z-10">
                                            {!isHighTier && (
                                                <span className="text-xs font-bold uppercase tracking-widest mb-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700" style={{ color: rewardColors.text }}>
                                                    {reward.rarity}
                                                </span>
                                            )}

                                            <h3 className="text-2xl font-bold text-center leading-tight mb-1" style={{ color: rewardColors.text }}>
                                                {reward.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-6">{reward.type}</p>

                                            {/* Stats Grid */}
                                            <div className="w-full grid grid-cols-1 gap-2">
                                                {(reward.baseStats || []).map((stat, i) => (
                                                    <motion.div
                                                        key={stat?.stat || i}
                                                        className="flex items-center justify-between bg-slate-900/50 rounded-lg px-4 py-3 border border-slate-800"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.5 + i * 0.1 }}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-1.5 rounded-md bg-slate-800">
                                                                <StatIcon stat={stat?.stat as StatType} size={16} />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-300">
                                                                {formatStatName(stat?.stat)}
                                                            </span>
                                                        </div>
                                                        <span className="text-lg font-bold font-mono" style={{ color: rewardColors.text }}>
                                                            +{stat?.value || 0}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Power Score */}
                                    <motion.div
                                        className="mt-3 flex items-center justify-center gap-2 border-t border-slate-800/50 pt-3"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <Zap size={14} className="text-yellow-400" fill="currentColor" />
                                        <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
                                            Power: {calculateItemPower(reward).toLocaleString()}
                                        </span>
                                    </motion.div>
                                </motion.div>

                                {/* Action Buttons */}
                                <motion.div
                                    className="mt-6 flex gap-4 w-full justify-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <button
                                        onClick={onOpenAnother}
                                        disabled={!canAffordAnother}
                                        className={`flex-1 max-w-[160px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all
                                            ${canAffordAnother
                                                ? 'bg-slate-800 text-white hover:bg-slate-700 hover:-translate-y-1'
                                                : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        <RefreshCw size={16} />
                                        <span>Abrir Otro</span>
                                    </button>

                                    <button
                                        onClick={onGoToInventory}
                                        className="flex-1 max-w-[160px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all
                                            bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1"
                                    >
                                        <Backpack size={16} />
                                        <span>Inventario</span>
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Loading text */}
                        {phase !== 'reveal' && phase !== 'flash' && (
                            <motion.p
                                className="mt-8 text-sm font-bold uppercase tracking-widest opacity-50"
                                style={{ color: colors.text }}
                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                {phase === 'closed' && 'Preparando...'}
                                {phase === 'shaking' && 'Abriendo...'}
                                {phase === 'opening' && 'Generando...'}
                            </motion.p>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
