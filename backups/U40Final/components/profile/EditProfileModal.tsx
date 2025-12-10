import React from 'react';
import { Modal, Input, Button } from '../UIComponents';
import { User, Ghost, Crown, Flame, Skull } from 'lucide-react';
import { t, Language } from '../../data/translations';

export interface AvatarPreset {
    id: string;
    bg: string;
    color: string;
    icon: React.ReactNode;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
    { id: 'default', bg: 'bg-blue-500', color: 'text-white', icon: <User size={24} /> },
    { id: 'shadow', bg: 'bg-purple-600', color: 'text-purple-100', icon: <Ghost size={24} /> },
    { id: 'king', bg: 'bg-yellow-500', color: 'text-yellow-900', icon: <Crown size={24} /> },
    { id: 'flame', bg: 'bg-red-500', color: 'text-white', icon: <Flame size={24} /> },
    { id: 'skull', bg: 'bg-slate-700', color: 'text-slate-300', icon: <Skull size={24} /> },
];

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    tempName: string;
    setTempName: (name: string) => void;
    profileAvatar: string;
    onSelectAvatar: (id: string) => void;
    onSave: () => void;
    language?: Language;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    tempName,
    setTempName,
    profileAvatar,
    onSelectAvatar,
    onSave,
    language = 'en' as Language
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('profile_edit_title', language)}>
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">{t('profile_hunter_name', language)}</label>
                    <Input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder={t('profile_name_placeholder', language)}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t('profile_avatar_appearance', language)}</label>
                    <div className="grid grid-cols-5 gap-3 max-h-[300px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-slate-900">
                        {AVATAR_PRESETS.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => onSelectAvatar(preset.id)}
                                className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all flex items-center justify-center ${preset.bg} ${preset.color} ${profileAvatar === preset.id ? 'border-blue-500 scale-110 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10' : 'border-transparent hover:border-slate-600 hover:scale-105'}`}
                            >
                                {preset.icon}
                            </button>
                        ))}
                    </div>
                </div>
                <Button onClick={onSave} className="w-full mt-2">{t('profile_save_changes', language)}</Button>
            </div>
        </Modal>
    );
};
