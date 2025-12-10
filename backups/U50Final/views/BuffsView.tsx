import React, { useState, useEffect } from 'react';
import { Flame, Clock, Shield } from 'lucide-react';
import { ActiveBuff } from '@/types';
import { BUFF_DEFINITIONS } from '@/data/buffs';
import { motion } from 'framer-motion';

interface BuffsViewProps {
    activeBuffs: ActiveBuff[];
}

export const BuffsView: React.FC<BuffsViewProps> = ({ activeBuffs = [] }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getBuffDetails = (buff: ActiveBuff) => {
        const def = BUFF_DEFINITIONS.find(b => b.id === buff.id);
        if (!def) return null;

        const expires = new Date(buff.expiresAt);
        const timeLeft = Math.max(0, Math.floor((expires.getTime() - now.getTime()) / 60000));
        const timeLeftSeconds = Math.max(0, Math.floor((expires.getTime() - now.getTime()) / 1000));

        const minutes = Math.floor(timeLeftSeconds / 60);
        const seconds = timeLeftSeconds % 60;

        return { ...def, timeLeft: `${minutes}:${seconds.toString().padStart(2, '0')}` };
    };

    return (
        <div className="space-y-6 pb-24">
            <header className="mb-6">
                <h2 className="text-2xl font-bold text-white tracking-wider flex items-center gap-3">
                    <Flame className="text-orange-500" size={28} />
                    ACTIVE BUFFS
                </h2>
                <p className="text-slate-400 text-sm mt-1">Manage your active effects</p>
            </header>

            {activeBuffs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                    <Shield size={48} className="mb-4 opacity-20" />
                    <p>No active buffs</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {activeBuffs.map((buff, index) => {
                        const details = getBuffDetails(buff);
                        if (!details) return null;

                        const expires = new Date(buff.expiresAt);
                        const totalDuration = 60; // minutes
                        const timeLeftMinutes = Math.max(0, (expires.getTime() - now.getTime()) / 60000);
                        const progress = Math.max(0, Math.min(100, (timeLeftMinutes / totalDuration) * 100));

                        let progressColor = 'bg-green-500';
                        if (progress < 30) progressColor = 'bg-red-500';
                        else if (progress < 60) progressColor = 'bg-yellow-500';

                        const isExpiring = timeLeftMinutes < 5;
                        const circumference = 2 * Math.PI * 16; // r=16
                        const strokeDashoffset = circumference - (progress / 100) * circumference;

                        return (
                            <motion.div
                                key={buff.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: [0, -4, 0],
                                    borderColor: isExpiring ? ['rgba(239,68,68,0.3)', 'rgba(239,68,68,0.8)', 'rgba(239,68,68,0.3)'] : 'rgba(251,146,60,0.3)'
                                }}
                                transition={{
                                    y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
                                    borderColor: { duration: 1, repeat: Infinity }
                                }}
                                className={`bg-slate-900/80 border rounded-xl p-4 flex items-center gap-4 shadow-lg shadow-orange-900/10 hover:border-orange-500/40 transition-all ${isExpiring ? 'border-red-500/50' : 'border-orange-900/30'}`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-2xl relative z-10">
                                        {details.icon}
                                    </div>
                                    {/* Icon Aura */}
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 bg-orange-500/20 rounded-full blur-md -z-10"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-orange-100">{details.name}</h3>
                                    <p className="text-xs text-orange-300/70 mb-2">{details.description}</p>
                                    <div className="h-1 bg-slate-950/50 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${progressColor}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right relative">
                                    {/* Circular Timer */}
                                    <div className="relative w-10 h-10 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="20" cy="20" r="16" stroke="#1e293b" strokeWidth="3" fill="none" />
                                            <motion.circle
                                                cx="20" cy="20" r="16"
                                                stroke={isExpiring ? "#ef4444" : "#f97316"}
                                                strokeWidth="3"
                                                fill="none"
                                                strokeDasharray={circumference}
                                                animate={{ strokeDashoffset }}
                                                transition={{ duration: 1, ease: "linear" }}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className={`absolute text-[9px] font-mono font-bold ${isExpiring ? 'text-red-400 animate-pulse' : 'text-orange-400'}`}>
                                            {timeLeftMinutes < 1 ? '<1m' : `${Math.ceil(timeLeftMinutes)}m`}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
