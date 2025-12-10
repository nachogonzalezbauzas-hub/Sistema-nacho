
import React, { useEffect, useState, useRef } from 'react';
import { StatType } from '@/types';
import { Button, StatIcon, StatBadge } from '@/components';
import { Trophy, ArrowRight, Sparkles, Star, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type MissionRewardSummary = {
  missionId: string;
  missionTitle: string;
  targetStat: StatType;
  xpGained: number;
  previousStatValue: number;
  newStatValue: number;
};

interface RewardModalProps {
  isOpen?: boolean;
  reward: MissionRewardSummary;
  onClose: () => void;
}

// Particle component
const Particle: React.FC<{ delay: number }> = ({ delay }) => {
  const randomX = Math.random() * 100 - 50;
  const randomY = Math.random() * 100 - 50;
  const size = Math.random() * 8 + 4;
  const duration = Math.random() * 2 + 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        x: randomX,
        y: randomY
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }}
      className="absolute top-1/2 left-1/2 pointer-events-none"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(59,130,246,1) 0%, rgba(147,197,253,0) 100%)`
      }}
    />
  );
};

export const RewardModal: React.FC<RewardModalProps> = ({ isOpen, reward, onClose }) => {
  const [show, setShow] = useState(false);
  const [statValue, setStatValue] = useState(reward.previousStatValue);
  const [xpDisplayed, setXpDisplayed] = useState(0);
  const [showClaim, setShowClaim] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setShow(true);

    // Play success sound
    const audio = new Audio('/audio/mission-complete.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => { });

    // Animate XP counter
    const xpDuration = 800;
    const xpStart = performance.now();
    const animateXp = (now: number) => {
      const elapsed = now - xpStart;
      const progress = Math.min(elapsed / xpDuration, 1);
      setXpDisplayed(Math.floor(progress * reward.xpGained));
      if (progress < 1) requestAnimationFrame(animateXp);
    };
    requestAnimationFrame(animateXp);

    // Animate stat number after XP finishes
    const timer = setTimeout(() => {
      setStatValue(reward.newStatValue);
    }, 1000);

    // Show claim button
    const claimTimer = setTimeout(() => {
      setShowClaim(true);
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(claimTimer);
    };
  }, [reward, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
      >
        {/* Background Pulse Effect */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 3, 4], opacity: [0.5, 0.2, 0] }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-40 h-40 rounded-full bg-blue-500" />
        </motion.div>

        {/* Particles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <Particle key={i} delay={i * 0.1} />
          ))}
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 100, rotateX: 45 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.2 }}
          className="relative w-full max-w-md mx-6"
        >
          {/* Glow Effect */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px rgba(59,130,246,0.4)',
                '0 0 60px rgba(59,130,246,0.6)',
                '0 0 30px rgba(59,130,246,0.4)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-1 bg-gradient-to-b from-blue-500/30 to-blue-900/10 rounded-2xl blur-lg"
          />

          <div className="relative bg-[#050a14] rounded-2xl overflow-hidden border-2 border-blue-500/50 p-8 flex flex-col items-center">

            {/* Victory Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.4 }}
              className="relative mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 border-2 border-dashed border-blue-500/30 rounded-full"
              />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                <Trophy size={36} className="text-white" />
              </div>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-8"
            >
              <motion.h3
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-blue-400 font-bold tracking-[0.3em] text-xs uppercase mb-2"
              >
                Mission Complete
              </motion.h3>
              <h2 className="text-2xl font-black text-white italic tracking-tighter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                {reward.missionTitle}
              </h2>
            </motion.div>

            {/* Rewards Container */}
            <div className="w-full space-y-4 mb-8">

              {/* XP Gain */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", delay: 0.6 }}
                className="bg-slate-900/50 border border-blue-900/30 p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-500/30"
                  >
                    <Sparkles size={18} className="text-blue-400" />
                  </motion.div>
                  <span className="font-bold text-slate-300">Experience</span>
                </div>
                <motion.span
                  key={xpDisplayed}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="text-xl font-black font-mono text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                >
                  +{xpDisplayed} XP
                </motion.span>
              </motion.div>

              {/* Stat Gain */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", delay: 0.8 }}
                className="bg-slate-900/50 border border-blue-900/30 p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: statValue > reward.previousStatValue ? [0, 10, -10, 0] : 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700"
                  >
                    <StatIcon stat={reward.targetStat} size={20} />
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-300">{String(reward.targetStat || 'Stat')}</span>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Attribute Up</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono text-lg">{reward.previousStatValue}</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <ArrowRight size={14} className="text-blue-500" />
                  </motion.div>
                  <motion.span
                    key={statValue}
                    initial={{ scale: 2, color: '#22c55e' }}
                    animate={{ scale: 1, color: statValue > reward.previousStatValue ? '#22c55e' : '#ffffff' }}
                    transition={{ type: "spring" }}
                    className="text-2xl font-black font-mono drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  >
                    {statValue}
                  </motion.span>
                </div>
              </motion.div>

            </div>

            {/* Claim Button */}
            <AnimatePresence>
              {showClaim && (
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  className="w-full"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full h-14 text-lg font-bold uppercase tracking-widest bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all"
                  >
                    Claim Reward
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

