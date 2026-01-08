import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
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

    // --- SSS-RANK TILT LOGIC ---
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    // Combined rotation: base flip + interactive tilt
    // Simplified: Disable tilt when flipped or during transition to avoid "mirroring" glitches
    const combinedRotateY = useTransform(rotateY, (rY) => {
        const tiltNum = parseFloat(rY.toString());
        if (isFlipped) return 180; // Fix at 180 when flipped to avoid weirdness
        return tiltNum;
    });

    const combinedRotateX = useTransform(rotateX, (rX) => {
        if (isFlipped) return 0;
        return rX;
    });

    // Holographic sheen position
    const sheenX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
    const sheenOpacity = useTransform(mouseXSpring, [-0.5, 0.5], [0.1, 0.3]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const touch = e.touches[0];
        const width = rect.width;
        const height = rect.height;
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        const xPct = (touchX / width) - 0.5;
        const yPct = (touchY / height) - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

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
        <div
            className="relative mt-4 mb-4 perspective-1000 h-[420px] sm:h-[360px] group/card-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseLeave}
        >
            <motion.div
                className="relative w-full h-full preserve-3d"
                style={{
                    transformStyle: 'preserve-3d',
                }}
                animate={{
                    rotateY: isFlipped ? 180 : 0,
                    rotateX: isFlipped ? 0 : parseFloat(rotateX.get().toString())
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
                {/* FRONT FACE */}
                <div
                    className="absolute inset-0 backface-hidden"
                    style={{ WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}
                >
                    <div className="w-full h-full relative bg-[#0a0f1e] rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl group flex flex-col">

                        {/* Background Texture - Hex Pattern */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.5) 1px, transparent 0)',
                            backgroundSize: '20px 20px'
                        }}></div>

                        {/* SSS-RANK HUD ELEMENTS */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                            <div className="absolute top-10 left-4 font-mono text-[6px] text-blue-400 space-y-1">
                                <div>LAT: 37.5665° N</div>
                                <div>LNG: 126.9780° E</div>
                                <div className="mt-2 text-cyan-500">AUTH_STATUS: ENCRYPTED</div>
                            </div>
                            <div className="absolute bottom-10 right-4 font-mono text-[8px] text-blue-500/50">
                                SYSTEM_v2.7_STABLE
                            </div>
                            {/* Scanning Line */}
                            <motion.div
                                animate={{ top: ['0%', '100%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
                            />
                        </div>

                        {/* Holographic Sheen Effect */}
                        <motion.div
                            style={{
                                background: `linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 55%, transparent 100%)`,
                                backgroundSize: '250% 250%',
                                x: sheenX,
                                opacity: sheenOpacity
                            }}
                            className="absolute inset-0 mix-blend-overlay pointer-events-none z-20"
                        />

                        {/* Rank-based Energy Border */}
                        {(hunterRank === 'S' || hunterRank === 'A') && (
                            <div className="absolute inset-0 z-0 p-[1px] pointer-events-none">
                                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent,rgba(59,130,246,0.5),rgba(34,211,238,0.8),rgba(59,130,246,0.5),transparent)]"
                                    />
                                </div>
                            </div>
                        )}

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
                        <div className="relative h-2 bg-slate-950 border-t border-slate-800 shrink-0">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpPercent}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                            />
                        </div>
                    </div>
                </div>

                {/* BACK FACE */}
                <div
                    className={`absolute inset-0 backface-hidden ${isFlipped ? 'pointer-events-auto z-20' : 'pointer-events-none z-0'}`}
                    style={{
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg) translateZ(1px)'
                    }}
                >
                    <div className="w-full h-full relative bg-[#0a0f1e] rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl flex flex-col group/back">
                        {/* SSS-RANK HUD ELEMENTS (BACK) */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                            <div className="absolute top-20 right-10 flex gap-2">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, 12, 4] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                        className="w-1 bg-cyan-500/50 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Holographic Sheen Effect (BACK) */}
                        <motion.div
                            style={{
                                background: `linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 55%, transparent 100%)`,
                                backgroundSize: '250% 250%',
                                x: sheenX,
                            }}
                            className="absolute inset-0 mix-blend-soft-light pointer-events-none z-20 opacity-30"
                        />
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
                                {/* Personalized Data */}
                                <div className="space-y-1">
                                    <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Calibration Objective</div>
                                    <div className="text-sm font-black text-cyan-400 tracking-wider">
                                        {(stats as any).userObjectives?.mainGoal || 'SYSTEM SYNCHRONIZATION PENDING'}
                                    </div>
                                    <div className="text-[9px] text-slate-500 font-mono">PRIMARY_DIRECTIVE</div>
                                </div>

                                {/* Awakening Date */}
                                <div className="space-y-1">
                                    <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Calibrated At</div>
                                    <div className="text-lg font-mono text-white/80">
                                        {(stats as any).userObjectives?.calibratedAt ? new Date((stats as any).userObjectives.calibratedAt).toLocaleDateString() : 'N/A'}
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
