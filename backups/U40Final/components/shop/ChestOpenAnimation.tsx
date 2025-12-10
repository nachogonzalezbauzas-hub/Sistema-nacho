import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Sparkles, X, RefreshCw, Backpack } from 'lucide-react';
import { Equipment, ItemRarity, StatType } from '../../types';
import { StatIcon } from '../ui/Stats';

interface ChestOpenAnimationProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenAnother: () => void;
    onGoToInventory: () => void;
    chestRarity: ItemRarity;
    reward: Equipment | null;
    canAffordAnother: boolean;
}

const rarityColors: Record<ItemRarity, { main: string; glow: string; particles: string }> = {
    common: { main: '#94a3b8', glow: 'rgba(148,163,184,0.5)', particles: '#e2e8f0' },
    uncommon: { main: '#22c55e', glow: 'rgba(34,197,94,0.5)', particles: '#86efac' },
    rare: { main: '#3b82f6', glow: 'rgba(59,130,246,0.5)', particles: '#93c5fd' },
    epic: { main: '#a855f7', glow: 'rgba(168,85,247,0.5)', particles: '#d8b4fe' },
    legendary: { main: '#f59e0b', glow: 'rgba(245,158,11,0.5)', particles: '#fcd34d' },
    mythic: { main: '#ef4444', glow: 'rgba(239,68,68,0.5)', particles: '#fca5a5' },
    godlike: { main: '#ffffff', glow: 'rgba(255,255,255,0.7)', particles: '#ffffff' },
};

const formatStatName = (statName: string | undefined): string => {
    if (!statName) return 'Unknown';
    return statName.charAt(0).toUpperCase() + statName.slice(1).toLowerCase();
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
    const [phase, setPhase] = useState<'closed' | 'shaking' | 'opening' | 'reveal'>('closed');
    const colors = rarityColors[chestRarity] || rarityColors.common;
    const rewardColors = reward ? (rarityColors[reward.rarity] || rarityColors.common) : colors;

    useEffect(() => {
        if (isOpen) {
            setPhase('closed');
            const timer1 = setTimeout(() => setPhase('shaking'), 300);
            const timer2 = setTimeout(() => setPhase('opening'), 1200);
            const timer3 = setTimeout(() => setPhase('reveal'), 1800);
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        }
    }, [isOpen]);

    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        angle: (360 / 20) * i,
        delay: Math.random() * 0.3,
        distance: 80 + Math.random() * 60,
    }));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center px-4">

                        {/* Close button */}
                        {phase === 'reveal' && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-[-60px] right-0 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                                onClick={onClose}
                            >
                                <X size={20} />
                            </motion.button>
                        )}

                        {/* Chest Container */}
                        <div className="relative">
                            {/* Glow behind chest */}
                            <motion.div
                                className="absolute inset-0 rounded-full blur-3xl -z-10"
                                style={{ backgroundColor: colors.glow }}
                                animate={{
                                    scale: phase === 'opening' || phase === 'reveal' ? [1, 2, 1.5] : 1,
                                    opacity: phase === 'opening' || phase === 'reveal' ? [0.3, 1, 0.8] : 0.3,
                                }}
                                transition={{ duration: 0.8 }}
                            />

                            {/* The Chest */}
                            <motion.div
                                className="relative"
                                animate={{
                                    rotate: phase === 'shaking' ? [0, -5, 5, -5, 5, -3, 3, 0] : 0,
                                    scale: phase === 'shaking' ? [1, 1.05, 1, 1.05, 1] : (phase === 'opening' ? [1, 1.3, 0] : 1),
                                    y: phase === 'opening' ? [0, -20, 0] : 0,
                                }}
                                transition={{
                                    rotate: { duration: 0.8, repeat: phase === 'shaking' ? 1 : 0 },
                                    scale: { duration: 0.6 },
                                    y: { duration: 0.4 },
                                }}
                            >
                                <div
                                    className="w-32 h-32 rounded-2xl flex items-center justify-center transition-all duration-300"
                                    style={{
                                        backgroundColor: `${colors.main}20`,
                                        border: `3px solid ${colors.main}`,
                                        boxShadow: `0 0 40px ${colors.glow}`,
                                    }}
                                >
                                    <Package size={64} style={{ color: colors.main }} />
                                </div>

                                {/* Sparkles during shaking */}
                                {phase === 'shaking' && (
                                    <>
                                        {[...Array(6)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute"
                                                style={{
                                                    left: `${20 + Math.random() * 60}%`,
                                                    top: `${10 + Math.random() * 80}%`,
                                                }}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                                                transition={{ duration: 0.5, delay: i * 0.1, repeat: 2 }}
                                            >
                                                <Sparkles size={16} style={{ color: colors.particles }} />
                                            </motion.div>
                                        ))}
                                    </>
                                )}
                            </motion.div>

                            {/* Explosion Particles */}
                            {(phase === 'opening' || phase === 'reveal') && (
                                <>
                                    {particles.map((p) => (
                                        <motion.div
                                            key={p.id}
                                            className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
                                            style={{ backgroundColor: colors.particles }}
                                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                            animate={{
                                                x: Math.cos(p.angle * Math.PI / 180) * p.distance,
                                                y: Math.sin(p.angle * Math.PI / 180) * p.distance,
                                                opacity: [1, 1, 0],
                                                scale: [1, 1.5, 0],
                                            }}
                                            transition={{ duration: 1, delay: p.delay, ease: 'easeOut' }}
                                        />
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Reward Reveal */}
                        {phase === 'reveal' && reward && (
                            <motion.div
                                className="mt-8 flex flex-col items-center"
                                initial={{ opacity: 0, y: 50, scale: 0.5 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            >
                                {/* Item Card */}
                                <motion.div
                                    className="relative p-6 rounded-2xl backdrop-blur-md min-w-[280px]"
                                    style={{
                                        backgroundColor: `${rewardColors.main}15`,
                                        border: `2px solid ${rewardColors.main}`,
                                        boxShadow: `0 0 60px ${rewardColors.glow}, inset 0 0 30px ${rewardColors.glow}`,
                                    }}
                                    animate={{
                                        boxShadow: [
                                            `0 0 60px ${rewardColors.glow}, inset 0 0 30px ${rewardColors.glow}`,
                                            `0 0 80px ${rewardColors.glow}, inset 0 0 40px ${rewardColors.glow}`,
                                            `0 0 60px ${rewardColors.glow}, inset 0 0 30px ${rewardColors.glow}`,
                                        ],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    {/* Rarity Label */}
                                    <motion.div
                                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                                        style={{
                                            backgroundColor: rewardColors.main,
                                            color: reward.rarity === 'common' ? '#1e293b' : '#000',
                                        }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.4, type: 'spring' }}
                                    >
                                        {reward.rarity || 'Unknown'}
                                    </motion.div>

                                    {/* Item Name */}
                                    <h3
                                        className="text-xl font-black uppercase tracking-wider text-center mt-2"
                                        style={{ color: rewardColors.main }}
                                    >
                                        {reward.name || 'Mystery Item'}
                                    </h3>

                                    {/* Item Type */}
                                    <p className="text-xs text-slate-500 uppercase tracking-wider text-center mt-1 mb-4">
                                        {reward.type || 'Equipment'}
                                    </p>

                                    {/* Stats */}
                                    <div className="space-y-2">
                                        {(reward.baseStats || []).map((stat, i) => (
                                            <motion.div
                                                key={stat?.stat || i}
                                                className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + i * 0.1 }}
                                            >
                                                <span className="text-sm text-slate-300 flex items-center gap-2">
                                                    <StatIcon stat={stat?.stat as StatType} size={16} />
                                                    {formatStatName(stat?.stat)}
                                                </span>
                                                <span
                                                    className="font-bold font-mono"
                                                    style={{ color: rewardColors.main }}
                                                >
                                                    +{stat?.value || 0}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Floating sparkles */}
                                    <motion.div
                                        className="absolute -right-2 -top-2"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                    >
                                        <Sparkles size={20} style={{ color: rewardColors.particles }} />
                                    </motion.div>
                                    <motion.div
                                        className="absolute -left-2 -bottom-2"
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                    >
                                        <Sparkles size={16} style={{ color: rewardColors.particles }} />
                                    </motion.div>
                                </motion.div>

                                {/* Action Buttons */}
                                <motion.div
                                    className="mt-6 flex gap-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    {/* Open Another Button */}
                                    <button
                                        onClick={onOpenAnother}
                                        disabled={!canAffordAnother}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all
                                            ${canAffordAnother
                                                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                                                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        <RefreshCw size={18} />
                                        Abrir Otro
                                    </button>

                                    {/* Go to Inventory Button */}
                                    <button
                                        onClick={onGoToInventory}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all
                                            bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                    >
                                        <Backpack size={18} />
                                        Ir al Inventario
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Loading text during animation */}
                        {phase !== 'reveal' && (
                            <motion.p
                                className="mt-8 text-sm font-bold uppercase tracking-widest"
                                style={{ color: colors.main }}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                {phase === 'closed' && 'Preparando...'}
                                {phase === 'shaking' && 'Abriendo...'}
                                {phase === 'opening' && '✨'}
                            </motion.p>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
