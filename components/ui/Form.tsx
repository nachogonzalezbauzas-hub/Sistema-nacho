import React from 'react';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <div className="relative group">
        <input
            className="w-full bg-[#03050a]/80 border border-blue-900/30 rounded-lg px-4 py-3 text-blue-50 placeholder-slate-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#050a14] focus:shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all duration-300 font-mono text-sm"
            {...props}
        />
        <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-blue-500 transition-all duration-300 group-focus-within:w-full shadow-[0_0_10px_#3b82f6]"></div>
    </div>
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <div className="relative group">
        <textarea
            className="w-full bg-[#03050a]/80 border border-blue-900/30 rounded-lg px-4 py-3 text-blue-50 placeholder-slate-700 focus:outline-none focus:border-blue-500/60 focus:bg-[#050a14] focus:shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all duration-300 font-mono text-sm resize-none"
            {...props}
        />
        <div className="absolute bottom-1 left-0 h-[1px] w-0 bg-blue-500 transition-all duration-300 group-focus-within:w-full shadow-[0_0_10px_#3b82f6]"></div>
    </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <div className="relative group">
        <select className="w-full bg-[#03050a]/80 border border-blue-900/30 rounded-lg px-4 py-3 text-blue-50 appearance-none focus:outline-none focus:border-blue-500/60 focus:shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all duration-300 cursor-pointer font-mono text-sm" {...props}>{props.children}</select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500/50 group-hover:text-blue-400 transition-colors">▼</div>
    </div>
);
