import { EquipmentSet } from '../types';

export const EQUIPMENT_SETS: EquipmentSet[] = [
    {
        id: 'shadow_monarch',
        name: 'Shadow Monarch Set',
        pieces: ['weapon_shadow_scythe', 'helmet_shadow_cowl', 'chest_shadow_plate', 'gloves_shadow_grip', 'boots_shadow_step'],
        bonuses: [
            {
                requiredCount: 2,
                stats: { agility: 5, intelligence: 5 },
                effect: 'Shadow Step: +5% Dodge Chance'
            },
            {
                requiredCount: 4,
                stats: { strength: 10, vitality: 10 },
                effect: 'Arise: +10% Shadow Army Power'
            },
            {
                requiredCount: 5,
                stats: { strength: 20, intelligence: 20, agility: 20, vitality: 20, fortune: 20, metabolism: 20 },
                effect: 'Monarch\'s Domain: All Stats +20'
            }
        ]
    },
    {
        id: 'demon_king',
        name: 'Demon King Set',
        pieces: ['weapon_demon_sword', 'helmet_demon_horns', 'chest_demon_armor', 'gloves_demon_claws', 'boots_demon_greaves'],
        bonuses: [
            {
                requiredCount: 2,
                stats: { strength: 8 },
                effect: 'Bloodlust: +5% Damage'
            },
            {
                requiredCount: 4,
                stats: { strength: 15, vitality: 15 },
                effect: 'Immortal: +10% Health Regen'
            }
        ]
    },
    {
        id: 'system_admin',
        name: 'System Administrator Set',
        pieces: ['necklace_admin_key', 'ring_admin_seal'],
        bonuses: [
            {
                requiredCount: 2,
                stats: { intelligence: 15, fortune: 15 },
                effect: 'System Override: +10% XP Gain'
            }
        ]
    }
];
