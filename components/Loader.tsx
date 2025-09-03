
import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex items-center space-x-2">
    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    <span className="text-sm text-slate-600">Thinking...</span>
  </div>
);
