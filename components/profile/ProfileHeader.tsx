import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserStats, AvatarFrame, Title } from '@/types';
import { AvatarOrb, rarityStyles } from '@/components';
import { AVATAR_PRESETS } from './EditProfileModal';
import { t } from '@/data/translations';
import { Shield, Fingerprint, ScanLine, Cpu, RefreshCw, Crosshair, Skull, Award } from 'lucide-react';

interface ProfileHeaderProps {
    stats: UserStats & { jobClass?: string; streak: number; unlockedTitleIds: string[]; lastActiveDate?: string; };
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
    const [isFlipped, setIsFlipped] = useState(false);

    const currentAvatar = React.useMemo(() => {
        return (
            AVATAR_PRESETS.find((p) => p.id === stats.avatarId) ||
            AVATAR_PRESETS[0]
        );
    }, [stats.avatarId]);

    const xpPercent = Math.min(100, (stats.xpCurrent / stats.xpForNextLevel) * 100);

    // Determine Hunter Rank based on Level or Total Power (Simulation)
    const hunterRank = totalPower > 1000000 ? 'S' : totalPower > 500000 ? 'A' : totalPower > 100000 ? 'B' : totalPower > 20000 ? 'C' : 'E';
    const rankColor = {
        S: 'text-red-500 border-red-500/50 bg-red-950/30',
        A: 'text-yellow-500 border-yellow-500/50 bg-yellow-950/30',
        B: 'text-blue-500 border-blue-500/50 bg-blue-950/30',
        C: 'text-green-500 border-green-500/50 bg-green-950/30',
        E: 'text-slate-500 border-slate-500/50 bg-slate-950/30'
    }[hunterRank];
    // Localized Strings
    const lang = {
        en: {
            hunterAssociation: 'Hunter Association',
            officialRecord: 'Official Record',
            affiliatedGuild: 'Affiliated Guild',
            masterRank: 'Master Rank',
            awakenedDate: 'Awakened Date',
            missionStreak: 'Mission Streak',
            titlesEarned: 'Titles Earned',
            currentLevel: 'Current Level',
            unknown: 'UNKNOWN',
            chairman: 'Woo Jin-Chul',
            role: 'Chairman, H.A.',
            days: 'Days',
            flip: 'FLIP'
        },
        es: {
            hunterAssociation: 'Asociación de Cazadores',
            officialRecord: 'Registro Oficial',
            affiliatedGuild: 'Gremio Afiliado',
            masterRank: 'Rango Maestro',
            awakenedDate: 'Fecha de Despertar',
            missionStreak: 'Racha de Misiones',
            titlesEarned: 'Títulos Ganados',
            currentLevel: 'Nivel Actual',
            unknown: 'DESCONOCIDO',
            chairman: 'Woo Jin-Chul',
            role: 'Presidente, A.C.',
            days: 'Días',
            flip: 'GIRAR'
        }
    }[language] || { // Fallback to English
        hunterAssociation: 'Hunter Association',
        officialRecord: 'Official Record',
        affiliatedGuild: 'Affiliated Guild',
        masterRank: 'Master Rank',
        awakenedDate: 'Awakened Date',
        missionStreak: 'Mission Streak',
        titlesEarned: 'Titles Earned',
        currentLevel: 'Current Level',
        unknown: 'UNKNOWN',
        chairman: 'Woo Jin-Chul',
        role: 'Chairman, H.A.',
        days: 'Days',
        flip: 'FLIP'
    };

    return (
        <div className="relative mt-8 mb-8 perspective-1000 h-[380px] sm:h-[340px]">
            <motion.div
                className="relative w-full h-full transition-transform duration-700 preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* FRONT FACE */}
                <div className="absolute inset-0 backface-hidden">
                    <div className="w-full h-full relative bg-[#0a0f1e] rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl group flex flex-col">

                        {/* Background Texture - Hex Pattern */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.5) 1px, transparent 0)',
                            backgroundSize: '20px 20px'
                        }}></div>

                        {/* Holographic Sheen Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                        {/* HEADER STRIP */}
                        <div className="bg-slate-900/80 border-b border-slate-700/50 p-4 flex justify-between items-center relative z-10 backdrop-blur-sm shrink-0">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-blue-400" />
                                <span className="text-[10px] font-black tracking-[0.2em] text-blue-200 uppercase">
                                    {lang.hunterAssociation}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-[9px] font-mono text-slate-500 tracking-widest hidden sm:block">
                                    ID: {stats.id ? stats.id.substring(0, 12).toUpperCase() : 'HA-8921-X'}
                                </div>
                                <button onClick={() => setIsFlipped(true)} className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-wider group/btn">
                                    <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover/btn:translate-x-0">{lang.flip}</span>
                                    <RefreshCw className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* MAIN CONTENT AREA */}
                        <div className="p-6 flex flex-col sm:flex-row items-center gap-8 relative z-10 flex-1 justify-center sm:justify-start">

                            {/* AVATAR SECTION */}
                            <div className="relative flex-shrink-0 group/avatar">
                                <div className="relative transform scale-110 sm:scale-100 transition-transform duration-500">
                                    <AvatarOrb
                                        frame={currentFrame}
                                        icon={currentAvatar.icon}
                                        size="xl"
                                        onClick={onEditProfile}
                                        level={stats.level}
                                    />
                                </div>

                                {/* Edit Hint - Overlay */}
                                <div
                                    onClick={onEditProfile}
                                    className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 z-30"
                                >
                                    <span className="bg-black/70 text-white text-[9px] font-bold px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm pointer-events-none">
                                        EDIT
                                    </span>
                                </div>
                            </div>

                            {/* INFO SECTION */}
                            <div className="flex-1 w-full text-center sm:text-left space-y-4">

                                {/* Name & Class */}
                                <div className="flex flex-col sm:items-start items-center">
                                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-widest uppercase truncate drop-shadow-xl leading-none mb-2">
                                        {profile.name}
                                    </h1>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded border ${rankColor} shadow-[0_0_10px_rgba(0,0,0,0.3)]`}>
                                            {hunterRank}-RANK
                                        </span>
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] border-l border-slate-700 pl-3">
                                            {stats.jobClass || 'Hunter'}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats Summary (Power & Shards) */}
                                <div className="grid grid-cols-2 gap-4 w-full sm:w-auto mt-2">
                                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-3 rounded-lg flex flex-col items-center sm:items-start shadow-inner group/stat hover:border-slate-700 transition-colors">
                                        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold mb-1 group-hover/stat:text-blue-400 transition-colors">{lang.hunterAssociation === 'Hunter Association' ? 'Total Power' : 'Poder Total'}</span>
                                        <span className="text-sm sm:text-base font-mono font-black text-cyan-300 tracking-tight drop-shadow-md">
                                            {totalPower.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-3 rounded-lg flex flex-col items-center sm:items-start shadow-inner group/stat hover:border-slate-700 transition-colors">
                                        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold mb-1 group-hover/stat:text-purple-400 transition-colors">{lang.hunterAssociation === 'Hunter Association' ? 'Soul Shards' : 'Fragmentos'}</span>
                                        <span className="text-sm sm:text-base font-mono font-black text-purple-300 tracking-tight drop-shadow-md">
                                            {shards.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM XP STRIP */}
                        <div className="relative h-1.5 bg-slate-950 border-t border-slate-800 shrink-0">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpPercent}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                            />
                        </div>
                    </div>
                </div>

                {/* BACK FACE */}
                <div
                    className={`absolute inset-0 backface-hidden ${isFlipped ? 'pointer-events-auto z-20' : 'pointer-events-none z-0'}`}
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <div className="w-full h-full relative bg-[#0a0f1e] rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl flex flex-col">
                        {/* Header */}
                        <div className="bg-slate-900/80 border-b border-slate-700/50 p-4 flex justify-between items-center relative z-10 backdrop-blur-sm shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                                    {lang.officialRecord}
                                </span>
                            </div>
                            <button onClick={() => setIsFlipped(false)} className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-wider group/btn">
                                <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover/btn:translate-x-0">{lang.flip}</span>
                                <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 relative">
                            {/* Watermark */}
                            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                                <Shield size={180} />
                            </div>

                            <div className="grid grid-cols-2 gap-6 relative z-10 h-full content-center">
                                {/* Guild Info */}
                                <div className="space-y-1">
                                    <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">{lang.affiliatedGuild}</div>
                                    <div className="text-xl font-black text-white tracking-wider flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-purple-400" />
                                        AHJIN
                                    </div>
                                    <div className="text-[9px] text-slate-500 font-mono">{lang.masterRank}</div>
                                </div>

                                {/* Awakening Date */}
                                <div className="space-y-1">
                                    <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">{lang.awakenedDate}</div>
                                    <div className="text-lg font-mono text-cyan-300">
                                        {stats.lastActiveDate ? new Date(stats.lastActiveDate).toLocaleDateString() : lang.unknown}
                                    </div>
                                </div>

                                {/* Kills / Activity */}
                                <div className="space-y-1">
                                    <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1">
                                        <Crosshair className="w-3 h-3" /> {lang.missionStreak}
                                    </div>
                                    <div className="text-lg font-mono text-white">
                                        {stats.streak} {lang.days}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1">
                                        <Award className="w-3 h-3" /> {lang.titlesEarned}
                                    </div>
                                    <div className="text-lg font-mono text-yellow-400">
                                        {stats.unlockedTitleIds.length}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Signature */}
                        <div className="p-3 border-t border-slate-800 bg-slate-900/40 text-right">
                            <div className="inline-block border-b border-dashed border-slate-600 pb-1 px-4">
                                <span className="font-script text-slate-500 text-xs italic">{lang.chairman}</span>
                            </div>
                            <div className="text-[8px] text-slate-600 uppercase mt-1 tracking-widest">{lang.role}</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Level & XP Text Below Card */}
            <div className="flex justify-between items-center px-2 mt-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <span>{lang.currentLevel}: <span className="text-white">{stats.level}</span></span>
                <span>{Math.floor(stats.xpCurrent).toLocaleString()} / {stats.xpForNextLevel.toLocaleString()} XP</span>
            </div>
        </div>
    );
};
