import React, { useState, useMemo, useEffect, Suspense } from 'react';
// Force Rebundle v2.4 - Cleaning Zone Titles clutter
import { useStore } from '@/store/index';
// Eager load Dashboard for LCP
import { DashboardView } from '@/views/DashboardView';
import { Mission, UserStats } from '@/types';
import { MissionRewardSummary } from '@/components/rewards/RewardModal';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { DEFAULT_SEASON, DEFAULT_SEASON_PROGRESS } from '@/store/defaults';
import { MainLayout, Tab } from '@/components/layout/MainLayout';
import { AnimationQueueProvider } from '@/components/animations';
import { useStatChangeAnimations, useCosmeticUnlockAnimations, useEquipmentRewardAnimations, useXPGainAnimations, useShardsGainAnimations, useZoneChangeAnimations } from '@/components/animations/useAnimationHooks';
import { useAudioEffects } from '@/utils/useAudioEffects';
import { audioManager } from '@/utils/audioManager';
import { VoiceCommander } from '@/components/layout/VoiceCommander';

// Lazy load other views
const MissionsView = React.lazy(() => import('./views/MissionsView').then(m => ({ default: m.MissionsView })));
const LogsView = React.lazy(() => import('./views/LogsView').then(m => ({ default: m.LogsView })));
const BodyView = React.lazy(() => import('./views/BodyView').then(m => ({ default: m.BodyView })));
const AchievementsView = React.lazy(() => import('./views/AchievementsView').then(m => ({ default: m.AchievementsView })));
const ProfileView = React.lazy(() => import('./views/ProfileView').then(m => ({ default: m.ProfileView })));
const PassivesView = React.lazy(() => import('./views/PassivesView').then(m => ({ default: m.PassivesView })));
const CalendarView = React.lazy(() => import('./views/CalendarView').then(m => ({ default: m.CalendarView })));
const BuffsView = React.lazy(() => import('./views/BuffsView').then(m => ({ default: m.BuffsView })));
const SeasonView = React.lazy(() => import('./views/SeasonView').then(m => ({ default: m.SeasonView })));
const SettingsView = React.lazy(() => import('./views/SettingsView').then(m => ({ default: m.SettingsView })));
const ShadowsView = React.lazy(() => import('./views/ShadowsView').then(m => ({ default: m.ShadowsView })));
const PowerAnalysisView = React.lazy(() => import('./views/PowerAnalysisView').then(m => ({ default: m.PowerAnalysisView })));
const GearView = React.lazy(() => import('./views/GearView').then(m => ({ default: m.GearView })));
const DungeonsView = React.lazy(() => import('./views/dungeons/DungeonsView').then(m => ({ default: m.DungeonsView })));
const ProceduralShowcaseView = React.lazy(() => import('./views/demos/ProceduralShowcaseView').then(module => ({ default: module.ProceduralShowcaseView })));
const PetsView = React.lazy(() => import('./views/PetsView').then(module => ({ default: module.PetsView })));
const DailyChatView = React.lazy(() => import('./views/DailyChatView').then(module => ({ default: module.DailyChatView })));
const ZoneShowcaseView = React.lazy(() => import('./views/demos/ZoneShowcaseView').then(m => ({ default: m.ZoneShowcaseView })));
const QuestShop = React.lazy(() => import('./components/shop/QuestShop').then(m => ({ default: m.QuestShop })));
const JobChangeView = React.lazy(() => import('./views/JobChangeView').then(m => ({ default: m.JobChangeView })));


// Zone System Components
// Zone System Components
import { ZoneUnlockAnimation } from '@/components/zone/ZoneUnlockAnimation';
import { ZoneBossFight } from '@/components/zone/ZoneBossFight';
import { ZoneCompleteSummary } from '@/components/zone/ZoneCompleteSummary';
import { SystemCalibration } from '@/components/onboarding/SystemCalibration';

// Animation and Audio observer component - must be inside AnimationQueueProvider
const AnimationObserver = () => {
  useStatChangeAnimations(); // Shows beautiful stat/level up reveals
  useCosmeticUnlockAnimations(); // Shows beautiful title/frame reveals
  useEquipmentRewardAnimations(); // Shows beautiful equipment reveals
  useXPGainAnimations(); // Shows beautiful XP bar animation
  useShardsGainAnimations(); // Shows beautiful shards animation
  useZoneChangeAnimations(); // Shows beautiful zone reveal animation
  useAudioEffects(); // Audio SFX triggers
  return null;
};

// Hook to start background music on first user interaction
const useMusicAutostart = (musicEnabled: boolean) => {
  React.useEffect(() => {
    if (!musicEnabled) return;

    const startMusic = () => {
      audioManager.playMusic();
      // Remove listeners after first interaction
      document.removeEventListener('click', startMusic);
      document.removeEventListener('keydown', startMusic);
    };

    document.addEventListener('click', startMusic);
    document.addEventListener('keydown', startMusic);

    return () => {
      document.removeEventListener('click', startMusic);
      document.removeEventListener('keydown', startMusic);
    };
  }, [musicEnabled]);
};

// Loading Fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-[50vh] text-blue-500 font-mono animate-pulse">
    LOADING SYSTEM...
  </div>
);

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
    unequipAll,
    upgradeItem,
    transmogItem,
    salvageItem,
    bulkSalvage, // U53 Equipment improvements
    addEquipment,
    clearRewards, // U32
    syncLifeGoals, // U33
    refreshDailyQuests, // U33.1
    purchaseEquipment,
    initializeMissions, // U34: Core & Random Missions
    // U52 Zone System
    checkZoneThreshold,
    getZoneState,
    completeZoneBossFight,
    dismissZoneBoss,
    getZoneInfo,
    manualCompleteQuest, // U42
    forceRefreshDailyQuests,
    // Firebase
    initializeFirebase
  } = useStore();

  const [currentTab, setCurrentTab] = useState<Tab>('Dashboard');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(1);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isGateOpen, setIsGateOpen] = useState(false);

  const [lastReward, setLastReward] = useState<MissionRewardSummary | null>(null);
  const [isRewardOpen, setIsRewardOpen] = useState(false);

  // Zone System State
  const [zonePhase, setZonePhase] = useState<'none' | 'unlock' | 'fight' | 'summary'>('none');
  const [activeZoneId, setActiveZoneId] = useState<number | null>(null);

  // Start background music on first user interaction
  useMusicAutostart(state.settings.musicEnabled);

  if (!state || !state.stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-blue-500 font-mono animate-pulse">
        INITIALIZING SYSTEM...
      </div>
    );
  }

  // Initialize Firebase
  useEffect(() => {
    initializeFirebase();
  }, []);

  useEffect(() => {
    if (isFirstLoad) {
      setPrevLevel(state.stats.level);
      setIsFirstLoad(false);
      // Sync Life Goals on load
      syncLifeGoals();
      refreshDailyQuests();
      initializeMissions();
      return;
    }
    // Level up animation is now handled by AnimationQueueProvider
  }, [state.stats.level, prevLevel, isFirstLoad]);

  // U52 Zone System - Reactive Trigger
  // Watches for when pendingZoneBoss actually changes (e.g. set by dungeon victory)
  const prevPendingBoss = React.useRef(state.zone?.pendingZoneBoss);

  useEffect(() => {
    // If we have a pending boss AND it's a NEW pending boss (different from ref)
    if (state.zone?.pendingZoneBoss && state.zone.pendingZoneBoss !== prevPendingBoss.current) {
      // Only auto-trigger if we aren't already doing something else
      if (zonePhase === 'none') {
        setActiveZoneId(state.zone.pendingZoneBoss);
        setZonePhase('unlock');
      }
    }
    // Update ref
    prevPendingBoss.current = state.zone?.pendingZoneBoss;
  }, [state.zone?.pendingZoneBoss, zonePhase]);



  // Apply Performance Mode
  useEffect(() => {
    if (state.settings.performanceMode) {
      document.body.classList.add('performance-mode');
    } else {
      document.body.classList.remove('performance-mode');
    }
  }, [state.settings.performanceMode]);

  const todayCompletedMissions = useMemo(() => {
    const today = new Date().toDateString();
    return state.missions.filter(m =>
      m.lastCompletedAt && new Date(m.lastCompletedAt).toDateString() === today
    ).length;
  }, [state.missions]);

  const handleMissionCompletion = (mission: Mission) => {
    completeMission(mission.id);
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
          activeBuffs={state.activeBuffs}
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
          onManualComplete={manualCompleteQuest}
          equippedItems={state.inventory.filter(i => i.isEquipped)}
          onManageGear={() => setCurrentTab('Gear')}
          lastSleepRecord={state.bodyRecords.length > 0 ? [...state.bodyRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : undefined}
          language={state.settings.language}
          pendingEraBoss={state.zone?.pendingZoneBoss} // Map to pendingEraBoss prop for now
          onChallengeEraBoss={() => {
            if (state.zone?.pendingZoneBoss) {
              setActiveZoneId(state.zone.pendingZoneBoss);
              setZonePhase('unlock');
            }
          }}
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
      case 'Logros': return <AchievementsView
        state={state}
        onEquipTitle={equipTitle}
        language={state.settings.language}
        maxReachedFloor={(state.dungeonRuns || [])
          .filter(r => r.victory)
          .reduce((max, r) => {
            const floor = parseInt(r.dungeonId.split('_')[1] || '0');
            return Math.max(max, floor);
          }, 0)}
      />;
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
        userObjectives={state.userObjectives}
        language={state.settings.language}
        maxReachedFloor={(state.dungeonRuns || [])
          .filter(r => r.victory)
          .reduce((max, r) => {
            const floor = parseInt(r.dungeonId.split('_')[1] || '0');
            return Math.max(max, floor);
          }, 0)}
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
      case 'Settings': return <SettingsView state={state} updateSettings={updateSettings} resetAll={resetAll} redeemCode={redeemCode} onNavigate={setCurrentTab} onForceRefreshQuests={forceRefreshDailyQuests} />;
      case 'Shadows': return <ShadowsView state={state} onEquipShadow={equipShadow} language={state.settings.language} />;
      case 'PowerAnalysis': return <PowerAnalysisView state={state} onBack={() => setCurrentTab('Dashboard')} language={state.settings.language} />;
      case 'Shop': return <QuestShop language={state.settings.language} onNavigateToInventory={() => setCurrentTab('Gear')} />;
      case 'Gear': return <GearView state={state} onEquip={equipItem} onUnequip={unequipItem} onUnequipAll={unequipAll} onUpgrade={upgradeItem} onSalvage={salvageItem} onBulkSalvage={bulkSalvage} onAddEquipment={addEquipment} language={state.settings.language} />;
      case 'Dungeons': return <DungeonsView state={state} language={state.settings.language} onSelectDungeon={() => { }} />;
      case 'JobChange': return <JobChangeView state={state} onJobChange={() => { }} language={state.settings.language} />;
      case 'Pets': return <PetsView />;
      case 'DailyChat': return <DailyChatView />;
      case 'ProceduralShowcase': return <ProceduralShowcaseView onBack={() => setCurrentTab('Settings')} />;
      case 'CelestialDemo': return <ZoneShowcaseView onBack={() => setCurrentTab('Settings')} />;
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
        onManualComplete={manualCompleteQuest}
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
        isOnboarding={!state.onboardingCompleted}
      >
        <Suspense fallback={<LoadingFallback />}>
          {renderContent()}
        </Suspense>
        <VoiceCommander
          onNavigate={setCurrentTab}
          onAddMission={() => setCurrentTab('Misiones')}
        />

        <SystemCalibration />

        {/* U52 Zone System Overlays */}
        {zonePhase === 'unlock' && activeZoneId && (
          <ZoneUnlockAnimation
            zoneId={activeZoneId}
            onComplete={() => { }} // Not used yet
            onChallenge={() => setZonePhase('fight')}
            onDismiss={() => {
              dismissZoneBoss();
              setZonePhase('none');
              setActiveZoneId(null);
            }}
          />
        )}

        {zonePhase === 'fight' && activeZoneId && (
          <ZoneBossFight
            zoneId={activeZoneId}
            onComplete={(victory) => {
              completeZoneBossFight(victory, activeZoneId);
              if (victory) {
                setZonePhase('summary');
              } else {
                setZonePhase('none');
                setActiveZoneId(null);
              }
            }}
          />
        )}

        {zonePhase === 'summary' && activeZoneId && (
          <ZoneCompleteSummary
            zoneId={activeZoneId}
            onClose={() => {
              setZonePhase('none');
              setActiveZoneId(null);
            }}
          />
        )}
      </MainLayout>
    </ErrorBoundary>
  );
};

import { AchievementListener } from '@/components/features/AchievementListener';

const App = () => {
  return (
    <ErrorBoundary>
      <AnimationQueueProvider>
        <AnimationObserver />
        <AchievementListener />
        <GameContent />
      </AnimationQueueProvider>
    </ErrorBoundary>
  );
};

export default App;

