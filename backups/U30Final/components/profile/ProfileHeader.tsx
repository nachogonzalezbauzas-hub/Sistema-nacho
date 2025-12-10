import React from 'react';
import { motion } from 'framer-motion';
import { UserStats, Title } from '../../types';
import { AvatarOrb } from '../UIComponents';
import { rarityStyles } from '../ui/Titles';

interface ProfileHeaderProps {
    stats: UserStats;
    profile: { name: string; avatar: string };
    currentTitle?: Title;
    currentFrame: string;
    currentAvatar: { bg: string; color: string; icon: React.ReactNode };
    totalPower: number;
    shards: number;
    onEditProfile: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    stats,
    profile,
    currentTitle,
    currentFrame,
    currentAvatar,
    totalPower,
    shards,
    onEditProfile
}) => {
    const xpPercent = Math.min(100, (stats.xpCurrent / stats.xpForNextLevel) * 100);

    return (
        <div className="relative mt-14">
            <div className="relative bg-[#050a14] border border-blue-900/60 rounded-2xl overflow-visible shadow-2xl pt-16 pb-6 px-6">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
                    <AvatarOrb
                        level={stats.level}
                        initials={profile.name.substring(0, 2).toUpperCase()}
                        frame={currentFrame}
                        icon={currentAvatar.icon}
                        bgColor={`${currentAvatar.bg} ${currentAvatar.color}`}
                        onClick={onEditProfile}
                    />
                </div>

                <div className="flex flex-col items-center mt-2 mb-6">
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 drop-shadow-md">
                        {profile.name}
                    </h1>

                    {/* Total Power & Shards */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="px-3 py-0.5 rounded-full bg-blue-900/30 border border-blue-500/30 text-[10px] font-mono text-blue-300 uppercase tracking-widest">
                            Total Power: <span className="text-white font-bold">{totalPower}</span>
                        </div>
                        <div className="px-3 py-0.5 rounded-full bg-purple-900/30 border border-purple-500/30 text-[10px] font-mono text-purple-300 uppercase tracking-widest flex items-center gap-1">
                            <span>Shards:</span>
                            <span className="text-white font-bold">{shards || 0}</span>
                        </div>
                    </div>

                    {currentTitle && (
                        <div className={`
                inline-flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-lg backdrop-blur-sm
                ${rarityStyles[currentTitle.rarity].borderColor}
                ${rarityStyles[currentTitle.rarity].textColor}
                bg-gradient-to-r ${rarityStyles[currentTitle.rarity].bgGradient}
                animate-in zoom-in duration-500
              `}>
                            <span className="text-base filter drop-shadow-md">{currentTitle.icon}</span>
                            <span className="text-xs font-black uppercase tracking-[0.15em] drop-shadow-sm">{currentTitle.name}</span>
                        </div>
                    )}
                </div>

                {/* XP Bar */}
                <div className="relative h-2 bg-slate-900 rounded-full overflow-hidden mb-2 border border-slate-800">
                    <div className="absolute inset-0 bg-blue-600/20"></div>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpPercent}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                    ></motion.div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    <span>Level {stats.level}</span>
                    <span>{Math.floor(stats.xpCurrent)} / {stats.xpForNextLevel} XP</span>
                </div>
            </div>
        </div>
    );
};
