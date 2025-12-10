import { describe, it, expect } from 'vitest';
import { calculateLevel, getXpForNextLevel, calculateStatIncrease } from './progression';

describe('Progression Logic', () => {
    describe('getXpForNextLevel', () => {
        it('should return 100 for level 1', () => {
            // 100 * 1^2 = 100
            expect(getXpForNextLevel(1)).toBe(100);
        });

        it('should return 400 for level 2', () => {
            // 100 * 2^2 = 400
            expect(getXpForNextLevel(2)).toBe(400);
        });
    });

    describe('calculateLevel', () => {
        it('should not level up if XP is insufficient', () => {
            // Level 1, 50 XP (needs 100)
            const result = calculateLevel(1, 50);
            expect(result.level).toBe(1);
            expect(result.xp).toBe(50);
            expect(result.leveledUp).toBe(false);
        });

        it('should level up if XP is sufficient', () => {
            // Level 1, 150 XP (needs 100)
            const result = calculateLevel(1, 150);
            expect(result.level).toBe(2);
            expect(result.xp).toBe(50); // 150 - 100 = 50
            expect(result.leveledUp).toBe(true);
            expect(result.xpForNextLevel).toBe(400); // Level 2 needs 400
        });

        it('should handle multiple level ups', () => {
            // Level 1, 600 XP
            // L1 -> L2 cost 100. Remainder 500.
            // L2 -> L3 cost 400. Remainder 100.
            // Result: Level 3, 100 XP.
            const result = calculateLevel(1, 600);
            expect(result.level).toBe(3);
            expect(result.xp).toBe(100);
            expect(result.leveledUp).toBe(true);
        });
    });

    describe('calculateStatIncrease', () => {
        it('should increase stat by default 1', () => {
            expect(calculateStatIncrease(10)).toBe(11);
        });

        it('should increase stat by specified amount', () => {
            expect(calculateStatIncrease(10, 5)).toBe(15);
        });
    });
});
