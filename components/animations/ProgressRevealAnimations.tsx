import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronUp, Zap, Star, TrendingUp, Crown, Image, Check } from 'lucide-react';
import { StatType } from '@/types';
import { StatIcon } from '@/components';

// Colors for the animations
const XP_COLOR = '#3b82f6'; // Blue
const LEVEL_COLOR = '#fbbf24'; // Yellow/Gold

const statColors: Record<string, { main: string; glow: string }> = {
    Strength: { main: '#ef4444', glow: 'rgba(239,68,68,0.5)' },
    Vitality: { main: '#22c55e', glow: 'rgba(34,197,94,0.5)' },
    Agility: { main: '#eab308', glow: 'rgba(234,179,8,0.5)' },
    Intelligence: { main: '#3b82f6', glow: 'rgba(59,130,246,0.5)' },
    Fortune: { main: '#10b981', glow: 'rgba(16,185,129,0.5)' },
    Metabolism: { main: '#f97316', glow: 'rgba(249,115,22,0.5)' },
};

// ============ XP GAIN REVEAL ============
interface XPGainRevealProps {
    isOpen: boolean;
    onClose: () => void;
    xpGained: number;
    oldXP: number;
    newXP: number;
    xpToNextLevel: number;
    currentLevel: number;
}

export const XPGainReveal: React.FC<XPGainRevealProps> = ({
    isOpen,
    onClose,
    xpGained,
    oldXP,
    newXP,
    xpToNextLevel,
    currentLevel
}) => {
    const [phase, setPhase] = useState<'shaking' | 'reveal' | 'filling'>('shaking');
    const [displayXP, setDisplayXP] = useState(0);
    const [barProgress, setBarProgress] = useState(0);

    const oldProgress = (oldXP / xpToNextLevel) * 100;
    const newProgress = Math.min((newXP / xpToNextLevel) * 100, 100);

    useEffect(() => {
        if (isOpen) {
            setPhase('shaking');
            setDisplayXP(0);
            setBarProgress(oldProgress);

            const t1 = setTimeout(() => setPhase('reveal'), 600);
            const t2 = setTimeout(() => setPhase('filling'), 1000);

            return () => { clearTimeout(t1); clearTimeout(t2); };
        }
    }, [isOpen, oldProgress]);

    // Animate XP counter
    useEffect(() => {
        if (phase === 'filling') {
            const duration = 1200;
            const start = performance.now();

            const animate = (time: number) => {
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);

                setDisplayXP(Math.round(xpGained * eased));
                setBarProgress(oldProgress + (newProgress - oldProgress) * eased);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        }
    }, [phase, xpGained, oldProgress, newProgress]);

    const particles = useMemo(() =>
        Array.from({ length: 20 }, (_, i) => ({
            id: i,
            angle: (360 / 20) * i + (Math.random() * 20 - 10),
            delay: Math.random() * 0.2,
            distance: 80 + Math.random() * 50,
            size: Math.random() * 4 + 2,
        })), []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

                    {/* Light beams for high XP gains */}
                    {xpGained >= 100 && phase === 'filling' && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center -z-10"
                            initial={{ opacity: 0, rotate: 0 }}
                            animate={{ opacity: 0.2, rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-[2px] h-[150vmax] origin-[50%_0%]"
                                    style={{
                                        backgroundColor: XP_COLOR,
                                        transform: `rotate(${i * 45}deg) translateY(50%)`,
                                        boxShadow: `0 0 30px 3px ${XP_COLOR}`
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}

                    <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-md">
                        {/* Close button */}
                        {phase === 'filling' && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.5 }}
                                className="absolute top-[-80px] right-0 p-3 bg-slate-900/80 rounded-full text-slate-400 hover:text-white border border-slate-700"
                                onClick={onClose}
                            >
                                <X size={24} />
                            </motion.button>
                        )}

                        {/* Icon Container */}
                        <div className="relative h-40 flex items-center justify-center">
                            <motion.div
                                className="absolute inset-0 rounded-full blur-3xl -z-10"
                                style={{ backgroundColor: XP_COLOR }}
                                animate={{ scale: phase === 'filling' ? [1, 1.5, 1] : 1, opacity: 0.4 }}
                            />

                            {phase === 'shaking' && (
                                <motion.div
                                    className="w-24 h-24 rounded-2xl flex items-center justify-center"
                                    style={{ backgroundColor: `${XP_COLOR}20`, border: `3px solid ${XP_COLOR}`, boxShadow: `0 0 40px ${XP_COLOR}` }}
                                    animate={{ rotate: [0, -8, 8, -8, 8, 0], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.4, repeat: 1 }}
                                >
                                    <Zap size={48} style={{ color: XP_COLOR }} />
                                </motion.div>
                            )}

                            {/* Particles */}
                            {phase !== 'shaking' && particles.map((p) => (
                                <motion.div
                                    key={p.id}
                                    className="absolute left-1/2 top-1/2 rounded-full"
                                    style={{ backgroundColor: XP_COLOR, width: p.size, height: p.size }}
                                    initial={{ x: 0, y: 0, opacity: 1 }}
                                    animate={{ x: Math.cos(p.angle * Math.PI / 180) * p.distance, y: Math.sin(p.angle * Math.PI / 180) * p.distance, opacity: 0 }}
                                    transition={{ duration: 0.6, delay: p.delay }}
                                />
                            ))}
                        </div>

                        {/* Content */}
                        {phase !== 'shaking' && (
                            <motion.div
                                className="w-full flex flex-col items-center"
                                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                {/* Type Badge */}
                                <motion.div
                                    className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-slate-900 border"
                                    style={{ borderColor: XP_COLOR }}
                                >
                                    <Zap size={18} style={{ color: XP_COLOR }} />
                                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: XP_COLOR }}>
                                        Experiencia
                                    </span>
                                </motion.div>

                                {/* XP Amount */}
                                <motion.h2
                                    className="text-5xl font-black font-mono mb-2"
                                    style={{ color: XP_COLOR, textShadow: `0 0 20px ${XP_COLOR}` }}
                                >
                                    +{displayXP} XP
                                </motion.h2>

                                {/* Progress Card */}
                                <motion.div
                                    className="relative p-1 rounded-2xl w-full mt-4"
                                    style={{ background: `linear-gradient(135deg, ${XP_COLOR}, #1e3a5f)`, boxShadow: `0 0 30px ${XP_COLOR}50` }}
                                >
                                    <div className="bg-slate-950/90 backdrop-blur-xl rounded-xl p-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-slate-400">Nivel {currentLevel}</span>
                                            <span className="text-sm text-slate-400">{Math.round(newXP)} / {xpToNextLevel}</span>
                                        </div>

                                        {/* XP Bar */}
                                        <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{
                                                    background: `linear-gradient(90deg, ${XP_COLOR}, #60a5fa)`,
                                                    boxShadow: `0 0 10px ${XP_COLOR}`
                                                }}
                                                initial={{ width: `${oldProgress}%` }}
                                                animate={{ width: `${barProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.5 }}
                                    onClick={onClose}
                                    className="mt-6 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                >
                                    ¡Genial!
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ============ LEVEL UP REVEAL ============
interface LevelUpRevealProps {
    isOpen: boolean;
    onClose: () => void;
    newLevel: number;
}

export const LevelUpReveal: React.FC<LevelUpRevealProps> = ({
    isOpen,
    onClose,
    newLevel
}) => {
    const [phase, setPhase] = useState<'shaking' | 'flash' | 'reveal'>('shaking');

    useEffect(() => {
        if (isOpen) {
            setPhase('shaking');
            const t1 = setTimeout(() => setPhase('flash'), 800);
            const t2 = setTimeout(() => setPhase('reveal'), 1100);
            return () => { clearTimeout(t1); clearTimeout(t2); };
        }
    }, [isOpen]);

    const particles = useMemo(() =>
        Array.from({ length: 40 }, (_, i) => ({
            id: i,
            angle: (360 / 40) * i + (Math.random() * 15),
            delay: Math.random() * 0.3,
            distance: 100 + Math.random() * 80,
            size: Math.random() * 5 + 3,
        })), []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

                    {/* Rotating Light Beams */}
                    {phase === 'reveal' && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center -z-10"
                            initial={{ opacity: 0, rotate: 0 }}
                            animate={{ opacity: 0.4, rotate: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                        >
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-[3px] h-[150vmax] origin-[50%_0%]"
                                    style={{
                                        backgroundColor: LEVEL_COLOR,
                                        transform: `rotate(${i * 30}deg) translateY(50%)`,
                                        boxShadow: `0 0 50px 5px ${LEVEL_COLOR}`
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* Flash Effect */}
                    {phase === 'flash' && (
                        <motion.div
                            className="absolute inset-0 z-50 bg-yellow-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.3 }}
                        />
                    )}

                    <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-md">
                        {/* Close button */}
                        {phase === 'reveal' && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 }}
                                className="absolute top-[-80px] right-0 p-3 bg-slate-900/80 rounded-full text-slate-400 hover:text-white border border-slate-700"
                                onClick={onClose}
                            >
                                <X size={24} />
                            </motion.button>
                        )}

                        {/* Icon Container */}
                        <div className="relative h-48 flex items-center justify-center">
                            <motion.div
                                className="absolute inset-0 rounded-full blur-3xl -z-10"
                                style={{ backgroundColor: LEVEL_COLOR }}
                                animate={{ scale: phase === 'reveal' ? [1, 1.8, 1.2] : 1, opacity: 0.5 }}
                            />

                            {phase === 'shaking' && (
                                <motion.div
                                    className="w-28 h-28 rounded-2xl flex items-center justify-center"
                                    style={{ backgroundColor: `${LEVEL_COLOR}20`, border: `3px solid ${LEVEL_COLOR}`, boxShadow: `0 0 50px ${LEVEL_COLOR}` }}
                                    animate={{ rotate: [0, -10, 10, -10, 10, -5, 5, 0], scale: [1, 1.15, 1, 1.15, 1] }}
                                    transition={{ duration: 0.5, repeat: 1 }}
                                >
                                    <ChevronUp size={56} style={{ color: LEVEL_COLOR }} />
                                </motion.div>
                            )}

                            {/* Particles */}
                            {phase !== 'shaking' && particles.map((p) => (
                                <motion.div
                                    key={p.id}
                                    className="absolute left-1/2 top-1/2 rounded-full"
                                    style={{ backgroundColor: p.id % 3 === 0 ? '#fff' : LEVEL_COLOR, width: p.size, height: p.size }}
                                    initial={{ x: 0, y: 0, opacity: 1 }}
                                    animate={{ x: Math.cos(p.angle * Math.PI / 180) * p.distance, y: Math.sin(p.angle * Math.PI / 180) * p.distance, opacity: 0 }}
                                    transition={{ duration: 0.8, delay: p.delay }}
                                />
                            ))}
                        </div>

                        {/* Content */}
                        {phase === 'reveal' && (
                            <motion.div
                                className="w-full flex flex-col items-center"
                                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                {/* Banner */}
                                <motion.div
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="mb-4 relative"
                                >
                                    <div className="absolute inset-0 blur-md" style={{ backgroundColor: LEVEL_COLOR }} />
                                    <h2 className="relative text-4xl font-black italic uppercase tracking-widest" style={{
                                        color: LEVEL_COLOR,
                                        textShadow: `0 0 30px ${LEVEL_COLOR}`
                                    }}>
                                        ¡LEVEL UP!
                                    </h2>
                                </motion.div>

                                {/* Level Number */}
                                <motion.div
                                    className="relative p-1 rounded-full"
                                    style={{ background: `linear-gradient(135deg, ${LEVEL_COLOR}, #92400e)` }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: 'spring' }}
                                >
                                    <div className="w-32 h-32 rounded-full bg-slate-950 flex items-center justify-center">
                                        <motion.span
                                            className="text-6xl font-black font-mono"
                                            style={{ color: LEVEL_COLOR, textShadow: `0 0 20px ${LEVEL_COLOR}` }}
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        >
                                            {newLevel}
                                        </motion.span>
                                    </div>
                                </motion.div>

                                {/* Stats Gained */}
                                <motion.p
                                    className="mt-6 text-sm uppercase tracking-wider font-bold"
                                    style={{ color: LEVEL_COLOR }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Todas las estadísticas +1
                                </motion.p>

                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    onClick={onClose}
                                    className="mt-6 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-yellow-500 to-amber-600 text-black"
                                >
                                    ¡Genial!
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ============ STAT INCREASE REVEAL ============
interface StatIncreaseRevealProps {
    isOpen: boolean;
    onClose: () => void;
    statName: StatType;
    oldValue: number;
    newValue: number;
}

export const StatIncreaseReveal: React.FC<StatIncreaseRevealProps> = ({
    isOpen,
    onClose,
    statName,
    oldValue,
    newValue
}) => {
    const [phase, setPhase] = useState<'shaking' | 'reveal'>('shaking');
    const [displayValue, setDisplayValue] = useState(oldValue);
    const colors = statColors[statName] || { main: '#3b82f6', glow: 'rgba(59,130,246,0.5)' };
    const increase = newValue - oldValue;

    useEffect(() => {
        if (isOpen) {
            setPhase('shaking');
            setDisplayValue(oldValue);
            const t1 = setTimeout(() => setPhase('reveal'), 600);
            return () => clearTimeout(t1);
        }
    }, [isOpen, oldValue]);

    // Animate counter
    useEffect(() => {
        if (phase === 'reveal') {
            const duration = 800;
            const start = performance.now();

            const animate = (time: number) => {
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setDisplayValue(Math.round(oldValue + increase * eased));
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }
    }, [phase, oldValue, increase]);

    const particles = useMemo(() =>
        Array.from({ length: 16 }, (_, i) => ({
            id: i,
            angle: (360 / 16) * i + (Math.random() * 15),
            delay: Math.random() * 0.2,
            distance: 60 + Math.random() * 40,
            size: Math.random() * 4 + 2,
        })), []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

                    <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-md">
                        {/* Close button */}
                        {phase === 'reveal' && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 }}
                                className="absolute top-[-80px] right-0 p-3 bg-slate-900/80 rounded-full text-slate-400 hover:text-white border border-slate-700"
                                onClick={onClose}
                            >
                                <X size={24} />
                            </motion.button>
                        )}

                        {/* Icon Container */}
                        <div className="relative h-36 flex items-center justify-center">
                            <motion.div
                                className="absolute inset-0 rounded-full blur-3xl -z-10"
                                style={{ backgroundColor: colors.glow }}
                                animate={{ scale: phase === 'reveal' ? [1, 1.5, 1] : 1 }}
                            />

                            {phase === 'shaking' && (
                                <motion.div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                    style={{ backgroundColor: `${colors.main}20`, border: `3px solid ${colors.main}`, boxShadow: `0 0 40px ${colors.glow}` }}
                                    animate={{ rotate: [0, -6, 6, -6, 6, 0], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.4, repeat: 1 }}
                                >
                                    <TrendingUp size={40} style={{ color: colors.main }} />
                                </motion.div>
                            )}

                            {/* Particles */}
                            {phase !== 'shaking' && particles.map((p) => (
                                <motion.div
                                    key={p.id}
                                    className="absolute left-1/2 top-1/2 rounded-full"
                                    style={{ backgroundColor: colors.main, width: p.size, height: p.size }}
                                    initial={{ x: 0, y: 0, opacity: 1 }}
                                    animate={{ x: Math.cos(p.angle * Math.PI / 180) * p.distance, y: Math.sin(p.angle * Math.PI / 180) * p.distance, opacity: 0 }}
                                    transition={{ duration: 0.5, delay: p.delay }}
                                />
                            ))}
                        </div>

                        {/* Content */}
                        {phase === 'reveal' && (
                            <motion.div
                                className="w-full flex flex-col items-center"
                                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                {/* Type Badge */}
                                <motion.div
                                    className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-slate-900 border"
                                    style={{ borderColor: colors.main }}
                                >
                                    <StatIcon stat={statName} size={18} />
                                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.main }}>
                                        {statName}
                                    </span>
                                </motion.div>

                                {/* Value Card */}
                                <motion.div
                                    className="relative p-1 rounded-2xl w-full max-w-xs"
                                    style={{ background: `linear-gradient(135deg, ${colors.main}, ${colors.main}50)` }}
                                >
                                    <div className="bg-slate-950/90 backdrop-blur-xl rounded-xl p-6 flex flex-col items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl" style={{ backgroundColor: `${colors.main}20`, border: `2px solid ${colors.main}` }}>
                                                <StatIcon stat={statName} size={32} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-5xl font-black font-mono" style={{ color: colors.main }}>
                                                    {displayValue}
                                                </span>
                                                <motion.span
                                                    className="text-xl font-bold font-mono self-end"
                                                    style={{ color: colors.main }}
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 0.5, repeat: Infinity }}
                                                >
                                                    +{increase}
                                                </motion.span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    onClick={onClose}
                                    className="mt-6 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all"
                                    style={{ background: `linear-gradient(90deg, ${colors.main}, ${colors.main}cc)`, color: '#fff' }}
                                >
                                    ¡Genial!
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ============ SHARDS GAIN REVEAL ============
const SHARD_COLOR = '#a855f7'; // Purple

interface ShardsGainRevealProps {
    isOpen: boolean;
    onClose: () => void;
    shardsGained: number;
    totalShards: number;
}

export const ShardsGainReveal: React.FC<ShardsGainRevealProps> = ({
    isOpen,
    onClose,
    shardsGained,
    totalShards
}) => {
    const [phase, setPhase] = useState<'shaking' | 'reveal'>('shaking');
    const [displayShards, setDisplayShards] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setPhase('shaking');
            setDisplayShards(0);
            const t1 = setTimeout(() => setPhase('reveal'), 600);
            return () => clearTimeout(t1);
        }
    }, [isOpen]);

    // Animate counter
    useEffect(() => {
        if (phase === 'reveal') {
            const duration = 1000;
            const start = performance.now();

            const animate = (time: number) => {
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setDisplayShards(Math.round(shardsGained * eased));
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }
    }, [phase, shardsGained]);

    const particles = useMemo(() =>
        Array.from({ length: 24 }, (_, i) => ({
            id: i,
            angle: (360 / 24) * i + (Math.random() * 15),
            delay: Math.random() * 0.2,
            distance: 70 + Math.random() * 50,
            size: Math.random() * 5 + 2,
        })), []);

    const isHighAmount = shardsGained >= 100;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

                    {/* Light beams for high amounts */}
                    {isHighAmount && phase === 'reveal' && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center -z-10"
                            initial={{ opacity: 0, rotate: 0 }}
                            animate={{ opacity: 0.2, rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-[2px] h-[150vmax] origin-[50%_0%]"
                                    style={{
                                        backgroundColor: SHARD_COLOR,
                                        transform: `rotate(${i * 45}deg) translateY(50%)`,
                                        boxShadow: `0 0 30px 3px ${SHARD_COLOR}`
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}

                    <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-md">
                        {/* Close button */}
                        {phase === 'reveal' && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 }}
                                className="absolute top-[-80px] right-0 p-3 bg-slate-900/80 rounded-full text-slate-400 hover:text-white border border-slate-700"
                                onClick={onClose}
                            >
                                <X size={24} />
                            </motion.button>
                        )}

                        {/* Icon Container */}
                        <div className="relative h-40 flex items-center justify-center">
                            <motion.div
                                className="absolute inset-0 rounded-full blur-3xl -z-10"
                                style={{ backgroundColor: SHARD_COLOR }}
                                animate={{ scale: phase === 'reveal' ? [1, 1.5, 1] : 1, opacity: 0.4 }}
                            />

                            {phase === 'shaking' && (
                                <motion.div
                                    className="w-24 h-24 rounded-2xl flex items-center justify-center"
                                    style={{ backgroundColor: `${SHARD_COLOR}20`, border: `3px solid ${SHARD_COLOR}`, boxShadow: `0 0 40px ${SHARD_COLOR}` }}
                                    animate={{ rotate: [0, -8, 8, -8, 8, 0], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.4, repeat: 1 }}
                                >
                                    {/* Diamond/Gem icon */}
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={SHARD_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 3h12l4 6-10 13L2 9z" />
                                        <path d="M12 22V9" />
                                        <path d="M2 9h20" />
                                        <path d="m6 3 6 6" />
                                        <path d="m18 3-6 6" />
                                    </svg>
                                </motion.div>
                            )}

                            {/* Particles */}
                            {phase !== 'shaking' && particles.map((p) => (
                                <motion.div
                                    key={p.id}
                                    className="absolute left-1/2 top-1/2 rounded-full"
                                    style={{ backgroundColor: p.id % 3 === 0 ? '#e879f9' : SHARD_COLOR, width: p.size, height: p.size }}
                                    initial={{ x: 0, y: 0, opacity: 1 }}
                                    animate={{ x: Math.cos(p.angle * Math.PI / 180) * p.distance, y: Math.sin(p.angle * Math.PI / 180) * p.distance, opacity: 0 }}
                                    transition={{ duration: 0.6, delay: p.delay }}
                                />
                            ))}
                        </div>

                        {/* Content */}
                        {phase === 'reveal' && (
                            <motion.div
                                className="w-full flex flex-col items-center"
                                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                {/* Type Badge */}
                                <motion.div
                                    className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-slate-900 border"
                                    style={{ borderColor: SHARD_COLOR }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={SHARD_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 3h12l4 6-10 13L2 9z" />
                                    </svg>
                                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: SHARD_COLOR }}>
                                        Fragmentos
                                    </span>
                                </motion.div>

                                {/* Shards Amount */}
                                <motion.h2
                                    className="text-5xl font-black font-mono mb-2"
                                    style={{ color: SHARD_COLOR, textShadow: `0 0 20px ${SHARD_COLOR}` }}
                                >
                                    +{displayShards}
                                </motion.h2>

                                {/* Total Card */}
                                <motion.div
                                    className="relative p-1 rounded-2xl w-full max-w-xs mt-4"
                                    style={{ background: `linear-gradient(135deg, ${SHARD_COLOR}, #581c87)`, boxShadow: `0 0 30px ${SHARD_COLOR}50` }}
                                >
                                    <div className="bg-slate-950/90 backdrop-blur-xl rounded-xl p-6 flex flex-col items-center">
                                        <span className="text-sm text-slate-400 mb-2">Total de Fragmentos</span>
                                        <span className="text-3xl font-bold font-mono" style={{ color: SHARD_COLOR }}>
                                            {totalShards.toLocaleString()}
                                        </span>
                                    </div>
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    onClick={onClose}
                                    className="mt-6 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white"
                                >
                                    ¡Genial!
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ============ BATCH COSMETIC REVEAL ============

interface CosmeticBatchRevealProps {
    isOpen: boolean;
    onClose: () => void;
    items: Array<{ cosmeticType: 'title' | 'frame'; cosmetic: any }>;
}

export const CosmeticBatchReveal: React.FC<CosmeticBatchRevealProps> = ({
    isOpen,
    onClose,
    items
}) => {
    const [phase, setPhase] = useState<'shaking' | 'flash' | 'reveal'>('shaking');

    useEffect(() => {
        if (isOpen) {
            setPhase('shaking');
            // Shake duration
            const t1 = setTimeout(() => setPhase('flash'), 800);
            // Flash duration to Reveal
            const t2 = setTimeout(() => setPhase('reveal'), 1100);
            return () => { clearTimeout(t1); clearTimeout(t2); };
        }
    }, [isOpen]);

    const particles = useMemo(() =>
        Array.from({ length: 30 }, (_, i) => ({
            id: i,
            angle: (360 / 30) * i + (Math.random() * 20 - 10),
            delay: Math.random() * 0.3,
            distance: 90 + Math.random() * 60,
            size: Math.random() * 4 + 2,
            color: i % 2 === 0 ? '#fbbf24' : '#22d3ee' // Gold (Titles) & Cyan (Frames) mix
        })), []);

    // Helper to get rarity color
    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'legendary': return '#a855f7'; // Purple
            case 'epic': return '#ef4444';      // Red
            case 'rare': return '#3b82f6';      // Blue
            case 'uncommon': return '#22c55e';  // Green
            default: return '#94a3b8';          // Gray
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
                    <motion.div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

                    {/* Rotating Beams */}
                    {phase === 'reveal' && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center -z-10"
                            initial={{ opacity: 0, rotate: 0 }}
                            animate={{ opacity: 0.3, rotate: 360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                        >
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-[2px] h-[150vmax] origin-[50%_0%]"
                                    style={{
                                        backgroundColor: '#fbbf24', // Gold base
                                        transform: `rotate(${i * 36}deg) translateY(50%)`,
                                        boxShadow: `0 0 40px 2px #fbbf24`
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* Flash Effect */}
                    {phase === 'flash' && (
                        <motion.div
                            className="absolute inset-0 z-50 bg-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.3 }}
                        />
                    )}

                    <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-lg h-full max-h-screen py-10 justify-center">
                        {/* Shaking Box Concept */}
                        {phase === 'shaking' && (
                            <motion.div
                                className="w-32 h-32 rounded-2xl flex items-center justify-center bg-slate-900 border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.5)]"
                                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            >
                                <Sparkles size={64} className="text-yellow-400" />
                            </motion.div>
                        )}

                        {/* Particles Explosion */}
                        {phase !== 'shaking' && particles.map((p) => (
                            <motion.div
                                key={p.id}
                                className="absolute left-1/2 top-1/2 rounded-full"
                                style={{ backgroundColor: p.color, width: p.size, height: p.size }}
                                initial={{ x: 0, y: 0, opacity: 1 }}
                                animate={{ x: Math.cos(p.angle * Math.PI / 180) * p.distance * 1.5, y: Math.sin(p.angle * Math.PI / 180) * p.distance * 1.5, opacity: 0 }}
                                transition={{ duration: 0.8, delay: p.delay }}
                            />
                        ))}

                        {/* REVEAL CONTENT */}
                        {phase === 'reveal' && (
                            <motion.div
                                className="flex flex-col items-center w-full"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', damping: 20 }}
                            >
                                {/* Header */}
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="mb-6 text-center"
                                >
                                    <h2 className="text-3xl font-black italic uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-lg">
                                        ¡Recompensas Múltiples!
                                    </h2>
                                    <p className="text-yellow-200/60 text-sm font-bold tracking-widest mt-1">
                                        Has desbloqueado {items.length} nuevos objetos
                                    </p>
                                </motion.div>

                                {/* GRID OF ITEMS */}
                                <div className="grid grid-cols-2 gap-3 w-full max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map((item, i) => {
                                        const rarity = item.cosmetic.rarity || 'common';
                                        const color = getRarityColor(rarity);

                                        return (
                                            <motion.div
                                                key={i}
                                                className="relative p-[1px] rounded-xl overflow-hidden group"
                                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
                                            >
                                                <div className="bg-slate-950/90 h-full p-3 rounded-[11px] flex items-center gap-3 hover:bg-slate-900 transition-colors">
                                                    {/* Icon */}
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                                        style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
                                                    >
                                                        {item.cosmeticType === 'title' ? (
                                                            <Crown size={20} style={{ color }} />
                                                        ) : (
                                                            <Image size={20} style={{ color }} />
                                                        )}
                                                    </div>

                                                    {/* Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1 mb-0.5">
                                                            <span
                                                                className="text-[10px] font-bold uppercase tracking-wider"
                                                                style={{ color }}
                                                            >
                                                                {item.cosmeticType === 'title' ? 'Título' : 'Marco'}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs font-bold text-slate-200 truncate">
                                                            {item.cosmetic.name}
                                                        </div>
                                                    </div>

                                                    {/* Checkmark */}
                                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                                        <Check size={12} className="text-green-400" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Close Button */}
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 + items.length * 0.1 }}
                                    onClick={onClose}
                                    className="mt-8 px-10 py-3 rounded-xl font-bold text-sm uppercase tracking-wider bg-white text-black hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                >
                                    Continuar
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
