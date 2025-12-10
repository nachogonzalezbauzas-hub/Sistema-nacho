import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateProceduralTitle, generateProceduralFrame, generateProceduralAchievement, ProceduralTitle, ProceduralFrame, ProceduralAchievement } from '@/utils/proceduralGenerator';
import { TitleBadge, AvatarOrb } from '@/components';
import { ItemRarity } from '@/types/core';
import { RefreshCw, ArrowLeft, Download, Check } from 'lucide-react';
import { t } from '@/data/translations';
import { useStore } from '@/store/useStore';
import { getIconByName } from '@/utils/iconMapper';

interface ProceduralShowcaseViewProps {
    onBack: () => void;
}

export const ProceduralShowcaseView: React.FC<ProceduralShowcaseViewProps> = ({ onBack }) => {
    const [titles, setTitles] = useState<ProceduralTitle[]>([]);
    const [frames, setFrames] = useState<ProceduralFrame[]>([]);
    const [achievements, setAchievements] = useState<ProceduralAchievement[]>([]);
    const [activeTab, setActiveTab] = useState<'titles' | 'frames' | 'achievements'>('titles');
    const [importedIds, setImportedIds] = useState<Set<string>>(new Set());

    const { importProceduralTitle, importProceduralFrame } = useStore((state) => state);

    const generateContent = () => {
        setTitles(Array.from({ length: 50 }, () => generateProceduralTitle()));
        setFrames(Array.from({ length: 50 }, () => generateProceduralFrame()));
        setAchievements(Array.from({ length: 50 }, () => generateProceduralAchievement()));
        setImportedIds(new Set()); // Reset imported state on regeneration
    };

    useEffect(() => {
        generateContent();
    }, []);

    const handleImportTitle = (title: ProceduralTitle) => {
        importProceduralTitle(title);
        setImportedIds(prev => new Set(prev).add(title.id));
    };

    const handleImportFrame = (frame: ProceduralFrame) => {
        importProceduralFrame(frame);
        setImportedIds(prev => new Set(prev).add(frame.id));
    };

    const RARITY_COLORS: Partial<Record<ItemRarity, string>> = {
        common: 'text-slate-400',
        uncommon: 'text-green-400',
        rare: 'text-blue-400',
        epic: 'text-purple-400',
        legendary: 'text-yellow-400',
        mythic: 'text-red-500',
        godlike: 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400',
        celestial: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-white drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]',
        transcendent: 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-black drop-shadow-[0_0_2px_rgba(168,85,247,0.8)] animate-pulse'
    };

    // Helper to render icon string or component
    const renderIcon = (iconName: string) => {
        const Icon = getIconByName(iconName, 24);
        return Icon || iconName;
    };

    return (
        <div className="h-full flex flex-col bg-[#050a14] animate-in fade-in duration-500 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-black/40 backdrop-blur-md flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-slate-400" />
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 uppercase tracking-tighter">
                            The System Director
                        </h2>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Procedural Content Generator v1.0</p>
                    </div>
                </div>
                <button
                    onClick={generateContent}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold uppercase text-xs tracking-wider shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                >
                    <RefreshCw size={14} /> Regenerate
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-2 gap-2 bg-black/20 border-b border-white/5">
                {(['titles', 'frames', 'achievements'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === tab ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {activeTab === 'titles' && titles.map((title) => (
                        <div key={title.id} className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-white/20 transition-colors group relative">
                            <TitleBadge title={title} />
                            <div className="flex items-center justify-between w-full mt-2">
                                <div className={`text-[9px] font-mono uppercase tracking-widest opacity-50 ${RARITY_COLORS[title.rarity] || 'text-slate-400'}`}>
                                    {title.rarity}
                                </div>
                                <button
                                    onClick={() => handleImportTitle(title)}
                                    disabled={importedIds.has(title.id)}
                                    className={`
                                        flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all
                                        ${importedIds.has(title.id)
                                            ? 'bg-green-500/20 text-green-400 cursor-default'
                                            : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                                        }
                                    `}
                                >
                                    {importedIds.has(title.id) ? (
                                        <><Check size={10} /> Saved</>
                                    ) : (
                                        <><Download size={10} /> Import</>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'frames' && frames.map((frame) => {
                        // Helper for rarity colors (matching AvatarFrameSelector)
                        const getRarityColors = (rarity: string) => {
                            switch (rarity) {
                                case 'C': return { border: 'border-slate-600', bg: 'bg-slate-900/50', text: 'text-slate-400' };
                                case 'B': return { border: 'border-green-600', bg: 'bg-green-950/30', text: 'text-green-400' };
                                case 'A': return { border: 'border-blue-600', bg: 'bg-blue-950/30', text: 'text-blue-400' };
                                case 'S': return { border: 'border-purple-600', bg: 'bg-purple-950/30', text: 'text-purple-400' };
                                case 'SS': return { border: 'border-yellow-500', bg: 'bg-yellow-950/30', text: 'text-yellow-400' };
                                case 'SSS': return { border: 'border-rose-600', bg: 'bg-rose-950/30', text: 'text-rose-400' };
                                case 'EX': return { border: 'border-cyan-400', bg: 'bg-cyan-950/30', text: 'text-cyan-400' };
                                case 'GOD': return { border: 'border-amber-400', bg: 'bg-amber-950/30', text: 'text-amber-400' };
                                default: return { border: 'border-slate-600', bg: 'bg-slate-900/50', text: 'text-slate-400' };
                            }
                        };

                        const rarityColors = getRarityColors(frame.rarity);
                        const isImported = importedIds.has(frame.id);

                        // Frame visual logic
                        const miniFrameStyle = `${frame.borderStyle || ''} ${frame.glowStyle || ''}`;
                        const miniEffect = frame.animation ? (
                            <div className={`absolute inset-[-4px] rounded-full ${frame.animation}`}></div>
                        ) : null;

                        return (
                            <div
                                key={frame.id}
                                className={`
                                    relative group flex flex-col items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 aspect-square
                                    ${rarityColors.border} ${rarityColors.bg}
                                    hover:scale-105 hover:z-10 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]
                                `}
                            >
                                {/* Rarity Badge */}
                                <div className={`absolute top-2 left-2 text-[10px] font-black px-1.5 py-0.5 rounded border ${rarityColors.border} ${rarityColors.text} bg-black/50 z-20`}>
                                    {frame.rarity}
                                </div>

                                {/* Import Button (Top Right) */}
                                <button
                                    onClick={() => handleImportFrame(frame)}
                                    disabled={isImported}
                                    className={`
                                        absolute top-2 right-2 p-1.5 rounded-lg border transition-all z-20
                                        ${isImported
                                            ? 'bg-green-500/20 border-green-500/50 text-green-400 cursor-default'
                                            : `bg-black/50 border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/30`
                                        }
                                    `}
                                    title={isImported ? "Imported" : "Import Frame"}
                                >
                                    {isImported ? <Check size={12} /> : <Download size={12} />}
                                </button>

                                {/* Frame Preview (Overflow Visible for Glows) */}
                                <div className="flex-1 flex items-center justify-center w-full overflow-visible">
                                    <div className={`
                                        w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center relative
                                        border-[3px] ${miniFrameStyle} bg-slate-900
                                    `}>
                                        {miniEffect}
                                    </div>
                                </div>

                                {/* Name */}
                                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center leading-tight w-full truncate ${rarityColors.text} opacity-80 group-hover:opacity-100`}>
                                    {frame.name}
                                </span>
                            </div>
                        );
                    })}

                    {activeTab === 'achievements' && achievements.map((ach) => (
                        <div key={ach.id} className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-2 hover:border-white/20 transition-colors relative overflow-hidden">
                            <div className={`absolute top-0 right-0 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-white/5 ${RARITY_COLORS[ach.rarity] || 'text-slate-400'}`}>
                                {ach.rarity}
                            </div>
                            <div className="text-2xl mb-1 flex items-center justify-center h-10 w-10 bg-white/5 rounded-full">
                                {renderIcon(ach.icon)}
                            </div>
                            <h4 className="text-xs font-bold text-slate-200">{ach.name}</h4>
                            <p className="text-[10px] text-slate-500 leading-tight">{ach.description}</p>
                            <div className="mt-2 text-[9px] font-mono text-blue-400">+{ach.xpReward} XP</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
