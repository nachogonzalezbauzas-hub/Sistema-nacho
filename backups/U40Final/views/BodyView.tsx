import React, { useState, useMemo } from 'react';
import { BodyRecord } from '../types';
import { Button } from '../components/UIComponents';
import { Activity, Flame } from 'lucide-react';
import { BodyStatusCard } from '../components/body/BodyStatusCard';
import { MeasurementsList } from '../components/body/MeasurementsList';
import { MeasurementModal } from '../components/body/MeasurementModal';
import { t } from '../data/translations';

interface BodyViewProps {
  records: BodyRecord[];
  onAddRecord: (record: Omit<BodyRecord, 'id' | 'date'>) => void;
  language: 'en' | 'es';
}

export const BodyView: React.FC<BodyViewProps> = ({ records, onAddRecord, language }) => {
  if (!records) {
    return <div className="p-8 text-center text-white">Loading body data...</div>;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records]);

  // --- ANALYTICS LOGIC ---

  const trackingStreak = useMemo(() => {
    if (records.length === 0) return 0;

    // Get unique dates YYYY-MM-DD
    const uniqueDates: string[] = Array.from(new Set(records.map(r => new Date(r.date).toDateString())));
    // Sort descending
    uniqueDates.sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let streak = 0;
    let currentDateToCheck = uniqueDates[0] === today ? today : (uniqueDates[0] === yesterday ? yesterday : null);

    if (!currentDateToCheck) return 0; // Streak broken or not started recently

    for (const dateStr of uniqueDates) {
      // If we miss a day in the sequence (logic: compare timestamps for strictness if needed, but array is sorted)
      // Simple check: create Date objects and diff
      const d1 = new Date(currentDateToCheck);
      const d2 = new Date(dateStr);
      const diffTime = Math.abs(d1.getTime() - d2.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) { // 0 for same day, 1 for consecutive
        streak++;
        currentDateToCheck = dateStr;
      } else {
        break;
      }
    }
    return streak;
  }, [records]);

  const trends = useMemo(() => {
    if (records.length < 2) return null;

    const now = new Date().getTime();
    const day = 86400000;

    const last7Days = records.filter(r => (now - new Date(r.date).getTime()) < 7 * day);
    const prev7Days = records.filter(r => {
      const diff = now - new Date(r.date).getTime();
      return diff >= 7 * day && diff < 14 * day;
    });

    if (last7Days.length === 0 || prev7Days.length === 0) return { status: 'insufficient' as const, label: 'Not enough data' };

    const avgLast = last7Days.reduce((acc, r) => acc + r.weight, 0) / last7Days.length;
    const avgPrev = prev7Days.reduce((acc, r) => acc + r.weight, 0) / prev7Days.length;
    const diff = avgLast - avgPrev;

    let status: 'cutting' | 'bulking' | 'stable' = 'stable';
    if (diff < -0.3) status = 'cutting';
    if (diff > 0.3) status = 'bulking';

    return {
      status,
      diff,
      avgLast,
      label: status === 'cutting' ? 'Cutting Trend' : status === 'bulking' ? 'Bulking Trend' : 'Stable'
    };
  }, [records]);

  const latestRecord = sortedRecords[0];
  const previousRecord = sortedRecords[1]; // Immediate previous for delta

  return (
    <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HEADER & STREAK */}
      <div className="flex justify-between items-end px-1 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{t('body_title', language)}</h2>
          <div className="flex items-center gap-2 mt-2">
            {trackingStreak > 0 ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg border border-blue-500/20 animate-pulse">
                <Flame size={12} className="fill-blue-400" /> {t('body_tracking_streak', language)}: {trackingStreak} {t('body_days', language)}
              </span>
            ) : (
              <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">{t('body_physical_metrics', language)}</p>
            )}
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-9 text-xs px-4 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all bg-blue-600 hover:bg-blue-500 border-none">
          <Activity size={14} /> {t('body_track_btn', language)}
        </Button>
      </div>

      {/* MAIN HEALTH CARD */}
      {latestRecord ? (
        <BodyStatusCard latestRecord={latestRecord} previousRecord={previousRecord} language={language} />
      ) : (
        <div className="text-center py-12 px-6 border border-dashed border-slate-800 rounded-xl bg-slate-900/20 animate-in zoom-in duration-500">
          <div className="inline-block p-4 rounded-full bg-slate-900 mb-3 border border-slate-700">
            <Activity className="text-blue-500" size={32} />
          </div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-1">{t('body_no_data_title', language)}</h3>
          <p className="text-slate-500 text-xs max-w-[200px] mx-auto leading-relaxed">
            {t('body_no_data_desc', language)}
          </p>
        </div>
      )}

      {/* TRENDS & HISTORY SECTION */}
      <MeasurementsList records={sortedRecords} trends={trends} language={language} />

      {/* ADD MODAL */}
      <MeasurementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddRecord={onAddRecord}
        language={language}
      />
    </div>
  );
};
