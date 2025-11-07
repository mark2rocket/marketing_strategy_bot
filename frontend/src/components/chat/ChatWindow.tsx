import React, { useEffect, useRef } from 'react';
import { ChatMessage, ChatMessageData } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Card } from '../ui/Card';

interface ChatWindowProps {
  messages: ChatMessageData[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  sessionTitle?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
  sessionTitle = '전략 수립',
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {sessionTitle}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          AI와 대화하며 마케팅 전략을 수립하세요
        </p>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 px-6 py-4"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Card className="max-w-md p-6 text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                전략 수립을 시작해보세요
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                마케팅 전략에 대해 자유롭게 이야기해보세요.
                <br />
                AI가 목표, 액션 아이템, KPI를 함께 정리해드립니다.
              </p>
            </Card>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={onSendMessage}
        disabled={isLoading}
        placeholder="마케팅 전략에 대해 이야기해보세요..."
      />
    </div>
  );
};
