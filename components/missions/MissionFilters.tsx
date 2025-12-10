import React from 'react';
import { StatType } from '@/types';
import { RefreshCw, Sword, Heart, Zap, Brain, Sparkles, Flame } from 'lucide-react';
import { t } from '@/data/translations';

export type FilterType = 'All' | 'Daily' | 'Completed' | StatType;

interface MissionFiltersProps {
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
    language: 'en' | 'es';
}

const filterColors: Record<string, string> = {
    All: '#3b82f6', // Blue
    Daily: '#3b82f6', // Blue
    Strength: '#ef4444',
    Vitality: '#22c55e',
    Agility: '#eab308',
    Intelligence: '#3b82f6',
    Fortune: '#a855f7',
    Metabolism: '#f97316',
    Completed: '#64748b', // Slate
};

export const MissionFilters: React.FC<MissionFiltersProps> = ({ filter, setFilter, language }) => {
    return (
        <div className="relative mb-6">
            <div className="flex gap-2 overflow-x-auto pb-4 pt-2 scrollbar-hide -mx-6 px-6 mask-linear-fade">
                {[
                    { id: 'All', icon: null, label: t('missions_filter_all', language) },
                    { id: 'Daily', icon: RefreshCw, label: t('missions_filter_daily', language) },
                    { id: 'Strength', icon: Sword, label: t('stat_str_short', language) },
                    { id: 'Vitality', icon: Heart, label: t('stat_vit_short', language) },
                    { id: 'Agility', icon: Zap, label: t('stat_agi_short', language) },
                    { id: 'Intelligence', icon: Brain, label: t('stat_int_short', language) },
                    { id: 'Fortune', icon: Sparkles, label: t('stat_luck_short', language) },
                    { id: 'Metabolism', icon: Flame, label: t('stat_meta_short', language) }
                ].map((item) => {
                    const isSelected = filter === item.id;
                    const Icon = item.icon;
                    const color = filterColors[item.id] || '#3b82f6';

                    return (
                        <button
                            key={item.id}
                            onClick={() => setFilter(item.id as FilterType)}
                            className={`
                                relative px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300
                                flex items-center gap-1.5 border
                                ${isSelected
                                    ? 'text-white bg-black/40 backdrop-blur-md'
                                    : 'bg-black/20 text-slate-500 border-transparent hover:bg-black/40 hover:text-slate-300'
                                }
                            `}
                            style={{
                                borderColor: isSelected ? `${color}60` : 'transparent',
                                boxShadow: isSelected ? `0 0 15px ${color}20` : 'none',
                            }}
                        >
                            {Icon && <Icon size={12} style={{ color: isSelected ? color : undefined }} />}
                            <span style={{ color: isSelected ? color : undefined }}>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
