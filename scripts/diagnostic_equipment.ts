import { generateEquipment } from '../data/equipmentGenerator';
import { ItemRarity } from '../types';

function runDiagnostic() {
    console.log('--- EQUIPMENT GENERATOR DIAGNOSTIC (STRICT V21) ---');

    // Standard tests
    const level = 400;
    const testRarity: ItemRarity = 'epic';

    console.log(`\n--- Diagnostic: Level ${level} ${testRarity.toUpperCase()} Generation ---`);

    // Test multiple generations
    for (let i = 1; i <= 5; i++) {
        const item = generateEquipment(undefined, testRarity, level);

        const statCount = item.baseStats.length;
        const avgStatValue = item.baseStats.reduce((sum, s) => sum + s.value, 0) / statCount;
        const version = (item as any).v;

        console.log(`Item ${i}: ${item.name}`);
        console.log(` - Version: ${version || 'LEGACY'}`);
        console.log(` - Enhancement: +${item.level}`);
        console.log(` - Stats: ${statCount} (Expected: 2)`);
        console.log(` - Avg Value: ${avgStatValue.toFixed(1)} (v2.1 Expected: ~6-8)`);

        // Verification logic
        if (item.level !== 0) {
            console.error(`[FAIL] Item dropped at +${item.level} (Expected +0)!`);
        }
        if (version !== 21) {
            console.error(`[FAIL] Item missing v21 tag!`);
        }
        if (statCount > 2) {
            console.error(`[FAIL] Too many stats for EPIC! (Found ${statCount}, Max 2)`);
        }

        item.baseStats.forEach(s => {
            console.log(`   * ${s.stat}: ${s.value}`);
        });
    }

    console.log('\n--- Diagnostic Complete ---\n');
}

runDiagnostic();
