import React from 'react';
import { Tab } from './MainLayout';

interface VoiceCommanderProps {
    onNavigate: (tab: Tab) => void;
    onAddMission: () => void;
}

export const VoiceCommander: React.FC<VoiceCommanderProps> = ({ onNavigate, onAddMission }) => {
    // Placeholder implementation to fix build error
    return null;
};
