import React from 'react';
import { Shadow } from '../../types';
import { Card, Button } from '../UIComponents';
import { RankPill } from './Season';
import { StatBadge } from './Stats';
import { Check } from 'lucide-react';
import { getShadowDef } from '../../data/shadows';

interface ShadowCardProps {
    shadow: Shadow;
    onEquip: (id: string) => void;
}

export const ShadowCard: React.FC<ShadowCardProps> = ({ shadow, onEquip }) => {
    const def = getShadowDef(shadow.id) || getShadowDef(shadow.name) || {
        icon: <div className="text-4xl">👻</div>,
        color: 'text-purple-400',
        title: 'Shadow Soldier',
        description: 'A loyal soldier of the shadow army.'
    };

    return (
        <Card className={`
            relative overflow-hidden transition-all duration-300 group
            ${shadow.isEquipped
                ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] bg-purple-950/30'
                : 'border-slate-800 hover:border-purple-500/50 bg-slate-950/40 hover:bg-slate-900/60'}
        `}>
            {/* Background Effect */}
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-purple-900/20 pointer-events-none transition-opacity duration-500 ${shadow.isEquipped ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'}`} />

            {/* Rank Background Glow */}
            {['S', 'SS', 'SSS'].includes(shadow.rank) && (
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />
            )}

            <div className="relative p-4 flex flex-col gap-3">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`text-sm font-black uppercase tracking-wider ${shadow.isEquipped ? 'text-white' : 'text-slate-300'}`}>
                            {shadow.name}
                        </h3>
                        <p className={`text-[10px] font-mono mt-0.5 ${def.color}`}>
                            {def.title}
                        </p>
                    </div>
                    <RankPill rank={shadow.rank} size="sm" />
                </div>

                {/* Icon / Visual */}
                <div className={`
                    w-full aspect-square rounded-lg border flex items-center justify-center overflow-hidden relative transition-all duration-500
                    ${shadow.isEquipped ? 'bg-slate-900/80 border-purple-500/50' : 'bg-slate-950 border-slate-800 group-hover:border-purple-500/30'}
                `}>
                    {/* Inner Glow */}
                    <div className={`absolute inset-0 opacity-20 transition-opacity duration-500 ${shadow.isEquipped ? 'bg-purple-500/20' : 'group-hover:bg-purple-500/10'}`} />

                    {/* The Icon */}
                    <div className={`
                        relative z-10 transition-all duration-500 transform
                        ${shadow.isEquipped ? 'scale-110 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]' : 'scale-100 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]'}
                        ${def.color}
                    `}>
                        {def.icon}
                    </div>

                    {/* Arise Effect Text (only when equipped or hovering S rank) */}
                    {(shadow.isEquipped || ['S', 'SS', 'SSS'].includes(shadow.rank)) && (
                        <div className="absolute bottom-2 text-[10px] font-black tracking-[0.2em] text-purple-500/40 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            Arise
                        </div>
                    )}
                </div>

                {/* Bonus */}
                <div className="flex items-center justify-between bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Bonus</span>
                    <StatBadge stat={shadow.bonus.stat} value={shadow.bonus.value} />
                </div>

                {/* Action */}
                <Button
                    variant={shadow.isEquipped ? 'secondary' : 'primary'}
                    onClick={() => onEquip(shadow.id)}
                    className={`w-full text-xs py-2 transition-all duration-300 ${shadow.isEquipped ? 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/50' : ''}`}
                >
                    {shadow.isEquipped ? (
                        <span className="flex items-center gap-2 justify-center text-purple-300 font-bold">
                            <Check size={14} /> SUMMONED
                        </span>
                    ) : (
                        <span className="group-hover:tracking-widest transition-all duration-300">SUMMON</span>
                    )}
                </Button>
            </div>
        </Card>
    );
};
