import { Milestone } from '../types';

export const LIFE_GOALS: Milestone[] = [
    {
        id: 'epic_car',
        title: 'Project: Dream Machine',
        description: 'Acquire a vehicle that matches your status. A symbol of freedom and power.',
        category: 'Lifestyle',
        createdAt: new Date().toISOString(),
        phases: [
            {
                id: 'car_p1',
                title: 'Financial Foundation',
                description: 'Save initial capital. Every deposit counts.',
                requiredActions: 10,
                completedActions: 0,
                isCompleted: false
            },
            {
                id: 'car_p2',
                title: 'Market Research',
                description: 'Identify the target vehicle. Compare options.',
                requiredActions: 5,
                completedActions: 0,
                isCompleted: false
            },
            {
                id: 'car_p3',
                title: 'Acquisition',
                description: 'Finalize the purchase. Sign the deal.',
                requiredActions: 1,
                completedActions: 0,
                isCompleted: false
            }
        ],
        currentPhaseIndex: 0,
        isCompleted: false,
        progressPercent: 0,
        reward: {
            xpBonus: 5000,
            statBonus: { fortune: 50 },
            unlockTitleId: 'highway_monarch'
        }
    },
    {
        id: 'epic_ortho',
        title: 'Project: Perfect Smile',
        description: 'Correct dental alignment for optimal aesthetics and health.',
        category: 'Health',
        createdAt: new Date().toISOString(),
        phases: [
            {
                id: 'ortho_p1',
                title: 'Consultation & Setup',
                description: 'Initial appointments and appliance installation.',
                requiredActions: 3,
                completedActions: 0,
                isCompleted: false
            },
            {
                id: 'ortho_p2',
                title: 'The Long Haul',
                description: 'Monthly adjustments and maintenance. Keep going.',
                requiredActions: 12, // e.g. 12 months/visits
                completedActions: 0,
                isCompleted: false
            },
            {
                id: 'ortho_p3',
                title: 'Retention',
                description: 'Final removal and retainer fitting.',
                requiredActions: 1,
                completedActions: 0,
                isCompleted: false
            }
        ],
        currentPhaseIndex: 0,
        isCompleted: false,
        progressPercent: 0,
        reward: {
            xpBonus: 3000,
            statBonus: { vitality: 30, fortune: 10 } // Confidence boost
        }
    },
    {
        id: 'epic_jaw',
        title: 'Project: Iron Jaw',
        description: 'Maxillofacial enhancement for structural perfection.',
        category: 'Health',
        createdAt: new Date().toISOString(),
        phases: [
            {
                id: 'jaw_p1',
                title: 'Pre-Op Preparation',
                description: 'Medical clearance and planning.',
                requiredActions: 5,
                completedActions: 0,
                isCompleted: false
            },
            {
                id: 'jaw_p2',
                title: 'The Procedure',
                description: 'Undergo the surgery.',
                requiredActions: 1,
                completedActions: 0,
                isCompleted: false
            },
            {
                id: 'jaw_p3',
                title: 'Recovery & Adaptation',
                description: 'Heal and adapt to the new structure.',
                requiredActions: 10, // Recovery days/milestones
                completedActions: 0,
                isCompleted: false
            }
        ],
        currentPhaseIndex: 0,
        isCompleted: false,
        progressPercent: 0,
        reward: {
            xpBonus: 8000,
            statBonus: { strength: 40, vitality: 40 }
        }
    },
    {
        id: 'epic_physique',
        title: 'Project: God Physique',
        description: 'Sculpt a body worthy of a Monarch.',
        category: 'Health',
        createdAt: new Date().toISOString(),
        phases: [
            {
                id: 'phys_p1',
                title: 'Foundation',
                description: 'Build the base muscle mass and strength.',
                requiredActions: 20, // Workouts
                completedActions: 0,
                isCompleted: false
            },
            {
                id: 'phys_p2',
                title: 'Definition',
                description: 'Refine and cut. Reveal the work.',
                requiredActions: 20,
                completedActions: 0,
                isCompleted: false
            },
            {
                id: 'phys_p3',
                title: 'Peak Performance',
                description: 'Reach your absolute limit.',
                requiredActions: 10,
                completedActions: 0,
                isCompleted: false
            }
        ],
        currentPhaseIndex: 0,
        isCompleted: false,
        progressPercent: 0,
        reward: {
            xpBonus: 10000,
            statBonus: { strength: 50, agility: 50, vitality: 30 }
        }
    }
];
