
import React from 'react';
import { User, Zap, Trophy, Book, Calendar, Flame, X, Settings, Brain, Skull, DoorOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GateMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const GateMenu: React.FC<GateMenuProps> = ({ isOpen, onClose, onNavigate }) => {
  const tiles = [
    { id: 'Perfil', label: 'Profile', icon: User, color: 'blue', desc: 'Hunter Status' },
    { id: 'Skills', label: 'Skills', icon: Zap, color: 'purple', desc: 'Abilities' },
    { id: 'Logros', label: 'Achievements', icon: Trophy, color: 'yellow', desc: 'Trophies' },
    { id: 'Logs', label: 'System Logs', icon: Book, color: 'slate', desc: 'History' },
    { id: 'Calendar', label: 'Calendar', icon: Calendar, color: 'cyan', desc: 'Schedule' },
    { id: 'Buffs', label: 'Buffs', icon: Flame, color: 'red', desc: 'Active Effects' },
    { id: 'Settings', label: 'Settings', icon: Settings, color: 'slate', desc: 'System Config' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040a]/95 backdrop-blur-xl p-4"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse-slow delay-1000"></div>
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, #02040a 100%)' }}></div>
          </div>

          <div className="w-full max-w-md h-full flex flex-col relative z-10">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-2 text-slate-500 hover:text-blue-400 transition-colors z-20 hover:bg-blue-900/20 rounded-full"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-12 mb-8 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-blue-400 animate-ping opacity-50"></div>
                </div>
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-blue-400 to-blue-100 tracking-[0.2em] uppercase italic drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  System Gate
                </h2>
              </div>
              <div className="flex items-center justify-center gap-2 text-blue-500/60 text-[10px] uppercase tracking-[0.4em] font-bold">
                <span className="w-8 h-[1px] bg-blue-500/50"></span>
                Select Module
                <span className="w-8 h-[1px] bg-blue-500/50"></span>
              </div>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-24 scrollbar-hide px-2">
              {tiles.map((tile, index) => {
                const Icon = tile.icon;
                let colorStyles = "";
                switch (tile.color) {
                  case 'blue': colorStyles = "border-blue-500/30 hover:border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.1)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] text-blue-400"; break;
                  case 'purple': colorStyles = "border-purple-500/30 hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] text-purple-400"; break;
                  case 'yellow': colorStyles = "border-yellow-500/30 hover:border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] text-yellow-400"; break;
                  case 'red': colorStyles = "border-red-500/30 hover:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] text-red-400"; break;
                  case 'cyan': colorStyles = "border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] text-cyan-400"; break;
                  default: colorStyles = "border-slate-700 hover:border-slate-500 shadow-[0_0_15px_rgba(148,163,184,0.1)] hover:shadow-[0_0_25px_rgba(148,163,184,0.2)] text-slate-400";
                }

                return (
                  <motion.button
                    key={tile.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onNavigate(tile.id);
                      onClose();
                    }}
                    className={`
                      relative group flex flex-col items-center justify-center p-6 rounded-xl border bg-[#050a14]/80 backdrop-blur-sm transition-all duration-300
                      ${colorStyles}
                    `}
                  >
                    {/* Hover Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-${tile.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`}></div>

                    {/* Icon Container */}
                    <div className={`
                      relative p-4 rounded-full mb-3 bg-[#02040a] border border-opacity-20 group-hover:scale-110 transition-transform duration-300
                      ${colorStyles.split(' ')[0]}
                    `}>
                      <Icon size={28} className={`relative z-10 drop-shadow-[0_0_8px_currentColor]`} />
                      {/* Icon Glow */}
                      <div className={`absolute inset-0 blur-md opacity-20 bg-current rounded-full`}></div>
                    </div>

                    <span className="text-sm font-bold uppercase tracking-wider text-slate-200 group-hover:text-white transition-colors">{tile.label}</span>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 group-hover:text-slate-400 transition-colors">{tile.desc}</span>

                    {/* Corner Accents */}
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-current opacity-50"></div>
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-current opacity-50"></div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
