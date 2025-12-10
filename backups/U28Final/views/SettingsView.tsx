import React, { useState } from 'react';
import { AppState, Settings } from '../types';
import { Volume2, VolumeX, Moon, Sun, AlertTriangle, Check, X, ShieldAlert, Music, Speaker } from 'lucide-react';
import { Card } from '../components/UIComponents';

interface SettingsViewProps {
    state: AppState;
    updateSettings: (settings: Partial<Settings>) => void;
    resetAll: () => void;
    redeemCode: (code: string) => { success: boolean; message: string };
}

export const SettingsView: React.FC<SettingsViewProps> = ({ state, updateSettings, resetAll, redeemCode }) => {
    const { settings } = state;

    const [resetStep, setResetStep] = useState<0 | 1 | 2>(0);
    const [confirmName, setConfirmName] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);

    const [code, setCode] = useState('');
    const [redeemStatus, setRedeemStatus] = useState<{ success: boolean; message: string } | null>(null);

    const handleReset = () => {
        resetAll();
        setResetSuccess(true);
        setResetStep(0);
        setConfirmName('');
        // Auto hide success message after 3s
        setTimeout(() => setResetSuccess(false), 3000);
    };

    const handleRedeem = () => {
        if (!code.trim()) return;

        try {
            const result = redeemCode(code);
            setRedeemStatus(result);
            if (result.success) {
                setCode('');
                // Force reload if needed, but let's try just status first
                setTimeout(() => setRedeemStatus(null), 3000);
            }
        } catch (e) {
            setRedeemStatus({ success: false, message: "Error: " + (e as any).message });
        }
    };

    // Mock player name for now since it's not in stats explicitly, using "Hunter" or a placeholder if we add it later.
    // The requirements mentioned "state.stats.playerName", but looking at types.ts, UserStats doesn't have playerName.
    // I will assume the user meant a generic confirmation or I should check if I missed playerName.
    // Checking types.ts again... UserStats has no playerName. I will use "Hunter" as the confirmation word for now, 
    // or just ask to type "RESET". The prompt said "Type your current hunter name", but if it doesn't exist, I'll use "DELETE".
    // Actually, let's use "SYSTEM RESET" as the confirmation phrase to be safe and clear.
    const CONFIRMATION_PHRASE = "SYSTEM RESET";

    return (
        <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex justify-between items-end px-1 pb-2 border-b border-blue-900/30">
                <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter drop-shadow-md">SYSTEM SETTINGS</h2>
                    <p className="text-xs text-blue-400/80 font-mono uppercase tracking-widest mt-1">Tune your hunter interface</p>
                </div>
            </div>

            {/* Success Toast */}
            {resetSuccess && (
                <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-200 text-center font-bold animate-in fade-in zoom-in duration-300">
                    SYSTEM RESET SUCCESSFUL
                </div>
            )}

            {/* A) AUDIO SETTINGS */}
            <Card className="p-5 space-y-4 bg-slate-900/60 border-blue-900/30">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-950 border border-blue-900 text-blue-400">
                        <Volume2 size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Audio</h3>
                </div>

                {/* Music Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <Music size={16} className={settings.musicEnabled ? "text-blue-400" : "text-slate-600"} />
                        <div>
                            <div className="text-sm font-bold text-slate-300">Background Music</div>
                            <div className="text-[10px] text-slate-500">Epic Solo Leveling-style theme</div>
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
                            <div className="text-sm font-bold text-slate-300">System SFX</div>
                            <div className="text-[10px] text-slate-500">Level ups and feedback sounds</div>
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
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Theme</h3>
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
                        <span className={`text-xs font-bold ${settings.theme === 'dark' ? "text-white" : "text-slate-500"}`}>Dark Mode</span>
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
                        <span className={`text-xs font-bold ${settings.theme === 'light' ? "text-slate-900" : "text-slate-500"}`}>Light Mode</span>
                        {settings.theme === 'light' && (
                            <div className="absolute top-2 right-2 text-blue-500"><Check size={14} /></div>
                        )}
                    </button>
                </div>
            </Card>

            {/* C) ACCESS CODES */}
            <Card className="p-5 space-y-4 bg-slate-900/60 border-blue-900/30 overflow-visible">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-900 text-emerald-400">
                        <ShieldAlert size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Access Codes</h3>
                </div>

                <div className="flex gap-2 items-center relative z-30">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                        }}
                        placeholder="Enter system code..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors relative z-30"
                    />
                    <button
                        type="button"
                        onClick={handleRedeem}
                        className="relative z-30 cursor-pointer active:scale-95 h-11 px-6 rounded-lg bg-emerald-600 text-white text-xs font-black tracking-wider hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20"
                    >
                        REDEEM
                    </button>
                </div>
                {redeemStatus && (
                    <div className={`text-sm font-black uppercase tracking-widest text-center p-2 rounded-lg ${redeemStatus.success ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                        {redeemStatus.message}
                    </div>
                )}
            </Card>

            {/* D) SYSTEM RESET */}
            <Card className="p-5 space-y-4 bg-red-950/10 border-red-900/30">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-red-950/50 border border-red-900 text-red-500">
                        <ShieldAlert size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-red-200 uppercase tracking-wider">Danger Zone</h3>
                </div>

                <p className="text-xs text-red-400/70 leading-relaxed">
                    Reset all progress, stats, missions, logs, titles and milestones. This action cannot be undone.
                </p>

                {resetStep === 0 ? (
                    <button
                        onClick={() => setResetStep(1)}
                        className="w-full py-3 rounded-xl bg-red-950/50 border border-red-900/50 text-red-400 font-bold text-xs uppercase tracking-widest hover:bg-red-900/50 hover:text-red-200 transition-all"
                    >
                        Reset System
                    </button>
                ) : (
                    <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="text-red-500 shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-red-200 uppercase">Warning: Step {resetStep}/2</h4>
                                <p className="text-[10px] text-red-300/70 mt-1">
                                    {resetStep === 1 ? "This will erase all your progress and return Sistema Nacho to day 1." : "Final Confirmation."}
                                </p>
                            </div>
                        </div>

                        {resetStep === 1 && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setResetStep(0)}
                                    className="flex-1 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 text-xs font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setResetStep(2)}
                                    className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {resetStep === 2 && (
                            <div className="space-y-3">
                                <p className="text-xs text-red-300">
                                    Type <span className="font-mono font-bold text-white bg-red-900/50 px-1 rounded">{CONFIRMATION_PHRASE}</span> to confirm.
                                </p>
                                <input
                                    type="text"
                                    value={confirmName}
                                    onChange={(e) => setConfirmName(e.target.value)}
                                    placeholder={CONFIRMATION_PHRASE}
                                    className="w-full bg-slate-950 border border-red-900/50 rounded-lg px-3 py-2 text-xs text-red-200 placeholder:text-red-900/50 focus:outline-none focus:border-red-500"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setResetStep(0); setConfirmName(''); }}
                                        className="flex-1 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 text-xs font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={confirmName !== CONFIRMATION_PHRASE}
                                        onClick={handleReset}
                                        className={`
                      flex-1 py-2 rounded-lg text-xs font-bold transition-all
                      ${confirmName === CONFIRMATION_PHRASE
                                                ? 'bg-red-600 text-white hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                            }
                    `}
                                    >
                                        YES, RESET EVERYTHING
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};
