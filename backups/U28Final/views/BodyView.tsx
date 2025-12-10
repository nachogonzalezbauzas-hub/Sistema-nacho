import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BodyRecord } from '../types';
import { Card, Button, Input, TextArea, Modal } from '../components/UIComponents';
import { Activity, Moon, Scale, TrendingUp, TrendingDown, Minus, Calendar, Plus, AlertCircle, Flame } from 'lucide-react';

interface BodyViewProps {
  records: BodyRecord[];
  onAddRecord: (record: Omit<BodyRecord, 'id' | 'date'>) => void;
}

export const BodyView: React.FC<BodyViewProps> = ({ records, onAddRecord }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    weight: '',
    sleepHours: '',
    notes: ''
  });
  const [warnings, setWarnings] = useState<{ weight?: string; sleep?: string }>({});

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records]);

  // --- ANALYTICS LOGIC ---

  const trackingStreak = useMemo(() => {
    if (records.length === 0) return 0;

    // Get unique dates YYYY-MM-DD
    const uniqueDates = Array.from(new Set(records.map(r => new Date(r.date).toDateString())));
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

    if (last7Days.length === 0 || prev7Days.length === 0) return { status: 'insufficient', label: 'Not enough data' };

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

  const getDelta = (current: number, previous: number) => {
    const diff = current - previous;
    const absDiff = Math.abs(diff);
    if (absDiff < 0.1) return { val: 'Stable', color: 'text-slate-500', icon: <Minus size={12} /> };
    const isGain = diff > 0;
    return {
      val: `${isGain ? '+' : ''}${diff.toFixed(1)} kg`,
      color: isGain ? 'text-red-400' : 'text-green-400',
      icon: isGain ? <TrendingUp size={12} /> : <TrendingDown size={12} />
    };
  };

  // --- HANDLERS ---

  const handleInputChange = (field: 'weight' | 'sleepHours' | 'notes', value: string) => {
    let warn = { ...warnings };
    if (field === 'weight') {
      const num = parseFloat(value);
      if (num < 0) return; // Prevent negative
      if (num > 250) warn.weight = 'Abnormal weight value detected.';
      else delete warn.weight;
    }
    if (field === 'sleepHours') {
      const num = parseFloat(value);
      if (num < 0) return;
      if (num > 18) warn.sleep = 'Hibernation mode detected?';
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

    setIsModalOpen(false);
    setNewRecord({ weight: '', sleepHours: '', notes: '' });
    setWarnings({});
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const latestRecord = sortedRecords[0];
  const previousRecord = sortedRecords[1]; // Immediate previous for delta

  return (
    <div className="pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HEADER & STREAK */}
      <div className="flex justify-between items-end px-1 border-b border-blue-900/30 pb-2">
        <div>
          <h2 className="text-2xl font-black text-white italic tracking-tighter drop-shadow-md">STATUS</h2>
          <div className="flex items-center gap-2 mt-1">
            {trackingStreak > 0 ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 animate-pulse">
                <Flame size={10} className="fill-blue-400" /> Tracking Streak: {trackingStreak} Days
              </span>
            ) : (
              <p className="text-xs text-blue-400/80 font-mono uppercase tracking-widest">Physical Metrics</p>
            )}
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-9 text-xs px-3 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all">
          <Activity size={14} /> TRACK
        </Button>
      </div>

      {/* MAIN HEALTH CARD */}
      {latestRecord ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-blue-600/5 blur-xl rounded-2xl group-hover:bg-blue-600/10 transition-all duration-500"></div>
          <Card className="relative border border-blue-500/30 bg-[#0a0f1e]/90 p-5 flex flex-col gap-4 overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-blue-400/50">

            {/* Top Row: Date & Status */}
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                {formatDate(latestRecord.date)}
              </span>
              {previousRecord && (
                <div className="flex items-center gap-1.5">
                  {(() => {
                    const delta = getDelta(latestRecord.weight, previousRecord.weight);
                    return (
                      <span className={`flex items-center gap-1 text-xs font-mono font-bold ${delta.color} bg-slate-950/50 px-2 py-1 rounded border border-white/5`}>
                        {delta.icon} {delta.val}
                      </span>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Middle Row: Metrics */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Body Weight</span>
                <div className="flex items-baseline gap-1">
                  <motion.span
                    key={latestRecord.weight}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-black text-white tracking-tighter drop-shadow-sm"
                  >
                    {latestRecord.weight}
                  </motion.span>
                  <span className="text-sm font-bold text-slate-500">KG</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1">Sleep Cycle</span>
                <div className="flex items-center gap-2">
                  <Moon size={20} className="text-purple-500 fill-purple-500/20" />
                  <motion.span
                    key={latestRecord.sleepHours}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-black text-white tracking-tighter"
                  >
                    {latestRecord.sleepHours}
                  </motion.span>
                  <span className="text-xs font-bold text-slate-500">H</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Notes */}
            {latestRecord.notes && (
              <div className="mt-2 pt-3 border-t border-blue-900/30">
                <p className="text-xs text-slate-400 italic leading-relaxed">"{latestRecord.notes}"</p>
              </div>
            )}
          </Card>
        </motion.div>
      ) : (
        <div className="text-center py-12 px-6 border border-dashed border-slate-800 rounded-xl bg-slate-900/20 animate-in zoom-in duration-500">
          <div className="inline-block p-4 rounded-full bg-slate-900 mb-3 border border-slate-700">
            <Activity className="text-blue-500" size={32} />
          </div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-1">No System Data</h3>
          <p className="text-slate-500 text-xs max-w-[200px] mx-auto leading-relaxed">
            Start tracking weight and sleep to unlock status insights and trends.
          </p>
        </div>
      )}

      {/* TRENDS & HISTORY SECTION */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
          History & Trends
        </h3>

        {/* 7-Day Trend Pill */}
        {trends && trends.status !== 'insufficient' ? (
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800 mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-md ${trends.status === 'cutting' ? 'bg-green-900/30 text-green-400' : trends.status === 'bulking' ? 'bg-red-900/30 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
                {trends.status === 'cutting' ? <TrendingDown size={16} /> : trends.status === 'bulking' ? <TrendingUp size={16} /> : <Minus size={16} />}
              </div>
              <div>
                <span className={`block text-[10px] font-bold uppercase tracking-wider ${trends.status === 'cutting' ? 'text-green-400' : trends.status === 'bulking' ? 'text-red-400' : 'text-slate-400'}`}>
                  {trends.label}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">7-Day Avg: {trends.avgLast.toFixed(1)}kg</span>
              </div>
            </div>
            <div className={`text-xs font-mono font-bold ${trends.diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {trends.diff > 0 ? '+' : ''}{trends.diff.toFixed(1)}kg
            </div>
          </div>
        ) : records.length > 0 && (
          <div className="px-3 py-2 rounded border border-slate-800 bg-slate-900/20 text-center mb-4">
            <span className="text-[10px] text-slate-600 font-mono uppercase">Track at least 8 days to unlock trends</span>
          </div>
        )}

        {/* History List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-hide">
          <AnimatePresence>
            {sortedRecords.map((record, idx) => {
              // Find specific previous record for this entry to show historical delta
              const prev = sortedRecords[idx + 1];
              const delta = prev ? getDelta(record.weight, prev.weight) : null;

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex items-center justify-between p-3 rounded-lg bg-[#050914] border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex flex-col items-center justify-center rounded bg-slate-900 border border-slate-800 text-slate-500">
                      <span className="text-[9px] font-bold uppercase">{new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-xs font-mono font-bold text-white">{new Date(record.date).getDate()}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">{record.weight} kg</span>
                        {delta && (
                          <span className={`text-[9px] font-mono ${delta.color} opacity-60 flex items-center`}>
                            {delta.val}
                          </span>
                        )}
                      </div>
                      {record.notes && (
                        <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{record.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-purple-900/10 border border-purple-500/10">
                    <Moon size={10} className="text-purple-400" />
                    <span className="text-xs font-mono font-bold text-purple-200">{record.sleepHours}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ADD MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Status">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-blue-400 mb-1.5 uppercase tracking-widest">Weight (kg)</label>
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
              <label className="block text-xs font-bold text-blue-400 mb-1.5 uppercase tracking-widest">Sleep (hrs)</label>
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
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-blue-400 mb-1.5 uppercase tracking-widest">System Notes</label>
            <TextArea
              value={newRecord.notes}
              onChange={e => handleInputChange('notes', e.target.value)}
              placeholder="Condition report, mood, training notes..."
              rows={3}
              className="text-sm"
            />
          </div>

          <div className="flex items-start gap-2 p-3 rounded bg-blue-950/20 border border-blue-500/20">
            <AlertCircle size={14} className="text-blue-400 mt-0.5 shrink-0" />
            <p className="text-[10px] text-blue-300/80 leading-relaxed">
              Better sleep stabilizes <strong>Vitality</strong>. Fast weight changes may influence <strong>Metabolism</strong>.
            </p>
          </div>

          <Button type="submit" className="w-full h-12 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]">
            CONFIRM METRICS
          </Button>
        </form>
      </Modal>
    </div>
  );
};
