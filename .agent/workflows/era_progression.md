---
description: System for procedural progression through power eras
---

# Era Progression System

This document defines the procedural system for infinite power progression.

## Core Concept

When a player reaches the **power threshold** of their current era, they unlock:
1. Boss fight against Era Guardian
2. Upon victory:
   - New rarity tier unlocked
   - New tower floors unlocked
   - Shadow of the boss
   - Title of new rarity
   - Frame of new rarity
   - Equipment piece of new rarity
   - +1 skill level cap
   - New daily shop items of new rarity

---

## Era Thresholds

| Era | Power Threshold | New Rarity | New Floors | Boss Name Pattern |
|-----|-----------------|------------|------------|-------------------|
| 1 | 1,250,000 | Primordial | 151-300 | "Guardian of the Primordial Gate" |
| 2 | 2,500,000 | Eternal | 301-450 | "Guardian of the Eternal Gate" |
| 3 | 5,000,000 | Divine | 451-600 | "Guardian of the Divine Gate" |
| 4 | 10,000,000 | Cosmic | 601-750 | "Guardian of the Cosmic Gate" |
| 5 | 20,000,000 | Infinite | 751-900 | "Guardian of the Infinite Gate" |
| 6+ | Previous × 2 | Procedural | +150 floors | Procedural name |

---

## Procedural Rarity Names (after predefined list)

```typescript
const RARITY_PREFIXES = ['Void', 'Apex', 'Supreme', 'Omega', 'Ultimate', 'Absolute'];
const RARITY_SUFFIXES = ['Prime', 'Alpha', 'Zenith', 'Pinnacle', 'Apex'];

// Era 7+: "Void Prime", "Apex Alpha", etc.
```

---

## Power Validation Rule

**CRITICAL**: All content added must contribute enough power to reach the next threshold.

```
Total Obtainable Power from Era N content >= Era N+1 threshold - Era N threshold
```

### Power Sources per Era:
- Equipment (9 slots × stats)
- Shadows (bonus stats)
- Titles (stat bonuses - IF IMPLEMENTED)
- Frames (stat bonuses - IF IMPLEMENTED)
- +1 Skill levels (increased stats)
- Higher dungeon XP → more levels → more stats

---

## Files to Update per Era Unlock

### When Adding New Rarity:
Follow `/add_item_rarity` workflow completely.

### When Adding New Title:
Follow `/add_title` workflow completely.

### When Adding New Frame:
Follow `/add_avatar_frame` workflow completely.

### Additional Era-Specific Files:
- [ ] `store/slices/eraSlice.ts` (or similar) → Era state
- [ ] `components/era/EraUnlockAnimation.tsx` → Unlock animation
- [ ] `components/era/EraBossFight.tsx` → Boss fight UI
- [ ] `data/eraBosses.ts` → Boss definitions per era
- [ ] `dungeons/dungeonGenerator.ts` → Extend floor generation
- [ ] `store/slices/shopSlice.ts` → Daily items generation

---

## Daily Shop Logic

```typescript
function generateDailyShopItems(unlockedRarities: ItemRarity[]): ShopItem[] {
  const items: ShopItem[] = [];
  
  // 1 item per unlocked rarity tier (up to max)
  unlockedRarities.forEach(rarity => {
    if (Math.random() < 0.3) { // 30% chance per rarity
      items.push(generateShopItem(rarity));
    }
  });
  
  // Guaranteed at least 1 item of highest unlocked rarity
  const highestRarity = unlockedRarities[unlockedRarities.length - 1];
  items.push(generateShopItem(highestRarity));
  
  return items;
}
```

---

## Boss Fight Flow

```
1. Player reaches era threshold
2. Animation: "Power Threshold Reached"
3. Prompt: "Challenge the Era Guardian?"
4. Boss Fight begins (can flee/retry)
5. Victory:
   - All era rewards granted
   - New era activated
   - Tower floors extended
   - Shop updated
6. Defeat:
   - Can retry anytime
   - No penalties
```

---

## State Structure

```typescript
interface EraState {
  currentEra: number;
  unlockedRarities: ItemRarity[];
  maxUnlockedFloor: number;
  eraGuardiansDefeated: string[]; // Boss IDs
  eraShadowsObtained: string[];
}
```

---

## Implementation Status

1. [x] Created `data/eraSystem.ts` - Era thresholds, colors, definitions
2. [x] Created `types/core.ts` - Added `EraState` interface
3. [x] Created `store/slices/eraSlice.ts` - Era state management
4. [x] Created `components/era/EraUnlockAnimation.tsx` - Boss reveal
5. [x] Created `components/era/EraBossFight.tsx` - Boss fight UI
6. [x] Extended `components/dashboard/PowerRank.tsx` - Dynamic era ranks
7. [ ] Integrate era check into main game loop
8. [ ] Add first "Primordial" rarity using /add_item_rarity workflow
9. [ ] Test complete flow
10. [ ] Create procedural shadow generation for era bosses

## Files Created

| File | Purpose |
|------|---------|
| `data/eraSystem.ts` | Era thresholds, colors, boss names |
| `store/slices/eraSlice.ts` | Era state and actions |
| `components/era/EraUnlockAnimation.tsx` | Phased unlock animation |
| `components/era/EraBossFight.tsx` | Auto-battle boss fight |
| `components/era/index.ts` | Exports |
