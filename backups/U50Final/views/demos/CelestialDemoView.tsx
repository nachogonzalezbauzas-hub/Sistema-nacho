import React from 'react';
import { POWER_RANKS, PowerRankBadge } from '@/components/dashboard/PowerRank';
import { ArrowLeft } from 'lucide-react';

interface CelestialDemoViewProps {
    onBack: () => void;
}

export const CelestialDemoView: React.FC<CelestialDemoViewProps> = ({ onBack }) => {
    // Show ALL ranks as requested
    const allRanks = POWER_RANKS;

    return (
        <div className="min-h-screen bg-[#02040a] pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-[#02040a]/90 backdrop-blur-md border-b border-blue-900/30 p-4 flex items-center gap-4 shadow-lg">
                <button
                    onClick={onBack}
                    className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-black text-white uppercase tracking-widest">
                        Power Ranks Showcase
                    </h1>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        Full Progression: 0 - 1,250,000 Power
                    </p>
                </div>
            </div>

            <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allRanks.map((rank) => {
                        const isCelestial = rank.rank >= 51;
                        const isShadowMonarch = rank.rank === 50;

                        return (
                            <div
                                key={rank.rank}
                                className={`
                                    flex flex-col items-center gap-3 p-6 rounded-2xl border relative overflow-hidden group transition-all duration-500
                                    bg-slate-900/40 border-cyan-500/30 hover:border-cyan-400/60 hover:bg-slate-900/60
                                `}
                            >
                                {/* Background Glow for Celestial/High Ranks */}
                                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="flex justify-between w-full items-center z-10">
                                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                                        #{rank.rank}
                                    </div>
                                    <div className="text-[10px] text-slate-600 font-mono">
                                        {rank.min.toLocaleString()}+
                                    </div>
                                </div>

                                <div className="z-10 py-4 scale-110">
                                    <PowerRankBadge power={rank.min} size="lg" />
                                </div>

                                <div className="text-[10px] text-slate-500 font-mono z-10 mt-2">
                                    {rank.name}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
