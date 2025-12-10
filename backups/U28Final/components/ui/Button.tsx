import React from 'react';
import { motion } from 'framer-motion';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }> = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "px-5 py-3 rounded-lg font-bold tracking-widest uppercase text-xs transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group";

    const variants = {
        primary: "bg-blue-600 text-white border border-blue-400/50 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:border-blue-300",
        secondary: "bg-[#0a1020] text-blue-200 border border-blue-900/50 hover:bg-blue-900/20 hover:text-white hover:border-blue-500/50",
        danger: "bg-red-950/40 text-red-200 border border-red-900/60 hover:bg-red-900/60 hover:text-red-100 hover:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]",
        ghost: "bg-transparent text-slate-500 hover:text-blue-300 hover:bg-blue-500/5"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props as any}
        >
            {/* Glitch Overlay on Hover */}
            {variant === 'primary' && (
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-100 pointer-events-none mix-blend-overlay" />
            )}

            {/* Scanline */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_2px] pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity" />

            {children}
        </motion.button>
    );
};
