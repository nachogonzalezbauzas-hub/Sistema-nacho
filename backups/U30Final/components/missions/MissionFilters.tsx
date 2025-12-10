import React from 'react';
import { StatType } from '../../types';
import { RefreshCw, Sword, Heart, Zap, Brain, Sparkles, Flame } from 'lucide-react';

export type FilterType = 'All' | 'Daily' | 'Completed' | StatType;

interface MissionFiltersProps {
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
}

export const MissionFilters: React.FC<MissionFiltersProps> = ({ filter, setFilter }) => {
    return (
        <div className="relative mb-6">
            <div className="flex gap-2 overflow-x-auto pb-4 pt-2 scrollbar-hide -mx-6 px-6 mask-linear-fade">
                {[
                    { id: 'All', icon: null, label: 'All' },
                    { id: 'Daily', icon: RefreshCw, label: 'Daily' },
                    { id: 'Strength', icon: Sword, label: 'STR' },
                    { id: 'Vitality', icon: Heart, label: 'VIT' },
                    { id: 'Agility', icon: Zap, label: 'AGI' },
                    { id: 'Intelligence', icon: Brain, label: 'INT' },
                    { id: 'Fortune', icon: Sparkles, label: 'LUCK' },
                    { id: 'Metabolism', icon: Flame, label: 'META' }
                ].map((item) => {
                    const isSelected = filter === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setFilter(item.id as FilterType)}
                            className={`
                      relative px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300
                      flex items-center gap-1.5 border
                      ${isSelected
                                    ? 'text-white border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.4)] bg-blue-600/20'
                                    : 'bg-[#050a14]/60 text-slate-500 border-slate-800 hover:border-blue-500/30 hover:text-blue-300'
                                }
                    `}
                        >
                            {Icon && <Icon size={12} className={isSelected ? "text-blue-300" : "text-slate-500"} />}
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
