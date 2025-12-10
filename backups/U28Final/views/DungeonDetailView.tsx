import React from 'react';
import { motion } from 'framer-motion';
import { DUNGEONS } from '../dungeons/dungeonDefinitions';
import { Card, Button, StatIcon } from '../components/UIComponents';
import { Skull, ArrowLeft, Swords, AlertTriangle } from 'lucide-react';
import { AppState } from '../types';

interface DungeonDetailViewProps {
    dungeonId: string;
    onBack: () => void;
    onEnter: () => void;
}

export const DungeonDetailView: React.FC<DungeonDetailViewProps> = ({ dungeonId, onBack, onEnter }) => {
    const dungeon = DUNGEONS.find(d => d.id === dungeonId);

    if (!dungeon) return <div>Dungeon not found</div>;

    return (
        <div className="h-full flex flex-col pb-24 animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center gap-2 p-4 border-b border-white/10">
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-slate-400" />
                </button>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Dungeon Intel</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Title Section */}
                <div className="text-center space-y-2">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-block p-4 rounded-full bg-purple-900/20 border border-purple-500/50 mb-2"
                    >
                        <Skull size={48} className="text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                        {dungeon.name}
                    </h1>
                    <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: 24 }}
                                transition={{ delay: i * 0.1 }}
                                className={`w-2 rounded-sm ${i < dungeon.difficulty ? 'bg-purple-500 shadow-[0_0_10px_#a855f7]' : 'bg-slate-800'}`}
                            />
                        ))}
                    </div>
                    <p className="text-purple-400 font-bold uppercase tracking-widest text-xs">Difficulty Level {dungeon.difficulty}</p>
                </div>

                {/* Description */}
                <Card className="p-4 bg-slate-900/50 border-slate-800">
                    <p className="text-slate-300 text-sm leading-relaxed italic text-center">
                        "{dungeon.description}"
                    </p>
                </Card>

                {/* Recommended Stats */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">Recommended Stats</h3>
                    <div className="flex justify-center gap-4">
                        {dungeon.recommendedStats.map((stat, i) => (
                            <motion.div
                                key={stat}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                                    <StatIcon stat={stat} size={24} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{stat}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Rewards Preview */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">Potential Rewards</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                        <div className="px-3 py-1.5 rounded bg-blue-900/20 border border-blue-500/30 text-blue-400 text-xs font-bold">
                            {dungeon.baseRewards.xp} XP
                        </div>
                        {dungeon.baseRewards.buffId && (
                            <div className="px-3 py-1.5 rounded bg-orange-900/20 border border-orange-500/30 text-orange-400 text-xs font-bold">
                                Rare Buff
                            </div>
                        )}
                        {dungeon.baseRewards.titleId && (
                            <div className="px-3 py-1.5 rounded bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
                                Exclusive Title
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-slate-950/80 backdrop-blur-md border-t border-white/10">
                <Button
                    onClick={onEnter}
                    className="w-full h-14 text-lg font-black tracking-widest bg-purple-600 hover:bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-pulse-slow"
                >
                    <Swords className="mr-2" /> ENTER DUNGEON
                </Button>
                <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-slate-500 uppercase font-bold">
                    <AlertTriangle size={10} />
                    <span>Warning: High chance of injury</span>
                </div>
            </div>
        </div>
    );
};
