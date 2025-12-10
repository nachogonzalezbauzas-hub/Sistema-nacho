import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sword, Crown, Frame, Trophy, Sparkles, Gift } from 'lucide-react';
import { Equipment, ItemRarity, StatType, Title, AvatarFrame } from '@/types';
import { StatIcon } from '@/components';
import { rarityColors } from '@/data/rarityColors';
import { getIconByName } from '@/utils/iconMapper';
import { AvatarOrb } from '@/components/ui/Avatar';

// Types for different reward kinds
type RewardType = 'equipment' | 'title' | 'frame' | 'achievement';

interface BaseReward {
    type: RewardType;
    rarity: string;
}

interface EquipmentReward extends BaseReward {
    type: 'equipment';
    data: Equipment;
}

interface TitleReward extends BaseReward {
    type: 'title';
    data: Title;
}

interface FrameReward extends BaseReward {
    type: 'frame';
    data: AvatarFrame;
}

interface AchievementReward extends BaseReward {
    type: 'achievement';
    data: {
        name: string;
        description: string;
        icon?: string | React.ReactNode;
        rarity?: string;
    };
}

type Reward = EquipmentReward | TitleReward | FrameReward | AchievementReward;

interface UniversalRewardRevealProps {
    isOpen: boolean;
    onClose: () => void;
    reward: Reward | null;
}

const formatStatName = (statName: string | undefined): string => {
    if (!statName) return 'Unknown';
    return statName.charAt(0).toUpperCase() + statName.slice(1).toLowerCase();
};

const getRarityTier = (rarity: string): number => {
    const tiers: Record<string, number> = {
        common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5, mythic: 6, godlike: 7,
        celestial: 8, transcendent: 9, primordial: 10, eternal: 10, divine: 10,
        cosmic: 10, infinite: 10, // Zone high tiers
        magma: 6, abyssal: 6, verdant: 6, storm: 6, lunar: 7, solar: 7, nebula: 7,
        singularity: 8, nova: 8, cyber: 8, crystal: 8, ethereal: 8, crimson: 8,
        heavenly: 9, antimatter: 9, temporal: 9, chaotic: 9, void: 10, omega: 10
    };
    return tiers[rarity?.toLowerCase()] || 4;
};

const getTypeIcon = (type: RewardType) => {
    switch (type) {
        case 'equipment': return <Sword size={20} />;
        case 'title': return <Crown size={20} />;
        case 'frame': return <Frame size={20} />;
        case 'achievement': return <Trophy size={20} />;
        default: return <Gift size={20} />;
    }
};

const getTypeLabel = (type: RewardType, language: 'en' | 'es' = 'es') => {
    const labels = {
        equipment: { en: 'Equipment', es: 'Equipamiento' },
        title: { en: 'Title', es: 'Título' },
        frame: { en: 'Avatar Frame', es: 'Marco de Avatar' },
        achievement: { en: 'Achievement', es: 'Logro' }
    };
    return labels[type]?.[language] || type;
};

export const UniversalRewardReveal: React.FC<UniversalRewardRevealProps> = ({
    isOpen,
    onClose,
    reward
}) => {
    const [phase, setPhase] = useState<'closed' | 'shaking' | 'opening' | 'flash' | 'reveal'>('closed');

    const rarity = reward?.rarity || 'common';
    const colors = rarityColors[rarity] || rarityColors.common;
    const rarityTier = useMemo(() => getRarityTier(rarity), [rarity]);
    const isHighTier = rarityTier >= 5;
    const isGodTier = rarityTier >= 8;

    useEffect(() => {
        if (isOpen && reward) {
            setPhase('closed');
            const shakeTime = 300;
            const openTime = 1000;
            const flashTime = 1400;
            const revealTime = isGodTier ? 1600 : 1400;

            const t1 = setTimeout(() => setPhase('shaking'), shakeTime);
            const t2 = setTimeout(() => setPhase('opening'), openTime);
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
    }, [isOpen, reward, isHighTier, isGodTier]);

    // Particles
    const particles = useMemo(() => {
        const count = isGodTier ? 50 : isHighTier ? 30 : 15;
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            angle: (360 / count) * i + (Math.random() * 20 - 10),
            delay: Math.random() * 0.2,
            distance: (isGodTier ? 140 : 90) + Math.random() * 60,
            size: Math.random() * (isGodTier ? 5 : 3) + 2,
            speed: Math.random() * 0.5 + 0.5
        }));
    }, [isGodTier, isHighTier]);

    if (!reward) return null;

    // Render content based on reward type
    const renderRewardContent = () => {
        switch (reward.type) {
            case 'equipment':
                return (
                    <div className="w-full">
                        <h3 className="text-2xl font-bold text-center leading-tight mb-1" style={{ color: colors.text }}>
                            {reward.data.name}
                        </h3>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-6 text-center">{reward.data.type}</p>

                        {/* Stats Grid */}
                        <div className="w-full grid grid-cols-1 gap-2">
                            {(reward.data.baseStats || []).map((stat, i) => (
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
                                    <span className="text-lg font-bold font-mono" style={{ color: colors.text }}>
                                        +{stat?.value || 0}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                );

            case 'title':
                const titleIcon = typeof reward.data.icon === 'string'
                    ? getIconByName(reward.data.icon, 48)
                    : reward.data.icon;
                return (
                    <div className="w-full flex flex-col items-center">
                        {/* Title Icon */}
                        <motion.div
                            className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                            style={{
                                backgroundColor: `${colors.text}15`,
                                border: `3px solid ${colors.border}`,
                                boxShadow: `0 0 30px ${colors.glow}`
                            }}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                        >
                            <span className="text-4xl" style={{ color: colors.text }}>
                                {titleIcon || <Crown size={48} />}
                            </span>
                        </motion.div>

                        <h3 className="text-2xl font-bold text-center leading-tight mb-2" style={{ color: colors.text }}>
                            {reward.data.name}
                        </h3>
                        <p className="text-sm text-slate-400 text-center max-w-xs">{reward.data.description}</p>
                    </div>
                );

            case 'frame':
                return (
                    <div className="w-full flex flex-col items-center">
                        {/* Frame Preview */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                            className="mb-4"
                        >
                            <AvatarOrb
                                frame={reward.data}
                                initials="?"
                                size="xl"
                            />
                        </motion.div>

                        <h3 className="text-2xl font-bold text-center leading-tight mb-2" style={{ color: colors.text }}>
                            {reward.data.name}
                        </h3>
                        <p className="text-sm text-slate-400 text-center max-w-xs">{reward.data.description || 'Nuevo marco desbloqueado'}</p>
                    </div>
                );

            case 'achievement':
                const achieveIcon = typeof reward.data.icon === 'string'
                    ? getIconByName(reward.data.icon, 48)
                    : reward.data.icon;
                return (
                    <div className="w-full flex flex-col items-center">
                        {/* Achievement Icon */}
                        <motion.div
                            className="w-24 h-24 rounded-2xl flex items-center justify-center mb-4"
                            style={{
                                backgroundColor: `${colors.text}15`,
                                border: `3px solid ${colors.border}`,
                                boxShadow: `0 0 30px ${colors.glow}`
                            }}
                            initial={{ scale: 0, y: -50 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                        >
                            <span className="text-4xl" style={{ color: colors.text }}>
                                {achieveIcon || <Trophy size={48} />}
                            </span>
                        </motion.div>

                        <h3 className="text-2xl font-bold text-center leading-tight mb-2" style={{ color: colors.text }}>
                            {reward.data.name}
                        </h3>
                        <p className="text-sm text-slate-400 text-center max-w-xs">{reward.data.description}</p>
                    </div>
                );
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        animate={{ opacity: phase === 'reveal' ? 0.95 : 0.9 }}
                    />

                    {/* God Tier Background Beams */}
                    {isHighTier && phase === 'reveal' && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center -z-10"
                            initial={{ opacity: 0, rotate: 0 }}
                            animate={{ opacity: 0.3, rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-[2px] h-[150vmax] origin-[50%_0%]"
                                    style={{
                                        backgroundColor: colors.text,
                                        transform: `rotate(${i * 30}deg) translateY(50%)`,
                                        boxShadow: `0 0 40px 4px ${colors.text}`
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-md mb-16">

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

                        {/* Icon Container */}
                        <div className="relative h-48 flex items-center justify-center">

                            {/* Flash Effect */}
                            {phase === 'flash' && (
                                <motion.div
                                    className="absolute inset-0 z-50 bg-white"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}

                            {/* Glow */}
                            <motion.div
                                className="absolute inset-0 rounded-full blur-3xl -z-10"
                                style={{ backgroundColor: colors.glow }}
                                animate={{
                                    scale: phase === 'opening' ? [1, 2, 0] : (phase === 'reveal' ? [0, 1.5] : 1),
                                    opacity: phase === 'opening' ? [0.3, 1, 0] : (phase === 'reveal' ? 0.5 : 0.3),
                                }}
                                transition={{ duration: 0.6 }}
                            />

                            {/* Type Icon (Shaking Phase) */}
                            {phase !== 'reveal' && (
                                <motion.div
                                    className="relative"
                                    animate={{
                                        rotate: phase === 'shaking' ? [0, -8, 8, -8, 8, -4, 4, 0] : 0,
                                        scale: phase === 'shaking' ? [1, 1.15, 1, 1.15, 1] : (phase === 'opening' ? [1, 1.8, 0] : 1),
                                        y: phase === 'opening' ? [0, -30, 0] : 0,
                                    }}
                                    transition={{
                                        rotate: { duration: 0.4, repeat: phase === 'shaking' ? 2 : 0 },
                                        scale: { duration: 0.4 },
                                    }}
                                >
                                    <div
                                        className="w-28 h-28 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
                                        style={{
                                            backgroundColor: `${colors.text}20`,
                                            border: `3px solid ${colors.border}`,
                                            boxShadow: `0 0 ${isHighTier ? '60px' : '40px'} ${colors.glow}`,
                                        }}
                                    >
                                        <span style={{ color: colors.text }} className="scale-150">
                                            {getTypeIcon(reward.type)}
                                        </span>
                                        {/* Shimmer */}
                                        {isHighTier && (
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"
                                                animate={{ x: ['-100%', '100%'] }}
                                                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
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
                                                backgroundColor: colors.text,
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
                                            transition={{ duration: 0.6 / p.speed, delay: p.delay, ease: 'easeOut' }}
                                        />
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Reward Reveal */}
                        {phase === 'reveal' && (
                            <motion.div
                                className="w-full flex flex-col items-center"
                                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                {/* Type Badge with Icon */}
                                <motion.div
                                    initial={{ y: -30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex items-center gap-2 mb-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700"
                                    style={{ borderColor: colors.border }}
                                >
                                    <span style={{ color: colors.text }}>{getTypeIcon(reward.type)}</span>
                                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.text }}>
                                        {getTypeLabel(reward.type)}
                                    </span>
                                </motion.div>

                                {/* Rarity Banner for High Tiers */}
                                {isHighTier && (
                                    <motion.div
                                        initial={{ y: -50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-4 relative"
                                    >
                                        <div className="absolute inset-0 blur-md" style={{ backgroundColor: colors.glow }} />
                                        <h2 className="relative text-3xl font-black italic uppercase tracking-widest" style={{
                                            color: colors.text,
                                            textShadow: `0 0 20px ${colors.glow}`
                                        }}>
                                            {rarity}
                                        </h2>
                                    </motion.div>
                                )}

                                {/* Item Card */}
                                <motion.div
                                    className="relative p-1 rounded-2xl w-full"
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.border}, ${colors.bg})`,
                                        boxShadow: `0 0 50px ${colors.glow}50`,
                                    }}
                                >
                                    <div className="bg-slate-950/90 backdrop-blur-xl rounded-xl p-6 border border-white/10 relative overflow-hidden">
                                        {/* Background pattern */}
                                        <div className="absolute inset-0 opacity-20 pointer-events-none"
                                            style={{
                                                backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.glow} 0%, transparent 70%)`
                                            }}
                                        />

                                        {/* Content */}
                                        <div className="flex flex-col items-center relative z-10">
                                            {!isHighTier && (
                                                <span className="text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full bg-slate-900 border border-slate-700" style={{ color: colors.text }}>
                                                    {rarity}
                                                </span>
                                            )}

                                            {renderRewardContent()}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Dismiss Button */}
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    onClick={onClose}
                                    className="mt-6 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all
                                        bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1"
                                >
                                    ¡Genial!
                                </motion.button>
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
                                {phase === 'shaking' && 'Revelando...'}
                                {phase === 'opening' && '¡Nuevo!'}
                            </motion.p>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UniversalRewardReveal;
