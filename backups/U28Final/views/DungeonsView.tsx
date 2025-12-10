
import React from 'react';
import { motion } from 'framer-motion';
import { DUNGEONS } from '../dungeons/dungeonDefinitions';
import { Card, StatIcon } from '../components/UIComponents';
import { Skull, Clock, Lock, Swords } from 'lucide-react';
import { AppState } from '../types';

interface DungeonsViewProps {
    state: AppState;
    onSelectDungeon: (dungeonId: string) => void;
}

export const DungeonsView: React.FC<DungeonsViewProps> = ({ state, onSelectDungeon }) => {
    const getDungeonStatus = (dungeonId: string) => {
        // Simple logic for now: All unlocked, check if completed today
        const today = new Date().toDateString();
        const runsToday = (state.dungeonRuns || []).filter(r =>
            r.dungeonId === dungeonId &&
            new Date(r.timestamp).toDateString() === today &&
            r.victory
        );

        return runsToday.length > 0 ? 'Completed' : 'Available';
    };

    return (
        <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-3 px-1 border-b border-purple-900/30 pb-2 mb-4">
                <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/30">
                    <Skull className="text-purple-400" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter drop-shadow-md">
                        DUNGEONS
                    </h2>
                    <p className="text-xs text-purple-400/80 font-mono uppercase tracking-widest mt-0.5">
                        Conquer the Shadows
                    </p>
                </div>
            </div>

            {/* Dungeon List */}
            <div className="space-y-4">
                {DUNGEONS.map((dungeon, idx) => {
                    const status = getDungeonStatus(dungeon.id);
                    const isCompleted = status === 'Completed';

                    return (
                        <motion.div
                            key={dungeon.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card
                                onClick={() => onSelectDungeon(dungeon.id)}
                                className={`
                relative overflow-hidden group cursor-pointer border transition-all duration-300
                ${isCompleted
                                        ? 'bg-slate-900/50 border-slate-800 opacity-70 grayscale'
                                        : 'bg-slate-900/80 border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                                    }
`}>
                                {/* Background Aura */}
                                {!isCompleted && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                )}

                                <div className="relative z-10 p-4 flex justify-between items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${dungeon.dungeonType === 'Daily' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' :
                                                dungeon.dungeonType === 'Weekly' ? 'bg-orange-900/30 text-orange-400 border-orange-500/30' :
                                                    'bg-red-900/30 text-red-400 border-red-500/30'
                                                } `}>
                                                {dungeon.dungeonType.toUpperCase()}
                                            </span>
                                            {isCompleted && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-500">
                                                    <Lock size={10} /> CLEARED
                                                </span>
                                            )}
                                        </div>

                                        <h3 className={`text-lg font-bold ${isCompleted ? 'text-slate-500' : 'text-white group-hover:text-purple-300'} transition-colors`}>
                                            {dungeon.name}
                                        </h3>

                                        <div className="flex items-center gap-1 mt-2">
                                            {dungeon.recommendedStats.map(stat => (
                                                <div key={stat} className="scale-75 origin-left">
                                                    <StatIcon stat={stat} size={16} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className={`w-1.5 h-4 rounded-sm ${i < dungeon.difficulty ? 'bg-purple-500' : 'bg-slate-800'} `} />
                                            ))}
                                        </div>

                                        <div className={`
w-10 h-10 rounded-full flex items-center justify-center border transition-all
                      ${isCompleted
                                                ? 'bg-slate-800 border-slate-700 text-slate-600'
                                                : 'bg-purple-600/20 border-purple-500 text-purple-400 group-hover:bg-purple-500 group-hover:text-white'
                                            }
`}>
                                            <Swords size={18} />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
