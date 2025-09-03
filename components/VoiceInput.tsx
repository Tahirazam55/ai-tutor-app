import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { MicIcon } from './icons/MicIcon';

interface VoiceInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  language: Language;
}

// Fix: Use `(window as any)` to access non-standard browser APIs `SpeechRecognition` and `webkitSpeechRecognition`
// to avoid TypeScript errors for properties that are not part of the standard `Window` type.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

export const VoiceInput: React.FC<VoiceInputProps> = ({ onSend, isLoading, language }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === Language.Urdu ? 'ur-PK' : 'en-US';

    // Fix: The `SpeechRecognitionEvent` type is not standard in TypeScript's DOM library.
    // Using `any` is a pragmatic way to handle this without adding full type definitions for a browser-specific API.
    const handleResult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(prev => prev + finalTranscript);
    };

    recognition.addEventListener('result', handleResult);
    
    return () => {
      recognition.removeEventListener('result', handleResult);
      recognition.stop();
    };
  }, [language]);

  const toggleListening = () => {
    if (!recognition) {
        alert("Sorry, your browser doesn't support voice recognition.");
        return;
    }
    if (isListening) {
      recognition.stop();
      if(transcript.trim()) {
        onSend(transcript);
        setTranscript('');
      }
    } else {
      setTranscript('');
      recognition.start();
    }
    setIsListening(!isListening);
  };
  
  if (!recognition) {
    return <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">Voice input is not supported by your browser.</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-3">
        <p className="text-sm text-slate-500 h-6">{isListening ? 'Listening...' : 'Press the button and speak'}</p>
        <button
            onClick={toggleListening}
            disabled={isLoading}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
                ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-600 text-white'}
                disabled:bg-slate-400 disabled:cursor-not-allowed`}
        >
            <MicIcon className="w-8 h-8" />
        </button>
        {transcript && <p className="text-center text-slate-700 p-2 bg-slate-100 rounded-md">"{transcript}"</p>}
    </div>
  );
};