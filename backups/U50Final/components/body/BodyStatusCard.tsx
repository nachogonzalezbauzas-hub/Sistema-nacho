import React from 'react';
import { motion } from 'framer-motion';
import { BodyRecord } from '@/types';
import { Card } from '@/components';
import { Moon, TrendingUp, TrendingDown, Minus, Weight } from 'lucide-react';
import { t } from '@/data/translations';
import { getDelta } from './utils';

interface BodyStatusCardProps {
    latestRecord: BodyRecord;
    previousRecord?: BodyRecord;
    language: 'en' | 'es';
}

const formatDate = (isoString: string, language: 'en' | 'es') => {
    const d = new Date(isoString);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return t('body_today', language);
    return d.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

export const BodyStatusCard: React.FC<BodyStatusCardProps> = ({ latestRecord, previousRecord, language }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative group"
        >
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-blue-600/5 blur-2xl rounded-2xl group-hover:bg-blue-600/10 transition-all duration-500 pointer-events-none"></div>

            <Card className="relative border border-white/10 bg-black/40 backdrop-blur-md p-6 flex flex-col gap-6 overflow-hidden transition-all duration-300 hover:border-blue-500/30 shadow-xl">

                {/* Top Row: Date & Status */}
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                        {formatDate(latestRecord.date, language)}
                    </span>
                    {previousRecord && (
                        <div className="flex items-center gap-1.5">
                            {(() => {
                                const delta = getDelta(latestRecord.weight, previousRecord.weight);
                                return (
                                    <span className={`flex items-center gap-1.5 text-xs font-mono font-bold ${delta.color} bg-black/40 px-2.5 py-1 rounded-lg border border-white/5`}>
                                        {delta.icon} {delta.val}
                                    </span>
                                );
                            })()}
                        </div>
                    )}
                </div>

                {/* Middle Row: Metrics */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Weight Section */}
                    <div className="flex flex-col relative group/weight">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <Weight size={14} />
                            </div>
                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{t('body_weight', language)}</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <motion.span
                                key={latestRecord.weight}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            >
                                {latestRecord.weight}
                            </motion.span>
                            <span className="text-sm font-bold text-slate-500 mb-1">KG</span>
                        </div>
                    </div>

                    {/* Sleep Section */}
                    <div className="flex flex-col items-end relative group/sleep">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{t('body_sleep_cycle', language)}</span>
                            <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                <Moon size={14} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <motion.span
                                key={latestRecord.sleepHours}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                            >
                                {latestRecord.sleepHours}
                            </motion.span>
                            <span className="text-sm font-bold text-slate-500 mb-1">H</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Notes */}
                {latestRecord.notes && (
                    <div className="mt-1 pt-4 border-t border-white/5">
                        <p className="text-xs text-slate-400 font-medium leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                            {latestRecord.notes}
                        </p>
                    </div>
                )}
            </Card>
        </motion.div>
    );
};
