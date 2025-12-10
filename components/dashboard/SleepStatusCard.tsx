import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Sparkles, AlertTriangle } from 'lucide-react';
import { ActiveBuff, BodyRecord } from '@/types';
import { BUFF_DEFINITIONS } from '@/data/buffs';
import { t } from '@/data/translations';

interface SleepStatusCardProps {
    activeBuffs: ActiveBuff[];
    lastSleepRecord?: BodyRecord;
    language: 'en' | 'es';
}

export const SleepStatusCard: React.FC<SleepStatusCardProps> = ({ activeBuffs, lastSleepRecord, language }) => {
    const wellRestedBuff = useMemo(() => {
        const now = new Date();
        return activeBuffs.find(b => b.id === 'well_rested' && new Date(b.expiresAt) > now);
    }, [activeBuffs]);

    const buffDef = BUFF_DEFINITIONS.find(b => b.id === 'well_rested');

    const timeRemaining = useMemo(() => {
        if (!wellRestedBuff) return null;
        const now = new Date();
        const expires = new Date(wellRestedBuff.expiresAt);
        const diffMs = expires.getTime() - now.getTime();
        if (diffMs <= 0) return null;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return { hours, minutes };
    }, [wellRestedBuff]);

    const lastSleepHours = lastSleepRecord?.sleepHours;
    const lastSleepDate = lastSleepRecord?.date ? new Date(lastSleepRecord.date) : null;
    const daysSinceLastSleep = lastSleepDate
        ? Math.floor((new Date().getTime() - lastSleepDate.getTime()) / (1000 * 60 * 60 * 24))
        : null;

    // Determine status
    let status: 'well_rested' | 'rested' | 'tired' | 'no_data' = 'no_data';
    if (wellRestedBuff) {
        status = 'well_rested';
    } else if (lastSleepHours !== undefined) {
        if (lastSleepHours >= 7) status = 'rested';
        else status = 'tired';
    }

    const statusConfig = {
        well_rested: {
            icon: <Sparkles size={20} className="text-yellow-400" />,
            title: language === 'es' ? 'Bien Descansado' : 'Well Rested',
            subtitle: language === 'es' ? 'Todos los stats +10, XP +10%' : 'All stats +10, XP +10%',
            bgClass: 'bg-gradient-to-r from-yellow-900/30 to-amber-900/30',
            borderClass: 'border-yellow-500/30',
            glowClass: 'shadow-[0_0_20px_rgba(234,179,8,0.2)]'
        },
        rested: {
            icon: <Moon size={20} className="text-blue-400" />,
            title: language === 'es' ? 'Descansado' : 'Rested',
            subtitle: language === 'es' ? 'Última noche: ' + lastSleepHours + 'h' : 'Last night: ' + lastSleepHours + 'h',
            bgClass: 'bg-gradient-to-r from-blue-900/30 to-slate-900/30',
            borderClass: 'border-blue-500/30',
            glowClass: ''
        },
        tired: {
            icon: <AlertTriangle size={20} className="text-orange-400" />,
            title: language === 'es' ? 'Cansado' : 'Tired',
            subtitle: language === 'es' ? 'Solo ' + lastSleepHours + 'h de sueño' : 'Only ' + lastSleepHours + 'h sleep',
            bgClass: 'bg-gradient-to-r from-orange-900/30 to-red-900/30',
            borderClass: 'border-orange-500/30',
            glowClass: ''
        },
        no_data: {
            icon: <Moon size={20} className="text-slate-500" />,
            title: language === 'es' ? 'Sin Datos' : 'No Data',
            subtitle: language === 'es' ? 'Registra tu sueño en Físico' : 'Log sleep in Physical',
            bgClass: 'bg-slate-900/30',
            borderClass: 'border-slate-700',
            glowClass: ''
        }
    };

    const config = statusConfig[status];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border ${config.bgClass} ${config.borderClass} ${config.glowClass}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${status === 'well_rested' ? 'bg-yellow-500/20 animate-pulse' : 'bg-slate-800'}`}>
                        {config.icon}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">{config.title}</h3>
                        <p className="text-xs text-slate-400">{config.subtitle}</p>
                    </div>
                </div>

                {timeRemaining && (
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{language === 'es' ? 'Expira en' : 'Expires in'}</p>
                        <p className="text-lg font-mono font-bold text-yellow-400">
                            {timeRemaining.hours}h {timeRemaining.minutes}m
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
