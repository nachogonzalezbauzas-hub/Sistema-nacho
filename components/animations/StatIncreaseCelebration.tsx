import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { StatType } from '@/types';
import { StatIcon } from '@/components';

interface StatIncreaseCelebrationProps {
    statName: StatType;
    oldValue: number;
    newValue: number;
    onComplete?: () => void;
}

const statColors: Record<StatType, { main: string; glow: string }> = {
    Strength: { main: '#ef4444', glow: 'rgba(239,68,68,0.5)' },
    Vitality: { main: '#22c55e', glow: 'rgba(34,197,94,0.5)' },
    Agility: { main: '#eab308', glow: 'rgba(234,179,8,0.5)' },
    Intelligence: { main: '#3b82f6', glow: 'rgba(59,130,246,0.5)' },
    Fortune: { main: '#10b981', glow: 'rgba(16,185,129,0.5)' },
    Metabolism: { main: '#f97316', glow: 'rgba(249,115,22,0.5)' },
};

export const StatIncreaseCelebration: React.FC<StatIncreaseCelebrationProps> = ({
    statName,
    oldValue,
    newValue,
    onComplete
}) => {
    const [displayValue, setDisplayValue] = useState(oldValue);
    const [showParticles, setShowParticles] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const colors = statColors[statName] || { main: '#3b82f6', glow: 'rgba(59,130,246,0.5)' };
    const increase = newValue - oldValue;

    useEffect(() => {
        // Animate the number counting up
        const duration = 800; // ms
        const steps = Math.min(increase, 20);
        const stepDuration = duration / steps;
        let currentStep = 0;

        setShowParticles(true);

        const interval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setDisplayValue(Math.round(oldValue + increase * easedProgress));

            if (currentStep >= steps) {
                clearInterval(interval);
                setDisplayValue(newValue);

                // Fade out after showing final value
                setTimeout(() => {
                    setIsVisible(false);
                    setTimeout(() => onComplete?.(), 300);
                }, 1500);
            }
        }, stepDuration);

        return () => clearInterval(interval);
    }, [oldValue, newValue, increase, onComplete]);

    const particles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: (360 / 8) * i + Math.random() * 20,
        distance: 40 + Math.random() * 30,
        delay: Math.random() * 0.2,
    }));

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Semi-transparent backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Main content */}
                    <motion.div
                        className="relative flex flex-col items-center"
                        initial={{ scale: 0.5, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: -30 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        {/* Glow behind icon */}
                        <motion.div
                            className="absolute w-40 h-40 rounded-full blur-3xl -z-10"
                            style={{ backgroundColor: colors.glow }}
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />

                        {/* Stat Icon */}
                        <motion.div
                            className="relative mb-4"
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                style={{
                                    backgroundColor: `${colors.main}20`,
                                    border: `3px solid ${colors.main}`,
                                    boxShadow: `0 0 30px ${colors.glow}`,
                                }}
                            >
                                <StatIcon stat={statName} size={40} />
                            </div>

                            {/* Particles around icon */}
                            {showParticles && particles.map((p) => (
                                <motion.div
                                    key={p.id}
                                    className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                                    style={{ backgroundColor: colors.main }}
                                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                    animate={{
                                        x: Math.cos(p.angle * Math.PI / 180) * p.distance,
                                        y: Math.sin(p.angle * Math.PI / 180) * p.distance,
                                        opacity: [1, 1, 0],
                                        scale: [1, 1.5, 0],
                                    }}
                                    transition={{ duration: 0.8, delay: p.delay, ease: 'easeOut' }}
                                />
                            ))}
                        </motion.div>

                        {/* Stat Name */}
                        <motion.h3
                            className="text-lg font-bold uppercase tracking-widest mb-2"
                            style={{ color: colors.main }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            {statName}
                        </motion.h3>

                        {/* Value Display */}
                        <motion.div
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                        >
                            <span className="text-4xl font-black text-white font-mono">
                                {displayValue}
                            </span>
                            <motion.span
                                className="text-2xl font-black font-mono"
                                style={{ color: colors.main }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [1, 0.8, 1],
                                }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            >
                                +{increase}
                            </motion.span>
                        </motion.div>

                        {/* Sparkle decoration */}
                        <motion.div
                            className="absolute -right-4 top-0"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        >
                            <Sparkles size={20} style={{ color: colors.main }} />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
