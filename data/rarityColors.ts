import { TitleRarity } from '@/types';

// Rarity colors for titles and items
export const rarityColors: Record<TitleRarity | string, { border: string; bg: string; text: string; glow: string }> = {
    common: { border: '#94a3b8', bg: 'rgba(148,163,184,0.15)', text: '#94a3b8', glow: 'rgba(148,163,184,0.4)' },
    uncommon: { border: '#22c55e', bg: 'rgba(34,197,94,0.15)', text: '#22c55e', glow: 'rgba(34,197,94,0.5)' },
    rare: { border: '#3b82f6', bg: 'rgba(59,130,246,0.15)', text: '#3b82f6', glow: 'rgba(59,130,246,0.5)' },
    epic: { border: '#a855f7', bg: 'rgba(168,85,247,0.15)', text: '#a855f7', glow: 'rgba(168,85,247,0.5)' },
    legendary: { border: '#f59e0b', bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', glow: 'rgba(245,158,11,0.6)' },
    mythic: { border: '#ef4444', bg: 'rgba(239,68,68,0.15)', text: '#ef4444', glow: 'rgba(239,68,68,0.6)' },
    godlike: { border: '#c084fc', bg: 'rgba(192,132,252,0.15)', text: '#ffffff', glow: 'rgba(192,132,252,0.7)' },
    celestial: { border: '#22d3ee', bg: 'rgba(34,211,238,0.15)', text: '#22d3ee', glow: 'rgba(34,211,238,0.7)' },
    transcendent: { border: '#ffffff', bg: 'rgba(255,255,255,0.15)', text: '#ffffff', glow: 'rgba(255,255,255,0.8)' },
    primordial: { border: '#f59e0b', bg: 'rgba(245,158,11,0.2)', text: '#f59e0b', glow: 'rgba(245,158,11,0.8)' },
    eternal: { border: '#10b981', bg: 'rgba(16,185,129,0.2)', text: '#10b981', glow: 'rgba(10,185,129,0.8)' },
    divine: { border: '#fcd34d', bg: 'rgba(252,211,77,0.2)', text: '#fcd34d', glow: 'rgba(252,211,77,0.8)' },
    cosmic: { border: '#6366f1', bg: 'rgba(99,102,241,0.2)', text: '#6366f1', glow: 'rgba(99,102,241,0.9)' },
    infinite: { border: '#ffffff', bg: 'rgba(255,255,255,0.25)', text: '#ffffff', glow: 'rgba(255,255,255,1)' },
};

// Frame rank colors
export const frameRankColors: Record<string, { border: string; bg: string; text: string; glow: string }> = {
    'C': { border: '#64748b', bg: 'rgba(100,116,139,0.15)', text: '#94a3b8', glow: 'rgba(100,116,139,0.3)' },
    'B': { border: '#22c55e', bg: 'rgba(34,197,94,0.15)', text: '#22c55e', glow: 'rgba(34,197,94,0.5)' },
    'A': { border: '#3b82f6', bg: 'rgba(59,130,246,0.15)', text: '#3b82f6', glow: 'rgba(59,130,246,0.6)' },
    'S': { border: '#a855f7', bg: 'rgba(168,85,247,0.15)', text: '#a855f7', glow: 'rgba(168,85,247,0.6)' },
    'SS': { border: '#f59e0b', bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', glow: 'rgba(245,158,11,0.7)' },
    'SSS': { border: '#f43f5e', bg: 'rgba(244,63,94,0.15)', text: '#f43f5e', glow: 'rgba(244,63,94,0.8)' },
};
