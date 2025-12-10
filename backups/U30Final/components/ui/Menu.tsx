import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const HamburgerMenu: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    items: { id: string; label: string; icon: React.ReactNode; onClick: () => void }[]
}> = ({ isOpen, onClose, items }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-64 bg-[#030712] border-l border-blue-900/50 z-[51] shadow-[-10px_0_30px_rgba(0,0,0,0.8)]"
                    >
                        <div className="p-6 border-b border-blue-900/20 flex justify-between items-center">
                            <h2 className="text-lg font-black text-white italic tracking-wider">SYSTEM MENU</h2>
                            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-4 flex flex-col gap-2">
                            {items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { item.onClick(); onClose(); }}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-900/20 text-slate-400 hover:text-blue-400 transition-all group"
                                >
                                    <div className="group-hover:scale-110 transition-transform text-blue-600 group-hover:text-blue-400">
                                        {item.icon}
                                    </div>
                                    <span className="font-bold uppercase tracking-widest text-xs">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-blue-900/20">
                            <div className="text-[10px] text-slate-600 font-mono text-center">
                                SYSTEM VERSION 1.18.0<br />
                                PLAYER ID: #001
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
