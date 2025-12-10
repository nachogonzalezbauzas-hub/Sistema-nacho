import React from 'react';
import { useStore } from '@/store/useStore';
import { Skull, XCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DungeonFailureModal: React.FC = () => {
    const { state, closeDungeonResult } = useStore();
    const { isDungeonResultVisible, lastDungeonResult } = state;

    if (!isDungeonResultVisible || !lastDungeonResult || lastDungeonResult.victory) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                onClick={closeDungeonResult}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={e => e.stopPropagation()}
                    className="w-full max-w-sm bg-[#0f172a] border-2 border-red-900/50 rounded-2xl p-8 text-center relative overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.3)]"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500 via-transparent to-transparent" />

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-red-950/50 border-2 border-red-600 flex items-center justify-center mb-2 animate-pulse">
                            <Skull size={40} className="text-red-500" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-red-500 uppercase tracking-widest">
                                DEFEATED
                            </h2>
                            <p className="text-red-200/60 text-xs font-mono tracking-wider uppercase">
                                You are not strong enough.
                            </p>
                        </div>

                        <div className="w-full bg-red-950/30 border border-red-900/30 rounded-lg p-4 flex items-center justify-between">
                            <span className="text-xs text-red-400 font-bold uppercase">Result</span>
                            <span className="text-xs text-red-500 font-bold uppercase flex items-center gap-2">
                                <XCircle size={14} />
                                Failed
                            </span>
                        </div>

                        <button
                            onClick={closeDungeonResult}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-lg transition-colors shadow-lg shadow-red-900/20"
                        >
                            Retreat
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
