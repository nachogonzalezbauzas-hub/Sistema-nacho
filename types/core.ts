
export type StatType = 'Strength' | 'Vitality' | 'Agility' | 'Intelligence' | 'Fortune' | 'Metabolism';

export type RankTier = "E" | "D" | "C" | "B" | "A" | "S" | "SS" | "SSS";

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'godlike' | 'celestial' | 'transcendent' | 'primordial' | 'eternal' | 'divine' | 'cosmic' | 'infinite' | 'magma' | 'abyssal' | 'verdant' | 'storm' | 'lunar' | 'solar' | 'nebula' | 'singularity' | 'nova' | 'cyber' | 'crystal' | 'ethereal' | 'crimson' | 'heavenly' | 'antimatter' | 'temporal' | 'chaotic' | 'void' | 'omega';

// Zone system types
export interface ZoneState {
    currentZone: number;
    maxUnlockedFloor: number;
    zoneGuardiansDefeated: number[]; // Zone IDs
    unlockedRarities: string[]; // Dynamically unlocked rarities beyond base
    pendingZoneBoss: number | null; // Zone ID of pending boss fight
}
