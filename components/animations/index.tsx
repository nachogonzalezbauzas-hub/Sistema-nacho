import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatIncreaseCelebration } from './StatIncreaseCelebration';
import { CosmeticUnlockOverlay } from './CosmeticUnlockOverlay';
import { AchievementPopup } from './AchievementPopup';
import { LevelUpCelebration } from './LevelUpCelebration';
import { UniversalRewardReveal } from './UniversalRewardReveal';
import { XPGainReveal, LevelUpReveal, StatIncreaseReveal, ShardsGainReveal, CosmeticBatchReveal } from './ProgressRevealAnimations';
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
    | { type: 'xp_gain'; xpGained: number; oldXP: number; newXP: number; xpToNextLevel: number; currentLevel: number }
    | { type: 'shards_gain'; shardsGained: number; totalShards: number };

// Priority order for animations (lower = higher priority, shows first)
// Order: Stat > XP > Level Up > Shards > Equipment > Title > Frame
const ANIMATION_PRIORITY: Record<AnimationEvent['type'], number> = {
    'stat_increase': 1,     // First: Stats you gained
    'xp_gain': 2,           // Second: XP bar animation
    'level_up': 3,          // Third: Level up celebration
    'shards_gain': 4,       // Fourth: Currency gained
    'equipment_reward': 5,  // Fifth: New gear
    'cosmetic_unlock': 6,   // Sixth: Titles/frames unlocked (sorted internally)
    'achievement': 7,       // Seventh: Achievement popups
    'cosmetic_batch': 8,    // Last: Batch summary
};

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

// CosmeticBatchSummary removed - replaced by CosmeticBatchReveal


export const AnimationQueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [queue, setQueue] = useState<AnimationEvent[]>([]);
    const [currentEvent, setCurrentEvent] = useState<AnimationEvent | null>(null);
    const [pendingCosmetics, setPendingCosmetics] = useState<Array<{ cosmeticType: 'title' | 'frame'; cosmetic: any }>>([]);
    const [batchTimeout, setBatchTimeout] = useState<NodeJS.Timeout | null>(null);

    // Count remaining animations
    const remainingCount = queue.length;

    // Sort queue by priority helper - titles before frames within cosmetics
    const sortByPriority = (events: AnimationEvent[]): AnimationEvent[] => {
        return [...events].sort((a, b) => {
            const priorityA = ANIMATION_PRIORITY[a.type] || 99;
            const priorityB = ANIMATION_PRIORITY[b.type] || 99;

            // If same priority and both are cosmetic_unlock, sort titles before frames
            if (priorityA === priorityB && a.type === 'cosmetic_unlock' && b.type === 'cosmetic_unlock') {
                const typeA = (a as any).cosmeticType;
                const typeB = (b as any).cosmeticType;
                // title = 0, frame = 1 (titles first)
                return (typeA === 'title' ? 0 : 1) - (typeB === 'title' ? 0 : 1);
            }

            return priorityA - priorityB;
        });
    };

    // Process queue - always take the highest priority item
    useEffect(() => {
        if (!currentEvent && queue.length > 0) {
            // Sort by priority and take the first (highest priority)
            const sorted = sortByPriority(queue);
            const nextEvent = sorted[0];
            // Remove the selected event from queue
            setQueue(prev => prev.filter((_, i) => i !== queue.indexOf(nextEvent)));
            setCurrentEvent(nextEvent);
        }
    }, [queue, currentEvent]);

    // CRITICAL FIX: Use useRef instead of useState to prevent infinite render loops
    // We don't need UI updates when this changes, just internal tracking
    const shownCosmeticIdsRef = React.useRef<Set<string>>(new Set());

    const enqueueAnimation = useCallback((event: AnimationEvent) => {
        // If it's a cosmetic unlock, check for duplicates and collect for potential batching
        if (event.type === 'cosmetic_unlock') {
            const cosmeticId = event.cosmetic?.id || event.cosmetic?.name;

            // DEDUPLICATION: Skip if we've already shown this cosmetic
            if (cosmeticId && shownCosmeticIdsRef.current.has(cosmeticId)) {
                console.log('[Animation] Skipping duplicate cosmetic:', cosmeticId);
                return;
            }

            // Mark as shown using Ref
            if (cosmeticId) {
                shownCosmeticIdsRef.current.add(cosmeticId);
            }

            // Also check if already in pending
            setPendingCosmetics(prev => {
                const alreadyPending = prev.some(p =>
                    (p.cosmetic?.id || p.cosmetic?.name) === cosmeticId
                );
                if (alreadyPending) {
                    console.log('[Animation] Already pending, skipping:', cosmeticId);
                    return prev;
                }
                return [...prev, { cosmeticType: event.cosmeticType as 'title' | 'frame', cosmetic: event.cosmetic }];
            });

            // Clear previous timeout
            if (batchTimeout) clearTimeout(batchTimeout);

            // Set a timeout to process collected cosmetics
            const timeout = setTimeout(() => {
                setPendingCosmetics(pending => {
                    if (pending.length === 0) return pending;

                    if (pending.length >= 3) {
                        // Batch them into one
                        setQueue(prev => sortByPriority([...prev, { type: 'cosmetic_batch', items: pending }]));
                    } else {
                        // Add individually and sort
                        const newEvents = pending.map(item => ({
                            type: 'cosmetic_unlock' as const,
                            cosmeticType: item.cosmeticType,
                            cosmetic: item.cosmetic
                        }));
                        setQueue(prev => sortByPriority([...prev, ...newEvents]));
                    }
                    return [];
                });
            }, 300); // Wait 300ms to collect more

            setBatchTimeout(timeout);
        } else {
            // Add to queue and sort by priority
            setQueue(prev => sortByPriority([...prev, event]));
        }
    }, [batchTimeout]); // shownCosmeticIds removed from dependencies

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

            {/* Shards Gain Animation */}
            {currentEvent?.type === 'shards_gain' && (
                <ShardsGainReveal
                    isOpen={true}
                    onClose={handleAnimationComplete}
                    shardsGained={currentEvent.shardsGained}
                    totalShards={currentEvent.totalShards}
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
                    <CosmeticBatchReveal
                        isOpen={true}
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
export { XPGainReveal, LevelUpReveal, StatIncreaseReveal, ShardsGainReveal } from './ProgressRevealAnimations';
