import { StateCreator } from 'zustand';
import type { GameStore } from '@/store/useStore';
import { ChatMessage } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export interface ChatSlice {
    addChatMessage: (text: string, sender: 'user' | 'system') => void;
    clearChat: () => void;
}

export const createChatSlice: StateCreator<GameStore, [], [], ChatSlice> = (set, get) => ({
    addChatMessage: (text, sender) => {
        set((store) => {
            const newMessage: ChatMessage = {
                id: uuidv4(),
                sender,
                text,
                timestamp: new Date().toISOString()
            };
            return {
                state: {
                    ...store.state,
                    chatHistory: [...(store.state.chatHistory || []), newMessage]
                }
            };
        });
    },

    clearChat: () => {
        set((store) => ({
            state: {
                ...store.state,
                chatHistory: []
            }
        }));
    }
});
