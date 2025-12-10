import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { AppState, CalendarDayData, Mission } from '../types';

export const getCalendarDays = (currentDate: Date) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({
        start: startDate,
        end: endDate,
    });
};

export const formatDateKey = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
};

export const computeCalendar = (state: AppState): Record<string, CalendarDayData> => {
    const events: Record<string, CalendarDayData> = {};

    // Helper to get or create day data
    const getDay = (dateKey: string): CalendarDayData => {
        if (!events[dateKey]) {
            events[dateKey] = {
                date: dateKey,
                missions: [],
                journal: [],
                xpGained: 0,
                streak: 0, // We'll try to infer this or leave it as snapshot if available
                efficiency: 0
            };
        }
        return events[dateKey];
    };

    // 1. Map Missions (using lastCompletedAt is tricky for history, 
    // but we can look at logs for historical mission completions if we want accurate history.
    // For now, we'll use the logs since they have timestamps)
    state.logs.forEach(log => {
        if (log.category === 'Mission' || log.category === 'System' || log.category === 'Health') {
            const dateKey = formatDateKey(parseISO(log.timestamp));
            const day = getDay(dateKey);

            if (log.category === 'Mission') {
                // We might not have the full mission object here easily without parsing description
                // But we can track XP
                if (log.xpChange) day.xpGained += log.xpChange;
            }
        }
    });

    // 2. Map Body Records (these are reliable for dates)
    state.bodyRecords.forEach(record => {
        const dateKey = formatDateKey(parseISO(record.date));
        const day = getDay(dateKey);
        day.health = record;
    });

    // 3. Map Journal Entries
    state.journalEntries.forEach(entry => {
        const dateKey = formatDateKey(parseISO(entry.date));
        const day = getDay(dateKey);
        if (!day.journal) day.journal = [];
        day.journal.push(entry);
    });

    // 4. Map Daily Activity (U17.1) - This is the BEST source for recent history
    Object.entries(state.dailyActivity || {}).forEach(([dateString, activity]) => {
        // dateString from U17.1 is date.toDateString() which is "Mon Dec 02 2025"
        // We need to parse it carefully.
        const date = new Date(dateString);
        const dateKey = formatDateKey(date);
        const day = getDay(dateKey);

        day.xpGained = Math.max(day.xpGained, activity.xpGained); // Take the max to avoid double counting if we used logs
        // We don't have the list of missions here, but we have the count.
    });

    // 5. Calculate Efficiency
    Object.values(events).forEach(day => {
        const missionsScore = (day.missions.length * 4); // Placeholder as we might not have full mission list for old dates
        const healthScore = day.health?.healthScore ? (day.health.healthScore / 10) : 0;
        // Streak is hard to reconstruct perfectly without snapshots, so we'll omit or approximate

        // Use activity score if available
        let score = missionsScore + healthScore;

        // Cap at 100
        day.efficiency = Math.min(100, score);
    });

    return events;
};
