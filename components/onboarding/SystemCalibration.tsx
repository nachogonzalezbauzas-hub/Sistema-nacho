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

    const stats_options = ['Strength', 'Vitality', 'Agility', 'Intelligence', 'Fortune', 'Metabolism'];

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
                            <span className="text-xs font-black tracking-[0.3em] text-blue-100 uppercase">System Calibration</span>
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
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Welcome, Hunter</h2>
                                    <p className="text-slate-400 text-sm leading-relaxed">The System has awakened. To synchronize with your physical form, we must calibrate your parameters.</p>
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
                                    <label className="text-xs font-bold text-blue-400 uppercase tracking-widest">Main Objective</label>
                                    <input
                                        autoFocus
                                        placeholder="E.g., Clear the S-Rank Gate, Run 5km..."
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                        value={objective}
                                        onChange={(e) => setObjective(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && objective && setStep(2)}
                                    />
                                    <p className="text-[10px] text-slate-500 italic">This will be your Primary Directive reflected in your Hunter License.</p>
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
                                    <label className="text-xs font-bold text-blue-400 uppercase tracking-widest">Focus Attribute</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {stats_options.map(stat => (
                                            <button
                                                key={stat}
                                                onClick={() => setFocusStat(stat)}
                                                className={`p-4 rounded-xl border transition-all text-xs font-bold flex items-center justify-between ${focusStat === stat
                                                    ? 'bg-blue-600/20 border-blue-500 text-blue-100'
                                                    : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-700'
                                                    }`}
                                            >
                                                {stat}
                                                {focusStat === stat && <Check className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-500 italic">Recommended based on your primary training focus.</p>
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
