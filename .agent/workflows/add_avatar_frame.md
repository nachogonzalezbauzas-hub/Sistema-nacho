---
description: Complete checklist when adding a new Avatar Frame (procedural or static)
---

# Add New Avatar Frame

This workflow ensures a new avatar frame works correctly everywhere it appears.

## Pre-requisites
- Determine: ID, Name, Rank (C/B/A/S/SS/SSS), Description, Border Style, Animation

---

## STEP 1: Define the Frame

### Option A: Static Frame (in data file)
- [ ] `data/titles.tsx` → Add to `AVATAR_FRAMES` array:
  ```typescript
  {
    id: 'unique_id',
    name: 'Frame Name',
    rarity: 'S', // RankTier: C, B, A, S, SS, SSS
    description: 'Description text',
    borderStyle: 'border-2 border-purple-500 ...',
    animation: 'animate-pulse ...',
    glowColor: 'rgba(168, 85, 247, 0.6)'
  }
  ```

### Option B: Procedural Frame (generated)
- [ ] `dungeons/cosmeticGenerator.ts` → Verify `generateProceduralFrame()` logic

---

## STEP 2: Rank Colors & Styles
- [ ] `components/ui/Avatar.tsx` → `getFrameRarityColors()`:
  - [ ] Verify rank has primary, glow, border colors

- [ ] `components/profile/FramesTab.tsx`:
  - [ ] `rankOrder` includes the rank
  - [ ] `getRankColor()` returns correct color

---

## STEP 3: Profile Tab Display
- [ ] `components/profile/FramesTab.tsx`:
  - [ ] Frame appears in grid
  - [ ] Correct border and animation
  - [ ] Can be selected/equipped

---

## STEP 4: Unlock & Equip Logic
- [ ] Frame appears in `state.stats.unlockedFrameIds` when unlocked
- [ ] `selectFrame(frameId)` works in store
- [ ] Frame shows around avatar when equipped

---

## STEP 5: Reward Animation
- [ ] `components/ui/UnifiedRewardOverlay.tsx`:
  - [ ] Verify frame rewards display correctly
  - [ ] Colors match rank

- [ ] `store/slices/userSlice.ts`:
  - [ ] `frameRankToRarity()` maps frame rank to ItemRarity for rewards

---

## STEP 6: Store Integration (if procedural)
- [ ] `store/slices/dungeonSlice.ts`:
  - [ ] `proceduralFrame` is added to `customFrames` array
  - [ ] ID is added to `unlockedFrameIds`
  - [ ] Reward queue entry created

---

## STEP 7: Avatar Display
- [ ] `components/ui/Avatar.tsx`:
  - [ ] Frame border renders correctly
  - [ ] Animation plays
  - [ ] Glow effect works

- [ ] `components/profile/ProfileHeader.tsx`:
  - [ ] Selected frame shows around avatar

---

## STEP 8: Shop Display (if purchasable)
- [ ] `data/shopCosmetics.tsx` → Add to shop items if needed
- [ ] `components/shop/QuestShop.tsx` → Verify display

---

## STEP 9: Build & Visual Verification
// turbo
```bash
npm run build
```

- [ ] Build passes with 0 errors
- [ ] Unlock animation plays correctly
- [ ] Frame appears in Profile > Frames tab
- [ ] Frame can be selected
- [ ] Frame shows around avatar:
  - [ ] Correct border color
  - [ ] Correct glow
  - [ ] Correct animation
- [ ] Frame appears in dashboard avatar

---

## Files Summary

| File | Purpose |
|------|---------|
| `types/items.ts` | `AvatarFrame` interface |
| `data/titles.tsx` | Static frame definitions |
| `dungeons/cosmeticGenerator.ts` | Procedural frame generation |
| `components/ui/Avatar.tsx` | Avatar with frame rendering |
| `components/profile/FramesTab.tsx` | Profile frame listing |
| `components/profile/ProfileHeader.tsx` | Header avatar display |
| `components/ui/UnifiedRewardOverlay.tsx` | Unlock animation |
| `store/slices/dungeonSlice.ts` | Unlock logic |
| `store/slices/userSlice.ts` | Equip logic, rank conversion |
