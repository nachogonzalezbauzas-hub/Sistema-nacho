import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from './store/index';
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
import { ShadowsView } from './views/ShadowsView'; // U29
import { PowerAnalysisView } from './views/PowerAnalysisView'; // U30
import { GearView } from './views/GearView'; // U31
import { DungeonsView } from './views/DungeonsView'; // U27
import { JobChangeView } from './views/JobChangeView'; // U35
import { QuestShop } from './components/shop/QuestShop'; // U30 Refactor
import { Mission, UserStats } from './types';
import { MissionRewardSummary } from './components/rewards/RewardModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DEFAULT_SEASON, DEFAULT_SEASON_PROGRESS } from './store/defaults';
import { MainLayout, Tab } from './components/layout/MainLayout';
import { AnimationQueueProvider } from './components/animations';
import { useStatChangeAnimations, useCosmeticUnlockAnimations } from './components/animations/useAnimationHooks';

// Animation observer component - must be inside AnimationQueueProvider
const AnimationObserver = () => {
  useStatChangeAnimations();
  useCosmeticUnlockAnimations();
  return null;
};

// Componente interno para acceder al Contexto
const GameContent = () => {
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
    redeemCode,
    // U29
    equipShadow,
    getTotalPower,
    // U30
    claimQuestReward,
    // U31
    equipItem,
    unequipItem,
    upgradeItem,
    transmogItem,
    salvageItem,
    addEquipment,
    clearRewards, // U32
    syncLifeGoals, // U33
    refreshDailyQuests, // U33.1
    purchaseEquipment
  } = useStore();

  const [currentTab, setCurrentTab] = useState<Tab>('Dashboard');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(1);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isGateOpen, setIsGateOpen] = useState(false);

  const [lastReward, setLastReward] = useState<MissionRewardSummary | null>(null);
  const [isRewardOpen, setIsRewardOpen] = useState(false);

  if (!state || !state.stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-blue-500 font-mono animate-pulse">
        INITIALIZING SYSTEM...
      </div>
    );
  }

  useEffect(() => {
    if (isFirstLoad) {
      setPrevLevel(state.stats.level);
      setIsFirstLoad(false);
      // Sync Life Goals on load
      syncLifeGoals();
      refreshDailyQuests();
      return;
    }
    // Level up animation is now handled by AnimationQueueProvider
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

  const handleStartDungeon = (dungeonId: string) => {
    const result = startDungeonRun(dungeonId);
    return result;
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'Dashboard':
        return <DashboardView
          stats={state.stats}
          todayCompletedMissions={todayCompletedMissions}
          canOpenChest={canOpenDailyChest()}
          onOpenChest={openDailyChest}
          activeBuffs={getActiveBuffDefinitions()}
          effectiveStats={getEffectiveStats()}
          onApplyBuff={applyBuff}
          lastReward={lastReward}
          season={state.seasons.find(s => s.id === state.currentSeason?.seasonId) || DEFAULT_SEASON}
          seasonProgress={state.currentSeason || null}
          onOpenSeason={() => setCurrentTab('Season')}
          equippedShadow={state.equippedShadowId ? state.shadows.find(s => s.id === state.equippedShadowId) : null}
          totalPower={getTotalPower()}
          dailyQuests={state.dailyQuests}
          onClaimQuest={claimQuestReward}
          language={state.settings.language}
        />;
      case 'Misiones':
        return <MissionsView
          missions={state.missions}
          milestones={state.milestones}
          state={state}
          onAddMission={addMission}
          onCompleteMission={handleMissionCompletion}
          onAddMilestone={addMilestone}
          onIncrementMilestone={incrementMilestonePhase}
          language={state.settings.language}
          onAddRecommendedMission={addRecommendedMission}
          startDungeonRun={handleStartDungeon}
        />;
      case 'Logs': return <LogsView logs={state.logs} stats={state.stats} activeBuffs={state.activeBuffs} language={state.settings.language} />;
      case 'Físico': return <BodyView
        records={state.bodyRecords}
        onAddRecord={addBodyRecord}
        language={state.settings.language}
        healthSummary={state.healthSummary}
      />;
      case 'Logros': return <AchievementsView state={state} onEquipTitle={equipTitle} language={state.settings.language} />;
      case 'Perfil': return <ProfileView
        stats={state.stats}
        effectiveStats={getEffectiveStats()}
        totalPower={getTotalPower()}
        shards={state.shards}
        milestones={state.milestones}
        season={state.currentSeason}
        seasonProgress={state.currentSeason}
        onOpenSeason={() => setCurrentTab('Season')}
        onEquipTitle={equipTitle}
        onEquipFrame={equipFrame}
        language={state.settings.language}
      />;
      case 'Skills': return <PassivesView
        passivePoints={state.stats.passivePoints || state.passivePoints}
        passiveLevels={state.passiveLevels || {}}
        onUpgrade={upgradePassive}
        language={state.settings.language}
      />;
      case 'Calendar': return <CalendarView language={state.settings.language} />;
      case 'Buffs': return <BuffsView activeBuffs={state.activeBuffs} />;
      case 'Season':
        return <SeasonView
          season={state.seasons.find(s => s.id === state.currentSeason?.seasonId) || DEFAULT_SEASON}
          progress={state.currentSeason || DEFAULT_SEASON_PROGRESS}
          onClaimReward={claimSeasonReward}
        />;
      case 'Settings': return <SettingsView state={state} updateSettings={updateSettings} resetAll={resetAll} redeemCode={redeemCode} />;
      case 'Shadows': return <ShadowsView state={state} onEquipShadow={equipShadow} language={state.settings.language} />;
      case 'PowerAnalysis': return <PowerAnalysisView state={state} onBack={() => setCurrentTab('Dashboard')} language={state.settings.language} />;
      case 'Shop': return <QuestShop language={state.settings.language} onNavigateToInventory={() => setCurrentTab('Gear')} />;
      case 'Gear': return <GearView state={state} onEquip={equipItem} onUnequip={unequipItem} onUpgrade={upgradeItem} onSalvage={salvageItem} onAddEquipment={addEquipment} language={state.settings.language} />;
      case 'Dungeons': return <DungeonsView state={state} language={state.settings.language} onSelectDungeon={() => { }} />;
      case 'JobChange': return <JobChangeView state={state} onJobChange={() => { }} language={state.settings.language} />;
      default: return <DashboardView
        stats={state.stats}
        todayCompletedMissions={todayCompletedMissions}
        canOpenChest={canOpenDailyChest()}
        onOpenChest={openDailyChest}
        activeBuffs={getActiveBuffDefinitions()}
        effectiveStats={getEffectiveStats()}
        onApplyBuff={applyBuff}
        lastReward={lastReward}
        season={state.seasons.find(s => s.id === state.currentSeason?.seasonId) || DEFAULT_SEASON}
        seasonProgress={state.currentSeason || null}
        onOpenSeason={() => setCurrentTab('Season')}
        equippedShadow={state.equippedShadowId ? state.shadows.find(s => s.id === state.equippedShadowId) : null}
        totalPower={getTotalPower()}
        dailyQuests={state.dailyQuests}
        onClaimQuest={claimQuestReward}
        language={state.settings.language}
      />;
    }
  };

  return (
    <ErrorBoundary>
      <MainLayout
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isGateOpen={isGateOpen}
        setIsGateOpen={setIsGateOpen}
        state={state}
        onClearRewards={clearRewards}
        isRewardOpen={isRewardOpen}
        setIsRewardOpen={setIsRewardOpen}
        lastReward={lastReward}
      >
        {renderContent()}
      </MainLayout>
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AnimationQueueProvider>
        <AnimationObserver />
        <GameContent />
      </AnimationQueueProvider>
    </ErrorBoundary>
  );
};

export default App;

