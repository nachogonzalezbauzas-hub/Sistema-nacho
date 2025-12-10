import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Crown, Sparkles, Package, User, Frame } from 'lucide-react';
import { useStore } from '../../store';
import { t, Language } from '../../data/translations';
import { Equipment, ItemRarity, TitleId, AvatarFrameId } from '../../types';
import { ChestOpenAnimation } from './ChestOpenAnimation';

interface QuestShopProps {
    language: Language;
    onNavigateToInventory?: () => void;
}

// 20 Shop-exclusive titles ordered from CHEAPEST to MOST EXPENSIVE
const SHOP_TITLES: { id: TitleId; cost: number; rarity: ItemRarity; name: string; description: string; animation: string }[] = [
    // COMMON (50-100 QP) - No effects
    { id: 'shop_apprentice', cost: 50, rarity: 'common', name: 'Apprentice', description: 'Every master was once a student.', animation: 'text-slate-500' },
    // UNCOMMON (150-300 QP) - Basic colors
    { id: 'shop_swift_shadow', cost: 150, rarity: 'uncommon', name: 'Swift Shadow', description: 'Fast as darkness.', animation: 'text-gray-400' },
    { id: 'shop_iron_guardian', cost: 200, rarity: 'uncommon', name: 'Iron Guardian', description: 'Stalwart defender.', animation: 'text-slate-400' },
    { id: 'shop_blade_dancer', cost: 300, rarity: 'uncommon', name: 'Blade Dancer', description: 'Grace with a sword.', animation: 'text-green-400' },
    // RARE (400-800 QP) - Subtle glow
    { id: 'shop_night_walker', cost: 400, rarity: 'rare', name: 'Night Walker', description: 'Moves unseen in darkness.', animation: 'text-slate-300' },
    { id: 'shop_elite_hunter', cost: 500, rarity: 'rare', name: 'Elite Hunter', description: 'Top of the hunting class.', animation: 'text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.3)]' },
    { id: 'shop_arcane_master', cost: 600, rarity: 'rare', name: 'Arcane Master', description: 'Wielder of ancient magic.', animation: 'text-indigo-400 drop-shadow-[0_0_4px_rgba(129,140,248,0.4)]' },
    { id: 'shop_demon_king', cost: 700, rarity: 'rare', name: 'Demon King', description: 'Ruler of the underworld.', animation: 'text-red-400 drop-shadow-[0_0_4px_rgba(248,113,113,0.4)]' },
    { id: 'shop_thunder_god', cost: 800, rarity: 'rare', name: 'Thunder God', description: 'Commands the storms.', animation: 'text-yellow-300 drop-shadow-[0_0_5px_rgba(253,224,71,0.4)]' },
    // EPIC (1000-2000 QP) - Medium glow
    { id: 'shop_soul_reaper', cost: 1000, rarity: 'epic', name: 'Soul Reaper', description: 'Harvester of spirits.', animation: 'text-violet-400 drop-shadow-[0_0_6px_rgba(167,139,250,0.5)]' },
    { id: 'shop_blood_lord', cost: 1200, rarity: 'epic', name: 'Blood Lord', description: 'Master of crimson arts.', animation: 'text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]' },
    { id: 'shop_frost_emperor', cost: 1500, rarity: 'epic', name: 'Frost Emperor', description: 'Winter personified.', animation: 'text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.5)]' },
    { id: 'shop_storm_bringer', cost: 1800, rarity: 'epic', name: 'Storm Bringer', description: 'Wields lightning itself.', animation: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]' },
    { id: 'shop_phoenix_risen', cost: 2000, rarity: 'epic', name: 'Phoenix Risen', description: 'Reborn from ashes.', animation: 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]' },
    // LEGENDARY (2000-5000 QP) - Strong glow effects
    { id: 'shop_shadow_king', cost: 3000, rarity: 'legendary', name: 'Shadow King', description: 'Commands the darkness.', animation: 'text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.7)] animate-pulse' },
    { id: 'shop_eternal_warrior', cost: 3500, rarity: 'legendary', name: 'Eternal Warrior', description: 'Battles since time began.', animation: 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-pulse' },
    { id: 'shop_dragon_lord', cost: 4000, rarity: 'legendary', name: 'Dragon Lord', description: 'Master of ancient beasts.', animation: 'text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.7)] animate-pulse' },
    { id: 'shop_titan_slayer', cost: 5000, rarity: 'legendary', name: 'Titan Slayer', description: 'Felled giants of legend.', animation: 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] animate-pulse' },
    // MYTHIC (8000+ QP) - Rainbow animations
    { id: 'shop_celestial_being', cost: 8000, rarity: 'mythic', name: 'Celestial Being', description: 'Transcended mortal limits.', animation: 'animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]' },
    { id: 'shop_void_emperor', cost: 10000, rarity: 'mythic', name: 'Void Emperor', description: 'Ruler of the endless void.', animation: 'animate-rainbow-text' },
];

// 20 Shop-exclusive frames ordered from CHEAPEST to MOST EXPENSIVE
const SHOP_FRAMES: { id: AvatarFrameId; cost: number; rarity: string; name: string; borderStyle: string; glowStyle: string; animation: string }[] = [
    // C (50-200 QP) - Basic border
    { id: 'shop_basic_glow', cost: 50, rarity: 'C', name: 'Basic Glow', borderStyle: 'border border-slate-800', glowStyle: '', animation: '' },
    { id: 'shop_swift_wind', cost: 100, rarity: 'C', name: 'Swift Wind', borderStyle: 'border border-slate-700', glowStyle: '', animation: '' },
    { id: 'shop_iron_shield', cost: 200, rarity: 'C', name: 'Iron Shield', borderStyle: 'border border-slate-600', glowStyle: '', animation: '' },
    // B (300-600 QP) - Subtle glow
    { id: 'shop_blade_edge', cost: 300, rarity: 'B', name: 'Blade Edge', borderStyle: 'border border-slate-500', glowStyle: '', animation: '' },
    { id: 'shop_night_mist', cost: 400, rarity: 'B', name: 'Night Mist', borderStyle: 'border-2 border-slate-400', glowStyle: 'shadow-[0_0_6px_rgba(148,163,184,0.3)]', animation: '' },
    { id: 'shop_elite_badge', cost: 500, rarity: 'B', name: 'Elite Badge', borderStyle: 'border-2 border-emerald-500', glowStyle: 'shadow-[0_0_8px_rgba(16,185,129,0.3)]', animation: '' },
    { id: 'shop_arcane_runes', cost: 600, rarity: 'B', name: 'Arcane Runes', borderStyle: 'border-2 border-indigo-500', glowStyle: 'shadow-[0_0_8px_rgba(99,102,241,0.3)]', animation: '' },
    // A (800-1500 QP) - Static strong glow
    { id: 'shop_demon_horns', cost: 800, rarity: 'A', name: 'Demon Horns', borderStyle: 'border-2 border-rose-500', glowStyle: 'shadow-[0_0_10px_rgba(244,63,94,0.3)]', animation: '' },
    { id: 'shop_storm_cyclone', cost: 1000, rarity: 'A', name: 'Storm Cyclone', borderStyle: 'border-2 border-cyan-500', glowStyle: 'shadow-[0_0_12px_rgba(6,182,212,0.4)]', animation: '' },
    { id: 'shop_soul_chains', cost: 1200, rarity: 'A', name: 'Soul Chains', borderStyle: 'border-2 border-violet-500', glowStyle: 'shadow-[0_0_12px_rgba(139,92,246,0.4)]', animation: '' },
    { id: 'shop_blood_moon', cost: 1500, rarity: 'A', name: 'Blood Moon', borderStyle: 'border-2 border-red-500', glowStyle: 'shadow-[0_0_15px_rgba(239,68,68,0.4)]', animation: '' },
    // S (2000-3500 QP) - Medium animated glow
    { id: 'shop_frost_crystal', cost: 2000, rarity: 'S', name: 'Frost Crystal', borderStyle: 'border-2 border-blue-300', glowStyle: 'shadow-[0_0_15px_rgba(147,197,253,0.5)]', animation: '' },
    { id: 'shop_thunder_strike', cost: 2500, rarity: 'S', name: 'Thunder Strike', borderStyle: 'border-2 border-yellow-400', glowStyle: 'shadow-[0_0_18px_rgba(250,204,21,0.5)]', animation: '' },
    { id: 'shop_phoenix_flames', cost: 3000, rarity: 'S', name: 'Phoenix Flames', borderStyle: 'border-2 border-orange-400', glowStyle: 'shadow-[0_0_18px_rgba(251,146,60,0.5)]', animation: 'animate-pulse' },
    { id: 'shop_shadow_vortex', cost: 3500, rarity: 'S', name: 'Shadow Vortex', borderStyle: 'border-2 border-purple-600', glowStyle: 'shadow-[0_0_20px_rgba(147,51,234,0.6)]', animation: 'animate-pulse' },
    // SS (4000-6000 QP) - Strong animated glow
    { id: 'shop_aurora_borealis', cost: 4500, rarity: 'SS', name: 'Aurora Borealis', borderStyle: 'border-[3px] border-cyan-400', glowStyle: 'shadow-[0_0_20px_rgba(34,211,238,0.6),0_0_40px_rgba(6,182,212,0.3)]', animation: 'animate-pulse' },
    { id: 'shop_infernal_blaze', cost: 5000, rarity: 'SS', name: 'Infernal Blaze', borderStyle: 'border-[3px] border-red-500', glowStyle: 'shadow-[0_0_25px_rgba(239,68,68,0.7),0_0_45px_rgba(220,38,38,0.3)]', animation: 'animate-pulse' },
    { id: 'shop_dragon_aura', cost: 6000, rarity: 'SS', name: 'Dragon Aura', borderStyle: 'border-[3px] border-orange-500', glowStyle: 'shadow-[0_0_25px_rgba(249,115,22,0.7),0_0_50px_rgba(234,88,12,0.3)]', animation: 'animate-pulse' },
    // SSS (8000+ QP) - Intense multi-color animated
    { id: 'shop_divine_light', cost: 10000, rarity: 'SSS', name: 'Divine Light', borderStyle: 'border-[3px] border-yellow-300', glowStyle: 'shadow-[0_0_30px_rgba(253,224,71,0.8),0_0_60px_rgba(250,204,21,0.4)]', animation: 'animate-pulse' },
    { id: 'shop_cosmic_void', cost: 12000, rarity: 'SSS', name: 'Cosmic Void', borderStyle: 'border-[3px]', glowStyle: 'shadow-[0_0_30px_rgba(168,85,247,0.8),0_0_60px_rgba(147,51,234,0.4)]', animation: 'animate-rainbow-border' },
];

const rarityColors: Record<string, { text: string; border: string; bg: string; glow: string }> = {
    common: { text: 'text-slate-400', border: 'border-slate-600', bg: 'bg-slate-900/50', glow: '' },
    uncommon: { text: 'text-green-400', border: 'border-green-600/50', bg: 'bg-green-900/20', glow: '' },
    rare: { text: 'text-blue-400', border: 'border-blue-600/50', bg: 'bg-blue-900/20', glow: 'shadow-[0_0_10px_rgba(59,130,246,0.2)]' },
    epic: { text: 'text-purple-400', border: 'border-purple-600/50', bg: 'bg-purple-900/20', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]' },
    legendary: { text: 'text-yellow-400', border: 'border-yellow-600/50', bg: 'bg-yellow-900/20', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
    mythic: { text: 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500', border: 'border-pink-500/50', bg: 'bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-blue-900/20', glow: 'shadow-[0_0_25px_rgba(236,72,153,0.4)]' },
    C: { text: 'text-slate-400', border: 'border-slate-600', bg: 'bg-slate-900/50', glow: '' },
    B: { text: 'text-green-400', border: 'border-green-600/50', bg: 'bg-green-900/20', glow: '' },
    A: { text: 'text-blue-400', border: 'border-blue-600/50', bg: 'bg-blue-900/20', glow: 'shadow-[0_0_10px_rgba(59,130,246,0.2)]' },
    S: { text: 'text-purple-400', border: 'border-purple-600/50', bg: 'bg-purple-900/20', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]' },
    SS: { text: 'text-yellow-400', border: 'border-yellow-600/50', bg: 'bg-yellow-900/20', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
    SSS: { text: 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500', border: 'border-pink-500/50', bg: 'bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-blue-900/20', glow: 'shadow-[0_0_25px_rgba(236,72,153,0.4)]' },
};

// Rainbow text animation CSS (add to your global styles)
const rainbowStyles = `
@keyframes rainbow-text {
  0%, 100% { color: #ef4444; text-shadow: 0 0 20px #ef4444; }
  16% { color: #f97316; text-shadow: 0 0 20px #f97316; }
  33% { color: #eab308; text-shadow: 0 0 20px #eab308; }
  50% { color: #22c55e; text-shadow: 0 0 20px #22c55e; }
  66% { color: #3b82f6; text-shadow: 0 0 20px #3b82f6; }
  83% { color: #a855f7; text-shadow: 0 0 20px #a855f7; }
}
@keyframes rainbow-border {
  0%, 100% { border-color: #ef4444; box-shadow: 0 0 30px #ef4444; }
  16% { border-color: #f97316; box-shadow: 0 0 30px #f97316; }
  33% { border-color: #eab308; box-shadow: 0 0 30px #eab308; }
  50% { border-color: #22c55e; box-shadow: 0 0 30px #22c55e; }
  66% { border-color: #3b82f6; box-shadow: 0 0 30px #3b82f6; }
  83% { border-color: #a855f7; box-shadow: 0 0 30px #a855f7; }
}
.animate-rainbow-text { animation: rainbow-text 3s linear infinite; }
.animate-rainbow-border { animation: rainbow-border 3s linear infinite; }
`;

export const QuestShop: React.FC<QuestShopProps> = ({ language = 'en' as Language, onNavigateToInventory }) => {
    const { state, purchaseQuestShopItem, purchaseEquipment } = useStore();
    const { questPoints, shards } = state;
    const unlockedTitles = state.stats?.unlockedTitleIds || [];
    const unlockedFrames = state.stats?.unlockedFrameIds || [];

    const [activeTab, setActiveTab] = useState<'Cosmetics' | 'Equipment'>('Cosmetics');
    const [cosmeticSubTab, setCosmeticSubTab] = useState<'Titles' | 'Frames'>('Titles');

    // Chest animation state
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentChestRarity, setCurrentChestRarity] = useState<ItemRarity>('common');
    const [currentChestCost, setCurrentChestCost] = useState(10);
    const [receivedItem, setReceivedItem] = useState<Equipment | null>(null);

    const handleBuyTitle = (titleId: TitleId, cost: number) => {
        if (questPoints < cost || unlockedTitles.includes(titleId)) return;
        purchaseQuestShopItem({ id: `title_${titleId}`, name: 'Title', description: '', cost, type: 'cosmetic', reward: { titleId } });
    };

    const handleBuyFrame = (frameId: AvatarFrameId, cost: number) => {
        if (questPoints < cost || unlockedFrames.includes(frameId)) return;
        purchaseQuestShopItem({ id: `frame_${frameId}`, name: 'Frame', description: '', cost, type: 'cosmetic', reward: { frameId } });
    };

    const handleBuyChest = (cost: number, rarity: ItemRarity) => {
        if (shards < cost) return;
        setCurrentChestRarity(rarity);
        setCurrentChestCost(cost);
        setIsAnimating(true);
        purchaseEquipment(cost, rarity, (item) => {
            setReceivedItem(item);
        });
    };

    const handleCloseAnimation = () => {
        setIsAnimating(false);
        setReceivedItem(null);
    };

    const handleOpenAnother = () => {
        setReceivedItem(null);
        setIsAnimating(false);
        setTimeout(() => {
            handleBuyChest(currentChestCost, currentChestRarity);
        }, 100);
    };

    const handleGoToInventory = () => {
        setIsAnimating(false);
        setReceivedItem(null);
        if (onNavigateToInventory) onNavigateToInventory();
    };

    const canAffordAnother = shards >= currentChestCost;

    const formatPrice = (price: number) => price >= 1000 ? `${(price / 1000).toFixed(1)}K` : price.toString();

    return (
        <>
            {/* Inject rainbow animation styles */}
            <style>{rainbowStyles}</style>

            <ChestOpenAnimation
                isOpen={isAnimating}
                onClose={handleCloseAnimation}
                onOpenAnother={handleOpenAnother}
                onGoToInventory={handleGoToInventory}
                chestRarity={currentChestRarity}
                reward={receivedItem}
                canAffordAnother={canAffordAnother}
            />

            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider">
                        <ShoppingBag size={16} />
                        <span>{t('shop_title', language)}</span>
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setActiveTab('Cosmetics')}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2
                            ${activeTab === 'Cosmetics'
                                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Crown size={14} />
                        Cosmetics
                    </button>
                    <button
                        onClick={() => setActiveTab('Equipment')}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2
                            ${activeTab === 'Equipment'
                                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                                : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Package size={14} />
                        Equipment
                    </button>
                </div>

                {/* COSMETICS TAB */}
                {activeTab === 'Cosmetics' && (
                    <div className="space-y-4">
                        {/* Sub-tabs */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCosmeticSubTab('Titles')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${cosmeticSubTab === 'Titles'
                                        ? 'bg-yellow-600/80 text-white'
                                        : 'bg-slate-800 text-slate-500'
                                    }`}
                            >
                                <Crown size={14} /> Titles ({SHOP_TITLES.length})
                            </button>
                            <button
                                onClick={() => setCosmeticSubTab('Frames')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${cosmeticSubTab === 'Frames'
                                        ? 'bg-yellow-600/80 text-white'
                                        : 'bg-slate-800 text-slate-500'
                                    }`}
                            >
                                <Frame size={14} /> Frames ({SHOP_FRAMES.length})
                            </button>
                        </div>

                        {/* Titles */}
                        {cosmeticSubTab === 'Titles' && (
                            <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                                {SHOP_TITLES.map(shopTitle => {
                                    const isOwned = unlockedTitles.includes(shopTitle.id);
                                    const canAfford = questPoints >= shopTitle.cost;
                                    const style = rarityColors[shopTitle.rarity] || rarityColors.common;

                                    return (
                                        <motion.div
                                            key={shopTitle.id}
                                            whileHover={!isOwned && canAfford ? { scale: 1.01 } : {}}
                                            className={`p-4 rounded-xl border transition-all ${style.border} ${style.bg} ${style.glow} ${isOwned ? 'opacity-50' : ''
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <h4 className={`font-bold text-sm ${shopTitle.animation}`}>{shopTitle.name}</h4>
                                                        <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold ${style.bg} ${style.text} border ${style.border}`}>
                                                            {shopTitle.rarity}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 truncate">{shopTitle.description}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleBuyTitle(shopTitle.id, shopTitle.cost)}
                                                    disabled={isOwned || !canAfford}
                                                    className={`ml-3 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${isOwned
                                                            ? 'bg-green-900/50 text-green-400 cursor-default'
                                                            : canAfford
                                                                ? 'bg-yellow-600 text-white hover:bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                                                                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {isOwned ? '✓' : `${formatPrice(shopTitle.cost)} QP`}
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Frames */}
                        {cosmeticSubTab === 'Frames' && (
                            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                                {SHOP_FRAMES.map(shopFrame => {
                                    const isOwned = unlockedFrames.includes(shopFrame.id);
                                    const canAfford = questPoints >= shopFrame.cost;
                                    const style = rarityColors[shopFrame.rarity] || rarityColors.C;

                                    return (
                                        <motion.div
                                            key={shopFrame.id}
                                            whileHover={!isOwned && canAfford ? { scale: 1.02 } : {}}
                                            className={`p-3 rounded-xl border transition-all ${style.border} ${style.bg} ${style.glow} ${isOwned ? 'opacity-50' : ''
                                                }`}
                                        >
                                            <div className="flex flex-col items-center text-center">
                                                <div className={`w-14 h-14 rounded-full mb-2 flex items-center justify-center bg-slate-900 ${shopFrame.borderStyle} ${shopFrame.glowStyle} ${shopFrame.animation}`}>
                                                    <User size={20} className={style.text} />
                                                </div>
                                                <h4 className={`font-bold text-xs ${style.text}`}>{shopFrame.name}</h4>
                                                <span className={`text-[9px] uppercase font-bold mb-2 ${style.text}`}>
                                                    {shopFrame.rarity}
                                                </span>
                                                <button
                                                    onClick={() => handleBuyFrame(shopFrame.id, shopFrame.cost)}
                                                    disabled={isOwned || !canAfford}
                                                    className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${isOwned
                                                            ? 'bg-green-900/50 text-green-400 cursor-default'
                                                            : canAfford
                                                                ? 'bg-yellow-600 text-white hover:bg-yellow-500'
                                                                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {isOwned ? '✓' : `${formatPrice(shopFrame.cost)} QP`}
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* EQUIPMENT TAB */}
                {activeTab === 'Equipment' && (
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { name: 'Common Chest', cost: 10, rarity: 'common' as ItemRarity, color: 'text-slate-400', border: 'border-slate-700', glow: '' },
                            { name: 'Uncommon Chest', cost: 25, rarity: 'uncommon' as ItemRarity, color: 'text-green-400', border: 'border-green-900', glow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]' },
                            { name: 'Rare Chest', cost: 50, rarity: 'rare' as ItemRarity, color: 'text-blue-400', border: 'border-blue-900', glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]' },
                            { name: 'Epic Chest', cost: 100, rarity: 'epic' as ItemRarity, color: 'text-purple-400', border: 'border-purple-900', glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]' },
                            { name: 'Legendary Chest', cost: 250, rarity: 'legendary' as ItemRarity, color: 'text-yellow-400', border: 'border-yellow-900', glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
                        ].map((chest) => (
                            <motion.div
                                key={chest.name}
                                className={`bg-[#050a14] border ${chest.border} p-4 rounded-xl flex items-center justify-between transition-all duration-300 ${chest.glow}`}
                                whileHover={{ scale: shards >= chest.cost ? 1.01 : 1 }}
                                whileTap={{ scale: shards >= chest.cost ? 0.98 : 1 }}
                            >
                                <div className="flex items-center gap-4">
                                    <motion.div
                                        className={`w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center ${chest.color}`}
                                        whileHover={{ rotate: [0, -5, 5, 0] }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Package size={24} />
                                    </motion.div>
                                    <div>
                                        <h4 className={`font-bold ${chest.color}`}>{chest.name}</h4>
                                        <p className="text-xs text-slate-500">Guaranteed {chest.rarity}+ gear</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleBuyChest(chest.cost, chest.rarity)}
                                    disabled={shards < chest.cost}
                                    className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2
                                        ${shards >= chest.cost
                                            ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    <Sparkles size={14} />
                                    {chest.cost}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
