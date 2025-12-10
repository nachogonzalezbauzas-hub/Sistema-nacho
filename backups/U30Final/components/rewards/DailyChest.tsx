
import React, { useState } from 'react';
import { StatType, BuffId } from '../../types';
import { Button, Modal, StatIcon } from '../UIComponents';
import { Gift, Sparkles, Lock } from 'lucide-react';
import { BUFF_DEFINITIONS } from '../../data/buffs';

interface DailyChestProps {
  isAvailable: boolean;
  onClaim: () => { xpReward: number; buffId?: BuffId } | null;
}

export const DailyChest: React.FC<DailyChestProps> = ({ isAvailable, onClaim }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reward, setReward] = useState<{ xpReward: number; buffId?: BuffId } | null>(null);
  const [animating, setAnimating] = useState(false);

  const handleOpen = () => {
    if (!isAvailable || animating) return;
    setAnimating(true);

    // Simulate animation delay
    setTimeout(() => {
      const result = onClaim();
      if (result) {
        setReward(result);
        setIsOpen(true);
      }
      setAnimating(false);
    }, 1500);
  };

  if (!isAvailable && !animating) return null;

  const buffDef = reward?.buffId ? BUFF_DEFINITIONS.find(b => b.id === reward.buffId) : null;

  return (
    <>
      <div className="relative group w-full mb-6 cursor-pointer" onClick={handleOpen}>
        <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-lg group-hover:bg-blue-500/20 transition-all duration-500 animate-pulse"></div>
        <div className={`
          relative overflow-hidden border border-blue-500/50 bg-[#050a14] rounded-lg p-4 flex items-center justify-between
          transition-all duration-300 hover:scale-[1.02] hover:border-blue-400
          ${animating ? 'animate-shake' : ''}
        `}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-md opacity-50 animate-pulse"></div>
              <Gift className={`relative z-10 text-blue-300 ${animating ? 'animate-bounce' : ''}`} size={32} />
            </div>
            <div>
              <h3 className="font-black text-white italic tracking-wider">DAILY CHEST</h3>
              <p className="text-[10px] text-blue-400 font-mono uppercase tracking-widest">
                {animating ? 'OPENING SYSTEM...' : 'REWARD AVAILABLE'}
              </p>
            </div>
          </div>

          <div className="h-8 w-8 rounded-full border border-blue-500 flex items-center justify-center bg-blue-900/50 animate-spin-slow">
            <Sparkles size={14} className="text-yellow-400" />
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="SYSTEM REWARD">
        <div className="flex flex-col items-center justify-center py-6 text-center">

          {reward?.xpReward ? (
            <div className="mb-4">
              <h3 className="text-blue-400 font-bold tracking-[0.2em] text-xs uppercase">XP Acquired</h3>
              <div className="text-4xl font-black text-white italic drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                +{reward.xpReward} XP
              </div>
            </div>
          ) : null}

          {buffDef ? (
            <div className="w-full bg-slate-900/50 border border-blue-500/30 p-4 rounded-lg animate-in zoom-in duration-300 mb-4">
              <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-3">Buff Activated</div>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{buffDef.icon}</div>
                <div className="text-left">
                  <div className="font-bold text-white text-sm">{buffDef.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{buffDef.description}</div>
                  <div className="text-[10px] text-blue-400 font-bold mt-1">{buffDef.durationMinutes}m Duration</div>
                </div>
              </div>
            </div>
          ) : null}

          <Button onClick={() => setIsOpen(false)} className="w-full">
            ACCEPT REWARD
          </Button>
        </div>
      </Modal>
    </>
  );
};
