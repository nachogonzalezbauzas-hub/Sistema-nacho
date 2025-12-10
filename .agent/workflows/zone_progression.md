---
description: System for procedural progression through 20 unique power zones
---

# Zone Progression System (Zones 1-20)

This document defines the procedural system for infinite power progression across 20 distinct Zones.

## Core Concept

The game is divided into **Zones**.
- **Zone 1**: The starting "System" (Current App).
- **Zones 2-20**: Procedurally generated stages with unique visual themes.

When a player reaches the **power threshold** of their current Zone, they unlock:
1.  **Zone Guardian Fight**: A boss battle themed around the *next* Zone.
2.  **Ascension**: Upon victory, the UI transforms to match the new Zone's visual theme.

## Zone Thresholds

| Zone | Name | Power Threshold | New Rarity | Floor Range |
| :--- | :--- | :--- | :--- | :--- |
| **1** | The System | 0 | Common-Legendary | 1-150 |
| **2** | Volcanic Lands | 1,250,000 | Magma | 151-300 |
| **3** | Abyssal Ocean | 2,500,000 | Abyssal | 301-450 |
| **4** | Verdant Jungle | 5,000,000 | Verdant | 451-600 |
| **5** | Storm Peaks | 10,000,000 | Storm | 601-750 |
| **6** | Lunar Surface | 20,000,000 | Lunar | 751-900 |
| **7** | Solar Flare | 40,000,000 | Solar | 901-1050 |
| **8** | Nebula Cloud | 80,000,000 | Nebula | 1051-1200 |
| **9** | Black Hole | 160,000,000 | Singularity | 1201-1350 |
| **10** | Supernova | 320,000,000 | Nova | 1351-1500 |
| ... | ... | *Double Previous* | ... | +150 |

## Visual Engine Rules

**CRITICAL**: Every Zone must look distinct.
- **Primary Color**: Used for buttons, borders, and text highlights.
- **Background**: Unique texture or animated shader.
- **Particles**: Zone-specific particle effects (e.g., embers for Volcanic, bubbles for Ocean).
- **UI Borders**: Distinct border styles (jagged for Storm, smooth for Ocean).

## Content Generation

### Items
Items dropped in a Zone must match its theme.
- **Zone 2 (Volcanic)**: "Magma Blade", "Obsidian Plate", "Ash Walker Boots".
- **Zone 3 (Ocean)**: "Tidal Staff", "Coral Armor", "Deep Sea Ring".

### Titles & Frames
- **Titles**: Procedurally generated based on Zone keywords (e.g., "Volcanic Conqueror", "Abyssal Walker").
- **Frames**: Unique frame for each Zone, awarded upon entry.

## Implementation Steps for New Zone

1.  **Define Visuals**: Add entry to `zone_design.md`.
2.  **Update Data**: Add to `zoneSystem.ts`.
3.  **Verify**: Check `ZoneShowcaseView` to ensure it looks unique.
