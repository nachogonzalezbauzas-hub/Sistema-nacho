
import React, { useEffect, useState } from 'react';
import { Title } from '../types';

interface TitleUnlockModalProps {
  title: Title;
  onClose: () => void;
}

export const TitleUnlockModal: React.FC<TitleUnlockModalProps> = ({ title, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show && !title) return null;

  return (
    <div className={`fixed inset-0 z-[110] flex items-center justify-center bg-black/90 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Background Glitch Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-0 w-full h-[1px] bg-blue-500/50 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-purple-500/50 animate-pulse delay-100"></div>
      </div>

      <div className={`
        relative flex flex-col items-center transform transition-all duration-500
        ${show ? 'scale-100' : 'scale-150 blur-sm'}
      `}>
        
        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400 animate-text-shimmer italic tracking-tighter drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] mb-6 text-center">
          TITLE UNLOCKED
        </h2>

        <div className="relative p-1">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse rounded-full"></div>
          <div className="relative w-24 h-24 bg-slate-900 border-2 border-blue-500 rounded-full flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(37,99,235,0.6)] animate-bounce">
            {title.icon}
          </div>
        </div>

        <div className="mt-8 text-center space-y-2">
          <h3 className="text-3xl font-bold text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-glitch">
            {title.name}
          </h3>
          <div className="h-[1px] w-24 bg-blue-500 mx-auto"></div>
          <p className="text-blue-300 font-mono text-sm max-w-xs mx-auto leading-relaxed">
            {title.description}
          </p>
        </div>

      </div>
    </div>
  );
};
