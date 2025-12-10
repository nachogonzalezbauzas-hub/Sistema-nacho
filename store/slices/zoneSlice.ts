import { StateCreator } from 'zustand';
import { ZoneState, ItemRarity } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import {
    getZoneInfo,
    calculateZoneThreshold,
    canChallengeZoneBoss,
    ZoneDefinition
} from '@/data/zoneSystem';
import { generateEquipment } from '@/data/equipmentGenerator';
import { GameStore } from '../useStore';

export interface ZoneSlice {
    checkZoneThreshold: () => { triggered: boolean; zoneId?: number };
    getZoneState: () => ZoneState;
    completeZoneBossFight: (victory: boolean, zoneIdOverride?: number) => void;
    dismissZoneBoss: () => void;
    getZoneInfo: (zoneId: number) => ZoneDefinition;
}

export const createZoneSlice: StateCreator<GameStore, [], [], ZoneSlice> = (set, get) => ({
    checkZoneThreshold: () => {
        const { state, getTotalPower } = get();
        const totalPower = getTotalPower();

        // Initialize zone state if not present
        if (!state.zone) {
            set((store) => ({
                state: {
                    ...store.state,
                    zone: {
                        currentZone: 1, // Start at Zone 1
                        maxUnlockedFloor: 150,
                        zoneGuardiansDefeated: [],
                        unlockedRarities: ['common', 'uncommon', 'rare', 'epic', 'legendary'], // Base rarities
                        pendingZoneBoss: null
                    }
                }
            }));
            return { triggered: false };
        }

        const currentZone = state.zone.currentZone;
        // Check if we can challenge the boss of the CURRENT zone to unlock the NEXT zone
        // Logic: Must have reached the max floor of the current zone.

        // Calculate maxReachedFloor from dungeonRuns
        const maxReachedFloor = (state.dungeonRuns || [])
            .filter(r => r.victory)
            .reduce((max, r) => {
                const floor = parseInt(r.dungeonId.split('_')[1] || '0');
                return Math.max(max, floor);
            }, 0);

        const nextZoneId = currentZone + 1;
        const nextZoneInfo = getZoneInfo(nextZoneId);

        // If we already have this boss pending, don't trigger again
        if (state.zone.pendingZoneBoss === nextZoneId) {
            return { triggered: false };
        }

        // Check if we already defeated this guardian
        if (state.zone.zoneGuardiansDefeated.includes(nextZoneId)) {
            return { triggered: false };
        }

        // Use the new floor-based check
        if (canChallengeZoneBoss(totalPower, currentZone, maxReachedFloor)) {
            // Player has reached threshold for next zone - trigger boss fight prompt
            set((store) => ({
                state: {
                    ...store.state,
                    zone: {
                        ...store.state.zone,
                        pendingZoneBoss: nextZoneId
                    }
                }
            }));
            return { triggered: true, zoneId: nextZoneId };
        }

        return { triggered: false };
    },

    getZoneState: () => {
        const { state } = get();
        return state.zone || {
            currentZone: 1,
            maxUnlockedFloor: 150,
            zoneGuardiansDefeated: [],
            unlockedRarities: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
            pendingZoneBoss: null
        };
    },

    dismissZoneBoss: () => {
        // Do not clear pendingZoneBoss so the Dashboard button remains available
    },

    completeZoneBossFight: (victory: boolean, zoneIdOverride?: number) => {
        const { state } = get();
        const zoneId = zoneIdOverride || state.zone?.pendingZoneBoss;

        if (!zoneId) return;

        if (victory) {
            const zoneInfo = getZoneInfo(zoneId);
            const [, floorEnd] = zoneInfo.floorRange;
            const newRarity = zoneInfo.newRarity;


            // Generate rewards
            const equipment = newRarity ? generateEquipment(undefined, newRarity as ItemRarity, state.stats.level, 10) : null;

            // Generate Zone Shadow
            const shadowRank: "S" | "SS" | "SSS" = zoneId <= 5 ? "S" : zoneId <= 10 ? "SS" : "SSS";
            const shadowStatValue = zoneId * 5; // Simple scaling
            const newShadow: any = { // Using generic type to avoid strict strict Shadow definition issues if partial, but aiming for full compliance
                id: `shadow_zone_${zoneId}`,
                name: zoneInfo.rewards.shadowName,
                rank: shadowRank,
                image: '/assets/shadows/default.png', // Placeholder
                bonus: {
                    stat: 'Strength', // Default, could be randomized or zone-specific
                    value: shadowStatValue
                },
                isEquipped: false,
                extractedAt: new Date().toISOString(),
                evolutionLevel: 0,
                experiencePoints: 0,
                xpToNextEvolution: 100 * zoneId
            };

            set((store) => ({
                state: {
                    ...store.state,
                    zone: {
                        ...store.state.zone,
                        currentZone: zoneId,
                        maxUnlockedFloor: floorEnd,
                        zoneGuardiansDefeated: [...(store.state.zone?.zoneGuardiansDefeated || []), zoneId],
                        unlockedRarities: newRarity ? [...(store.state.zone?.unlockedRarities || []), newRarity as ItemRarity] : (store.state.zone?.unlockedRarities || []),
                        pendingZoneBoss: null
                    },
                    inventory: equipment ? [...store.state.inventory, equipment] : store.state.inventory,
                    shadows: [...(store.state.shadows || []), newShadow], // Add the shadow!
                    rewardQueue: [
                        ...store.state.rewardQueue,
                        {
                            id: `zone_victory_${zoneId}`,
                            type: 'era_complete' as any,
                            name: `${zoneInfo.name} Unlocked!`,
                            description: `You have conquered the ${zoneInfo.bossName}!`,
                            rarity: 'legendary' as ItemRarity,
                            icon: '👑'
                        },
                        // Shadow Extraction Reward
                        {
                            id: `zone_reward_shadow_${zoneId}`,
                            type: 'item' as any,
                            name: `Shadow Extracted: ${newShadow.name}`,
                            description: 'A new soldier joins your army.',
                            rarity: 'mythic' as ItemRarity,
                            icon: '👥',
                            stats: [{ stat: newShadow.bonus.stat, value: newShadow.bonus.value }]
                        },
                        ...(equipment ? [{
                            id: `zone_equip_${equipment.id}`,
                            type: 'item' as any,
                            name: equipment.name,
                            rarity: equipment.rarity,
                            icon: '🛡️',
                            stats: equipment.baseStats?.map(s => ({ stat: s.stat, value: s.value }))
                        }] : []),
                        // Unlock Zone Title Reward
                        {
                            id: `zone_reward_title_${zoneId}`,
                            type: 'milestone' as any,
                            name: `Title: ${zoneInfo.rewards.titleName}`,
                            description: 'Zone Conqueror Title Acquired',
                            rarity: 'epic' as ItemRarity,
                            icon: '👑'
                        },
                        // Unlock Zone Frame Reward
                        {
                            id: `zone_reward_frame_${zoneId}`,
                            type: 'milestone' as any,
                            name: `Frame: ${zoneInfo.rewards.frameName}`,
                            description: 'Zone Conqueror Frame Acquired',
                            rarity: 'epic' as ItemRarity,
                            icon: '🖼️'
                        }
                    ],
                    stats: {
                        ...store.state.stats,
                        // DYNAMICALLY UNLOCK TITLE AND FRAME
                        unlockedTitleIds: [...store.state.stats.unlockedTitleIds, `zone_title_${zoneId}`],
                        unlockedFrameIds: [...store.state.stats.unlockedFrameIds, `zone_frame_${zoneId}`]
                    },
                    logs: [
                        {
                            id: uuidv4(),
                            category: 'Sistema',
                            message: `Zona Desbloqueada: ${zoneInfo.name}`,
                            details: `¡Has extraído la sombra ${newShadow.name}!`,
                            timestamp: new Date().toISOString()
                        },
                        ...store.state.logs
                    ]
                }
            }));
        } else {
            // Defeat - can retry
            set((store) => ({
                state: {
                    ...store.state,
                    zone: {
                        ...store.state.zone,
                        pendingZoneBoss: null
                    },
                    logs: [
                        {
                            id: uuidv4(),
                            category: 'Sistema',
                            message: 'Derrota de Jefe de Zona',
                            details: `No lograste vencer al ${getZoneInfo(zoneId).bossName}. Puedes reintentarlo cuando quieras.`,
                            timestamp: new Date().toISOString()
                        },
                        ...store.state.logs
                    ]
                }
            }));
        }
    },

    getZoneInfo: (zoneId: number) => {
        return getZoneInfo(zoneId);
    }
});
