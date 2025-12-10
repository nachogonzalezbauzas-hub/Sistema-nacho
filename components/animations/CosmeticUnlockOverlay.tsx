import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, Frame, User } from 'lucide-react';
import { Title, AvatarFrame, ItemRarity } from '@/types';

type CosmeticType = 'title' | 'frame' | 'avatar';

interface CosmeticUnlockOverlayProps {
    isOpen: boolean;
    cosmeticType: CosmeticType;
    cosmetic: Title | AvatarFrame | any;
    onClose: () => void;
}

import { rarityColors } from '@/data/rarityColors';

const cosmeticIcons: Record<CosmeticType, React.ReactNode> = {
    title: <Crown size={72} />,
    frame: <Frame size={72} />,
    avatar: <User size={72} />,
};

const cosmeticLabels: Record<CosmeticType, string> = {
    title: 'NUEVO TÍTULO',
    frame: 'NUEVO MARCO',
    avatar: 'NUEVO AVATAR',
};

export const CosmeticUnlockOverlay: React.FC<CosmeticUnlockOverlayProps> = ({
    isOpen,
    cosmeticType,
    cosmetic,
    onClose
}) => {
    const [phase, setPhase] = useState<'entering' | 'showing' | 'exiting'>('entering');

    // Get rarity from cosmetic
    const rarity = (cosmetic as any)?.rarity || 'rare';
    const colors = rarityColors[rarity] || rarityColors.rare;
    const name = (cosmetic as any)?.name || 'Unknown';
    const icon = (cosmetic as Title)?.icon || cosmeticIcons[cosmeticType];
    const description = (cosmetic as any)?.description || '';

    useEffect(() => {
        if (isOpen) {
            setPhase('entering');
            const timer1 = setTimeout(() => setPhase('showing'), 600);
            return () => clearTimeout(timer1);
        }
    }, [isOpen]);

    const handleClose = () => {
        setPhase('exiting');
        setTimeout(onClose, 400);
    };

    const particles = Array.from({ length: 16 }, (_, i) => ({
        id: i,
        angle: (360 / 16) * i + Math.random() * 10,
        distance: 100 + Math.random() * 60,
        delay: Math.random() * 0.3,
        size: 3 + Math.random() * 4,
    }));

    // Removed orbiting sparkles - user didn't like them

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={phase === 'showing' ? handleClose : undefined}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/95 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />

                    {/* Main Content */}
                    <div className="relative z-10 flex flex-col items-center px-4">

                        {/* "NEW UNLOCK" Banner */}
                        <motion.div
                            className="mb-8 px-6 py-2 rounded-full border-2 font-black text-sm uppercase tracking-[0.2em]"
                            style={{
                                borderColor: colors.border,
                                color: colors.text,
                                boxShadow: `0 0 20px ${colors.glow}`,
                            }}
                            initial={{ y: -50, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        >
                            {cosmeticLabels[cosmeticType]}
                        </motion.div>

                        {/* Icon Container */}
                        <motion.div
                            className="relative mb-6"
                            initial={{ y: 100, opacity: 0, scale: 0.3 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 150, damping: 15 }}
                        >
                            {/* Glow behind icon */}
                            <motion.div
                                className="absolute inset-0 rounded-full blur-3xl -z-10"
                                style={{ backgroundColor: colors.glow }}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.6, 1, 0.6],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />

                            {/* Icon Circle - Larger */}
                            <motion.div
                                className="w-48 h-48 rounded-full flex items-center justify-center"
                                style={{
                                    backgroundColor: `${colors.text}15`,
                                    border: `4px solid ${colors.border}`,
                                    boxShadow: `0 0 60px ${colors.glow}, inset 0 0 30px ${colors.glow}`,
                                }}
                                animate={{
                                    boxShadow: [
                                        `0 0 60px ${colors.glow}, inset 0 0 30px ${colors.glow}`,
                                        `0 0 100px ${colors.glow}, inset 0 0 50px ${colors.glow}`,
                                        `0 0 60px ${colors.glow}, inset 0 0 30px ${colors.glow}`,
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <span style={{ filter: `drop-shadow(0 0 15px ${colors.text})`, color: colors.text }}>
                                    {icon}
                                </span>
                            </motion.div>

                            {/* Explosion Particles */}
                            {phase === 'entering' && particles.map((p) => (
                                <motion.div
                                    key={p.id}
                                    className="absolute left-1/2 top-1/2 rounded-full"
                                    style={{
                                        backgroundColor: colors.text,
                                        width: p.size,
                                        height: p.size,
                                    }}
                                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                    animate={{
                                        x: Math.cos(p.angle * Math.PI / 180) * p.distance,
                                        y: Math.sin(p.angle * Math.PI / 180) * p.distance,
                                        opacity: [1, 1, 0],
                                        scale: [1, 1.5, 0],
                                    }}
                                    transition={{ duration: 1, delay: p.delay + 0.3, ease: 'easeOut' }}
                                />
                            ))}

                            {/* Removed orbiting sparkles */}
                        </motion.div>

                        {/* Name */}
                        <motion.h2
                            className="text-3xl font-black uppercase tracking-wider text-center mb-2"
                            style={{
                                color: colors.text,
                                textShadow: `0 0 20px ${colors.glow}`,
                            }}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {name}
                        </motion.h2>

                        {/* Rarity Badge */}
                        <motion.div
                            className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
                            style={{
                                backgroundColor: colors.text,
                                color: rarity === 'common' ? '#1e293b' : '#000',
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, type: 'spring' }}
                        >
                            {rarity}
                        </motion.div>

                        {/* Description */}
                        {description && (
                            <motion.p
                                className="text-sm text-slate-400 text-center max-w-xs mb-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                {description}
                            </motion.p>
                        )}

                        {/* Tap to continue */}
                        <motion.p
                            className="text-xs text-slate-600 uppercase tracking-widest"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0.5, 1] }}
                            transition={{ delay: 1, duration: 2, repeat: Infinity }}
                        >
                            Toca para continuar
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
