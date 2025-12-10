import { useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { useAnimationQueue } from './index';
import { StatType } from '../../types';
import { TITLES, AVATAR_FRAMES } from '../../data/titles';

/**
 * Hook that watches for level and stat changes and triggers animations.
 * Handles simultaneous events like level up + stat increase properly.
 */
export const useStatChangeAnimations = () => {
    const { state } = useStore();
    const { enqueueAnimation } = useAnimationQueue();

    // Store previous values
    const prevRef = useRef<{
        level: number;
        strength: number;
        vitality: number;
        agility: number;
        intelligence: number;
    } | null>(null);

    useEffect(() => {
        if (!state?.stats) return;

        const current = {
            level: state.stats.level,
            strength: state.stats.strength,
            vitality: state.stats.vitality,
            agility: state.stats.agility,
            intelligence: state.stats.intelligence,
        };

        // Skip if this is the first load
        if (!prevRef.current) {
            prevRef.current = current;
            return;
        }

        const prev = prevRef.current;

        // Check if level up happened
        const leveledUp = current.level > prev.level;

        // Calculate stat changes
        const statChanges: { stat: StatType; oldValue: number; newValue: number; fromLevelUp: number }[] = [];
        const statKeys: ('strength' | 'vitality' | 'agility' | 'intelligence')[] =
            ['strength', 'vitality', 'agility', 'intelligence'];

        for (const key of statKeys) {
            if (current[key] > prev[key]) {
                const totalGain = current[key] - prev[key];
                // If we leveled up, 1 point came from level up, rest from missions
                const fromLevelUp = leveledUp ? 1 : 0;

                statChanges.push({
                    stat: key.charAt(0).toUpperCase() + key.slice(1) as StatType,
                    oldValue: prev[key],
                    newValue: current[key],
                    fromLevelUp,
                });
            }
        }

        // If level up happened, queue level up animation FIRST
        if (leveledUp) {
            enqueueAnimation({
                type: 'level_up',
                newLevel: current.level,
            });
        }

        // Then queue individual stat animations for gains BEYOND the level up bonus
        for (const change of statChanges) {
            const missionGain = change.newValue - change.oldValue - change.fromLevelUp;

            // Only show animation if there was a gain beyond the level up bonus
            // OR if there was no level up (regular mission completion)
            if (!leveledUp || missionGain > 0) {
                const animatedOldValue = leveledUp ? change.oldValue + change.fromLevelUp : change.oldValue;
                const animatedNewValue = change.newValue;

                // Only animate if there's actually a change to show
                if (animatedNewValue > animatedOldValue) {
                    enqueueAnimation({
                        type: 'stat_increase',
                        statName: change.stat,
                        oldValue: animatedOldValue,
                        newValue: animatedNewValue,
                    });
                }
            }
        }

        // Update ref with current values
        prevRef.current = current;
    }, [
        state?.stats?.level,
        state?.stats?.strength,
        state?.stats?.vitality,
        state?.stats?.agility,
        state?.stats?.intelligence,
        enqueueAnimation
    ]);
};

/**
 * Hook that watches for cosmetic unlocks and triggers animations.
 */
export const useCosmeticUnlockAnimations = () => {
    const { state } = useStore();
    const { enqueueAnimation } = useAnimationQueue();

    const isFirstLoadRef = useRef(true);
    const prevTitlesRef = useRef<string[]>([]);
    const prevFramesRef = useRef<string[]>([]);

    // Stringify for proper comparison
    const titlesStr = JSON.stringify(state?.stats?.unlockedTitleIds || []);
    const framesStr = JSON.stringify(state?.stats?.unlockedFrameIds || []);

    useEffect(() => {
        if (!state?.stats) return;

        const currentTitles = state.stats.unlockedTitleIds || [];
        const currentFrames = state.stats.unlockedFrameIds || [];

        // Skip first load - just store the initial values
        if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            prevTitlesRef.current = [...currentTitles];
            prevFramesRef.current = [...currentFrames];
            return;
        }

        // Check for new titles
        const newTitles = currentTitles.filter(id => !prevTitlesRef.current.includes(id));
        console.log('[Animation] Checking titles:', { prev: prevTitlesRef.current.length, current: currentTitles.length, new: newTitles.length });

        for (const titleId of newTitles) {
            const title = TITLES.find(t => t.id === titleId);
            if (title) {
                console.log('[Animation] Enqueuing title unlock:', title.name);
                enqueueAnimation({
                    type: 'cosmetic_unlock',
                    cosmeticType: 'title',
                    cosmetic: title as any,
                });
            }
        }

        // Check for new frames
        const newFrames = currentFrames.filter(id => !prevFramesRef.current.includes(id));
        console.log('[Animation] Checking frames:', { prev: prevFramesRef.current.length, current: currentFrames.length, new: newFrames.length });

        for (const frameId of newFrames) {
            const frame = AVATAR_FRAMES.find(f => f.id === frameId);
            if (frame) {
                console.log('[Animation] Enqueuing frame unlock:', frame.name);
                enqueueAnimation({
                    type: 'cosmetic_unlock',
                    cosmeticType: 'frame',
                    cosmetic: frame as any,
                });
            }
        }

        // Update refs with current values
        prevTitlesRef.current = [...currentTitles];
        prevFramesRef.current = [...currentFrames];
    }, [titlesStr, framesStr, enqueueAnimation]);
};

/**
 * Hook that watches for new equipment in inventory and triggers animations.
 */
export const useEquipmentRewardAnimations = () => {
    const { state } = useStore();
    const { enqueueAnimation } = useAnimationQueue();

    const isFirstLoadRef = useRef(true);
    const prevInventoryIdsRef = useRef<string[]>([]);

    // Stringify for proper comparison
    const inventoryStr = JSON.stringify((state?.inventory || []).map(e => e.id));

    useEffect(() => {
        if (!state?.inventory) return;

        const currentIds = state.inventory.map(e => e.id);

        // Skip first load
        if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            prevInventoryIdsRef.current = [...currentIds];
            return;
        }

        // Check for new equipment
        const newEquipmentIds = currentIds.filter(id => !prevInventoryIdsRef.current.includes(id));

        // Only show animation for up to 3 items to avoid spam
        const itemsToAnimate = newEquipmentIds.slice(0, 3);

        for (const equipId of itemsToAnimate) {
            const equipment = state.inventory.find(e => e.id === equipId);
            if (equipment) {
                console.log('[Animation] Enqueuing equipment reward:', equipment.name);
                enqueueAnimation({
                    type: 'equipment_reward',
                    equipment: equipment,
                });
            }
        }

        // Update ref with current values
        prevInventoryIdsRef.current = [...currentIds];
    }, [inventoryStr, enqueueAnimation]);
};

/**
 * Hook that watches for XP changes and triggers animations.
 * Only triggers for significant XP gains (>= 20 XP) to avoid spam.
 */
export const useXPGainAnimations = () => {
    const { state } = useStore();
    const { enqueueAnimation } = useAnimationQueue();

    const isFirstLoadRef = useRef(true);
    const prevXPRef = useRef(0);

    useEffect(() => {
        if (!state?.stats) return;

        const currentXP = state.stats.xpCurrent;
        const level = state.stats.level;
        const xpToNextLevel = state.stats.xpForNextLevel || 100;

        // Skip first load
        if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            prevXPRef.current = currentXP;
            return;
        }

        const xpGained = currentXP - prevXPRef.current;

        // Only show animation for significant XP gains (>= 20)
        if (xpGained >= 20) {
            console.log('[Animation] Enqueuing XP gain:', xpGained);
            enqueueAnimation({
                type: 'xp_gain',
                xpGained: xpGained,
                oldXP: prevXPRef.current,
                newXP: currentXP,
                xpToNextLevel: xpToNextLevel,
                currentLevel: level,
            });
        }

        // Update ref
        prevXPRef.current = currentXP;
    }, [state?.stats?.xpCurrent, enqueueAnimation]);
};

/**
 * Hook that watches for Shards changes and triggers animations.
 * Only triggers for significant gains (>= 50 shards) to avoid spam.
 */
export const useShardsGainAnimations = () => {
    const { state } = useStore();
    const { enqueueAnimation } = useAnimationQueue();

    const isFirstLoadRef = useRef(true);
    const prevShardsRef = useRef(0);

    useEffect(() => {
        if (!state) return;

        const currentShards = state.shards || 0;

        // Skip first load
        if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            prevShardsRef.current = currentShards;
            return;
        }

        const shardsGained = currentShards - prevShardsRef.current;

        // Only show animation for significant gains (>= 50)
        if (shardsGained >= 50) {
            console.log('[Animation] Enqueuing shards gain:', shardsGained);
            enqueueAnimation({
                type: 'shards_gain',
                shardsGained: shardsGained,
                totalShards: currentShards,
            });
        }

        // Update ref
        prevShardsRef.current = currentShards;
    }, [state?.shards, enqueueAnimation]);
};
