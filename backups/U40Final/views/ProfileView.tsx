import React, { useEffect, useState, useMemo } from 'react';
import { UserStats, TitleId, AvatarFrameId, Milestone, EffectiveStats, SeasonDefinition, SeasonProgress } from '../types';
import { AVATAR_FRAMES } from '../data/titles'; // Although named titles.ts, it contains frames too
import { TITLES } from '../data/titles';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { StatsTab } from '../components/profile/StatsTab';
import { TitlesTab } from '../components/profile/TitlesTab';
import { FramesTab } from '../components/profile/FramesTab';
import { EditProfileModal, AVATAR_PRESETS } from '../components/profile/EditProfileModal';
import { t } from '../data/translations';

interface ProfileViewProps {
  stats: UserStats;
  effectiveStats: EffectiveStats;
  totalPower: number; // U30
  shards: number; // U31
  milestones?: Milestone[];
  // U22 Props
  season?: SeasonDefinition;
  seasonProgress?: SeasonProgress;
  onOpenSeason?: () => void;
  onEquipTitle: (id: TitleId | null) => void;
  onEquipFrame: (id: AvatarFrameId) => void;
  language: 'en' | 'es';
}

export const ProfileView: React.FC<ProfileViewProps> = ({ stats, effectiveStats, totalPower, shards, milestones = [], season, seasonProgress, onOpenSeason, onEquipTitle, onEquipFrame, language }) => {

  const [activeTab, setActiveTab] = useState<'Stats' | 'Titles' | 'Frames'>('Stats');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [tempName, setTempName] = useState('');

  // Local Profile State (Name & Avatar)
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('hunterProfile');
    return saved ? JSON.parse(saved) : { name: 'Sung Jin-Woo', avatar: 'default' };
  });

  useEffect(() => {
    localStorage.setItem('hunterProfile', JSON.stringify(profile));
  }, [profile]);

  const handleSave = () => {
    setProfile((prev: any) => ({ ...prev, name: tempName }));
    setIsEditOpen(false);
  };

  const selectAvatar = (id: string) => {
    setProfile((prev: any) => ({ ...prev, avatar: id }));
  };

  // Derived Values
  const currentFrame = useMemo(() => {
    return (
      AVATAR_FRAMES.find((f) => f.id === stats.selectedFrameId) ||
      AVATAR_FRAMES[0]
    );
  }, [stats.selectedFrameId]);

  const currentTitle = useMemo(() => {
    return TITLES.find((t) => t.id === stats.equippedTitleId);
  }, [stats.equippedTitleId]);

  const currentAvatar = useMemo(() => {
    return AVATAR_PRESETS.find(p => p.id === profile.avatar) || AVATAR_PRESETS[0];
  }, [profile.avatar]);

  // Count milestones
  const activeMilestones = milestones.filter(m => !m.completed).length;
  const completedMilestones = milestones.filter(m => m.completed).length;

  if (!stats) return null;

  return (
    <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* HERO CARD */}
      <ProfileHeader
        stats={stats}
        profile={profile}
        currentTitle={currentTitle}
        currentFrame={currentFrame}
        currentAvatar={currentAvatar}
        totalPower={totalPower}
        shards={shards}
        onEditProfile={() => { setTempName(profile.name); setIsEditOpen(true); }}
        language={language}
      />

      {/* TABS */}
      <div className="flex p-1 bg-slate-900/50 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('Stats')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'Stats' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {t('profile_stats', language)}
        </button>
        <button
          onClick={() => setActiveTab('Titles')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'Titles' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {t('profile_titles', language)}
        </button>
        <button
          onClick={() => setActiveTab('Frames')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'Frames' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {t('profile_frames', language)}
        </button>
      </div>

      {activeTab === 'Stats' && (
        <StatsTab
          stats={stats}
          effectiveStats={effectiveStats}
          season={season}
          seasonProgress={seasonProgress}
          onOpenSeason={onOpenSeason}
          activeMilestones={activeMilestones}
          completedMilestones={completedMilestones}
          language={language}
        />
      )}

      {activeTab === 'Titles' && (
        <TitlesTab
          stats={stats}
          onEquipTitle={onEquipTitle}
          language={language}
        />
      )}

      {activeTab === 'Frames' && (
        <FramesTab
          stats={stats}
          onEquipFrame={onEquipFrame}
          language={language}
        />
      )}

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        tempName={tempName}
        setTempName={setTempName}
        profileAvatar={profile.avatar}
        onSelectAvatar={selectAvatar}
        onSave={handleSave}
        language={language}
      />

    </div>
  );
};
