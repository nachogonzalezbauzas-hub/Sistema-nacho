import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { EffectiveStats } from '@/types';
import { t } from '@/data/translations';

interface RadarChartProps {
    stats: EffectiveStats;
    language: 'en' | 'es';
    className?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({ stats, language, className }) => {
    // Configuration
    const size = 300;
    const center = size / 2;
    const radius = (size / 2) - 60; // Leave room for labels

    // Data Preparation
    const data = useMemo(() => {
        const keys: (keyof EffectiveStats)[] = [
            'strength',
            'vitality',
            'agility',
            'intelligence',
            'fortune',
            'metabolism'
        ];

        const labels: Record<string, string> = {
            strength: 'STR',
            vitality: 'VIT',
            agility: 'AGI',
            intelligence: 'INT',
            fortune: 'LUK',
            metabolism: 'MET'
        };

        const values = keys.map(k => stats[k]);
        // Dynamic scale: Max value + 20%, but at least 50 to avoid tiny shapes
        const maxVal = Math.max(...values, 50);
        const scale = maxVal * 1.2;

        return keys.map((key, i) => {
            const val = stats[key];
            const normalized = val / scale;
            const angle = (Math.PI / 3) * i - (Math.PI / 2); // Start at top (-90deg)

            return {
                key,
                label: labels[key],
                value: val,
                normalized,
                angle,
                x: center + radius * Math.cos(angle),
                y: center + radius * Math.sin(angle),
                valX: center + radius * normalized * Math.cos(angle),
                valY: center + radius * normalized * Math.sin(angle)
            };
        });
    }, [stats]);

    // Path generation for the filled shape
    const areaPath = data.map((d, i) =>
        `${i === 0 ? 'M' : 'L'} ${d.valX},${d.valY}`
    ).join(' ') + ' Z';

    // Grid lines (pentagons/hexagons at 25%, 50%, 75%, 100%)
    const gridScales = [0.25, 0.5, 0.75, 1];

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                {/* Defs for gradients */}
                <defs>
                    <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="rgba(34, 211, 238, 0.5)" />
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Grid Background */}
                {gridScales.map((s, idx) => (
                    <polygon
                        key={s}
                        points={data.map((d) => {
                            const gx = center + radius * s * Math.cos(d.angle);
                            const gy = center + radius * s * Math.sin(d.angle);
                            return `${gx},${gy}`;
                        }).join(' ')}
                        fill="none"
                        stroke={idx === 3 ? "rgba(148, 163, 184, 0.3)" : "rgba(148, 163, 184, 0.1)"}
                        strokeWidth="1"
                        strokeDasharray={idx === 3 ? "0" : "4 2"}
                    />
                ))}

                {/* Axes */}
                {data.map((d) => (
                    <line
                        key={`axis-${d.key}`}
                        x1={center}
                        y1={center}
                        x2={d.x}
                        y2={d.y}
                        stroke="rgba(148, 163, 184, 0.1)"
                        strokeWidth="1"
                    />
                ))}

                {/* The Stats Polygon */}
                <motion.path
                    d={areaPath}
                    fill="url(#radarGradient)"
                    stroke="rgba(34, 211, 238, 0.8)"
                    strokeWidth="2"
                    filter="url(#glow)"
                    initial={{ scale: 0, opacity: 0, originX: 0.5, originY: 0.5 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        d: areaPath // Animate shape changes
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {/* Corner Points (Dots at values) */}
                {data.map((d, i) => (
                    <motion.circle
                        key={`dot-${d.key}`}
                        cx={d.valX}
                        cy={d.valY}
                        r="3"
                        fill="#22d3ee"
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            cx: d.valX,
                            cy: d.valY
                        }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                    />
                ))}

                {/* Labels */}
                {data.map((d, i) => {
                    // Offset labels slightly outward
                    const labelX = center + (radius + 20) * Math.cos(d.angle);
                    const labelY = center + (radius + 20) * Math.sin(d.angle);

                    return (
                        <g key={`label-${d.key}`}>
                            <text
                                x={labelX}
                                y={labelY - 6}
                                textAnchor="middle"
                                className="text-[10px] font-black fill-blue-400 uppercase tracking-widest"
                                style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}
                            >
                                {d.label}
                            </text>
                            <text
                                x={labelX}
                                y={labelY + 6}
                                textAnchor="middle"
                                className="text-[10px] font-mono fill-white font-bold"
                                style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}
                            >
                                {d.value < 1000 ? d.value : `${(d.value / 1000).toFixed(1)}k`}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
