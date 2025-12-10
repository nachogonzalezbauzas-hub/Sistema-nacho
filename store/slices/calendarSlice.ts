import { StateCreator } from 'zustand';
import { GameStore } from '@/store/useStore';
import { UserEvent } from '@/types';
import { createLog } from '@/store/utils';
import { v4 as uuidv4 } from 'uuid';

export interface CalendarSlice {
    addUserEvent: (event: Omit<UserEvent, 'id' | 'isCompleted'>) => void;
    removeUserEvent: (id: string) => void;
    toggleUserEvent: (id: string) => void;
}

export const createCalendarSlice: StateCreator<GameStore, [], [], CalendarSlice> = (set) => ({
    addUserEvent: (event) => set((store) => {
        const newEvent: UserEvent = {
            id: uuidv4(),
            ...event,
            isCompleted: false
        };

        const newLog = createLog('Sistema', 'Evento Programado', `Nuevo evento: ${event.title} el ${new Date(event.date).toLocaleDateString()}`);

        return {
            state: {
                ...store.state,
                userEvents: [...store.state.userEvents, newEvent],
                logs: [newLog, ...store.state.logs]
            }
        };
    }),

    removeUserEvent: (id) => set((store) => ({
        state: {
            ...store.state,
            userEvents: store.state.userEvents.filter(e => e.id !== id)
        }
    })),

    toggleUserEvent: (id) => set((store) => ({
        state: {
            ...store.state,
            userEvents: store.state.userEvents.map(e =>
                e.id === id ? { ...e, isCompleted: !e.isCompleted } : e
            )
        }
    }))
});
