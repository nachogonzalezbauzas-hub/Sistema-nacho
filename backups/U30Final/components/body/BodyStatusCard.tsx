import React from 'react';
import { motion } from 'framer-motion';
import { BodyRecord } from '../../types';
import { Card } from '../UIComponents';
import { Moon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface BodyStatusCardProps {
    latestRecord: BodyRecord;
    previousRecord?: BodyRecord;
}

import { getDelta } from './utils';

const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

export const BodyStatusCard: React.FC<BodyStatusCardProps> = ({ latestRecord, previousRecord }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative group"
        >
            <div className="absolute inset-0 bg-blue-600/5 blur-xl rounded-2xl group-hover:bg-blue-600/10 transition-all duration-500"></div>
            <Card className="relative border border-blue-500/30 bg-[#0a0f1e]/90 p-5 flex flex-col gap-4 overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-blue-400/50">

                {/* Top Row: Date & Status */}
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                        {formatDate(latestRecord.date)}
                    </span>
                    {previousRecord && (
                        <div className="flex items-center gap-1.5">
                            {(() => {
                                const delta = getDelta(latestRecord.weight, previousRecord.weight);
                                return (
                                    <span className={`flex items-center gap-1 text-xs font-mono font-bold ${delta.color} bg-slate-950/50 px-2 py-1 rounded border border-white/5`}>
                                        {delta.icon} {delta.val}
                                    </span>
                                );
                            })()}
                        </div>
                    )}
                </div>

                {/* Middle Row: Metrics */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Body Weight</span>
                        <div className="flex items-baseline gap-1">
                            <motion.span
                                key={latestRecord.weight}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-black text-white tracking-tighter drop-shadow-sm"
                            >
                                {latestRecord.weight}
                            </motion.span>
                            <span className="text-sm font-bold text-slate-500">KG</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1">Sleep Cycle</span>
                        <div className="flex items-center gap-2">
                            <Moon size={20} className="text-purple-500 fill-purple-500/20" />
                            <motion.span
                                key={latestRecord.sleepHours}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl font-black text-white tracking-tighter"
                            >
                                {latestRecord.sleepHours}
                            </motion.span>
                            <span className="text-xs font-bold text-slate-500">H</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Notes */}
                {latestRecord.notes && (
                    <div className="mt-2 pt-3 border-t border-blue-900/30">
                        <p className="text-xs text-slate-400 italic leading-relaxed">"{latestRecord.notes}"</p>
                    </div>
                )}
            </Card>
        </motion.div>
    );
};
