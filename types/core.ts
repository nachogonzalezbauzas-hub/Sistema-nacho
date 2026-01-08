
export type StatType = 'Strength' | 'Vitality' | 'Agility' | 'Intelligence' | 'Fortune' | 'Metabolism';

export type RankTier = "E" | "D" | "C" | "B" | "A" | "S" | "SS" | "SSS";

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'godlike';

// Zone system types
export interface ZoneState {
    currentZone: number;
    maxUnlockedFloor: number;
    zoneGuardiansDefeated: number[]; // Zone IDs
    unlockedRarities: string[]; // Dynamically unlocked rarities beyond base
    pendingZoneBoss: number | null; // Zone ID of pending boss fight
}
