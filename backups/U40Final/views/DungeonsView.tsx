import React, { useState } from 'react';
import { useStore } from '../store/index';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Lock, Swords, AlertTriangle, Trophy, Zap, ChevronRight } from 'lucide-react';
import { AppState } from '../types';
import { calculateTotalPower } from '../store/index';
import { ALL_DUNGEONS } from '../dungeons/dungeonData';
import { t, Language } from '../data/translations';

interface DungeonsViewProps {
    state: AppState;
    onSelectDungeon: (id: string | null) => void;
    language: Language;
}

export const DungeonsView: React.FC<DungeonsViewProps> = ({ state, onSelectDungeon, language }) => {
    const { startDungeonRun } = useStore();
    const [selectedDungeonId, setSelectedDungeonId] = useState<string | null>(null);

    const userPower = calculateTotalPower(state);

    // Determine highest unlocked level (assuming sequential progression)
    const completedDungeonIds = new Set(
        (state.dungeonRuns || [])
            .filter(r => r && r.victory && r.dungeonId)
            .map(r => r.dungeonId)
    );

    const getIsLocked = (index: number) => {
        if (index === 0) return false;
        const prevDungeonId = ALL_DUNGEONS[index - 1]?.id;
        return prevDungeonId ? !completedDungeonIds.has(prevDungeonId) : false;
    };

    const selectedDungeon = ALL_DUNGEONS.find(d => d.id === selectedDungeonId);

    // Sync local selection with parent if needed, or just use local state for display
    // The prop onSelectDungeon is used to notify parent, but here we also manage local selection for the view
    const handleSelectDungeon = (id: string) => {
        setSelectedDungeonId(id);
        onSelectDungeon(id);
    };

    if (!ALL_DUNGEONS || ALL_DUNGEONS.length === 0) {
        return <div className="p-8 text-center text-red-500">ERROR: No dungeons loaded. Please restart app.</div>;
    }

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                        {t('dungeon_gate_system', language).split(' ')[0]} <span className="text-blue-500">{t('dungeon_gate_system', language).split(' ').slice(1).join(' ')}</span>
                    </h2>
                    <p className="text-gray-400 text-sm">{t('dungeon_subtitle', language)}</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/30 px-4 py-2 rounded-xl flex items-center gap-2">
                    <Zap size={16} className="text-blue-400 fill-blue-400" />
                    <span className="font-black text-xl text-blue-100">{userPower.toLocaleString()}</span>
                    <span className="text-xs text-blue-400 uppercase tracking-wider ml-1">{t('dungeon_cp', language)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Level List */}
                <div className="lg:col-span-2 space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                    {ALL_DUNGEONS.map((dungeon, index) => {
                        const isLocked = getIsLocked(index);
                        const isCompleted = completedDungeonIds.has(dungeon.id);
                        const isBoss = !!dungeon.boss;
                        const isSelected = selectedDungeonId === dungeon.id;

                        return (
                            <motion.div
                                key={dungeon.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                onClick={() => !isLocked && handleSelectDungeon(dungeon.id)}
                                className={`
                                    relative p-4 rounded-xl border transition-all cursor-pointer group
                                    ${isSelected
                                        ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                                        : isLocked
                                            ? 'bg-gray-900/40 border-gray-800 opacity-60'
                                            : 'bg-gray-900/60 border-gray-700 hover:border-gray-500 hover:bg-gray-800'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            w-12 h-12 rounded-lg flex items-center justify-center border
                                            ${isBoss
                                                ? 'bg-red-900/30 border-red-500/50 text-red-400'
                                                : 'bg-gray-800 border-gray-700 text-gray-400'
                                            }
                                        `}>
                                            {isLocked ? <Lock size={20} /> : isBoss ? <Skull size={24} /> : <Swords size={20} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${dungeon.difficulty === 'S' ? 'bg-red-500/20 border-red-500 text-red-400' :
                                                    dungeon.difficulty === 'A' ? 'bg-orange-500/20 border-orange-500 text-orange-400' :
                                                        'bg-gray-700 border-gray-600 text-gray-300'
                                                    }`}>
                                                    {dungeon.difficulty}-{t('dungeon_rank', language)}
                                                </span>
                                                <h3 className={`font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                                    {dungeon.name}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                <span>{t('dungeon_lvl', language)} {dungeon.recommendedLevel}</span>
                                                <span>•</span>
                                                <span className={userPower >= dungeon.recommendedPower ? 'text-green-400' : 'text-red-400'}>
                                                    {t('dungeon_req', language)}: {dungeon.recommendedPower.toLocaleString()} {t('dungeon_cp', language)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {isCompleted && <Trophy size={16} className="text-yellow-500" />}
                                        <ChevronRight size={20} className={`transition-transform ${isSelected ? 'rotate-90 text-blue-400' : 'text-gray-600'}`} />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Selected Dungeon Detail */}
                <div className="lg:col-span-1">
                    <AnimatePresence mode="wait">
                        {selectedDungeon ? (
                            <motion.div
                                key={selectedDungeon.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="sticky top-6 bg-gray-900/80 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm"
                            >
                                <div className="text-center mb-6">
                                    <div className="w-20 h-20 mx-auto bg-black rounded-full border-2 border-gray-700 flex items-center justify-center mb-4 shadow-lg">
                                        {selectedDungeon.boss ? <Skull size={40} className="text-red-500" /> : <Swords size={32} className="text-gray-400" />}
                                    </div>
                                    <h3 className="text-2xl font-black text-white leading-tight mb-1">{selectedDungeon.name}</h3>
                                    <p className="text-gray-400 text-sm">{selectedDungeon.description}</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-400 text-xs uppercase tracking-wider">{t('dungeon_recommended_power', language)}</span>
                                            <span className="text-white font-bold">{selectedDungeon.recommendedPower.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full ${userPower >= selectedDungeon.recommendedPower ? 'bg-green-500' : 'bg-red-500'}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, (userPower / selectedDungeon.recommendedPower) * 100)}%` }}
                                            />
                                        </div>
                                        <div className="mt-2 text-right">
                                            {userPower >= selectedDungeon.recommendedPower ? (
                                                <span className="text-green-400 text-xs font-bold flex items-center justify-end gap-1">
                                                    <Zap size={12} /> {t('dungeon_victory', language)}
                                                </span>
                                            ) : (
                                                <span className="text-red-400 text-xs font-bold flex items-center justify-end gap-1">
                                                    <AlertTriangle size={12} /> {t('dungeon_danger', language)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {selectedDungeon.boss && (
                                        <div className="bg-purple-900/10 border border-purple-500/30 p-4 rounded-xl">
                                            <p className="text-purple-400 text-xs uppercase tracking-widest mb-2">{t('dungeon_boss_reward', language)}</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-xl">👻</span>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-purple-100">{selectedDungeon.boss.shadowData?.name}</div>
                                                    <div className="text-xs text-purple-400">{t('dungeon_guaranteed_extraction', language)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        startDungeonRun(selectedDungeon.id);
                                        setSelectedDungeonId(null); // Reset selection after starting run
                                    }}
                                    disabled={userPower < selectedDungeon.recommendedPower}
                                    className={`
                                        w-full py-4 rounded-xl font-black text-lg tracking-wider transition-all
                                        ${userPower >= selectedDungeon.recommendedPower
                                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50'
                                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    {userPower >= selectedDungeon.recommendedPower ? t('dungeon_enter', language) : t('dungeon_insufficient', language)}
                                </button>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 italic">
                                {t('dungeon_select_prompt', language)}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
