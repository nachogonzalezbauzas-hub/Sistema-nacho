import { describe, it, expect } from 'vitest';
import { calculatePowerBreakdown, calculateTotalPower } from './selectors';
import { AppState } from '@/types';

// Mock minimal state needed for selectors
const mockState = {
    stats: {
        level: 10,
        strength: 10,
        vitality: 10,
        agility: 10,
        intelligence: 10,
        fortune: 10,
        metabolism: 10,
        equippedTitleId: 's_rank_hunter',
        selectedFrameId: 'default'
    },
    shadows: [
        { rank: 'S' }
    ],
    inventory: [
        { isEquipped: true, rarity: 'legendary', baseStats: [{ value: 10 }] }
    ]
} as unknown as AppState;

describe('Selectors', () => {
    describe('calculatePowerBreakdown', () => {
        it('should calculate base stats power correctly', () => {
            // 6 stats * 10 value * 12 scale = 720
            const breakdown = calculatePowerBreakdown(mockState);
            expect(breakdown.baseStats).toBe(720);
        });

        it('should calculate level power correctly', () => {
            // Level 10 * 10 * 12 scale = 1200
            const breakdown = calculatePowerBreakdown(mockState);
            expect(breakdown.level).toBe(1200);
        });

        it('should calculate title power correctly', () => {
            // S-Rank Hunter is Epic (100) * 12 = 1200
            const breakdown = calculatePowerBreakdown(mockState);
            expect(breakdown.titles).toBe(1200);
        });

        it('should calculate shadow power correctly', () => {
            // S Rank Shadow (1500) * 12 = 18000
            const breakdown = calculatePowerBreakdown(mockState);
            expect(breakdown.shadows).toBe(18000);
        });

        it('should calculate equipment power correctly', () => {
            // 10 stat * 3 multiplier (legendary) * 12 scale = 360
            const breakdown = calculatePowerBreakdown(mockState);
            expect(breakdown.equipment).toBe(360);
        });
    });

    describe('calculateTotalPower', () => {
        it('should return the sum of all components', () => {
            const total = calculateTotalPower(mockState);
            // 720 + 1200 + 1200 + 0 (frame) + 18000 + 360 = 21480
            expect(total).toBe(21480);
        });
    });
});
