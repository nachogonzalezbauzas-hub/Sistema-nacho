
import React, { useEffect, useState } from 'react';
import { StatType } from '../types';
import { Button, StatIcon, StatBadge } from './UIComponents';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';

export type MissionRewardSummary = {
  missionId: string;
  missionTitle: string;
  targetStat: StatType;
  xpGained: number;
  previousStatValue: number;
  newStatValue: number;
};

interface RewardModalProps {
  reward: MissionRewardSummary;
  onClose: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({ reward, onClose }) => {
  const [show, setShow] = useState(false);
  const [statValue, setStatValue] = useState(reward.previousStatValue);

  useEffect(() => {
    setShow(true);
    // Animate stat number
    const timer = setTimeout(() => {
      setStatValue(reward.newStatValue);
    }, 600);
    return () => clearTimeout(timer);
  }, [reward]);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className={`
          relative w-full max-w-md mx-6 p-1 rounded-2xl bg-gradient-to-b from-blue-500/50 to-blue-900/20 
          transform transition-all duration-500 ease-out
          ${show ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}
        `}
      >
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-2xl animate-pulse"></div>
        
        <div className="relative bg-[#050a14] rounded-xl overflow-hidden border border-blue-500/30 p-8 flex flex-col items-center">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-blue-400 font-bold tracking-[0.3em] text-xs uppercase mb-2 animate-pulse">Mission Complete</h3>
            <h2 className="text-2xl font-black text-white italic tracking-tighter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              {reward.missionTitle}
            </h2>
          </div>

          {/* Rewards Container */}
          <div className="w-full space-y-4 mb-8">
            
            {/* XP Gain */}
            <div className="bg-slate-900/50 border border-blue-900/30 p-4 rounded-lg flex items-center justify-between animate-in slide-in-from-left duration-500 delay-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-500/30">
                  <Sparkles size={18} className="text-blue-400 animate-spin-slow" />
                </div>
                <span className="font-bold text-slate-300">Experience</span>
              </div>
              <span className="text-xl font-black font-mono text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]">
                +{reward.xpGained} XP
              </span>
            </div>

            {/* Stat Gain */}
            <div className="bg-slate-900/50 border border-blue-900/30 p-4 rounded-lg flex items-center justify-between animate-in slide-in-from-right duration-500 delay-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <StatIcon stat={reward.targetStat} size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-300">{reward.targetStat}</span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">Attribute Up</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <span className="text-slate-500 font-mono text-lg">{reward.previousStatValue}</span>
                 <ArrowRight size={14} className="text-blue-500" />
                 <span className={`text-2xl font-black font-mono ${reward.newStatValue > reward.previousStatValue ? 'text-green-400 scale-110' : 'text-white'} transition-all duration-300`}>
                   {statValue}
                 </span>
              </div>
            </div>

          </div>

          <Button 
            onClick={onClose} 
            className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] animate-in zoom-in duration-300 delay-300"
          >
            CLAIM REWARD
          </Button>

        </div>
      </div>
    </div>
  );
};
