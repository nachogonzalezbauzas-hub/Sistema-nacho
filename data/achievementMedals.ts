// Medal image mappings for achievements
// Maps achievement IDs to their medal image paths

export const ACHIEVEMENT_MEDALS: Record<string, string> = {
    // Level achievements
    'level_10': '/medals/medal_level_blue.png',
    'level_20': '/medals/medal_level_blue.png',
    'level_30': '/medals/medal_level_blue.png',
    'level_40': '/medals/medal_level_blue.png',
    'level_50': '/medals/medal_level_purple.png', // Epic
    'level_60': '/medals/medal_level_purple.png',
    'level_70': '/medals/medal_level_purple.png', // Legendary
    'level_80': '/medals/medal_level_mythic.png', // Mythic
    'level_90': '/medals/medal_level_mythic.png',
    'level_100': '/medals/medal_level_mythic.png',

    // First login
    'first_login': '/medals/medal_first_login.png',

    // Combat - Dungeons
    'dungeon_1': '/medals/medal_dungeon_rare.png',
    'dungeon_5': '/medals/medal_dungeon_rare.png',
    'dungeon_10': '/medals/medal_dungeon_rare.png',
    'dungeon_25': '/medals/medal_dungeon_rare.png',
    'dungeon_50': '/medals/medal_dungeon_rare.png',
    'dungeon_100': '/medals/medal_dungeon_epic.png',
    'dungeon_200': '/medals/medal_dungeon_epic.png',
    'dungeon_500': '/medals/medal_dungeon_epic.png',

    // Combat - Bosses
    'boss_1': '/medals/medal_boss_legendary.png',
    'boss_5': '/medals/medal_boss_legendary.png',
    'boss_10': '/medals/medal_boss_legendary.png',
    'boss_25': '/medals/medal_boss_legendary.png',
    'boss_50': '/medals/medal_boss_legendary.png',

    // Streak achievements
    'streak_3': '/medals/medal_streak_blue.png',
    'streak_7': '/medals/medal_streak_blue.png',
    'streak_14': '/medals/medal_streak_blue.png',
    'streak_30': '/medals/medal_streak_blue.png',
    'streak_60': '/medals/medal_streak_gold.png',
    'streak_90': '/medals/medal_streak_gold.png',
    'streak_180': '/medals/medal_streak_gold.png',
    'streak_365': '/medals/medal_streak_mythic.png',
};

// Get medal image for an achievement, with fallback
export const getMedalImage = (achievementId: string): string | null => {
    // Return specific image if exists
    if (ACHIEVEMENT_MEDALS[achievementId]) {
        return ACHIEVEMENT_MEDALS[achievementId];
    }

    // Fallbacks
    if (achievementId.startsWith('dungeon_')) return '/medals/medal_dungeon_rare.png';
    if (achievementId.startsWith('boss_')) return '/medals/medal_boss_legendary.png';

    return null;
};
