
import React from 'react';
import { InputMode } from '../types';
import { TextIcon } from './icons/TextIcon';
import { CameraIcon } from './icons/CameraIcon';
import { MicIcon } from './icons/MicIcon';

interface ModeSelectorProps {
  selectedMode: InputMode;
  onSelectMode: (mode: InputMode) => void;
}

const ModeButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const baseClasses = "flex-1 flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ease-in-out transform";
  const activeClasses = "bg-teal-500 text-white shadow-lg scale-105";
  const inactiveClasses = "bg-slate-200 text-slate-600 hover:bg-slate-300";

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {icon}
      <span className="mt-1 text-xs font-semibold">{label}</span>
    </button>
  );
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onSelectMode }) => {
  return (
    <div className="flex space-x-3 w-full">
      <ModeButton 
        label="Type Question"
        icon={<TextIcon />}
        isActive={selectedMode === InputMode.Text}
        onClick={() => onSelectMode(InputMode.Text)}
      />
      <ModeButton 
        label="Snap Problem"
        icon={<CameraIcon />}
        isActive={selectedMode === InputMode.Image}
        onClick={() => onSelectMode(InputMode.Image)}
      />
      <ModeButton 
        label="Ask Voice"
        icon={<MicIcon />}
        isActive={selectedMode === InputMode.Voice}
        onClick={() => onSelectMode(InputMode.Voice)}
      />
    </div>
  );
};
