import React, { useState, useEffect } from 'react';
import { auth, googleProvider, db } from '@/lib/firebase';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components';
import { Cloud, Save, Download, LogOut, Loader2, Check, AlertCircle } from 'lucide-react';

export const CloudSave: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'saving' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u);
            if (u) checkLastSaved(u.uid);
        });
        return () => unsubscribe();
    }, []);

    const checkLastSaved = async (uid: string) => {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.lastUpdated) {
                    setLastSaved(new Date(data.lastUpdated).toLocaleString());
                }
            }
        } catch (error) {
            console.error("Error checking last save:", error);
        }
    };

    const handleLogin = async () => {
        try {
            setLoading(true);
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            console.error("Login failed:", error);
            setStatus('error');
            setMessage(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setLastSaved(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleSaveToCloud = async () => {
        if (!user) return;
        setStatus('saving');
        try {
            const data = localStorage.getItem('sistema_nacho_data');
            if (!data) throw new Error("No local data found");

            // Parse to ensure validity
            const parsed = JSON.parse(data);

            // Unify with FirebaseService: Save 'state' at root
            await setDoc(doc(db, 'users', user.uid), {
                state: parsed.state, // Save the inner state object directly
                gameData: parsed, // Keep legacy field for backup/safety
                lastUpdated: new Date().toISOString(),
                email: user.email,
                displayName: user.displayName
            }, { merge: true });

            setLastSaved(new Date().toLocaleString());
            setStatus('success');
            setMessage('Saved to Cloud!');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error: any) {
            console.error("Save failed:", error);
            setStatus('error');
            setMessage(error.message || 'Save failed');
        }
    };

    const handleLoadFromCloud = async () => {
        if (!user) return;
        if (!confirm("WARNING: This will overwrite your current local progress with the cloud data. Are you sure?")) return;

        setStatus('loading');
        try {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                // Try to find state in 'state' (new/auto) or 'gameData' (old manual)
                let stateToLoad = data.state;

                if (!stateToLoad && data.gameData && data.gameData.state) {
                    stateToLoad = data.gameData.state;
                }

                if (stateToLoad) {
                    // Reconstruct localStorage format: { state: ... }
                    const storageData = { state: stateToLoad };
                    localStorage.setItem('sistema_nacho_data', JSON.stringify(storageData));

                    setStatus('success');
                    setMessage('Data loaded! Reloading...');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    throw new Error("No valid game data found in cloud");
                }
            } else {
                throw new Error("No cloud save found");
            }
        } catch (error: any) {
            console.error("Load failed:", error);
            setStatus('error');
            setMessage(error.message || 'Load failed');
        }
    };

    if (loading) {
        return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;
    }

    if (!user) {
        return (
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Cloud className="text-blue-400" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Cloud Save</h3>
                        <p className="text-xs text-slate-400">Sign in to sync your progress</p>
                    </div>
                </div>
                <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Sign in with Google
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 bg-slate-900/50 rounded-xl border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full border border-slate-600" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {user.displayName?.[0] || 'U'}
                        </div>
                    )}
                    <div>
                        <h3 className="font-bold text-white text-sm">{user.displayName}</h3>
                        <p className="text-[10px] text-slate-400">{user.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors">
                    <LogOut size={16} />
                </button>
            </div>

            {lastSaved && (
                <div className="mb-4 text-xs text-center text-slate-500 font-mono bg-black/20 py-1 rounded">
                    Last Cloud Save: {lastSaved}
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <Button
                    onClick={handleSaveToCloud}
                    disabled={status === 'saving'}
                    className={`flex flex-col gap-1 h-auto py-3 ${status === 'success' ? 'bg-green-600/20 border-green-500/50' : 'bg-blue-600/20 border-blue-500/50 hover:bg-blue-600/30'}`}
                >
                    {status === 'saving' ? <Loader2 className="animate-spin" size={18} /> : status === 'success' ? <Check className="text-green-400" size={18} /> : <Save className="text-blue-400" size={18} />}
                    <span className="text-xs font-bold text-blue-100">Save to Cloud</span>
                </Button>

                <Button
                    onClick={handleLoadFromCloud}
                    disabled={status === 'loading'}
                    className="flex flex-col gap-1 h-auto py-3 bg-purple-600/20 border-purple-500/50 hover:bg-purple-600/30"
                >
                    {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : <Download className="text-purple-400" size={18} />}
                    <span className="text-xs font-bold text-purple-100">Load Data</span>
                </Button>
            </div>

            {status === 'error' && (
                <div className="mt-3 text-xs text-red-400 flex items-center justify-center gap-1">
                    <AlertCircle size={12} /> {message}
                </div>
            )}
            {status === 'success' && (
                <div className="mt-3 text-xs text-green-400 flex items-center justify-center gap-1">
                    <Check size={12} /> {message}
                </div>
            )}
        </div>
    );
};
