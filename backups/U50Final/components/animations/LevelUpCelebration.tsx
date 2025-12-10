import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Zap, ChevronUp, Dumbbell, Heart, Wind, Brain, Clover, Flame } from 'lucide-react';

interface LevelUpCelebrationProps {
    newLevel: number;
    onComplete?: () => void;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
    newLevel,
    onComplete
}) => {
    const [phase, setPhase] = useState<'intro' | 'number' | 'stats' | 'done'>('intro');

    useEffect(() => {
        // Longer timing for better visibility
        const timer1 = setTimeout(() => setPhase('number'), 600);
        const timer2 = setTimeout(() => setPhase('stats'), 1800);
        const timer3 = setTimeout(() => {
            setPhase('done');
            setTimeout(() => onComplete?.(), 400);
        }, 4500); // Extended to 4.5 seconds total

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    const particles = Array.from({ length: 24 }, (_, i) => ({
        id: i,
        angle: (360 / 24) * i,
        distance: 100 + Math.random() * 80,
        delay: Math.random() * 0.3,
        size: 4 + Math.random() * 6,
    }));

    const stars = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 300,
        delay: Math.random() * 0.5,
        scale: 0.5 + Math.random() * 0.5,
    }));

    return (
        <AnimatePresence>
            {phase !== 'done' && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Backdrop with radial gradient */}
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, rgba(0,0,0,0.95) 70%)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />

                    {/* Light rays from center */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.3, scale: 2 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div
                            className="w-full h-full"
                            style={{
                                background: 'conic-gradient(from 0deg, transparent, rgba(59,130,246,0.2), transparent, rgba(59,130,246,0.2), transparent)',
                            }}
                        />
                    </motion.div>

                    {/* Main Content */}
                    <div className="relative flex flex-col items-center">

                        {/* Explosion Particles */}
                        {phase !== 'intro' && particles.map((p) => (
                            <motion.div
                                key={p.id}
                                className="absolute rounded-full"
                                style={{
                                    backgroundColor: '#3b82f6',
                                    width: p.size,
                                    height: p.size,
                                    boxShadow: '0 0 10px rgba(59,130,246,0.8)',
                                }}
                                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                animate={{
                                    x: Math.cos(p.angle * Math.PI / 180) * p.distance,
                                    y: Math.sin(p.angle * Math.PI / 180) * p.distance,
                                    opacity: [1, 1, 0],
                                    scale: [1, 1.5, 0],
                                }}
                                transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
                            />
                        ))}

                        {/* Floating stars */}
                        {phase !== 'intro' && stars.map((s) => (
                            <motion.div
                                key={s.id}
                                className="absolute"
                                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                                animate={{
                                    x: s.x,
                                    y: s.y,
                                    opacity: [0, 1, 1, 0],
                                    scale: [0, s.scale, s.scale, 0],
                                }}
                                transition={{ duration: 2, delay: s.delay }}
                            >
                                <Star size={20} className="text-yellow-400" fill="currentColor" />
                            </motion.div>
                        ))}

                        {/* "LEVEL UP" Text */}
                        <motion.div
                            className="relative"
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                            {/* Glow behind text */}
                            <motion.div
                                className="absolute inset-0 blur-2xl -z-10"
                                style={{ backgroundColor: 'rgba(59,130,246,0.6)' }}
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.6, 1, 0.6],
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />

                            <motion.div className="flex items-center gap-2 mb-2">
                                <ChevronUp size={32} className="text-blue-400" />
                                <h2
                                    className="text-3xl font-black uppercase tracking-[0.2em] text-blue-400"
                                    style={{
                                        textShadow: '0 0 20px rgba(59,130,246,0.8), 0 0 40px rgba(59,130,246,0.4)',
                                    }}
                                >
                                    LEVEL UP
                                </h2>
                                <ChevronUp size={32} className="text-blue-400" />
                            </motion.div>
                        </motion.div>

                        {/* Level Number */}
                        {phase !== 'intro' && (
                            <motion.div
                                className="relative mt-4"
                                initial={{ scale: 0, y: 30 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                            >
                                <motion.span
                                    className="text-8xl font-black text-white font-mono"
                                    style={{
                                        textShadow: '0 0 30px rgba(59,130,246,0.8), 0 0 60px rgba(59,130,246,0.4)',
                                    }}
                                    animate={{
                                        textShadow: [
                                            '0 0 30px rgba(59,130,246,0.8), 0 0 60px rgba(59,130,246,0.4)',
                                            '0 0 50px rgba(59,130,246,1), 0 0 100px rgba(59,130,246,0.6)',
                                            '0 0 30px rgba(59,130,246,0.8), 0 0 60px rgba(59,130,246,0.4)',
                                        ],
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    {newLevel}
                                </motion.span>
                            </motion.div>
                        )}

                        {/* Stats Gained Message */}
                        {phase === 'stats' && (
                            <motion.div
                                className="mt-6 flex flex-col items-center gap-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <p className="text-sm text-blue-300 uppercase tracking-widest font-bold">
                                    TODAS LAS ESTADISTICAS +1
                                </p>
                                <div className="flex gap-4 mt-3">
                                    {[
                                        { icon: Dumbbell, color: 'text-red-400', label: 'STR' },
                                        { icon: Heart, color: 'text-pink-400', label: 'VIT' },
                                        { icon: Wind, color: 'text-cyan-400', label: 'AGI' },
                                        { icon: Brain, color: 'text-purple-400', label: 'INT' },
                                        { icon: Clover, color: 'text-green-400', label: 'FOR' },
                                        { icon: Flame, color: 'text-orange-400', label: 'MET' },
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex flex-col items-center gap-1"
                                            initial={{ scale: 0, y: 20 }}
                                            animate={{ scale: 1, y: 0 }}
                                            transition={{ delay: 0.4 + i * 0.12, type: 'spring', stiffness: 300 }}
                                        >
                                            <stat.icon size={28} className={stat.color} />
                                            <span className="text-[10px] text-slate-400 font-bold">+1</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Sparkle decorations */}
                        <motion.div
                            className="absolute -right-10 -top-10"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        >
                            <Sparkles size={24} className="text-yellow-400" />
                        </motion.div>
                        <motion.div
                            className="absolute -left-10 -bottom-10"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        >
                            <Zap size={24} className="text-blue-400" />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
