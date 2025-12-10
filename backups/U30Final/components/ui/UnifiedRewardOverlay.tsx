import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RewardItem } from '../../types';
import { useStore } from '../../store';
import { Crown, Zap, Star, Trophy, ArrowUp, Package } from 'lucide-react';

interface UnifiedRewardOverlayProps {
    queue: RewardItem[];
    onClear: () => void;
}

export const UnifiedRewardOverlay: React.FC<UnifiedRewardOverlayProps> = ({ queue, onClear }) => {
    const [currentRewardIndex, setCurrentRewardIndex] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [powerGain, setPowerGain] = useState(0);
    const { getTotalPower } = useStore();
    const [initialPower, setInitialPower] = useState(0);

    useEffect(() => {
        if (queue.length > 0 && currentRewardIndex === 0 && !showSummary) {
            // Capture initial power before animations start (conceptually, though state is already updated)
            // Ideally we'd capture this before the state update, but for now we can estimate or just show the delta if we tracked it.
            // Since we didn't track "prevPower" in store, we'll calculate a theoretical gain based on the rewards.

            let estimatedGain = 0;
            queue.forEach(r => {
                if (r.type === 'levelup') estimatedGain += 1000; // 10 * 100 scaling
                if (r.type === 'title') estimatedGain += 5000; // Avg title * 100
                if (r.type === 'item') estimatedGain += 2000; // Avg item * 100
                if (r.powerGain) estimatedGain += r.powerGain;
            });
            setPowerGain(estimatedGain);

            // Play SFX
            const audio = new Audio('/audio/levelup.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => { });
        }
    }, [queue]);

    useEffect(() => {
        if (currentRewardIndex >= queue.length && queue.length > 0) {
            setShowSummary(true);
        }
    }, [currentRewardIndex, queue.length]);

    const handleNext = () => {
        if (currentRewardIndex < queue.length) {
            setCurrentRewardIndex(prev => prev + 1);
        } else {
            setShowSummary(true);
        }
    };

    const handleClose = () => {
        onClear();
        setCurrentRewardIndex(0);
        setShowSummary(false);
    };

    if (queue.length === 0) return null;

    const currentReward = queue[currentRewardIndex];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md pointer-events-auto"
                onClick={showSummary ? handleClose : handleNext}
            >
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(59,130,246,0.1)_20deg,transparent_40deg,rgba(59,130,246,0.1)_60deg,transparent_80deg,rgba(59,130,246,0.1)_100deg,transparent_120deg)] animate-[spin_20s_linear_infinite]"></div>
                </div>

                {/* REWARD CARD */}
                {!showSummary && currentReward && (
                    <motion.div
                        key={currentReward.id}
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
                        transition={{ type: "spring", damping: 15 }}
                        className="relative z-10"
                    >
                        <div className="relative bg-[#050a14] border-2 border-blue-500 p-12 rounded-xl shadow-[0_0_100px_rgba(37,99,235,0.6)] text-center min-w-[320px] max-w-md overflow-hidden">

                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="text-8xl mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                            >
                                {currentReward.icon || '🎁'}
                            </motion.div>

                            {/* Type Label */}
                            <div className="text-blue-400 font-bold uppercase tracking-[0.3em] text-xs mb-2">
                                {currentReward.type.replace('_', ' ')}
                            </div>

                            {/* Name */}
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl font-black text-white mb-4 uppercase tracking-tight"
                            >
                                {currentReward.name}
                            </motion.h2>

                            {/* Value/Description */}
                            {currentReward.value && (
                                <div className="text-2xl font-mono text-blue-300 font-bold">
                                    {typeof currentReward.value === 'number' ? `+${currentReward.value}` : currentReward.value}
                                </div>
                            )}

                            <div className="mt-8 text-[10px] text-slate-500 uppercase tracking-widest">
                                Tap to continue
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* SUMMARY CARD */}
                {showSummary && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative z-10"
                    >
                        <div className="bg-[#050a14] border-2 border-yellow-500/50 p-12 rounded-xl shadow-[0_0_100px_rgba(234,179,8,0.4)] text-center min-w-[350px]">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black px-4">
                                <Crown size={48} className="text-yellow-400 animate-bounce" />
                            </div>

                            <h2 className="text-3xl font-black text-yellow-100 uppercase tracking-widest mb-8 mt-4">
                                Ascension Complete
                            </h2>

                            <div className="flex flex-col items-center gap-2 mb-8">
                                <span className="text-yellow-500/80 font-bold uppercase tracking-[0.2em] text-xs">Total Power Gained</span>
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1.2 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="text-6xl font-black text-white font-mono drop-shadow-[0_0_30px_rgba(234,179,8,0.6)]"
                                >
                                    +{powerGain.toLocaleString()}
                                </motion.span>
                            </div>

                            <button
                                onClick={handleClose}
                                className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-black font-black uppercase tracking-widest rounded transition-colors"
                            >
                                Accept Power
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};
