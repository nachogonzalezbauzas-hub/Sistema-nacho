
import React from 'react';
import { PassiveDefinition } from '../types';
import { PASSIVE_DEFINITIONS } from '../buffs';
import { Card, Button, StatIcon } from '../components/UIComponents';
import { Zap, Lock, ArrowUpCircle } from 'lucide-react';

interface PassivesViewProps {
  passivePoints: number;
  passiveLevels: Record<string, number>;
  onUpgrade: (id: string) => void;
}

export const PassivesView: React.FC<PassivesViewProps> = ({ passivePoints, passiveLevels, onUpgrade }) => {
  return (
    <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-end px-1 pb-4 border-b border-blue-900/30">
        <div>
          <h2 className="text-2xl font-black text-white italic tracking-tighter drop-shadow-md flex items-center gap-2">
            SKILLS <Zap className="text-yellow-500" size={24} />
          </h2>
          <p className="text-xs text-blue-400/80 font-mono uppercase tracking-widest mt-1">
            Passive Enhancements
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Available Points</span>
          <div className="text-3xl font-black text-blue-400 font-mono drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
            {passivePoints}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {PASSIVE_DEFINITIONS.map((passive: PassiveDefinition) => {
          const currentLevel = passiveLevels[passive.id] || 0;
          const isMaxed = currentLevel >= passive.maxLevel;
          const canUpgrade = passivePoints >= passive.costPerLevel && !isMaxed;

          // Calculate bonus display
          let bonusText = "";
          const bonuses = Object.entries(passive.statBonusesPerLevel);
          if (bonuses.length > 0) {
             const [stat, amt] = bonuses[0];
             bonusText = `+${Math.round(amt * currentLevel)} ${stat}`;
          }

          return (
            <Card key={passive.id} className="relative group overflow-hidden border-blue-900/30 bg-[#050a14]">
              {/* Progress Bar Background */}
              <div 
                className="absolute bottom-0 left-0 h-1 bg-blue-600 transition-all duration-500"
                style={{ width: `${(currentLevel / passive.maxLevel) * 100}%` }}
              ></div>

              <div className="flex items-center gap-4 relative z-10">
                <div className={`
                  w-14 h-14 rounded-lg flex items-center justify-center border text-2xl
                  ${currentLevel > 0 
                    ? 'bg-blue-950/50 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                    : 'bg-slate-900 border-slate-800 opacity-60'
                  }
                `}>
                  {passive.icon}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wide">
                      {passive.name}
                    </h3>
                    <span className="text-[10px] font-mono text-blue-400">
                      LVL {currentLevel}/{passive.maxLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">
                    {passive.description}
                  </p>
                  <div className="mt-1 text-[10px] text-green-400 font-mono font-bold">
                    {currentLevel > 0 ? `Active: ${bonusText}` : 'Inactive'}
                  </div>
                </div>

                <Button 
                  onClick={() => onUpgrade(passive.id)}
                  disabled={!canUpgrade}
                  className={`
                    h-10 w-10 p-0 rounded-full flex items-center justify-center
                    ${canUpgrade 
                      ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.4)]' 
                      : 'bg-slate-800 text-slate-600 border-slate-700'
                    }
                  `}
                >
                  {isMaxed ? <Lock size={14} /> : <ArrowUpCircle size={18} />}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
