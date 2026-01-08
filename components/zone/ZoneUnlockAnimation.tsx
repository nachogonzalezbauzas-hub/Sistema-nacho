import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getZoneInfo } from '@/data/zoneSystem';
import { Sword, Shield, Crown, X } from 'lucide-react';

interface ZoneUnlockAnimationProps {
    zoneId: number;
    onComplete: () => void;
    onChallenge: () => void;
    onDismiss: () => void;
}

export const ZoneUnlockAnimation: React.FC<ZoneUnlockAnimationProps> = ({ zoneId, onComplete, onChallenge, onDismiss }) => {
    const [phase, setPhase] = useState<'intro' | 'reveal' | 'action'>('intro');
    const zoneInfo = getZoneInfo(zoneId);
    const visuals = zoneInfo.visuals;

    useEffect(() => {
        const timer1 = setTimeout(() => setPhase('reveal'), 3000);
        const timer2 = setTimeout(() => setPhase('action'), 6000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    // Dynamic styles based on Zone visuals
    const containerStyle = {
        background: visuals.backgroundColor.includes('gradient') ? visuals.backgroundColor : `linear-gradient(135deg, ${visuals.backgroundColor}, #000000)`,
    };

    const textStyle = {
        color: visuals.textColor,
        textShadow: `0 0 20px ${visuals.primaryColor}`,
    };

    // Helper to determine text color for buttons
    const getContrastColor = (hexColor: string) => {
        if (!hexColor) return '#000000';

        // Remove hash
        let hex = hexColor.replace('#', '');

        // Handle shorthand hex (e.g. fff -> ffffff)
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        // Convert to RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        if (isNaN(r) || isNaN(g) || isNaN(b)) return '#000000'; // Safety fallback

        // Calculate brightness (YIQ formula)
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq >= 128 ? '#000000' : '#ffffff';
    };

    const buttonStyle = {
        backgroundColor: visuals.primaryColor,
        color: getContrastColor(visuals.primaryColor),
        boxShadow: `0 0 15px ${visuals.primaryColor}80`,
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
                style={containerStyle}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background Overlay */}
                <div className={`absolute inset-0 opacity-30 ${visuals.overlayStyle}`}></div>

                {/* Particle Effects (Placeholder for now, can be expanded with specific particle components) */}
                {visuals.particleType !== 'none' && (
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Simple CSS animation for particles could go here */}
                        <div className={`absolute inset-0 opacity-20 bg-[url('/assets/particles/${visuals.particleType}.png')] animate-pulse`}></div>
                    </div>
                )}

                <div className="relative z-10 text-center p-8 max-w-2xl w-full mx-4 rounded-2xl border border-white/10 backdrop-blur-sm bg-black/40">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, type: 'spring' }}
                    >
                        <div className="mb-2 text-sm uppercase tracking-[0.3em] opacity-80" style={{ color: visuals.secondaryColor }}>
                            Zone {zoneId} Unlocked
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-wider" style={textStyle}>
                            {zoneInfo.name}
                        </h1>
                    </motion.div>

                    <AnimatePresence>
                        {phase !== 'intro' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mb-8"
                            >
                                <p className="text-xl md:text-2xl font-light italic opacity-90" style={{ color: visuals.textColor }}>
                                    "{zoneInfo.bossDescription}"
                                </p>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/50 border border-white/20">
                                    Floor Limit Reached
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/50 border border-white/20">
                                    Boss: {zoneInfo.bossName}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>



                    <AnimatePresence>
                        {phase === 'action' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8"
                            >
                                <button
                                    onClick={onChallenge}
                                    className="group relative px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                                    style={buttonStyle}
                                >
                                    <Sword size={20} />
                                    <span>Challenge Boss</span>
                                    <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>

                                <button
                                    onClick={onDismiss}
                                    className="px-8 py-4 bg-transparent border border-white/20 rounded-xl font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest text-sm"
                                >
                                    Prepare Later
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </AnimatePresence >
    );
};
