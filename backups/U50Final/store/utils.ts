import { LogEntry, LogCategory, Mission } from '@/types';

export const isMissionAvailableToday = (mission: Mission, today: Date): boolean => {
    if (!mission.frequency || mission.frequency === 'always') return true;
    if (mission.daysOfWeek && mission.daysOfWeek.length > 0) {
        const dayIndex = today.getDay();
        if (!mission.daysOfWeek.includes(dayIndex)) return false;
    }
    if (mission.frequency === 'daily' && (!mission.daysOfWeek || mission.daysOfWeek.length === 0)) return true;
    if (mission.frequency === 'weekly' && (!mission.daysOfWeek || mission.daysOfWeek.length === 0)) return true;
    return true;
};

export const createLog = (category: LogCategory, message: string, details: string, extras?: Partial<LogEntry>): LogEntry => {
    return {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        category,
        message,
        details,
        ...extras
    };
};

export const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

export const getDateKey = (date = new Date()) => date.toDateString();
