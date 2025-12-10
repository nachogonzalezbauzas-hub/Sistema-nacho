import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Equipment } from '@/types';
import { Hammer, Sparkles, XCircle, CheckCircle, Flame, Zap } from 'lucide-react';
import { t, Language } from '@/data/translations';
import { playSFX } from '@/utils/audioManager';

interface UpgradeModalProps {
    item: Equipment;
    onClose: () => void;
    onConfirm: () => void;
    cost: number;
    canAfford: boolean;
    successChance: number;
    language: Language;
    isUpgrading: boolean;
    upgradeResult: 'success' | 'failure' | null;
}

export const UPGRADE_ANIMATION_DURATION = 3500;

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
    item,
    onClose,
    onConfirm,
    cost,
    canAfford,
    successChance,
    language,
    isUpgrading,
    upgradeResult
}) => {
    const [phase, setPhase] = useState<'idle' | 'charging' | 'striking' | 'result'>('idle');
    const [hammerHit, setHammerHit] = useState(0); // Track which hit we're on (1, 2, 3)
    const [showResult, setShowResult] = useState(false); // Control when to show result
    const capturedResultRef = useRef<'success' | 'failure' | null>(null);

    // Capture the result when it arrives, but don't show it immediately
    useEffect(() => {
        if (upgradeResult && phase === 'striking') {
            capturedResultRef.current = upgradeResult;
        }
    }, [upgradeResult, phase]);

    // Manage animation phases
    useEffect(() => {
        if (isUpgrading) {
            setPhase('charging');
            setShowResult(false);
            setHammerHit(0);
            capturedResultRef.current = null;

            // Start striking phase after charging
            const timer1 = setTimeout(() => {
                setPhase('striking');
                setHammerHit(1);
            }, 800);

            // Second hit - slower, more deliberate
            const timer2 = setTimeout(() => setHammerHit(2), 1700);

            // Third hit
            const timer3 = setTimeout(() => setHammerHit(3), 2600);

            // Show result after all hits
            const timer4 = setTimeout(() => {
                setPhase('result');
                setShowResult(true);
            }, UPGRADE_ANIMATION_DURATION);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
                clearTimeout(timer4);
            };
        } else if (upgradeResult && !isUpgrading && phase !== 'striking') {
            // Only show result if we're not in the middle of animation
            setPhase('result');
            setShowResult(true);
            capturedResultRef.current = upgradeResult;
        } else if (!upgradeResult && !isUpgrading) {
            setPhase('idle');
            setShowResult(false);
            capturedResultRef.current = null;
        }
    }, [isUpgrading]);

    // Play sound on hammer hit
    useEffect(() => {
        if (phase === 'striking' && hammerHit > 0) {
            playSFX('hammer_hit');
        }
    }, [hammerHit, phase]);

    // Use captured result to avoid flashing wrong result
    const displayResult = showResult ? (capturedResultRef.current || upgradeResult) : null;

    // Particle config for explosions
    const particles = Array.from({ length: 16 }, (_, i) => ({
        id: i,
        angle: (360 / 16) * i,
        delay: Math.random() * 0.2,
        distance: 60 + Math.random() * 40,
    }));

    // Colors based on result
    const resultColor = displayResult === 'success' ? '#22c55e' : (displayResult === 'failure' ? '#ef4444' : '#eab308');
    const resultGlow = displayResult === 'success' ? 'rgba(34,197,94,0.6)' : (displayResult === 'failure' ? 'rgba(239,68,68,0.6)' : 'rgba(234,179,8,0.6)');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
        >
            {/* Backdrop */}
            <motion.div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center px-4">

                {/* Title - Only show when idle */}
                {phase === 'idle' && (
                    <motion.div
                        className="text-center mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                            {t('gear_upgrade_title', language)}
                        </h3>
                        <p className="text-slate-400 text-sm font-mono mt-1">
                            {t('gear_upgrade_subtitle', language)}
                        </p>
                    </motion.div>
                )}

                {/* Forge Container */}
                <div className="relative">
                    {/* Glow behind item */}
                    <motion.div
                        className="absolute inset-0 rounded-full blur-3xl -z-10"
                        style={{
                            backgroundColor: showResult ? resultGlow : 'rgba(234,179,8,0.3)'
                        }}
                        animate={{
                            scale: phase === 'striking' || showResult ? [1, 2, 1.5] : 1,
                            opacity: phase === 'striking' || showResult ? [0.3, 1, 0.8] : 0.3,
                        }}
                        transition={{ duration: 0.6 }}
                    />

                    {/* The Item being forged */}
                    <motion.div
                        className="relative"
                        animate={{
                            rotate: phase === 'charging' ? [0, -3, 3, -3, 3, -2, 2, 0] : 0,
                            scale: hammerHit > 0 && phase === 'striking' ? [1, 1.1, 1] : 1,
                            x: hammerHit > 0 && phase === 'striking' ? [0, 5, 0] : 0,
                        }}
                        transition={{
                            rotate: { duration: 0.6, repeat: phase === 'charging' ? Infinity : 0 },
                            scale: { duration: 0.15 },
                            x: { duration: 0.15 },
                        }}
                    >
                        <div
                            className="w-28 h-28 rounded-2xl flex items-center justify-center transition-all duration-300"
                            style={{
                                backgroundColor: showResult ? `${resultColor}20` : 'rgba(234,179,8,0.1)',
                                border: `3px solid ${showResult ? resultColor : '#eab308'}`,
                                boxShadow: `0 0 40px ${showResult ? resultGlow : 'rgba(234,179,8,0.5)'}`,
                            }}
                        >
                            {showResult && displayResult ? (
                                displayResult === 'success' ? (
                                    <CheckCircle size={56} className="text-green-500" />
                                ) : (
                                    <XCircle size={56} className="text-red-500" />
                                )
                            ) : (
                                <Sparkles size={48} className="text-yellow-500" />
                            )}
                        </div>

                        {/* Flames during charging */}
                        {phase === 'charging' && (
                            <>
                                {[...Array(4)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute"
                                        style={{
                                            left: `${15 + i * 20}%`,
                                            bottom: '0%',
                                        }}
                                        initial={{ opacity: 0, y: 0, scale: 0 }}
                                        animate={{
                                            opacity: [0, 1, 0],
                                            y: [-10, -40, -60],
                                            scale: [0.5, 1, 0.5]
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            delay: i * 0.15,
                                            repeat: Infinity
                                        }}
                                    >
                                        <Flame size={20} className="text-orange-500" />
                                    </motion.div>
                                ))}
                            </>
                        )}
                    </motion.div>

                    {/* Hammer strike animation - 3 heavy hits from top-left corner */}
                    <AnimatePresence>
                        {phase === 'striking' && hammerHit > 0 && (
                            <motion.div
                                key={hammerHit}
                                className="absolute z-20"
                                style={{ left: '-80px', top: '-80px' }} // Moved further away
                                initial={{
                                    x: -40,
                                    y: -40,
                                    rotate: -70,
                                    opacity: 0,
                                    scale: 0.8
                                }}
                                animate={{
                                    x: [-40, 20, 15, -40], // Reduced travel distance into the item
                                    y: [-40, 30, 25, -40], // Reduced travel distance into the item
                                    rotate: [-70, 10, 5, -70], // Less rotation to avoid covering
                                    opacity: [0, 1, 1, 0],
                                    scale: [0.8, 1.1, 1, 0.8],
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.22, 0.68, 0.35, 1.0], // Custom easing for weight
                                    times: [0, 0.4, 0.5, 1] // Hold at impact briefly
                                }}
                            >
                                <Hammer
                                    size={64}
                                    className="text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.9)]"
                                    style={{ transform: 'rotate(45deg)' }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Strike flash - one per hit, delayed for impact */}
                    <AnimatePresence>
                        {phase === 'striking' && hammerHit > 0 && (
                            <motion.div
                                key={`flash-${hammerHit}`}
                                className="absolute inset-[-20px] rounded-3xl bg-yellow-500/50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.9, 0] }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Sparks on each hit */}
                    <AnimatePresence>
                        {phase === 'striking' && hammerHit > 0 && (
                            <>
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={`spark-${hammerHit}-${i}`}
                                        className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full"
                                        style={{ left: '20%', top: '50%' }}
                                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                        animate={{
                                            x: -20 + Math.random() * 80,
                                            y: -40 + Math.random() * 80,
                                            opacity: [1, 1, 0],
                                            scale: [1, 1.5, 0],
                                        }}
                                        transition={{ duration: 0.4, delay: i * 0.03, ease: 'easeOut' }}
                                    />
                                ))}
                            </>
                        )}
                    </AnimatePresence>

                    {/* Explosion Particles on result */}
                    {showResult && (
                        <>
                            {particles.map((p) => (
                                <motion.div
                                    key={p.id}
                                    className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                                    style={{ backgroundColor: resultColor }}
                                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                    animate={{
                                        x: Math.cos(p.angle * Math.PI / 180) * p.distance,
                                        y: Math.sin(p.angle * Math.PI / 180) * p.distance,
                                        opacity: [1, 1, 0],
                                        scale: [1, 1.5, 0],
                                    }}
                                    transition={{ duration: 0.8, delay: p.delay, ease: 'easeOut' }}
                                />
                            ))}
                        </>
                    )}
                </div>

                {/* Level indicator */}
                <motion.div
                    className="mt-4 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700 text-sm font-bold text-white"
                    animate={{
                        borderColor: showResult ? resultColor : '#334155',
                        boxShadow: showResult ? `0 0 20px ${resultGlow}` : 'none',
                    }}
                >
                    <span className="text-slate-400">Nivel</span> +{item.level}
                    <span className="text-slate-500 mx-2">→</span>
                    <span className={showResult && displayResult === 'success' ? 'text-green-400' : 'text-blue-400'}>
                        +{item.level + 1}
                    </span>
                </motion.div>

                {/* Result Text - only when showResult is true */}
                {showResult && displayResult && (
                    <motion.div
                        className="mt-6 text-center"
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <p className={`text-3xl font-black uppercase tracking-widest ${displayResult === 'success' ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {displayResult === 'success' ? '¡ÉXITO!' : 'FALLÓ'}
                        </p>
                        <p className="text-slate-500 text-xs mt-1 font-mono">
                            {displayResult === 'success'
                                ? `+${item.level} → +${item.level + 1}`
                                : 'El objeto permanece igual'}
                        </p>
                    </motion.div>
                )}

                {/* Stats & Cost Panel - Only show when idle */}
                {phase === 'idle' && (
                    <motion.div
                        className="mt-6 w-full max-w-xs space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex justify-between text-sm font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                            <span className="text-slate-400">Probabilidad</span>
                            <span className={`font-bold flex items-center gap-1 ${successChance >= 0.8 ? 'text-green-400' :
                                successChance >= 0.5 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                <Zap size={14} />
                                {Math.round(successChance * 100)}%
                            </span>
                        </div>
                        <div className="flex justify-between text-sm font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                            <span className="text-slate-400">Coste</span>
                            <span className={`font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>
                                {cost} Shards
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* Loading text */}
                {phase === 'charging' && (
                    <motion.p
                        className="mt-6 text-sm font-bold uppercase tracking-widest text-orange-400"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        Calentando...
                    </motion.p>
                )}

                {phase === 'striking' && (
                    <motion.p
                        className="mt-6 text-lg font-black uppercase tracking-widest text-yellow-400"
                        key={hammerHit}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        ¡GOLPE {hammerHit}!
                    </motion.p>
                )}

                {/* Action Buttons */}
                {(phase === 'idle' || (phase === 'result' && showResult)) && (
                    <motion.div
                        className="mt-6 flex gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: showResult ? 0.3 : 0 }}
                    >
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold uppercase tracking-wider transition-colors"
                        >
                            {showResult ? 'Cerrar' : 'Cancelar'}
                        </button>
                        {phase === 'idle' && (
                            <button
                                onClick={onConfirm}
                                disabled={!canAfford}
                                className={`px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg ${canAfford
                                    ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-[0_0_20px_rgba(234,179,8,0.4)]'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <Hammer size={18} />
                                    Mejorar
                                </span>
                            </button>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};
