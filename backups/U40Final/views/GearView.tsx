import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, Equipment, EquipmentType, ItemRarity } from '../types';
import { EquipmentSlot, ItemCard, SetBonusDisplay } from '../components/equipment/UIComponents';
import { EQUIPMENT_SETS } from '../data/equipmentSets';
import { generateEquipment } from '../data/equipmentGenerator';
import { Shield, Sword, Package, Hammer, Sparkles } from 'lucide-react';
import { t, Language } from '../data/translations';

interface GearViewProps {
    state: AppState;
    onEquip: (id: string) => void;
    onUnequip: (id: string) => void;
    onUpgrade: (id: string) => void;
    onSalvage: (id: string) => void;
    onAddEquipment: (item: Equipment) => void;
    language?: Language;
}

export const GearView: React.FC<GearViewProps> = ({ state, onEquip, onUnequip, onUpgrade, onSalvage, onAddEquipment, language = 'en' as Language }) => {
    const [activeTab, setActiveTab] = useState<'Equipment' | 'Inventory'>('Equipment');
    const [selectedSlot, setSelectedSlot] = useState<EquipmentType | null>(null);

    const equippedItems = state.inventory.filter(i => i.isEquipped);
    const inventoryItems = state.inventory.filter(i => !i.isEquipped);

    const getEquippedItem = (type: EquipmentType) => equippedItems.find(i => i.type === type);

    // Debug function to add test items
    const addTestItem = () => {
        const newItem = generateEquipment();
        onAddEquipment(newItem);
    };

    return (
        <div className="h-full flex flex-col pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    {t('gear_title', language)}
                </h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('Equipment')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'Equipment' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}
                >
                    {t('gear_tab_equipment', language)}
                </button>
                <button
                    onClick={() => setActiveTab('Inventory')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'Inventory' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}
                >
                    {t('gear_tab_inventory', language)} ({inventoryItems.length})
                </button>
            </div>

            {activeTab === 'Equipment' ? (
                <div className="flex-1 overflow-y-auto space-y-6">
                    {/* Paper Doll Layout */}
                    <div className="relative h-[400px] bg-[#050a14] rounded-2xl border border-slate-800 p-4 flex items-center justify-center">
                        {/* Silhouette / Avatar Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                            <Shield size={200} />
                        </div>

                        {/* Slots */}
                        <div className="absolute top-4 left-4"><EquipmentSlot type="helmet" item={getEquippedItem('helmet')} onClick={() => setSelectedSlot('helmet')} /></div>
                        <div className="absolute top-24 left-4"><EquipmentSlot type="necklace" item={getEquippedItem('necklace')} onClick={() => setSelectedSlot('necklace')} /></div>
                        <div className="absolute top-44 left-4"><EquipmentSlot type="chest" item={getEquippedItem('chest')} onClick={() => setSelectedSlot('chest')} /></div>

                        <div className="absolute top-4 right-4"><EquipmentSlot type="weapon" item={getEquippedItem('weapon')} onClick={() => setSelectedSlot('weapon')} /></div>
                        <div className="absolute top-24 right-4"><EquipmentSlot type="gloves" item={getEquippedItem('gloves')} onClick={() => setSelectedSlot('gloves')} /></div>
                        <div className="absolute top-44 right-4"><EquipmentSlot type="ring" item={getEquippedItem('ring')} onClick={() => setSelectedSlot('ring')} /></div>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2"><EquipmentSlot type="boots" item={getEquippedItem('boots')} onClick={() => setSelectedSlot('boots')} /></div>

                        {/* Stats Summary */}
                        <div className="absolute bottom-4 left-4 text-[10px] text-slate-500 font-mono">
                            <div className="font-bold text-slate-300 mb-1">{t('gear_total_bonus', language)}</div>
                            {/* This would be dynamic in a real app */}
                            <div>STR +{equippedItems.reduce((acc, i) => acc + (i.baseStats.find(s => s.stat === 'Strength')?.value || 0), 0)}</div>
                            <div>VIT +{equippedItems.reduce((acc, i) => acc + (i.baseStats.find(s => s.stat === 'Vitality')?.value || 0), 0)}</div>
                        </div>
                    </div>

                    {/* Set Bonuses */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">{t('gear_active_sets', language)}</h3>
                        <SetBonusDisplay sets={EQUIPMENT_SETS} equippedItemIds={equippedItems.map(i => i.id)} />
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto">
                    {/* Inventory Grid */}
                    <div className="grid grid-cols-2 gap-3 pb-4">
                        {inventoryItems.map(item => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                showActions
                                onEquip={() => onEquip(item.id)}
                                onUpgrade={() => onUpgrade(item.id)}
                                onSalvage={() => onSalvage(item.id)}
                            />
                        ))}
                    </div>

                    {inventoryItems.length === 0 && (
                        <div className="text-center py-12 opacity-50">
                            <Package size={48} className="mx-auto mb-4 text-slate-700" />
                            <p className="text-slate-500 font-mono text-xs">{t('gear_inventory_empty', language)}</p>
                        </div>
                    )}

                    {/* Debug Button */}
                    <button onClick={addTestItem} className="w-full py-3 mt-4 rounded-lg border border-dashed border-slate-700 text-slate-500 text-xs font-mono hover:bg-slate-900">
                        + DEBUG: Add Random Item
                    </button>
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
                                        onUnequip={() => {
                                            onUnequip(getEquippedItem(selectedSlot)!.id);
                                            setSelectedSlot(null);
                                        }}
                                        onUpgrade={() => onUpgrade(getEquippedItem(selectedSlot)!.id)}
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

        </div>
    );
};
