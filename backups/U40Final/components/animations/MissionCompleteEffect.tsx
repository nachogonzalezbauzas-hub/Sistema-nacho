import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

interface MissionCompleteEffectProps {
    isVisible: boolean;
    xpGained: number;
    statGained?: { stat: string; amount: number };
    onComplete?: () => void;
}

export const MissionCompleteEffect: React.FC<MissionCompleteEffectProps> = ({
    isVisible,
    xpGained,
    statGained,
    onComplete,
}) => {
    const [phase, setPhase] = useState<'check' | 'rewards' | 'done'>('check');

    useEffect(() => {
        if (isVisible) {
            setPhase('check');
            const timer1 = setTimeout(() => setPhase('rewards'), 400);
            const timer2 = setTimeout(() => {
                setPhase('done');
                onComplete?.();
            }, 1200);
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [isVisible, onComplete]);

    const particles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 60,
        y: -30 - Math.random() * 40,
        delay: Math.random() * 0.2,
    }));

    return (
        <AnimatePresence>
            {isVisible && phase !== 'done' && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Background glow */}
                    <motion.div
                        className="absolute inset-0 bg-green-500/10 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ duration: 0.8 }}
                    />

                    {/* Checkmark */}
                    <motion.div
                        className="relative"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.3, 1] }}
                        transition={{ duration: 0.4, type: 'spring' }}
                    >
                        <motion.div
                            className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center"
                            style={{
                                boxShadow: '0 0 30px rgba(34,197,94,0.6)',
                            }}
                            animate={{
                                boxShadow: [
                                    '0 0 30px rgba(34,197,94,0.6)',
                                    '0 0 60px rgba(34,197,94,0.8)',
                                    '0 0 30px rgba(34,197,94,0.6)',
                                ],
                            }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                            >
                                <Check size={32} className="text-white" strokeWidth={3} />
                            </motion.div>
                        </motion.div>

                        {/* Sparkle particles */}
                        {particles.map((p) => (
                            <motion.div
                                key={p.id}
                                className="absolute left-1/2 top-1/2"
                                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                animate={{
                                    x: p.x,
                                    y: p.y,
                                    opacity: [1, 1, 0],
                                    scale: [0.5, 1, 0],
                                }}
                                transition={{ duration: 0.6, delay: p.delay }}
                            >
                                <Sparkles size={12} className="text-green-400" />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* XP Gained */}
                    {phase === 'rewards' && (
                        <motion.div
                            className="absolute top-0 left-1/2 -translate-x-1/2"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: -10, opacity: 1 }}
                            exit={{ y: -30, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <span className="text-lg font-black text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                                +{xpGained} XP
                            </span>
                        </motion.div>
                    )}

                    {/* Stat Gained */}
                    {phase === 'rewards' && statGained && (
                        <motion.div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 10, opacity: 1 }}
                            exit={{ y: 30, opacity: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <span className="text-sm font-bold text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                                +{statGained.amount} {statGained.stat}
                            </span>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
