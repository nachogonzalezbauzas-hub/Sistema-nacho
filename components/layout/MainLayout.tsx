import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Target, Activity, DoorOpen, Sparkles } from 'lucide-react';
import { AppState } from '@/types';
import { UnifiedRewardOverlay } from '@/components/ui/UnifiedRewardOverlay';
import { DungeonFailureModal } from '@/components/ui/DungeonFailureModal';
import { GateMenu } from './GateMenu';
import { t } from '@/data/translations';
import { Background } from './Background';

// Define Tab type here or import it if it's shared. 
// Ideally it should be in types/index.ts but it was in App.tsx.
// For now I'll redefine it or accept string to avoid circular deps if App imports this.
// But App imports this, so this shouldn't import App.
export type Tab = 'Dashboard' | 'Misiones' | 'Logs' | 'Físico' | 'Logros' | 'Perfil' | 'Skills' | 'Calendar' | 'Buffs' | 'Season' | 'Settings' | 'Shadows' | 'PowerAnalysis' | 'Shop' | 'Gear' | 'Dungeons' | 'JobChange' | 'ProceduralShowcase' | 'CelestialDemo';

interface MainLayoutProps {
    children: React.ReactNode;
    currentTab: Tab;
    setCurrentTab: (tab: Tab) => void;
    isGateOpen: boolean;
    setIsGateOpen: (isOpen: boolean) => void;
    state: AppState;
    onClearRewards: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    currentTab,
    setCurrentTab,
    isGateOpen,
    setIsGateOpen,
    state,
    onClearRewards
}) => {
    if (!state || !state.settings || !state.stats) {
        return <div className="min-h-screen bg-black text-white p-8">Loading layout...</div>;
    }

    return (
        <div className={`min-h-screen font-sans selection:bg-blue-500/30 overflow-x-hidden text-blue-50 ${state.settings.theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>

            {/* BACKGROUND SYSTEM */}
            <Background />

            {/* OLD REWARD SYSTEM - DISABLED in favor of new AnimationQueueProvider system */}
            {/* The new animations in AnimationQueueProvider handle: Stats, XP, Level Up, Shards, Equipment, Titles, Frames */}
            {/* This old overlay is kept for legacy reward types but auto-clears to prevent blocking */}
            {state.rewardQueue.length > 0 && (
                <React.Fragment>
                    {/* Auto-clear legacy reward queue immediately to prevent old animations */}
                    {setTimeout(() => onClearRewards(), 0) && null}
                </React.Fragment>
            )}

            {/* Dungeon Failure Modal */}
            <DungeonFailureModal />

            <div className="relative z-[100]">
                <GateMenu
                    isOpen={isGateOpen}
                    onClose={() => {
                        setIsGateOpen(false);
                    }}
                    onNavigate={(view) => {
                        setCurrentTab(view as Tab);
                    }}
                />
            </div>

            {/* --- HEADER --- */}
            <header className="sticky top-0 z-40 pt-safe">
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-md border-b border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.2)]"></div>

                <div className="relative z-10 w-full max-w-xl mx-auto flex items-center justify-between h-16 px-4">

                    {/* Left: QP Currency */}
                    <div className="flex items-center gap-1.5 bg-black/60 border border-yellow-500/30 px-3 py-1 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <span className="text-yellow-400 text-[10px] font-bold">QP</span>
                        <span className="text-xs font-black text-white tracking-wide">{(state.questPoints || 0).toLocaleString()}</span>
                    </div>

                    {/* Center: App Name */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa] animate-pulse"></div>
                                <div className="absolute inset-0 w-2 h-2 rounded-full bg-blue-400 animate-ping opacity-75"></div>
                            </div>
                            <h1 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-blue-400 to-blue-100 tracking-[0.25em] uppercase text-xs drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                                SYSTEM
                            </h1>
                        </div>
                    </div>

                    {/* Right: Shards */}
                    <div className="flex items-center gap-1.5 bg-black/60 border border-purple-500/30 px-3 py-1 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                        <Sparkles size={12} className="text-purple-400 fill-purple-400/20" />
                        <span className="text-xs font-black text-white tracking-wide">{(state.shards || 0).toLocaleString()}</span>
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-xl mx-auto p-4 relative z-10 min-h-[calc(100vh-140px)] pb-24">
                {children}
            </main>

            {/* --- BOTTOM NAVIGATION --- */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-[#02040a]/90 backdrop-blur-xl border-t border-blue-500/30 shadow-[0_-5px_30px_rgba(37,99,235,0.15)]"></div>

                <div className="relative z-10 max-w-xl mx-auto flex justify-around items-center h-20 px-2">
                    <NavButton active={currentTab === 'Dashboard'} onClick={() => setCurrentTab('Dashboard')} icon={<LayoutDashboard size={22} />} label={t('nav_dashboard', state.settings.language).toUpperCase()} />
                    <NavButton active={currentTab === 'Misiones'} onClick={() => setCurrentTab('Misiones')} icon={<Target size={22} />} label={t('nav_missions', state.settings.language).toUpperCase()} />
                    <NavButton active={currentTab === 'Físico'} onClick={() => setCurrentTab('Físico')} icon={<Activity size={22} />} label={t('nav_body', state.settings.language).toUpperCase()} />

                    {/* Gate Button Special Styling */}
                    <button
                        onClick={() => setIsGateOpen(true)}
                        className={`
                relative -mt-8 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group
                ${isGateOpen
                                ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.8)] border-2 border-white/50'
                                : 'bg-[#0a0f1e] border border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:border-blue-400'
                            }
              `}
                    >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-500/20 to-transparent opacity-50"></div>
                        <DoorOpen size={24} className={`relative z-10 transition-all duration-300 ${isGateOpen ? 'text-white scale-110' : 'text-blue-400 group-hover:text-blue-100 group-hover:scale-110'}`} />

                        {/* Gate Particles */}
                        {!isGateOpen && (
                            <>
                                <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-ping-slow"></div>
                                <div className="absolute -inset-1 rounded-full border border-blue-500/10 animate-spin-slow-reverse"></div>
                            </>
                        )}
                    </button>
                </div>
            </nav>
        </div>
    );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-20 h-full pt-2 transition-all duration-300 group relative`}
    >
        {active && (
            <>
                {/* Active Glow Background */}
                <motion.div
                    layoutId="nav-active-glow"
                    className="absolute inset-0 m-auto w-16 h-16 bg-blue-500/20 blur-xl rounded-full"
                    transition={{ duration: 0.3 }}
                />
                {/* Top Highlight Line */}
                <motion.div
                    layoutId="nav-active-line"
                    className="absolute top-0 left-0 right-0 mx-auto w-12 h-0.5 bg-blue-400 shadow-[0_0_10px_#60a5fa]"
                />
            </>
        )}

        <motion.div
            whileTap={{ scale: 0.9 }}
            animate={active ? { y: -4, scale: 1.1 } : { y: 0, scale: 1 }}
            className={`
        relative p-2 rounded-xl transition-all duration-300 z-10
        ${active
                    ? 'text-blue-100 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'
                    : 'text-slate-500 group-hover:text-blue-300'
                }
      `}>
            {icon}
        </motion.div>

        <span className={`
      text-[9px] mt-1 font-bold tracking-widest transition-all duration-300
      ${active
                ? 'text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]'
                : 'text-slate-600 group-hover:text-slate-400'
            }
    `}>
            {label}
        </span>
    </button>
);
