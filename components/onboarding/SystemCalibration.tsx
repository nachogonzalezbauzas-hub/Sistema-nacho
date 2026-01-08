import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Target, Zap, ChevronRight, Check } from 'lucide-react';
import { useStore } from '@/store/index';

export const SystemCalibration: React.FC = () => {
    const { state, completeOnboarding } = useStore();
    const [step, setStep] = useState(0);
    const [name, setName] = useState('Sung Jin-Woo');
    const [weight, setWeight] = useState(70);
    const [sleepHours, setSleepHours] = useState(8);
    const [objective, setObjective] = useState('');
    const [focusStat, setFocusStat] = useState('Strength');
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState<string | null>(null);

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

    const handleStartEvaluation = () => {
        setStep(5);
        setIsEvaluating(true);

        // Multi-stage roulette logic
        const ranks = ['S', 'A', 'B', 'C', 'D', 'E'];
        let count = 0;
        const totalDuration = 3000;
        const interval = 100;

        const timer = setInterval(() => {
            setEvaluationResult(ranks[count % ranks.length]);
            count++;
        }, interval);

        setTimeout(() => {
            clearInterval(timer);
            setEvaluationResult('E');
            setIsEvaluating(false);
        }, totalDuration);
    };

    const handleFinish = () => {
        completeOnboarding({
            name,
            mainGoal: objective,
            focusStat,
            weight,
            sleepHours
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
                                            INITIALIZING_CORE_RESONANCE_V2.9
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
                                    <label className="text-xs font-black text-blue-400 uppercase tracking-widest">Hunter Identity</label>
                                    <div className="space-y-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your name..."
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:border-blue-500/50 transition-colors"
                                        />
                                        <p className="text-[10px] text-slate-500 italic">This will be your official identifier in the Hunter Association.</p>
                                    </div>
                                </div>
                                <button
                                    disabled={!name}
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    PROCEED TO VITALS
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
                                    <label className="text-xs font-black text-blue-400 uppercase tracking-widest">Physical Diagnostics</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <span className="text-[9px] text-slate-500 font-bold uppercase">Weight (KG)</span>
                                            <input
                                                type="number"
                                                value={weight}
                                                onChange={(e) => setWeight(Number(e.target.value))}
                                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-4 text-white font-mono focus:outline-none focus:border-blue-500/50 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[9px] text-slate-500 font-bold uppercase">Sleep (HOURS)</span>
                                            <input
                                                type="number"
                                                value={sleepHours}
                                                onChange={(e) => setSleepHours(Number(e.target.value))}
                                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-4 text-white font-mono focus:outline-none focus:border-blue-500/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setStep(3)}
                                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    PROCEED TO RESONANCE
                                </button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
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
                                    onClick={() => setStep(4)}
                                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    NEXT PARAMETER
                                </button>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
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
                                    onClick={handleStartEvaluation}
                                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] flex items-center justify-center gap-2"
                                >
                                    EVALUATE RANK
                                    <Sparkles className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center justify-center space-y-8 py-10"
                            >
                                <div className="text-center space-y-2">
                                    <h3 className="text-blue-400 text-xs font-black tracking-[0.5em] uppercase">Hunter Rank Evaluation</h3>
                                    <p className="text-slate-500 text-[10px] font-mono">SCANNING_MANA_RESONANCE...</p>
                                </div>

                                <motion.div
                                    className="relative w-40 h-40 flex items-center justify-center rounded-full border-4 border-blue-500/20"
                                    animate={isEvaluating ? { rotate: 360 } : { rotate: 0 }}
                                    transition={isEvaluating ? { duration: 0.5, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
                                >
                                    <div className="absolute inset-4 rounded-full border border-blue-500/10 animate-pulse" />
                                    <span className={`text-8xl font-black ${isEvaluating ? 'text-blue-500/50 italic' : 'text-white shadow-[0_0_30px_rgba(255,255,255,0.2)]'}`}>
                                        {evaluationResult || '?'}
                                    </span>
                                </motion.div>

                                {!isEvaluating && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="text-center space-y-6"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-white font-black uppercase tracking-widest">Rank E</p>
                                            <p className="text-slate-500 text-[10px]">Evaluation Complete. Minimal mana detected.</p>
                                        </div>
                                        <button
                                            onClick={handleFinish}
                                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-lg text-sm"
                                        >
                                            COMPLETE INITIALIZATION
                                        </button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer HUD */}
                    <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center text-[8px] font-mono text-slate-600">
                        <div>GPS_LOC: CALIBRATING...</div>
                        <div className="flex gap-2 text-blue-500/30 font-bold uppercase tracking-tighter">
                            <span>Step_{step + 1}</span>
                            <div className="flex gap-1 items-center">
                                {[0, 1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`h-1 w-4 rounded-full ${step >= i ? 'bg-blue-500' : 'bg-slate-800'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
