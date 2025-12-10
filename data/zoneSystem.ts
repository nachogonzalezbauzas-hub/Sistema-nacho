import { ItemRarity } from '@/types';

export interface ZoneDefinition {
    id: number;
    name: string;
    theme: string;
    powerThreshold: number;
    newRarity: string;
    floorRange: [number, number];
    bossName: string;
    bossDescription: string;
    bossPower: number;
    rewards: {
        shadowName: string;
        titleName: string;
        frameName: string;
    };
    visuals: {
        primaryColor: string;
        secondaryColor: string; // Used for gradients/accents
        textColor: string;
        borderColor: string;
        backgroundColor: string; // CSS background property (can be gradient)
        particleType: 'embers' | 'bubbles' | 'spores' | 'lightning' | 'dust' | 'plasma' | 'fog' | 'distortion' | 'shockwave' | 'glitch' | 'sparkles' | 'none';
        overlayStyle: string; // CSS class for overlay texture
    };
}

// Zone Definitions (1-20)
export const ZONES: ZoneDefinition[] = [
    // Tier 1: The Awakening
    {
        id: 1,
        name: 'The System',
        theme: 'Digital',
        powerThreshold: 0,
        newRarity: 'common',
        floorRange: [1, 150],
        bossName: 'System Gatekeeper',
        bossDescription: 'The initial guardian of the system.',
        bossPower: 0,
        rewards: { shadowName: 'System Shadow', titleName: 'Player', frameName: 'System Frame' },
        visuals: {
            primaryColor: '#3b82f6', // Blue-500
            secondaryColor: '#60a5fa',
            textColor: '#ffffff',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            backgroundColor: '#02040a',
            particleType: 'none',
            overlayStyle: 'bg-[url("https://grainy-gradients.vercel.app/noise.svg")] opacity-20'
        }
    },
    {
        id: 2,
        name: 'Volcanic Lands',
        theme: 'Fire',
        powerThreshold: 1250000,
        newRarity: 'magma',
        floorRange: [151, 300],
        bossName: 'Magma Colossus',
        bossDescription: 'A giant forged from living magma.',
        bossPower: 1000000,
        rewards: { shadowName: 'Magma Core', titleName: 'Volcanic Conqueror', frameName: 'Obsidian Frame' },
        visuals: {
            primaryColor: '#ef4444', // Red-500
            secondaryColor: '#f97316', // Orange-500
            textColor: '#fef2f2',
            borderColor: 'rgba(239, 68, 68, 0.6)',
            backgroundColor: 'linear-gradient(to bottom, #1a0505, #450a0a)',
            particleType: 'embers',
            overlayStyle: 'bg-[url("/assets/textures/cracked-earth.png")] opacity-30 mix-blend-overlay' // Placeholder
        }
    },
    {
        id: 3,
        name: 'Abyssal Ocean',
        theme: 'Water',
        powerThreshold: 2500000,
        newRarity: 'abyssal',
        floorRange: [301, 450],
        bossName: 'Leviathan of the Deep',
        bossDescription: 'A terror from the crushing depths.',
        bossPower: 2000000,
        rewards: { shadowName: 'Abyssal Soul', titleName: 'Deep Diver', frameName: 'Coral Frame' },
        visuals: {
            primaryColor: '#06b6d4', // Cyan-500
            secondaryColor: '#1e3a8a', // Blue-900
            textColor: '#ecfeff',
            borderColor: 'rgba(6, 182, 212, 0.5)',
            backgroundColor: 'linear-gradient(to bottom, #020617, #082f49)',
            particleType: 'bubbles',
            overlayStyle: 'backdrop-blur-[1px]'
        }
    },
    {
        id: 4,
        name: 'Verdant Jungle',
        theme: 'Nature',
        powerThreshold: 5000000,
        newRarity: 'verdant',
        floorRange: [451, 600],
        bossName: 'Ancient Treant',
        bossDescription: 'The forest itself rises against you.',
        bossPower: 4000000,
        rewards: { shadowName: 'Nature\'s Wrath', titleName: 'Jungle King', frameName: 'Vine Frame' },
        visuals: {
            primaryColor: '#22c55e', // Green-500
            secondaryColor: '#14532d', // Green-900
            textColor: '#f0fdf4',
            borderColor: 'rgba(34, 197, 94, 0.5)',
            backgroundColor: 'linear-gradient(to bottom, #052e16, #14532d)',
            particleType: 'spores',
            overlayStyle: ''
        }
    },
    {
        id: 5,
        name: 'Storm Peaks',
        theme: 'Lightning',
        powerThreshold: 10000000,
        newRarity: 'storm',
        floorRange: [601, 750],
        bossName: 'Thunderbird',
        bossDescription: 'A creature of pure electricity.',
        bossPower: 8000000,
        rewards: { shadowName: 'Storm Essence', titleName: 'Stormbringer', frameName: 'Lightning Frame' },
        visuals: {
            primaryColor: '#a855f7', // Purple-500
            secondaryColor: '#e879f9', // Fuchsia-400
            textColor: '#faf5ff',
            borderColor: 'rgba(168, 85, 247, 0.6)',
            backgroundColor: 'linear-gradient(to bottom, #2e1065, #581c87)',
            particleType: 'lightning',
            overlayStyle: ''
        }
    },
    // Tier 2: The Cosmos
    {
        id: 6,
        name: 'Lunar Surface',
        theme: 'Moon',
        powerThreshold: 20000000,
        newRarity: 'lunar',
        floorRange: [751, 900],
        bossName: 'Moon Walker',
        bossDescription: 'A silent sentinel of the moon.',
        bossPower: 16000000,
        rewards: { shadowName: 'Moon Dust', titleName: 'Lunar Knight', frameName: 'Crater Frame' },
        visuals: {
            primaryColor: '#94a3b8', // Slate-400
            secondaryColor: '#e2e8f0', // Slate-200
            textColor: '#f8fafc',
            borderColor: 'rgba(148, 163, 184, 0.5)',
            backgroundColor: '#0f172a',
            particleType: 'dust',
            overlayStyle: 'grayscale'
        }
    },
    {
        id: 7,
        name: 'Solar Flare',
        theme: 'Sun',
        powerThreshold: 40000000,
        newRarity: 'solar',
        floorRange: [901, 1050],
        bossName: 'Sun God',
        bossDescription: 'Radiance incarnate.',
        bossPower: 32000000,
        rewards: { shadowName: 'Solar Flare', titleName: 'Sun Born', frameName: 'Corona Frame' },
        visuals: {
            primaryColor: '#fbbf24', // Amber-400
            secondaryColor: '#f59e0b', // Amber-500
            textColor: '#fffbeb',
            borderColor: 'rgba(251, 191, 36, 0.8)',
            backgroundColor: 'linear-gradient(to bottom, #451a03, #78350f)',
            particleType: 'plasma',
            overlayStyle: 'brightness-110 contrast-110'
        }
    },
    {
        id: 8,
        name: 'Nebula Cloud',
        theme: 'Nebula',
        powerThreshold: 80000000,
        newRarity: 'nebula',
        floorRange: [1051, 1200],
        bossName: 'Nebula Dragon',
        bossDescription: 'Born from the dust of stars.',
        bossPower: 64000000,
        rewards: { shadowName: 'Stardust', titleName: 'Star Child', frameName: 'Nebula Frame' },
        visuals: {
            primaryColor: '#d946ef', // Fuchsia-500
            secondaryColor: '#2dd4bf', // Teal-400
            textColor: '#fdf4ff',
            borderColor: 'rgba(217, 70, 239, 0.5)',
            backgroundColor: 'linear-gradient(to bottom right, #2e1065, #0f172a, #042f2e)',
            particleType: 'fog',
            overlayStyle: ''
        }
    },
    {
        id: 9,
        name: 'Black Hole',
        theme: 'Gravity',
        powerThreshold: 160000000,
        newRarity: 'singularity',
        floorRange: [1201, 1350],
        bossName: 'Event Horizon',
        bossDescription: 'Nothing escapes.',
        bossPower: 128000000,
        rewards: { shadowName: 'Void Matter', titleName: 'Event Horizon', frameName: 'Gravity Frame' },
        visuals: {
            primaryColor: '#1e293b', // Slate-800
            secondaryColor: '#4c1d95', // Violet-900
            textColor: '#f8fafc',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            backgroundColor: '#000000',
            particleType: 'distortion',
            overlayStyle: 'invert-[0.05]'
        }
    },
    {
        id: 10,
        name: 'Supernova',
        theme: 'Explosion',
        powerThreshold: 320000000,
        newRarity: 'nova',
        floorRange: [1351, 1500],
        bossName: 'Supernova Remnant',
        bossDescription: 'The explosive end of a star.',
        bossPower: 256000000,
        rewards: { shadowName: 'Shockwave', titleName: 'Nova', frameName: 'Explosion Frame' },
        visuals: {
            primaryColor: '#f43f5e', // Rose-500
            secondaryColor: '#fbbf24', // Amber-400
            textColor: '#fff1f2',
            borderColor: 'rgba(244, 63, 94, 0.7)',
            backgroundColor: 'linear-gradient(to bottom, #881337, #4c0519)',
            particleType: 'shockwave',
            overlayStyle: 'contrast-125'
        }
    },
    // Tier 3: The Metaphysical
    {
        id: 11,
        name: 'Cyber Void',
        theme: 'Glitch',
        powerThreshold: 640000000,
        newRarity: 'cyber',
        floorRange: [1501, 1650],
        bossName: 'Mainframe',
        bossDescription: 'The core of the simulation.',
        bossPower: 512000000,
        rewards: { shadowName: 'Glitch', titleName: 'Hacker', frameName: 'Matrix Frame' },
        visuals: {
            primaryColor: '#22c55e', // Green-500
            secondaryColor: '#000000',
            textColor: '#f0fdf4',
            borderColor: 'rgba(34, 197, 94, 0.8)',
            backgroundColor: '#000000',
            particleType: 'glitch',
            overlayStyle: ''
        }
    },
    {
        id: 12,
        name: 'Crystal Realm',
        theme: 'Crystal',
        powerThreshold: 1280000000,
        newRarity: 'crystal',
        floorRange: [1651, 1800],
        bossName: 'Crystal Golem',
        bossDescription: 'Perfection in geometric form.',
        bossPower: 1024000000,
        rewards: { shadowName: 'Prism', titleName: 'Crystalline', frameName: 'Shard Frame' },
        visuals: {
            primaryColor: '#a7f3d0', // Emerald-200
            secondaryColor: '#fbcfe8', // Pink-200
            textColor: '#ffffff',
            borderColor: 'rgba(255, 255, 255, 0.6)',
            backgroundColor: 'linear-gradient(135deg, #e0f2fe, #fce7f3)',
            particleType: 'sparkles',
            overlayStyle: 'backdrop-blur-sm'
        }
    },
    {
        id: 13,
        name: 'Spirit World',
        theme: 'Spirit',
        powerThreshold: 2560000000,
        newRarity: 'ethereal',
        floorRange: [1801, 1950],
        bossName: 'Phantom King',
        bossDescription: 'Ruler of the departed.',
        bossPower: 2048000000,
        rewards: { shadowName: 'Soul Wisp', titleName: 'Medium', frameName: 'Ghost Frame' },
        visuals: {
            primaryColor: '#93c5fd', // Blue-300
            secondaryColor: '#e0f2fe', // Sky-100
            textColor: '#f0f9ff',
            borderColor: 'rgba(147, 197, 253, 0.4)',
            backgroundColor: '#1e293b',
            particleType: 'fog',
            overlayStyle: 'opacity-80'
        }
    },
    {
        id: 14,
        name: 'Blood Moon',
        theme: 'Vampire',
        powerThreshold: 5120000000,
        newRarity: 'crimson',
        floorRange: [1951, 2100],
        bossName: 'Vampire Lord',
        bossDescription: 'Eternal thirst.',
        bossPower: 4096000000,
        rewards: { shadowName: 'Blood Drop', titleName: 'Nosferatu', frameName: 'Gothic Frame' },
        visuals: {
            primaryColor: '#991b1b', // Red-800
            secondaryColor: '#000000',
            textColor: '#fef2f2',
            borderColor: 'rgba(153, 27, 27, 0.8)',
            backgroundColor: '#000000',
            particleType: 'embers',
            overlayStyle: 'sepia-[0.5] hue-rotate-[-50deg]'
        }
    },
    {
        id: 15,
        name: 'Golden Age',
        theme: 'Divine',
        powerThreshold: 10240000000,
        newRarity: 'heavenly',
        floorRange: [2101, 2250],
        bossName: 'Seraphim',
        bossDescription: 'Be not afraid.',
        bossPower: 8192000000,
        rewards: { shadowName: 'Halo', titleName: 'Saint', frameName: 'Golden Frame' },
        visuals: {
            primaryColor: '#fbbf24', // Amber-400
            secondaryColor: '#ffffff',
            textColor: '#fffbeb',
            borderColor: 'rgba(251, 191, 36, 0.9)',
            backgroundColor: 'linear-gradient(to bottom, #fffbeb, #fef3c7)',
            particleType: 'sparkles',
            overlayStyle: 'brightness-125'
        }
    },
    // Tier 4: The Absolute
    {
        id: 16,
        name: 'Antimatter',
        theme: 'Inversion',
        powerThreshold: 20480000000,
        newRarity: 'antimatter',
        floorRange: [2251, 2400],
        bossName: 'Anti-Monitor',
        bossDescription: 'The opposite of existence.',
        bossPower: 16384000000,
        rewards: { shadowName: 'Null', titleName: 'Negator', frameName: 'Inverted Frame' },
        visuals: {
            primaryColor: '#ffffff',
            secondaryColor: '#000000',
            textColor: '#ffffff',
            borderColor: '#ffffff',
            backgroundColor: '#000000',
            particleType: 'distortion',
            overlayStyle: 'invert'
        }
    },
    {
        id: 17,
        name: 'Time Rift',
        theme: 'Time',
        powerThreshold: 40960000000,
        newRarity: 'temporal',
        floorRange: [2401, 2550],
        bossName: 'Chronos',
        bossDescription: 'Time is irrelevant.',
        bossPower: 32768000000,
        rewards: { shadowName: 'Hourglass', titleName: 'Time Lord', frameName: 'Clockwork Frame' },
        visuals: {
            primaryColor: '#d97706', // Amber-600
            secondaryColor: '#78350f', // Amber-900
            textColor: '#fffbeb',
            borderColor: 'rgba(217, 119, 6, 0.6)',
            backgroundColor: '#292524',
            particleType: 'dust',
            overlayStyle: 'sepia'
        }
    },
    {
        id: 18,
        name: 'Chaos Dimension',
        theme: 'Chaos',
        powerThreshold: 81920000000,
        newRarity: 'chaotic',
        floorRange: [2551, 2700],
        bossName: 'Shoggoth',
        bossDescription: 'Formless fear.',
        bossPower: 65536000000,
        rewards: { shadowName: 'Entropy', titleName: 'Chaotic', frameName: 'Fractal Frame' },
        visuals: {
            primaryColor: '#ec4899', // Pink-500
            secondaryColor: '#22c55e', // Green-500
            textColor: '#ffffff',
            borderColor: 'rgba(236, 72, 153, 0.8)',
            backgroundColor: '#111827',
            particleType: 'glitch',
            overlayStyle: 'hue-rotate-90'
        }
    },
    {
        id: 19,
        name: 'The Void',
        theme: 'Void',
        powerThreshold: 163840000000,
        newRarity: 'void',
        floorRange: [2701, 2850],
        bossName: 'The Nothing',
        bossDescription: '...',
        bossPower: 131072000000,
        rewards: { shadowName: 'Empty', titleName: 'Null', frameName: 'Void Frame' },
        visuals: {
            primaryColor: '#171717', // Neutral-900
            secondaryColor: '#000000',
            textColor: '#525252',
            borderColor: 'rgba(23, 23, 23, 1)',
            backgroundColor: '#000000',
            particleType: 'none',
            overlayStyle: 'brightness-50'
        }
    },
    {
        id: 20,
        name: 'Singularity',
        theme: 'End',
        powerThreshold: 327680000000,
        newRarity: 'omega',
        floorRange: [2851, 3000],
        bossName: 'The One',
        bossDescription: 'All is one.',
        bossPower: 262144000000,
        rewards: { shadowName: 'Universe', titleName: 'The One', frameName: 'Infinity Frame' },
        visuals: {
            primaryColor: '#ffffff',
            secondaryColor: '#ffffff',
            textColor: '#ffffff',
            borderColor: '#ffffff',
            backgroundColor: 'linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)',
            particleType: 'sparkles',
            overlayStyle: ''
        }
    }
];

// Get Zone Info
export const getZoneInfo = (zoneId: number): ZoneDefinition => {
    // For zones beyond 20, we can loop or procedurally generate, but for now let's clamp or loop
    if (zoneId > 20) {
        // Simple loop for now to avoid crashes
        const baseZone = ZONES[(zoneId - 1) % 20];
        return {
            ...baseZone,
            id: zoneId,
            name: `${baseZone.name} (Loop ${Math.ceil(zoneId / 20)})`,
            powerThreshold: baseZone.powerThreshold * Math.pow(2, zoneId - baseZone.id)
        };
    }
    return ZONES[zoneId - 1] || ZONES[0];
};

// Calculate Zone Threshold
export const calculateZoneThreshold = (zoneId: number): number => {
    return getZoneInfo(zoneId).powerThreshold;
};

// Check if player can challenge zone boss
// NOW REQUIRES: Reaching the max floor of the current zone.
export const canChallengeZoneBoss = (currentPower: number, currentZone: number, maxReachedFloor: number): boolean => {
    const zoneInfo = getZoneInfo(currentZone);
    const maxFloorInZone = zoneInfo.floorRange[1];

    // Must have cleared the last floor of the current zone
    // (e.g. Zone 1 ends at 150. If maxReachedFloor is 150, I can challenge boss to enter Zone 2)
    return maxReachedFloor >= maxFloorInZone;
};

export const getNextZoneInfo = (currentZone: number) => {
    return getZoneInfo(currentZone + 1);
};

// Get Zone ID based on power
export const getZoneIdForPower = (power: number): number => {
    // Iterate backwards to find the highest threshold met
    for (let i = ZONES.length - 1; i >= 0; i--) {
        if (power >= ZONES[i].powerThreshold) {
            return ZONES[i].id;
        }
    }
    return 1; // Default to Zone 1
};

