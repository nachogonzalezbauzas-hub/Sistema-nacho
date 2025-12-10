import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    declare props: ErrorBoundaryProps;

    state: ErrorBoundaryState = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("SYSTEM CRITICAL FAILURE:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono">
                    {/* Background Glitch Effect */}
                    <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-10 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black pointer-events-none"></div>

                    <div className="relative z-10 max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">

                        {/* System Alert Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse">
                                <AlertTriangle size={48} className="text-red-500" />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h1 className="text-5xl font-black text-red-600 tracking-tighter uppercase italic drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                                SYSTEM FAILURE
                            </h1>
                            <p className="text-red-400/80 text-sm tracking-[0.2em] uppercase">
                                CRITICAL ERROR DETECTED
                            </p>
                        </div>

                        {/* Error Box */}
                        <div className="bg-red-950/30 border border-red-900/50 p-6 rounded-xl backdrop-blur-sm text-left relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                            <p className="text-red-200 font-bold mb-2 text-lg">Error Log:</p>
                            <code className="block text-red-400 text-xs break-words bg-black/50 p-3 rounded border border-red-900/30 font-mono">
                                {this.state.error?.toString() || "Unknown Error"}
                            </code>
                        </div>

                        {/* Actions */}
                        <button
                            onClick={this.handleReload}
                            className="group relative px-8 py-4 bg-red-600 hover:bg-red-500 text-black font-black uppercase tracking-widest text-lg rounded-lg transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center justify-center gap-3 mx-auto"
                        >
                            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                            <span>Reboot System</span>
                        </button>

                        <p className="text-xs text-gray-600 mt-8">
                            If this persists, contact the Administrator (Developer).
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

