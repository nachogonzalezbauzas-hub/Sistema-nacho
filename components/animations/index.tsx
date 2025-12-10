import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatIncreaseCelebration } from './StatIncreaseCelebration';
import { CosmeticUnlockOverlay } from './CosmeticUnlockOverlay';
import { AchievementPopup } from './AchievementPopup';
import { LevelUpCelebration } from './LevelUpCelebration';
import { UniversalRewardReveal } from './UniversalRewardReveal';
import { XPGainReveal, LevelUpReveal, StatIncreaseReveal } from './ProgressRevealAnimations';
import { StatType, Title, AvatarFrame, Equipment } from '@/types';
import { X, Crown, Image, Sparkles } from 'lucide-react';

// Animation event types
type AnimationEvent =
    | { type: 'stat_increase'; statName: StatType; oldValue: number; newValue: number }
    | { type: 'cosmetic_unlock'; cosmeticType: 'title' | 'frame' | 'avatar'; cosmetic: Title | AvatarFrame | any }
    | { type: 'cosmetic_batch'; items: Array<{ cosmeticType: 'title' | 'frame'; cosmetic: any }> }
    | { type: 'achievement'; title: string; description?: string; icon?: React.ReactNode; achievementType?: 'achievement' | 'milestone' | 'quest' }
    | { type: 'level_up'; newLevel: number }
    | { type: 'equipment_reward'; equipment: Equipment }
    | { type: 'xp_gain'; xpGained: number; oldXP: number; newXP: number; xpToNextLevel: number; currentLevel: number };

interface AnimationQueueContextType {
    enqueueAnimation: (event: AnimationEvent) => void;
    clearQueue: () => void;
}

const AnimationQueueContext = createContext<AnimationQueueContextType | null>(null);

export const useAnimationQueue = () => {
    const context = useContext(AnimationQueueContext);
    if (!context) {
        throw new Error('useAnimationQueue must be used within AnimationQueueProvider');
    }
    return context;
};

// Batch Summary Component
const CosmeticBatchSummary: React.FC<{
    items: Array<{ cosmeticType: 'title' | 'frame'; cosmetic: any }>;
    onClose: () => void;
}> = ({ items, onClose }) => {
    const titles = items.filter(i => i.cosmeticType === 'title');
    const frames = items.filter(i => i.cosmeticType === 'frame');

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-gradient-to-b from-slate-900 to-slate-950 border border-green-500/30 rounded-2xl p-6 mx-4 max-w-sm w-full shadow-[0_0_50px_rgba(34,197,94,0.3)]"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/40 mb-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Sparkles className="text-green-400" size={18} />
                        <span className="text-green-300 font-bold uppercase tracking-widest text-sm">
                            ¡Múltiples Desbloqueos!
                        </span>
                    </motion.div>

                    <p className="text-slate-400 text-sm">
                        Has desbloqueado {items.length} nuevos cosméticos
                    </p>
                </div>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto">
                    {titles.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Crown size={16} className="text-yellow-400" />
                                <span className="text-yellow-400 font-bold text-xs uppercase">
                                    {titles.length} Títulos
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {titles.slice(0, 6).map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 text-center"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.05 }}
                                    >
                                        <span className="text-yellow-200 text-xs font-medium truncate block">
                                            {item.cosmetic.name}
                                        </span>
                                    </motion.div>
                                ))}
                                {titles.length > 6 && (
                                    <div className="text-yellow-500/60 text-xs text-center col-span-2">
                                        +{titles.length - 6} más
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {frames.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Image size={16} className="text-cyan-400" />
                                <span className="text-cyan-400 font-bold text-xs uppercase">
                                    {frames.length} Marcos
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {frames.slice(0, 6).map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-2 text-center"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.05 }}
                                    >
                                        <span className="text-cyan-200 text-xs font-medium truncate block">
                                            {item.cosmetic.name}
                                        </span>
                                    </motion.div>
                                ))}
                                {frames.length > 6 && (
                                    <div className="text-cyan-500/60 text-xs text-center col-span-2">
                                        +{frames.length - 6} más
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <motion.button
                    className="w-full mt-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors"
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                >
                    ¡Genial!
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export const AnimationQueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [queue, setQueue] = useState<AnimationEvent[]>([]);
    const [currentEvent, setCurrentEvent] = useState<AnimationEvent | null>(null);
    const [pendingCosmetics, setPendingCosmetics] = useState<Array<{ cosmeticType: 'title' | 'frame'; cosmetic: any }>>([]);
    const [batchTimeout, setBatchTimeout] = useState<NodeJS.Timeout | null>(null);

    // Count remaining animations
    const remainingCount = queue.length;

    // Process queue with batching logic
    useEffect(() => {
        if (!currentEvent && queue.length > 0) {
            const [nextEvent, ...rest] = queue;
            setQueue(rest);
            setCurrentEvent(nextEvent);
        }
    }, [queue, currentEvent]);

    const enqueueAnimation = useCallback((event: AnimationEvent) => {
        // If it's a cosmetic unlock, collect them for potential batching
        if (event.type === 'cosmetic_unlock') {
            setPendingCosmetics(prev => [...prev, { cosmeticType: event.cosmeticType as 'title' | 'frame', cosmetic: event.cosmetic }]);

            // Clear previous timeout
            if (batchTimeout) clearTimeout(batchTimeout);

            // Set a timeout to process collected cosmetics
            const timeout = setTimeout(() => {
                setPendingCosmetics(pending => {
                    if (pending.length === 0) return pending;

                    if (pending.length >= 3) {
                        // Batch them into one
                        setQueue(prev => [...prev, { type: 'cosmetic_batch', items: pending }]);
                    } else {
                        // Add individually
                        pending.forEach(item => {
                            setQueue(prev => [...prev, { type: 'cosmetic_unlock', cosmeticType: item.cosmeticType, cosmetic: item.cosmetic }]);
                        });
                    }
                    return [];
                });
            }, 300); // Wait 300ms to collect more

            setBatchTimeout(timeout);
        } else {
            setQueue(prev => [...prev, event]);
        }
    }, [batchTimeout]);

    const clearQueue = useCallback(() => {
        setQueue([]);
        setCurrentEvent(null);
        setPendingCosmetics([]);
        if (batchTimeout) clearTimeout(batchTimeout);
    }, [batchTimeout]);

    const handleAnimationComplete = useCallback(() => {
        setCurrentEvent(null);
    }, []);

    const skipAll = useCallback(() => {
        setQueue([]);
        setCurrentEvent(null);
    }, []);

    return (
        <AnimationQueueContext.Provider value={{ enqueueAnimation, clearQueue }}>
            {children}

            {/* Skip All Button */}
            <AnimatePresence>
                {(currentEvent || remainingCount > 0) && remainingCount >= 1 && (
                    <motion.button
                        className="fixed bottom-24 right-4 z-[101] flex items-center gap-2 px-4 py-2 bg-slate-800/90 border border-slate-600 rounded-full text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors shadow-lg"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        onClick={skipAll}
                    >
                        <X size={14} />
                        Saltar Todo ({remainingCount + 1})
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Level Up Animation - Using new beautiful reveal */}
            {currentEvent?.type === 'level_up' && (
                <LevelUpReveal
                    isOpen={true}
                    onClose={handleAnimationComplete}
                    newLevel={currentEvent.newLevel}
                />
            )}

            {/* Stat Increase Animation - Using new beautiful reveal */}
            {currentEvent?.type === 'stat_increase' && (
                <StatIncreaseReveal
                    isOpen={true}
                    onClose={handleAnimationComplete}
                    statName={currentEvent.statName}
                    oldValue={currentEvent.oldValue}
                    newValue={currentEvent.newValue}
                />
            )}

            {/* XP Gain Animation */}
            {currentEvent?.type === 'xp_gain' && (
                <XPGainReveal
                    isOpen={true}
                    onClose={handleAnimationComplete}
                    xpGained={currentEvent.xpGained}
                    oldXP={currentEvent.oldXP}
                    newXP={currentEvent.newXP}
                    xpToNextLevel={currentEvent.xpToNextLevel}
                    currentLevel={currentEvent.currentLevel}
                />
            )}

            {/* Cosmetic Unlock Animation (individual) - Using new Universal Reveal */}
            {currentEvent?.type === 'cosmetic_unlock' && (
                <UniversalRewardReveal
                    isOpen={true}
                    onClose={handleAnimationComplete}
                    reward={
                        currentEvent.cosmeticType === 'title'
                            ? { type: 'title', rarity: currentEvent.cosmetic.rarity || 'rare', data: currentEvent.cosmetic }
                            : { type: 'frame', rarity: currentEvent.cosmetic.rarity || 'rare', data: currentEvent.cosmetic }
                    }
                />
            )}

            {/* Equipment Reward Animation */}
            {currentEvent?.type === 'equipment_reward' && (
                <UniversalRewardReveal
                    isOpen={true}
                    onClose={handleAnimationComplete}
                    reward={{
                        type: 'equipment',
                        rarity: currentEvent.equipment.rarity,
                        data: currentEvent.equipment
                    }}
                />
            )}

            {/* Cosmetic Batch Summary */}
            <AnimatePresence>
                {currentEvent?.type === 'cosmetic_batch' && (
                    <CosmeticBatchSummary
                        items={currentEvent.items}
                        onClose={handleAnimationComplete}
                    />
                )}
            </AnimatePresence>

            {/* Achievement Popup - Using Universal Reveal */}
            {currentEvent?.type === 'achievement' && (
                <UniversalRewardReveal
                    isOpen={true}
                    onClose={handleAnimationComplete}
                    reward={{
                        type: 'achievement',
                        rarity: 'legendary',
                        data: {
                            name: currentEvent.title,
                            description: currentEvent.description || '',
                            icon: currentEvent.icon
                        }
                    }}
                />
            )}
        </AnimationQueueContext.Provider>
    );
};

// Export animation components for direct use
export { StatIncreaseCelebration } from './StatIncreaseCelebration';
export { CosmeticUnlockOverlay } from './CosmeticUnlockOverlay';
export { AchievementPopup } from './AchievementPopup';
export { MissionCompleteEffect } from './MissionCompleteEffect';
export { LevelUpCelebration } from './LevelUpCelebration';
export { UniversalRewardReveal } from './UniversalRewardReveal';
export { XPGainReveal, LevelUpReveal, StatIncreaseReveal } from './ProgressRevealAnimations';
