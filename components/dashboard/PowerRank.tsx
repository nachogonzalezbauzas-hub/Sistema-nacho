import React from 'react';
import { Zap } from 'lucide-react';
import { t, Language } from '@/data/translations';
import { getZoneIdForPower, getZoneInfo, ZoneDefinition } from '@/data/zoneSystem';

// 50 Power Ranks from 0 to 1,000,000
export const POWER_RANKS = [
    // Tier 1-10: Initiate (Gray → Green)
    { rank: 1, name: 'Initiate I', min: 0, hex: '#4a5568' },
    { rank: 2, name: 'Initiate II', min: 100, hex: '#5a6678' },
    { rank: 3, name: 'Initiate III', min: 250, hex: '#6a7688' },
    { rank: 4, name: 'Initiate IV', min: 500, hex: '#718096' },
    { rank: 5, name: 'Initiate V', min: 800, hex: '#a0aec0' },
    { rank: 6, name: 'Scout I', min: 1200, hex: '#48bb78' },
    { rank: 7, name: 'Scout II', min: 1800, hex: '#38a169' },
    { rank: 8, name: 'Scout III', min: 2500, hex: '#2f855a' },
    { rank: 9, name: 'Scout IV', min: 3500, hex: '#276749' },
    { rank: 10, name: 'Scout V', min: 5000, hex: '#22c55e' },

    // Tier 11-20: Warrior (Teal → Blue)
    { rank: 11, name: 'Warrior I', min: 7000, hex: '#14b8a6' },
    { rank: 12, name: 'Warrior II', min: 9500, hex: '#0d9488' },
    { rank: 13, name: 'Warrior III', min: 12500, hex: '#0891b2' },
    { rank: 14, name: 'Warrior IV', min: 16000, hex: '#0284c7' },
    { rank: 15, name: 'Warrior V', min: 20000, hex: '#0ea5e9' },
    { rank: 16, name: 'Knight I', min: 25000, hex: '#3b82f6' },
    { rank: 17, name: 'Knight II', min: 31000, hex: '#2563eb' },
    { rank: 18, name: 'Knight III', min: 38000, hex: '#1d4ed8' },
    { rank: 19, name: 'Knight IV', min: 46000, hex: '#1e40af' },
    { rank: 20, name: 'Knight V', min: 55000, hex: '#6366f1' },

    // Tier 21-30: Elite (Indigo → Purple)
    { rank: 21, name: 'Elite I', min: 65000, hex: '#8b5cf6' },
    { rank: 22, name: 'Elite II', min: 77000, hex: '#7c3aed' },
    { rank: 23, name: 'Elite III', min: 90000, hex: '#6d28d9' },
    { rank: 24, name: 'Elite IV', min: 105000, hex: '#a855f7' },
    { rank: 25, name: 'Elite V', min: 122000, hex: '#c026d3' },
    { rank: 26, name: 'Champion I', min: 140000, hex: '#d946ef' },
    { rank: 27, name: 'Champion II', min: 160000, hex: '#e879f9' },
    { rank: 28, name: 'Champion III', min: 182000, hex: '#f0abfc' },
    { rank: 29, name: 'Champion IV', min: 206000, hex: '#f472b6' },
    { rank: 30, name: 'Champion V', min: 232000, hex: '#ec4899' },

    // Tier 31-40: Master (Gold → Orange → Red)
    { rank: 31, name: 'Master I', min: 260000, hex: '#fbbf24' },
    { rank: 32, name: 'Master II', min: 292000, hex: '#f59e0b' },
    { rank: 33, name: 'Master III', min: 326000, hex: '#d97706' },
    { rank: 34, name: 'Master IV', min: 364000, hex: '#ea580c' },
    { rank: 35, name: 'Master V', min: 405000, hex: '#f97316' },
    { rank: 36, name: 'Grandmaster I', min: 450000, hex: '#ef4444' },
    { rank: 37, name: 'Grandmaster II', min: 500000, hex: '#dc2626' },
    { rank: 38, name: 'Grandmaster III', min: 555000, hex: '#b91c1c' },
    { rank: 39, name: 'Grandmaster IV', min: 615000, hex: '#991b1b' },
    { rank: 40, name: 'Grandmaster V', min: 680000, hex: '#ff0000' },

    // Tier 41-50: Legend → Monarch
    { rank: 41, name: 'Legend I', min: 750000, hex: '#fafafa' },
    { rank: 42, name: 'Legend II', min: 800000, hex: '#ffffff' },
    { rank: 43, name: 'Legend III', min: 850000, hex: '#ffffff' },
    { rank: 44, name: 'Legend IV', min: 895000, hex: '#ffffff' },
    { rank: 45, name: 'Legend V', min: 935000, hex: '#ffffff' },
    { rank: 46, name: 'Monarch I', min: 960000, hex: '#ffffff' },
    { rank: 47, name: 'Monarch II', min: 975000, hex: '#ffffff' },
    { rank: 48, name: 'Monarch III', min: 985000, hex: '#ffffff' },
    { rank: 49, name: 'Monarch IV', min: 993000, hex: '#ffffff' },
    { rank: 50, name: 'Shadow Monarch', min: 1000000, hex: '#ffffff' },

    // Tier 51-62: Celestial
    { rank: 51, name: 'Celestial I', min: 1020000, hex: '#22d3ee' },
    { rank: 52, name: 'Celestial II', min: 1040000, hex: '#06b6d4' },
    { rank: 53, name: 'Celestial III', min: 1060000, hex: '#0891b2' },
    { rank: 54, name: 'Celestial IV', min: 1080000, hex: '#0ea5e9' },
    { rank: 55, name: 'Celestial V', min: 1100000, hex: '#38bdf8' },
    { rank: 56, name: 'Divine I', min: 1120000, hex: '#e0f2fe' },
    { rank: 57, name: 'Divine II', min: 1140000, hex: '#c084fc' },
    { rank: 58, name: 'Divine III', min: 1160000, hex: '#a855f7' },
    { rank: 59, name: 'Divine IV', min: 1180000, hex: '#d8b4fe' },
    { rank: 60, name: 'Divine V', min: 1200000, hex: '#f0abfc' },
    { rank: 61, name: 'Transcendent', min: 1225000, hex: '#ffffff' },
    { rank: 62, name: 'Absolute Being', min: 1250000, hex: '#ffffff' },
];

// Generate dynamic rank for power levels beyond Zone 1 (1.25M+)
export const generateDynamicRank = (power: number) => {
    const zoneId = getZoneIdForPower(power);
    const zoneInfo = getZoneInfo(zoneId);

    const currentZoneThreshold = zoneInfo.powerThreshold;
    const nextZoneInfo = getZoneInfo(zoneId + 1);
    const nextZoneThreshold = nextZoneInfo.powerThreshold;

    const range = nextZoneThreshold - currentZoneThreshold;
    const progress = range > 0 ? (power - currentZoneThreshold) / range : 0;

    const subRank = Math.min(10, Math.floor(progress * 10) + 1);
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

    const visuals = zoneInfo.visuals;

    return {
        rank: 62 + ((zoneId - 2) * 10) + subRank,
        name: `${zoneInfo.name} ${romanNumerals[subRank - 1]}`,
        min: power,
        hex: visuals.primaryColor,
        zoneId: zoneId,
        subRank: subRank,
        visuals: visuals
    };
};

export const getPowerRank = (power: number) => {
    if (power < 1250000) {
        let currentRank = POWER_RANKS[0];
        for (const rank of POWER_RANKS) {
            if (power >= rank.min) {
                currentRank = rank;
            } else {
                break;
            }
        }
        return currentRank;
    }

    return generateDynamicRank(power);
};

interface PowerRankBadgeProps {
    power: number;
    language?: Language;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

// Calculate visual tier based on power (0-100 scale for complexity)
const getVisualComplexity = (power: number, zoneId: number): number => {
    // Zone 1 (0 - 1.25M): 0-20% complexity
    // Zone 2-5: 20-40%
    // Zone 6-10: 40-60%
    // Zone 11-15: 60-80%
    // Zone 16-20: 80-100%
    if (power < 1250000) {
        return Math.min(20, (power / 1250000) * 20);
    }
    if (zoneId <= 5) return 20 + ((zoneId - 1) / 4) * 20;
    if (zoneId <= 10) return 40 + ((zoneId - 5) / 5) * 20;
    if (zoneId <= 15) return 60 + ((zoneId - 10) / 5) * 20;
    return 80 + ((zoneId - 15) / 5) * 20;
};

export const PowerRankBadge: React.FC<PowerRankBadgeProps> = ({
    power,
    language = 'en',
    showLabel = true,
    size = 'md'
}) => {
    const rankData = getPowerRank(power);
    const visuals = (rankData as any).visuals;
    const zoneId = (rankData as any).zoneId || getZoneIdForPower(power);

    // Visual complexity from 0-100
    const complexity = getVisualComplexity(power, zoneId);

    // Colors - more colors as complexity increases
    const primaryColor = visuals?.primaryColor || rankData.hex;
    const secondaryColor = visuals?.secondaryColor || '#ffffff';
    const tertiaryColor = visuals?.borderColor || primaryColor;

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-8 py-4 text-lg',
    };

    // Progressive visual features based on complexity
    const hasGlow = complexity >= 10;
    const hasShimmer = complexity >= 30;
    const hasMultiColorBorder = complexity >= 50;
    const hasParticles = complexity >= 60;
    const hasRainbowText = complexity >= 80;
    const hasPulse = complexity >= 90;
    const hasCosmicBackground = complexity >= 95;

    // Glow intensity scales with complexity
    const glowIntensity = Math.floor(complexity / 5) + 5; // 5-25px
    const glowOpacity = 0.2 + (complexity / 100) * 0.6; // 0.2 - 0.8

    // Border width scales
    const borderWidth = complexity >= 70 ? 3 : complexity >= 40 ? 2 : 1;

    // Animation speed increases with complexity
    const animationSpeed = Math.max(1, 5 - (complexity / 25)); // 5s -> 1s

    return (
        <div
            className={`
                    relative overflow-hidden rounded-xl h-full
                    ${hasPulse ? `animate-[power-pulse-${rankData.rank}_${animationSpeed}s_ease-in-out_infinite]` : ''}
                `}
            style={{
                boxShadow: hasGlow ? `0 0 ${glowIntensity}px ${primaryColor}${Math.floor(glowOpacity * 255).toString(16).padStart(2, '0')}` : 'none'
            }}
        >
            <style>{`
                    @keyframes power-shimmer-${rankData.rank} {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    @keyframes power-pulse-${rankData.rank} {
                        0%, 100% { box-shadow: 0 0 ${glowIntensity}px ${primaryColor}${Math.floor(glowOpacity * 255).toString(16).padStart(2, '0')}; }
                        50% { box-shadow: 0 0 ${glowIntensity * 2}px ${primaryColor}, 0 0 ${glowIntensity * 3}px ${secondaryColor}80; }
                    }
                    @keyframes power-rainbow-${rankData.rank} {
                        0% { filter: hue-rotate(0deg); }
                        100% { filter: hue-rotate(360deg); }
                    }
                    @keyframes power-border-dance-${rankData.rank} {
                        0%, 100% { border-color: ${primaryColor}; }
                        33% { border-color: ${secondaryColor}; }
                        66% { border-color: ${tertiaryColor}; }
                    }
                    @keyframes power-cosmic-bg-${rankData.rank} {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    @keyframes float-particle {
                        0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
                        50% { transform: translateY(-10px) scale(1.2); opacity: 1; }
                    }
                `}</style>
            {/* Cosmic Background for highest tiers */}
            {hasCosmicBackground && (
                <div
                    className="absolute inset-0 opacity-50"
                    style={{
                        background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${tertiaryColor}, ${primaryColor})`,
                        backgroundSize: '300% 100%',
                        animation: `power-cosmic-bg-${rankData.rank} ${animationSpeed * 2}s linear infinite`
                    }}
                />
            )}

            {/* Shimmer overlay */}
            {hasShimmer && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `linear-gradient(90deg, transparent 0%, ${primaryColor}30 20%, ${secondaryColor}50 50%, ${primaryColor}30 80%, transparent 100%)`,
                        backgroundSize: '200% 100%',
                        animation: `power-shimmer-${rankData.rank} ${animationSpeed}s linear infinite`
                    }}
                />
            )}

            {/* Floating particles for high tiers */}
            {hasParticles && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(Math.floor(complexity / 15))].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 rounded-full"
                            style={{
                                backgroundColor: i % 2 === 0 ? primaryColor : secondaryColor,
                                left: `${10 + (i * 15) % 80}%`,
                                top: `${20 + (i * 23) % 60}%`,
                                animation: `float-particle ${2 + (i % 3)}s ease-in-out infinite`,
                                animationDelay: `${i * 0.2}s`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Main badge container */}
            <div
                className={`
                        relative flex items-center gap-3 backdrop-blur-sm
                        ${sizeClasses[size]}
                        rounded-xl h-full
                    `}
                style={{
                    background: hasCosmicBackground
                        ? 'rgba(0,0,0,0.6)'
                        : complexity >= 50
                            ? `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}10, ${tertiaryColor}20)`
                            : `linear-gradient(135deg, ${primaryColor}15, transparent)`,
                    border: `${borderWidth}px solid ${primaryColor}`,
                    animation: hasMultiColorBorder ? `power-border-dance-${rankData.rank} ${animationSpeed * 2}s ease-in-out infinite` : 'none'
                }}
            >
                {/* Corner accents for higher tiers */}
                {complexity >= 40 && (
                    <>
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 rounded-tl" style={{ borderColor: secondaryColor }} />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 rounded-tr" style={{ borderColor: secondaryColor }} />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 rounded-bl" style={{ borderColor: secondaryColor }} />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 rounded-br" style={{ borderColor: secondaryColor }} />
                    </>
                )}

                {/* Icon with glow - ALWAYS WHITE */}
                <Zap
                    size={size === 'lg' ? 24 : size === 'md' ? 18 : 14}
                    style={{
                        color: '#ffffff',
                        filter: `drop-shadow(0 0 ${glowIntensity}px ${primaryColor})`
                    }}
                />

                <div className="relative z-10 flex flex-col">
                    {showLabel && (
                        <div
                            className="text-[8px] uppercase tracking-[0.2em] font-bold"
                            style={{
                                color: '#ffffff',
                                textShadow: `0 0 8px ${primaryColor}, 0 0 15px ${secondaryColor}`
                            }}
                        >
                            {visuals?.theme || rankData.name}
                        </div>
                    )}
                    <div
                        className={`font-black tracking-wider ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-base'}`}
                        style={{
                            color: '#ffffff',
                            textShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}, 0 0 30px ${secondaryColor}`,
                        }}
                    >
                        {power.toLocaleString()}
                    </div>
                </div>

                {/* Extra glow orbs for highest tiers */}
                {complexity >= 85 && (
                    <>
                        <div
                            className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
                            style={{ backgroundColor: primaryColor, opacity: 0.5 }}
                        />
                        <div
                            className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full animate-ping"
                            style={{ backgroundColor: secondaryColor, opacity: 0.5, animationDelay: '0.5s' }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

// Demo component to show all 50 ranks
export const PowerRankDemo: React.FC = () => {
    return (
        <div className="p-8 bg-slate-950 min-h-screen">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">50 Hunter Power Ranks</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {POWER_RANKS.map((rank) => (
                    <div key={rank.rank} className="flex flex-col items-center gap-2">
                        <div className="text-[10px] text-slate-500 font-mono">
                            #{rank.rank} - {rank.name}
                        </div>
                        <PowerRankBadge power={rank.min} size="sm" showLabel={false} />
                        <div className="text-[9px] text-slate-600">
                            {rank.min.toLocaleString()}+
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
