import React from 'react';
import { VectorMedalLevel100 } from '@/components/achievements/VectorMedalLevel100';

export const VectorMedalDemo = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-8 gap-8">
            <h1 className="text-3xl font-bold text-white mb-4">Vector Medal Demo (SVG)</h1>

            <div className="flex gap-8 items-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="text-slate-400 text-sm">Small (64px)</div>
                    <VectorMedalLevel100 size={64} />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="text-slate-400 text-sm">Medium (128px)</div>
                    <VectorMedalLevel100 size={128} />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="text-slate-400 text-sm">Large (256px)</div>
                    <VectorMedalLevel100 size={256} />
                </div>
            </div>

            <div className="mt-8 p-6 bg-slate-900 rounded-xl border border-slate-800 max-w-md text-center">
                <h2 className="text-xl font-bold text-white mb-2">Ventajas del Vector (SVG)</h2>
                <ul className="text-left text-slate-300 text-sm space-y-2 list-disc pl-4">
                    <li>Escala infinita sin pixelarse</li>
                    <li>Peso minúsculo (kb vs mb)</li>
                    <li>Animable con CSS/Framer Motion</li>
                    <li>Colores modificables por código (temas)</li>
                </ul>
            </div>
        </div>
    );
};
