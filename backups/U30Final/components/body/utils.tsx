import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const getDelta = (current: number, previous: number) => {
    const diff = current - previous;
    const absDiff = Math.abs(diff);
    if (absDiff < 0.1) return { val: 'Stable', color: 'text-slate-500', icon: <Minus size={12} /> };
    const isGain = diff > 0;
    return {
        val: `${isGain ? '+' : ''}${diff.toFixed(1)} kg`,
        color: isGain ? 'text-red-400' : 'text-green-400',
        icon: isGain ? <TrendingUp size={12} /> : <TrendingDown size={12} />
    };
};
