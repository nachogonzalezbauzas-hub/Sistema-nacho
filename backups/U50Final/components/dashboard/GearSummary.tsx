import React from 'react';
import { motion } from 'framer-motion';
import { Equipment, EquipmentType } from '@/types';
import { EquipmentSlot } from '@/components/equipment/UIComponents';
import { t, Language } from '@/data/translations';
import { Shield, ChevronRight } from 'lucide-react';

interface GearSummaryProps {
    equippedItems: Equipment[];
    onManageGear: () => void;
    language: Language;
}

export const GearSummary: React.FC<GearSummaryProps> = ({ equippedItems, onManageGear, language }) => {
    const getEquippedItem = (type: EquipmentType) => equippedItems.find(i => i.type === type);



    return (
        <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 opacity-50 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="text-lg font-black italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase tracking-tighter">
                    {t('gear_title', language)}
                </h3>
                <button
                    onClick={onManageGear}
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                    {t('common_manage', language)} <ChevronRight size={12} />
                </button>
            </div>

            <div className="flex gap-4 items-center relative z-10">
                {/* Quick Slots Preview - Horizontal Row */}
                <div className="flex-1 flex justify-between gap-2">
                    <div className="scale-90"><EquipmentSlot type="weapon" item={getEquippedItem('weapon')} onClick={onManageGear} /></div>
                    <div className="scale-90"><EquipmentSlot type="helmet" item={getEquippedItem('helmet')} onClick={onManageGear} /></div>
                    <div className="scale-90"><EquipmentSlot type="chest" item={getEquippedItem('chest')} onClick={onManageGear} /></div>
                    <div className="scale-90"><EquipmentSlot type="gloves" item={getEquippedItem('gloves')} onClick={onManageGear} /></div>
                    <div className="scale-90"><EquipmentSlot type="boots" item={getEquippedItem('boots')} onClick={onManageGear} /></div>
                </div>
            </div>
        </div>
    );
};
