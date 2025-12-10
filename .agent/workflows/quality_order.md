---
description: Reference for the order of all quality tiers (rarity for titles, rank for frames)
---

# Quality Order Reference

This document defines the canonical order of all quality tiers from **worst to best** (de malo a mejor).

## Title/Equipment Rarities (ItemRarity)
Used in: `types/core.ts` → `ItemRarity`

| # | Rarity | Color | Unlock Floor | Effect |
|---|--------|-------|--------------|--------|
| 0 | `common` | Slate | 1 | No glow |
| 1 | `uncommon` | Green | 1 | Subtle glow |
| 2 | `rare` | Blue | 1 | Glow + subtle shine |
| 3 | `epic` | Purple | 1 | Shimmer effect |
| 4 | `legendary` | Amber/Gold | 1 | Shimmer + strong glow |
| 5 | `mythic` | Red | 50 | Intense shimmer |
| 6 | `godlike` | White/Rainbow | 80 | Rainbow text |
| 7 | `celestial` | Cyan | 120 | Animated pulse |
| 8 | `transcendent` | White/Gold | 150 | Cosmic shimmer + rainbow |

---

## Frame Ranks (for Avatar Frames)
Used in: `types/items.ts` → `AvatarFrame.rarity`

| # | Rank | Color | Border Effect |
|---|------|-------|---------------|
| 0 | `E` | Gray | Simple |
| 0 | `D` | Gray | Simple |
| 1 | `C` | Slate | Basic glow |
| 2 | `B` | Green | Single ring |
| 3 | `A` | Blue | Glow ring |
| 4 | `S` | Purple | Double ring |
| 5 | `SS` | Yellow/Gold | Triple glow |
| 6 | `SSS` | Rose/Red | Multi-ring + animation (MAX) |

---

## Mapping: Title Rarity → Frame Rank

| Title Rarity | Frame Rank |
|--------------|------------|
| `common` | `C` |
| `uncommon` | `B` |
| `rare` | `A` |
| `epic` | `S` |
| `legendary` | `SS` |
| `mythic` | `SSS` |
| `godlike` | `SSS` |
| `celestial` | `SSS` |

---

## Files That Must Be Updated for New Qualities

| File | What to Update |
|------|----------------|
| `types/core.ts` | Add to `ItemRarity` type |
| `types/items.ts` | Add to `AvatarFrame.rarity` type |
| `utils/proceduralGenerator.ts` | `generateRarity()`, `mapRarityToFrameRank()`, visual block |
| `components/ui/Avatar.tsx` | `getFrameRarityColors()` |
| `components/ui/Titles.tsx` | `rarityStyles`, `rarityLabel`, `rarityContainerAnimation`, `rarityIconAnimation` |
| `views/AchievementsView.tsx` | `RARITY_WEIGHT` (both title AND frame entries) |
| `components/profile/FramesTab.tsx` | `rankOrder`, `getRankColor()` |
| `components/profile/TitlesTab.tsx` | `rarityOrder` |
| `components/dashboard/ActiveTitle.tsx` | `rarityEffects` |

---

## Hunter Power Ranks (Total Power)
Used in: `components/dashboard/PowerRank.tsx`

This system tracks the player's numerical power progression. It is divided into **Tiers**, each containing multiple **Ranks** (usually I-V).

**Progression Logic:**
- **0 - 1,000,000 Power**: ~50 Ranks. Density is approx. 1 rank every 20,000 Power.
- **1,000,000 - 1,250,000 Power**: ~12 Ranks. Density is approx. 1 rank every 20,000 - 25,000 Power.

| Tier Name | Rank Range | Power Range | Theme Color |
|-----------|------------|-------------|-------------|
| **Initiate** | 1 - 5 | 0 - 1,200 | Gray |
| **Scout** | 6 - 10 | 1,200 - 7,000 | Green |
| **Warrior** | 11 - 15 | 7,000 - 25,000 | Teal/Blue |
| **Knight** | 16 - 20 | 25,000 - 65,000 | Blue/Indigo |
| **Elite** | 21 - 25 | 65,000 - 140,000 | Purple |
| **Champion** | 26 - 30 | 140,000 - 260,000 | Pink |
| **Master** | 31 - 35 | 260,000 - 450,000 | Orange |
| **Grandmaster**| 36 - 40 | 450,000 - 750,000 | Red |
| **Legend** | 41 - 45 | 750,000 - 960,000 | White |
| **Monarch** | 46 - 50 | 960,000 - 1,000,000 | White (Glow) |
| **Celestial** | 51 - 55 | 1,020,000 - 1,100,000 | Cyan |
| **Divine** | 56 - 60 | 1,120,000 - 1,200,000 | Sky Blue/White |
| **Transcendent**| 61 | 1,225,000 | Pure White |
| **Absolute Being**| 62 | 1,250,000 | Cosmic (Hue Rotate) |

---

## Hunter Ranks (Season/XP Level)
Used in: `utils/rankSystem.ts` and `views/SeasonView.tsx`

This system represents the player's official Hunter Association rank, based on **Season XP**.

| Rank | XP Required | Rewards | Visual Style |
|------|-------------|---------|--------------|
| **E** | 0 | - | Gray |
| **D** | 100 | +100 XP, Title | Gray |
| **C** | 500 | +250 XP, Title | Green |
| **B** | 1,500 | +500 XP, Title, Frame | Blue |
| **A** | 3,000 | +1,000 XP, Title | Purple |
| **S** | 5,000 | +2,500 XP, Stats, Title, Frame | Gold |
| **SS** | 10,000 | +5,000 XP, Stats, Title | Red |
| **SSS** | MAX | +10,000 XP, Stats, Title, Frame | Rainbow/RGB |
