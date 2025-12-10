import React from 'react';
import ReactDOM from 'react-dom';

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000]/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0a1020] border border-blue-500 rounded-xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-300 shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-5 border-b border-blue-900/40 bg-blue-950/10">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                        <h2 className="text-sm font-black text-blue-100 tracking-[0.2em] uppercase drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">{title}</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-blue-400 transition-colors p-1 hover:bg-blue-900/20 rounded">✕</button>
                </div>

                <div className="p-6 relative">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, .3) 25%, rgba(59, 130, 246, .3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .3) 75%, rgba(59, 130, 246, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, .3) 25%, rgba(59, 130, 246, .3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .3) 75%, rgba(59, 130, 246, .3) 76%, transparent 77%, transparent)',
                            backgroundSize: '20px 20px'
                        }}
                    ></div>
                    <div className="relative z-10">{children}</div>
                </div>
            </div>
        </div>,
        document.body
    );
};
