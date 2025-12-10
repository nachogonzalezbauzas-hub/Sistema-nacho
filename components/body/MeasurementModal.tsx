import React, { useState } from 'react';
import { Modal, Input, TextArea, Button } from '@/components';
import { Scale, Moon, AlertCircle } from 'lucide-react';
import { BodyRecord } from '@/types';
import { t } from '@/data/translations';

interface MeasurementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddRecord: (record: Omit<BodyRecord, 'id' | 'date'>) => void;
    language: 'en' | 'es';
}

export const MeasurementModal: React.FC<MeasurementModalProps> = ({ isOpen, onClose, onAddRecord, language }) => {
    const [newRecord, setNewRecord] = useState({
        weight: '',
        sleepHours: '',
        notes: ''
    });
    const [warnings, setWarnings] = useState<{ weight?: string; sleep?: string }>({});

    const handleInputChange = (field: 'weight' | 'sleepHours' | 'notes', value: string) => {
        let warn = { ...warnings };
        if (field === 'weight') {
            const num = parseFloat(value);
            if (num < 0) return; // Prevent negative
            if (num > 250) warn.weight = t('body_warn_weight', language);
            else delete warn.weight;
        }
        if (field === 'sleepHours') {
            const num = parseFloat(value);
            if (num < 0) return;
            if (num > 18) warn.sleep = t('body_warn_sleep', language);
            else delete warn.sleep;
        }
        setWarnings(warn);
        setNewRecord(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRecord.weight || !newRecord.sleepHours) return;

        onAddRecord({
            weight: parseFloat(newRecord.weight),
            sleepHours: parseFloat(newRecord.sleepHours),
            notes: newRecord.notes
        });

        onClose();
        setNewRecord({ weight: '', sleepHours: '', notes: '' });
        setWarnings({});
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('body_modal_title', language)}>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-blue-400 mb-1.5 uppercase tracking-widest">{t('body_modal_weight', language)}</label>
                        <div className="relative">
                            <Input
                                type="number"
                                step="0.1"
                                value={newRecord.weight}
                                onChange={e => handleInputChange('weight', e.target.value)}
                                required
                                placeholder="83.5"
                                className={`font-mono text-lg pl-9 ${warnings.weight ? 'border-red-500/50 focus:border-red-500' : ''}`}
                            />
                            <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        </div>
                        {warnings.weight && <span className="text-[9px] text-red-400 mt-1 block">{warnings.weight}</span>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-blue-400 mb-1.5 uppercase tracking-widest">{t('body_modal_sleep', language)}</label>
                        <div className="relative">
                            <Input
                                type="number"
                                step="0.5"
                                value={newRecord.sleepHours}
                                onChange={e => handleInputChange('sleepHours', e.target.value)}
                                required
                                placeholder="7.5"
                                className={`font-mono text-lg pl-9 ${warnings.sleep ? 'border-red-500/50 focus:border-red-500' : ''}`}
                            />
                            <Moon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        </div>
                        {warnings.sleep && <span className="text-[9px] text-red-400 mt-1 block">{warnings.sleep}</span>}
                        {!warnings.sleep && parseFloat(newRecord.sleepHours) >= 8 && (
                            <span className="text-[9px] text-green-400 mt-1 block animate-pulse">✨ Restoration Buff Active</span>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-blue-400 mb-1.5 uppercase tracking-widest">{t('body_modal_notes', language)}</label>
                    <TextArea
                        value={newRecord.notes}
                        onChange={e => handleInputChange('notes', e.target.value)}
                        placeholder={t('body_modal_placeholder', language)}
                        rows={3}
                        className="text-sm"
                    />
                </div>

                <div className="flex items-start gap-2 p-3 rounded bg-blue-950/20 border border-blue-500/20">
                    <AlertCircle size={14} className="text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-blue-300/80 leading-relaxed">
                        {t('body_modal_tip', language)}
                    </p>
                </div>

                <Button type="submit" className="w-full h-12 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]">
                    {t('body_modal_confirm', language)}
                </Button>
            </form>
        </Modal>
    );
};
