import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface FloatingReward {
    id: string;
    type: 'xp' | 'shards';
    value: number;
}

interface FloatingRewardsProps {
    rewards: FloatingReward[];
    onComplete: () => void;
}

export const FloatingRewards: React.FC<FloatingRewardsProps> = ({ rewards, onComplete }) => {
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        if (rewards.length === 0) return;

        // Play sound
        const audio = new Audio('/audio/levelup.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => { });

        // Show animation
        setVisible(true);
        setExiting(false);

        const exitTimer = setTimeout(() => {
            setExiting(true);
        }, 2000);

        const completeTimer = setTimeout(() => {
            setVisible(false);
            onComplete();
        }, 2500);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(completeTimer);
        };
    }, [rewards, onComplete]);

    if (!visible || rewards.length === 0) return null;

    const xpReward = rewards.find(r => r.type === 'xp');
    const shardsReward = rewards.find(r => r.type === 'shards');

    return (
        <>
            <style>{`
                @keyframes floatIn {
                    0% { opacity: 0; transform: translateY(30px) scale(0.9); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes floatOut {
                    0% { opacity: 1; transform: translateY(0) scale(1); }
                    100% { opacity: 0; transform: translateY(-20px) scale(0.95); }
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.4); }
                    50% { box-shadow: 0 0 35px rgba(59,130,246,0.6); }
                }
                @keyframes pulse-glow-purple {
                    0%, 100% { box-shadow: 0 0 20px rgba(168,85,247,0.4); }
                    50% { box-shadow: 0 0 35px rgba(168,85,247,0.6); }
                }
            `}</style>

            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9998,
                display: 'flex',
                gap: '20px',
                pointerEvents: 'none'
            }}>
                {/* XP Card */}
                {xpReward && (
                    <div style={{
                        backgroundColor: '#0a0f1e',
                        border: '2px solid rgba(59, 130, 246, 0.6)',
                        borderRadius: '16px',
                        padding: '28px 48px',
                        textAlign: 'center',
                        minWidth: '160px',
                        animation: exiting ? 'floatOut 0.5s ease-out forwards' : 'floatIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, pulse-glow 2s ease-in-out infinite',
                        animationDelay: '0s'
                    }}>
                        <div style={{
                            color: '#60a5fa',
                            fontSize: '12px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            marginBottom: '8px'
                        }}>
                            XP
                        </div>
                        <div style={{
                            color: 'white',
                            fontSize: '42px',
                            fontWeight: 900,
                            fontFamily: 'monospace',
                            textShadow: '0 0 20px rgba(59,130,246,0.5)'
                        }}>
                            +{xpReward.value.toLocaleString()}
                        </div>
                    </div>
                )}

                {/* Shards Card */}
                {shardsReward && (
                    <div style={{
                        backgroundColor: '#0a0f1e',
                        border: '2px solid rgba(168, 85, 247, 0.6)',
                        borderRadius: '16px',
                        padding: '28px 48px',
                        textAlign: 'center',
                        minWidth: '160px',
                        animation: exiting ? 'floatOut 0.5s ease-out forwards' : 'floatIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, pulse-glow-purple 2s ease-in-out infinite',
                        animationDelay: xpReward ? '0.1s' : '0s'
                    }}>
                        <div style={{
                            color: '#a855f7',
                            fontSize: '12px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            marginBottom: '8px'
                        }}>
                            SHARDS
                        </div>
                        <div style={{
                            color: 'white',
                            fontSize: '42px',
                            fontWeight: 900,
                            fontFamily: 'monospace',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            textShadow: '0 0 20px rgba(168,85,247,0.5)'
                        }}>
                            <Sparkles size={28} color="#a855f7" />
                            +{shardsReward.value}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
