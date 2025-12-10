import React from 'react';
import { SeasonDefinition as Season, SeasonProgress } from '../../types';
import { Gift, Trophy, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { t } from '../../data/translations';

interface ActionModulesProps {
    canOpenChest: boolean;
    onOpenChest: () => void;
    season?: Season;
    seasonProgress: SeasonProgress | null;
    onOpenSeason: () => void;
    language: 'en' | 'es';
}

export const ActionModules: React.FC<ActionModulesProps> = ({ canOpenChest, onOpenChest, season, seasonProgress, onOpenSeason, language }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Chest */}
            <button
                onClick={onOpenChest}
                disabled={!canOpenChest}
                className={`
            relative z-10 h-32 border-2 overflow-hidden group transition-all duration-300 active:scale-95 cursor-pointer
            ${canOpenChest ? 'border-yellow-500/50 bg-yellow-950/20' : 'border-slate-800 bg-slate-950/50 grayscale'}
          `}
            >

                {canOpenChest && <div className="absolute inset-0 bg-yellow-500/10 animate-pulse"></div>}

                <div className="relative z-10 flex items-center h-full px-6 gap-6">
                    <div className={`p-4 border ${canOpenChest ? 'border-yellow-500 bg-yellow-500/20' : 'border-slate-700'} rotate-45 group-hover:rotate-0 transition-transform duration-500`}>
                        <Gift size={32} className={`-rotate-45 group-hover:rotate-0 transition-transform duration-500 ${canOpenChest ? 'text-yellow-400' : 'text-slate-500'}`} />
                    </div>
                    <div className="text-left">
                        <div className={`text-2xl font-black uppercase tracking-tighter ${canOpenChest ? 'text-yellow-100 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'text-slate-500'}`}>
                            {t('dash_daily_supply', language)}
                        </div>
                        <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                            {canOpenChest ? t('dash_ready_claim', language) : t('dash_cooldown', language)}
                        </div>
                    </div>
                </div>
            </button>

            {/* Season Module */}
            {season && (
                <button
                    onClick={onOpenSeason}
                    className="relative z-10 h-32 border-2 border-blue-500/50 bg-blue-950/20 overflow-hidden group active:scale-95 transition-transform cursor-pointer"
                >

                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent opacity-50"></div>

                    <div className="relative z-10 flex items-center h-full px-6 gap-6">
                        <div className="p-4 border border-blue-400 bg-blue-500/20 group-hover:scale-110 transition-transform">
                            <Trophy size={32} className="text-blue-300" />
                        </div>
                        <div className="text-left">
                            <div className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">{t('dash_current_season', language)}</div>
                            <div className="text-xl font-black text-white uppercase tracking-tighter italic drop-shadow-[0_0_10px_#3b82f6] leading-none mb-2">
                                {season.name}
                            </div>

                            {/* Dates */}
                            <div className="flex items-center gap-2 text-[10px] text-blue-300/70 font-mono mb-2">
                                <Calendar size={10} />
                                <span>{format(new Date(season.startDate), 'MMM d')} - {format(new Date(season.endDate), 'MMM d, yyyy')}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="h-1 w-16 bg-blue-900">
                                    <div className="h-full bg-blue-400 w-2/3 animate-[pulse_1s_infinite]"></div>
                                </div>
                                <span className="text-[10px] font-mono text-blue-300">{t('dash_rank', language)} {seasonProgress?.rank || 'E'}</span>
                            </div>
                        </div>
                    </div>
                </button>
            )}
        </div>
    );
};
