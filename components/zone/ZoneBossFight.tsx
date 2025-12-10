import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Heart, Zap, Skull, Trophy, X } from 'lucide-react';
import { getZoneInfo } from '@/data/zoneSystem';
import { useStore } from '@/store/index';

interface ZoneBossFightProps {
    zoneId: number;
    onComplete: (victory: boolean) => void;
    onFlee: () => void;
}

export const ZoneBossFight: React.FC<ZoneBossFightProps> = ({
    zoneId,
    onComplete,
    onFlee
}) => {
    const { getTotalPower } = useStore();
    const zoneInfo = getZoneInfo(zoneId);
    const visuals = zoneInfo.visuals;
    const playerPower = getTotalPower();

    // Fight state
    const [phase, setPhase] = useState<'intro' | 'fighting' | 'result'>('intro');
    const [playerHP, setPlayerHP] = useState(100);
    const [bossHP, setBossHP] = useState(100);
    const [battleLog, setBattleLog] = useState<string[]>([]);
    const [result, setResult] = useState<'victory' | 'defeat' | null>(null);

    // Calculate damage based on power difference
    // Ensure boss is always challenging but beatable if power requirement is met
    const powerRatio = playerPower / Math.max(1, zoneInfo.bossPower);
    const playerDamageBase = Math.max(5, Math.floor(powerRatio * 15));
    const bossDamageBase = Math.max(3, Math.floor((1 / powerRatio) * 10));

    // Start fight after intro
    useEffect(() => {
        if (phase === 'intro') {
            const timer = setTimeout(() => setPhase('fighting'), 3000);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    // Auto-battle simulation
    useEffect(() => {
        if (phase !== 'fighting') return;

        const interval = setInterval(() => {
            // Player attacks
            const pDmg = playerDamageBase + Math.floor(Math.random() * 10);
            setBossHP(prev => {
                const newHP = Math.max(0, prev - (pDmg / 5)); // Scale damage to HP percentage roughly
                if (newHP <= 0) {
                    setResult('victory');
                    setPhase('result');
                }
                return newHP;
            });
            setBattleLog(prev => [...prev.slice(-4), `You hit ${zoneInfo.bossName} for ${pDmg} damage!`]);

            if (bossHP <= 0) return;

            // Boss attacks
            const bDmg = bossDamageBase + Math.floor(Math.random() * 8);
            setPlayerHP(prev => {
                const newHP = Math.max(0, prev - (bDmg / 5));
                if (newHP <= 0) {
                    setResult('defeat');
                    setPhase('result');
                }
                return newHP;
            });
            setBattleLog(prev => [...prev.slice(-4), `${zoneInfo.bossName} hits you for ${bDmg} damage!`]);

        }, 1000);

        return () => clearInterval(interval);
    }, [phase, bossHP, playerHP, playerDamageBase, bossDamageBase, zoneInfo.bossName]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md">
            {/* Background Visuals */}
            <div
                className="absolute inset-0 opacity-20"
                style={{ background: visuals.backgroundColor }}
            />
            <div className={`absolute inset-0 opacity-10 ${visuals.overlayStyle}`} />

            <div className="relative z-10 w-full max-w-4xl p-4">
                <AnimatePresence mode="wait">
                    {phase === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.2 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl text-slate-400 uppercase tracking-widest mb-4">Boss Encounter</h2>
                            <h1 className="text-6xl font-black text-white mb-8" style={{ textShadow: `0 0 30px ${visuals.primaryColor}` }}>
                                {zoneInfo.bossName}
                            </h1>
                            <div className="w-32 h-1 bg-white/20 mx-auto rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3 }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {phase === 'fighting' && (
                        <motion.div
                            key="fighting"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                        >
                            {/* Player Stats */}
                            <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/50">
                                        <Sword size={24} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">You</h3>
                                        <p className="text-xs text-blue-400 font-mono">Power: {playerPower.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                    <motion.div
                                        className="h-full bg-blue-500"
                                        animate={{ width: `${playerHP}%` }}
                                    />
                                </div>
                                <p className="text-right text-xs text-slate-400 mt-1">{Math.ceil(playerHP)}% HP</p>
                            </div>

                            {/* Boss Stats */}
                            <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10" style={{ backgroundColor: visuals.primaryColor }} />
                                <div className="flex items-center gap-4 mb-4 justify-end text-right">
                                    <div>
                                        <h3 className="font-bold text-white text-lg" style={{ color: visuals.textColor }}>{zoneInfo.bossName}</h3>
                                        <p className="text-xs font-mono opacity-70" style={{ color: visuals.primaryColor }}>Power: {zoneInfo.bossPower.toLocaleString()}</p>
                                    </div>
                                    <div className="p-3 rounded-lg border" style={{ backgroundColor: `${visuals.primaryColor}20`, borderColor: visuals.primaryColor }}>
                                        <Skull size={24} style={{ color: visuals.primaryColor }} />
                                    </div>
                                </div>
                                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                    <motion.div
                                        className="h-full"
                                        style={{ backgroundColor: visuals.primaryColor }}
                                        animate={{ width: `${bossHP}%` }}
                                    />
                                </div>
                                <p className="text-left text-xs text-slate-400 mt-1">{Math.ceil(bossHP)}% HP</p>
                            </div>

                            {/* Battle Log */}
                            <div className="md:col-span-2 bg-black/40 rounded-xl p-4 h-32 overflow-hidden flex flex-col justify-end border border-white/5">
                                {battleLog.map((log, i) => (
                                    <motion.p
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-sm font-mono text-slate-300 mb-1"
                                    >
                                        {log}
                                    </motion.p>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {phase === 'result' && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center max-w-md mx-auto bg-slate-900/90 border border-slate-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
                        >
                            {result === 'victory' ? (
                                <>
                                    <div className="absolute inset-0 bg-yellow-500/10 animate-pulse" />
                                    <Trophy size={64} className="text-yellow-400 mx-auto mb-6" />
                                    <h2 className="text-4xl font-black text-white uppercase mb-2">Victory!</h2>
                                    <p className="text-slate-400 mb-8">You have defeated the {zoneInfo.bossName}!</p>
                                    <button
                                        onClick={() => onComplete(true)}
                                        className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl uppercase tracking-widest transition-colors relative z-10"
                                    >
                                        Claim Rewards
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
                                    <Skull size={64} className="text-red-500 mx-auto mb-6" />
                                    <h2 className="text-4xl font-black text-white uppercase mb-2">Defeat</h2>
                                    <p className="text-slate-400 mb-8">You were overwhelmed by the {zoneInfo.bossName}...</p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => onComplete(false)}
                                            className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl uppercase tracking-widest transition-colors relative z-10"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
