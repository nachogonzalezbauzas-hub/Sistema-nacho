import React from 'react';
import { LogCategory } from '../../types';

export const LogCategoryBadge: React.FC<{ category: LogCategory }> = ({ category }) => {
    let colors = "bg-slate-800 text-slate-400 border-slate-700";
    switch (category) {
        case 'Mission': colors = "bg-blue-900/30 text-blue-400 border-blue-500/30"; break;
        case 'LevelUp': colors = "bg-cyan-900/30 text-cyan-400 border-cyan-500/30"; break;
        case 'Health': colors = "bg-pink-900/30 text-pink-400 border-pink-500/30"; break;
        case 'Streak': colors = "bg-yellow-900/30 text-yellow-400 border-yellow-500/30"; break;
        case 'Achievement': colors = "bg-purple-900/30 text-purple-400 border-purple-500/30"; break;
        case 'System': colors = "bg-slate-800 text-slate-400 border-slate-600"; break;
    }

    return (
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colors}`}>
            {category}
        </span>
    );
};
