import React from 'react';
import { motion } from 'framer-motion';
import { t } from '@/data/translations';

type TabType = 'Normal' | 'Epic' | 'Dungeons';

interface MissionTabsProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    setSelectedDungeonId: (id: string | null) => void;
    language: 'en' | 'es';
}

export const MissionTabs: React.FC<MissionTabsProps> = ({ activeTab, setActiveTab, setSelectedDungeonId, language }) => {
    return (
        <div className="flex justify-center mb-6 relative z-30">
            <div className="bg-black/40 p-1 rounded-xl border border-white/10 flex gap-1 backdrop-blur-md">
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
                            px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative overflow-hidden
                            ${activeTab === tab
                                ? 'text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
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
                        <span className="relative z-10">{t(`missions_tab_${tab.toLowerCase()}` as any, language)}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
