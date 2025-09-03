// Fix: Removed unused import for 'fileToBase64' from '../services/geminiService' as it is not an exported member and is not used in this component.
import React, { useState, useRef } from 'react';
import { PROMPT_EXPLAIN_IMAGE } from '../constants';
import { Language } from '../types';

interface ImageInputProps {
  onSend: (text: string, imageUrl: string) => void;
  isLoading: boolean;
  language: Language;
}

export const ImageInput: React.FC<ImageInputProps> = ({ onSend, isLoading, language }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSend = async () => {
    if (file && !isLoading) {
      // Fix: Use the current application language for the image prompt instead of hardcoding English.
      onSend(PROMPT_EXPLAIN_IMAGE[language], preview!);
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col items-center space-y-3">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      {!preview && (
         <button onClick={triggerFileSelect} className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:bg-slate-100 hover:border-teal-400 transition">
             Click to select an image
         </button>
      )}
      {preview && (
        <div className="w-full p-2 border border-slate-300 rounded-lg">
          <img src={preview} alt="Problem preview" className="max-h-40 w-auto mx-auto rounded-md" />
        </div>
      )}
      <button
        onClick={handleSend}
        disabled={isLoading || !file}
        className="w-full bg-teal-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Analyzing...' : 'Explain this Problem'}
      </button>
    </div>
  );
};
