// Hook to play sound effects on game events
import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { playSFX } from './audioManager';

export const useAudioEffects = () => {
    const { state } = useStore();

    // Track previous values to detect changes
    const prevLevel = useRef(state.stats.level);
    const prevMissionsCompleted = useRef(0);
    const prevDungeonRuns = useRef(state.dungeonRuns.length);
    const prevShadows = useRef(state.shadows.length);
    const prevRewardQueue = useRef(state.rewardQueue.length);

    useEffect(() => {
        // Level Up
        if (state.stats.level > prevLevel.current) {
            playSFX('level_up');
            prevLevel.current = state.stats.level;
        }
    }, [state.stats.level]);

    useEffect(() => {
        // Mission Completed - detect via logs or dailyActivity
        const todayKey = new Date().toDateString();
        const todayMissions = state.dailyActivity[todayKey]?.missionsCompleted || 0;

        if (todayMissions > prevMissionsCompleted.current) {
            playSFX('mission_complete');
            prevMissionsCompleted.current = todayMissions;
        }
    }, [state.dailyActivity]);

    useEffect(() => {
        // Dungeon Completed
        if (state.dungeonRuns.length > prevDungeonRuns.current) {
            const lastRun = state.dungeonRuns[state.dungeonRuns.length - 1];
            if (lastRun?.victory) {
                playSFX('dungeon_victory');
            }
            prevDungeonRuns.current = state.dungeonRuns.length;
        }
    }, [state.dungeonRuns.length]);

    useEffect(() => {
        // Shadow Extracted
        if (state.shadows.length > prevShadows.current) {
            playSFX('shadow_arise');
            prevShadows.current = state.shadows.length;
        }
    }, [state.shadows.length]);

    useEffect(() => {
        // Loot Received
        if (state.rewardQueue.length > prevRewardQueue.current) {
            playSFX('loot_drop');
            prevRewardQueue.current = state.rewardQueue.length;
        }
    }, [state.rewardQueue.length]);
};
