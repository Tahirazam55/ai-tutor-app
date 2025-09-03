import React from 'react';
import { Conversation } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ChatHistoryProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) => {
  return (
    <div className="w-64 bg-slate-800 text-white flex flex-col h-screen flex-shrink-0">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold">Ilm-Companion</h2>
        <p className="text-sm text-slate-400">علم کمپینین</p>
      </div>
      <div className="p-2">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition"
          aria-label="Start a new chat"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Chat</span>
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">History</p>
        <ul>
          {conversations.map((convo) => (
            <li key={convo.id} className="my-1">
              <div
                role="button"
                tabIndex={0}
                aria-label={`Select conversation: ${convo.title}`}
                onKeyDown={(e) => e.key === 'Enter' && onSelectConversation(convo.id)}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition group ${
                  convo.id === activeConversationId
                    ? 'bg-teal-700'
                    : 'hover:bg-slate-700'
                }`}
                onClick={() => onSelectConversation(convo.id)}
              >
                <span className="truncate flex-1 pr-2 text-sm">{convo.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onDeleteConversation(convo.id);
                  }}
                  className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0"
                  aria-label={`Delete conversation: ${convo.title}`}
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
