import React from 'react';
import { motion } from 'framer-motion';
import { X, Package, Shield, Zap, Layout, Terminal } from 'lucide-react';
import { useStore } from '@/store';
import { generateEquipment, generateSetEquipment } from '@/data/equipmentGenerator';
import { Button } from '@/components';

interface DirectorModeProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: string) => void;
}

export const DirectorMode: React.FC<DirectorModeProps> = ({ isOpen, onClose, onNavigate }) => {
    const { addEquipment } = useStore();

    if (!isOpen) return null;

    const handleAddRandomItem = () => {
        const newItem = generateEquipment();
        addEquipment(newItem);
    };

    const handleAddSet = () => {
        const setItems = generateSetEquipment();
        setItems.forEach(item => addEquipment(item));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-[#0a0f1e] border border-purple-500/30 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-purple-900/30 bg-purple-950/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                            <Terminal size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-widest">Director Mode</h2>
                            <p className="text-xs text-purple-400 font-mono">System Override & Debug Tools</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-8">

                    {/* Inventory Tools */}
                    <section>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Package size={14} /> Inventory Management
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button
                                variant="secondary"
                                onClick={handleAddRandomItem}
                                className="justify-start h-auto py-4 border-dashed border-slate-700 hover:border-blue-500 hover:bg-blue-950/30"
                            >
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-xs font-bold text-blue-400">Add Random Item</span>
                                    <span className="text-[10px] text-slate-500 font-mono">Generates 1 random gear piece</span>
                                </div>
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={handleAddSet}
                                className="justify-start h-auto py-4 border-dashed border-slate-700 hover:border-purple-500 hover:bg-purple-950/30"
                            >
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-xs font-bold text-purple-400">Add Shadow Monarch Set</span>
                                    <span className="text-[10px] text-slate-500 font-mono">Generates full legendary set</span>
                                </div>
                            </Button>
                        </div>
                    </section>

                    {/* Navigation / Showcases */}
                    <section>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Layout size={14} /> System Showcases
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    onNavigate('ProceduralShowcase');
                                    onClose();
                                }}
                                className="justify-start h-auto py-4 hover:border-cyan-500 hover:bg-cyan-950/30"
                            >
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-xs font-bold text-cyan-400">Procedural Generation</span>
                                    <span className="text-[10px] text-slate-500 font-mono">Test dungeon & item algorithms</span>
                                </div>
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={() => {
                                    onNavigate('CelestialDemo');
                                    onClose();
                                }}
                                className="justify-start h-auto py-4 hover:border-yellow-500 hover:bg-yellow-950/30"
                            >
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-xs font-bold text-yellow-400">Power Ranks</span>
                                    <span className="text-[10px] text-slate-500 font-mono">View all rank tiers & animations</span>
                                </div>
                            </Button>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="p-4 bg-black/40 border-t border-white/5 text-center">
                    <p className="text-[10px] text-slate-600 font-mono">
                        DIRECTOR MODE ACTIVE // SYSTEM ID: ADMIN_OVERRIDE
                    </p>
                </div>
            </div>
        </div>
    );
};
