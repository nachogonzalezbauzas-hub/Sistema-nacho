import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BodyRecord } from '../../types';
import { TrendingUp, TrendingDown, Minus, Moon } from 'lucide-react';
import { getDelta } from './utils';

interface MeasurementsListProps {
    records: BodyRecord[];
    trends: {
        status: 'cutting' | 'bulking' | 'stable' | 'insufficient';
        label: string;
        diff?: number;
        avgLast?: number;
    } | null;
}

export const MeasurementsList: React.FC<MeasurementsListProps> = ({ records, trends }) => {
    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                History & Trends
            </h3>

            {/* 7-Day Trend Pill */}
            {trends && trends.status !== 'insufficient' && trends.diff !== undefined && trends.avgLast !== undefined ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800 mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-md ${trends.status === 'cutting' ? 'bg-green-900/30 text-green-400' : trends.status === 'bulking' ? 'bg-red-900/30 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
                            {trends.status === 'cutting' ? <TrendingDown size={16} /> : trends.status === 'bulking' ? <TrendingUp size={16} /> : <Minus size={16} />}
                        </div>
                        <div>
                            <span className={`block text-[10px] font-bold uppercase tracking-wider ${trends.status === 'cutting' ? 'text-green-400' : trends.status === 'bulking' ? 'text-red-400' : 'text-slate-400'}`}>
                                {trends.label}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">7-Day Avg: {trends.avgLast.toFixed(1)}kg</span>
                        </div>
                    </div>
                    <div className={`text-xs font-mono font-bold ${trends.diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {trends.diff > 0 ? '+' : ''}{trends.diff.toFixed(1)}kg
                    </div>
                </div>
            ) : records.length > 0 && (
                <div className="px-3 py-2 rounded border border-slate-800 bg-slate-900/20 text-center mb-4">
                    <span className="text-[10px] text-slate-600 font-mono uppercase">Track at least 8 days to unlock trends</span>
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
                                className="group flex items-center justify-between p-3 rounded-lg bg-[#050914] border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 flex flex-col items-center justify-center rounded bg-slate-900 border border-slate-800 text-slate-500">
                                        <span className="text-[9px] font-bold uppercase">{new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                        <span className="text-xs font-mono font-bold text-white">{new Date(record.date).getDate()}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-white font-mono">{record.weight} kg</span>
                                            {delta && (
                                                <span className={`text-[9px] font-mono ${delta.color} opacity-60 flex items-center`}>
                                                    {delta.icon} {delta.val}
                                                </span>
                                            )}
                                        </div>
                                        {record.notes && (
                                            <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{record.notes}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-purple-900/10 border border-purple-500/10">
                                    <Moon size={10} className="text-purple-400" />
                                    <span className="text-xs font-mono font-bold text-purple-200">{record.sleepHours}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};
