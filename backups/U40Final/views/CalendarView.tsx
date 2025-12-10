import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../store';
import { CalendarDayData, StatType } from '../types';
import { CalendarHeader, CalendarDay, Card, StatIcon, StatBadge, LogCategoryBadge } from '../components/UIComponents';
import { getCalendarDays, formatDateKey } from '../utils/calendar';
import { addMonths, subMonths, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Activity, Book, Flame } from 'lucide-react';
import { t } from '../data/translations';

interface CalendarViewProps {
    language: 'en' | 'es';
}

export const CalendarView: React.FC<CalendarViewProps> = ({ language }) => {
    const { getCalendarData, getDayInfo } = useStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Recompute calendar data whenever needed (store handles caching logic if any)
    const calendarData = getCalendarData();

    const days = useMemo(() => getCalendarDays(currentDate), [currentDate]);

    const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
    const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

    const selectedDayData = selectedDate ? getDayInfo(selectedDate) : null;

    // Weekly Summary Calculation
    const weeklySummary = useMemo(() => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 });
        const end = endOfWeek(new Date(), { weekStartsOn: 1 });
        const weekDays = eachDayOfInterval({ start, end });

        let totalXp = 0;
        let missionsCompleted = 0;
        let sleepSum = 0;
        let sleepCount = 0;
        let weightSum = 0;
        let weightCount = 0;
        let efficiencySum = 0;

        weekDays.forEach(day => {
            const key = formatDateKey(day);
            const data = calendarData[key];
            if (data) {
                totalXp += data.xpGained;
                missionsCompleted += data.missions.length; // Note: This might be 0 if we rely only on logs and don't reconstruct missions fully
                if (data.health) {
                    sleepSum += data.health.sleepHours;
                    sleepCount++;
                    weightSum += data.health.weight;
                    weightCount++;
                }
                efficiencySum += data.efficiency;
            }
        });

        return {
            xp: totalXp,
            missions: missionsCompleted,
            avgSleep: sleepCount > 0 ? (sleepSum / sleepCount).toFixed(1) : '-',
            avgWeight: weightCount > 0 ? (weightSum / weightCount).toFixed(1) : '-',
            efficiency: (efficiencySum / 7).toFixed(0)
        };
    }, [calendarData]);

    const weekDays = [
        t('cal_mon', language),
        t('cal_tue', language),
        t('cal_wed', language),
        t('cal_thu', language),
        t('cal_fri', language),
        t('cal_sat', language),
        t('cal_sun', language)
    ];

    return (
        <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Weekly Summary Bar */}
            <div className="grid grid-cols-4 gap-2 p-2 bg-slate-900/50 rounded-xl border border-blue-900/30 backdrop-blur-md">
                <div className="flex flex-col items-center p-2 bg-slate-950/50 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{t('cal_weekly_xp', language)}</span>
                    <span className="text-lg font-black text-blue-400 font-mono">{weeklySummary.xp}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-slate-950/50 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{t('cal_efficiency', language)}</span>
                    <span className="text-lg font-black text-cyan-400 font-mono">{weeklySummary.efficiency}%</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-slate-950/50 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{t('cal_avg_sleep', language)}</span>
                    <span className="text-lg font-black text-purple-400 font-mono">{weeklySummary.avgSleep}h</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-slate-950/50 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{t('cal_avg_weight', language)}</span>
                    <span className="text-lg font-black text-red-400 font-mono">{weeklySummary.avgWeight}</span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-[#050a14] border border-blue-900/40 rounded-xl overflow-hidden shadow-lg">
                <CalendarHeader currentDate={currentDate} onPrev={handlePrevMonth} onNext={handleNextMonth} />

                <div className="grid grid-cols-7 gap-1 p-2 text-center border-b border-blue-900/20 bg-slate-950">
                    {weekDays.map(d => (
                        <span key={d} className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{d}</span>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentDate.toISOString()}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-7 gap-1 p-2"
                    >
                        {days.map(day => {
                            const dateKey = formatDateKey(day);
                            const dayData = calendarData[dateKey] || { date: dateKey, missions: [], xpGained: 0, streak: 0, efficiency: 0 };
                            // Check for milestone logs on this day
                            const hasMilestoneActivity = dayData.logs?.some(l => l.category === 'Milestone');
                            const hasSeasonActivity = dayData.logs?.some(l => l.message.includes('Season Rank Up'));

                            return (
                                <CalendarDay
                                    key={dateKey}
                                    date={day}
                                    data={dayData}
                                    isCurrentMonth={day.getMonth() === currentDate.getMonth()}
                                    isToday={isSameDay(day, new Date())}
                                    isSelected={selectedDate === dateKey}
                                    onClick={() => setSelectedDate(dateKey)}
                                    hasMilestoneActivity={hasMilestoneActivity}
                                    hasSeasonActivity={hasSeasonActivity}
                                />
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Day Detail Panel */}
            <AnimatePresence>
                {selectedDate && selectedDayData && (
                    <motion.div
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-[#030712] border-t border-blue-500/30 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] max-h-[80vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-[#030712]/95 backdrop-blur-md p-4 border-b border-blue-900/30 flex justify-between items-center z-10">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{t('cal_system_log', language)}</span>
                                <h2 className="text-xl font-black text-white">{format(parseISO(selectedDate), 'EEEE, MMMM do')}</h2>
                            </div>
                            <button onClick={() => setSelectedDate(null)} className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 pb-24">
                            {/* Daily Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex flex-col items-center">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{t('cal_xp_gained', language)}</span>
                                    <span className="text-xl font-black text-blue-400 font-mono">+{selectedDayData.xpGained}</span>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex flex-col items-center">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{t('cal_streak', language)}</span>
                                    <div className="flex items-center gap-1 text-orange-400 font-bold">
                                        <Flame size={14} /> {selectedDayData.streak || '-'}
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex flex-col items-center">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{t('cal_efficiency', language)}</span>
                                    <span className="text-xl font-black text-cyan-400 font-mono">{selectedDayData.efficiency}%</span>
                                </div>
                            </div>

                            {/* Health Record */}
                            {selectedDayData.health ? (
                                <div className="bg-slate-900/30 p-4 rounded-lg border border-purple-900/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Activity size={16} className="text-purple-400" />
                                        <h3 className="text-sm font-bold text-purple-200 uppercase tracking-wider">{t('cal_physical_status', language)}</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-[10px] text-slate-500 block mb-1">{t('cal_weight', language)}</span>
                                            <span className="text-lg font-mono font-bold text-white">{selectedDayData.health.weight} kg</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-500 block mb-1">{t('cal_sleep', language)}</span>
                                            <span className="text-lg font-mono font-bold text-white">{selectedDayData.health.sleepHours} hrs</span>
                                        </div>
                                    </div>
                                    {selectedDayData.health.notes && (
                                        <div className="mt-3 pt-3 border-t border-slate-800">
                                            <p className="text-xs text-slate-400 italic">"{selectedDayData.health.notes}"</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-4 rounded-lg border border-slate-800 border-dashed text-center">
                                    <span className="text-xs text-slate-600 uppercase tracking-wider">{t('cal_no_physical', language)}</span>
                                </div>
                            )}

                            {/* Logs */}
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                {selectedDayData.logs && selectedDayData.logs.length > 0 ? (
                                    selectedDayData.logs.map(log => (
                                        <div key={log.id} className="flex items-start gap-3 p-2 rounded bg-slate-900/50 border border-slate-800/50">
                                            <div className="mt-0.5">
                                                <LogCategoryBadge category={log.category} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-300 leading-snug">{log.message || (log as any).title}</p>
                                                <span className="text-[9px] text-slate-600 font-mono">{format(new Date(log.timestamp), 'HH:mm')}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500 italic text-center py-4">{t('cal_no_logs', language)}</p>
                                )}
                            </div>

                            {/* Journal Entries */}
                            {selectedDayData.journal && selectedDayData.journal.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Book size={16} className="text-slate-400" />
                                        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">{t('cal_journal_entries', language)}</h3>
                                    </div>
                                    {selectedDayData.journal.map(entry => (
                                        <div key={entry.id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-sm text-slate-300">
                                            {entry.text}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
