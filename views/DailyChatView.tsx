import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import { Mic, MicOff, Send, User, Cpu } from 'lucide-react';
import { t } from '@/data/translations';

export const DailyChatView: React.FC = () => {
    const { state, addChatMessage } = useStore();
    const [isListening, setIsListening] = useState(false);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [state.chatHistory]);

    const handleSend = (text: string) => {
        if (!text.trim()) return;

        addChatMessage(text, 'user');
        setInputText('');

        // Try to parse calendar event
        const scheduleResponse = parseAndScheduleEvent(text);

        // System Response Logic
        setTimeout(() => {
            if (scheduleResponse) {
                addChatMessage(scheduleResponse, 'system');
            } else {
                const responses = [
                    "Entry logged. Your progress is noted.",
                    "Analyzing data... Efficiency within expected parameters.",
                    "Acknowledged. Continue your growth, Hunter.",
                    "System update: Motivation levels detected.",
                    "Recording added to the System Database."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addChatMessage(randomResponse, 'system');
            }
        }, 1000);
    };

    const parseAndScheduleEvent = (text: string): string | null => {
        const lowerText = text.toLowerCase();
        const now = new Date();
        let targetDate = new Date();
        let eventTitle = text;
        let isEvent = false;

        // Helper to parse months
        const monthsEs = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const monthsEn = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        const monthsShortEn = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

        // Regex for specific dates: "8 de enero", "january 8", "8 jan"
        // Matches: "8 de enero", "8 enero", "8th january", "jan 8"
        const specificDateMatch = lowerText.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(?:de\s+)?([a-z]+)/) || lowerText.match(/([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?/);

        if (specificDateMatch) {
            // Check if the captured string is a valid month
            const part1 = specificDateMatch[1]; // Could be day or month
            const part2 = specificDateMatch[2]; // Could be month or day

            let day: number | null = null;
            let monthIndex: number | null = null;

            // Case 1: "8 de enero" -> part1=8, part2=enero
            if (!isNaN(parseInt(part1))) {
                day = parseInt(part1);
                const mStr = part2;
                monthIndex = monthsEs.indexOf(mStr);
                if (monthIndex === -1) monthIndex = monthsEn.indexOf(mStr);
                if (monthIndex === -1) monthIndex = monthsShortEn.indexOf(mStr);
            }
            // Case 2: "january 8" -> part1=january, part2=8
            else if (!isNaN(parseInt(part2))) {
                day = parseInt(part2);
                const mStr = part1;
                monthIndex = monthsEs.indexOf(mStr);
                if (monthIndex === -1) monthIndex = monthsEn.indexOf(mStr);
                if (monthIndex === -1) monthIndex = monthsShortEn.indexOf(mStr);
            }

            if (day !== null && monthIndex !== -1 && monthIndex !== null) {
                targetDate.setMonth(monthIndex);
                targetDate.setDate(day);

                // Handle year rollover (if date is in the past, assume next year)
                if (targetDate < now && targetDate.toDateString() !== now.toDateString()) {
                    targetDate.setFullYear(now.getFullYear() + 1);
                }

                isEvent = true;
                eventTitle = text.replace(specificDateMatch[0], '').trim();
            }
        }

        // Relative dates (tomorrow, today) - Only if specific date wasn't found
        if (!isEvent) {
            if (lowerText.includes('tomorrow') || lowerText.includes('mañana')) {
                targetDate.setDate(now.getDate() + 1);
                isEvent = true;
                eventTitle = text.replace(/tomorrow|mañana/gi, '').trim();
            } else if (lowerText.includes('today') || lowerText.includes('hoy')) {
                isEvent = true;
                eventTitle = text.replace(/today|hoy/gi, '').trim();
            }
        }

        // Time parsing (English: "at 10am", Spanish: "a las 10")
        // Matches: "at 10:30am", "a las 10:30", "at 10", "a las 10"
        const timeMatch = lowerText.match(/(?:at|a las)\s+(\d{1,2})(:(\d{2}))?\s*(am|pm)?/);

        if (timeMatch && isEvent) {
            let hours = parseInt(timeMatch[1]);
            const minutes = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
            const period = timeMatch[4];

            // Handle AM/PM if present
            if (period === 'pm' && hours < 12) hours += 12;
            if (period === 'am' && hours === 12) hours = 0;

            // Heuristic for Spanish/24h without AM/PM (e.g. "a las 6" -> likely 18:00 if it's currently morning? Or just assume 24h?)
            // For now, let's assume if no AM/PM is given, it's 24h format OR if it's small number (1-11) and "a las", maybe default to PM for typical events? 
            // Let's stick to 24h or explicit AM/PM for simplicity first, but "a las 5" usually means 5:00. 
            // Let's just parse the number as is. Users can say "17" for 5pm.

            targetDate.setHours(hours, minutes, 0, 0);

            // Clean up title
            eventTitle = eventTitle.replace(timeMatch[0], '').trim();
            // Clean up any remaining "el" or "on"
            eventTitle = eventTitle.replace(/\b(el|on)\b/gi, '').trim();

            // Add event to store
            const { addUserEvent } = useStore.getState();
            addUserEvent({
                title: eventTitle || 'Evento Programado',
                date: targetDate.toISOString()
            });

            const dateStr = targetDate.toLocaleDateString(state.settings.language === 'es' ? 'es-ES' : 'en-US');
            const timeStr = targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return state.settings.language === 'es'
                ? `Evento programado: "${eventTitle}" para el ${dateStr} a las ${timeStr}.`
                : `Event scheduled: "${eventTitle}" for ${dateStr} at ${timeStr}.`;
        }

        return null;
    };

    const toggleMic = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            if (!('webkitSpeechRecognition' in window)) {
                alert('Voice recognition not supported in this browser.');
                return;
            }
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.lang = state.settings.language === 'es' ? 'es-ES' : 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);

            recognition.onresult = (event: any) => {
                const text = event.results[0][0].transcript;
                handleSend(text);
            };

            recognition.start();
            recognitionRef.current = recognition;
        }
    };

    return (
        <div className="h-[calc(100dvh-160px)] flex flex-col animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 p-2 border-b border-blue-900/30">
                <div className="w-10 h-10 rounded-full bg-blue-900/20 flex items-center justify-center border border-blue-500/30">
                    <Cpu size={20} className="text-blue-400 animate-pulse" />
                </div>
                <div>
                    <h2 className="text-lg font-black text-white italic tracking-wider">SYSTEM COMM LINK</h2>
                    <p className="text-[10px] text-blue-400/60 font-mono uppercase">Direct Line to System Administrator</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-4 scrollbar-hide">
                {state.chatHistory?.length === 0 && (
                    <div className="text-center text-slate-600 text-xs font-mono mt-10">
                        <p>No records found.</p>
                        <p>Initiate communication to log your status.</p>
                    </div>
                )}

                {state.chatHistory?.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
                            max-w-[80%] p-3 rounded-2xl text-sm relative
                            ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                            }
                        `}>
                            <p>{msg.text}</p>
                            <span className="text-[9px] opacity-50 block mt-1 text-right font-mono">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-2 p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/5 mb-20 md:mb-0">
                <button
                    onClick={toggleMic}
                    className={`
                        p-3 rounded-xl transition-all duration-300
                        ${isListening
                            ? 'bg-red-500/20 text-red-500 animate-pulse border border-red-500/50'
                            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                        }
                    `}
                >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
                    placeholder="Log your status..."
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-600 font-mono text-sm"
                />

                <button
                    onClick={() => handleSend(inputText)}
                    className="p-3 text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};
