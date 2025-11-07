import React, { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '../ui/Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = '메시지를 입력하세요...',
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage);
      setMessage('');

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500
                     disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
                     transition-colors"
          style={{ maxHeight: '200px' }}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          variant="primary"
          size="md"
        >
          전송
        </Button>
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Enter로 전송, Shift+Enter로 줄바꿈
      </div>
    </div>
  );
};
