
import React from 'react';
import { Message, Role } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.User;
  
  const bubbleClasses = isUser
    ? 'bg-teal-500 text-white self-end'
    : 'bg-slate-200 text-slate-800 self-start';
  
  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';

  return (
    <div className={containerClasses}>
      <div className={`rounded-xl p-3 max-w-lg shadow ${bubbleClasses}`}>
        {message.imageUrl && (
            <img src={message.imageUrl} alt="User upload" className="rounded-lg mb-2 max-h-60" />
        )}
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};
