import React from 'react';
import { Shadow } from '../../types';
import { Card, Button } from '../UIComponents';
import { RankPill } from './Season';
import { StatBadge } from './Stats';
import { Check } from 'lucide-react';

interface ShadowCardProps {
    shadow: Shadow;
    onEquip: (id: string) => void;
}

export const ShadowCard: React.FC<ShadowCardProps> = ({ shadow, onEquip }) => {
    return (
        <Card className={`
            relative overflow-hidden transition-all duration-300
            ${shadow.isEquipped ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] bg-purple-950/20' : 'border-slate-800 hover:border-purple-500/50'}
        `}>
            {/* Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-purple-900/20 pointer-events-none" />

            <div className="relative p-4 flex flex-col gap-3">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">{shadow.name}</h3>
                        <p className="text-[10px] text-purple-400 font-mono mt-0.5">Shadow Soldier</p>
                    </div>
                    <RankPill rank={shadow.rank} size="sm" />
                </div>

                {/* Image Placeholder */}
                <div className="w-full aspect-square rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=2664&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale group-hover:grayscale-0 transition-all duration-500" />
                    <div className="relative z-10 text-4xl animate-pulse">👻</div>
                </div>

                {/* Bonus */}
                <div className="flex items-center justify-between bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Passive Bonus</span>
                    <StatBadge stat={shadow.bonus.stat} value={shadow.bonus.value} />
                </div>

                {/* Action */}
                <Button
                    variant={shadow.isEquipped ? 'secondary' : 'primary'}
                    onClick={() => onEquip(shadow.id)}
                    className="w-full text-xs py-2"
                >
                    {shadow.isEquipped ? (
                        <span className="flex items-center gap-2 justify-center text-purple-300">
                            <Check size={14} /> Summoned
                        </span>
                    ) : (
                        "Summon"
                    )}
                </Button>
            </div>
        </Card>
    );
};
