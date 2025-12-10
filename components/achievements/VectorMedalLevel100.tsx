import React from 'react';

export const VectorMedalLevel100 = ({ size = 200 }: { size?: number }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                {/* Gold Gradient */}
                <linearGradient id="gold-grad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#FCD34D" />
                    <stop offset="0.3" stopColor="#F59E0B" />
                    <stop offset="0.6" stopColor="#B45309" />
                    <stop offset="1" stopColor="#FCD34D" />
                </linearGradient>

                {/* Platinum/White Gradient */}
                <linearGradient id="plat-grad" x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#FFFFFF" />
                    <stop offset="0.5" stopColor="#E2E8F0" />
                    <stop offset="1" stopColor="#94A3B8" />
                </linearGradient>

                {/* Inner Glow */}
                <radialGradient id="inner-glow" cx="100" cy="100" r="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0" />
                    <stop offset="1" stopColor="#FCD34D" stopOpacity="0.3" />
                </radialGradient>

                {/* Sun Burst */}
                <radialGradient id="sun-burst" cx="100" cy="100" r="50" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#FFFFFF" />
                    <stop offset="0.4" stopColor="#FCD34D" />
                    <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Outer Ring - Ornate Gold */}
            <circle cx="100" cy="100" r="95" stroke="url(#gold-grad)" strokeWidth="4" />
            <circle cx="100" cy="100" r="90" stroke="#78350F" strokeWidth="1" opacity="0.5" />

            {/* Decorative Spikes on Ring */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <g key={i} transform={`rotate(${angle} 100 100)`}>
                    <path d="M100 5 L105 15 L100 12 L95 15 Z" fill="url(#gold-grad)" />
                    <circle cx="100" cy="12" r="2" fill="#FFFFFF" />
                </g>
            ))}

            {/* Inner Background - Deep Space */}
            <circle cx="100" cy="100" r="85" fill="#1E1B4B" />
            <circle cx="100" cy="100" r="85" fill="url(#inner-glow)" />

            {/* Inner Platinum Ring */}
            <circle cx="100" cy="100" r="65" stroke="url(#plat-grad)" strokeWidth="3" />

            {/* Wings */}
            <g transform="translate(100 100)">
                {/* Left Wing */}
                <path d="M-30 -10 Q-50 -30 -80 -20 Q-70 0 -50 10 Q-30 0 -30 -10" fill="url(#plat-grad)" />
                <path d="M-30 -10 Q-45 -25 -70 -15" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.5" />

                {/* Right Wing (Mirrored) */}
                <path d="M30 -10 Q50 -30 80 -20 Q70 0 50 10 Q30 0 30 -10" fill="url(#plat-grad)" />
                <path d="M30 -10 Q45 -25 70 -15" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.5" />
            </g>

            {/* Central Sun/Core */}
            <circle cx="100" cy="100" r="25" fill="url(#gold-grad)" />
            <circle cx="100" cy="100" r="20" fill="url(#sun-burst)" />

            {/* Sun Rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <path key={i} d={`M100 100 L${100 + Math.cos(angle * Math.PI / 180) * 40} ${100 + Math.sin(angle * Math.PI / 180) * 40}`} stroke="url(#gold-grad)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            ))}

            {/* Center Star */}
            <path d="M100 85 L104 96 L115 100 L104 104 L100 115 L96 104 L85 100 L96 96 Z" fill="#FFFFFF" filter="drop-shadow(0 0 2px #FCD34D)" />

        </svg>
    );
};
