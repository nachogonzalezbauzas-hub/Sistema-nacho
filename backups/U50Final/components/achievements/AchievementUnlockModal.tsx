import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/data/achievements';
import { getRarityStyles } from '@/utils/rarityStyles';
import { iconMap } from '@/utils/iconMap';
import { Trophy, X } from 'lucide-react';
import { t } from '@/data/translations';

interface AchievementUnlockModalProps {
    newUnlocks: Achievement[];
    onClose: () => void;
    language: 'en' | 'es';
}

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({ newUnlocks, onClose, language }) => {
    return (
        <AnimatePresence>
            {newUnlocks.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-6">
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 mb-4 ring-4 ring-blue-500/10"
                            >
                                <Trophy size={32} />
                            </motion.div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                                {newUnlocks.length > 1 ? 'Achievements Unlocked!' : 'Achievement Unlocked!'}
                            </h3>
                        </div>

                        {newUnlocks.length > 3 ? (
                            <div className="text-center space-y-4">
                                <div className="text-4xl font-black text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                    +{newUnlocks.length}
                                </div>
                                <p className="text-slate-400">You've unlocked multiple achievements at once!</p>
                                <div className="grid grid-cols-4 gap-2 justify-center mt-4">
                                    {newUnlocks.slice(0, 8).map(ach => {
                                        const Icon = iconMap[ach.icon] || Trophy;
                                        const styles = getRarityStyles(ach.rarity);
                                        return (
                                            <div key={ach.id} className={`w-10 h-10 rounded flex items-center justify-center ${styles.bg} ${styles.border} border`}>
                                                <Icon size={16} className={styles.text} />
                                            </div>
                                        );
                                    })}
                                    {newUnlocks.length > 8 && (
                                        <div className="w-10 h-10 rounded flex items-center justify-center bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold">
                                            +{newUnlocks.length - 8}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {newUnlocks.map(ach => {
                                    const Icon = iconMap[ach.icon] || Trophy;
                                    const styles = getRarityStyles(ach.rarity);
                                    return (
                                        <motion.div
                                            key={ach.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className={`flex items-center gap-4 p-3 rounded-lg border ${styles.bg} ${styles.border} ${styles.glow}`}
                                        >
                                            <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${styles.text}`}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <div className={`text-xs font-bold uppercase tracking-wider ${styles.text}`}>{ach.title[language]}</div>
                                                <div className="text-[10px] text-slate-400">{ach.description[language]}</div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
                        >
                            {t('common_continue', language) || 'Continue'}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
