import React from 'react';
import { PowerRankBadge, generateDynamicRank } from '@/components/dashboard/PowerRank';
import { getZoneInfo } from '@/data/zoneSystem';
import { ArrowLeft } from 'lucide-react';

interface ZoneShowcaseViewProps {
    onBack: () => void;
}

export const ZoneShowcaseView: React.FC<ZoneShowcaseViewProps> = ({ onBack }) => {
    // Generate previews for all 20 Zones
    const zones = Array.from({ length: 20 }, (_, i) => {
        const zoneId = i + 1;
        const info = getZoneInfo(zoneId);

        // Generate 3 sample ranks for each zone: Start, Middle, End (Max)
        const startPower = info.powerThreshold;
        const nextZoneThreshold = getZoneInfo(zoneId + 1).powerThreshold;
        const range = nextZoneThreshold - startPower;

        // Handle Zone 1 special case (starts at 0)
        const safeStartPower = zoneId === 1 ? 0 : startPower;
        const safeRange = zoneId === 1 ? 1250000 : range;

        const midPower = safeStartPower + Math.floor(safeRange * 0.5);
        const endPower = safeStartPower + safeRange - 1; // Just before next zone

        return {
            id: zoneId,
            info,
            ranks: [
                generateDynamicRank(safeStartPower),
                generateDynamicRank(midPower),
                generateDynamicRank(endPower)
            ]
        };
    });

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
                        Zone Visuals Showcase
                    </h1>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        Zones 1 - 20 Progression
                    </p>
                </div>
            </div>

            <div className="p-6 space-y-12">
                {zones.map((zone) => (
                    <div key={zone.id} className="space-y-4">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-2">
                            <div
                                className="w-8 h-8 rounded flex items-center justify-center font-bold text-black"
                                style={{ backgroundColor: zone.info.visuals.primaryColor }}
                            >
                                {zone.id}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">{zone.info.name}</h2>
                                <p className="text-xs text-slate-500">{zone.info.theme} Theme</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {zone.ranks.map((rank, idx) => (
                                <div
                                    key={idx}
                                    className={`
                                        flex flex-col items-center gap-3 p-6 rounded-2xl border relative overflow-hidden group transition-all duration-500
                                        bg-slate-900/40 hover:bg-slate-900/60
                                    `}
                                    style={{ borderColor: `${zone.info.visuals.borderColor}` }}
                                >
                                    {/* Background Overlay from Zone Definition */}
                                    <div className={`absolute inset-0 opacity-20 ${zone.info.visuals.overlayStyle}`}></div>

                                    {/* Background Glow */}
                                    <div
                                        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                                        style={{ background: zone.info.visuals.backgroundColor }}
                                    ></div>

                                    <div className="flex justify-between w-full items-center z-10">
                                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                                            Rank {rank.rank}
                                        </div>
                                        <div className="text-[10px] text-slate-600 font-mono">
                                            {rank.min.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="z-10 py-4 scale-110">
                                        <PowerRankBadge power={rank.min} size="lg" />
                                    </div>

                                    <div className="text-[10px] text-slate-500 font-mono z-10 mt-2">
                                        {rank.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
