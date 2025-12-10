import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Crown, Sparkles, Package, User, Frame } from 'lucide-react';
import { useStore } from '@/store';
import { t, Language } from '@/data/translations';
import { Equipment, ItemRarity, TitleId, AvatarFrameId } from '@/types';
import { ChestOpenAnimation } from './ChestOpenAnimation';
import { SHOP_TITLES, SHOP_FRAMES } from '@/data/shopCosmetics';
import { Button, Card } from '@/components';

interface QuestShopProps {
    language: Language;
    onNavigateToInventory?: () => void;
}

const rarityColors: Record<string, { text: string; border: string; bg: string; glow: string }> = {
    common: { text: 'text-slate-400', border: 'border-slate-600', bg: 'bg-slate-900/50', glow: '' },
    uncommon: { text: 'text-green-400', border: 'border-green-600/50', bg: 'bg-green-900/20', glow: 'shadow-[0_0_5px_rgba(34,197,94,0.1)]' },
    rare: { text: 'text-blue-400', border: 'border-blue-600/50', bg: 'bg-blue-900/20', glow: 'shadow-[0_0_10px_rgba(59,130,246,0.2)]' },
    epic: { text: 'text-purple-400', border: 'border-purple-600/50', bg: 'bg-purple-900/20', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]' },
    legendary: { text: 'text-yellow-400', border: 'border-yellow-600/50', bg: 'bg-yellow-900/20', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
    mythic: { text: 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500', border: 'border-pink-500/50', bg: 'bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-blue-900/20', glow: 'shadow-[0_0_25px_rgba(236,72,153,0.4)]' },
    C: { text: 'text-slate-400', border: 'border-slate-600', bg: 'bg-slate-900/50', glow: '' },
    B: { text: 'text-green-400', border: 'border-green-600/50', bg: 'bg-green-900/20', glow: 'shadow-[0_0_5px_rgba(34,197,94,0.1)]' },
    A: { text: 'text-blue-400', border: 'border-blue-600/50', bg: 'bg-blue-900/20', glow: 'shadow-[0_0_10px_rgba(59,130,246,0.2)]' },
    S: { text: 'text-purple-400', border: 'border-purple-600/50', bg: 'bg-purple-900/20', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]' },
    SS: { text: 'text-yellow-400', border: 'border-yellow-600/50', bg: 'bg-yellow-900/20', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
    SSS: { text: 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500', border: 'border-pink-500/50', bg: 'bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-blue-900/20', glow: 'shadow-[0_0_25px_rgba(236,72,153,0.4)]' },
};

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
                    <Button
                        variant={activeTab === 'Cosmetics' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('Cosmetics')}
                        className="flex-1"
                        aria-label="Show Cosmetics Shop"
                    >
                        <Crown size={14} />
                        Cosmetics
                    </Button>
                    <Button
                        variant={activeTab === 'Equipment' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('Equipment')}
                        className="flex-1"
                        aria-label="Show Equipment Shop"
                    >
                        <Package size={14} />
                        Equipment
                    </Button>
                </div>

                {/* COSMETICS TAB */}
                {activeTab === 'Cosmetics' && (
                    <div className="space-y-4">
                        {/* Sub-tabs */}
                        <div className="flex gap-2">
                            <Button
                                variant={cosmeticSubTab === 'Titles' ? 'primary' : 'ghost'}
                                onClick={() => setCosmeticSubTab('Titles')}
                                className="flex-1 py-2 text-xs"
                                aria-label="Show Titles"
                            >
                                <Crown size={14} /> Titles ({SHOP_TITLES.length})
                            </Button>
                            <Button
                                variant={cosmeticSubTab === 'Frames' ? 'primary' : 'ghost'}
                                onClick={() => setCosmeticSubTab('Frames')}
                                className="flex-1 py-2 text-xs"
                                aria-label="Show Frames"
                            >
                                <Frame size={14} /> Frames ({SHOP_FRAMES.length})
                            </Button>
                        </div>

                        {/* Titles */}
                        {cosmeticSubTab === 'Titles' && (
                            <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                                {SHOP_TITLES.map(shopTitle => {
                                    const isOwned = unlockedTitles.includes(shopTitle.id);
                                    const cost = shopTitle.cost || 999999;
                                    const canAfford = questPoints >= cost;
                                    const style = rarityColors[shopTitle.rarity] || rarityColors.common;

                                    return (
                                        <Card
                                            key={shopTitle.id}
                                            className={`p-4 transition-all ${style.border} ${style.bg} ${style.glow} ${isOwned ? 'opacity-50' : ''}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <div className={style.text}>{shopTitle.icon}</div>
                                                        <h4 className={`font-bold text-sm ${shopTitle.textStyle} ${shopTitle.glowStyle}`}>{shopTitle.name}</h4>
                                                        <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold ${style.bg} ${style.text} border ${style.border}`}>
                                                            {shopTitle.rarity}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 truncate">{shopTitle.description}</p>
                                                </div>
                                                <Button
                                                    onClick={() => handleBuyTitle(shopTitle.id, cost)}
                                                    disabled={isOwned || !canAfford}
                                                    variant={isOwned ? 'ghost' : canAfford ? 'primary' : 'secondary'}
                                                    className={`ml-3 px-3 py-1.5 text-[10px] whitespace-nowrap ${isOwned ? 'cursor-default' : ''}`}
                                                    aria-label={`Buy Title ${shopTitle.name}`}
                                                >
                                                    {isOwned ? '✓' : `${formatPrice(cost)} QP`}
                                                </Button>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}

                        {/* Frames */}
                        {cosmeticSubTab === 'Frames' && (
                            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                                {SHOP_FRAMES.map(shopFrame => {
                                    const isOwned = unlockedFrames.includes(shopFrame.id);
                                    const cost = shopFrame.cost || 999999;
                                    const canAfford = questPoints >= cost;
                                    const style = rarityColors[shopFrame.rarity] || rarityColors.C;

                                    return (
                                        <Card
                                            key={shopFrame.id}
                                            className={`p-3 transition-all ${style.border} ${style.bg} ${style.glow} ${isOwned ? 'opacity-50' : ''}`}
                                        >
                                            <div className="flex flex-col items-center text-center">
                                                <div className={`w-14 h-14 rounded-full mb-2 flex items-center justify-center bg-slate-900 ${shopFrame.borderStyle} ${shopFrame.glowStyle} ${shopFrame.animation}`}>
                                                    <User size={20} className={style.text} />
                                                </div>
                                                <h4 className={`font-bold text-xs ${style.text}`}>{shopFrame.name}</h4>
                                                <span className={`text-[9px] uppercase font-bold mb-2 ${style.text}`}>
                                                    {shopFrame.rarity}
                                                </span>
                                                <Button
                                                    onClick={() => handleBuyFrame(shopFrame.id, cost)}
                                                    disabled={isOwned || !canAfford}
                                                    variant={isOwned ? 'ghost' : canAfford ? 'primary' : 'secondary'}
                                                    className={`w-full py-1.5 text-[10px] ${isOwned ? 'cursor-default' : ''}`}
                                                    aria-label={`Buy Frame ${shopFrame.name}`}
                                                >
                                                    {isOwned ? '✓' : `${formatPrice(cost)} QP`}
                                                </Button>
                                            </div>
                                        </Card>
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
                            <Card
                                key={chest.name}
                                className={`bg-[#050a14] border ${chest.border} p-4 flex items-center justify-between transition-all duration-300 ${chest.glow}`}
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
                                <Button
                                    onClick={() => handleBuyChest(chest.cost, chest.rarity)}
                                    disabled={shards < chest.cost}
                                    variant={shards >= chest.cost ? 'primary' : 'secondary'}
                                    className="px-4 py-2 text-xs"
                                    aria-label={`Buy ${chest.name}`}
                                >
                                    <Sparkles size={14} />
                                    {chest.cost}
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

