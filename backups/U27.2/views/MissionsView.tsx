
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mission, StatType, Milestone } from '../types';
import { Card, Button, Input, Select, Modal, TextArea, StatBadge, TemplateChip, StreakBadge, SegmentedControl, MilestoneCard } from '../components/UIComponents';
import { Plus, Sword, AlertCircle, RefreshCw, Lock, Heart, Zap, Brain, Sparkles, Flame } from 'lucide-react';
import { MISSION_TEMPLATES, MissionTemplate } from '../missionTemplates';
import { isMissionAvailableToday, useStore } from '../store';
import { AdvisorView } from './AdvisorView'; // U26 Refactor
import { AppState, DungeonRunResult, BossDefinition } from '../types';
import { DungeonsView } from './DungeonsView';
import { DungeonDetailView } from './DungeonDetailView';
import { DungeonRunResultView } from './DungeonRunResultView';

interface MissionsViewProps {
  missions: Mission[];
  milestones: Milestone[];
  state: AppState; // Added for Advisor
  onAddMission: (mission: Omit<Mission, 'id' | 'lastCompletedAt'>) => void;
  onCompleteMission: (mission: Mission) => void;
  onAddMilestone: (milestone: any) => void;
  onIncrementMilestone: (id: string) => void;
  onAddRecommendedMission: (mission: any) => void; // Added for Advisor
  startDungeonRun: (dungeonId: string) => { result: DungeonRunResult; boss: BossDefinition } | null;
}

type FilterType = 'All' | 'Daily' | 'Completed' | StatType;

const MissionItem: React.FC<{ mission: Mission; onComplete: () => void }> = ({ mission, onComplete }) => {
  const isCompletedToday = mission.lastCompletedAt &&
    new Date(mission.lastCompletedAt).toDateString() === new Date().toDateString();

  const isAvailableToday = isMissionAvailableToday(mission, new Date());

  // Can complete if: Available Today AND (Not completed today OR Not Daily)
  // Logic: If daily/recurring, can only complete once per day.
  const canComplete = isAvailableToday && (!mission.isDaily || !isCompletedToday);

  // Visual state
  const isDimmed = !isAvailableToday;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative group transition-all duration-300 
      ${!canComplete ? 'opacity-50 grayscale-[0.5] scale-[0.98]' : 'hover:scale-[1.01]'}
      ${isDimmed ? 'opacity-30' : ''}
    `}>

      {/* Dynamic Glow U8 */}
      {canComplete && (
        <div className={`absolute inset-0 blur-xl rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500
          ${mission.targetStat === 'Strength' ? 'bg-cyan-500/20' : ''}
          ${mission.targetStat === 'Vitality' ? 'bg-red-500/20' : ''}
          ${mission.targetStat === 'Agility' ? 'bg-yellow-500/20' : ''}
          ${mission.targetStat === 'Intelligence' ? 'bg-purple-500/20' : ''}
          ${mission.targetStat === 'Fortune' ? 'bg-green-500/20' : ''}
          ${mission.targetStat === 'Metabolism' ? 'bg-blue-500/20' : ''}
        `}></div>
      )}

      <div className={`
        relative overflow-hidden rounded-2xl border transition-all duration-300
        ${isCompletedToday
          ? 'bg-slate-900/40 border-slate-800'
          : 'bg-[#0a0f1e]/90 border-slate-800 hover:border-blue-500/30'
        }
      `}>
        {canComplete && <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>}

        <div className="p-5 flex justify-between items-center gap-4 relative z-10">
          <div className="flex-1 min-w-0">
            {/* Header: Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {(mission.isDaily || mission.frequency === 'daily' || mission.frequency === 'weekly') && (
                <span className={`
                  flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider
                  ${isCompletedToday
                    ? 'bg-slate-800 text-slate-500 border-slate-700'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }
                `}>
                  <RefreshCw size={10} className={canComplete ? "animate-spin-slow" : ""} />
                  {mission.frequency === 'weekly' ? 'WEEKLY' : 'DAILY'}
                </span>
              )}
              {!isAvailableToday && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-md border bg-slate-800 text-slate-500 border-slate-700 uppercase tracking-wider">
                  LOCKED
                </span>
              )}
              <StatBadge stat={mission.targetStat} />
            </div>

            {/* Content */}
            <div className="mb-4">
              <h3 className={`
                text-lg font-bold mb-1.5 transition-colors duration-300 truncate
                ${isCompletedToday
                  ? 'text-slate-500 line-through decoration-slate-600'
                  : 'text-slate-100 group-hover:text-blue-400'
                }
              `}>
                {mission.title}
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 font-medium">
                {mission.detail}
              </p>
            </div>

            {/* Footer: Streak & Reward */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <StreakBadge value={mission.streak || 0} />
              </div>

              <div className={`
                px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all duration-300
                ${isCompletedToday
                  ? 'bg-slate-900 border-slate-800 opacity-50'
                  : 'bg-blue-500/5 border-blue-500/20 group-hover:bg-blue-500/10 group-hover:border-blue-500/30'
                }
              `}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Reward</span>
                <span className={`text-xs font-bold font-mono ${isCompletedToday ? 'text-slate-500' : 'text-blue-300'}`}>
                  +{mission.xpReward} XP
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0 self-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              disabled={!canComplete}
              className={`
                relative flex items-center justify-center w-14 h-14 rounded-xl border transition-all duration-300
                ${!canComplete
                  ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20 hover:scale-105 hover:bg-blue-500 active:scale-95'
                }
              `}
            >
              {isCompletedToday ? (
                <div className="flex flex-col items-center">
                  <Lock size={18} />
                </div>
              ) : !isAvailableToday ? (
                <div className="flex flex-col items-center opacity-50">
                  <Lock size={18} />
                </div>
              ) : (
                <Sword size={24} className="drop-shadow-md" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const MissionsView: React.FC<MissionsViewProps> = ({
  state,
  addMission,
  completeMission,
  onAddRecommendedMission,
  startDungeonRun
}) => {
  const { incrementMilestonePhase } = useStore();
  const [activeTab, setActiveTab] = useState<'Normal' | 'Epic' | 'Advisor' | 'Dungeons'>('Normal'); // U27 Added Dungeons
  const [filter, setFilter] = useState<FilterType>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // U27 Dungeon State
  const [selectedDungeonId, setSelectedDungeonId] = useState<string | null>(null);
  const [dungeonResult, setDungeonResult] = useState<{ result: DungeonRunResult; boss: BossDefinition } | null>(null);

  // New Mission Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newStat, setNewStat] = useState<StatType>('Strength');
  const [newXp, setNewXp] = useState(10);
  const [newIsDaily, setNewIsDaily] = useState(false);

  const handleAddMission = () => {
    if (!newTitle) return;
    addMission({
      title: newTitle,
      detail: newDetail,
      targetStat: newStat,
      xpReward: 100, // Default
      isDaily: false,
      frequency: 'one-time'
    });
    setNewTitle('');
    setNewDetail('');
    setIsModalOpen(false);
    setNewStat('Strength');
    setNewXp(10);
    setNewIsDaily(false);
  };

  const handleMissionCompletion = (id: string) => {
    completeMission(id);
  };

  const handleTemplateClick = (template: MissionTemplate) => {
    setNewTitle(template.label);
    setNewDetail(template.description || '');
    setNewStat(template.targetStat);
    setNewXp(template.xpReward);
    setNewIsDaily(template.category === 'Habit');
  };

  // Filter Logic
  // Assuming missions are now part of state.missions
  const filteredMissions = state.missions.filter(m => {
    if (filter === 'All') return true;
    if (filter === 'Daily') return m.isDaily || m.frequency === 'daily';
    if (filter === 'Completed') return m.lastCompletedAt && new Date(m.lastCompletedAt).toDateString() === new Date().toDateString();
    return m.targetStat === filter;
  });

  // Sort: Available first, then by title
  const sortedMissions = [...filteredMissions].sort((a, b) => {
    const aAvailable = isMissionAvailableToday(a, new Date());
    const bAvailable = isMissionAvailableToday(b, new Date());
    if (aAvailable === bAvailable) return 0;
    return aAvailable ? -1 : 1;
  });

  // Temporary helper to add a test milestone
  const addTestMilestone = () => {
    // onAddMilestone({
    //   title: "Shadow Rider",
    //   description: "Obtain the motorcycle license and master the road.",
    //   category: "Skill",
    //   phases: [
    //     { title: "Study Theory", requiredActions: 5 },
    //     { title: "Practice Riding", requiredActions: 10 },
    //     { title: "Pass Exam", requiredActions: 1 }
    //   ],
    //   reward: { xpBonus: 500, unlockTitleId: "shadow_rider" }
    // });
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6 relative z-30">
        <div className="bg-slate-900/80 p-1 rounded-xl border border-slate-800 flex gap-1">
          {(['Normal', 'Epic', 'Advisor', 'Dungeons'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                console.log('Tab clicked:', tab);
                setActiveTab(tab);
                // Reset dungeon state when switching tabs
                if (tab !== 'Dungeons') {
                  setSelectedDungeonId(null);
                  setDungeonResult(null);
                }
              }}
              className={`
                px-4 py-2 rounded-lg text-sm font-bold transition-all relative overflow-hidden
                ${activeTab === tab
                  ? 'text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-300'
                }
              `}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-600 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab === 'Normal' ? 'Quests' : tab}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Advisor' && (
        <AdvisorView state={state} onAddRecommendedMission={onAddRecommendedMission} />
      )}

      {activeTab === 'Dungeons' && (
        <div className="h-full">
          {dungeonResult ? (
            <DungeonRunResultView
              result={dungeonResult.result}
              boss={dungeonResult.boss}
              onClose={() => {
                setDungeonResult(null);
                setSelectedDungeonId(null);
              }}
            />
          ) : selectedDungeonId ? (
            <DungeonDetailView
              dungeonId={selectedDungeonId}
              onBack={() => setSelectedDungeonId(null)}
              onEnter={() => {
                const result = startDungeonRun(selectedDungeonId);
                if (result) {
                  setDungeonResult(result);
                }
              }}
            />
          ) : (
            <DungeonsView state={state} onSelectDungeon={setSelectedDungeonId} />
          )}
        </div>
      )}

      {activeTab === 'Normal' ? ( // Changed from 'Normal Missions'
        <>
          {/* Filters */}
          {/* Filters */}
          <div className="relative mb-6">
            <div className="flex gap-2 overflow-x-auto pb-4 pt-2 scrollbar-hide -mx-6 px-6 mask-linear-fade">
              {[
                { id: 'All', icon: null, label: 'All' },
                { id: 'Daily', icon: RefreshCw, label: 'Daily' },
                { id: 'Strength', icon: Sword, label: 'STR' },
                { id: 'Vitality', icon: Heart, label: 'VIT' },
                { id: 'Agility', icon: Zap, label: 'AGI' },
                { id: 'Intelligence', icon: Brain, label: 'INT' },
                { id: 'Fortune', icon: Sparkles, label: 'LUCK' },
                { id: 'Metabolism', icon: Flame, label: 'META' }
              ].map((item) => {
                const isSelected = filter === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => setFilter(item.id as FilterType)}
                    className={`
                      relative px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300
                      flex items-center gap-2 border
                      ${isSelected
                        ? 'text-white border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                        : 'bg-slate-900/40 text-slate-500 border-slate-800 hover:border-slate-600 hover:text-slate-300 hover:bg-slate-800/60'
                      }
                    `}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeFilter"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl -z-10"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {Icon && <Icon size={14} className={isSelected ? "text-blue-100" : "text-slate-500"} />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mission List */}
          <motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
              {sortedMissions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 opacity-50"
                >
                  <Sword size={48} className="mx-auto mb-4 text-slate-700" />
                  <p className="text-slate-500 font-mono text-xs">No missions found for this filter.</p>
                </motion.div>
              ) : (
                sortedMissions.map(mission => (
                  <MissionItem
                    key={mission.id}
                    mission={mission}
                    onComplete={() => handleMissionCompletion(mission.id)}
                  />
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Add Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:scale-110 hover:bg-blue-500 transition-all z-30 active:scale-95"
          >
            <Plus size={24} />
          </button>
        </>
      ) : (
        /* Epic Missions Tab */
        <div className="space-y-4">
          {state.milestones.length === 0 ? (
            <div className="text-center py-12 opacity-50 border border-dashed border-slate-800 rounded-xl">
              <Sword size={48} className="mx-auto mb-4 text-slate-700" />
              <p className="text-slate-500 font-mono text-xs mb-4">No Epic Missions active.</p>
              <Button variant="secondary" onClick={addTestMilestone} className="mx-auto">
                Start "Shadow Rider" Arc
              </Button>
            </div>
          ) : (
            state.milestones.map(milestone => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                onAction={() => incrementMilestonePhase(milestone.id)}
              />
            ))
          )}

          {/* Debug/Test Button for adding more milestones */}
          {state.milestones.length > 0 && (
            <div className="pt-8 flex justify-center opacity-50 hover:opacity-100 transition-opacity">
              <Button variant="ghost" onClick={addTestMilestone} className="text-[10px]">
                + Debug: Add Test Milestone
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Add Mission Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Mission">
        <div className="space-y-4">
          {/* Templates */}
          <div>
            <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Quick Templates</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {MISSION_TEMPLATES.map((t, i) => (
                <TemplateChip key={i} template={t} onClick={() => handleTemplateClick(t)} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Title</label>
              <Input placeholder="e.g. 100 Pushups" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            </div>

            <div>
              <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Target Stat</label>
              <Select value={newStat} onChange={e => setNewStat(e.target.value as StatType)}>
                <option value="Strength">Strength</option>
                <option value="Vitality">Vitality</option>
                <option value="Agility">Agility</option>
                <option value="Intelligence">Intelligence</option>
                <option value="Fortune">Fortune</option>
                <option value="Metabolism">Metabolism</option>
              </Select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">XP Reward</label>
                <Input type="number" value={newXp} onChange={e => setNewXp(Number(e.target.value))} />
              </div>
              <div className="flex-1 flex items-end pb-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w - 5 h - 5 rounded border flex items - center justify - center transition - colors ${newIsDaily ? 'bg-blue-600 border-blue-500' : 'bg-slate-900 border-slate-700 group-hover:border-blue-500/50'} `}>
                    {newIsDaily && <Plus size={14} className="text-white" />}
                  </div>
                  <span className={`text - xs font - bold uppercase ${newIsDaily ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'} `}>Daily Habit</span>
                </label>
                <input type="checkbox" className="hidden" checked={newIsDaily} onChange={e => setNewIsDaily(e.target.checked)} />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Description</label>
              <TextArea placeholder="Mission details..." value={newDetail} onChange={e => setNewDetail(e.target.value)} rows={3} />
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleAddMission} className="w-full">Create Mission</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
