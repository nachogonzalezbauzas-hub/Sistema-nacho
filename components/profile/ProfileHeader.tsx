import React from 'react';
import { motion } from 'framer-motion';
import { UserStats, AvatarFrame, Title } from '@/types';
import { AvatarOrb, rarityStyles } from '@/components';
import { AVATAR_PRESETS } from './EditProfileModal';
import { t } from '@/data/translations';

interface ProfileHeaderProps {
    stats: UserStats;
    profile: { name: string; avatar: string };
    currentFrame: AvatarFrame;
    currentTitle?: Title;
    onEditProfile?: () => void;
    language: 'en' | 'es';
    totalPower: number;
    shards: number;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    stats,
    profile,
    currentFrame,
    currentTitle,
    onEditProfile,
    language,
    totalPower,
    shards,
}) => {
    const currentAvatar = React.useMemo(() => {
        return (
            AVATAR_PRESETS.find((p) => p.id === stats.avatarId) ||
            AVATAR_PRESETS[0]
        );
    }, [stats.avatarId]);

    const xpPercent = Math.min(100, (stats.xpCurrent / stats.xpForNextLevel) * 100);

    return (
        <div className="relative mt-16">
            <div className="relative bg-[#050a14] border border-blue-900/60 rounded-2xl overflow-visible shadow-2xl pt-24 pb-8 px-6">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20">
                    <AvatarOrb
                        frame={currentFrame}
                        icon={currentAvatar.icon}
                        size="xl"
                        onClick={onEditProfile}
                        level={stats.level}
                    />
                </div>

                <div className="flex flex-col items-center mt-4 mb-8">
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-3 drop-shadow-md">
                        {profile.name}
                    </h1>

                    {/* Total Power & Shards */}
                    <div className="flex items-center gap-3 mb-6">
                        {/* Power Display with Celestial Tier Support */}
                        <div className={`
                                px-4 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-widest backdrop-blur-sm transition-all duration-500
                                ${totalPower >= 1000000 && totalPower <= 1250000
                                ? 'bg-gradient-to-r from-cyan-950/80 via-blue-900/80 to-purple-900/80 border-cyan-400/60 text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,0.6)] animate-pulse ring-2 ring-cyan-400/20'
                                : 'bg-blue-950/50 border-blue-500/30 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                            }
                            `}>
                            <div className="flex items-center gap-2">
                                {totalPower >= 1000000 && totalPower <= 1250000 && (
                                    <span className="animate-spin-slow text-cyan-300">✦</span>
                                )}
                                <span>{t('profile_total_power', language)}:</span>
                                <span className={`font-black ml-1 text-xs ${totalPower >= 1000000 && totalPower <= 1250000 ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-cyan-200' : 'text-white'}`}>
                                    {totalPower.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-purple-950/50 border border-purple-500/30 text-[10px] font-mono text-purple-300 uppercase tracking-widest backdrop-blur-sm shadow-[0_0_10px_rgba(168,85,247,0.1)] flex items-center gap-1">
                            <span>{t('profile_shards', language)}:</span>
                            <span className="text-white font-black ml-1 text-xs">{shards?.toLocaleString() || 0}</span>
                        </div>
                    </div>

                    {currentTitle && (
                        <div className={`
                inline-flex items-center gap-2 px-5 py-2 rounded-full border shadow-lg backdrop-blur-md
                ${rarityStyles[currentTitle.rarity].borderColor}
                ${rarityStyles[currentTitle.rarity].textColor}
                bg-gradient-to-r ${rarityStyles[currentTitle.rarity].bgGradient}
                animate-in zoom-in duration-500 hover:scale-105 transition-transform
    `}>
                            <span className="text-lg filter drop-shadow-md">{currentTitle.icon}</span>
                            <span className="text-xs font-black uppercase tracking-[0.2em] drop-shadow-sm">{currentTitle.name}</span>
                        </div>
                    )}
                </div>

                {/* XP Bar */}
                <div className="relative h-3 bg-slate-950 rounded-full overflow-hidden mb-2 border border-slate-800 shadow-inner">
                    <div className="absolute inset-0 bg-blue-900/10"></div>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpPercent}% ` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] relative"
                    >
                        <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50 blur-[1px]"></div>
                    </motion.div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider px-1">
                    <span className="font-bold text-slate-400">{t('common_level', language)} <span className="text-white text-xs">{stats.level}</span></span>
                    <span><span className="text-blue-400">{Math.floor(stats.xpCurrent).toLocaleString()}</span> / {stats.xpForNextLevel.toLocaleString()} XP</span>
                </div>
            </div>
        </div>
    );
};
