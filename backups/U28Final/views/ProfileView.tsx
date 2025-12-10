
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserStats, StatType, TitleId, AvatarFrameId, Milestone, EffectiveStats, SeasonDefinition, SeasonProgress } from '../types';
import { TITLES, AVATAR_FRAMES } from '../titles'; // U13.3 Single Source
import { rarityStyles } from '../components/ui/Titles';
import { Card, Button, Input, Modal, StatIcon, TitleBadge, AvatarOrb, AvatarFrameSelector, RankPill } from '../components/UIComponents';
import {
  User, Crown, Ghost, Flame, Skull, Zap, Wind, Mountain, Droplets,
  Sword, Wand, Crosshair, Heart, Shield, Axe, Trophy, Medal, Star, Award,
  Sun, Moon, Infinity as InfinityIcon, Gem, Target, Eye, Briefcase, Dumbbell, Book,
  Smile, Frown, Meh, Anchor, Feather, Music, Camera, Code, Cpu, Database
} from 'lucide-react';

interface ProfileViewProps {
  stats: UserStats;
  effectiveStats: EffectiveStats;
  milestones?: Milestone[];
  // U22 Props
  season?: SeasonDefinition;
  seasonProgress?: SeasonProgress;
  onOpenSeason?: () => void;
  onEquipTitle: (id: TitleId | null) => void;
  onEquipFrame: (id: AvatarFrameId) => void;
}

interface AvatarPreset {
  id: string;
  icon: React.ReactNode;
  bg: string;
  color: string;
}

const AVATAR_PRESETS: AvatarPreset[] = [
  // Monarchs
  { id: 'shadow_monarch', icon: <Crown size={40} />, bg: 'bg-slate-900', color: 'text-purple-400' },
  { id: 'igris', icon: <Ghost size={40} />, bg: 'bg-red-950', color: 'text-red-500' },
  { id: 'beru', icon: <Skull size={40} />, bg: 'bg-black', color: 'text-cyan-400' },
  { id: 'kaisel', icon: <Wind size={40} />, bg: 'bg-indigo-950', color: 'text-indigo-400' },
  { id: 'tank', icon: <Mountain size={40} />, bg: 'bg-zinc-800', color: 'text-zinc-400' },
  { id: 'iron', icon: <Shield size={40} />, bg: 'bg-slate-700', color: 'text-slate-300' },

  // Classes
  { id: 'hunter', icon: <Crosshair size={40} />, bg: 'bg-amber-900', color: 'text-amber-400' },
  { id: 'mage', icon: <Wand size={40} />, bg: 'bg-violet-900', color: 'text-violet-400' },
  { id: 'assassin', icon: <Sword size={40} />, bg: 'bg-rose-900', color: 'text-rose-400' },
  { id: 'healer', icon: <Heart size={40} />, bg: 'bg-emerald-900', color: 'text-emerald-400' },
  { id: 'fighter', icon: <Axe size={40} />, bg: 'bg-red-900', color: 'text-red-400' },
  { id: 'ranger', icon: <Target size={40} />, bg: 'bg-green-900', color: 'text-green-400' },
  { id: 'necromancer', icon: <Skull size={40} />, bg: 'bg-purple-950', color: 'text-purple-500' },

  // System
  { id: 'system', icon: <Cpu size={40} />, bg: 'bg-cyan-950', color: 'text-cyan-400' },
  { id: 'player', icon: <User size={40} />, bg: 'bg-blue-900', color: 'text-blue-400' },
  { id: 'level_up', icon: <Zap size={40} />, bg: 'bg-yellow-900', color: 'text-yellow-400' },
  { id: 'quest', icon: <Book size={40} />, bg: 'bg-emerald-950', color: 'text-emerald-400' },

  // Ranks
  { id: 's_rank', icon: <Trophy size={40} />, bg: 'bg-yellow-950', color: 'text-yellow-500' },
  { id: 'a_rank', icon: <Medal size={40} />, bg: 'bg-slate-800', color: 'text-slate-200' },
  { id: 'b_rank', icon: <Award size={40} />, bg: 'bg-zinc-800', color: 'text-zinc-400' },

  // Specials
  { id: 'god', icon: <Sun size={40} />, bg: 'bg-orange-950', color: 'text-orange-400' },
  { id: 'moon', icon: <Moon size={40} />, bg: 'bg-indigo-950', color: 'text-indigo-300' },
  { id: 'infinity', icon: <InfinityIcon size={40} />, bg: 'bg-fuchsia-950', color: 'text-fuchsia-400' },
  { id: 'gem', icon: <Gem size={40} />, bg: 'bg-pink-950', color: 'text-pink-400' },
  { id: 'eye', icon: <Eye size={40} />, bg: 'bg-teal-950', color: 'text-teal-400' },
  { id: 'code', icon: <Code size={40} />, bg: 'bg-slate-900', color: 'text-green-500' },
  { id: 'database', icon: <Database size={40} />, bg: 'bg-blue-950', color: 'text-blue-300' },
];

const StatDetail: React.FC<{ label: StatType; value: number; base: number }> = ({ label, value, base }) => {
  let borderColor = "";
  switch (label) {
    case 'Strength': borderColor = "border-cyan-500/40"; break;
    case 'Vitality': borderColor = "border-red-500/40"; break;
    case 'Agility': borderColor = "border-yellow-500/40"; break;
    case 'Intelligence': borderColor = "border-purple-500/40"; break;
    case 'Fortune': borderColor = "border-green-500/40"; break;
    case 'Metabolism': borderColor = "border-blue-500/40"; break;
  }
  const bonus = value - base;
  return (
    <Card className={`flex items-center justify-between p-3 border-l-4 ${borderColor} bg-slate-900/40 hover:bg-slate-800/60 transition-colors h-full`}>
      <div className="flex items-center gap-3">
        <StatIcon stat={label} size={18} />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">{label}</span>
          {bonus > 0 && <span className="text-[9px] text-cyan-400 font-mono">+{bonus} Bonus</span>}
        </div>
      </div>
      <span className={`text-xl font-black font-mono drop-shadow-sm ${bonus > 0 ? 'text-cyan-400' : 'text-white'}`}>
        {value}
      </span>
    </Card>
  );
};

export const ProfileView: React.FC<ProfileViewProps> = ({ stats, effectiveStats, milestones = [], season, seasonProgress, onOpenSeason, onEquipTitle, onEquipFrame }) => {

  const [profile, setProfile] = useState({ name: 'Player', avatar: AVATAR_PRESETS[0].id }); // Store ID instead of URL
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [tempName, setTempName] = useState('');
  const [activeTab, setActiveTab] = useState<'Stats' | 'Titles' | 'Frames'>('Stats');

  useEffect(() => {
    const saved = localStorage.getItem('sistema_nacho_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration check: if avatar is a URL (contains http), default to first preset
      if (parsed.avatar && parsed.avatar.includes('http')) {
        parsed.avatar = AVATAR_PRESETS[0].id;
      }
      setProfile(parsed);
    }
  }, []);

  const handleSave = () => {
    const newProfile = { ...profile, name: tempName || profile.name };
    setProfile(newProfile);
    localStorage.setItem('sistema_nacho_profile', JSON.stringify(newProfile));
    setIsEditOpen(false);
  };

  const selectAvatar = (id: string) => {
    const newProfile = { ...profile, avatar: id };
    setProfile(newProfile);
    localStorage.setItem('sistema_nacho_profile', JSON.stringify(newProfile));
  };

  // U13.3 Use definitions from single source
  const currentTitle = TITLES.find(t => t.id === stats.equippedTitleId);
  const currentFrame = AVATAR_FRAMES.find(f => f.id === stats.selectedFrameId) || AVATAR_FRAMES[0];
  // Helper to get current avatar definition
  const currentAvatar = AVATAR_PRESETS.find(p => p.id === profile.avatar) || AVATAR_PRESETS[0];

  const xpPercent = Math.min(100, (stats.xpCurrent / stats.xpForNextLevel) * 100);

  const completedMilestones = milestones.filter(m => m.isCompleted).length;
  const activeMilestones = milestones.filter(m => !m.isCompleted).length;

  return (
    <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* HERO CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mt-14"
      >
        <div className="relative bg-[#050a14] border border-blue-900/60 rounded-2xl overflow-visible shadow-2xl pt-16 pb-6 px-6">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
            <AvatarOrb
              level={stats.level}
              initials={profile.name.substring(0, 2).toUpperCase()}
              frame={currentFrame}
              icon={currentAvatar.icon}
              bgColor={`${currentAvatar.bg} ${currentAvatar.color}`}
              onClick={() => { setTempName(profile.name); setIsEditOpen(true); }}
            />
          </div>

          <div className="flex flex-col items-center mt-2 mb-6">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 drop-shadow-md">
              {profile.name}
            </h1>

            {currentTitle && (
              <div className={`
                mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-lg backdrop-blur-sm
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
      </motion.div>

      {/* TABS */}
      <div className="flex p-1 bg-slate-900/50 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('Stats')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'Stats' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Stats
        </button>
        <button
          onClick={() => setActiveTab('Titles')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'Titles' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Titles
        </button>
        <button
          onClick={() => setActiveTab('Frames')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'Frames' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Frames
        </button>
      </div>

      {activeTab === 'Stats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: 'Strength', v: effectiveStats.strength, b: stats.strength },
              { l: 'Vitality', v: effectiveStats.vitality, b: stats.vitality },
              { l: 'Agility', v: effectiveStats.agility, b: stats.agility },
              { l: 'Intelligence', v: effectiveStats.intelligence, b: stats.intelligence },
              { l: 'Fortune', v: effectiveStats.fortune, b: stats.fortune },
              { l: 'Metabolism', v: effectiveStats.metabolism, b: stats.metabolism }
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="h-full"
              >
                <StatDetail label={s.l as StatType} value={s.v} base={s.b} />
              </motion.div>
            ))}
          </div>

          {/* U22 Season Summary */}
          {season && seasonProgress && (
            <div className="bg-[#050a14] border border-blue-900/30 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <User size={80} />
              </div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                  Season Progress
                </h3>
                <RankPill rank={seasonProgress.rank} size="sm" />
              </div>

              <div className="flex justify-between items-end relative z-10">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block mb-0.5">Current XP</span>
                  <span className="text-xl font-black text-white font-mono">{seasonProgress.seasonXP}</span>
                </div>
                <Button variant="ghost" onClick={onOpenSeason} className="text-xs h-8 border border-blue-500/30 text-blue-300 hover:bg-blue-900/20">
                  View Season
                </Button>
              </div>
            </div>
          )}

          {/* U21 Milestone Summary */}
          <div className="bg-[#050a14] border border-blue-900/30 rounded-xl p-4">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              Epic Missions Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 flex flex-col items-center">
                <span className="text-2xl font-black text-white">{activeMilestones}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Active Arcs</span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 flex flex-col items-center">
                <span className="text-2xl font-black text-blue-400">{completedMilestones}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Completed</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-800/50">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Streak</span>
              <span className="text-xl font-mono text-white">{stats.streak} Days</span>
            </div>
            <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-800/50">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Last Active</span>
              <span className="text-xs font-mono text-slate-400">{stats.lastActiveDate ? new Date(stats.lastActiveDate).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Titles' && (
        <div className="space-y-6">
          {/* Titles Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Unlocked Titles</h3>
            <div className="grid grid-cols-1 gap-3">
              {TITLES.filter(t => stats.unlockedTitleIds.includes(t.id)).map(title => (
                <TitleBadge
                  key={title.id}
                  title={title}
                  isEquipped={stats.equippedTitleId === title.id}
                  onClick={() => onEquipTitle(title.id)}
                />
              ))}
            </div>

            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 pt-4">Locked Titles</h3>
            <div className="grid grid-cols-1 gap-3 opacity-60">
              {TITLES.filter(t => !stats.unlockedTitleIds.includes(t.id)).map(title => (
                <div key={title.id} className="opacity-50 grayscale pointer-events-none">
                  <TitleBadge
                    title={title}
                    isEquipped={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Frames' && (
        <div className="space-y-6">
          <div className="bg-[#050a14] border border-blue-900/30 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Avatar Frames Collection</h3>
            <AvatarFrameSelector
              frames={AVATAR_FRAMES}
              unlockedIds={stats.unlockedFrameIds}
              selectedId={stats.selectedFrameId}
              onSelect={onEquipFrame}
              layout="grid"
            />
          </div>
        </div>
      )}

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Hunter Name</label>
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder={profile.name}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Avatar Appearance</label>
            <div className="grid grid-cols-5 gap-3 max-h-[300px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-slate-900">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => selectAvatar(preset.id)}
                  className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all flex items-center justify-center ${preset.bg} ${preset.color} ${profile.avatar === preset.id ? 'border-blue-500 scale-110 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10' : 'border-transparent hover:border-slate-600 hover:scale-105'}`}
                >
                  {preset.icon}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleSave} className="w-full mt-2">Save Changes</Button>
        </div>
      </Modal>

    </div>
  );
};
