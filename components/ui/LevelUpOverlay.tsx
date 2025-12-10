import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';

export const LevelUpOverlay: React.FC<{ show: boolean; level: number }> = ({ show, level }) => {
    const { state } = useStore();

    useEffect(() => {
        if (show && state.settings.sfxEnabled) {
            const audio = new Audio('/audio/levelup.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => { });
        }
    }, [show, state.settings.sfxEnabled]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md"
                >
                    {/* Light Rays */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30"
                    >
                        <div className="w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(59,130,246,0.2)_20deg,transparent_40deg,rgba(59,130,246,0.2)_60deg,transparent_80deg,rgba(59,130,246,0.2)_100deg,transparent_120deg)]"></div>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="relative"
                    >
                        <div className="relative bg-[#050a14] border-2 border-blue-500 p-12 rounded-xl shadow-[0_0_100px_rgba(37,99,235,0.6)] text-center min-w-[320px] overflow-hidden">
                            {/* Energy Pop */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0.5 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 bg-blue-400 rounded-full"
                            />

                            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-400 shadow-[0_0_15px_#60a5fa]"></div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-400 shadow-[0_0_15px_#60a5fa]"></div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-400 shadow-[0_0_15px_#60a5fa]"></div>
                            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-400 shadow-[0_0_15px_#60a5fa]"></div>

                            <motion.h2
                                animate={{ x: [-2, 2, -2, 0], opacity: [1, 0.8, 1] }}
                                transition={{ duration: 0.2, repeat: 5, repeatDelay: 3 }}
                                className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-400 mb-4 tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                            >
                                LEVEL UP
                            </motion.h2>

                            <div className="my-8 h-0.5 bg-blue-900/50 w-full relative overflow-hidden">
                                <motion.div
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="absolute inset-0 bg-blue-400 shadow-[0_0_10px_#60a5fa] w-1/2"
                                />
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <span className="text-blue-300 font-bold uppercase tracking-[0.3em] text-xs">Current Level</span>
                                <motion.span
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.5, 1], color: ['#3b82f6', '#fff', '#3b82f6'] }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-7xl font-black text-blue-500 font-mono drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]"
                                >
                                    {level}
                                </motion.span>
                            </div>

                            <div className="mt-10 grid grid-cols-2 gap-6 text-xs font-bold font-mono uppercase">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-blue-300 bg-blue-900/20 py-2 rounded border border-blue-500/30"
                                >
                                    + All Stats Up
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-green-400 bg-green-900/20 py-2 rounded border border-green-500/30"
                                >
                                    HP Restored
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
