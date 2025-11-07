import React from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageRole } from '../../types';

export interface ChatMessageData {
  id: string;
  content: string;
  role: MessageRole;
  createdAt: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <MessageBubble
      content={message.content}
      role={message.role}
      timestamp={new Date(message.createdAt)}
    />
  );
};
