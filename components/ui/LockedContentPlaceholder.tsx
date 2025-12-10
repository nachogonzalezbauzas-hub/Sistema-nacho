import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Smartphone, ShieldAlert } from 'lucide-react';

export const LockedContentPlaceholder: React.FC = () => {
    return (
        <div className="relative w-full py-16 px-4 mt-8 overflow-hidden rounded-2xl bg-[#030712] border border-white/5 group">

            {/* Background Grid & Noise */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

            {/* Scanning Line Animation */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)] z-0"
                animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6">

                {/* Cyber Lock Icon */}
                <div className="relative">
                    <motion.div
                        animate={{
                            boxShadow: ['0 0 0px rgba(59,130,246,0)', '0 0 30px rgba(59,130,246,0.15)', '0 0 0px rgba(59,130,246,0)']
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-20 h-20 rounded-2xl bg-[#0B1221] border border-blue-900/30 flex items-center justify-center relative overflow-hidden"
                    >
                        <Lock size={32} className="text-slate-600 relative z-10" strokeWidth={1.5} />

                        {/* Glitch Overlay within box */}
                        <motion.div
                            className="absolute inset-0 bg-blue-500/10"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                    </motion.div>
                </div>

                {/* Text Content */}
                <div className="space-y-2 max-w-sm">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-800" />
                        Access Denied
                        <span className="w-2 h-2 rounded-full bg-slate-800" />
                    </h3>
                    <p className="text-xs text-slate-600 font-mono leading-relaxed">
                        Higher tiers of existence remain beyond your reach.<br />
                        <span className="text-blue-900/60">Ascend the tower to unlock.</span>
                    </p>
                </div>
            </div>
        </div>
    );
};
