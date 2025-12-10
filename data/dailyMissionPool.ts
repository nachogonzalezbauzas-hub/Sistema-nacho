import { StatType } from '../types';

export interface DailyMissionTemplate {
    title: string;
    detail: string;
    targetStat: StatType;
    xpReward: number;
}

export const DAILY_MISSION_POOL: DailyMissionTemplate[] = [
    // --- PHYSICAL (Strength/Agility/Vitality) ---
    { title: '30-Minute Jog', detail: 'Go for a 30-minute brisk walk or jog.', targetStat: 'Agility', xpReward: 300 },
    { title: 'Bodyweight Circuit', detail: '10 min workout: squats, push-ups, planks.', targetStat: 'Strength', xpReward: 250 },
    { title: 'Hydration Goal', detail: 'Drink 8 glasses of water today.', targetStat: 'Vitality', xpReward: 150 },
    { title: 'Stretching', detail: '15 minutes of full-body stretching.', targetStat: 'Agility', xpReward: 200 },
    { title: 'Healthy Lunch', detail: 'Prepare a healthy lunch instead of ordering out.', targetStat: 'Vitality', xpReward: 200 },
    { title: 'Jumping Jacks', detail: 'Do 50 jumping jacks to get heart rate up.', targetStat: 'Agility', xpReward: 150 },
    { title: 'Cold Finish', detail: 'End your shower with 30 seconds of cold water.', targetStat: 'Vitality', xpReward: 200 },
    { title: 'Push-ups', detail: 'Complete 25 push-ups (sets allowed).', targetStat: 'Strength', xpReward: 250 },
    { title: 'Plank Challenge', detail: 'Hold a plank for 2 minutes total.', targetStat: 'Strength', xpReward: 250 },

    // --- MENTAL (Intelligence/Fortune) ---
    { title: 'Meditation', detail: 'Practice 10 minutes of guided meditation.', targetStat: 'Intelligence', xpReward: 250 },
    { title: 'Gratitude Journal', detail: 'Write down 3 things you are grateful for.', targetStat: 'Fortune', xpReward: 200 },
    { title: 'Reading', detail: 'Read a chapter of a book.', targetStat: 'Intelligence', xpReward: 300 },
    { title: 'No Social Media', detail: 'Avoid social media for 2 hours straight.', targetStat: 'Intelligence', xpReward: 300 },
    { title: 'Learn Something', detail: 'Watch a 15-min educational video.', targetStat: 'Intelligence', xpReward: 250 },
    { title: 'Brain Dump', detail: 'Write down everything on your mind to clear it.', targetStat: 'Intelligence', xpReward: 200 },

    // --- PRODUCTIVITY (Intelligence) ---
    { title: 'Deep Work', detail: '90 minutes of uninterrupted work/study.', targetStat: 'Intelligence', xpReward: 500 },
    { title: 'Declutter', detail: 'Clean one small area of your room/desk.', targetStat: 'Fortune', xpReward: 200 },
    { title: 'Plan Tomorrow', detail: 'Write down your top 3 tasks for tomorrow.', targetStat: 'Intelligence', xpReward: 150 },
    { title: 'Inbox Zero', detail: 'Clear your email inbox or notifications.', targetStat: 'Intelligence', xpReward: 250 },

    // --- CODING (Intelligence) ---
    { title: 'LeetCode Problem', detail: 'Solve one easy/medium algorithm problem.', targetStat: 'Intelligence', xpReward: 400 },
    { title: 'Refactor Code', detail: 'Spend 20 mins cleaning up old code.', targetStat: 'Intelligence', xpReward: 300 },
    { title: 'Read Docs', detail: 'Read documentation for a tool you use.', targetStat: 'Intelligence', xpReward: 250 },
    { title: 'Git Clean', detail: 'Organize your branches or commits.', targetStat: 'Intelligence', xpReward: 200 }
];
