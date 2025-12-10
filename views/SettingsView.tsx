import React, { useState } from 'react';
import { AppState, Settings } from '@/types';
import { GameSettings } from '@/components/settings/GameSettings';
import { DataSettings } from '@/components/settings/DataSettings';
import { t } from '@/data/translations';
import { DirectorMode } from '@/components/settings/DirectorMode';
import { CloudSave } from '@/components/settings/CloudSave';

interface SettingsViewProps {
    state: AppState;
    updateSettings: (settings: Partial<Settings>) => void;
    resetAll: () => void;
    redeemCode: (code: string) => { success: boolean; message: string };
    onNavigate: (tab: string) => void;
    onForceRefreshQuests?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ state, updateSettings, resetAll, redeemCode, onNavigate, onForceRefreshQuests }) => {
    const { settings } = state;
    const lang = settings.language;
    const [isDirectorOpen, setIsDirectorOpen] = useState(false);

    return (
        <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex justify-between items-end px-1 pb-2 border-b border-blue-900/30">
                <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter drop-shadow-md">{t('settings_title', lang)}</h2>
                    <p className="text-xs text-blue-400/80 font-mono uppercase tracking-widest mt-1">{t('settings_subtitle', lang)}</p>
                </div>
            </div>

            <GameSettings settings={settings} updateSettings={updateSettings} />

            {/* Cloud Save Section */}
            <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Cloud Save</h3>
                <CloudSave />
            </div>

            <DataSettings redeemCode={redeemCode} resetAll={resetAll} onForceRefreshQuests={onForceRefreshQuests} language={lang} />

            {/* Director Mode Toggle */}
            <div className="pt-4 border-t border-blue-900/30">
                <button
                    onClick={() => setIsDirectorOpen(true)}
                    className="w-full py-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-purple-900/10 hover:border-purple-500/30 transition-all group"
                >
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-slate-600 group-hover:text-purple-400 transition-colors">⚡</span>
                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest group-hover:text-purple-400 transition-colors">
                            Director Mode
                        </span>
                    </div>
                </button>
            </div>

            <DirectorMode
                isOpen={isDirectorOpen}
                onClose={() => setIsDirectorOpen(false)}
                onNavigate={onNavigate}
            />

        </div>
    );
};
