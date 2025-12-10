import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarDayData } from '@/types';

export const CalendarHeader: React.FC<{ currentDate: Date; onPrev: () => void; onNext: () => void }> = ({ currentDate, onPrev, onNext }) => {
    return (
        <div className="flex items-center justify-between px-4 py-4 bg-slate-950/50 border-b border-blue-900/30">
            <button onClick={onPrev} className="p-2 text-slate-400 hover:text-blue-400 transition-colors">
                <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col items-center">
                <span className="text-lg font-black text-white uppercase tracking-widest">{format(currentDate, 'MMMM')}</span>
                <span className="text-[10px] font-mono text-blue-500 tracking-[0.3em]">{format(currentDate, 'yyyy')}</span>
            </div>
            <button onClick={onNext} className="p-2 text-slate-400 hover:text-blue-400 transition-colors">
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export const CalendarDay: React.FC<{
    date: Date;
    data: CalendarDayData;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    onClick: () => void;
    hasMilestoneActivity?: boolean;
    hasSeasonActivity?: boolean;
    hasUserEvent?: boolean;
}> = ({ date, data, isCurrentMonth, isToday, isSelected, onClick, hasMilestoneActivity, hasSeasonActivity, hasUserEvent }) => {
    const hasMission = data.missions.length > 0 || data.xpGained > 0;
    const hasHealth = !!data.health;

    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
        aspect-square relative flex flex-col items-center justify-center rounded-lg border transition-all duration-300 cursor-pointer
        ${isSelected
                    ? 'bg-blue-900/30 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'bg-slate-900/20 border-slate-800 hover:border-blue-500/30 hover:bg-slate-800/50'
                }
        ${isToday ? 'ring-1 ring-blue-500 ring-offset-1 ring-offset-slate-950' : ''}
      `}
        >
            <span className={`text-xs font-bold font-mono ${isSelected ? 'text-white' : isCurrentMonth ? 'text-slate-400' : 'text-slate-700'}`}>
                {format(date, 'd')}
            </span>

            <div className="flex gap-1 mt-1">
                {hasMission && (
                    <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]"></div>
                )}
                {hasHealth && (
                    <div className="w-1 h-1 rounded-full bg-purple-500 shadow-[0_0_5px_#a855f7]"></div>
                )}
                {hasMilestoneActivity && (
                    <div className="w-1 h-1 rounded-full bg-yellow-500 shadow-[0_0_5px_#eab308]"></div>
                )}
                {hasSeasonActivity && (
                    <div className="absolute -top-1 -right-1 text-[8px]">👑</div>
                )}
                {hasUserEvent && (
                    <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div>
                )}
            </div>

            {isToday && (
                <div className="absolute inset-0 rounded-lg border border-blue-500/20 animate-pulse"></div>
            )}
        </motion.div>
    );
};
