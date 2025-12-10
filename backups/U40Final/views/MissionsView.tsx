
import React, { useState } from 'react';
import { Mission, StatType, Milestone, AppState } from '../types';
import { MISSION_TEMPLATES, MissionTemplate } from '../data/missionTemplates';
import { isMissionAvailableToday } from '../store/index';
import { DungeonsView } from './DungeonsView';
import { DungeonDetailView } from './DungeonDetailView';
import { MissionTabs } from '../components/missions/MissionTabs';
import { MissionFilters, FilterType } from '../components/missions/MissionFilters';
import { MissionList } from '../components/missions/MissionList';
import { EpicMissionsTab } from '../components/missions/EpicMissionsTab';
import { AddMissionModal } from '../components/missions/AddMissionModal';

interface MissionsViewProps {
  missions: Mission[];
  milestones: Milestone[];
  state: AppState;
  onAddMission: (mission: Omit<Mission, 'id' | 'lastCompletedAt'>) => void;
  onCompleteMission: (mission: Mission) => void;
  onAddMilestone: (milestone: Milestone) => void;
  onIncrementMilestone: (id: string) => void;
  onAddRecommendedMission: (mission: { title: string; detail: string; targetStat: StatType; xpReward: number; isDaily: boolean }) => void;
  startDungeonRun: (dungeonId: string) => void;
  language: 'en' | 'es';
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  state,
  onAddMission,
  onCompleteMission,
  onAddRecommendedMission,
  startDungeonRun,
  onAddMilestone,
  onIncrementMilestone,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'Normal' | 'Epic' | 'Dungeons'>('Normal');
  const [filter, setFilter] = useState<FilterType>('All');
  const [epicFilter, setEpicFilter] = useState<'Active' | 'Completed'>('Active');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // U27 Dungeon State
  const [selectedDungeonId, setSelectedDungeonId] = useState<string | null>(null);

  // New Mission Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newStat, setNewStat] = useState<StatType>('Strength');
  const [newXp, setNewXp] = useState(10);
  const [newIsDaily, setNewIsDaily] = useState(false);

  const handleAddMission = () => {
    if (!newTitle) return;
    onAddMission({
      title: newTitle,
      detail: newDetail,
      targetStat: newStat,
      xpReward: 100,
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

  const handleMissionCompletion = (mission: Mission) => {
    onCompleteMission(mission);
  };

  const handleTemplateClick = (template: MissionTemplate) => {
    setNewTitle(template.label);
    setNewDetail(template.description || '');
    setNewStat(template.targetStat);
    setNewXp(template.xpReward);
    setNewIsDaily(template.category === 'Habit');
  };

  const filteredMissions = (state?.missions || []).filter(m => {
    if (!m) return false;
    if (filter === 'All') return true;
    if (filter === 'Daily') return m.isDaily || m.frequency === 'daily';
    if (filter === 'Completed') return m.lastCompletedAt && new Date(m.lastCompletedAt).toDateString() === new Date().toDateString();
    return m.targetStat === filter;
  });

  const sortedMissions = [...filteredMissions].sort((a, b) => {
    if (!a || !b) return 0;
    const aAvailable = isMissionAvailableToday(a, new Date());
    const bAvailable = isMissionAvailableToday(b, new Date());
    if (aAvailable === bAvailable) return 0;
    return aAvailable ? -1 : 1;
  });

  const addTestMilestone = () => {
    onAddMilestone({
      id: `milestone_${Date.now()}`,
      title: "Shadow Rider Arc",
      description: "Master the art of stealth and speed to become a true shadow.",
      category: "Skill",
      createdAt: new Date().toISOString(),
      phases: [
        {
          id: 'p1',
          title: 'Shadow Step',
          description: 'Complete 5 Agility Missions',
          requiredActions: 5,
          completedActions: 0,
          isCompleted: false
        },
        {
          id: 'p2',
          title: 'Silent Takedown',
          description: 'Complete 3 Strength Missions',
          requiredActions: 3,
          completedActions: 0,
          isCompleted: false
        }
      ],
      currentPhaseIndex: 0,
      isCompleted: false,
      progressPercent: 0,
      reward: {
        xpBonus: 500,
        unlockTitleId: 'shadow_rider'
      }
    });
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* Tab Navigation */}
      <MissionTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedDungeonId={setSelectedDungeonId}
        language={language}
      />


      {activeTab === 'Dungeons' && (
        <div className="h-full">
          {selectedDungeonId ? (
            <DungeonDetailView
              dungeonId={selectedDungeonId}
              onBack={() => setSelectedDungeonId(null)}
              onEnter={() => {
                startDungeonRun(selectedDungeonId);
                // Result is now handled globally in App.tsx
                setSelectedDungeonId(null);
              }}
            />
          ) : (
            <DungeonsView state={state} onSelectDungeon={setSelectedDungeonId} language={language} />
          )}
        </div>
      )}

      {activeTab === 'Normal' && (
        <>
          {/* Filters */}
          <MissionFilters filter={filter} setFilter={setFilter} language={language} />

          {/* Mission List */}
          <MissionList
            sortedMissions={sortedMissions}
            onCompleteMission={handleMissionCompletion}
            onOpenModal={() => setIsModalOpen(true)}
            language={language}
          />
        </>
      )}

      {activeTab === 'Epic' && (
        /* Epic Missions Tab */
        <EpicMissionsTab
          milestones={state?.milestones}
          epicFilter={epicFilter}
          setEpicFilter={setEpicFilter}
          onIncrementMilestone={onIncrementMilestone}
          addTestMilestone={addTestMilestone}
          language={language}
        />
      )}

      {/* Add Mission Modal */}
      <AddMissionModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newStat={newStat}
        setNewStat={setNewStat}
        newXp={newXp}
        setNewXp={setNewXp}
        newIsDaily={newIsDaily}
        setNewIsDaily={setNewIsDaily}
        newDetail={newDetail}
        setNewDetail={setNewDetail}
        onAddMission={handleAddMission}
        onTemplateClick={handleTemplateClick}
        language={language}
      />
    </div >
  );
};
