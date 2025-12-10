import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { DungeonRunResult, BossDefinition } from '../types';
import { Card, Button } from '../components/UIComponents';
import { Skull, Trophy, ArrowRight, RefreshCw } from 'lucide-react';

interface DungeonRunResultViewProps {
    result: DungeonRunResult;
    boss: BossDefinition;
    onClose: () => void;
}

export const DungeonRunResultView: React.FC<DungeonRunResultViewProps> = ({ result, boss, onClose }) => {

    // Play sound effect on mount (mock)
    useEffect(() => {
        // In a real app, play victory/defeat sound
    }, [result.victory]);

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">

            {/* Background Glitch Effect */}
            <div className={`absolute inset-0 opacity-20 ${result.victory ? 'bg-blue-900' : 'bg-red-900'}`}>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <div className="relative z-10 w-full max-w-md text-center space-y-8">

                {/* Result Title */}
                <motion.div
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <h1 className={`text-6xl font-black italic tracking-tighter ${result.victory ? 'text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]' : 'text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]'}`}>
                        {result.victory ? 'VICTORY' : 'DEFEATED'}
                    </h1>
                    <p className="text-xs font-mono uppercase tracking-[0.5em] text-white/50 mt-2">
                        {result.victory ? 'Dungeon Cleared' : 'System Failure'}
                    </p>
                </motion.div>

                {/* Boss Info */}
                <Card className="bg-black/50 border-white/10 p-6 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-4">
                        <div className={`p-4 rounded-full border-2 ${result.victory ? 'border-slate-700 grayscale opacity-50' : 'border-red-500 animate-pulse'}`}>
                            <Skull size={48} className={result.victory ? 'text-slate-500' : 'text-red-500'} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{boss.name}</h3>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Power Level: {boss.powerLevel}</p>
                        </div>
                    </div>
                </Card>

                {/* Rewards */}
                {result.victory && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-4"
                    >
                        <div className="text-sm font-bold text-blue-400 uppercase tracking-widest">Rewards Acquired</div>
                        <div className="flex flex-col gap-2">
                            <div className="p-3 rounded bg-blue-900/20 border border-blue-500/30 flex justify-between items-center">
                                <span className="text-white font-bold">Experience</span>
                                <span className="text-blue-400 font-mono">+{result.xpEarned} XP</span>
                            </div>
                            {result.rewards.map((reward, i) => (
                                <div key={i} className="p-3 rounded bg-purple-900/20 border border-purple-500/30 flex justify-between items-center">
                                    <span className="text-white font-bold">{reward}</span>
                                    <Trophy size={14} className="text-purple-400" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {!result.victory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="p-4 rounded bg-red-900/10 border border-red-500/20"
                    >
                        <p className="text-red-400 text-xs font-mono">
                            TIP: Increase your stats or try a lower difficulty dungeon.
                        </p>
                    </motion.div>
                )}

                {/* Action Button */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <Button onClick={onClose} className="w-full h-12 bg-white text-black hover:bg-slate-200 font-black tracking-widest">
                        {result.victory ? 'RETURN TO GATE' : 'RETREAT'} <ArrowRight size={16} className="ml-2" />
                    </Button>
                </motion.div>

            </div>
        </div>
    );
};
