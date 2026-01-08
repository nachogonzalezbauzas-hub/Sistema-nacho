import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RewardItem, StatType, Title, AvatarFrame, TitleRarity } from '@/types';
import { X, Sparkles, Zap, Target, Trophy, Star, Gem, Dumbbell, Activity, Brain, Crown, Flame, Frame, Shield, Ghost } from 'lucide-react';
import { TITLES, AVATAR_FRAMES } from '@/data/titles';
import { getIconByName } from '@/utils/iconMapper';
import { useStore } from '@/store/useStore';
import { t } from '@/data/translations';

interface UnifiedRewardOverlayProps {
    queue: RewardItem[];
    onClear: () => void;
}

// Stat colors - matching the app's design
const statColors: Record<StatType, { primary: string; bg: string; glow: string; border: string }> = {
    Strength: { primary: '#ef4444', bg: 'rgba(239,68,68,0.15)', glow: 'rgba(239,68,68,0.5)', border: 'rgba(239,68,68,0.6)' },
    Vitality: { primary: '#22c55e', bg: 'rgba(34,197,94,0.15)', glow: 'rgba(34,197,94,0.5)', border: 'rgba(34,197,94,0.6)' },
    Agility: { primary: '#facc15', bg: 'rgba(250,204,21,0.15)', glow: 'rgba(250,204,21,0.5)', border: 'rgba(250,204,21,0.6)' },
    Intelligence: { primary: '#3b82f6', bg: 'rgba(59,130,246,0.15)', glow: 'rgba(59,130,246,0.5)', border: 'rgba(59,130,246,0.6)' },
    Fortune: { primary: '#a855f7', bg: 'rgba(168,85,247,0.15)', glow: 'rgba(168,85,247,0.5)', border: 'rgba(168,85,247,0.6)' },
    Metabolism: { primary: '#f97316', bg: 'rgba(249,115,22,0.15)', glow: 'rgba(249,115,22,0.5)', border: 'rgba(249,115,22,0.6)' },
};

// Default blue for missions without specific stat
const defaultColor = { primary: '#3b82f6', bg: 'rgba(59,130,246,0.15)', glow: 'rgba(59,130,246,0.5)', border: 'rgba(59,130,246,0.6)' };

import { rarityColors, frameRankColors } from '@/data/rarityColors';
import { calculateItemPower } from '@/data/equipmentConstants';

// Get icon for stat type
const getStatIcon = (stat: StatType | undefined, size: number = 24) => {
    switch (stat) {
        case 'Strength': return <Dumbbell size={size} />;
        case 'Vitality': return <Activity size={size} />;
        case 'Agility': return <Zap size={size} />;
        case 'Intelligence': return <Brain size={size} />;
        case 'Fortune': return <Crown size={size} />;
        case 'Metabolism': return <Flame size={size} />;
        default: return <Star size={size} />;
    }
};

const AnimatedCounter = ({ value, duration = 1000 }: { value: number, duration?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const updateCount = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - percentage, 4);

            setCount(Math.floor(value * ease));

            if (progress < duration) {
                animationFrame = requestAnimationFrame(updateCount);
            }
        };

        animationFrame = requestAnimationFrame(updateCount);
        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    return <>{count.toLocaleString()}</>;
};

export const UnifiedRewardOverlay: React.FC<UnifiedRewardOverlayProps> = ({ queue, onClear }) => {
    const language = useStore(state => state.state.settings.language);
    const [currentRewardIndex, setCurrentRewardIndex] = useState(0);
    const [showCard, setShowCard] = useState(false);
    const [showRewards, setShowRewards] = useState(false);

    if (queue.length === 0) return null;

    const currentReward = queue[currentRewardIndex];

    // HOTFIX INTERCEPTORS
    // 1. Detect corrupted "Item Titles" (e.g. "TÍTULO: STORM LORD")
    const isLegacyTitle = currentReward.type === 'item' && (
        (currentReward.name && (currentReward.name.toUpperCase().startsWith('TÍTULO:') || currentReward.name.toUpperCase().startsWith('TITLE:')))
    );

    // 2. Detect corrupted "Item Shards" (e.g. "24 FRAGMENTOS")
    const isLegacyCurrency = currentReward.type === 'item' && (
        (currentReward.name && (currentReward.name.toUpperCase().includes('FRAGMENTOS') || currentReward.name.toUpperCase().includes('SHARDS')))
    );

    // Parse legacy shard value
    const legacyShardValue = isLegacyCurrency ? parseInt(currentReward.name.match(/\d+/)?.[0] || '0') : 0;

    // Get color based on stat
    const getCardColor = () => {
        if (currentReward.targetStat && statColors[currentReward.targetStat]) {
            return statColors[currentReward.targetStat];
        }
        return defaultColor;
    };

    const cardColor = getCardColor();

    // Get full title/frame data (try static lookup, else use queue data)
    // This allows procedural titles/frames to work without being in the static lists
    // HOTFIX: Detect corrupted "Item Titles" from legacy bugs (e.g. "TÍTULO: STORM LORD" as Item)
    // The isLegacyTitle check is now done above.
    const titleData = (currentReward.type === 'title' || isLegacyTitle)
        ? (TITLES.find(t => t.id === currentReward.id || t.name === currentReward.name) || {
            id: currentReward.id,
            name: isLegacyTitle ? currentReward.name.replace(/^(TÍTULO:|TITLE:)\s*/i, '') : currentReward.name,
            description: currentReward.description || 'Rare Title',
            rarity: currentReward.rarity || 'common',
            icon: (isLegacyTitle && (currentReward.icon === '💎' || currentReward.icon === '🛡️')) ? 'Crown' : (currentReward.icon || 'Crown'),
            condition: () => true
        } as Title)
        : null;

    const frameData = currentReward.type === 'frame'
        ? (AVATAR_FRAMES.find(f => f.id === currentReward.id || f.name === currentReward.name) || {
            id: currentReward.id,
            name: currentReward.name,
            description: currentReward.description || 'Rare Avatar Frame',
            rarity: (currentReward.rarity as any) || 'C', // Frame rarity is Rank (C, B, A...) usually but might be string
            condition: () => true
        } as unknown as AvatarFrame)
        : null;

    useEffect(() => {
        setShowCard(false);
        setShowRewards(false);

        const cardTimer = setTimeout(() => setShowCard(true), 50);
        const rewardsTimer = setTimeout(() => setShowRewards(true), 300);

        const audio = new Audio('/audio/levelup.mp3');
        audio.volume = 0.4;
        audio.play().catch(() => { });

        return () => {
            clearTimeout(cardTimer);
            clearTimeout(rewardsTimer);
        };
    }, [currentRewardIndex]);

    const handleNext = () => {
        setShowCard(false);
        setShowRewards(false);

        setTimeout(() => {
            if (currentRewardIndex < queue.length - 1) {
                setCurrentRewardIndex(prev => prev + 1);
            } else {
                onClear();
                setCurrentRewardIndex(0);
            }
        }, 150);
    };

    const handleClose = () => {
        onClear();
        setCurrentRewardIndex(0);
    };

    // Render title card - Uses rarity color with crown icon
    const renderTitleCard = () => {
        if (!titleData) return null;
        // Use rarity-based colors
        const colors = rarityColors[titleData.rarity] || rarityColors.rare;

        const renderTitleIcon = () => {
            if (typeof titleData.icon === 'string') {
                const IconComponent = getIconByName(titleData.icon, 48);
                if (IconComponent) return IconComponent;
                return <Crown size={48} />;
            }
            if (React.isValidElement(titleData.icon)) {
                return React.cloneElement(titleData.icon as React.ReactElement, { size: 48 });
            }
            return <Crown size={48} />;
        };

        return (
            <div style={{
                position: 'relative',
                backgroundColor: '#0a0f1e',
                border: `2px solid ${colors.border}`,
                padding: '32px 40px', // Adjusted padding
                borderRadius: '16px',
                textAlign: 'center',
                minWidth: '320px',
                maxWidth: '400px',
                boxShadow: `0 0 60px ${colors.glow}`
            }}>
                {/* Crown icon in corner */}
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    color: colors.text,
                    opacity: 0.8
                }}>
                    <Crown size={24} />
                </div>

                {/* Icon */}
                <div style={{
                    width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '50%',
                    backgroundColor: colors.bg, border: `2px solid ${colors.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.text,
                    boxShadow: `0 0 25px ${colors.glow}`
                }}>
                    {renderTitleIcon()}
                </div>

                <div style={{ color: colors.text, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '8px' }}>
                    NEW TITLE
                </div>

                <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 900, margin: '0 0 12px 0', textTransform: 'uppercase', textShadow: `0 0 20px ${colors.glow}` }}>
                    {titleData.name}
                </h2>

                {/* Rarity badge */}
                <div style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px'
                }}>
                    <span style={{ color: colors.text, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                        {t(`rarity_${titleData.rarity.toLowerCase()}` as any, language) || titleData.rarity}
                    </span>
                </div>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '16px 0 24px 0' }}>{titleData.description}</p>
                <div style={{ color: '#475569', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Tap to continue</div>
            </div>
        );
    };

    // Render frame card - Uses rank color with Frame icon
    const renderFrameCard = () => {
        if (!frameData) return null;
        // Use rank-based colors
        const colors = frameRankColors[frameData.rarity || 'C'] || frameRankColors['C'];

        return (
            <div style={{
                position: 'relative',
                backgroundColor: '#0a0f1e',
                border: `2px solid ${colors.border}`,
                padding: '40px 48px',
                borderRadius: '16px',
                textAlign: 'center',
                minWidth: '320px',
                maxWidth: '400px',
                boxShadow: `0 0 60px ${colors.glow}`
            }}>
                {/* Frame icon in corner */}
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    color: colors.text,
                    opacity: 0.8
                }}>
                    <Frame size={24} />
                </div>

                {/* NEW TYPE LABEL */}
                <div style={{ color: colors.text, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '8px' }}>
                    AVATAR FRAME
                </div>

                <div style={{
                    display: 'inline-block', padding: '6px 16px',
                    backgroundColor: colors.bg, border: `1px solid ${colors.border}`,
                    borderRadius: '6px', marginBottom: '20px'
                }}>
                    <span style={{ color: colors.text, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                        {t(`rarity_${frameData.rarity?.toLowerCase()}` as any, language) || frameData.rarity} Rank
                    </span>
                </div>

                <div style={{
                    width: '120px', height: '120px', margin: '0 auto 24px', borderRadius: '50%',
                    backgroundColor: '#0f172a', border: `4px solid ${colors.border}`,
                    boxShadow: `0 0 30px ${colors.glow}, inset 0 0 20px ${colors.glow}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' as const
                }}>
                    <div style={{ position: 'absolute', inset: '-8px', borderRadius: '50%', border: `2px solid ${colors.border}`, opacity: 0.4 }} />
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#1e293b', border: `2px solid ${colors.border}40` }} />
                </div>

                <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 900, margin: '0 0 12px 0', textTransform: 'uppercase' }}>{frameData.name}</h2>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 24px 0' }}>{frameData.description}</p>
                <div style={{ color: '#475569', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Tap to continue</div>
            </div>
        );
    };

    // Render level up card
    const renderLevelUpCard = () => (
        <div style={{
            backgroundColor: '#0a0f1e',
            border: `2px solid ${cardColor.border}`,
            padding: '48px 56px',
            borderRadius: '16px',
            textAlign: 'center',
            minWidth: '320px',
            maxWidth: '400px',
            boxShadow: `0 0 80px ${cardColor.glow}`
        }}>
            {/* Icon with rings */}
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 28px' }}>
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: `3px solid ${cardColor.border}`, opacity: 0.3
                }} />
                <div style={{
                    position: 'absolute', inset: '8px', borderRadius: '50%',
                    border: `2px solid ${cardColor.border}`, opacity: 0.5
                }} />
                <div style={{
                    position: 'absolute', inset: '16px', borderRadius: '50%',
                    backgroundColor: '#0f172a', border: `3px solid ${cardColor.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 40px ${cardColor.glow}, inset 0 0 20px ${cardColor.glow}`
                }}>
                    <Zap size={40} color={cardColor.primary} />
                </div>
            </div>

            <div style={{ color: cardColor.primary, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '8px' }}>
                {t('overlay_level_up', language)}
            </div>
            <h2 style={{ color: 'white', fontSize: '48px', fontWeight: 900, margin: 0, textShadow: `0 0 30px ${cardColor.glow}` }}>
                {t('common_level', language).toUpperCase()} {currentReward.name?.replace('Level ', '')}
            </h2>

            <div style={{ marginTop: '32px', color: '#475569', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                {t('overlay_tap_continue', language)}
            </div>
        </div>
    );

    // Render currency cards (XP / Shards stacked on mobile, side-by-side on desktop)
    const renderCurrencyCards = () => (
        <div className="flex flex-col md:flex-row flex-wrap gap-3 items-center justify-center w-full max-w-full px-5">
            {/* XP Card */}
            {(currentReward.value || 0) > 0 && (
                <div style={{
                    backgroundColor: '#0a0f1e',
                    border: '2px solid rgba(59, 130, 246, 0.6)',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center',
                    width: '100%', // Full width on mobile
                    maxWidth: '400px',
                    boxShadow: '0 0 30px rgba(59,130,246,0.4)'
                }} className="flex-1 min-w-[140px]">
                    <div style={{
                        color: '#60a5fa',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        marginBottom: '8px'
                    }}>
                        XP
                    </div>
                    <div style={{
                        color: 'white',
                        fontSize: '32px',
                        fontWeight: 900,
                        fontFamily: 'monospace',
                        textShadow: '0 0 20px rgba(59,130,246,0.5)',
                        wordBreak: 'break-all'
                    }}>
                        +<AnimatedCounter value={currentReward.value} />
                    </div>
                </div>
            )}

            {/* Shards Card (Support both modern .shards and legacy .name parsing) */}
            {(currentReward.shards && currentReward.shards > 0) || (isLegacyCurrency && legacyShardValue > 0) ? (
                <div style={{
                    backgroundColor: '#0a0f1e',
                    border: '2px solid rgba(168, 85, 247, 0.6)',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: '0 0 30px rgba(168,85,247,0.4)'
                }} className="flex-1 min-w-[140px]">
                    <div style={{
                        color: '#a855f7',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        marginBottom: '8px'
                    }}>
                        SHARDS
                    </div>
                    <div style={{
                        color: 'white',
                        fontSize: '32px',
                        fontWeight: 900,
                        fontFamily: 'monospace',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        textShadow: '0 0 20px rgba(168,85,247,0.5)'
                    }}>
                        <Sparkles size={24} color="#a855f7" />
                        +<AnimatedCounter value={currentReward.shards || legacyShardValue} />
                    </div>
                </div>
            ) : null}
        </div>
    );

    // Get rarity color for items
    const getItemRarityColor = (rarity?: string) => {
        const r = rarity?.toLowerCase() || 'common';
        switch (r) {
            case 'uncommon': return { primary: '#22c55e', border: 'rgba(34,197,94,0.6)', bg: 'rgba(34,197,94,0.15)', glow: 'rgba(34,197,94,0.5)' };
            case 'rare': return { primary: '#3b82f6', border: 'rgba(59,130,246,0.6)', bg: 'rgba(59,130,246,0.15)', glow: 'rgba(59,130,246,0.5)' };
            case 'epic': return { primary: '#a855f7', border: 'rgba(168,85,247,0.6)', bg: 'rgba(168,85,247,0.15)', glow: 'rgba(168,85,247,0.5)' };
            case 'legendary': return { primary: '#f59e0b', border: 'rgba(245,158,11,0.6)', bg: 'rgba(245,158,11,0.15)', glow: 'rgba(245,158,11,0.6)' };
            case 'mythic': return { primary: '#ef4444', border: 'rgba(239,68,68,0.6)', bg: 'rgba(239,68,68,0.15)', glow: 'rgba(239,68,68,0.6)' };

            // High Tier & Zones
            case 'godlike': return { primary: '#ffffff', border: 'rgba(255,255,255,0.8)', bg: 'rgba(255,255,255,0.15)', glow: 'rgba(255,255,255,0.8)' };
            case 'celestial': return { primary: '#22d3ee', border: 'rgba(34,211,238,0.6)', bg: 'rgba(34,211,238,0.15)', glow: 'rgba(34,211,238,0.6)' };
            case 'transcendent': return { primary: '#fbbf24', border: 'rgba(251,191,36,0.6)', bg: 'rgba(251,191,36,0.15)', glow: 'rgba(251,191,36,0.6)' };

            case 'magma': return { primary: '#ea580c', border: 'rgba(234,88,12,0.8)', bg: 'rgba(234,88,12,0.2)', glow: 'rgba(234,88,12,0.8)' };
            case 'abyssal': return { primary: '#06b6d4', border: 'rgba(6,182,212,0.8)', bg: 'rgba(6,182,212,0.2)', glow: 'rgba(6,182,212,0.8)' };
            case 'eternal': return { primary: '#10b981', border: 'rgba(16,185,129,0.8)', bg: 'rgba(16,185,129,0.2)', glow: 'rgba(16,185,129,0.8)' };
            case 'void': return { primary: '#9ca3af', border: 'rgba(156,163,175,0.6)', bg: 'rgba(0,0,0,0.8)', glow: 'rgba(255,255,255,0.3)' };

            default: return { primary: '#94a3b8', border: 'rgba(148,163,184,0.6)', bg: 'rgba(148,163,184,0.15)', glow: 'rgba(148,163,184,0.4)' };
        }
    };

    // Render Shadow Extraction Card
    const renderShadowCard = () => {
        const shadowColor = {
            primary: '#a855f7', // Purple-500
            bg: '#3b0764', // Purple-950
            glow: '#7e22ce', // Purple-700
            border: '#6b21a8' // Purple-800
        };

        return (
            <div className="flex flex-col items-center relative z-10 w-full max-w-md">

                {/* Shadow Header Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 relative"
                >
                    <div className="absolute inset-0 blur-2xl opacity-50 bg-purple-600 rounded-full" />
                    <h1 className="relative text-4xl font-black italic uppercase tracking-widest text-center text-purple-200" style={{
                        textShadow: `0 0 40px ${shadowColor.glow}`
                    }}>
                        {(currentReward.name?.includes('Elite') || currentReward.name?.includes('Marshal') || currentReward.name?.includes('Overlord') || currentReward.name?.includes('Monarch'))
                            ? (t('overlay_shadow_evolution', language) || 'SHADOW EVOLUTION')
                            : 'SHADOW EXTRACTION'}
                    </h1>
                </motion.div>

                {/* Main Card */}
                <div style={{
                    position: 'relative',
                    backgroundColor: '#020617', // Slate-950
                    border: `2px solid ${shadowColor.border}`,
                    padding: '40px 32px',
                    borderRadius: '24px',
                    textAlign: 'center',
                    width: '100%',
                    boxShadow: `0 0 60px ${shadowColor.glow}`
                }}>
                    <div className="absolute inset-0 rounded-[22px] overflow-hidden">
                        <div className="absolute inset-0 opacity-30" style={{
                            backgroundImage: `radial-gradient(circle at 50% 0%, ${shadowColor.primary}, transparent 70%)`
                        }} />
                        {/* Smoky Pulse Effect */}
                        <motion.div
                            className="absolute inset-0 bg-purple-900/20"
                            animate={{ opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </div>

                    {/* Icon - Ghost */}
                    <div className="relative mb-8 mx-auto">
                        <motion.div
                            style={{
                                width: '120px', height: '120px', borderRadius: '50%',
                                backgroundColor: shadowColor.bg, border: `3px solid ${shadowColor.primary}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: shadowColor.primary,
                                boxShadow: `0 0 50px ${shadowColor.glow}`,
                                margin: '0 auto',
                                position: 'relative',
                                zIndex: 10
                            }}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Ghost size={64} />
                        </motion.div>
                        {/* Shadow flame effect behind */}
                        <motion.div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-600/40 blur-xl rounded-full -z-10"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>

                    <div style={{ color: shadowColor.primary, fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '16px' }}>
                        {(currentReward.name?.includes('Elite') || currentReward.name?.includes('Marshal') || currentReward.name?.includes('Overlord') || currentReward.name?.includes('Monarch'))
                            ? (t('overlay_rank_up', language) || 'RANK UP')
                            : (t('overlay_new_shadow', language) || 'NEW SOLDIER')}
                    </div>

                    <h2 style={{
                        color: 'white', fontSize: '32px', fontWeight: 900,
                        margin: '0 0 16px 0', textTransform: 'uppercase', lineHeight: 1.1,
                        textShadow: '0 0 20px rgba(168,85,247,0.5)'
                    }}>
                        {currentReward.name.replace('Shadow Extracted: ', '')}
                    </h2>

                    <div style={{
                        display: 'inline-block', padding: '6px 16px', borderRadius: '8px', marginBottom: '24px',
                        backgroundColor: shadowColor.bg, border: `1px solid ${shadowColor.border}`,
                    }}>
                        <span style={{ color: shadowColor.primary, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            {currentReward.rarity || 'MYTHIC'}
                        </span>
                    </div>

                    {/* Stats for Shadow */}
                    {currentReward.stats && currentReward.stats.length > 0 && (
                        <div className="flex justify-center gap-2 mt-4">
                            {currentReward.stats.map((stat, idx) => (
                                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-purple-900/40 rounded-lg border border-purple-500/30">
                                    <span className="text-purple-300 font-bold uppercase text-xs">{stat.stat}</span>
                                    <span className="text-white font-mono font-bold">+{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render item/loot card with armor icon
    const renderItemCard = () => {
        // Intercept Shadow Extracted items
        if (currentReward.name?.includes('Shadow Extracted') || currentReward.type === 'shadow') {
            return renderShadowCard();
        }

        const itemColor = getItemRarityColor(currentReward.rarity);
        return (
            <div style={{
                position: 'relative',
                backgroundColor: '#0a0f1e',
                border: `2px solid ${itemColor.border}`,
                padding: '40px 48px',
                borderRadius: '16px',
                textAlign: 'center',
                minWidth: '320px',
                maxWidth: '400px',
                boxShadow: `0 0 60px ${itemColor.glow}`
            }}>
                {/* Armor/Shield icon in corner */}
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    color: itemColor.primary,
                    opacity: 0.8
                }}>
                    <Shield size={24} />
                </div>

                {/* Icon */}
                <div style={{
                    width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '50%',
                    backgroundColor: itemColor.bg, border: `2px solid ${itemColor.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: itemColor.primary,
                    boxShadow: `0 0 25px ${itemColor.glow}`
                }}>
                    {getIconByName(currentReward.icon, 40) || <Shield size={40} />}
                </div>

                <div style={{ color: itemColor.primary, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '8px' }}>
                    {t('overlay_new_item', language)}
                </div>

                <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 900, margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                    {currentReward.name}
                </h2>

                {/* Rarity badge */}
                {currentReward.rarity && (
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        backgroundColor: itemColor.bg,
                        border: `1px solid ${itemColor.border}`,
                        borderRadius: '6px',
                        marginBottom: '16px'
                    }}>
                        <span style={{ color: itemColor.primary, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            {t(`rarity_${currentReward.rarity.toLowerCase()}` as any, language) || currentReward.rarity}
                        </span>
                    </div>
                )}

                {currentReward.stats && currentReward.stats.length > 0 && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '16px'
                    }}>
                        {currentReward.stats.map((stat, idx) => {
                            const statKey = stat.stat as StatType;
                            const color = statColors[statKey] || defaultColor;
                            const StatIconComponent = statKey === 'Strength' ? Dumbbell :
                                statKey === 'Vitality' ? Activity :
                                    statKey === 'Agility' ? Zap :
                                        statKey === 'Intelligence' ? Brain :
                                            statKey === 'Fortune' ? Crown :
                                                statKey === 'Metabolism' ? Flame : Sparkles;

                            return (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    backgroundColor: color.bg,
                                    border: `1px solid ${color.border}`,
                                    padding: '8px 14px',
                                    borderRadius: '8px'
                                }}>
                                    <StatIconComponent size={16} color={color.primary} />
                                    <span style={{ color: color.primary, fontSize: '12px', fontWeight: 700 }}>
                                        +{stat.value}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Power Score */}
                {currentReward.stats && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        paddingTop: '16px',
                        marginTop: '16px'
                    }}>
                        <Zap size={14} className="text-yellow-400" fill="currentColor" />
                        <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
                            Power: {calculateItemPower({ baseStats: currentReward.stats, rarity: currentReward.rarity || 'common' }).toLocaleString()}
                        </span>
                    </div>
                )}

                <div style={{ marginTop: '12px', color: '#475569', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    {queue.length > 1 ? `${currentRewardIndex + 1} / ${queue.length} · ${t('overlay_tap_continue', language)}` : t('overlay_tap_close', language)}
                </div>
            </div>
        );
    };

    // Render mission complete card
    const renderMissionCard = () => (
        <div style={{
            backgroundColor: '#0a0f1e',
            border: `2px solid ${cardColor.border}`,
            padding: '40px 48px',
            borderRadius: '16px',
            textAlign: 'center',
            minWidth: '320px',
            maxWidth: '400px',
            boxShadow: `0 0 60px ${cardColor.glow}`
        }}>
            {/* Icon */}
            <div style={{
                width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '50%',
                backgroundColor: cardColor.bg, border: `2px solid ${cardColor.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: cardColor.primary,
                boxShadow: `0 0 25px ${cardColor.glow}`
            }}>
                <Target size={40} />
            </div>

            <div style={{ color: cardColor.primary, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '8px' }}>
                {t('overlay_mission_complete', language)}
            </div>

            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 900, margin: '0 0 28px 0', textTransform: 'uppercase' }}>
                {currentReward.name}
            </h2>

            {/* Rewards */}
            <div style={{
                display: 'flex', flexDirection: 'column', gap: '12px',
                opacity: showRewards ? 1 : 0, transform: showRewards ? 'translateY(0)' : 'translateY(15px)',
                transition: 'all 0.3s ease-out'
            }}>
                {/* XP - Always blue */}
                {(currentReward.value || 0) > 0 && (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                        backgroundColor: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)',
                        padding: '16px 28px', borderRadius: '12px'
                    }}>
                        <Sparkles size={22} color="#60a5fa" />
                        <span style={{ color: '#60a5fa', fontSize: '24px', fontWeight: 800, fontFamily: 'monospace' }}>
                            +{currentReward.value} XP
                        </span>
                    </div>
                )}

                {/* Stat - Color matches stat */}
                {currentReward.targetStat && (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                        backgroundColor: cardColor.bg, border: `1px solid ${cardColor.border}`,
                        padding: '16px 28px', borderRadius: '12px', color: cardColor.primary
                    }}>
                        {getStatIcon(currentReward.targetStat, 22)}
                        <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'monospace' }}>
                            {currentReward.targetStat} +1
                        </span>
                    </div>
                )}

                {/* Shards */}
                {(currentReward.shards || 0) > 0 && (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                        backgroundColor: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)',
                        padding: '16px 28px', borderRadius: '12px', color: '#a855f7'
                    }}>
                        <Gem size={22} />
                        <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'monospace' }}>
                            +{currentReward.shards} Shards
                        </span>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '28px', color: '#475569', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                {queue.length > 1 ? `${currentRewardIndex + 1} / ${queue.length} · Tap to continue` : 'Tap to close'}
            </div>
        </div>
    );

    // Render achievement card
    const renderAchievementCard = () => {
        // Use rarity-based colors or default to gold/yellow for achievements
        const r = currentReward.rarity?.toLowerCase() || 'common';
        const colors = rarityColors[r] || rarityColors.common;

        // Override for generic achievements to be Gold if not specified
        const achievementColor = currentReward.rarity ? colors : {
            border: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308', glow: 'rgba(234, 179, 8, 0.5)'
        };

        return (
            <div style={{
                position: 'relative',
                backgroundColor: '#0a0f1e',
                border: `2px solid ${achievementColor.border}`,
                padding: '40px 48px',
                borderRadius: '16px',
                textAlign: 'center',
                minWidth: '320px',
                maxWidth: '400px',
                boxShadow: `0 0 60px ${achievementColor.glow}`
            }}>
                {/* Trophy icon in corner */}
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    color: achievementColor.text,
                    opacity: 0.8
                }}>
                    <Trophy size={24} />
                </div>

                {/* LABEL */}
                <div style={{ color: achievementColor.text, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '8px' }}>
                    {t('overlay_achievement_unlocked', language)}
                </div>

                <div style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    backgroundColor: achievementColor.bg,
                    border: `1px solid ${achievementColor.border}`,
                    borderRadius: '6px',
                    marginBottom: '20px'
                }}>
                    <span style={{ color: achievementColor.text, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                        {t(`rarity_${currentReward.rarity?.toLowerCase()}` as any, language) || currentReward.rarity || 'Achieved'}
                    </span>
                </div>

                <div style={{
                    width: '100px', height: '100px', margin: '0 auto 24px', borderRadius: '50%',
                    backgroundColor: achievementColor.bg, border: `3px solid ${achievementColor.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: achievementColor.text,
                    boxShadow: `0 0 30px ${achievementColor.glow}`
                }}>
                    {/* Main Icon - Default to Trophy if not provided */}
                    {currentReward.icon && currentReward.icon !== 'Trophy' ? (
                        getIconByName(currentReward.icon, 48) || <Trophy size={48} />
                    ) : (
                        <Trophy size={48} />
                    )}
                </div>

                <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 900, margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                    {currentReward.name}
                </h2>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 24px 0' }}>{currentReward.description}</p>
                <div style={{ color: '#475569', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('overlay_tap_continue', language)}</div>
            </div>
        );
    };

    return (
        <>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>

            <div
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.94)', backdropFilter: 'blur(6px)',
                    zIndex: 9999, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    animation: 'fadeIn 0.25s ease-out'
                }}
                onClick={handleNext}
            >
                <button
                    onClick={(e) => { e.stopPropagation(); handleClose(); }}
                    style={{
                        position: 'absolute',
                        top: 'calc(24px + env(safe-area-inset-top))',
                        right: '24px',
                        padding: '10px',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        color: 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        zIndex: 10000,
                        transition: 'all 0.2s ease'
                    }}
                >
                    <X size={20} />
                </button>

                <AnimatePresence mode="wait">
                    {currentReward && showCard && (
                        <motion.div
                            key={currentRewardIndex}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -50, scale: 0.9 }}
                            transition={{
                                type: "spring",
                                damping: 20,
                                stiffness: 300,
                                mass: 0.8
                            }}
                        >
                            {(currentReward.type === 'title' || isLegacyTitle) ? renderTitleCard() :
                                currentReward.type === 'frame' && frameData ? renderFrameCard() :
                                    currentReward.type === 'levelup' ? renderLevelUpCard() :
                                        currentReward.type === 'currency' || isLegacyCurrency ? renderCurrencyCards() :
                                            currentReward.type === 'item' ? renderItemCard() :
                                                currentReward.type === 'achievement' ? renderAchievementCard() :
                                                    renderMissionCard()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};
