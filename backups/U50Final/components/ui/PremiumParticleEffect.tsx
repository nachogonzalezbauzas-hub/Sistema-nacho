import React, { useRef, useEffect } from 'react';
import { ItemRarity } from '@/types/core';

interface PremiumParticleEffectProps {
    rarity: ItemRarity;
    width?: number;
    height?: number;
    className?: string;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
    maxLife: number;
    alpha: number;
}

export const PremiumParticleEffect: React.FC<PremiumParticleEffectProps> = ({
    rarity,
    width = 300,
    height = 100,
    className = ''
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize canvas to match display size for sharpness
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        let particles: Particle[] = [];
        let animationFrameId: number;

        const createParticle = (): Particle => {
            const w = canvas.width;
            const h = canvas.height;

            if (rarity === 'godlike') {
                // Golden sparks rising
                return {
                    x: Math.random() * w,
                    y: h + Math.random() * 10,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: -Math.random() * 1.5 - 0.5,
                    size: Math.random() * 2 + 0.5,
                    color: `rgba(255, 215, 0, ${Math.random()})`, // Gold
                    life: 0,
                    maxLife: 60 + Math.random() * 40,
                    alpha: 1
                };
            } else if (rarity === 'celestial') {
                // Starfield / Nebula
                return {
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                    size: Math.random() * 1.5,
                    color: Math.random() > 0.5 ? '#67e8f9' : '#e879f9', // Cyan / Fuchsia
                    life: Math.random() * 100,
                    maxLife: 200,
                    alpha: Math.random()
                };
            } else if (rarity === 'transcendent') {
                // Glitch / Void
                return {
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    size: Math.random() * 3,
                    color: Math.random() > 0.5 ? '#d946ef' : '#000000', // Fuchsia / Black
                    life: 0,
                    maxLife: 20 + Math.random() * 20,
                    alpha: 1
                };
            }

            // Default fallback
            return {
                x: w / 2, y: h / 2, vx: 0, vy: 0, size: 1, color: '#fff', life: 0, maxLife: 100, alpha: 1
            };
        };

        const update = () => {
            const w = canvas.width;
            const h = canvas.height;

            // Clear canvas
            ctx.clearRect(0, 0, w, h);

            // Spawn particles
            let spawnRate = 1;
            let maxParticles = 50;

            if (rarity === 'celestial') {
                spawnRate = 2;
                maxParticles = 100; // Dense starfield
            } else if (rarity === 'transcendent') {
                spawnRate = 3;
                maxParticles = 150; // Chaotic void
            }

            if (particles.length < maxParticles) {
                for (let i = 0; i < spawnRate; i++) particles.push(createParticle());
            }

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.life++;

                if (rarity === 'godlike') {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.alpha = 1 - (p.life / p.maxLife);
                } else if (rarity === 'celestial') {
                    // Swirling nebula effect
                    const dx = p.x - w / 2;
                    const dy = p.y - h / 2;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);

                    p.vx += Math.cos(angle + Math.PI / 2) * 0.05; // Orbit
                    p.vy += Math.sin(angle + Math.PI / 2) * 0.05;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.alpha = 0.6 + 0.4 * Math.sin(Date.now() * 0.005 + p.x * 0.1); // Intense pulsing
                } else if (rarity === 'transcendent') {
                    // Aggressive glitch / void tear
                    if (Math.random() > 0.9) {
                        p.x = Math.random() * w; // Teleport
                        p.y = Math.random() * h;
                    } else {
                        p.x += (Math.random() - 0.5) * 15; // Violent jitter
                        p.y += (Math.random() - 0.5) * 15;
                    }
                    p.alpha = Math.random() > 0.5 ? 1 : 0.2; // Strobe
                }

                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;

                if (rarity === 'transcendent') {
                    ctx.fillRect(p.x, p.y, p.size * (Math.random() * 2 + 1), p.size); // Horizontal glitch lines
                } else if (rarity === 'celestial') {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = p.color;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Reset dead particles
                if (p.life >= p.maxLife || p.alpha <= 0 || p.y < -50 || p.x < -50 || p.x > w + 50 || p.y > h + 50) {
                    particles[i] = createParticle();
                }
            }

            ctx.globalAlpha = 1;
            animationFrameId = requestAnimationFrame(update);
        };

        update();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [rarity]);

    return (
        <canvas
            ref={canvasRef}
            className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
        />
    );
};
