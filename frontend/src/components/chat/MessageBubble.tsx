import React from 'react';
import { MessageRole } from '../../types';

interface MessageBubbleProps {
  content: string;
  role: MessageRole;
  timestamp: Date;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  role,
  timestamp,
}) => {
  const isUser = role === 'USER';
  const isSystem = role === 'SYSTEM';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-primary-600 text-white'
            : isSystem
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 italic'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{content}</div>
        <div
          className={`text-xs mt-2 ${
            isUser
              ? 'text-primary-100'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {new Date(timestamp).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};
