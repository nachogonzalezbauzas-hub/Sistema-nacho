import React from 'react';
import { Modal, TemplateChip, Input, Select, TextArea, Button } from '@/components';
import { MISSION_TEMPLATES, MissionTemplate } from '@/data/missionTemplates';
import { StatType } from '@/types';
import { Plus } from 'lucide-react';
import { t } from '@/data/translations';

interface AddMissionModalProps {
    isModalOpen: boolean;
    onClose: () => void;
    newTitle: string;
    setNewTitle: (value: string) => void;
    newStat: StatType;
    setNewStat: (value: StatType) => void;
    newXp: number;
    setNewXp: (value: number) => void;
    newIsDaily: boolean;
    setNewIsDaily: (value: boolean) => void;
    newDetail: string;
    setNewDetail: (value: string) => void;
    onAddMission: () => void;
    onTemplateClick: (template: MissionTemplate) => void;
    language: 'en' | 'es';
}

export const AddMissionModal: React.FC<AddMissionModalProps> = ({
    isModalOpen,
    onClose,
    newTitle,
    setNewTitle,
    newStat,
    setNewStat,
    newXp,
    setNewXp,
    newIsDaily,
    setNewIsDaily,
    newDetail,
    setNewDetail,
    onAddMission,
    onTemplateClick,
    language
}) => {
    return (
        <Modal isOpen={isModalOpen} onClose={onClose} title={t('missions_modal_title', language)}>
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-blue-400 font-bold uppercase mb-2 block tracking-wider">{t('missions_modal_templates', language)}</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {MISSION_TEMPLATES.map((t, i) => (
                            <TemplateChip key={i} template={t} onClick={() => onTemplateClick(t)} />
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">{t('missions_modal_label_title', language)}</label>
                        <Input placeholder={t('missions_modal_placeholder_title', language)} value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">{t('missions_modal_label_stat', language)}</label>
                        <Select value={newStat} onChange={e => setNewStat(e.target.value as StatType)}>
                            <option value="Strength">{t('stat_strength', language)}</option>
                            <option value="Vitality">{t('stat_vitality', language)}</option>
                            <option value="Agility">{t('stat_agility', language)}</option>
                            <option value="Intelligence">{t('stat_intelligence', language)}</option>
                            <option value="Fortune">{t('stat_fortune', language)}</option>
                            <option value="Metabolism">{t('stat_metabolism', language)}</option>
                        </Select>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">{t('missions_modal_label_xp', language)}</label>
                            <Input type="number" value={newXp} onChange={e => setNewXp(Number(e.target.value))} />
                        </div>
                        <div className="flex-1 flex items-end pb-3">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newIsDaily ? 'bg-blue-600 border-blue-500' : 'bg-slate-900 border-slate-700 group-hover:border-blue-500/50'}`}>
                                    {newIsDaily && <Plus size={14} className="text-white" />}
                                </div>
                                <span className={`text-xs font-bold uppercase ${newIsDaily ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>{t('missions_modal_label_daily', language)}</span>
                            </label>
                            <input type="checkbox" className="hidden" checked={newIsDaily} onChange={e => setNewIsDaily(e.target.checked)} />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">{t('missions_modal_label_desc', language)}</label>
                        <TextArea placeholder={t('missions_modal_placeholder_desc', language)} value={newDetail} onChange={e => setNewDetail(e.target.value)} rows={3} />
                    </div>
                </div>

                <div className="pt-4">
                    <Button onClick={onAddMission} className="w-full">{t('missions_modal_create_btn', language)}</Button>
                </div>
            </div>
        </Modal>
    );
};
