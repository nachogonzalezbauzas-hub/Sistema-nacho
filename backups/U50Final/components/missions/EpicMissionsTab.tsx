import React from 'react';
import { Milestone } from '@/types';
import { MilestoneCard, Button } from '@/components';
import { Sword } from 'lucide-react';
import { t } from '@/data/translations';

interface EpicMissionsTabProps {
    milestones: Milestone[];
    epicFilter: 'Active' | 'Completed';
    setEpicFilter: (filter: 'Active' | 'Completed') => void;
    onIncrementMilestone: (id: string) => void;
    addTestMilestone: () => void;
    language: 'en' | 'es';
}

export const EpicMissionsTab: React.FC<EpicMissionsTabProps> = ({
    milestones,
    epicFilter,
    setEpicFilter,
    onIncrementMilestone,
    addTestMilestone,
    language
}) => {
    const filteredMilestones = (milestones || []).filter(m => epicFilter === 'Active' ? !m.isCompleted : m.isCompleted);

    return (
        <div className="space-y-4">
            {/* Epic Filter Submenu */}
            <div className="flex justify-center mb-4">
                <div className="bg-[#050a14]/60 p-1 rounded-lg border border-blue-900/30 flex gap-1">
                    {(['Active', 'Completed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setEpicFilter(f)}
                            className={`
                      px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all
                      ${epicFilter === f
                                    ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                                    : 'text-slate-500 hover:text-blue-300 hover:bg-white/5'
                                }
                    `}
                        >
                            {t(`missions_epic_${f.toLowerCase()}` as any, language)}
                        </button>
                    ))}
                </div>
            </div>

            {filteredMilestones.length === 0 ? (
                <div className="text-center py-12 opacity-50 border border-dashed border-slate-800 rounded-xl bg-[#050a14]/50">
                    <Sword size={48} className="mx-auto mb-4 text-slate-700" />
                    <p className="text-slate-500 font-mono text-xs mb-4">{t(`missions_epic_no_${epicFilter.toLowerCase()}` as any, language)}</p>
                    {epicFilter === 'Active' && (milestones || []).length === 0 && (
                        <Button variant="secondary" onClick={addTestMilestone} className="mx-auto">
                            {t('missions_epic_start_arc', language)}
                        </Button>
                    )}
                </div>
            ) : (
                filteredMilestones.map(milestone => (
                    <MilestoneCard
                        key={milestone.id}
                        milestone={milestone}
                        onAction={() => onIncrementMilestone(milestone.id)}
                    />
                ))
            )}

            {(milestones || []).length > 0 && epicFilter === 'Active' && (
                <div className="pt-8 flex justify-center opacity-50 hover:opacity-100 transition-opacity">
                    <Button variant="ghost" onClick={addTestMilestone} className="text-[10px]">
                        {t('missions_epic_debug', language)}
                    </Button>
                </div>
            )}
        </div>
    );
};
