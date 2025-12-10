import React from 'react';
import { motion } from 'framer-motion';
import { UserStats, AvatarFrame, Title } from '../../types';
import { AvatarOrb } from '../ui/Avatar';
import { AVATAR_PRESETS } from './EditProfileModal';
import { rarityStyles } from '../ui/Titles';
import { t } from '../../data/translations';

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
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-4 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-[10px] font-mono text-blue-300 uppercase tracking-widest">
                            {t('profile_total_power', language)}: <span className="text-white font-bold">{totalPower}</span>
                        </div>
                        <div className="px-4 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-[10px] font-mono text-purple-300 uppercase tracking-widest flex items-center gap-1">
                            <span>{t('profile_shards', language)}:</span>
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
                        animate={{ width: `${xpPercent}% ` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                    ></motion.div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    <span>{t('common_level', language)} {stats.level}</span>
                    <span>{Math.floor(stats.xpCurrent)} / {stats.xpForNextLevel} XP</span>
                </div>
            </div>
        </div>
    );
};
