import React from 'react';
import { motion } from 'framer-motion';

type TabType = 'Normal' | 'Epic' | 'Dungeons';

interface MissionTabsProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    setSelectedDungeonId: (id: string | null) => void;
}

export const MissionTabs: React.FC<MissionTabsProps> = ({ activeTab, setActiveTab, setSelectedDungeonId }) => {
    return (
        <div className="flex justify-center mb-6 relative z-30">
            <div className="bg-[#050a14]/80 p-1.5 rounded-xl border border-blue-900/30 flex gap-1 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
                {(['Normal', 'Epic', 'Dungeons'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            if (tab !== 'Dungeons') {
                                setSelectedDungeonId(null);
                            }
                        }}
                        className={`
                px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative overflow-hidden
                ${activeTab === tab
                                ? 'text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                                : 'text-slate-500 hover:text-blue-300 hover:bg-blue-900/20'
                            }
              `}
                    >
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-blue-600 rounded-lg"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{tab === 'Normal' ? 'Quests' : tab}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
