
import { StatType, Passive, UserStats, Buff } from './types';

export const INITIAL_PASSIVES: Passive[] = [
  {
    id: 'iron_muscle',
    name: 'Iron Muscle',
    description: 'Increases Strength by 5% per level.',
    stat: 'Strength',
    level: 0,
    bonusPerLevel: 0.05,
    maxLevel: 5
  },
  {
    id: 'phoenix_heart',
    name: 'Phoenix Heart',
    description: 'Increases Vitality by 5% per level.',
    stat: 'Vitality',
    level: 0,
    bonusPerLevel: 0.05,
    maxLevel: 5
  },
  {
    id: 'lightning_step',
    name: 'Lightning Step',
    description: 'Increases Agility by 5% per level.',
    stat: 'Agility',
    level: 0,
    bonusPerLevel: 0.05,
    maxLevel: 5
  },
  {
    id: 'mind_eye',
    name: 'Mind Eye',
    description: 'Increases Intelligence by 5% per level.',
    stat: 'Intelligence',
    level: 0,
    bonusPerLevel: 0.05,
    maxLevel: 5
  },
  {
    id: 'midas_touch',
    name: 'Midas Touch',
    description: 'Increases Fortune by 5% per level.',
    stat: 'Fortune',
    level: 0,
    bonusPerLevel: 0.05,
    maxLevel: 5
  },
  {
    id: 'blue_flame',
    name: 'Blue Flame',
    description: 'Increases Metabolism by 5% per level.',
    stat: 'Metabolism',
    level: 0,
    bonusPerLevel: 0.05,
    maxLevel: 5
  }
];

export const calculateEffectiveStat = (stats: UserStats, statName: StatType): number => {
  // 1. Base Value
  let value = 0;
  switch (statName) {
    case 'Strength': value = stats.strength; break;
    case 'Vitality': value = stats.vitality; break;
    case 'Agility': value = stats.agility; break;
    case 'Intelligence': value = stats.intelligence; break;
    case 'Fortune': value = stats.fortune; break;
    case 'Metabolism': value = stats.metabolism; break;
  }

  // 2. Passive Multiplier
  // Find the passive definition for this stat
  const passiveDef = INITIAL_PASSIVES.find(p => p.stat === statName);
  if (passiveDef) {
    const currentLevel = stats.passives[passiveDef.id] || 0;
    const multiplier = 1 + (currentLevel * passiveDef.bonusPerLevel);
    value = Math.floor(value * multiplier);
  }

  // 3. Active Buffs
  const now = new Date();
  const activeBuffs = stats.buffs.filter(b => 
    b.stat === statName && new Date(b.expiresAt) > now
  );
  
  const buffTotal = activeBuffs.reduce((sum, b) => sum + b.amount, 0);
  
  return value + buffTotal;
};

export const getPassiveDef = (id: string): Passive | undefined => {
  return INITIAL_PASSIVES.find(p => p.id === id);
};
