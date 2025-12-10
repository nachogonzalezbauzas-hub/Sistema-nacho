import React from 'react';
import { AppState, Settings } from '../types';
import { GameSettings } from '../components/settings/GameSettings';
import { DataSettings } from '../components/settings/DataSettings';

interface SettingsViewProps {
    state: AppState;
    updateSettings: (settings: Partial<Settings>) => void;
    resetAll: () => void;
    redeemCode: (code: string) => { success: boolean; message: string };
}

export const SettingsView: React.FC<SettingsViewProps> = ({ state, updateSettings, resetAll, redeemCode }) => {
    const { settings } = state;

    return (
        <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex justify-between items-end px-1 pb-2 border-b border-blue-900/30">
                <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter drop-shadow-md">SYSTEM SETTINGS</h2>
                    <p className="text-xs text-blue-400/80 font-mono uppercase tracking-widest mt-1">Tune your hunter interface</p>
                </div>
            </div>

            <GameSettings settings={settings} updateSettings={updateSettings} />
            <DataSettings redeemCode={redeemCode} resetAll={resetAll} />

        </div>
    );
};
