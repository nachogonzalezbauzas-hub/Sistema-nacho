import { AppState } from '../types';

export type AchievementCategory = 'GENERAL' | 'COMBAT' | 'SHADOWS' | 'GROWTH' | 'COLLECTION' | 'MISSIONS';
export type AchievementRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC' | 'GODLIKE';

export interface Achievement {
  id: string;
  category: AchievementCategory;
  title: { en: string; es: string };
  description: { en: string; es: string };
  icon: string; // Lucide icon name
  rarity: AchievementRarity;
  condition: (state: AppState) => boolean;
}

const getLevelRarity = (level: number): AchievementRarity => {
  if (level >= 100) return 'GODLIKE';
  if (level >= 90) return 'MYTHIC';
  if (level >= 70) return 'LEGENDARY';
  if (level >= 50) return 'EPIC';
  if (level >= 30) return 'RARE';
  if (level >= 10) return 'UNCOMMON';
  return 'COMMON';
};

const createLevelAchievement = (level: number): Achievement => ({
  id: `level_${level}`,
  category: 'GENERAL',
  title: { en: `Level ${level}`, es: `Nivel ${level}` },
  description: { en: `Reach Player Level ${level}.`, es: `Alcanza el Nivel de Jugador ${level}.` },
  icon: 'TrendingUp',
  rarity: getLevelRarity(level),
  condition: (state) => state.stats.level >= level
});

const getStatRarity = (value: number): AchievementRarity => {
  if (value >= 100) return 'LEGENDARY'; // Or Mythic if very hard
  if (value >= 75) return 'EPIC';
  if (value >= 50) return 'RARE';
  if (value >= 25) return 'UNCOMMON';
  return 'COMMON';
};

const createStatAchievement = (stat: 'strength' | 'agility' | 'vitality' | 'intelligence' | 'fortune', value: number, icon: string): Achievement => ({
  id: `stat_${stat}_${value}`,
  category: 'GROWTH',
  title: { en: `${stat.charAt(0).toUpperCase() + stat.slice(1)} ${value}`, es: `${stat === 'strength' ? 'Fuerza' : stat === 'agility' ? 'Agilidad' : stat === 'vitality' ? 'Vitalidad' : stat === 'intelligence' ? 'Inteligencia' : 'Fortuna'} ${value}` },
  description: { en: `Reach ${value} ${stat}.`, es: `Alcanza ${value} de ${stat === 'strength' ? 'Fuerza' : stat === 'agility' ? 'Agilidad' : stat === 'vitality' ? 'Vitalidad' : stat === 'intelligence' ? 'Inteligencia' : 'Fortuna'}.` },
  icon,
  rarity: getStatRarity(value),
  condition: (state) => state.stats[stat] >= value
});

const getDungeonRarity = (count: number): AchievementRarity => {
  if (count >= 500) return 'MYTHIC';
  if (count >= 200) return 'LEGENDARY';
  if (count >= 100) return 'EPIC';
  if (count >= 50) return 'RARE';
  if (count >= 10) return 'UNCOMMON';
  return 'COMMON';
};

const createDungeonAchievement = (count: number): Achievement => ({
  id: `dungeon_${count}`,
  category: 'COMBAT',
  title: { en: `Dungeon Raider ${count}`, es: `Asaltante de Mazmorras ${count}` },
  description: { en: `Clear ${count} Dungeons.`, es: `Completa ${count} Mazmorras.` },
  icon: 'Swords',
  rarity: getDungeonRarity(count),
  condition: (state) => state.dungeonRuns.filter(r => r.victory).length >= count
});

const getPowerRarity = (power: number): AchievementRarity => {
  if (power >= 1000000) return 'MYTHIC';
  if (power >= 500000) return 'LEGENDARY';
  if (power >= 250000) return 'EPIC';
  if (power >= 100000) return 'RARE';
  if (power >= 50000) return 'UNCOMMON';
  return 'COMMON';
};

const createPowerAchievement = (power: number): Achievement => ({
  id: `power_${power}`,
  category: 'COMBAT',
  title: { en: `Power ${power.toLocaleString()}`, es: `Poder ${power.toLocaleString()}` },
  description: { en: `Reach ${power.toLocaleString()} Total Power.`, es: `Alcanza ${power.toLocaleString()} de Poder Total.` },
  icon: 'Zap',
  rarity: getPowerRarity(power),
  condition: (state) => {
    const base = Object.values(state.stats).reduce((a, b) => typeof b === 'number' ? a + b : a, 0) * 10;
    return base >= power;
  }
});

export const ACHIEVEMENTS: Achievement[] = [
  // --- GENERAL (18) ---
  ...[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(createLevelAchievement),
  {
    id: 'first_login',
    category: 'GENERAL' as AchievementCategory,
    title: { en: 'Awakening', es: 'Despertar' },
    description: { en: 'Log in for the first time.', es: 'Inicia sesión por primera vez.' },
    icon: 'Eye',
    rarity: 'COMMON' as AchievementRarity,
    condition: () => true
  },
  ...[3, 7, 14, 30, 60, 90, 180, 365].map(days => ({
    id: `streak_${days}`,
    category: 'GENERAL' as AchievementCategory,
    title: { en: `${days} Day Streak`, es: `Racha de ${days} Días` },
    description: { en: `Maintain a login streak of ${days} days.`, es: `Mantén una racha de ${days} días.` },
    icon: 'Flame',
    rarity: (days >= 365 ? 'MYTHIC' : days >= 180 ? 'LEGENDARY' : days >= 90 ? 'EPIC' : days >= 30 ? 'RARE' : days >= 14 ? 'UNCOMMON' : 'COMMON') as AchievementRarity,
    condition: (state: AppState) => state.stats.streak >= days
  })),

  // --- COMBAT (22) ---
  ...[1, 5, 10, 25, 50, 100, 200, 500].map(createDungeonAchievement),
  ...[1, 5, 10, 25, 50].map(count => ({
    id: `boss_${count}`,
    category: 'COMBAT' as AchievementCategory,
    title: { en: `Boss Slayer ${count}`, es: `Matabosses ${count}` },
    description: { en: `Defeat ${count} Dungeon Bosses.`, es: `Derrota a ${count} Jefes de Mazmorra.` },
    icon: 'Skull',
    rarity: (count >= 50 ? 'LEGENDARY' : count >= 25 ? 'EPIC' : count >= 10 ? 'RARE' : count >= 5 ? 'UNCOMMON' : 'COMMON') as AchievementRarity,
    condition: (state: AppState) => state.dungeonRuns.filter(r => r.victory && !!r.bossId).length >= count
  })),
  ...[1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000].map(createPowerAchievement),

  // --- SHADOWS (12) ---
  {
    id: 'shadow_monarch_init',
    category: 'SHADOWS' as AchievementCategory,
    title: { en: 'Arise', es: 'Surge' },
    description: { en: 'Extract your first Shadow.', es: 'Extrae tu primera Sombra.' },
    icon: 'Moon',
    rarity: 'RARE' as AchievementRarity,
    condition: (state) => state.shadows.length > 0
  },
  ...[5, 10, 20, 30, 50, 100].map(count => ({
    id: `army_${count}`,
    category: 'SHADOWS' as AchievementCategory,
    title: { en: `Army of ${count}`, es: `Ejército de ${count}` },
    description: { en: `Extract ${count} Shadows.`, es: `Extrae ${count} Sombras.` },
    icon: 'Users',
    rarity: (count >= 100 ? 'MYTHIC' : count >= 50 ? 'LEGENDARY' : count >= 30 ? 'EPIC' : count >= 20 ? 'RARE' : count >= 10 ? 'UNCOMMON' : 'COMMON') as AchievementRarity,
    condition: (state: AppState) => state.shadows.length >= count
  })),
  ...['B', 'A', 'S', 'SS', 'SSS'].map(rank => ({
    id: `shadow_rank_${rank}`,
    category: 'SHADOWS' as AchievementCategory,
    title: { en: `${rank}-Rank Shadow`, es: `Sombra Rango ${rank}` },
    description: { en: `Obtain a ${rank}-Rank Shadow.`, es: `Obtén una Sombra de Rango ${rank}.` },
    icon: rank === 'SSS' ? 'Crown' : rank === 'S' ? 'Award' : 'Ghost',
    rarity: (rank === 'SSS' ? 'LEGENDARY' : rank === 'SS' ? 'EPIC' : rank === 'S' ? 'RARE' : rank === 'A' ? 'UNCOMMON' : 'COMMON') as AchievementRarity,
    condition: (state: AppState) => state.shadows.some(s => s.rank === rank)
  })),

  // --- GROWTH (30) ---
  ...[10, 25, 50, 75, 100].map(v => createStatAchievement('strength', v, 'Dumbbell')),
  ...[10, 25, 50, 75, 100].map(v => createStatAchievement('agility', v, 'Wind')),
  ...[10, 25, 50, 75, 100].map(v => createStatAchievement('vitality', v, 'Heart')),
  ...[10, 25, 50, 75, 100].map(v => createStatAchievement('intelligence', v, 'Brain')),
  ...[10, 25, 50, 75, 100].map(v => createStatAchievement('fortune', v, 'Sparkles')),
  ...[100, 200, 300, 400, 500].map(total => ({
    id: `total_stats_${total}`,
    category: 'GROWTH' as AchievementCategory,
    title: { en: `Total Stats ${total}`, es: `Estadísticas Totales ${total}` },
    description: { en: `Reach ${total} total stat points.`, es: `Alcanza ${total} puntos de estadística totales.` },
    icon: 'TrendingUp',
    rarity: (total >= 500 ? 'MYTHIC' : total >= 400 ? 'LEGENDARY' : total >= 300 ? 'EPIC' : total >= 200 ? 'RARE' : 'UNCOMMON') as AchievementRarity,
    condition: (state: AppState) => (state.stats.strength + state.stats.agility + state.stats.vitality + state.stats.intelligence + state.stats.fortune) >= total
  })),

  // --- COLLECTION (14) ---
  ...[100, 500, 1000, 5000, 10000].map(count => ({
    id: `shards_${count}`,
    category: 'COLLECTION' as AchievementCategory,
    title: { en: `Shard Hoarder ${count}`, es: `Acaparador de Fragmentos ${count}` },
    description: { en: `Collect ${count} Shards.`, es: `Recolecta ${count} Fragmentos.` },
    icon: 'Sparkles',
    rarity: (count >= 10000 ? 'LEGENDARY' : count >= 5000 ? 'EPIC' : count >= 1000 ? 'RARE' : count >= 500 ? 'UNCOMMON' : 'COMMON') as AchievementRarity,
    condition: (state: AppState) => (state.shards || 0) >= count
  })),
  ...[1, 3, 5, 10, 20].map(count => ({
    id: `titles_${count}`,
    category: 'COLLECTION' as AchievementCategory,
    title: { en: `Title Collector ${count}`, es: `Coleccionista de Títulos ${count}` },
    description: { en: `Unlock ${count} Titles.`, es: `Desbloquea ${count} Títulos.` },
    icon: 'Tag',
    rarity: (count >= 20 ? 'LEGENDARY' : count >= 10 ? 'EPIC' : count >= 5 ? 'RARE' : count >= 3 ? 'UNCOMMON' : 'COMMON') as AchievementRarity,
    condition: (state: AppState) => state.stats.unlockedTitleIds.length >= count
  })),
  ...[1, 3, 5, 10].map(count => ({
    id: `frames_${count}`,
    category: 'COLLECTION' as AchievementCategory,
    title: { en: `Frame Collector ${count}`, es: `Coleccionista de Marcos ${count}` },
    description: { en: `Unlock ${count} Avatar Frames.`, es: `Desbloquea ${count} Marcos de Avatar.` },
    icon: 'Image',
    rarity: (count >= 10 ? 'EPIC' : count >= 5 ? 'RARE' : count >= 3 ? 'UNCOMMON' : 'COMMON') as AchievementRarity,
    condition: (state: AppState) => state.stats.unlockedFrameIds.length >= count
  })),

  // --- MISSIONS (9) ---
  ...[10, 50, 100, 365].map(count => ({
    id: `daily_${count}`,
    category: 'MISSIONS' as AchievementCategory,
    title: { en: `Daily Discipline ${count}`, es: `Disciplina Diaria ${count}` },
    description: { en: `Complete ${count} Daily Quests.`, es: `Completa ${count} Misiones Diarias.` },
    icon: 'Calendar',
    rarity: (count >= 365 ? 'LEGENDARY' : count >= 100 ? 'EPIC' : count >= 50 ? 'RARE' : 'COMMON') as AchievementRarity,
    condition: (state: AppState) => (state.questHistory || []).reduce((acc, day) => acc + day.questsCompleted, 0) >= count
  })),
  ...[10, 50, 100, 500, 1000].map(count => ({
    id: `mission_${count}`,
    category: 'MISSIONS' as AchievementCategory,
    title: { en: `Mission Expert ${count}`, es: `Experto en Misiones ${count}` },
    description: { en: `Complete ${count} total missions.`, es: `Completa ${count} misiones en total.` },
    icon: 'CheckCircle',
    rarity: (count >= 1000 ? 'LEGENDARY' : count >= 500 ? 'EPIC' : count >= 100 ? 'RARE' : count >= 50 ? 'UNCOMMON' : 'COMMON') as AchievementRarity,
    condition: (state: AppState) => state.missions.filter(m => m.lastCompletedAt).length >= count // Approximate, ideally track total completed in stats
  }))
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