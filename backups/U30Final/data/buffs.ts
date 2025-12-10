
import { BuffDefinition, PassiveDefinition } from '../types';

export const BUFF_DEFINITIONS: BuffDefinition[] = [
  {
    id: 'coffee_focus',
    name: 'Coffee Focus',
    description: 'Increases Intelligence and XP Gain.',
    icon: '☕',
    durationMinutes: 60,
    statModifiers: { Intelligence: 5 },
    xpMultiplier: 1.1
  },
  {
    id: 'gym_boost',
    name: 'Gym Pump',
    description: 'Temporary surge in Strength and Vitality.',
    icon: '🏋️',
    durationMinutes: 90,
    statModifiers: { Strength: 5, Vitality: 3 }
  },
  {
    id: 'social_charm',
    name: 'Social Charm',
    description: 'Boosts Agility and Fortune.',
    icon: '✨',
    durationMinutes: 120,
    statModifiers: { Agility: 3, Fortune: 2 }
  },
  {
    id: 'lucky_day',
    name: 'Lucky Day',
    description: 'Significant boost to XP gain.',
    icon: '🍀',
    durationMinutes: 180,
    xpMultiplier: 1.2
  },
  {
    id: 'inner_flame_boost',
    name: 'Inner Flame',
    description: 'Metabolism overdrive.',
    icon: '🔥',
    durationMinutes: 45,
    statModifiers: { Metabolism: 10 }
  }
];

export const PASSIVE_DEFINITIONS: PassiveDefinition[] = [
  {
    id: 'iron_muscle',
    name: 'Iron Muscle',
    description: 'Permanently increases Strength.',
    icon: '🛡️',
    maxLevel: 10,
    costPerLevel: 1,
    statBonusesPerLevel: { Strength: 2 }
  },
  {
    id: 'phoenix_body',
    name: 'Phoenix Body',
    description: 'Permanently increases Vitality.',
    icon: '❤️‍🔥',
    maxLevel: 10,
    costPerLevel: 1,
    statBonusesPerLevel: { Vitality: 2 }
  },
  {
    id: 'quick_feet',
    name: 'Quick Feet',
    description: 'Permanently increases Agility.',
    icon: '⚡',
    maxLevel: 10,
    costPerLevel: 1,
    statBonusesPerLevel: { Agility: 2 }
  },
  {
    id: 'sharp_mind',
    name: 'Sharp Mind',
    description: 'Permanently increases Intelligence.',
    icon: '🧠',
    maxLevel: 10,
    costPerLevel: 1,
    statBonusesPerLevel: { Intelligence: 2 }
  },
  {
    id: 'lucky_instinct',
    name: 'Lucky Instinct',
    description: 'Permanently increases Fortune.',
    icon: '🎲',
    maxLevel: 10,
    costPerLevel: 1,
    statBonusesPerLevel: { Fortune: 2 }
  },
  {
    id: 'inner_engine',
    name: 'Inner Engine',
    description: 'Permanently increases Metabolism.',
    icon: '🔥',
    maxLevel: 10,
    costPerLevel: 1,
    statBonusesPerLevel: { Metabolism: 2 }
  }
];
