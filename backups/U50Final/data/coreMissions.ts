import { Mission } from '../types';

export const CORE_MISSIONS: Mission[] = [
    // --- GYM (Mon, Wed, Fri) ---
    {
        id: 'core_gym_workout',
        title: 'Gym Workout',
        detail: 'Complete your scheduled gym session.',
        targetStat: 'Strength',
        xpReward: 50,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'weekly',
        daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
        streak: 0
    },
    // --- RUNNING (Tue, Thu) ---
    {
        id: 'core_running',
        title: 'Running Session',
        detail: 'Go for a run.',
        targetStat: 'Agility',
        xpReward: 40,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'weekly',
        daysOfWeek: [2, 4], // Tue, Thu
        streak: 0
    },
    // --- GROOMING (Fri) ---
    {
        id: 'core_shave',
        title: 'Shave',
        detail: 'Clean shave or trim beard.',
        targetStat: 'Fortune',
        xpReward: 20,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'weekly',
        daysOfWeek: [5], // Fri
        streak: 0
    },
    {
        id: 'core_eyebrows',
        title: 'Eyebrow Maintenance',
        detail: 'Trim and shape eyebrows.',
        targetStat: 'Fortune',
        xpReward: 15,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'weekly',
        daysOfWeek: [5], // Fri
        streak: 0
    },
    // --- DAILY HABITS ---
    {
        id: 'core_skincare',
        title: 'Skincare Routine',
        detail: 'Cleanse, tone, and moisturize.',
        targetStat: 'Vitality',
        xpReward: 15,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        streak: 0
    },
    {
        id: 'core_teeth_morning',
        title: 'Brush Teeth (Morning)',
        detail: 'Morning oral hygiene.',
        targetStat: 'Vitality',
        xpReward: 10,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        streak: 0
    },
    {
        id: 'core_teeth_afternoon',
        title: 'Brush Teeth (Afternoon)',
        detail: 'After-lunch oral hygiene.',
        targetStat: 'Vitality',
        xpReward: 10,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        streak: 0
    },
    {
        id: 'core_teeth_night',
        title: 'Brush Teeth (Night)',
        detail: 'Nightly oral hygiene.',
        targetStat: 'Vitality',
        xpReward: 10,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        streak: 0
    },
    {
        id: 'core_no_bite_nails',
        title: 'No Nail Biting',
        detail: 'Do not bite your nails today.',
        targetStat: 'Intelligence', // Self-control
        xpReward: 25,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        streak: 0
    }
];
