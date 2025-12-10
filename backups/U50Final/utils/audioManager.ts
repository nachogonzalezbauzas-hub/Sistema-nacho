// Audio Manager for Sistema Nacho
// Handles background music and sound effects

class AudioManager {
    private static instance: AudioManager;
    private backgroundMusic: HTMLAudioElement | null = null;
    private sfxCache: Map<string, HTMLAudioElement> = new Map();
    private isMusicEnabled: boolean = true;
    private isSfxEnabled: boolean = true;
    private musicVolume: number = 0.3;
    private sfxVolume: number = 0.5;

    private constructor() {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('audioSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.isMusicEnabled = settings.musicEnabled ?? true;
            this.isSfxEnabled = settings.sfxEnabled ?? true;
            this.musicVolume = settings.musicVolume ?? 0.3;
            this.sfxVolume = settings.sfxVolume ?? 0.5;
        }
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    // Save settings to localStorage
    private saveSettings(): void {
        localStorage.setItem('audioSettings', JSON.stringify({
            musicEnabled: this.isMusicEnabled,
            sfxEnabled: this.isSfxEnabled,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume
        }));
    }

    // Background Music
    public playMusic(src: string = '/audio/music/ambient_main.wav'): void {
        if (!this.isMusicEnabled) return;

        try {
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
            }

            this.backgroundMusic = new Audio(src);
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = this.musicVolume;

            // Handle autoplay restrictions
            const playPromise = this.backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    console.log('Audio autoplay blocked - waiting for user interaction');
                });
            }
        } catch (error) {
            console.warn('Failed to play music:', error);
        }
    }

    public stopMusic(): void {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }

    public pauseMusic(): void {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }

    public resumeMusic(): void {
        if (this.backgroundMusic && this.isMusicEnabled) {
            this.backgroundMusic.play().catch(() => { });
        }
    }

    // Sound Effects
    public playSFX(name: SFXName): void {
        if (!this.isSfxEnabled) return;

        const src = SFX_PATHS[name];
        if (!src) return;

        try {
            // Use cached audio or create new
            let audio = this.sfxCache.get(name);

            if (!audio) {
                audio = new Audio(src);
                this.sfxCache.set(name, audio);
            }

            audio.currentTime = 0;
            audio.volume = this.sfxVolume;
            audio.play().catch(() => {
                console.warn('Failed to play SFX:', name);
            });
        } catch (error) {
            console.warn('Failed to play SFX:', error);
        }
    }

    // Settings
    public setMusicEnabled(enabled: boolean): void {
        this.isMusicEnabled = enabled;
        if (!enabled) {
            this.stopMusic();
        }
        this.saveSettings();
    }

    public setSfxEnabled(enabled: boolean): void {
        this.isSfxEnabled = enabled;
        this.saveSettings();
    }

    public setMusicVolume(volume: number): void {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
        }
        this.saveSettings();
    }

    public setSfxVolume(volume: number): void {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }

    public getMusicEnabled(): boolean {
        return this.isMusicEnabled;
    }

    public getSfxEnabled(): boolean {
        return this.isSfxEnabled;
    }

    public getMusicVolume(): number {
        return this.musicVolume;
    }

    public getSfxVolume(): number {
        return this.sfxVolume;
    }
}

// SFX Types and Paths
export type SFXName =
    | 'mission_complete'
    | 'level_up'
    | 'loot_drop'
    | 'dungeon_enter'
    | 'dungeon_victory'
    | 'shadow_arise'
    | 'magic_arise'
    | 'inventory_touch'
    | 'click'
    | 'notification'
    | 'hammer_hit'
    | 'glitch';

const SFX_PATHS: Record<SFXName, string> = {
    mission_complete: '/audio/sfx/mission_complete.wav',
    level_up: '/audio/sfx/level_up_epic.ogg',
    loot_drop: '/audio/sfx/chest_open.wav',
    dungeon_enter: '/audio/sfx/shadow_arise.mp3',
    dungeon_victory: '/audio/sfx/chest_open.wav',
    shadow_arise: '/audio/sfx/magic_arise.wav',
    magic_arise: '/audio/sfx/magic_arise.wav',
    inventory_touch: '/audio/sfx/inventory_touch.wav',
    click: '/audio/sfx/inventory_touch.wav',
    notification: '/audio/sfx/chest_open.wav',
    hammer_hit: '/audio/sfx/176664__jorickhoofd__hitting-an-anvil-1.wav',
    glitch: '/audio/sfx/glitch-screen.mp3'
};

// Export singleton instance
export const audioManager = AudioManager.getInstance();

// Convenience functions
export const playMusic = () => audioManager.playMusic();
export const stopMusic = () => audioManager.stopMusic();
export const pauseMusic = () => audioManager.pauseMusic();
export const resumeMusic = () => audioManager.resumeMusic();
export const playSFX = (name: SFXName) => audioManager.playSFX(name);
