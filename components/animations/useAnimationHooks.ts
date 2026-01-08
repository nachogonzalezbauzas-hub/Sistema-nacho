import { useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { useAnimationQueue } from './index';
import { StatType } from '../../types';
import { TITLES, AVATAR_FRAMES } from '../../data/titles';
import { getZoneInfo } from '../../data/zoneSystem';

/**
 * Hook that watches for level and stat changes and triggers animations.
 * Handles simultaneous events like level up + stat increase properly.
 */
export const useStatChangeAnimations = () => {
    // Reverted to stable full-state subscription to fix crash
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
                const fromLevelUp = leveledUp ? 1 : 0;

                statChanges.push({
                    stat: key.charAt(0).toUpperCase() + key.slice(1) as StatType,
                    oldValue: prev[key],
                    newValue: current[key],
                    fromLevelUp,
                });
            }
        }

        if (leveledUp) {
            enqueueAnimation({
                type: 'level_up',
                newLevel: current.level,
            });
        }

        for (const change of statChanges) {
            const missionGain = change.newValue - change.oldValue - change.fromLevelUp;
            if (!leveledUp || missionGain > 0) {
                const animatedOldValue = leveledUp ? change.oldValue + change.fromLevelUp : change.oldValue;
                const animatedNewValue = change.newValue;

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
 * Hook that watches for cosmetic unlocks.
 */
export const useCosmeticUnlockAnimations = () => {
    const { state } = useStore();
    const { enqueueAnimation } = useAnimationQueue();

    const isFirstLoadRef = useRef(true);
    const prevTitlesRef = useRef<string[]>([]);
    const prevFramesRef = useRef<string[]>([]);
    const animatedTitlesRef = useRef<Set<string>>(new Set());
    const animatedFramesRef = useRef<Set<string>>(new Set());

    const titlesStr = JSON.stringify(state?.stats?.unlockedTitleIds || []);
    const framesStr = JSON.stringify(state?.stats?.unlockedFrameIds || []);

    useEffect(() => {
        if (!state?.stats) return;

        const currentTitles = state.stats.unlockedTitleIds || [];
        const currentFrames = state.stats.unlockedFrameIds || [];

        if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            prevTitlesRef.current = [...currentTitles];
            prevFramesRef.current = [...currentFrames];
            currentTitles.forEach(id => animatedTitlesRef.current.add(id));
            currentFrames.forEach(id => animatedFramesRef.current.add(id));
            return;
        }

        const newTitles = currentTitles.filter(id =>
            !prevTitlesRef.current.includes(id) && !animatedTitlesRef.current.has(id)
        );

        for (const titleId of newTitles) {
            const title = TITLES.find(t => t.id === titleId);
            if (title) {
                animatedTitlesRef.current.add(titleId);
                enqueueAnimation({
                    type: 'cosmetic_unlock',
                    cosmeticType: 'title',
                    cosmetic: title as any,
                });
            }
        }

        const newFrames = currentFrames.filter(id =>
            !prevFramesRef.current.includes(id) && !animatedFramesRef.current.has(id)
        );

        for (const frameId of newFrames) {
            const frame = AVATAR_FRAMES.find(f => f.id === frameId);
            if (frame) {
                animatedFramesRef.current.add(frameId);
                enqueueAnimation({
                    type: 'cosmetic_unlock',
                    cosmeticType: 'frame',
                    cosmetic: frame as any,
                });
            }
        }

        prevTitlesRef.current = [...currentTitles];
        prevFramesRef.current = [...currentFrames];
    }, [titlesStr, framesStr, enqueueAnimation]);
};

/**
 * Hook that watches for new equipment.
 */
export const useEquipmentRewardAnimations = () => {
    const { state } = useStore();
    const { enqueueAnimation } = useAnimationQueue();

    const isFirstLoadRef = useRef(true);
    const prevInventoryIdsRef = useRef<string[]>([]);

    const inventoryStr = JSON.stringify((state?.inventory || []).map(e => e.id));

    useEffect(() => {
        if (!state?.inventory) return;

        const currentIds = state.inventory.map(e => e.id);

        if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            prevInventoryIdsRef.current = [...currentIds];
            return;
        }

        const newEquipmentIds = currentIds.filter(id => !prevInventoryIdsRef.current.includes(id));
        const itemsToAnimate = newEquipmentIds.slice(0, 3);

        for (const equipId of itemsToAnimate) {
            const equipment = state.inventory.find(e => e.id === equipId);
            // Skip if this item is marked to skip implicit global animations (e.g. from Shop)
            if (equipment && !equipment.skipGlobalAnimation) {
                enqueueAnimation({
                    type: 'equipment_reward',
                    equipment: equipment,
                });
            }
        }

        prevInventoryIdsRef.current = [...currentIds];
    }, [inventoryStr, enqueueAnimation]); // Intentionally using stringified dependency
};

/**
 * Hook that watches for XP changes.
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

        if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            prevXPRef.current = currentXP;
            return;
        }

        const xpGained = currentXP - prevXPRef.current;

        if (xpGained >= 20) {
            enqueueAnimation({
                type: 'xp_gain',
                xpGained: xpGained,
                oldXP: prevXPRef.current,
                newXP: currentXP,
                xpToNextLevel: xpToNextLevel,
                currentLevel: level,
            });
        }

        prevXPRef.current = currentXP;
    }, [state?.stats?.xpCurrent, enqueueAnimation, state?.stats?.level]);
};

/**
 * Hook that watches for Shards changes.
 */
export const useShardsGainAnimations = () => {
    const { state } = useStore();
    const { enqueueAnimation } = useAnimationQueue();

    const isFirstLoadRef = useRef(true);
    const prevShardsRef = useRef(0);

    useEffect(() => {
        // Safe access
        if (!state) return;
        const currentShards = state.shards || 0;

        if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            prevShardsRef.current = currentShards;
            return;
        }

        const shardsGained = currentShards - prevShardsRef.current;

        if (shardsGained >= 50) {
            enqueueAnimation({
                type: 'shards_gain',
                shardsGained: shardsGained,
                totalShards: currentShards,
            });
        }

        prevShardsRef.current = currentShards;
    }, [state?.shards, enqueueAnimation]);
};

/**
 * Hook that watches for Zone changes.
 */
export const useZoneChangeAnimations = () => {
    const { state } = useStore();
    const { enqueueAnimation } = useAnimationQueue();

    const isFirstLoadRef = useRef(true);
    const prevZoneRef = useRef(1);

    useEffect(() => {
        if (!state?.zone) return;

        const currentZone = state.zone.currentZone || 1;

        if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            prevZoneRef.current = currentZone;
            return;
        }

        if (currentZone > prevZoneRef.current) {
            const info = getZoneInfo(currentZone);
            enqueueAnimation({
                type: 'zone_change',
                zoneName: info.name,
                zoneTheme: info.theme,
                zoneColor: info.visuals.primaryColor,
                floorRange: info.floorRange
            });
        }

        prevZoneRef.current = currentZone;
    }, [state?.zone?.currentZone, enqueueAnimation]);
};

