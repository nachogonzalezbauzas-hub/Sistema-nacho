import React, { useEffect, useRef } from 'react';
import { useStore } from '@/store/index';
import { ACHIEVEMENTS, getUnlockedAchievements, saveUnlockedAchievement } from '@/data/achievements';
import { v4 as uuidv4 } from 'uuid';

export const AchievementListener: React.FC = () => {
    // Select the entire state to check conditions
    // This component renders null, so re-renders are cheap (just JS execution)
    const state = useStore(state => state.state);
    const { queueReward, addLog } = useStore();

    // Use a ref to prevent spamming unlocks if state updates rapidly in one frame
    // though saveUnlockedAchievement handles persistence check.
    const lastCheckRef = useRef<number>(0);

    useEffect(() => {
        const now = Date.now();
        // Throttle checks to once every 1 second or so to avoid performance hit on high-frequency state changes (like drag/drop)
        // Actually, 500ms is fine.
        if (now - lastCheckRef.current < 500) return;
        lastCheckRef.current = now;

        const currentUnlocked = getUnlockedAchievements();

        ACHIEVEMENTS.forEach(ach => {
            if (!currentUnlocked.includes(ach.id)) {
                try {
                    if (ach.condition(state)) {
                        // Unlock!
                        saveUnlockedAchievement(ach.id);

                        // Add to Log
                        addLog({
                            category: 'System',
                            message: 'Achievement Unlocked',
                            details: ach.title.en
                        });

                        // Show Popup via Reward Queue
                        queueReward({
                            id: `ach_reward_${ach.id}_${uuidv4()}`,
                            type: 'achievement', // Explicit achievement type
                            name: ach.title.es, // Use ES title for display (assuming generic language setting, or I can pass language)
                            description: ach.description.es,
                            icon: ach.icon || 'Trophy',
                            rarity: ach.rarity === 'GODLIKE' ? 'mythic' : ach.rarity === 'MYTHIC' ? 'legendary' : ach.rarity.toLowerCase() as any,
                            // Map rarity to item rarity if needed
                        });
                    }
                } catch (e) {
                    // Fail silently for bad conditions
                }
            }
        });
    }, [state, queueReward, addLog]);

    return null;
};
