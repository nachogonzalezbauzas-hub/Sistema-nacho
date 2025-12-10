import { auth, db } from '@/lib/firebase';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AppState } from '@/types';

const COLLECTION_NAME = 'users';

export const FirebaseService = {
    /**
     * Initialize auth and return the current user (or sign in anonymously)
     */
    initAuth: (): Promise<User> => {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                if (user) {
                    resolve(user);
                } else {
                    signInAnonymously(auth)
                        .then((cred) => resolve(cred.user))
                        .catch(reject);
                }
            });
        });
    },

    /**
     * Save the application state to Firestore
     */
    saveState: async (userId: string, state: AppState) => {
        try {
            const userRef = doc(db, COLLECTION_NAME, userId);
            // We only save the 'state' field to match the structure
            await setDoc(userRef, { state, lastUpdated: new Date() }, { merge: true });
            console.log('Saved to Firebase');
        } catch (error) {
            console.error('Error saving to Firebase:', error);
        }
    },

    /**
     * Load the application state from Firestore
     */
    loadState: async (userId: string): Promise<AppState | null> => {
        try {
            const userRef = doc(db, COLLECTION_NAME, userId);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return data.state as AppState;
            }
            return null;
        } catch (error) {
            console.error('Error loading from Firebase:', error);
            return null;
        }
    }
};
