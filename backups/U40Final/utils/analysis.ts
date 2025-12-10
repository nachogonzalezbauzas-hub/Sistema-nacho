import { AppState, StatType, Mission } from '../types';

// --- TYPES ---

export interface RecentActivity {
    missionsCompleted: number;
    dailyMissionsCompleted: number;
    uniqueDaysActive: number;
    avgSleepLast7: number | null;
    weightDeltaLast7: number | null;
}

export interface StatFocus {
    strongestStat: StatType;
    weakestStat: StatType;
    needsAttention: StatType[];
}

export interface SystemReport {
    grade: 'S' | 'A' | 'B' | 'C' | 'D';
    label: string;
    message: string;
    activity: RecentActivity;
    stats: StatFocus;
}

export interface RecommendedMissionTemplate {
    title: string;
    detail: string;
    targetStat: StatType;
    xpReward: number;
    isDaily: boolean;
}

// --- HELPERS ---

const STAT_ORDER: StatType[] = ['Strength', 'Vitality', 'Agility', 'Intelligence', 'Fortune', 'Metabolism'];

// --- ANALYSIS FUNCTIONS ---

export const getRecentActivity = (state: AppState, days: number = 7): RecentActivity => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Filter missions completed in window
    const recentMissions = state.missions.filter(m =>
        m.lastCompletedAt && new Date(m.lastCompletedAt) >= cutoff
    );

    const missionsCompleted = recentMissions.length;
    const dailyMissionsCompleted = recentMissions.filter(m => m.isDaily).length;

    // Unique days active (missions + body records)
    const activeDates = new Set<string>();

    recentMissions.forEach(m => {
        if (m.lastCompletedAt) activeDates.add(new Date(m.lastCompletedAt).toDateString());
    });

    const recentBodyRecords = state.bodyRecords.filter(r => new Date(r.date) >= cutoff);
    recentBodyRecords.forEach(r => {
        activeDates.add(new Date(r.date).toDateString());
    });

    const uniqueDaysActive = activeDates.size;

    // Health Metrics
    let avgSleepLast7: number | null = null;
    let weightDeltaLast7: number | null = null;

    if (recentBodyRecords.length > 0) {
        const totalSleep = recentBodyRecords.reduce((acc, r) => acc + r.sleepHours, 0);
        avgSleepLast7 = totalSleep / recentBodyRecords.length;

        // Sort by date asc
        const sortedRecords = [...recentBodyRecords].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        if (sortedRecords.length >= 2) {
            const first = sortedRecords[0];
            const last = sortedRecords[sortedRecords.length - 1];
            weightDeltaLast7 = last.weight - first.weight;
        }
    }

    return {
        missionsCompleted,
        dailyMissionsCompleted,
        uniqueDaysActive,
        avgSleepLast7,
        weightDeltaLast7
    };
};

export const getStatFocus = (state: AppState): StatFocus => {
    const { stats } = state;
    const values = STAT_ORDER.map(s => ({
        stat: s,
        val: stats[s.toLowerCase() as keyof typeof stats] as number
    }));

    // Sort desc
    values.sort((a, b) => b.val - a.val);

    const strongestStat = values[0].stat;
    const weakestStat = values[values.length - 1].stat;
    const highestVal = values[0].val;

    // Needs attention: < 15 OR < 70% of highest
    const needsAttention = values
        .filter(v => v.val < 15 || v.val < (highestVal * 0.7))
        .map(v => v.stat);

    return {
        strongestStat,
        weakestStat,
        needsAttention
    };
};

export const getSystemGrade = (state: AppState): SystemReport => {
    const activity = getRecentActivity(state);
    const stats = getStatFocus(state);

    // Scoring Logic (0-100)
    let score = 0;

    // 1. Consistency (Max 40)
    // 7 days active = 40pts
    score += Math.min(40, (activity.uniqueDaysActive / 7) * 40);

    // 2. Volume (Max 40)
    // 20 missions = 40pts
    score += Math.min(40, (activity.missionsCompleted / 20) * 40);

    // 3. Streak Bonus (Max 20)
    if (state.stats.streak > 7) score += 20;
    else if (state.stats.streak > 3) score += 10;

    let grade: SystemReport['grade'] = 'D';
    let label = 'Unawakened';
    let message = 'The system awaits your action.';

    if (score >= 90) {
        grade = 'S';
        label = 'Monarch Candidate';
        message = 'Exceptional performance. You are dominating the system.';
    } else if (score >= 75) {
        grade = 'A';
        label = 'Elite Hunter';
        message = 'Strong consistency. Push harder to reach the apex.';
    } else if (score >= 50) {
        grade = 'B';
        label = 'Active Hunter';
        message = 'Good foundation. Maintain your streak to evolve.';
    } else if (score >= 25) {
        grade = 'C';
        label = 'Novice';
        message = 'You are awake. Consistency is key to survival.';
    } else {
        grade = 'D';
        label = 'Civilian';
        message = 'Warning: Low activity detected. The system requires effort.';
    }

    return {
        grade,
        label,
        message,
        activity,
        stats
    };
};

export const getRecommendedFocusStats = (state: AppState): StatType[] => {
    const { needsAttention, weakestStat } = getStatFocus(state);

    // Prioritize needsAttention, fallback to weakest
    let focus = [...needsAttention];
    if (focus.length === 0) focus = [weakestStat];

    // Limit to 3
    return focus.slice(0, 3);
};

export const buildRecommendedMissions = (state: AppState): RecommendedMissionTemplate[] => {
    const focusStats = getRecommendedFocusStats(state);
    const templates: RecommendedMissionTemplate[] = [];

    focusStats.forEach(stat => {
        // Generate 1-2 missions per focus stat
        switch (stat) {
            case 'Strength':
                templates.push({
                    title: 'Push Limit',
                    detail: 'Complete 50 Push-ups in one set.',
                    targetStat: 'Strength',
                    xpReward: 150,
                    isDaily: true
                });
                break;
            case 'Vitality':
                templates.push({
                    title: 'Endurance Run',
                    detail: 'Run 5km without stopping.',
                    targetStat: 'Vitality',
                    xpReward: 200,
                    isDaily: false
                });
                break;
            case 'Agility':
                templates.push({
                    title: 'Speed Drills',
                    detail: '10 mins of high-intensity interval sprints.',
                    targetStat: 'Agility',
                    xpReward: 120,
                    isDaily: true
                });
                break;
            case 'Intelligence':
                templates.push({
                    title: 'Mental Sharpening',
                    detail: 'Read 20 pages of a non-fiction book.',
                    targetStat: 'Intelligence',
                    xpReward: 100,
                    isDaily: true
                });
                break;
            case 'Fortune':
                templates.push({
                    title: 'Risk Assessment',
                    detail: 'Plan your week ahead or review goals.',
                    targetStat: 'Fortune',
                    xpReward: 80,
                    isDaily: false
                });
                break;
            case 'Metabolism':
                templates.push({
                    title: 'Clean Fuel',
                    detail: 'Eat 3 clean meals with no processed sugar.',
                    targetStat: 'Metabolism',
                    xpReward: 100,
                    isDaily: true
                });
                break;
        }
    });

    // Fill with generic if empty
    if (templates.length < 3) {
        templates.push({
            title: 'Daily Training',
            detail: 'Complete the daily workout routine.',
            targetStat: 'Strength',
            xpReward: 100,
            isDaily: true
        });
    }

    return templates.slice(0, 5);
};
