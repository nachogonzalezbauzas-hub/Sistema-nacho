import { AppState } from '../types';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (state: AppState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'Primer Paso',
    description: 'Completa tu primera misión.',
    icon: '🗡️',
    condition: (state) => state.missions.some(m => m.lastCompletedAt !== null)
  },
  {
    id: 'discipline',
    title: 'Disciplina',
    description: 'Completa una misión diaria.',
    icon: '⚡',
    condition: (state) => state.missions.some(m => m.isDaily && m.lastCompletedAt !== null)
  },
  {
    id: 'fitness',
    title: 'En Forma',
    description: 'Añade un registro físico.',
    icon: '💪',
    condition: (state) => state.bodyRecords.length > 0
  },
  {
    id: 'focused',
    title: 'Focused',
    description: 'Alcanza nivel 15 en cualquier estadística.',
    icon: '🧠',
    condition: (state) =>
      state.stats.strength >= 15 ||
      state.stats.vitality >= 15 ||
      state.stats.agility >= 15 ||
      state.stats.intelligence >= 15 ||
      state.stats.fortune >= 15
  },
  {
    id: 'level_up',
    title: 'Level Up!',
    description: 'Alcanza el nivel 2 de jugador.',
    icon: '🆙',
    condition: (state) => state.stats.level >= 2
  },
  // U22 Season Achievements
  {
    id: 'season_warmup',
    title: 'Season Warm-Up',
    description: 'Reach Rank D in any Season.',
    icon: '🌱',
    condition: (state) => !!state.currentSeason && ['D', 'C', 'B', 'A', 'S'].includes(state.currentSeason.rank)
  },
  {
    id: 'season_grinder',
    title: 'Season Grinder',
    description: 'Reach Rank B in any Season.',
    icon: '🛡️',
    condition: (state) => !!state.currentSeason && ['B', 'A', 'S'].includes(state.currentSeason.rank)
  },
  {
    id: 'season_elite',
    title: 'Season Elite',
    description: 'Reach Rank A in any Season.',
    icon: '⚜️',
    condition: (state) => !!state.currentSeason && ['A', 'S'].includes(state.currentSeason.rank)
  },
  {
    id: 'season_monarch',
    title: 'Season Monarch',
    description: 'Reach Rank S in any Season.',
    icon: '👑',
    condition: (state) => !!state.currentSeason && state.currentSeason.rank === 'S'
  },
  // New Achievements
  {
    id: 'dungeon_novice',
    title: 'Dungeon Novice',
    description: 'Clear your first Dungeon.',
    icon: '🏰',
    condition: (state) => state.dungeonRuns.some(r => r.victory)
  },
  {
    id: 'dungeon_master',
    title: 'Dungeon Master',
    description: 'Clear 10 Dungeons.',
    icon: '🗝️',
    condition: (state) => state.dungeonRuns.filter(r => r.victory).length >= 10
  },
  {
    id: 'boss_slayer',
    title: 'Boss Slayer',
    description: 'Defeat a Dungeon Boss.',
    icon: '💀',
    condition: (state) => state.dungeonRuns.some(r => r.victory && !!r.bossId)
  },
  {
    id: 'shadow_monarch',
    title: 'Shadow Monarch',
    description: 'Extract your first Shadow.',
    icon: '👥',
    condition: (state) => state.shadows.length > 0
  },
  {
    id: 'army_of_shadows',
    title: 'Army of Shadows',
    description: 'Extract 5 Shadows.',
    icon: '🌑',
    condition: (state) => state.shadows.length >= 5
  },
  {
    id: 'shard_collector',
    title: 'Shard Collector',
    description: 'Accumulate 100 Shards.',
    icon: '✨',
    condition: (state) => (state.shards || 0) >= 100
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Reach a 7-day login streak.',
    icon: '🔥',
    condition: (state) => state.stats.streak >= 7
  },
  {
    id: 'quest_master',
    title: 'Quest Master',
    description: 'Complete 50 Daily Quests.',
    icon: '📜',
    condition: (state) => (state.questHistory || []).reduce((acc, day) => acc + day.questsCompleted, 0) >= 50
  }
];

export const getUnlockedAchievements = (): string[] => {
  try {
    const saved = localStorage.getItem('sistema_nacho_achievements');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveUnlockedAchievement = (id: string) => {
  const current = getUnlockedAchievements();
  if (!current.includes(id)) {
    localStorage.setItem('sistema_nacho_achievements', JSON.stringify([...current, id]));
  }
};