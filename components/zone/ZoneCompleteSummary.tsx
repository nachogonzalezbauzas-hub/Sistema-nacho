import React from 'react';
import { motion } from 'framer-motion';
import { getZoneInfo } from '@/data/zoneSystem';
import { Crown, Shield, Star, ArrowRight } from 'lucide-react';

interface ZoneCompleteSummaryProps {
    zoneId: number;
    onClose: () => void;
}

export const ZoneCompleteSummary: React.FC<ZoneCompleteSummaryProps> = ({ zoneId, onClose }) => {
    const zoneInfo = getZoneInfo(zoneId);
    const visuals = zoneInfo.visuals;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
            {/* Background Visuals */}
            <div
                className="absolute inset-0 opacity-20"
                style={{ background: visuals.backgroundColor }}
            />
            <div className={`absolute inset-0 opacity-10 ${visuals.overlayStyle}`} />

            <div
                className="relative z-10 w-full max-w-lg p-8 rounded-3xl border text-center overflow-hidden"
                style={{
                    backgroundColor: '#02040a',
                    borderColor: visuals.primaryColor,
                    boxShadow: `0 0 40px ${visuals.primaryColor}30`
                }}
            >
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 1.5 }}
                    className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 border-2 relative"
                    style={{
                        backgroundColor: `${visuals.primaryColor}20`,
                        borderColor: visuals.primaryColor
                    }}
                >
                    <div className="absolute inset-0 rounded-full animate-pulse" style={{ boxShadow: `0 0 20px ${visuals.primaryColor}` }} />
                    <Crown size={48} style={{ color: visuals.primaryColor }} />
                </motion.div>

                <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-wider">Zone Conquered!</h2>
                <p className="text-slate-400 mb-8">You have unlocked <span style={{ color: visuals.primaryColor }}>{zoneInfo.name}</span></p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-black/40 rounded-xl border border-white/10 group hover:border-white/30 transition-colors">
                        <div className="font-bold mb-1 text-sm uppercase tracking-wider" style={{ color: visuals.secondaryColor }}>Title</div>
                        <div className="text-xs text-white font-mono">{zoneInfo.rewards.titleName}</div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-xl border border-white/10 group hover:border-white/30 transition-colors">
                        <div className="font-bold mb-1 text-sm uppercase tracking-wider" style={{ color: visuals.secondaryColor }}>Frame</div>
                        <div className="text-xs text-white font-mono">{zoneInfo.rewards.frameName}</div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-xl border border-white/10 group hover:border-white/30 transition-colors">
                        <div className="font-bold mb-1 text-sm uppercase tracking-wider" style={{ color: visuals.secondaryColor }}>Shadow</div>
                        <div className="text-xs text-white font-mono">{zoneInfo.rewards.shadowName}</div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest hover:scale-105 active:scale-95"
                    style={{
                        backgroundColor: visuals.primaryColor,
                        color: visuals.textColor,
                        boxShadow: `0 0 20px ${visuals.primaryColor}60`
                    }}
                >
                    Continue Journey <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};
