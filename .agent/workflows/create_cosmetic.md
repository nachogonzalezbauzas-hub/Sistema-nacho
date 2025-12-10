---
description: How to create and integrate new Avatar Frames and Titles
---

# Creating New Cosmetics (Frames & Titles)

Follow this **strict pattern** to ensure new cosmetics are visually consistent and fully integrated. **Do NOT skip any file.**

## CRITICAL LESSONS (Do NOT Repeat These Mistakes)
1. **Titles use `rarity` (e.g., 'transcendent')**, Frames use `rank` (e.g., 'GOD'). They are different systems!
2. **Profile's TitlesTab** also needs updating - not just AchievementsView.
3. **Sorting logic** in AchievementsView should NOT break frame display order.
4. **Test BOTH Titles AND Frames** in BOTH Achievements AND Profile views.

---

## The Complete Checklist (All files MUST be updated)

### Step 1: Type Definitions
- [ ] `types/core.ts` - Add new rarity to `ItemRarity` union type (for Titles)
- [ ] `types/items.ts` - Add new rank to `AvatarFrame.rarity` union type (for Frames)

### Step 2: Procedural Generation
- [ ] `utils/proceduralGenerator.ts`:
  - [ ] Update `generateRarity()` with new rarity probability
  - [ ] Update `mapRarityToFrameRank()` to map rarity → rank
  - [ ] Add visual block in `generateProceduralFrame()` for the new rank

### Step 3: Visual Styles (BOTH must be updated)
- [ ] `components/ui/Avatar.tsx` - Add rank to `getFrameRarityColors()`
- [ ] `components/ui/Titles.tsx` - Add rarity to:
  - [ ] `rarityStyles`
  - [ ] `rarityLabel`
  - [ ] `rarityContainerAnimation`
  - [ ] `rarityIconAnimation`

### Step 4: Collection Views (Achievements Tab)
- [ ] `views/AchievementsView.tsx`:
  - [ ] Add rarity to `RARITY_WEIGHT` for sorting (Titles)
  - [ ] Frame cards already use `getFrameRarityColors` (should work automatically)

### Step 5: Inventory Views (Profile Tab) - **CRITICAL**
- [ ] `components/profile/FramesTab.tsx`:
  - [ ] Add rank to `rankOrder` array
  - [ ] Add rank to `getRankColor()`
- [ ] `components/profile/TitlesTab.tsx`:
  - [ ] Add rarity to `rarityOrder` array (if not, titles won't appear!)
- [ ] `components/dashboard/ActiveTitle.tsx`:
  - [ ] Add rarity to `rarityEffects` object (if not, dashboard crashes!)

### Step 6: Verification (ALL 4 locations)
| View | Subview | Check |
|------|---------|-------|
| Achievements | Titles Tab | Title shows correctly, badge says correct rarity label |
| Achievements | Frames Tab | Frame shows correctly with correct rarity badge |
| Profile | Titles Tab | Title appears in inventory |
| Profile | Frames Tab | Frame appears in correct rank section |
| Dashboard | Avatar | Equipped frame looks correct |

---

## File Count Summary
**Minimum 8 files** must be touched for a complete new rarity/rank:
1. `types/core.ts`
2. `types/items.ts`
3. `utils/proceduralGenerator.ts`
4. `components/ui/Avatar.tsx`
5. `components/ui/Titles.tsx`
6. `views/AchievementsView.tsx`
7. `components/profile/FramesTab.tsx`
8. `components/profile/TitlesTab.tsx` (verify)
