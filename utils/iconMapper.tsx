import React from 'react';
import {
    Sword, Shield, Crown, Skull, Zap, Flame, Snowflake, Droplet,
    Ghost, Heart, Star, Moon, Sun, Cloud, Wind,
    Anchor, Axe, Hammer, Wrench, Gem, Coins,
    Book, Scroll, Map, Compass, Flag,
    Eye, Hand, Footprints, User, Users,
    Trophy, Medal, Target, Crosshair,
    Dna, Brain, Activity, HeartPulse,
    Sparkles, Key, Lock, Unlock,
    Bug, Bird, Cat, Dog, Fish,
    Gamepad2, Dices, Layers, Box, Package, Swords,
    Gift, Diamond, SprayCan
} from 'lucide-react';

export const ICON_MAP: Record<string, React.ElementType> = {
    'Sword': Sword,
    'Shield': Shield,
    'Crown': Crown,
    'Skull': Skull,
    'Zap': Zap,
    'Flame': Flame,
    'Snowflake': Snowflake,
    'Droplet': Droplet,
    'Ghost': Ghost,
    'Heart': Heart,
    'Star': Star,
    'Moon': Moon,
    'Sun': Sun,
    'Cloud': Cloud,
    'Wind': Wind,
    'Anchor': Anchor,
    'Axe': Axe,
    'Hammer': Hammer,
    'Wrench': Wrench,
    'Gem': Gem,
    'Coins': Coins,
    'Book': Book,
    'Scroll': Scroll,
    'Map': Map,
    'Compass': Compass,
    'Flag': Flag,
    'Eye': Eye,
    'Hand': Hand,
    'Footprints': Footprints,
    'User': User,
    'Users': Users,
    'Trophy': Trophy,
    'Medal': Medal,
    'Target': Target,
    'Crosshair': Crosshair,
    'Dna': Dna,
    'Brain': Brain,
    'Activity': Activity,
    'HeartPulse': HeartPulse,
    'Sparkles': Sparkles,
    'Key': Key,
    'Lock': Lock,
    'Unlock': Unlock,
    'Bug': Bug,
    'Bird': Bird,
    'Cat': Cat,
    'Dog': Dog,
    'Fish': Fish,
    'Gamepad': Gamepad2,
    'Dice': Dices,
    'Layers': Layers,
    'Box': Box,
    'Package': Package,
    'Swords': Swords,
    // Emoji Mappings for Global Fix
    '👑': Crown,
    '🎁': Gift,
    '💎': Diamond,
    'SprayCan': SprayCan
};

export const getIconByName = (name: string, size: number = 24, className: string = ''): React.ReactNode => {
    if (!name) return null;

    // Try exact match
    let IconComponent = ICON_MAP[name];

    // Try trimmed
    if (!IconComponent) {
        IconComponent = ICON_MAP[name.trim()];
    }

    // Try case-insensitive
    if (!IconComponent) {
        const lowerName = name.toLowerCase().trim();
        const key = Object.keys(ICON_MAP).find(k => k.toLowerCase() === lowerName);
        if (key) IconComponent = ICON_MAP[key];
    }

    if (IconComponent) {
        return <IconComponent size={size} className={className} />;
    }

    return null;
};

export const getRandomIconName = (): string => {
    const keys = Object.keys(ICON_MAP);
    return keys[Math.floor(Math.random() * keys.length)];
};
