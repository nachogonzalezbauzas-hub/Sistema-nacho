import React, { useState } from 'react';
import { Card } from '@/components';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { t } from '@/data/translations';

interface DataSettingsProps {
    redeemCode: (code: string) => { success: boolean; message: string };
    resetAll: () => void;
    language: 'en' | 'es';
}

export const DataSettings: React.FC<DataSettingsProps> = ({ redeemCode, resetAll, language }) => {
    const [resetStep, setResetStep] = useState<0 | 1 | 2>(0);
    const [confirmName, setConfirmName] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);

    const [code, setCode] = useState('');
    const [redeemStatus, setRedeemStatus] = useState<{ success: boolean; message: string } | null>(null);

    const CONFIRMATION_PHRASE = t('settings_reset_phrase', language);

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
                setTimeout(() => setRedeemStatus(null), 3000);
            }
        } catch (e) {
            setRedeemStatus({ success: false, message: "Error: " + (e as any).message });
        }
    };

    return (
        <>
            {/* Success Toast */}
            {resetSuccess && (
                <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-200 text-center font-bold animate-in fade-in zoom-in duration-300">
                    {t('settings_reset_success', language)}
                </div>
            )}

            {/* C) ACCESS CODES */}
            <Card className="p-5 space-y-4 bg-slate-900/60 border-blue-900/30 overflow-visible">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-900 text-emerald-400">
                        <ShieldAlert size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">{t('settings_access_codes', language)}</h3>
                </div>

                <div className="flex gap-2 items-center relative z-30">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                        }}
                        placeholder={t('settings_code_placeholder', language)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors relative z-30"
                    />
                    <button
                        type="button"
                        onClick={handleRedeem}
                        className="relative z-30 cursor-pointer active:scale-95 h-11 px-6 rounded-lg bg-emerald-600 text-white text-xs font-black tracking-wider hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20"
                    >
                        {t('settings_redeem', language)}
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
                    <h3 className="text-sm font-bold text-red-200 uppercase tracking-wider">{t('settings_danger_zone', language)}</h3>
                </div>

                <p className="text-xs text-red-400/70 leading-relaxed">
                    {t('settings_danger_desc', language)}
                </p>

                {resetStep === 0 ? (
                    <button
                        onClick={() => setResetStep(1)}
                        className="w-full py-3 rounded-xl bg-red-950/50 border border-red-900/50 text-red-400 font-bold text-xs uppercase tracking-widest hover:bg-red-900/50 hover:text-red-200 transition-all"
                    >
                        {t('settings_reset_system', language)}
                    </button>
                ) : (
                    <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="text-red-500 shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-red-200 uppercase">{t('settings_warning_step', language)} {resetStep}/2</h4>
                                <p className="text-[10px] text-red-300/70 mt-1">
                                    {resetStep === 1 ? t('settings_reset_warning_1', language) : t('settings_reset_warning_2', language)}
                                </p>
                            </div>
                        </div>

                        {resetStep === 1 && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setResetStep(0)}
                                    className="flex-1 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 text-xs font-bold"
                                >
                                    {t('settings_cancel', language)}
                                </button>
                                <button
                                    onClick={() => setResetStep(2)}
                                    className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500"
                                >
                                    {t('settings_continue', language)}
                                </button>
                            </div>
                        )}

                        {resetStep === 2 && (
                            <div className="space-y-3">
                                <p className="text-xs text-red-300">
                                    {t('settings_type_confirm', language)} <span className="font-mono font-bold text-white bg-red-900/50 px-1 rounded">{CONFIRMATION_PHRASE}</span> {t('settings_to_confirm', language)}
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
                                        {t('settings_cancel', language)}
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
                                        {t('settings_reset_confirm_btn', language)}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </>
    );
};
