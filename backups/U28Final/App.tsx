
import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from './store';
import { DashboardView } from './views/DashboardView';
import { MissionsView } from './views/MissionsView';
import { LogsView } from './views/LogsView'; // U16 Replaced Journal
import { BodyView } from './views/BodyView';
import { AchievementsView } from './views/AchievementsView';
import { ProfileView } from './views/ProfileView';
import { PassivesView } from './views/PassivesView';
import { CalendarView } from './views/CalendarView'; // U18
import { BuffsView } from './views/BuffsView'; // U18.1
import { SeasonView } from './views/SeasonView'; // U22
import { SettingsView } from './views/SettingsView'; // U24.1

// AdvisorView removed - merged into MissionsView U26 Refactor
import { LayoutDashboard, Target, Activity, DoorOpen } from 'lucide-react';
import { LevelUpOverlay } from './components/UIComponents';
import { GateMenu } from './components/GateMenu';
import { Mission, UserStats, StatType, DungeonRunResult, BossDefinition } from './types';
import { RewardModal, MissionRewardSummary } from './components/RewardModal';
import { TitleUnlockModal } from './components/TitleUnlockModal';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'Dashboard' | 'Misiones' | 'Logs' | 'Físico' | 'Logros' | 'Perfil' | 'Skills' | 'Calendar' | 'Buffs' | 'Season' | 'Settings'; // Dungeons moved to Misiones

const App = () => {
  const {
    state,
    addMission,
    completeMission,
    addBodyRecord,
    openDailyChest,
    canOpenDailyChest,
    upgradePassive,
    getActiveBuffDefinitions,
    getEffectiveStats,
    applyBuff,
    setTitleModalClosed,
    equipTitle,
    equipFrame,
    // U21
    addMilestone,
    incrementMilestonePhase,
    // U22
    claimSeasonReward,
    // U24.1
    updateSettings,
    resetAll,
    // U26
    addRecommendedMission,
    // U27
    startDungeonRun,
    redeemCode
  } = useStore();

  const [currentTab, setCurrentTab] = useState<Tab>('Dashboard');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(1);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isGateOpen, setIsGateOpen] = useState(false);

  const [lastReward, setLastReward] = useState<MissionRewardSummary | null>(null);
  const [isRewardOpen, setIsRewardOpen] = useState(false);

  // U27 Dungeon State moved to MissionsView

  useEffect(() => {
    if (isFirstLoad) {
      setPrevLevel(state.stats.level);
      setIsFirstLoad(false);
      return;
    }

    if (state.stats.level > prevLevel) {
      setShowLevelUp(true);
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => { });

      const timer = setTimeout(() => {
        setShowLevelUp(false);
        setPrevLevel(state.stats.level);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [state.stats.level, prevLevel, isFirstLoad]);

  // --- AUDIO MANAGER ---
  useEffect(() => {
    const bgMusic = new Audio('/audio/system-nacho-theme.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.35;

    if (state.settings.musicEnabled) {
      bgMusic.play().catch(() => { /* Auto-play blocked or file missing */ });
    }

    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, [state.settings.musicEnabled]);

  const todayCompletedMissions = useMemo(() => {
    const today = new Date().toDateString();
    return state.missions.filter(m =>
      m.lastCompletedAt && new Date(m.lastCompletedAt).toDateString() === today
    ).length;
  }, [state.missions]);

  const handleMissionCompletion = (mission: Mission) => {
    const prevStatValue = state.stats[mission.targetStat.toLowerCase() as keyof UserStats] as number;
    const newStatValue = prevStatValue + 1;

    const summary: MissionRewardSummary = {
      missionId: mission.id,
      missionTitle: mission.title,
      targetStat: mission.targetStat,
      xpGained: mission.xpReward,
      previousStatValue: prevStatValue,
      newStatValue: newStatValue
    };

    setLastReward(summary);
    completeMission(mission.id);
    setIsRewardOpen(true);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'Dashboard':
        return (
          <DashboardView
            stats={state.stats}
            todayCompletedMissions={todayCompletedMissions}
            canOpenChest={canOpenDailyChest()}
            onOpenChest={openDailyChest}
            activeBuffs={getActiveBuffDefinitions()}
            effectiveStats={getEffectiveStats()}
            onApplyBuff={applyBuff}
            lastReward={lastReward}
            season={state.seasons[0]}
            seasonProgress={state.currentSeason}
            onOpenSeason={() => setCurrentTab('Season')}
          />
        );
      case 'Misiones':
        return <MissionsView
          state={state}
          addMission={addMission}
          completeMission={completeMission}
          onAddRecommendedMission={addRecommendedMission}
          startDungeonRun={startDungeonRun} // U27
          onAddMilestone={addMilestone}
          onIncrementMilestone={incrementMilestonePhase}
        />;
      case 'Logs':
        return <LogsView logs={state.logs} stats={state.stats} activeBuffs={state.activeBuffs} />;
      case 'Físico':
        return <BodyView records={state.bodyRecords} onAddRecord={addBodyRecord} />;
      case 'Logros':
        return <AchievementsView state={state} onEquipTitle={equipTitle} />;
      case 'Skills':
        return <PassivesView passivePoints={state.passivePoints} passiveLevels={state.passiveLevels} onUpgrade={upgradePassive} />;
      case 'Perfil':
        return <ProfileView stats={state.stats} effectiveStats={getEffectiveStats()} milestones={state.milestones} season={state.seasons[0]} seasonProgress={state.currentSeason} onOpenSeason={() => setCurrentTab('Season')} onEquipTitle={equipTitle} onEquipFrame={equipFrame} />;
      case 'Calendar':
        return <CalendarView />;
      case 'Buffs':
        return <BuffsView activeBuffs={state.activeBuffs} />;
      case 'Season':
        return state.currentSeason ? (
          <SeasonView
            season={state.seasons.find(s => s.id === state.currentSeason!.seasonId) || state.seasons[0]}
            progress={state.currentSeason}
            onClaimReward={claimSeasonReward}
          />
        ) : null;
      case 'Settings':
        return <SettingsView state={state} updateSettings={updateSettings} resetAll={resetAll} redeemCode={redeemCode} />;
    }
  };



  return (
    <div className={`min-h-screen font-sans selection:bg-blue-500/30 overflow-x-hidden text-blue-50 ${state.settings.theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>

      {/* --- BACKGROUND SYSTEM --- */}
      <div className="fixed inset-0 z-0 bg-[#02040a]">
        {/* Hexagonal Grid */}
        <div className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0.4' fill='%233b82f6' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Radial Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow delay-1000" />

        {/* Mist/Fog Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#02040a]/50 to-[#02040a] pointer-events-none" />

        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
      </div>

      <LevelUpOverlay show={showLevelUp} level={state.stats.level} />

      {state.justUnlockedTitle && (
        <TitleUnlockModal
          title={state.justUnlockedTitle}
          onClose={setTitleModalClosed}
        />
      )}

      {isRewardOpen && lastReward && (
        <RewardModal
          reward={lastReward}
          onClose={() => {
            setIsRewardOpen(false);
            setCurrentTab('Dashboard');
          }}
        />
      )}

      <GateMenu
        isOpen={isGateOpen}
        onClose={() => setIsGateOpen(false)}
        onNavigate={(view) => setCurrentTab(view as Tab)}
      />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 h-16 px-4 flex items-center justify-between">
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-md border-b border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.2)]"></div>

        <div className="relative z-10 w-full max-w-md mx-auto flex items-center justify-between">
          <div className="w-8"></div> {/* Spacer */}

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa] animate-pulse"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping opacity-75"></div>
            </div>
            <h1 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-blue-400 to-blue-100 tracking-[0.25em] uppercase text-sm drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              System <span className="text-blue-500">Nacho</span>
            </h1>
          </div>

          <div className="w-8"></div> {/* Spacer */}
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-md mx-auto p-4 relative z-10 min-h-[calc(100vh-140px)] pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* --- BOTTOM NAVIGATION --- */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-[#02040a]/90 backdrop-blur-xl border-t border-blue-500/30 shadow-[0_-5px_30px_rgba(37,99,235,0.15)]"></div>

        <div className="relative z-10 max-w-md mx-auto flex justify-around items-center h-20 px-2">
          <NavButton active={currentTab === 'Dashboard'} onClick={() => setCurrentTab('Dashboard')} icon={<LayoutDashboard size={22} />} label="STATUS" />
          <NavButton active={currentTab === 'Misiones'} onClick={() => setCurrentTab('Misiones')} icon={<Target size={22} />} label="QUESTS" />
          <NavButton active={currentTab === 'Físico'} onClick={() => setCurrentTab('Físico')} icon={<Activity size={22} />} label="HEALTH" />

          {/* Gate Button Special Styling */}
          <button
            onClick={() => setIsGateOpen(true)}
            className={`
              relative -mt-8 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group
              ${isGateOpen
                ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.8)] border-2 border-white/50'
                : 'bg-[#0a0f1e] border border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:border-blue-400'
              }
            `}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-500/20 to-transparent opacity-50"></div>
            <DoorOpen size={24} className={`relative z-10 transition-all duration-300 ${isGateOpen ? 'text-white scale-110' : 'text-blue-400 group-hover:text-blue-100 group-hover:scale-110'}`} />

            {/* Gate Particles */}
            {!isGateOpen && (
              <>
                <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-ping-slow"></div>
                <div className="absolute -inset-1 rounded-full border border-blue-500/10 animate-spin-slow-reverse"></div>
              </>
            )}
          </button>
        </div>
      </nav>
    </div >
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-20 h-full pt-2 transition-all duration-300 group relative`}
  >
    {active && (
      <>
        {/* Active Glow Background */}
        <motion.div
          layoutId="nav-active-glow"
          className="absolute inset-0 m-auto w-16 h-16 bg-blue-500/20 blur-xl rounded-full"
          transition={{ duration: 0.3 }}
        />
        {/* Top Highlight Line */}
        <motion.div
          layoutId="nav-active-line"
          className="absolute top-0 left-0 right-0 mx-auto w-12 h-0.5 bg-blue-400 shadow-[0_0_10px_#60a5fa]"
        />
      </>
    )}

    <motion.div
      whileTap={{ scale: 0.9 }}
      animate={active ? { y: -4, scale: 1.1 } : { y: 0, scale: 1 }}
      className={`
        relative p-2 rounded-xl transition-all duration-300 z-10
        ${active
          ? 'text-blue-100 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'
          : 'text-slate-500 group-hover:text-blue-300'
        }
      `}>
      {icon}
    </motion.div>

    <span className={`
      text-[9px] mt-1 font-bold tracking-widest transition-all duration-300
      ${active
        ? 'text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]'
        : 'text-slate-600 group-hover:text-slate-400'
      }
    `}>
      {label}
    </span>
  </button>
);

export default App;
