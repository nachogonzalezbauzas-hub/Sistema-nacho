import React, { useState, useEffect } from 'react';
import { DailyQuest } from '@/types';
import { QuestCard } from '@/components';
import { Clock } from 'lucide-react';
import { useStore } from '@/store';
import { t, Language } from '@/data/translations';

interface DailyQuestSectionProps {
    dailyQuests: DailyQuest[];
    onClaimQuest: (id: string) => void;
    onManualComplete?: (id: string) => void;
    language: Language;
}

export const DailyQuestSection: React.FC<DailyQuestSectionProps> = ({ dailyQuests, onClaimQuest, onManualComplete, language = 'en' as Language }) => {
    const { refreshDailyQuests } = useStore();
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow.getTime() - now.getTime();

            if (diff <= 0) {
                refreshDailyQuests();
                return '00:00:00';
            }

            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [refreshDailyQuests]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end px-1 border-b border-blue-900/30 pb-2">
                <h2 className="text-xl font-black text-white italic tracking-tighter flex items-center gap-2">
                    {t('dash_daily_quests', language)}
                    {dailyQuests.filter(q => q.completed && !q.claimedAt).length > 0 && (
                        <span className="text-xs font-normal font-mono text-blue-500 not-italic bg-blue-950/50 px-2 py-0.5 rounded border border-blue-900">
                            {dailyQuests.filter(q => q.completed && !q.claimedAt).length} {t('dash_claimable', language)}
                        </span>
                    )}
                </h2>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                    <Clock size={12} />
                    <span>{t('dash_resets', language)} {timeLeft}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {dailyQuests.length > 0 ? (
                    dailyQuests.map((quest) => (
                        <QuestCard
                            key={`${quest.id}-${quest.completed}-${!!quest.claimedAt}`}
                            quest={quest}
                            onClaim={onClaimQuest}
                            onManualComplete={onManualComplete}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-500 text-sm italic border border-dashed border-slate-800 rounded-xl">
                        {t('dash_no_quests', language)}
                    </div>
                )}
            </div>
        </div>
    );
};
