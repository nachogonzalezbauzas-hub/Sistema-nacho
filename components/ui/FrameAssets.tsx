import React from 'react';

import { FrameAssetType } from '@/types';

// Helper for standard glow filter
const glowFilter = "drop-shadow(0 0 4px currentColor)";

export const FrameAssets: Record<FrameAssetType, React.FC<{ className?: string }>> = {
    wings_angel: ({ className }) => (
        <svg viewBox="0 0 200 200" className={`absolute inset-[-60%] w-[220%] h-[220%] pointer-events-none ${className}`} style={{ filter: glowFilter }}>
            <path d="M100 60 C 130 40, 160 30, 190 50 C 200 60, 180 90, 160 100 C 140 110, 120 90, 100 80" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-100" />
            <path d="M100 60 C 70 40, 40 30, 10 50 C 0 60, 20 90, 40 100 C 60 110, 80 90, 100 80" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-100" />
            {/* Feathers */}
            <path d="M130 50 Q 150 40 170 55" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-80" />
            <path d="M140 65 Q 160 60 175 75" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-80" />
            <path d="M70 50 Q 50 40 30 55" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-80" />
            <path d="M60 65 Q 40 60 25 75" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-80" />
        </svg>
    ),
    wings_demon: ({ className }) => (
        <svg viewBox="0 0 200 200" className={`absolute inset-[-60%] w-[220%] h-[220%] pointer-events-none ${className}`} style={{ filter: glowFilter }}>
            {/* Bat Wings Shape */}
            <path d="M100 70 Q 140 30 180 50 Q 170 90 150 80 Q 160 110 130 100 Q 110 90 100 80" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="3" />
            <path d="M100 70 Q 60 30 20 50 Q 30 90 50 80 Q 40 110 70 100 Q 90 90 100 80" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="3" />
        </svg>
    ),
    horns_demon: ({ className }) => (
        <svg viewBox="0 0 200 200" className={`absolute inset-[-30%] w-[160%] h-[160%] pointer-events-none ${className}`} style={{ zIndex: 10, filter: glowFilter }}>
            <path d="M70 60 C 60 40, 50 30, 40 20" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M130 60 C 140 40, 150 30, 160 20" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>
    ),
    halo_gold: ({ className }) => (
        <svg viewBox="0 0 200 200" className={`absolute inset-[-40%] w-[180%] h-[180%] pointer-events-none ${className}`} style={{ filter: glowFilter }}>
            <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="10 10" className="animate-spin-slow" />
            <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
        </svg>
    ),
    halo_spike: ({ className }) => (
        <svg viewBox="0 0 200 200" className={`absolute inset-[-40%] w-[180%] h-[180%] pointer-events-none ${className}`} style={{ filter: glowFilter }}>
            <defs>
                <path id="spike" d="M100 15 L 105 35 L 100 30 L 95 35 Z" fill="currentColor" />
            </defs>
            <g className="animate-spin-slow">
                <use href="#spike" />
                <use href="#spike" transform="rotate(45 100 100)" />
                <use href="#spike" transform="rotate(90 100 100)" />
                <use href="#spike" transform="rotate(135 100 100)" />
                <use href="#spike" transform="rotate(180 100 100)" />
                <use href="#spike" transform="rotate(225 100 100)" />
                <use href="#spike" transform="rotate(270 100 100)" />
                <use href="#spike" transform="rotate(315 100 100)" />
            </g>
        </svg>
    ),
    crown_king: ({ className }) => (
        <svg viewBox="0 0 200 200" className={`absolute top-[-35%] left-[-10%] w-[120%] h-[120%] pointer-events-none ${className}`} style={{ zIndex: 20, filter: glowFilter }}>
            <path d="M70 60 L 70 40 L 85 55 L 100 35 L 115 55 L 130 40 L 130 60 Z" fill="currentColor" stroke="none" />
        </svg>
    ),
    dragon_claws: ({ className }) => (
        <svg viewBox="0 0 200 200" className={`absolute inset-[-20%] w-[140%] h-[140%] pointer-events-none ${className}`} style={{ zIndex: 20, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
            {/* Left Claw */}
            <path d="M20 150 Q 40 130 60 140" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <path d="M30 160 Q 50 140 70 150" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            {/* Right Claw */}
            <path d="M180 150 Q 160 130 140 140" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <path d="M170 160 Q 150 140 130 150" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </svg>
    ),
    tech_ring: ({ className }) => (
        <svg viewBox="0 0 200 200" className={`absolute inset-[-30%] w-[160%] h-[160%] pointer-events-none ${className}`} style={{ zIndex: 10, filter: glowFilter }}>
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="40 20" className="animate-spin-slow opacity-80" />
            <path d="M100 30 L 100 20 M 170 100 L 180 100 M 100 170 L 100 180 M 30 100 L 20 100" stroke="currentColor" strokeWidth="4" className="opacity-100" />
        </svg>
    ),
    nature_vines: ({ className }) => (
        <svg viewBox="0 0 200 200" className={`absolute inset-[-25%] w-[150%] h-[150%] pointer-events-none ${className}`} style={{ zIndex: 20, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}>
            <path d="M50 150 Q 30 100 70 50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-90" />
            <path d="M150 150 Q 170 100 130 50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-90" />
            {/* Leaves */}
            <circle cx="70" cy="50" r="6" fill="currentColor" />
            <circle cx="130" cy="50" r="6" fill="currentColor" />
        </svg>
    )
};
