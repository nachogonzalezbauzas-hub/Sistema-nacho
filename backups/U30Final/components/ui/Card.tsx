import React from 'react';
import { motion } from 'framer-motion';

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2, boxShadow: "0 0 30px rgba(37,99,235,0.15)" }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
        className={`
      bg-[#050a14]/60 backdrop-blur-md border border-blue-500/20 rounded-xl p-5
      shadow-[0_0_20px_rgba(0,0,0,0.3)]
      transition-all duration-300 ease-out hover:border-blue-400/40 hover:bg-[#0a1020]/80
      relative overflow-hidden group
      ${className}
    `}
    >
        {/* Holographic Grid Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
                backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, .3) 25%, rgba(59, 130, 246, .3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .3) 75%, rgba(59, 130, 246, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, .3) 25%, rgba(59, 130, 246, .3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .3) 75%, rgba(59, 130, 246, .3) 76%, transparent 77%, transparent)',
                backgroundSize: '30px 30px'
            }}
        ></div>

        {/* Corner Accents */}


        <div className="relative z-10">{children}</div>
    </motion.div>
);
