import React from 'react';
import { AppState } from '../types';
import { ShadowCard } from '../components/ui/ShadowCard';
import { Card } from '../components/UIComponents';
import { Ghost, ShieldAlert, Swords, Crown, Zap } from 'lucide-react';
import { t } from '../data/translations';
import { SHADOW_DEFINITIONS } from '../data/shadows';
import { motion } from 'framer-motion';

interface ShadowsViewProps {
    state: AppState;
    onEquipShadow: (id: string) => void;
    language: 'en' | 'es';
}

export const ShadowsView: React.FC<ShadowsViewProps> = ({ state, onEquipShadow, language }) => {
    const { shadows, equippedShadowId } = state;

    // Calculate Army Stats
    const totalShadows = shadows.length;
    const totalPower = shadows.reduce((acc, s) => acc + (s.bonus.value * 100), 0); // Rough power calc
    const activeShadow = shadows.find(s => s.id === equippedShadowId);

    // Merge owned shadows with definitions to show locked ones
    const allShadows = SHADOW_DEFINITIONS.map(def => {
        const owned = shadows.find(s => s.id === def.id || s.name.toLowerCase() === def.name.toLowerCase());
        return {
            ...def,
            isOwned: !!owned,
            isEquipped: owned?.id === equippedShadowId,
            // If owned, use owned data (for specific bonus values if dynamic), else use default
            bonus: owned?.bonus || { stat: def.bonusStat, value: 0 }
        };
    });

    const unlockedShadows = allShadows.filter(s => s.isOwned);
    const lockedShadows = allShadows.filter(s => !s.isOwned);

    return (
        <div className="pb-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Army Header / Stats */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-950 border border-purple-900/30 p-6">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=2664&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />

                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-3">
                                <Ghost className="text-purple-500" size={32} />
                                {t('shadows_title', language)}
                            </h2>
                            <p className="text-purple-400 font-mono text-sm mt-1">
                                GRAND MARSHAL'S ARMY
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-white">{totalShadows}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Soldiers</div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3 flex flex-col items-center justify-center">
                            <Swords size={20} className="text-purple-400 mb-1" />
                            <span className="text-xl font-bold text-white">{totalPower.toLocaleString()}</span>
                            <span className="text-[10px] text-purple-300/60 uppercase">Army Power</span>
                        </div>
                        <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3 flex flex-col items-center justify-center">
                            <Crown size={20} className="text-blue-400 mb-1" />
                            <span className="text-xl font-bold text-white">{activeShadow ? activeShadow.rank : '-'}</span>
                            <span className="text-[10px] text-blue-300/60 uppercase">Active Rank</span>
                        </div>
                        <div className="bg-amber-900/20 border border-amber-500/20 rounded-lg p-3 flex flex-col items-center justify-center">
                            <Zap size={20} className="text-amber-400 mb-1" />
                            <span className="text-xl font-bold text-white">{activeShadow ? `+${activeShadow.bonus.value}` : '-'}</span>
                            <span className="text-[10px] text-amber-300/60 uppercase">Active Bonus</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Unlocked Shadows */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    Summoned Soldiers ({unlockedShadows.length})
                </h3>

                {unlockedShadows.length === 0 ? (
                    <Card className="p-8 flex flex-col items-center justify-center text-center border-dashed border-slate-800 bg-slate-900/20">
                        <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4">
                            <Ghost size={32} className="text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-400">{t('shadows_no_shadows_title', language)}</h3>
                        <p className="text-xs text-slate-500 mt-2 max-w-[200px]">
                            {t('shadows_no_shadows_desc', language)}
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {unlockedShadows.map(shadow => (
                            <motion.div
                                key={shadow.id}
                                layoutId={shadow.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <ShadowCard
                                    shadow={{
                                        id: shadow.id,
                                        name: shadow.name,
                                        rank: shadow.rank,
                                        image: '', // Handled by card
                                        bonus: shadow.bonus,
                                        isEquipped: shadow.isEquipped,
                                        extractedAt: new Date().toISOString() // Mock for view
                                    }}
                                    onEquip={onEquipShadow}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Locked Shadows */}
            {lockedShadows.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-800/50">
                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest px-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-700" />
                        Locked Shadows ({lockedShadows.length})
                    </h3>

                    <div className="grid grid-cols-2 gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {lockedShadows.map(shadow => (
                            <div key={shadow.id} className="relative group">
                                <ShadowCard
                                    shadow={{
                                        id: shadow.id,
                                        name: shadow.name,
                                        rank: shadow.rank,
                                        image: '',
                                        bonus: { stat: shadow.bonusStat, value: 0 },
                                        isEquipped: false,
                                        extractedAt: ''
                                    }}
                                    onEquip={() => { }} // No action for locked
                                />
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl border border-slate-800 group-hover:bg-black/40 transition-all">
                                    <div className="flex flex-col items-center gap-2">
                                        <ShieldAlert className="text-slate-500" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Locked</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
