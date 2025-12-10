---
description: Complete checklist when adding a new Title (procedural or static)
---

# Add New Title

This workflow ensures a new title works correctly everywhere it appears.

## Pre-requisites
- Determine: ID, Name, Rarity, Description, Stat Bonuses (if any), Visual Effects

---

## STEP 1: Define the Title

### Option A: Static Title (in data file)
- [ ] `data/titles.tsx` → Add to `TITLES` array:
  ```typescript
  {
    id: 'unique_id',
    name: 'Title Name',
    rarity: 'legendary', // TitleRarity
    description: 'Description text',
    textStyle: '...', // CSS classes
    glowStyle: '...', // CSS classes  
    animation: '...' // CSS animation classes
  }
  ```

### Option B: Procedural Title (generated)
- [ ] `dungeons/cosmeticGenerator.ts` → Verify `generateProceduralTitle()` logic

---

## STEP 2: Rarity Styles (if new rarity)
Check if the title's rarity exists in these files:

- [ ] `components/ui/Titles.tsx`:
  - [ ] `rarityStyles` → colors and gradients
  - [ ] `rarityLabel` → display name
  - [ ] `rarityContainerAnimation` → container CSS animation
  - [ ] `rarityIconAnimation` → icon CSS animation

- [ ] `components/dashboard/ActiveTitle.tsx` → `rarityEffects`:
  - [ ] `glow`, `borderGlow`, `textGlow`
  - [ ] `shimmer`, `rainbow` booleans

---

## STEP 3: Profile Tab Display
- [ ] `components/profile/TitlesTab.tsx`:
  - [ ] Verify `rarityOrder` includes the rarity
  - [ ] Verify sorting works correctly

---

## STEP 4: Unlock & Equip Logic
- [ ] Title appears in `state.stats.unlockedTitleIds` when unlocked
- [ ] `equipTitle(titleId)` works in store
- [ ] Title shows in profile header when equipped

---

## STEP 5: Reward Animation
- [ ] `components/ui/UnifiedRewardOverlay.tsx`:
  - [ ] Verify `renderTitleCard()` displays correctly
  - [ ] Verify colors match rarity

---

## STEP 6: Store Integration (if procedural)
- [ ] `store/slices/dungeonSlice.ts`:
  - [ ] `proceduralTitle` is added to `customTitles` array
  - [ ] ID is added to `unlockedTitleIds`
  - [ ] Reward queue entry created

- [ ] `store/slices/userSlice.ts`:
  - [ ] `debugAddReward()` can add titles (for testing)

---

## STEP 7: Shop Display (if purchasable)
- [ ] `data/shopCosmetics.tsx` → Add to shop items if needed
- [ ] `components/shop/QuestShop.tsx` → Verify display

---

## STEP 8: Build & Visual Verification
// turbo
```bash
npm run build
```

- [ ] Build passes with 0 errors
- [ ] Unlock animation plays correctly
- [ ] Title appears in Profile > Titles tab
- [ ] Title can be equipped
- [ ] Title shows on dashboard with correct effects:
  - [ ] Correct colors
  - [ ] Correct glow/shimmer
  - [ ] Correct animation
- [ ] Title shows in profile header

---

## Files Summary

| File | Purpose |
|------|---------|
| `types/items.ts` | `TitleRarity` type, `Title` interface |
| `data/titles.tsx` | Static title definitions |
| `dungeons/cosmeticGenerator.ts` | Procedural title generation |
| `components/ui/Titles.tsx` | Rarity visual styles |
| `components/dashboard/ActiveTitle.tsx` | Dashboard display |
| `components/profile/TitlesTab.tsx` | Profile listing |
| `components/ui/UnifiedRewardOverlay.tsx` | Unlock animation |
| `store/slices/dungeonSlice.ts` | Unlock logic |
| `store/slices/userSlice.ts` | Equip logic |
