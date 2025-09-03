import React from 'react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const toggleLanguage = () => {
    setLanguage(language === Language.English ? Language.Urdu : Language.English);
  };

  return (
    <div className="bg-slate-50 border-b border-slate-200 text-slate-800 p-4 flex justify-end items-center">
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-medium ${language === Language.English ? 'text-slate-900' : 'text-slate-500'}`}>English</span>
        <button
          onClick={toggleLanguage}
          className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-slate-300"
          aria-label="Toggle language"
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow-sm ${
              language === Language.Urdu ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${language === Language.Urdu ? 'text-slate-900' : 'text-slate-500'}`}>اردو</span>
      </div>
    </div>
  );
};