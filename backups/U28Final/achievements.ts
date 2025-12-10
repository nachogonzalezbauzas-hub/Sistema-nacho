import { AppState } from './types';

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
    id: 'journalist',
    title: 'Diario Viviente',
    description: 'Escribe tu primera entrada en el diario.',
    icon: '📜',
    condition: (state) => state.journalEntries.length > 0
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