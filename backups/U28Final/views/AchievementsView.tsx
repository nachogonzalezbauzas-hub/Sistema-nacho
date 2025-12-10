
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AppState } from '../types';
import { ACHIEVEMENTS, getUnlockedAchievements, saveUnlockedAchievement } from '../achievements';
import { TITLES } from '../titles';
import { Card } from '../components/UIComponents';
import { Trophy, Lock, Crown } from 'lucide-react';

interface AchievementsViewProps {
  state: AppState;
  onEquipTitle: (id: string | null) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ state, onEquipTitle }) => {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'General' | 'Titles'>('General');

  useEffect(() => {
    // Load initially unlocked
    const currentUnlocked = getUnlockedAchievements();
    setUnlockedIds(currentUnlocked);

    // Check for new unlocks
    ACHIEVEMENTS.forEach(ach => {
      if (!currentUnlocked.includes(ach.id) && ach.condition(state)) {
        saveUnlockedAchievement(ach.id);
        setUnlockedIds(prev => [...prev, ach.id]);
      }
    });
  }, [state]);

  return (
    <div className="pb-24 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end px-1 border-b border-blue-900/30 pb-2 mb-4 justify-between">
        <div>
          <h2 className="text-2xl font-black text-white italic tracking-tighter drop-shadow-md flex items-center gap-2">
            RECORDS <Trophy className="text-yellow-500" size={24} />
          </h2>
          <p className="text-xs text-blue-400/80 font-mono uppercase tracking-widest mt-1">
            System Milestones
          </p>
        </div>
      </div>

      <div className="flex p-1 bg-slate-900/50 rounded-lg border border-slate-800 mb-4">
        <button
          onClick={() => setActiveTab('General')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'General' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-blue-400'}`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab('Titles')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'Titles' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-blue-400'}`}
        >
          Titles
        </button>
      </div>

      {activeTab === 'General' ? (
        <div className="grid grid-cols-1 gap-4">
          {ACHIEVEMENTS.map((ach, index) => {
            const isUnlocked = unlockedIds.includes(ach.id);

            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`
                    relative overflow-hidden group transition-all duration-500
                    ${isUnlocked
                      ? 'bg-blue-950/40 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.15)]'
                      : 'bg-slate-900/40 border-slate-800 grayscale opacity-70'
                    }
                  `}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`
                      w-16 h-16 rounded-lg flex items-center justify-center text-3xl shrink-0
                      ${isUnlocked
                        ? 'bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-400/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse-fast'
                        : 'bg-slate-800 border border-slate-700'
                      }
                    `}>
                      {isUnlocked ? ach.icon : <Lock size={24} className="text-slate-500" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-bold text-lg uppercase tracking-wide ${isUnlocked ? 'text-white drop-shadow-sm' : 'text-slate-500'}`}>
                          {ach.title}
                        </h3>
                        {isUnlocked && (
                          <span className="text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(34,197,94,0.3)] animate-in zoom-in duration-300">
                            CLAIMED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-1 leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                  {/* Scanline effect for unlocked */}
                  {isUnlocked && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent opacity-30 pointer-events-none animate-scanline" />
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {TITLES.map((title, index) => {
            const isUnlocked = state.stats.unlockedTitleIds.includes(title.id);
            return (
              <motion.div
                key={title.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className={`
                  relative p-3 rounded-lg border flex flex-col items-center text-center transition-all duration-300
                  ${isUnlocked
                    ? 'bg-purple-950/20 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                    : 'bg-slate-900/50 border-slate-800 opacity-40'
                  }
                `}
              >
                <div className={`text-2xl mb-2 ${isUnlocked ? 'animate-bounce' : ''}`}>{isUnlocked ? title.icon : '🔒'}</div>
                <h4 className={`text-xs font-bold uppercase tracking-wide mb-1 ${isUnlocked ? 'text-purple-200' : 'text-slate-600'}`}>
                  {title.name}
                </h4>
                <p className="text-[9px] text-slate-400 font-mono leading-tight mb-2 h-8 overflow-hidden">
                  {title.description}
                </p>
                {isUnlocked && (
                  <span className="text-[9px] font-bold text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded border border-purple-500/30">
                    OWNED
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
