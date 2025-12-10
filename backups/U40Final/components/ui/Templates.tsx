import React from 'react';
import { Plus } from 'lucide-react';
import { MissionTemplate } from '../../data/missionTemplates';
import { StatIcon } from './Stats';

export const TemplateChip: React.FC<{ template: MissionTemplate; onClick: () => void }> = ({ template, onClick }) => {
    const isHabit = template.category === 'Habit';
    return (
        <button onClick={onClick} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 group whitespace-nowrap shrink-0 hover:scale-105 ${isHabit ? 'bg-slate-900/80 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800' : 'bg-[#0a0502] border-yellow-900/50 hover:border-yellow-500/50 hover:bg-yellow-950/20'}`}>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isHabit ? 'bg-slate-800 border-slate-600' : 'bg-yellow-950/30 border-yellow-700/50'}`}>
                <StatIcon stat={template.targetStat} size={12} />
            </div>
            <div className="flex flex-col items-start leading-none gap-0.5">
                <span className={`text-[10px] font-bold uppercase ${isHabit ? 'text-slate-300' : 'text-yellow-500'}`}>{template.label}</span>
                <span className="text-[8px] font-mono text-slate-500">{template.category}</span>
            </div>
            <Plus size={12} className="text-slate-600 group-hover:text-blue-400" />
        </button>
    );
};
