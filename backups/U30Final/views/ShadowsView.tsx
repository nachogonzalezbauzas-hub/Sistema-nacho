import React from 'react';
import { AppState } from '../types';
import { ShadowCard } from '../components/ui/ShadowCard';
import { Card } from '../components/UIComponents';
import { Ghost, ShieldAlert } from 'lucide-react';

interface ShadowsViewProps {
    state: AppState;
    onEquipShadow: (id: string) => void;
}

export const ShadowsView: React.FC<ShadowsViewProps> = ({ state, onEquipShadow }) => {
    const { shadows, equippedShadowId } = state;

    // Sort: Equipped first, then by Rank (S -> E)
    const sortedShadows = [...shadows].sort((a, b) => {
        if (a.id === equippedShadowId) return -1;
        if (b.id === equippedShadowId) return 1;
        const ranks = { S: 5, A: 4, B: 3, C: 2, D: 1, E: 0 };
        return ranks[b.rank] - ranks[a.rank];
    });

    return (
        <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-end px-1 pb-2 border-b border-purple-900/30">
                <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter drop-shadow-md flex items-center gap-2">
                        <Ghost className="text-purple-500" /> SHADOW ARMY
                    </h2>
                    <p className="text-xs text-purple-400/80 font-mono uppercase tracking-widest mt-1">
                        Command your soldiers ({shadows.length})
                    </p>
                </div>
            </div>

            {/* Empty State */}
            {shadows.length === 0 && (
                <Card className="p-8 flex flex-col items-center justify-center text-center border-dashed border-slate-800 bg-slate-900/20">
                    <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4">
                        <Ghost size={32} className="text-slate-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-400">No Shadows Extracted</h3>
                    <p className="text-xs text-slate-500 mt-2 max-w-[200px]">
                        Defeat dungeon bosses for a chance to extract their shadows and build your army.
                    </p>
                </Card>
            )}

            {/* Shadows Grid */}
            <div className="grid grid-cols-2 gap-3">
                {sortedShadows.map(shadow => (
                    <ShadowCard
                        key={shadow.id}
                        shadow={{ ...shadow, isEquipped: shadow.id === equippedShadowId }}
                        onEquip={onEquipShadow}
                    />
                ))}
            </div>

            {/* Info Box */}
            {shadows.length > 0 && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30 flex items-start gap-3">
                    <ShieldAlert className="text-purple-400 shrink-0" size={18} />
                    <p className="text-[10px] text-purple-300/80 leading-relaxed">
                        <strong className="text-purple-200">System Hint:</strong> You can only have one active shadow summoned at a time. The summoned shadow provides its passive bonus to your stats.
                    </p>
                </div>
            )}
        </div>
    );
};
