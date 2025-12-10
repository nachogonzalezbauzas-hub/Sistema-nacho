---
description: How to extend the Power Rank system with new tiers and animations
---

This workflow describes the process for extending the Hunter Power Rank system, specifically for adding new high-level tiers (e.g., beyond 1,000,000 Power).

## 1. Analyze Density and Range
Determine the power range you want to cover and the density of ranks.
- **Example**: Extending from 1,000,000 to 1,250,000 Power (Range: 250,000).
- **Target Density**: ~20,000 - 25,000 Power per rank (similar to existing system).
- **Calculation**: 250,000 / 25,000 = ~10 new ranks.

## 2. Define Aesthetic Theme
Choose a visual theme for the new tier.
- **Colors**: Select a primary hex color and a glow color.
- **Concept**: e.g., "Celestial" (Cyan/Purple), "Divine" (White/Gold), "Cosmic" (Hue Rotation).

## 3. Implement New Ranks
Edit `components/dashboard/PowerRank.tsx`.
Add new objects to the `POWER_RANKS` array.

```typescript
{ 
  rank: 51, // Increment rank number
  name: 'New Rank Name I', 
  min: 1025000, // Previous Min + Step
  hex: '#HEXCODE', 
  glow: 'shadow-[0_0_60px_rgba(R,G,B,0.6)]', // Increase glow intensity
  shimmer: true, 
  rainbow: false, 
  // Add custom flags if needed
  celestial: true 
}
```

## 4. Create Custom Animations
If the new tier requires a unique animation (like "Celestial" or "Cosmic"):

1.  **Define Keyframes**: Add `@keyframes` in the `PowerRankBadge` component.
    ```css
    @keyframes power-newstyle {
        0% { text-shadow: 0 0 10px color; }
        50% { text-shadow: 0 0 30px color; }
        100% { text-shadow: 0 0 10px color; }
    }
    ```

2.  **Update Badge Logic**: Update the `style` prop in `PowerRankBadge` to apply the animation based on the flag.
    ```typescript
    } : rankData.newStyle ? {
        color: rankData.hex,
        animation: 'power-newstyle 3s ease-in-out infinite',
    } : {
    ```

## 5. Verify in Showcase
Use the **Power Ranks Showcase** (accessible via Settings -> Developer Tools) to verify:
-   The new ranks appear in the list.
-   The visual hierarchy is consistent (size, glow).
-   The animations play correctly.
