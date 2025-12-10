import { ZONES } from './zoneSystem'; // HMR Trigger
import { TitleDefinition, FrameDefinition } from '../types';
import { Crown, Sparkles, Zap, Flame, Droplets, Mountain, Skull, Moon, Sun, Cloud, Disc, Globe, Box, Terminal, Hexagon, Ghost, Heart } from 'lucide-react';
import React from 'react';

// Helper to pick an icon based on theme
const getZoneIcon = (theme: string) => {
    const t = theme.toLowerCase();
    if (t.includes('fire') || t.includes('magma')) return <Flame size={24} />;
    if (t.includes('water') || t.includes('ocean')) return <Droplets size={24} />;
    if (t.includes('nature') || t.includes('jungle')) return <Mountain size={24} />; // Mountain as proxy for nature / earth
    if (t.includes('lightning') || t.includes('storm')) return <Zap size={24} />;
    if (t.includes('moon') || t.includes('lunar')) return <Moon size={24} />;
    if (t.includes('sun') || t.includes('solar')) return <Sun size={24} />;
    if (t.includes('nebula') || t.includes('star')) return <Sparkles size={24} />;
    if (t.includes('gravity') || t.includes('hole')) return <Disc size={24} />; // Disc as hole
    if (t.includes('explosion') || t.includes('nova')) return <Zap size={24} />;
    if (t.includes('cyber') || t.includes('glitch')) return <Terminal size={24} />;
    if (t.includes('crystal')) return <Hexagon size={24} />;
    if (t.includes('spirit')) return <Ghost size={24} />;
    if (t.includes('blood') || t.includes('vampire')) return <Heart size={24} />;
    if (t.includes('divine') || t.includes('god')) return <Crown size={24} />;
    if (t.includes('void')) return <Box size={24} />;
    return <Globe size={24} />;
};

export const ZONE_TITLES: TitleDefinition[] = ZONES.map(zone => ({
    id: `zone_title_${zone.id}`,
    name: zone.rewards.titleName,
    description: `Conqueror of ${zone.name}`,
    icon: getZoneIcon(zone.theme),
    rarity: zone.newRarity as any, // Cast to ItemRarity
    textStyle: `text-${zone.visuals.primaryColor}`, // Fallback class, actual style handled by rarityColors
    glowStyle: '',
    condition: (state: any) => state.zone?.zoneGuardiansDefeated?.includes(zone.id)
}));

export const ZONE_FRAMES: FrameDefinition[] = ZONES.map(zone => ({
    id: `zone_frame_${zone.id}`,
    name: zone.rewards.frameName,
    description: `Reward from ${zone.name}`,
    rarity: zone.newRarity as any, // Map zone rarity to frame rarity type
    unlockDescription: `Defeat ${zone.bossName}`,
    animation: '', // Styles handled by Avatar.tsx based on rarity
    condition: (state: any) => state.zone?.zoneGuardiansDefeated?.includes(zone.id)
}));
