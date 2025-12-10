import { describe, it, expect } from 'vitest';
import { getDungeon } from '../dungeonGenerator';

describe('DungeonGenerator', () => {
    it('should generate E-Rank dungeon for floor 1', () => {
        const dungeon = getDungeon(1);
        expect(dungeon.difficulty).toBe('E');
        expect(dungeon.recommendedLevel).toBe(1);
        expect(dungeon.boss).toBeUndefined();
    });

    it('should generate boss raid for floor 10', () => {
        const dungeon = getDungeon(10);
        expect(dungeon.name).toContain('Boss Raid');
        expect(dungeon.boss).toBeDefined();
        expect(dungeon.boss?.id).toBe('boss_10');
    });

    it('should scale difficulty correctly', () => {
        // Floor 21 should be D-Rank (1-20 is E)
        const dungeonD = getDungeon(21);
        expect(dungeonD.difficulty).toBe('D');

        // Floor 101 should be S-Rank (81-100 is A, 101+ is S)
        // Wait, let's check the logic:
        // tierIndex = floor((101-1)/20) = 5
        // Tiers: E, D, C, B, A, S, SS, SSS
        // 0: E, 1: D, 2: C, 3: B, 4: A, 5: S
        const dungeonS = getDungeon(101);
        expect(dungeonS.difficulty).toBe('S');
    });

    it('should scale rewards with power', () => {
        const dungeon1 = getDungeon(1);
        const dungeon10 = getDungeon(10);

        expect(dungeon10.rewards.xp).toBeGreaterThan(dungeon1.rewards.xp);
        expect(dungeon10.recommendedPower).toBeGreaterThan(dungeon1.recommendedPower);
    });

    it('should include drop rates', () => {
        const dungeon = getDungeon(50);
        expect(dungeon.rewards.dropRates).toBeDefined();
        expect(dungeon.rewards.dropRates.common).toBeDefined();
        expect(dungeon.rewards.dropRates.legendary).toBeDefined();
    });
});
