
import { StatType } from '../types';

export type MissionTemplateCategory = "Habit" | "Milestone";

export type MissionTemplate = {
  id: string;
  label: string;
  description: string;
  targetStat: StatType;
  xpReward: number;
  isDaily: boolean;
  category: MissionTemplateCategory;
};

export const MISSION_TEMPLATES: MissionTemplate[] = [
  // --- HABITS (Daily Grind) ---
  {
    id: "habit-gym",
    label: "Strength Training",
    description: "Complete a hypertrophy or strength workout session.",
    targetStat: "Strength",
    xpReward: 25,
    isDaily: true,
    category: "Habit",
  },
  {
    id: "habit-cardio",
    label: "High Intensity Cardio",
    description: "Run, HIIT or intense movement session > 30 mins.",
    targetStat: "Agility",
    xpReward: 20,
    isDaily: true,
    category: "Habit",
  },
  {
    id: "habit-sleep",
    label: "Perfect Sleep",
    description: "Sleep 8 hours and wake up at target time.",
    targetStat: "Vitality",
    xpReward: 15,
    isDaily: true,
    category: "Habit",
  },
  {
    id: "habit-read",
    label: "Read 20 Pages",
    description: "Read a non-fiction book to increase knowledge.",
    targetStat: "Intelligence",
    xpReward: 15,
    isDaily: true,
    category: "Habit",
  },
  {
    id: "habit-save",
    label: "Save / Invest",
    description: "Transfer money to savings or investment account.",
    targetStat: "Fortune",
    xpReward: 10,
    isDaily: true,
    category: "Habit",
  },
  {
    id: "habit-diet",
    label: "Clean Eating",
    description: "No sugar, no processed food for the whole day.",
    targetStat: "Metabolism",
    xpReward: 20,
    isDaily: true,
    category: "Habit",
  },

  // --- MILESTONES (Big Goals) ---
  {
    id: "milestone-pr",
    label: "New Gym PR",
    description: "Break a personal record in a compound lift.",
    targetStat: "Strength",
    xpReward: 100,
    isDaily: false,
    category: "Milestone",
  },
  {
    id: "milestone-course",
    label: "Finish Course",
    description: "Complete a full online certification or course.",
    targetStat: "Intelligence",
    xpReward: 150,
    isDaily: false,
    category: "Milestone",
  },
  {
    id: "milestone-income",
    label: "Income Goal",
    description: "Reach a specific monthly income target.",
    targetStat: "Fortune",
    xpReward: 200,
    isDaily: false,
    category: "Milestone",
  },
  {
    id: "milestone-fast",
    label: "24h Fast",
    description: "Complete a full 24-hour water fast.",
    targetStat: "Metabolism",
    xpReward: 80,
    isDaily: false,
    category: "Milestone",
  },
];
