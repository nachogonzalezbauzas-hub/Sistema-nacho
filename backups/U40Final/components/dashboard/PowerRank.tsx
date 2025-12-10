import React from 'react';
import { Zap } from 'lucide-react';
import { t, Language } from '../../data/translations';

// 50 Power Ranks from 0 to 1,000,000
// Exponential scaling for satisfying progression
export const POWER_RANKS = [
    // Tier 1-10: Initiate (Gray → Green)
    { rank: 1, name: 'Initiate I', min: 0, hex: '#4a5568', glow: '', shimmer: false, rainbow: false },
    { rank: 2, name: 'Initiate II', min: 100, hex: '#5a6678', glow: '', shimmer: false, rainbow: false },
    { rank: 3, name: 'Initiate III', min: 250, hex: '#6a7688', glow: '', shimmer: false, rainbow: false },
    { rank: 4, name: 'Initiate IV', min: 500, hex: '#718096', glow: '', shimmer: false, rainbow: false },
    { rank: 5, name: 'Initiate V', min: 800, hex: '#a0aec0', glow: '', shimmer: false, rainbow: false },
    { rank: 6, name: 'Scout I', min: 1200, hex: '#48bb78', glow: 'shadow-[0_0_10px_rgba(72,187,120,0.15)]', shimmer: false, rainbow: false },
    { rank: 7, name: 'Scout II', min: 1800, hex: '#38a169', glow: 'shadow-[0_0_12px_rgba(56,161,105,0.2)]', shimmer: false, rainbow: false },
    { rank: 8, name: 'Scout III', min: 2500, hex: '#2f855a', glow: 'shadow-[0_0_14px_rgba(47,133,90,0.25)]', shimmer: false, rainbow: false },
    { rank: 9, name: 'Scout IV', min: 3500, hex: '#276749', glow: 'shadow-[0_0_16px_rgba(39,103,73,0.3)]', shimmer: false, rainbow: false },
    { rank: 10, name: 'Scout V', min: 5000, hex: '#22c55e', glow: 'shadow-[0_0_18px_rgba(34,197,94,0.35)]', shimmer: false, rainbow: false },

    // Tier 11-20: Warrior (Teal → Blue)
    { rank: 11, name: 'Warrior I', min: 7000, hex: '#14b8a6', glow: 'shadow-[0_0_15px_rgba(20,184,166,0.25)]', shimmer: false, rainbow: false },
    { rank: 12, name: 'Warrior II', min: 9500, hex: '#0d9488', glow: 'shadow-[0_0_17px_rgba(13,148,136,0.3)]', shimmer: false, rainbow: false },
    { rank: 13, name: 'Warrior III', min: 12500, hex: '#0891b2', glow: 'shadow-[0_0_19px_rgba(8,145,178,0.35)]', shimmer: false, rainbow: false },
    { rank: 14, name: 'Warrior IV', min: 16000, hex: '#0284c7', glow: 'shadow-[0_0_21px_rgba(2,132,199,0.4)]', shimmer: false, rainbow: false },
    { rank: 15, name: 'Warrior V', min: 20000, hex: '#0ea5e9', glow: 'shadow-[0_0_23px_rgba(14,165,233,0.45)]', shimmer: true, rainbow: false },
    { rank: 16, name: 'Knight I', min: 25000, hex: '#3b82f6', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.35)]', shimmer: true, rainbow: false },
    { rank: 17, name: 'Knight II', min: 31000, hex: '#2563eb', glow: 'shadow-[0_0_22px_rgba(37,99,235,0.4)]', shimmer: true, rainbow: false },
    { rank: 18, name: 'Knight III', min: 38000, hex: '#1d4ed8', glow: 'shadow-[0_0_24px_rgba(29,78,216,0.45)]', shimmer: true, rainbow: false },
    { rank: 19, name: 'Knight IV', min: 46000, hex: '#1e40af', glow: 'shadow-[0_0_26px_rgba(30,64,175,0.5)]', shimmer: true, rainbow: false },
    { rank: 20, name: 'Knight V', min: 55000, hex: '#6366f1', glow: 'shadow-[0_0_28px_rgba(99,102,241,0.55)]', shimmer: true, rainbow: false },

    // Tier 21-30: Elite (Indigo → Purple)
    { rank: 21, name: 'Elite I', min: 65000, hex: '#8b5cf6', glow: 'shadow-[0_0_25px_rgba(139,92,246,0.4)]', shimmer: true, rainbow: false },
    { rank: 22, name: 'Elite II', min: 77000, hex: '#7c3aed', glow: 'shadow-[0_0_27px_rgba(124,58,237,0.45)]', shimmer: true, rainbow: false },
    { rank: 23, name: 'Elite III', min: 90000, hex: '#6d28d9', glow: 'shadow-[0_0_29px_rgba(109,40,217,0.5)]', shimmer: true, rainbow: false },
    { rank: 24, name: 'Elite IV', min: 105000, hex: '#a855f7', glow: 'shadow-[0_0_31px_rgba(168,85,247,0.55)]', shimmer: true, rainbow: false },
    { rank: 25, name: 'Elite V', min: 122000, hex: '#c026d3', glow: 'shadow-[0_0_33px_rgba(192,38,211,0.6)]', shimmer: true, rainbow: false },
    { rank: 26, name: 'Champion I', min: 140000, hex: '#d946ef', glow: 'shadow-[0_0_30px_rgba(217,70,239,0.5)]', shimmer: true, rainbow: false },
    { rank: 27, name: 'Champion II', min: 160000, hex: '#e879f9', glow: 'shadow-[0_0_32px_rgba(232,121,249,0.55)]', shimmer: true, rainbow: false },
    { rank: 28, name: 'Champion III', min: 182000, hex: '#f0abfc', glow: 'shadow-[0_0_34px_rgba(240,171,252,0.6)]', shimmer: true, rainbow: false },
    { rank: 29, name: 'Champion IV', min: 206000, hex: '#f472b6', glow: 'shadow-[0_0_36px_rgba(244,114,182,0.65)]', shimmer: true, rainbow: false },
    { rank: 30, name: 'Champion V', min: 232000, hex: '#ec4899', glow: 'shadow-[0_0_38px_rgba(236,72,153,0.7)]', shimmer: true, rainbow: false },

    // Tier 31-40: Master (Gold → Orange → Red)
    { rank: 31, name: 'Master I', min: 260000, hex: '#fbbf24', glow: 'shadow-[0_0_35px_rgba(251,191,36,0.55)]', shimmer: true, rainbow: false },
    { rank: 32, name: 'Master II', min: 292000, hex: '#f59e0b', glow: 'shadow-[0_0_37px_rgba(245,158,11,0.6)]', shimmer: true, rainbow: false },
    { rank: 33, name: 'Master III', min: 326000, hex: '#d97706', glow: 'shadow-[0_0_39px_rgba(217,119,6,0.65)]', shimmer: true, rainbow: false },
    { rank: 34, name: 'Master IV', min: 364000, hex: '#ea580c', glow: 'shadow-[0_0_41px_rgba(234,88,12,0.7)]', shimmer: true, rainbow: false },
    { rank: 35, name: 'Master V', min: 405000, hex: '#f97316', glow: 'shadow-[0_0_43px_rgba(249,115,22,0.75)]', shimmer: true, rainbow: false },
    { rank: 36, name: 'Grandmaster I', min: 450000, hex: '#ef4444', glow: 'shadow-[0_0_40px_rgba(239,68,68,0.6)]', shimmer: true, rainbow: false },
    { rank: 37, name: 'Grandmaster II', min: 500000, hex: '#dc2626', glow: 'shadow-[0_0_42px_rgba(220,38,38,0.65)]', shimmer: true, rainbow: false },
    { rank: 38, name: 'Grandmaster III', min: 555000, hex: '#b91c1c', glow: 'shadow-[0_0_44px_rgba(185,28,28,0.7)]', shimmer: true, rainbow: false },
    { rank: 39, name: 'Grandmaster IV', min: 615000, hex: '#991b1b', glow: 'shadow-[0_0_46px_rgba(153,27,27,0.75)]', shimmer: true, rainbow: false },
    { rank: 40, name: 'Grandmaster V', min: 680000, hex: '#ff0000', glow: 'shadow-[0_0_48px_rgba(255,0,0,0.8)]', shimmer: true, rainbow: false },

    // Tier 41-50: Legend → Monarch (Special effects)
    { rank: 41, name: 'Legend I', min: 750000, hex: '#fafafa', glow: 'shadow-[0_0_45px_rgba(250,250,250,0.6)]', shimmer: true, rainbow: false },
    { rank: 42, name: 'Legend II', min: 800000, hex: '#ffffff', glow: 'shadow-[0_0_48px_rgba(255,255,255,0.65)]', shimmer: true, rainbow: false },
    { rank: 43, name: 'Legend III', min: 850000, hex: '#ffffff', glow: 'shadow-[0_0_51px_rgba(255,255,255,0.7)]', shimmer: true, rainbow: false },
    { rank: 44, name: 'Legend IV', min: 895000, hex: '#ffffff', glow: 'shadow-[0_0_54px_rgba(255,255,255,0.75)]', shimmer: true, rainbow: false },
    { rank: 45, name: 'Legend V', min: 935000, hex: '#ffffff', glow: 'shadow-[0_0_57px_rgba(255,255,255,0.8)]', shimmer: true, rainbow: true },
    { rank: 46, name: 'Monarch I', min: 960000, hex: '#ffffff', glow: 'shadow-[0_0_55px_rgba(255,255,255,0.7)]', shimmer: true, rainbow: true },
    { rank: 47, name: 'Monarch II', min: 975000, hex: '#ffffff', glow: 'shadow-[0_0_58px_rgba(255,255,255,0.75)]', shimmer: true, rainbow: true },
    { rank: 48, name: 'Monarch III', min: 985000, hex: '#ffffff', glow: 'shadow-[0_0_61px_rgba(255,255,255,0.8)]', shimmer: true, rainbow: true },
    { rank: 49, name: 'Monarch IV', min: 993000, hex: '#ffffff', glow: 'shadow-[0_0_64px_rgba(255,255,255,0.85)]', shimmer: true, rainbow: true },
    { rank: 50, name: 'Shadow Monarch', min: 1000000, hex: '#ffffff', glow: 'shadow-[0_0_70px_rgba(255,255,255,0.9)]', shimmer: true, rainbow: true },
];

export const getPowerRank = (power: number) => {
    let currentRank = POWER_RANKS[0];
    for (const rank of POWER_RANKS) {
        if (power >= rank.min) {
            currentRank = rank;
        } else {
            break;
        }
    }
    return currentRank;
};

interface PowerRankBadgeProps {
    power: number;
    language?: Language;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const PowerRankBadge: React.FC<PowerRankBadgeProps> = ({
    power,
    language = 'en',
    showLabel = true,
    size = 'md'
}) => {
    const rankData = getPowerRank(power);
    const isHighRank = rankData.rank >= 15;

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <>
            <style>{`
                @keyframes power-shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes power-rainbow {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                .power-shimmer::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255,255,255,0.1) 50%,
                        transparent 100%
                    );
                    background-size: 200% 100%;
                    animation: power-shimmer 3s ease-in-out infinite;
                }
            `}</style>

            <div className={`
                relative overflow-hidden
                ${rankData.glow}
                ${rankData.shimmer ? 'power-shimmer' : ''}
            `}>
                <div
                    className={`
                        relative bg-black/60 backdrop-blur-sm flex items-center gap-3
                        ${sizeClasses[size]}
                    `}
                    style={{ border: `1px solid ${rankData.hex}40` }}
                >
                    {/* Inner accent lines */}
                    {isHighRank && (
                        <>
                            <div className="absolute top-1 left-1 right-1 h-[1px]" style={{ backgroundColor: `${rankData.hex}30` }} />
                            <div className="absolute bottom-1 left-1 right-1 h-[1px]" style={{ backgroundColor: `${rankData.hex}30` }} />
                        </>
                    )}

                    <Zap
                        size={size === 'lg' ? 24 : size === 'md' ? 18 : 14}
                        style={{ color: rankData.hex }}
                        className={rankData.rainbow ? '' : `drop-shadow-[0_0_6px_${rankData.hex}]`}
                    />

                    <div className="relative z-10 flex flex-col">
                        {showLabel && (
                            <div
                                className="text-[8px] uppercase tracking-[0.2em] font-medium"
                                style={{ color: `${rankData.hex}99` }}
                            >
                                Hunter Power
                            </div>
                        )}
                        <div
                            className={`font-bold tracking-wider ${size === 'lg' ? 'text-xl' : size === 'md' ? 'text-base' : 'text-sm'}`}
                            style={rankData.rainbow ? {
                                background: 'linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #5f27cd, #ff6b6b)',
                                backgroundSize: '200% 100%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: 'power-rainbow 3s linear infinite',
                            } : {
                                color: rankData.hex,
                                textShadow: rankData.rank >= 10 ? `0 0 ${Math.min(rankData.rank, 30)}px ${rankData.hex}` : 'none',
                            }}
                        >
                            {power.toLocaleString()}
                        </div>
                    </div>

                    {/* Corner decorations for high ranks */}
                    {rankData.rank >= 30 && (
                        <>
                            <div className="absolute top-0 left-0 w-3 h-[2px]" style={{ backgroundColor: rankData.hex }} />
                            <div className="absolute top-0 left-0 w-[2px] h-3" style={{ backgroundColor: rankData.hex }} />
                            <div className="absolute bottom-0 right-0 w-3 h-[2px]" style={{ backgroundColor: rankData.hex }} />
                            <div className="absolute bottom-0 right-0 w-[2px] h-3" style={{ backgroundColor: rankData.hex }} />
                        </>
                    )}
                </div>
            </div>
        </>
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
