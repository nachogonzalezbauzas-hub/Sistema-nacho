import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, Equipment, EquipmentType, ItemRarity } from '@/types';
import { EquipmentSlot, ItemCard, SetBonusDisplay } from '@/components/equipment/UIComponents';
import { UpgradeModal, UPGRADE_ANIMATION_DURATION } from '@/components/equipment/UpgradeModal';
import { EQUIPMENT_SETS } from '@/data/equipmentSets';
import { RARITY_ORDER, RARITY_UNLOCK_FLOORS, getMaxLevel } from '@/data/equipmentConstants';

import { Shield, Sword, Package, Hammer, Sparkles, Trash2, Filter } from 'lucide-react';
import { t, Language } from '@/data/translations';
import { StatIcon } from '@/components';

interface GearViewProps {
    state: AppState;
    onEquip: (id: string) => void;
    onUnequip: (id: string) => void;
    onUnequipAll: () => void;
    onUpgrade: (id: string, levels?: number, onSuccess?: () => void, onFailure?: () => void) => void;
    onSalvage: (id: string) => void;
    onBulkSalvage?: (minRarityToKeep: string) => void;
    onAddEquipment: (item: Equipment) => void;
    language?: Language;
}

export const GearView: React.FC<GearViewProps> = ({ state, onEquip, onUnequip, onUnequipAll, onUpgrade, onSalvage, onBulkSalvage, onAddEquipment, language = 'en' as Language }) => {
    const [activeTab, setActiveTab] = useState<'Equipment' | 'Inventory'>('Equipment');
    const [selectedSlot, setSelectedSlot] = useState<EquipmentType | null>(null);
    const [upgradeModalItem, setUpgradeModalItem] = useState<Equipment | null>(null);
    const [upgradeLevels, setUpgradeLevels] = useState(1);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [upgradeResult, setUpgradeResult] = useState<'success' | 'failure' | null>(null);
    const [salvageFilter, setSalvageFilter] = useState<string>('rare');
    const [showSalvageConfirm, setShowSalvageConfirm] = useState(false);

    const equippedItems = state.inventory.filter(i => i.isEquipped);
    const inventoryItems = state.inventory.filter(i => !i.isEquipped);

    // Calculate max reached floor for gating
    const maxReachedFloor = (state.dungeonRuns || [])
        .filter(r => r.victory)
        .reduce((max, r) => {
            const floor = parseInt(r.dungeonId.split('_')[1] || '0');
            return Math.max(max, floor);
        }, 0);

    const getEquippedItem = (type: EquipmentType) => equippedItems.find(i => i.type === type);

    const handleUpgradeClick = (id: string) => {
        const item = state.inventory.find(i => i.id === id);
        if (item) {
            setUpgradeModalItem(item);
            setUpgradeLevels(1);
        }
    };

    const handleUpgradeConfirm = (id: string, levels: number) => {
        setIsUpgrading(true);
        setUpgradeResult(null);

        // Simulate animation delay
        setTimeout(() => {
            onUpgrade(id, levels,
                () => { // Success Callback
                    setUpgradeResult('success');
                    setIsUpgrading(false);
                },
                () => { // Failure Callback
                    setUpgradeResult('failure');
                    setIsUpgrading(false);
                }
            );
        }, UPGRADE_ANIMATION_DURATION + 100); // Wait for animation + buffer
    };



    return (
        <div className="h-full flex flex-col pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 drop-shadow-lg">
                    {t('gear_title', language)}
                </h2>
            </div>

            {/* Tabs */}
            <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-md relative z-10 mb-6">
                <button
                    onClick={() => setActiveTab('Equipment')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 relative overflow-hidden group ${activeTab === 'Equipment' ? 'text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                >
                    {activeTab === 'Equipment' && (
                        <div className="absolute inset-0 bg-blue-600 rounded-xl z-[-1]"></div>
                    )}
                    <span className="relative z-10">{t('gear_tab_equipment', language)}</span>
                </button>
                <button
                    onClick={() => setActiveTab('Inventory')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 relative overflow-hidden group ${activeTab === 'Inventory' ? 'text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                >
                    {activeTab === 'Inventory' && (
                        <div className="absolute inset-0 bg-blue-600 rounded-xl z-[-1]"></div>
                    )}
                    <span className="relative z-10">{t('gear_tab_inventory', language)} ({inventoryItems.length})</span>
                </button>
            </div>

            {activeTab === 'Equipment' ? (
                <div className="flex-1 overflow-y-auto space-y-6">
                    {/* Paper Doll Layout - Destiny 2 Style */}
                    <div className="relative h-[550px] bg-[#050a14] rounded-3xl border border-blue-900/30 p-4 flex items-center justify-center shadow-2xl overflow-hidden">
                        {/* Background Grid & Glow */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-blue-900/20 pointer-events-none"></div>

                        {/* Silhouette / Avatar Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                            <Shield size={320} className="text-blue-500 drop-shadow-[0_0_50px_rgba(59,130,246,0.5)]" />
                        </div>

                        {/* Left Column Slots (Armor) */}
                        <div className="absolute top-8 left-8 space-y-4">
                            <EquipmentSlot type="helmet" item={getEquippedItem('helmet')} onClick={() => setSelectedSlot('helmet')} size="lg" />
                            <EquipmentSlot type="chest" item={getEquippedItem('chest')} onClick={() => setSelectedSlot('chest')} size="lg" />
                            <EquipmentSlot type="necklace" item={getEquippedItem('necklace')} onClick={() => setSelectedSlot('necklace')} size="lg" />
                            <EquipmentSlot type="boots" item={getEquippedItem('boots')} onClick={() => setSelectedSlot('boots')} size="lg" />
                        </div>

                        {/* Right Column Slots (Jewelry) */}
                        <div className="absolute top-8 right-8 space-y-4">
                            <EquipmentSlot type="gloves" item={getEquippedItem('gloves')} onClick={() => setSelectedSlot('gloves')} size="lg" />
                            <EquipmentSlot type="ring2" item={getEquippedItem('ring2')} onClick={() => setSelectedSlot('ring2')} size="lg" />
                            <EquipmentSlot type="earrings" item={getEquippedItem('earrings')} onClick={() => setSelectedSlot('earrings')} size="lg" />
                            <EquipmentSlot type="ring" item={getEquippedItem('ring')} onClick={() => setSelectedSlot('ring')} size="lg" />
                        </div>

                        {/* Center Slot (Weapon) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <EquipmentSlot type="weapon" item={getEquippedItem('weapon')} onClick={() => setSelectedSlot('weapon')} size="lg" />
                        </div>
                    </div>

                    {/* Stats Summary - Dynamic & Localized */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center shadow-lg gap-4">
                        <div className="text-xs text-slate-400 font-black uppercase tracking-widest whitespace-nowrap">
                            {t('gear_total_bonus', language)}
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 text-sm font-mono w-full">
                            {(() => {
                                // Calculate total bonuses dynamically (Items + Sets)
                                const totals: Record<string, number> = {
                                    Strength: 0,
                                    Vitality: 0,
                                    Agility: 0,
                                    Intelligence: 0,
                                    Fortune: 0,
                                    Metabolism: 0
                                };

                                // 1. Add Item Base Stats
                                equippedItems.forEach(item => {
                                    item.baseStats.forEach(stat => {
                                        if (totals[stat.stat] !== undefined) {
                                            totals[stat.stat] += stat.value;
                                        }
                                    });
                                });

                                // 2. Add Active Set Bonuses
                                EQUIPMENT_SETS.forEach(set => {
                                    const equippedCount = set.pieces.filter(pieceId =>
                                        equippedItems.some(item => item.id === pieceId)
                                    ).length;

                                    set.bonuses.forEach(bonus => {
                                        if (equippedCount >= bonus.requiredCount && bonus.stats) {
                                            if (bonus.stats.strength) totals.Strength += bonus.stats.strength;
                                            if (bonus.stats.vitality) totals.Vitality += bonus.stats.vitality;
                                            if (bonus.stats.agility) totals.Agility += bonus.stats.agility;
                                            if (bonus.stats.intelligence) totals.Intelligence += bonus.stats.intelligence;
                                            if (bonus.stats.fortune) totals.Fortune += bonus.stats.fortune;
                                            if (bonus.stats.metabolism) totals.Metabolism += bonus.stats.metabolism;
                                        }
                                    });
                                });

                                // Define config for display (Order matters for visual consistency)
                                const statOrder = ['Strength', 'Vitality', 'Agility', 'Intelligence', 'Fortune', 'Metabolism'];
                                const statConfig: Record<string, { key: string; color: string; border: string; bg: string }> = {
                                    Strength: { key: 'stat_str_short', color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-950/20' },
                                    Vitality: { key: 'stat_vit_short', color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-950/20' },
                                    Agility: { key: 'stat_agi_short', color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-950/20' },
                                    Intelligence: { key: 'stat_int_short', color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-950/20' },
                                    Fortune: { key: 'stat_luck_short', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-950/20' },
                                    Metabolism: { key: 'stat_meta_short', color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-950/20' },
                                };

                                // Render only stats that have a bonus
                                const activeStats = statOrder.filter(stat => totals[stat] > 0);

                                if (activeStats.length === 0) {
                                    return <span className="text-slate-600 text-xs italic">No active bonuses</span>;
                                }

                                return activeStats.map(statName => {
                                    const value = totals[statName];
                                    const config = statConfig[statName];
                                    // Fallback for safety
                                    if (!config) return null;

                                    return (
                                        <div key={statName} className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${config.border} ${config.bg} min-w-[140px] justify-between`}>
                                            <div className="flex items-center gap-2">
                                                <StatIcon stat={statName as any} size={16} />
                                                <span className={`text-[10px] font-bold uppercase tracking-wider text-slate-400`}>
                                                    {t(config.key as any, language)}
                                                </span>
                                            </div>
                                            <span className={`${config.color} font-black text-lg font-mono`}>
                                                +{value}
                                            </span>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>

                    {/* Set Bonuses */}
                    <div>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 pl-1">{t('gear_active_sets', language)}</h3>
                        <SetBonusDisplay sets={EQUIPMENT_SETS} equippedItemIds={equippedItems.map(i => i.id)} />
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto">
                    {/* Equip Best Button */}
                    <button
                        onClick={() => {
                            // Logic to find best item for each slot
                            const slots: EquipmentType[] = ['weapon', 'helmet', 'chest', 'gloves', 'boots', 'necklace', 'ring', 'ring2', 'earrings'];
                            slots.forEach(slot => {
                                const slotItems = inventoryItems.filter(i => i.type === slot);
                                if (slotItems.length > 0) {
                                    // Sort by rarity (custom order needed) then level
                                    const bestItem = slotItems.sort((a, b) => b.level - a.level)[0]; // Simplified: just pick highest level for now
                                    if (bestItem) onEquip(bestItem.id);
                                }
                            });
                        }}
                        className="w-full py-3 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all"
                    >
                        {t('gear_equip_best', language) || "AUTO EQUIP BEST"}
                    </button>

                    {/* Bulk Salvage Filter */}
                    {onBulkSalvage && (
                        <div className="mb-4 p-3 bg-black/40 rounded-xl border border-amber-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Filter size={14} className="text-amber-400" />
                                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Auto-Salvage</span>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={salvageFilter}
                                    onChange={(e) => setSalvageFilter(e.target.value)}
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                                >
                                    {RARITY_ORDER
                                        .filter(rarity => {
                                            // Default to 99999 (Locked) if not found in lookup
                                            const unlockFloor = RARITY_UNLOCK_FLOORS[rarity] ?? 99999;
                                            return unlockFloor <= maxReachedFloor;
                                        })
                                        .map(rarity => (
                                            <option key={rarity} value={rarity}>
                                                Keep: {rarity.charAt(0).toUpperCase() + rarity.slice(1)}+
                                            </option>
                                        ))}
                                </select>
                                <button
                                    onClick={() => setShowSalvageConfirm(true)}
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold uppercase flex items-center gap-1"
                                >
                                    <Trash2 size={12} />
                                    Salvage
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2">
                                Converts items below selected rarity into shards
                            </p>
                        </div>
                    )}

                    {/* Salvage Confirmation Modal */}
                    <AnimatePresence>
                        {showSalvageConfirm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                                onClick={() => setShowSalvageConfirm(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.9 }}
                                    className="bg-slate-900 border border-amber-500/30 rounded-xl p-6 max-w-sm"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <h3 className="text-lg font-black text-amber-400 mb-2">Confirm Bulk Salvage</h3>
                                    <p className="text-slate-400 text-sm mb-4">
                                        This will salvage ALL unequipped items below <span className="text-amber-400 font-bold">{salvageFilter}</span> rarity for shards.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowSalvageConfirm(false)}
                                            className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                onBulkSalvage?.(salvageFilter);
                                                setShowSalvageConfirm(false);
                                            }}
                                            className="flex-1 py-2 bg-amber-600 text-white rounded-lg font-bold"
                                        >
                                            Salvage All
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Inventory Grouped by Type */}
                    {/* Unequip All Button */}
                    <button
                        onClick={onUnequipAll}
                        className="w-full py-2 mb-6 bg-red-900/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-900/50 transition-colors"
                    >
                        {t('gear_unequip_all', language) || "UNEQUIP ALL ITEMS"}
                    </button>

                    {['weapon', 'helmet', 'chest', 'gloves', 'boots', 'necklace', 'ring', 'ring2', 'earrings'].map((type) => {
                        const itemsOfType = inventoryItems.filter(i => i.type === type);
                        if (itemsOfType.length === 0) return null;

                        return (
                            <div key={type} className="mb-6">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 pl-1 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                                    {type}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {itemsOfType.map(item => (
                                        <ItemCard
                                            key={item.id}
                                            item={item}
                                            showActions
                                            onEquip={() => onEquip(item.id)}
                                            onUpgrade={() => handleUpgradeClick(item.id)}
                                            onSalvage={() => onSalvage(item.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {inventoryItems.length === 0 && (
                        <div className="text-center py-12 opacity-50">
                            <Package size={48} className="mx-auto mb-4 text-slate-700" />
                            <p className="text-slate-500 font-mono text-xs">{t('gear_inventory_empty', language)}</p>
                        </div>
                    )}


                </div>
            )}

            {/* Selected Slot Modal */}
            <AnimatePresence>
                {selectedSlot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedSlot(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0a0f1e] border border-blue-500/30 rounded-2xl p-6 w-full max-w-xs shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-black text-white italic uppercase mb-4 text-center border-b border-blue-900/50 pb-2">
                                {t('gear_slot_modal_title', language).replace('{slot}', selectedSlot)}
                            </h3>

                            {getEquippedItem(selectedSlot) ? (
                                <div className="space-y-4">
                                    <ItemCard
                                        item={getEquippedItem(selectedSlot)!}
                                        showActions
                                        unequipLabel={t('gear_unequip', language)}
                                        onUnequip={() => {
                                            onUnequip(getEquippedItem(selectedSlot)!.id);
                                            setSelectedSlot(null);
                                        }}
                                        onUpgrade={() => handleUpgradeClick(getEquippedItem(selectedSlot)!.id)}
                                        onSalvage={() => onSalvage(getEquippedItem(selectedSlot)!.id)}
                                    />
                                    <p className="text-xs text-slate-500 text-center italic">
                                        {t('gear_tap_to_close', language)}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-700 mx-auto mb-4 flex items-center justify-center bg-slate-900/50">
                                        <span className="text-2xl opacity-50">{t('gear_empty_slot', language)}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-4">{t('gear_no_item_equipped', language)}</p>
                                    <button
                                        onClick={() => {
                                            setActiveTab('Inventory');
                                            setSelectedSlot(null);
                                        }}
                                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                                    >
                                        {t('gear_go_to_inventory', language)}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upgrade Modal */}
            <AnimatePresence>
                {upgradeModalItem && (() => {
                    const maxLevel = getMaxLevel(upgradeModalItem.rarity);
                    const levelsRemaining = maxLevel - upgradeModalItem.level;
                    const actualLevels = Math.min(upgradeLevels, levelsRemaining);

                    // Calculate total cost for selected levels
                    let totalCost = 0;
                    for (let i = 0; i < actualLevels; i++) {
                        totalCost += 100 * (upgradeModalItem.level + i + 1);
                    }

                    return (
                        <UpgradeModal
                            item={upgradeModalItem}
                            onClose={() => {
                                setUpgradeModalItem(null);
                                setUpgradeResult(null);
                                setIsUpgrading(false);
                                setUpgradeLevels(1);
                            }}
                            onConfirm={() => handleUpgradeConfirm(upgradeModalItem.id, actualLevels)}
                            cost={totalCost}
                            canAfford={state.shards >= totalCost}
                            successChance={(() => {
                                const baseChance = upgradeModalItem.level >= 15 ? 0.3 :
                                    upgradeModalItem.level >= 10 ? 0.5 :
                                        upgradeModalItem.level >= 5 ? 0.8 : 1.0;
                                const pityBonus = (upgradeModalItem.consecutiveFailures || 0) * 0.15;
                                return Math.min(baseChance + pityBonus, 0.95);
                            })()}
                            language={language}
                            isUpgrading={isUpgrading}
                            upgradeResult={upgradeResult}
                            levels={actualLevels}
                            maxLevel={maxLevel}
                            currentShards={state.shards}
                            onLevelsChange={(l) => setUpgradeLevels(l)}
                        />
                    );
                })()}
            </AnimatePresence>

        </div>
    );
};
