import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BodyRecord } from '@/types';
import { TrendingUp, TrendingDown, Minus, Moon, Calendar, Weight } from 'lucide-react';
import { getDelta } from './utils';
import { t } from '@/data/translations';

interface MeasurementsListProps {
    records: BodyRecord[];
    trends: {
        status: 'cutting' | 'bulking' | 'stable' | 'insufficient';
        label: string;
        diff?: number;
        avgLast?: number;
    } | null;
    language: 'en' | 'es';
}

export const MeasurementsList: React.FC<MeasurementsListProps> = ({ records, trends, language }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                {t('body_history_trends', language)}
            </h3>

            {/* 7-Day Trend Pill */}
            {trends && trends.status !== 'insufficient' && trends.diff !== undefined && trends.avgLast !== undefined ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md shadow-lg mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg border ${trends.status === 'cutting' ? 'bg-green-500/10 text-green-400 border-green-500/20' : trends.status === 'bulking' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-800/50 text-slate-400 border-slate-700/50'}`}>
                            {trends.status === 'cutting' ? <TrendingDown size={18} /> : trends.status === 'bulking' ? <TrendingUp size={18} /> : <Minus size={18} />}
                        </div>
                        <div>
                            <span className={`block text-xs font-bold uppercase tracking-wider mb-0.5 ${trends.status === 'cutting' ? 'text-green-400' : trends.status === 'bulking' ? 'text-red-400' : 'text-slate-400'}`}>
                                {t(`body_trend_${trends.status}` as any, language)}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                {t('body_7_day_avg', language)}: <span className="text-slate-300">{trends.avgLast.toFixed(1)}kg</span>
                            </span>
                        </div>
                    </div>
                    <div className={`text-sm font-black font-mono ${trends.diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {trends.diff > 0 ? '+' : ''}{trends.diff.toFixed(1)}kg
                    </div>
                </div>
            ) : records.length > 0 && (
                <div className="px-4 py-3 rounded-xl border border-dashed border-slate-800 bg-slate-900/20 text-center mb-6">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">{t('body_track_hint', language)}</span>
                </div>
            )}

            {/* History List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-hide">
                <AnimatePresence>
                    {records.map((record, idx) => {
                        // Find specific previous record for this entry to show historical delta
                        const prev = records[idx + 1];
                        const delta = prev ? getDelta(record.weight, prev.weight) : null;

                        return (
                            <motion.div
                                key={record.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 hover:border-blue-500/30 hover:bg-black/60 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 flex flex-col items-center justify-center rounded-lg bg-white/5 border border-white/5 text-slate-500 group-hover:border-blue-500/20 transition-colors">
                                        <span className="text-[8px] font-bold uppercase tracking-wider">{new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                        <span className="text-sm font-black text-slate-300">{new Date(record.date).getDate()}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                                                <Weight size={12} className="text-blue-500" />
                                                {record.weight} kg
                                            </span>
                                            {delta && (
                                                <span className={`text-[10px] font-mono ${delta.color} opacity-80 flex items-center bg-black/30 px-1.5 rounded`}>
                                                    {delta.icon} {delta.val}
                                                </span>
                                            )}
                                        </div>
                                        {record.notes && (
                                            <p className="text-[10px] text-slate-500 truncate max-w-[140px] italic">"{record.notes}"</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                    <Moon size={12} className="text-purple-400" />
                                    <span className="text-xs font-mono font-bold text-purple-200">{record.sleepHours}h</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};
