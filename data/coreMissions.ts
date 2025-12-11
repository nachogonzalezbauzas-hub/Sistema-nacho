import { Mission } from '../types';

export const CORE_MISSIONS: Mission[] = [
    // --- GYM (Mon, Wed, Fri) ---
    {
        id: 'core_gym_workout',
        title: 'Gym Workout',
        detail: 'Complete your scheduled gym session.',
        targetStat: 'Strength',
        xpReward: 100,
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
        xpReward: 80,
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
        xpReward: 40,
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
        xpReward: 30,
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
        xpReward: 30,
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
        xpReward: 20,
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
        xpReward: 20,
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
        xpReward: 20,
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
        xpReward: 50,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        streak: 0
    },
    {
        id: 'core_work',
        title: 'Ir a trabajar',
        detail: 'Jornada laboral de Lunes a Viernes.',
        targetStat: 'Fortune',
        xpReward: 150,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'daily',
        daysOfWeek: [1, 2, 3, 4, 5], // Mon, Tue, Wed, Thu, Fri
        streak: 0
    },
    // --- MIND & SPIRIT ---
    {
        id: 'core_read_10_pages',
        title: 'Leer 10 Páginas',
        detail: 'Expande tu conocimiento. Lee 10 páginas de un libro.',
        targetStat: 'Intelligence',
        xpReward: 60,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        streak: 0
    },
    {
        id: 'core_meditate',
        title: 'Meditar',
        detail: 'Despeja tu mente. Medita por al menos 10 minutos.',
        targetStat: 'Intelligence',
        xpReward: 60,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        streak: 0
    },
    {
        id: 'core_tidy_room',
        title: 'Ordenar Habitación',
        detail: 'Mantén tu entorno ordenado para una mente clara.',
        targetStat: 'Fortune',
        xpReward: 40,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        streak: 0
    },
    {
        id: 'core_sleep_pill',
        title: 'Tomar pastilla dormir',
        detail: 'Hábito nocturno para asegurar un buen descanso.',
        targetStat: 'Vitality',
        xpReward: 30,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        streak: 0
    },
    {
        id: 'core_no_night_snack',
        title: 'No comer de noche',
        detail: 'Controlar la ansiedad nocturna. No comer nada tarde.',
        targetStat: 'Intelligence',
        xpReward: 60,
        isDaily: true,
        lastCompletedAt: null,
        frequency: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        streak: 0
    }
];
