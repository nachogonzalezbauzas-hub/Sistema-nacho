import React from 'react';
import { motion } from 'framer-motion';
import { Title } from '../../types';
import { rarityStyles } from '../ui/Titles';
import { Crown, Zap } from 'lucide-react';

interface ActiveTitleProps {
    equippedTitle?: Title;
    totalPower: number;
}

export const ActiveTitle: React.FC<ActiveTitleProps> = ({ equippedTitle, totalPower }) => {
    return (
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            {/* Title Module */}
            <div className={`relative group flex items-center gap-3 px-4 py-2 rounded-sm backdrop-blur-sm transition-all duration-500 overflow-hidden border ${equippedTitle ? '' : 'bg-blue-950/30 border-blue-500/30 hover:bg-blue-900/40'}`}
                style={equippedTitle ? {
                    borderColor: rarityStyles[equippedTitle.rarity].borderColor.replace('border-', ''),
                } : {}}>

                {equippedTitle && (
                    <>
                        {/* Dynamic Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${rarityStyles[equippedTitle.rarity].bgGradient} opacity-50 group-hover:opacity-80 transition-opacity`}></div>

                        {/* Glow Effect for High Rarity */}
                        {['epic', 'legendary', 'mythic', 'godlike'].includes(equippedTitle.rarity) && (
                            <div className="absolute inset-0 blur-xl opacity-30 animate-pulse" style={{ backgroundColor: rarityStyles[equippedTitle.rarity].labelColor.replace('text-', '') }}></div>
                        )}
                    </>
                )}

                <Crown size={16} className={`relative z-10 ${equippedTitle ? rarityStyles[equippedTitle.rarity].labelColor : 'text-yellow-400'} animate-[bounce_3s_infinite]`} />
                <div className="relative z-10 w-[150px] flex flex-col items-center">
                    <div className={`text-[9px] uppercase tracking-wider font-bold text-center w-full ${equippedTitle ? rarityStyles[equippedTitle.rarity].labelColor : 'text-blue-400'}`}>Active Title</div>

                    {/* Scrolling Text Logic */}
                    <div className="relative w-full h-6 flex items-center overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' }}>
                        {(() => {
                            const [shouldScroll, setShouldScroll] = React.useState(false);
                            const [scrollDistance, setScrollDistance] = React.useState(0);
                            const containerRef = React.useRef<HTMLDivElement>(null);
                            const textRef = React.useRef<HTMLDivElement>(null);

                            React.useLayoutEffect(() => {
                                const checkScroll = () => {
                                    if (containerRef.current && textRef.current) {
                                        const container = containerRef.current.offsetWidth;
                                        const content = textRef.current.scrollWidth;
                                        // Force scroll if content is larger than container
                                        if (content > container) {
                                            setShouldScroll(true);
                                            setScrollDistance(container - content - 10); // Buffer for padding
                                        } else {
                                            setShouldScroll(false);
                                            setScrollDistance(0);
                                        }
                                    }
                                };

                                // Initial check
                                checkScroll();

                                // Re-check on resize
                                window.addEventListener('resize', checkScroll);
                                return () => window.removeEventListener('resize', checkScroll);
                            }, [equippedTitle?.name]);

                            return (
                                <div ref={containerRef} className={`w-full flex items-center ${shouldScroll ? '' : 'justify-center'}`}>
                                    <motion.div
                                        key={equippedTitle?.name} // Force re-mount on title change
                                        ref={textRef}
                                        className={`text-xs font-bold uppercase tracking-widest whitespace-nowrap ${equippedTitle ? rarityStyles[equippedTitle.rarity].textColor : 'text-slate-400'}`}
                                        style={equippedTitle ? { textShadow: '0 0 10px currentColor', paddingLeft: '4px', paddingRight: '4px' } : {}}
                                        animate={shouldScroll ? { x: [0, scrollDistance, scrollDistance, 0] } : { x: 0 }}
                                        transition={shouldScroll ? {
                                            duration: Math.max(5, Math.abs(scrollDistance) * 0.1), // Slower duration
                                            times: [0, 0.4, 0.6, 1], // Longer hold at ends (20% hold)
                                            repeat: Infinity,
                                            repeatDelay: 2,
                                            ease: "easeInOut"
                                        } : {}}
                                    >
                                        {equippedTitle?.name || 'None Equipped'}
                                    </motion.div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* Power Module */}
            <div className="flex items-center gap-3 bg-blue-950/30 border border-blue-500/30 px-4 py-2 rounded-sm backdrop-blur-sm hover:bg-blue-900/40 transition-colors">
                <Zap size={16} className="text-cyan-400 animate-pulse" />
                <div>
                    <div className="text-[9px] text-blue-400 uppercase tracking-wider font-bold">Total Power</div>
                    <div className="text-sm font-black text-white font-mono tracking-wider drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
                        {totalPower.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
};
