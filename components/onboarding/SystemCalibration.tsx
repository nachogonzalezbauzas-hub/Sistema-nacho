import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Target, Zap, ChevronRight, Check } from 'lucide-react';
import { useStore } from '@/store/index';

export const SystemCalibration: React.FC = () => {
    const { state, completeOnboarding } = useStore();
    const [step, setStep] = useState(0);
    const [name, setName] = useState('Sung Jin-Woo');
    const [objective, setObjective] = useState('');
    const [focusStat, setFocusStat] = useState('Strength');

    if (state.onboardingCompleted) return null;

    const directives = [
        { id: 'LIMIT_BREAKER', label: 'LIMIT BREAKER', desc: 'To surpass all human limits through absolute perseverance.' },
        { id: 'SHADOW_MONARCH', label: 'SHADOW MONARCH', desc: 'To rule from the eternal darkness and command the fallen.' },
        { id: 'WORLD_PROTECTOR', label: 'WORLD PROTECTOR', desc: 'To stand as the final shield against the encroaching gates.' },
        { id: 'SYSTEM_ARCHITECT', label: 'SYSTEM ARCHITECT', desc: 'To master the hidden mechanics of this fabricated reality.' }
    ];

    const stats_options = [
        { id: 'Strength', label: 'PHYSICAL PROWESS', desc: 'Raw destructive power.' },
        { id: 'Vitality', label: 'ESSENCE VITALITY', desc: 'Indomitable life force.' },
        { id: 'Agility', label: 'PHANTOM REFLEX', desc: 'Unreachable speed.' },
        { id: 'Intelligence', label: 'VOID COGNITION', desc: 'Arcane mental depth.' },
        { id: 'Fortune', label: 'CAUSALITY LUCK', desc: 'Probability manipulation.' },
        { id: 'Metabolism', label: 'CELLULAR REGEN', desc: 'Biological optimization.' }
    ];

    const handleFinish = () => {
        // Synchronize with ProfileView's localStorage name
        const currentProfile = JSON.parse(localStorage.getItem('hunterProfile') || '{"name":"Sung Jin-Woo", "avatar":"default"}');
        localStorage.setItem('hunterProfile', JSON.stringify({ ...currentProfile, name: name }));

        completeOnboarding({
            mainGoal: objective,
            focusStat: focusStat
        });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 sm:p-12 overflow-hidden">
                {/* Background "Mana" Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [-20, 1000],
                                x: Math.random() * 100 - 50,
                                opacity: [0, 0.5, 0]
                            }}
                            transition={{
                                duration: 5 + Math.random() * 5,
                                repeat: Infinity,
                                ease: "linear",
                                delay: Math.random() * 5
                            }}
                            className="absolute w-px h-20 bg-gradient-to-b from-blue-500 to-transparent"
                            style={{ left: `${Math.random() * 100}%`, top: '-10%' }}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-full max-w-xl bg-slate-900/50 border border-blue-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.2)] overflow-hidden"
                >
                    {/* Header HUD */}
                    <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-blue-400" />
                            <motion.span
                                animate={{
                                    opacity: [1, 0.8, 1, 0.9, 1],
                                    x: [0, -1, 1, -0.5, 0]
                                }}
                                transition={{
                                    duration: 0.2,
                                    repeat: Infinity,
                                    repeatDelay: 3
                                }}
                                className="text-xs font-black tracking-[0.3em] text-blue-100 uppercase"
                            >
                                System Calibration
                            </motion.span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">AUTH: LV{state.stats.level}</div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Welcome, <span className="text-blue-500">Hunter</span></h2>
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium">The System has awakened. To synchronize with your physical form, we must calibrate your parameters.</p>
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                        <p className="text-[10px] text-blue-300 font-mono flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                            INITIALIZING_CORE_RESONANCE_V2.8
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
                                >
                                    START CALIBRATION
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-xs font-black text-blue-400 uppercase tracking-widest">Primary Directive</label>
                                        <span className="text-[9px] font-mono text-slate-500">SELECT_PATH</span>
                                    </div>

                                    <div className="space-y-3">
                                        {directives.map(d => (
                                            <button
                                                key={d.id}
                                                onClick={() => setObjective(`[${d.id}] ${d.label}`)}
                                                className={`w-full p-4 rounded-xl border text-left transition-all group ${objective.includes(d.id)
                                                    ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                                    : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'}`}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-sm font-black tracking-wider ${objective.includes(d.id) ? 'text-blue-400' : 'text-slate-300'}`}>
                                                        {d.label}
                                                    </span>
                                                    {objective.includes(d.id) && <Check className="w-4 h-4 text-blue-400" />}
                                                </div>
                                                <p className="text-[10px] text-slate-500 leading-relaxed font-medium group-hover:text-slate-400 transition-colors">
                                                    {d.desc}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    disabled={!objective}
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    NEXT PARAMETER
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-xs font-black text-blue-400 uppercase tracking-widest">Mana Resonance</label>
                                        <span className="text-[9px] font-mono text-slate-500">SYNC_ESSENCE</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {stats_options.map(stat => (
                                            <button
                                                key={stat.id}
                                                onClick={() => setFocusStat(stat.id)}
                                                className={`p-4 rounded-xl border transition-all text-left group ${focusStat === stat.id
                                                    ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                                    : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-[10px] font-black tracking-wider ${focusStat === stat.id ? 'text-blue-400' : 'text-slate-400'}`}>
                                                        {stat.label}
                                                    </span>
                                                    {focusStat === stat.id && <Check className="w-3 h-3 text-blue-400" />}
                                                </div>
                                                <p className="text-[9px] text-slate-600 font-medium group-hover:text-slate-500 transition-colors">
                                                    {stat.desc}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={handleFinish}
                                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] flex items-center justify-center gap-2"
                                >
                                    FINALIZE CALIBRATION
                                    <Sparkles className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer HUD */}
                    <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center text-[8px] font-mono text-slate-600">
                        <div>GPS_LOC: CALIBRATING...</div>
                        <div className="flex gap-2">
                            <div className={`h-1 w-8 rounded-full ${step >= 0 ? 'bg-blue-500' : 'bg-slate-800'}`} />
                            <div className={`h-1 w-8 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-slate-800'}`} />
                            <div className={`h-1 w-8 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-slate-800'}`} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
