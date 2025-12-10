import React from 'react';
import { Settings } from '../../types';
import { Card } from '../UIComponents';
import { Volume2, Music, Speaker, Moon, Sun, Check, Globe } from 'lucide-react';
import { t } from '../../data/translations';

interface GameSettingsProps {
    settings: Settings;
    updateSettings: (settings: Partial<Settings>) => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({ settings, updateSettings }) => {
    const lang = settings.language;

    return (
        <>
            {/* A) AUDIO SETTINGS */}
            <Card className="p-5 space-y-4 bg-slate-900/60 border-blue-900/30">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-950 border border-blue-900 text-blue-400">
                        <Volume2 size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">{t('settings_audio', lang)}</h3>
                </div>

                {/* Music Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <Music size={16} className={settings.musicEnabled ? "text-blue-400" : "text-slate-600"} />
                        <div>
                            <div className="text-sm font-bold text-slate-300">{t('settings_music', lang)}</div>
                            <div className="text-[10px] text-slate-500">{t('settings_music_desc', lang)}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => updateSettings({ musicEnabled: !settings.musicEnabled })}
                        className={`
              relative w-11 h-6 rounded-full transition-colors duration-300
              ${settings.musicEnabled ? 'bg-blue-600' : 'bg-slate-700'}
            `}
                    >
                        <div className={`
              absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300
              ${settings.musicEnabled ? 'translate-x-5' : 'translate-x-0'}
            `} />
                    </button>
                </div>

                {/* SFX Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <Speaker size={16} className={settings.sfxEnabled ? "text-cyan-400" : "text-slate-600"} />
                        <div>
                            <div className="text-sm font-bold text-slate-300">{t('settings_sfx', lang)}</div>
                            <div className="text-[10px] text-slate-500">{t('settings_sfx_desc', lang)}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => updateSettings({ sfxEnabled: !settings.sfxEnabled })}
                        className={`
              relative w-11 h-6 rounded-full transition-colors duration-300
              ${settings.sfxEnabled ? 'bg-cyan-600' : 'bg-slate-700'}
            `}
                    >
                        <div className={`
              absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300
              ${settings.sfxEnabled ? 'translate-x-5' : 'translate-x-0'}
            `} />
                    </button>
                </div>
            </Card>

            {/* B) THEME SETTINGS */}
            <Card className="p-5 space-y-4 bg-slate-900/60 border-blue-900/30">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-purple-950 border border-purple-900 text-purple-400">
                        <Moon size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">{t('settings_theme', lang)}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => updateSettings({ theme: 'dark' })}
                        className={`
              relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300
              ${settings.theme === 'dark'
                                ? 'bg-slate-950 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                : 'bg-slate-950/30 border-slate-800 hover:bg-slate-900'
                            }
            `}
                    >
                        <Moon size={24} className={settings.theme === 'dark' ? "text-blue-400" : "text-slate-600"} />
                        <span className={`text-xs font-bold ${settings.theme === 'dark' ? "text-white" : "text-slate-500"}`}>{t('settings_dark_mode', lang)}</span>
                        {settings.theme === 'dark' && (
                            <div className="absolute top-2 right-2 text-blue-500"><Check size={14} /></div>
                        )}
                    </button>

                    <button
                        onClick={() => updateSettings({ theme: 'light' })}
                        className={`
              relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300
              ${settings.theme === 'light'
                                ? 'bg-slate-100 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                : 'bg-slate-950/30 border-slate-800 hover:bg-slate-900'
                            }
            `}
                    >
                        <Sun size={24} className={settings.theme === 'light' ? "text-amber-500" : "text-slate-600"} />
                        <span className={`text-xs font-bold ${settings.theme === 'light' ? "text-slate-900" : "text-slate-500"}`}>{t('settings_light_mode', lang)}</span>
                        {settings.theme === 'light' && (
                            <div className="absolute top-2 right-2 text-blue-500"><Check size={14} /></div>
                        )}
                    </button>
                </div>
            </Card>

            {/* C) LANGUAGE SETTINGS */}
            <Card className="p-5 space-y-4 bg-slate-900/60 border-blue-900/30">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-green-950 border border-green-900 text-green-400">
                        <Globe size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">{t('settings_language', lang)}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => updateSettings({ language: 'en' })}
                        className={`
              relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300
              ${settings.language === 'en'
                                ? 'bg-slate-950 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                : 'bg-slate-950/30 border-slate-800 hover:bg-slate-900'
                            }
            `}
                    >
                        <span className="text-2xl">🇺🇸</span>
                        <span className={`text-xs font-bold ${settings.language === 'en' ? "text-white" : "text-slate-500"}`}>{t('settings_english', lang)}</span>
                        {settings.language === 'en' && (
                            <div className="absolute top-2 right-2 text-blue-500"><Check size={14} /></div>
                        )}
                    </button>

                    <button
                        onClick={() => updateSettings({ language: 'es' })}
                        className={`
              relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300
              ${settings.language === 'es'
                                ? 'bg-slate-950 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                : 'bg-slate-950/30 border-slate-800 hover:bg-slate-900'
                            }
            `}
                    >
                        <span className="text-2xl">🇪🇸</span>
                        <span className={`text-xs font-bold ${settings.language === 'es' ? "text-white" : "text-slate-500"}`}>{t('settings_spanish', lang)}</span>
                        {settings.language === 'es' && (
                            <div className="absolute top-2 right-2 text-blue-500"><Check size={14} /></div>
                        )}
                    </button>
                </div>
            </Card>
        </>
    );
};
