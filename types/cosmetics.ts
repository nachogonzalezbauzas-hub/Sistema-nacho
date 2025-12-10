import { AppState } from './state';
import { Title, AvatarFrame } from './items';

export interface TitleDefinition extends Title {
    condition: (state: AppState) => boolean;
    // Visual styling for display
    textStyle?: string;
    glowStyle?: string;
    cost?: number; // Optional cost for shop items
    sourceType?: string; // Specific acquisition source (e.g., 'daily', 'boss')
}

export interface FrameDefinition extends AvatarFrame {
    condition: (state: AppState) => boolean;
    // Visual styling for display
    borderStyle?: string;
    glowStyle?: string;
    animation?: string;
    cssClass?: string; // Visual Gene System class
    cost?: number; // Optional cost for shop items
    sourceType?: string; // Specific acquisition source
}
