---
description: Complete checklist when adding a new item rarity (equipment quality tier)
---

# Add New Item Rarity (Equipment Quality)

This workflow ensures all systems are updated when adding a new equipment rarity tier.

## Pre-requisites
- Determine: Name, Colors (primary, glow, border, bg), Unlock Floor, Drop Rate

---

## STEP 1: Type Definitions
// turbo
```bash
# Verify current rarities
grep -n "ItemRarity" types/core.ts
```

- [ ] `types/core.ts` → Add to `ItemRarity` union type
  ```typescript
  export type ItemRarity = 'common' | ... | 'NEW_RARITY';
  ```

---

## STEP 2: Equipment Generator
- [ ] `data/equipmentGenerator.ts` → Add to ALL THREE objects:
  - [ ] `RARITY_WEIGHTS` → probability weight (lower = rarer)
  - [ ] `ADJECTIVES` → name prefixes array
  - [ ] `BASE_STAT_RANGES` → [min, max] stat values

---

## STEP 3: UI Components (Visual Styles)
- [ ] `components/equipment/UIComponents.tsx` → `RARITY_STYLES`
  ```typescript
  NEW_RARITY: {
    bg: 'bg-gradient-to-r from-...',
    text: 'text-...',
    border: '...',
    shadow: '...'
  }
  ```

- [ ] `components/shop/ChestOpenAnimation.tsx` → `rarityColors`
  ```typescript
  NEW_RARITY: { main: '#...', glow: 'rgba(...)', particles: '#...' }
  ```

---

## STEP 4: Dungeon Drop Rates
- [ ] `dungeons/dungeonGenerator.ts` → `dropRates` Record
  ```typescript
  NEW_RARITY: floor > X ? Math.min(Y, formula) : 0
  ```

- [ ] `dungeons/dungeonData.ts` → `dropRates` Record (if used)

- [ ] `views/dungeons/DungeonsView.tsx` → `DROP_RATE_INFO` modal array

---

## STEP 5: Reward System
- [ ] `dungeons/rewardGenerator.ts` → Verify `selectRarityFromDropRates` includes new rarity in order
- [ ] `components/ui/UnifiedRewardOverlay.tsx` → Verify reward card displays correctly

---

## STEP 6: Build & Visual Verification
// turbo
```bash
npm run build
```

- [ ] Build passes with 0 errors
- [ ] Drop equipment in dungeon → reward animation shows correctly
- [ ] Equipment in inventory shows:
  - [ ] Correct name
  - [ ] Correct rarity badge/border
  - [ ] Correct colors
  - [ ] Stats visible with icons
- [ ] Equipment slot modal shows correctly when equipped

---

## STEP 7: Update Documentation
- [ ] `.agent/workflows/quality_order.md` → Add new rarity to tables
