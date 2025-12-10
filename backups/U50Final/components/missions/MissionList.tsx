import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mission } from '@/types';
import { MissionItem } from './MissionItem';
import { Plus, Sword } from 'lucide-react';
import { t } from '@/data/translations';

interface MissionListProps {
    sortedMissions: Mission[];
    onCompleteMission: (mission: Mission) => void;
    onOpenModal: () => void;
    language: 'en' | 'es';
}

export const MissionList: React.FC<MissionListProps> = ({ sortedMissions, onCompleteMission, onOpenModal, language }) => {
    return (
        <motion.div layout className="space-y-3">
            {/* New Static Create Button */}
            <button
                onClick={onOpenModal}
                className="w-full py-4 rounded-xl border border-blue-500 bg-gradient-to-r from-blue-600/40 to-blue-500/40 hover:from-blue-600/60 hover:to-blue-500/60 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all group shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] hover:scale-[1.02]"
            >
                <div className="p-1.5 rounded-lg bg-blue-500 text-white shadow-lg group-hover:scale-110 transition-transform border border-blue-300">
                    <Plus size={16} strokeWidth={3} />
                </div>
                <span className="drop-shadow-lg">{t('missions_create_new', language)}</span>
            </button>

            <AnimatePresence mode="popLayout">
                {sortedMissions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12 opacity-50"
                    >
                        <Sword size={48} className="mx-auto mb-4 text-slate-700" />
                        <p className="text-slate-500 font-mono text-xs">{t('missions_no_missions', language)}</p>
                    </motion.div>
                ) : (
                    sortedMissions.map(mission => (
                        <MissionItem
                            key={mission.id}
                            mission={mission}
                            onComplete={() => onCompleteMission(mission)}
                        />
                    ))
                )}
            </AnimatePresence>
        </motion.div>
    );
};
